import { createHash, randomUUID } from "node:crypto";

import type { Database } from "@blobz/db";
import {
	apiCheckoutIntent,
	apiEndpoint,
	apiEntitlement,
	apiUsagePeriod,
	dodoWebhookEvent,
} from "@blobz/db/schema/api";
import { user } from "@blobz/db/schema/auth";
import { and, eq, sql } from "drizzle-orm";

import {
	type BillingCadence,
	type DodoProductConfig,
	getUsageWindow,
	planForProduct,
} from "./api-platform";

type RecordValue = Record<string, unknown>;

const asRecord = (value: unknown): RecordValue | null =>
	value !== null && typeof value === "object" && !Array.isArray(value)
		? (value as RecordValue)
		: null;

const asDate = (value: unknown): Date | null => {
	let date: Date | null = null;
	if (value instanceof Date) {
		date = value;
	} else if (typeof value === "string") {
		date = new Date(value);
	}
	return date && !Number.isNaN(date.getTime()) ? date : null;
};

const SUBSCRIPTION_EVENT_PREFIX = "subscription.";
const SUCCEEDED_PAYMENT = "payment.succeeded";

export function requiresInitialPayment({
	currentSubscriptionId,
	currentStatus,
	subscriptionId,
	status,
	hasSucceededPayment,
	isRenewal,
}: {
	currentSubscriptionId?: string | null;
	currentStatus?: string | null;
	subscriptionId: string;
	status: string;
	hasSucceededPayment: boolean;
	isRenewal: boolean;
}): boolean {
	return (
		status === "active" &&
		!isRenewal &&
		(currentSubscriptionId !== subscriptionId ||
			currentStatus === "pending_payment") &&
		!hasSucceededPayment
	);
}

async function handleSuccessfulPayment(
	db: Database,
	event: RecordValue
): Promise<void> {
	const data = asRecord(event.data);
	const customer = asRecord(data?.customer);
	const eventAt = asDate(event.timestamp);
	if (
		!(data && customer && eventAt) ||
		typeof data.subscription_id !== "string" ||
		typeof data.payment_id !== "string" ||
		typeof customer.customer_id !== "string"
	) {
		return;
	}
	const subscriptionId = data.subscription_id;
	const paymentId = data.payment_id;
	const customerId = customer.customer_id;
	const eventId = createHash("sha256")
		.update(`${SUCCEEDED_PAYMENT}|${paymentId}|${eventAt.toISOString()}`)
		.digest("hex");

	await db.transaction(async (tx) => {
		const inserted = await tx
			.insert(dodoWebhookEvent)
			.values({
				eventAt,
				eventType: SUCCEEDED_PAYMENT,
				id: eventId,
				subscriptionId,
			})
			.onConflictDoNothing()
			.returning({ id: dodoWebhookEvent.id });
		if (inserted.length === 0) {
			return;
		}
		const customers = await tx
			.select({ id: user.id })
			.from(user)
			.where(eq(user.dodoCustomerId, customerId));
		const accountId = customers[0]?.id;
		if (!accountId) {
			throw new Error(
				`No local account is linked to Dodo customer ${customerId}.`
			);
		}
		await tx.execute(
			sql`SELECT id FROM "user" WHERE id = ${accountId} FOR UPDATE`
		);
		const activated = await tx
			.update(apiEntitlement)
			.set({ status: "active", updatedAt: new Date() })
			.where(
				and(
					eq(apiEntitlement.userId, accountId),
					eq(apiEntitlement.subscriptionId, subscriptionId),
					eq(apiEntitlement.status, "pending_payment")
				)
			)
			.returning({ userId: apiEntitlement.userId });
		if (activated.length > 0) {
			await tx
				.insert(apiEndpoint)
				.values({ id: randomUUID(), userId: accountId })
				.onConflictDoNothing();
		}
	});
}

