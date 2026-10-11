import type { Database } from "@blobz/db";
import {
	apiEndpoint,
	apiEntitlement,
	apiOrigin,
	apiUsageDay,
	apiUsagePeriod,
} from "@blobz/db/schema/api";
import { and, eq, gt, isNull, lt, sql } from "drizzle-orm";

export const MAX_ACCOUNT_ORIGINS = 5;
export const PLAN_LIMITS = { plus: 5_000_000, pro: 10_000_000 } as const;
const BURST_LIMIT_PER_MINUTE = 10_000;
const HTTPS_ORIGIN = /^https:\/\/[^/]+$/;
const LOCAL_HTTP_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export type ApiPlan = keyof typeof PLAN_LIMITS;
export type BillingCadence = "monthly" | "yearly";

export interface DodoProductConfig {
	DODO_PRODUCT_PLUS_MONTHLY?: string;
	DODO_PRODUCT_PLUS_YEARLY?: string;
	DODO_PRODUCT_PRO_MONTHLY?: string;
	DODO_PRODUCT_PRO_YEARLY?: string;
}

const configuredProductIds = (config: DodoProductConfig): string[] =>
	[
		config.DODO_PRODUCT_PLUS_MONTHLY,
		config.DODO_PRODUCT_PLUS_YEARLY,
		config.DODO_PRODUCT_PRO_MONTHLY,
		config.DODO_PRODUCT_PRO_YEARLY,
	].filter((id): id is string => Boolean(id));

export class ApiPlatformError extends Error {
	readonly status: number;
	readonly code: string;
	constructor(
		message: string,
		status: number,
		code: string,
		options?: ErrorOptions
	) {
		super(message, options);
		this.status = status;
		this.code = code;
	}
}

export function normalizeOrigin(value: string): string {
	const trimmed = value.trim();
	if (trimmed === "null" || trimmed.includes("*")) {
		throw new ApiPlatformError(
			"Enter an exact HTTPS origin.",
			422,
			"invalid_origin"
		);
	}

	if (!URL.canParse(trimmed)) {
		throw new ApiPlatformError(
			"Enter a valid origin, such as https://example.com.",
			422,
			"invalid_origin"
		);
	}

	const url = new URL(trimmed);
	const { origin } = url;
	const hasOnlyOrigin =
		!(url.username || url.password) &&
		url.pathname === "/" &&
		!url.search &&
		!url.hash;
	if (
		!(
			hasOnlyOrigin &&
			(HTTPS_ORIGIN.test(origin) || LOCAL_HTTP_ORIGIN.test(origin))
		)
	) {
		throw new ApiPlatformError(
			"Use an exact HTTPS origin without a path or wildcard. HTTP is allowed only for localhost.",
			422,
			"invalid_origin"
		);
	}

	return origin;
}

export function productForPlan(
	plan: ApiPlan,
	cadence: BillingCadence,
	config: DodoProductConfig
): string | null {
	const ids = configuredProductIds(config);
	if (new Set(ids).size !== ids.length) {
		return null;
	}
	if (plan === "plus") {
		return cadence === "monthly"
			? (config.DODO_PRODUCT_PLUS_MONTHLY ?? null)
			: (config.DODO_PRODUCT_PLUS_YEARLY ?? null);
	}
	return cadence === "monthly"
		? (config.DODO_PRODUCT_PRO_MONTHLY ?? null)
		: (config.DODO_PRODUCT_PRO_YEARLY ?? null);
}

export function planForProduct(
	productId: string,
	config: DodoProductConfig
): { plan: ApiPlan; cadence: BillingCadence } | null {
	const ids = configuredProductIds(config);
	if (new Set(ids).size !== ids.length) {
		return null;
	}
	if (config.DODO_PRODUCT_PLUS_MONTHLY === productId) {
		return { cadence: "monthly", plan: "plus" };
	}
	if (config.DODO_PRODUCT_PLUS_YEARLY === productId) {
		return { cadence: "yearly", plan: "plus" };
	}
	if (config.DODO_PRODUCT_PRO_MONTHLY === productId) {
		return { cadence: "monthly", plan: "pro" };
	}
	if (config.DODO_PRODUCT_PRO_YEARLY === productId) {
		return { cadence: "yearly", plan: "pro" };
	}
	return null;
}

const addClampedMonths = (anchor: Date, months: number): Date => {
	const year = anchor.getUTCFullYear();
	const month = anchor.getUTCMonth() + months;
	const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
	return new Date(
		Date.UTC(
			year,
			month,
			Math.min(anchor.getUTCDate(), lastDay),
			anchor.getUTCHours(),
			anchor.getUTCMinutes(),
			anchor.getUTCSeconds(),
			anchor.getUTCMilliseconds()
		)
	);
};

