import { apiEntitlement } from "@blobz/db/schema/api";
import { user } from "@blobz/db/schema/auth";
import { and, eq } from "drizzle-orm";
import {
	DashboardHttpError,
	dashboardError,
	requireDashboardUser,
} from "@/lib/dashboard-http";
import { db, dodoClient } from "@/services";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
	try {
		const signedInUser = await requireDashboardUser(request);
		if (!dodoClient) {
			throw new DashboardHttpError("Billing is not configured yet.", 503);
		}

		const [[current], [customer]] = await Promise.all([
			db
				.select()
				.from(apiEntitlement)
				.where(eq(apiEntitlement.userId, signedInUser.id)),
			db.select().from(user).where(eq(user.id, signedInUser.id)),
		]);
		if (
			current?.status !== "active" ||
			!current.subscriptionId ||
			!customer?.dodoCustomerId
		) {
			throw new DashboardHttpError("No active subscription to cancel.", 409);
		}

		const { subscriptionId } = current;
		const subscription =
			await dodoClient.subscriptions.retrieve(subscriptionId);
		if (subscription.customer.customer_id !== customer.dodoCustomerId) {
			throw new DashboardHttpError("Subscription account mismatch.", 403);
		}
		if (subscription.status !== "active") {
			throw new DashboardHttpError(
				"The subscription is no longer active. Refresh the dashboard.",
				409
			);
		}

		if (!subscription.cancel_at_next_billing_date) {
			const updated = await dodoClient.subscriptions.update(subscriptionId, {
				cancel_at_next_billing_date: true,
				cancel_reason: "cancelled_by_customer",
				status: "cancelled",
			});
			if (!updated.cancel_at_next_billing_date) {
				throw new DashboardHttpError(
					"Could not confirm cancellation with billing. Please try again.",
					502
				);
			}
		}

		const updatedEntitlements = await db
			.update(apiEntitlement)
			.set({ cancelAtPeriodEnd: true })
			.where(
				and(
					eq(apiEntitlement.userId, signedInUser.id),
					eq(apiEntitlement.subscriptionId, subscriptionId),
					eq(apiEntitlement.status, "active")
				)
			)
			.returning({ userId: apiEntitlement.userId });
		if (updatedEntitlements.length === 0) {
			throw new DashboardHttpError(
				"Subscription status changed. Refresh the dashboard.",
				409
			);
		}
		return Response.json(
			{ cancelAtPeriodEnd: true },
			{ headers: { "Cache-Control": "no-store" } }
		);
	} catch (error) {
		return dashboardError(error);
	}
}