export async function handleDodoWebhook(
	db: Database,
	products: DodoProductConfig,
	payload: unknown
): Promise<void> {
	const event = asRecord(payload);
	if (!event || typeof event.type !== "string") {
		return;
	}
	if (event.type === SUCCEEDED_PAYMENT) {
		await handleSuccessfulPayment(db, event);
		return;
	}
	if (!event.type.startsWith(SUBSCRIPTION_EVENT_PREFIX)) {
		return;
	}

	const data = asRecord(event.data);
	const customer = asRecord(data?.customer);
	const eventAt = asDate(event.timestamp);
	const periodStart = asDate(data?.previous_billing_date);
	const periodEnd = asDate(data?.next_billing_date);
	if (
		!(data && customer && eventAt) ||
		typeof data.subscription_id !== "string" ||
		typeof data.product_id !== "string" ||
		typeof data.status !== "string" ||
		typeof customer.customer_id !== "string"
	) {
		throw new Error("Dodo subscription webhook is missing required fields.");
	}

	const subscriptionId = data.subscription_id;
	const productId = data.product_id;
	const customerId = customer.customer_id;
	const { status } = data;
	if (
		status === "active" &&
		(!(periodStart && periodEnd) || periodStart >= periodEnd)
	) {
		throw new Error(
			"Dodo active subscription is missing a valid billing period."
		);
	}
	const plan = planForProduct(productId, products);
	const eventId = createHash("sha256")
		.update(
			[
				event.type,
				subscriptionId,
				eventAt.toISOString(),
				status,
				productId,
			].join("|")
		)
		.digest("hex");

	// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Each guard is part of one atomic webhook state transition.
	await db.transaction(async (tx) => {
		const inserted = await tx
			.insert(dodoWebhookEvent)
			.values({
				eventAt,
				eventType: event.type as string,
				id: eventId,
				subscriptionId,
			})
			.onConflictDoNothing()
			.returning({ id: dodoWebhookEvent.id });
		if (inserted.length === 0) {
			return;
		}

		const customers = await tx
			.select({ id: user.id })
			.from(user)
			.where(eq(user.dodoCustomerId, customerId));
		const accountId = customers[0]?.id;
		if (!accountId) {
			throw new Error(
				`No local account is linked to Dodo customer ${customerId}.`
			);
		}

		await tx
			.delete(apiCheckoutIntent)
			.where(eq(apiCheckoutIntent.userId, accountId));

		await tx.execute(
			sql`SELECT id FROM "user" WHERE id = ${accountId} FOR UPDATE`
		);
		const previous = await tx
			.select()
			.from(apiEntitlement)
			.where(eq(apiEntitlement.userId, accountId));
		const [current] = previous;
		const isRenewal = event.type === "subscription.renewed";
		const renewsLaterPeriod =
			isRenewal &&
			periodStart &&
			current?.periodStart &&
			periodStart > current.periodStart &&
			current.subscriptionId === subscriptionId;
		const isStale = Boolean(
			current?.lastEventAt && eventAt < current.lastEventAt
		);
		if (isStale && !renewsLaterPeriod) {
			return;
		}
		if (
			current?.subscriptionId &&
			current.subscriptionId !== subscriptionId &&
			current.status === "active"
		) {
			throw new Error(
				`A second Dodo subscription ${subscriptionId} was received for an active account ${accountId}. Reconcile billing before granting access.`
			);
		}
		const paidEvents = await tx
			.select({ id: dodoWebhookEvent.id })
			.from(dodoWebhookEvent)
			.where(
				and(
					eq(dodoWebhookEvent.subscriptionId, subscriptionId),
					eq(dodoWebhookEvent.eventType, SUCCEEDED_PAYMENT)
				)
			)
			.limit(1);
		const paymentPending = requiresInitialPayment({
			currentStatus: current?.status,
			currentSubscriptionId: current?.subscriptionId,
			hasSucceededPayment: paidEvents.length > 0,
			isRenewal,
			status,
			subscriptionId,
		});

		const effectiveStatus = isStale
			? (current?.status ?? "unsupported_product")
			: status;
		let resolvedStatus = effectiveStatus;
		if (!(isStale || plan)) {
			resolvedStatus = "unsupported_product";
		} else if (paymentPending) {
			resolvedStatus = "pending_payment";
		}
		const oldWindow =
			current?.periodStart && current.periodEnd
				? getUsageWindow(
						current.periodStart,
						current.periodEnd,
						current.cadence as BillingCadence,
						eventAt
					)
				: null;
		const oldPeriod = oldWindow
			? await tx
					.select()
					.from(apiUsagePeriod)
					.where(
						and(
							eq(apiUsagePeriod.userId, accountId),
							eq(apiUsagePeriod.periodStart, oldWindow.start)
						)
					)
			: [];
		const samePeriod =
			current?.periodStart?.getTime() === periodStart?.getTime();
		const validIncomingPeriod = Boolean(
			periodStart && periodEnd && periodStart < periodEnd
		);
		const isImmediatePlanChange =
			event.type === "subscription.plan_changed" &&
			current?.periodEnd &&
			periodStart &&
			periodStart < current.periodEnd;
		const advancePeriod =
			validIncomingPeriod &&
			(!current?.periodStart ||
				current.subscriptionId !== subscriptionId ||
				(Boolean(periodStart && periodStart > current.periodStart) &&
					(isRenewal || isImmediatePlanChange)));
		const nextPeriodStart =
			advancePeriod || samePeriod
				? (periodStart ?? current?.periodStart)
				: current?.periodStart;
		const nextPeriodEnd =
			advancePeriod || samePeriod
				? (periodEnd ?? current?.periodEnd)
				: current?.periodEnd;
		const applyProduct = !current || advancePeriod || samePeriod;
		const nextCadence =
			isStale || !applyProduct
				? (current?.cadence as BillingCadence | undefined)
				: plan?.cadence;
		const nextWindow =
			nextPeriodStart && nextPeriodEnd && nextCadence
				? getUsageWindow(nextPeriodStart, nextPeriodEnd, nextCadence, eventAt)
				: null;
		const carriedUsage =
			isRenewal || current?.subscriptionId !== subscriptionId
				? 0
				: (oldPeriod[0]?.requestCount ?? 0);
		if (
			advancePeriod &&
			nextWindow &&
			oldWindow?.start.getTime() !== nextWindow.start.getTime()
		) {
			await tx
				.insert(apiUsagePeriod)
				.values({
					periodEnd: nextWindow.end,
					periodStart: nextWindow.start,
					requestCount: carriedUsage,
					userId: accountId,
				})
				.onConflictDoNothing();
		}

		if (current) {
			await tx
				.update(apiEntitlement)
				.set({
					cadence: nextCadence ?? "monthly",
					lastEventAt: isStale ? current.lastEventAt : eventAt,
					periodEnd: nextPeriodEnd,
					periodStart: nextPeriodStart,
					plan:
						isStale || !applyProduct ? current.plan : (plan?.plan ?? "none"),
					productId: isStale || !applyProduct ? current.productId : productId,
					status: resolvedStatus,
					subscriptionId,
					updatedAt: new Date(),
				})
				.where(eq(apiEntitlement.userId, accountId));
		} else {
			await tx.insert(apiEntitlement).values({
				cadence: plan?.cadence ?? "monthly",
				lastEventAt: eventAt,
				periodEnd,
				periodStart,
				plan: plan?.plan ?? "none",
				productId,
				status: resolvedStatus,
				subscriptionId,
				userId: accountId,
			});
		}
		if (resolvedStatus === "active" && plan) {
			await tx
				.insert(apiEndpoint)
				.values({ id: randomUUID(), userId: accountId })
				.onConflictDoNothing();
		}
	});
}