export function getUsageWindow(
	billingStart: Date,
	billingEnd: Date,
	cadence: BillingCadence,
	now: Date
): { start: Date; end: Date } | null {
	if (billingStart >= billingEnd || now < billingStart || now >= billingEnd) {
		return null;
	}
	if (cadence === "monthly") {
		return { end: billingEnd, start: billingStart };
	}
	if (cadence !== "yearly") {
		return null;
	}
	let windowStart = billingStart;
	for (let month = 1; month <= 12; month += 1) {
		const boundary = addClampedMonths(billingStart, month);
		const windowEnd = boundary < billingEnd ? boundary : billingEnd;
		if (now < windowEnd) {
			return { end: windowEnd, start: windowStart };
		}
		windowStart = windowEnd;
	}
	return null;
}

export function parseDatabaseTimestamp(value: unknown): Date | null {
	if (!(value instanceof Date || typeof value === "string")) {
		return null;
	}
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

export async function addAccountOrigin(
	db: Database,
	userId: string,
	rawOrigin: string
) {
	const origin = normalizeOrigin(rawOrigin);
	await db.transaction(async (tx) => {
		await tx.execute(
			sql`SELECT id FROM "user" WHERE id = ${userId} FOR UPDATE`
		);
		const existing = await tx
			.select()
			.from(apiOrigin)
			.where(eq(apiOrigin.userId, userId));
		if (existing.some((item) => item.origin === origin)) {
			return;
		}
		if (existing.length >= MAX_ACCOUNT_ORIGINS) {
			throw new ApiPlatformError(
				"This account already has five approved origins.",
				409,
				"origin_limit"
			);
		}
		await tx.insert(apiOrigin).values({ origin, userId });
	});
	return origin;
}

export async function removeAccountOrigin(
	db: Database,
	userId: string,
	rawOrigin: string
) {
	const origin = normalizeOrigin(rawOrigin);
	await db.transaction(async (tx) => {
		await tx.execute(
			sql`SELECT id FROM "user" WHERE id = ${userId} FOR UPDATE`
		);
		await tx
			.delete(apiOrigin)
			.where(and(eq(apiOrigin.userId, userId), eq(apiOrigin.origin, origin)));
	});
}

export async function getDashboardState(db: Database, userId: string) {
	const [entitlements, origins, endpoints, recentDays] = await Promise.all([
		db.select().from(apiEntitlement).where(eq(apiEntitlement.userId, userId)),
		db.select().from(apiOrigin).where(eq(apiOrigin.userId, userId)),
		db
			.select()
			.from(apiEndpoint)
			.where(
				and(eq(apiEndpoint.userId, userId), isNull(apiEndpoint.revokedAt))
			),
		db
			.select()
			.from(apiUsageDay)
			.where(
				and(
					eq(apiUsageDay.userId, userId),
					gt(
						apiUsageDay.day,
						new Date(Date.now() - 31 * 86_400_000).toISOString().slice(0, 10)
					)
				)
			),
	]);
	const entitlement = entitlements[0] ?? null;
	const usageWindow =
		entitlement?.periodStart && entitlement.periodEnd
			? getUsageWindow(
					entitlement.periodStart,
					entitlement.periodEnd,
					entitlement.cadence as BillingCadence,
					new Date()
				)
			: null;
	const period = usageWindow
		? await db
				.select()
				.from(apiUsagePeriod)
				.where(
					and(
						eq(apiUsagePeriod.userId, userId),
						eq(apiUsagePeriod.periodStart, usageWindow.start)
					)
				)
		: [];
	return {
		endpoint: endpoints[0]
			? {
					createdAt: endpoints[0].createdAt.toISOString(),
					id: endpoints[0].id,
					lastUsedAt: endpoints[0].lastUsedAt?.toISOString() ?? null,
				}
			: null,
		entitlement,
		origins: origins.map((item) => item.origin),
		recentDays: recentDays.map((item) => ({
			day: item.day,
			requestCount: item.requestCount,
		})),
		usage: period[0]?.requestCount ?? 0,
		usageWindow,
	};
}

type ConsumeResult =
	| {
			ok: true;
			count: number;
			limit: number;
			resetAt: Date;
			userId: string;
	  }
	| {
			ok: false;
			status: number;
			code: string;
			message: string;
			retryAfter?: number;
	  };

export async function consumeEmbeddedAvatarRequest(
	db: Database,
	endpointId: string,
	origin: string
): Promise<ConsumeResult> {
	if (endpointId.length > 100) {
		return {
			code: "endpoint_not_found",
			message: "Image endpoint not found.",
			ok: false,
			status: 404,
		};
	}
	return await consumeAvatarRequestForEndpoint(db, endpointId, origin);
}

async function consumeAvatarRequestForEndpoint(
	db: Database,
	endpointId: string,
	origin: string
): Promise<ConsumeResult> {
	const now = new Date();
	return await db
		.transaction(async (tx): Promise<ConsumeResult> => {
			const matches = await tx
				.select()
				.from(apiEndpoint)
				.where(eq(apiEndpoint.id, endpointId));
			const [endpoint] = matches;
			if (!endpoint || endpoint.revokedAt) {
				return {
					code: "endpoint_not_found",
					message: "Image endpoint not found.",
					ok: false,
					status: 404,
				};
			}

			const allowed = await tx
				.select()
				.from(apiOrigin)
				.where(
					and(
						eq(apiOrigin.userId, endpoint.userId),
						eq(apiOrigin.origin, origin)
					)
				);
			if (allowed.length === 0) {
				return {
					code: "origin_forbidden",
					message: "This origin is not approved for this account.",
					ok: false,
					status: 403,
				};
			}

			const entitlementRows = await tx.execute(sql`
      SELECT plan, cadence, status, period_start, period_end FROM api_entitlement
      WHERE user_id = ${endpoint.userId} FOR SHARE
    `);
			const entitlement = entitlementRows.rows[0] as
				| {
						plan: string;
						cadence: string;
						status: string;
						period_start: unknown;
						period_end: unknown;
				  }
				| undefined;
			const periodStart = parseDatabaseTimestamp(entitlement?.period_start);
			const periodEnd = parseDatabaseTimestamp(entitlement?.period_end);
			if (entitlement?.status !== "active" || !periodStart || !periodEnd) {
				return {
					code: "subscription_inactive",
					message: "An active subscription is required.",
					ok: false,
					status: 403,
				};
			}

			const usageWindow = getUsageWindow(
				periodStart,
				periodEnd,
				entitlement.cadence as BillingCadence,
				now
			);
			if (!usageWindow) {
				return {
					code: "billing_period_unavailable",
					message:
						"The current billing period is not active yet. Please check billing status.",
					ok: false,
					status: 403,
				};
			}

			const limit = PLAN_LIMITS[entitlement.plan as ApiPlan];
			if (!limit) {
				return {
					code: "unknown_plan",
					message: "This subscription does not include API access.",
					ok: false,
					status: 403,
				};
			}
			await tx
				.insert(apiUsagePeriod)
				.values({
					periodEnd: usageWindow.end,
					periodStart: usageWindow.start,
					userId: endpoint.userId,
				})
				.onConflictDoNothing();

			const month = await tx
				.update(apiUsagePeriod)
				.set({ requestCount: sql`${apiUsagePeriod.requestCount} + 1` })
				.where(
					and(
						eq(apiUsagePeriod.userId, endpoint.userId),
						eq(apiUsagePeriod.periodStart, usageWindow.start),
						lt(apiUsagePeriod.requestCount, limit)
					)
				)
				.returning({ requestCount: apiUsagePeriod.requestCount });
			if (month.length === 0) {
				return {
					code: "monthly_quota_exceeded",
					message: "Monthly request quota reached.",
					ok: false,
					retryAfter: Math.max(
						1,
						Math.ceil((usageWindow.end.getTime() - now.getTime()) / 1000)
					),
					status: 429,
				};
			}

			const minute = new Date(Math.floor(now.getTime() / 60_000) * 60_000);
			const burst = await tx.execute(sql`
      INSERT INTO api_rate_minute (user_id, minute, request_count)
      VALUES (${endpoint.userId}, ${minute}, 1)
      ON CONFLICT (user_id, minute) DO UPDATE
      SET request_count = api_rate_minute.request_count + 1
      WHERE api_rate_minute.request_count < ${BURST_LIMIT_PER_MINUTE}
      RETURNING request_count
    `);
			if (burst.rows.length === 0) {
				throw new ApiPlatformError(
					"Too many requests this minute.",
					429,
					"burst_limit_exceeded"
				);
			}

			await tx
				.insert(apiUsageDay)
				.values({
					day: now.toISOString().slice(0, 10),
					endpointId: endpoint.id,
					requestCount: 1,
					userId: endpoint.userId,
				})
				.onConflictDoUpdate({
					set: { requestCount: sql`${apiUsageDay.requestCount} + 1` },
					target: [apiUsageDay.endpointId, apiUsageDay.day],
				});
			await tx
				.update(apiEndpoint)
				.set({ lastUsedAt: now })
				.where(
					and(
						eq(apiEndpoint.id, endpoint.id),
						sql`(${apiEndpoint.lastUsedAt} IS NULL OR ${apiEndpoint.lastUsedAt} < ${new Date(now.getTime() - 3_600_000)})`
					)
				);
			return {
				count: month[0].requestCount,
				limit,
				ok: true,
				resetAt: usageWindow.end,
				userId: endpoint.userId,
			};
		})
		.catch((error: unknown) => {
			if (
				error instanceof ApiPlatformError &&
				error.code === "burst_limit_exceeded"
			) {
				return {
					code: error.code,
					message: error.message,
					ok: false,
					retryAfter: 60,
					status: 429,
				} as const;
			}
			throw error;
		});
}
