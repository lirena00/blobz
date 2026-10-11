import { apiCheckoutIntent, apiEntitlement } from "@blobz/db/schema/api";
import { user } from "@blobz/db/schema/auth";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { ENV } from "@/env.server";
import { productForPlan } from "@/lib/api-platform";
import {
	DashboardHttpError,
	dashboardError,
	requireDashboardUser,
} from "@/lib/dashboard-http";
import { db, dodoClient } from "@/services";

export const runtime = "nodejs";

const checkoutBody = z.object({
	cadence: z.enum(["monthly", "yearly"]),
	plan: z.enum(["plus", "pro"]),
});
const CHECKOUT_LOCK_MINUTES = 15;

export async function POST(request: Request) {
	let lockedUserId: string | null = null;
	try {
		const signedInUser = await requireDashboardUser(request);
		const { cadence, plan } = checkoutBody.parse(await request.json());
		const productId = productForPlan(plan, cadence, ENV);
		if (!(dodoClient && productId)) {
			throw new DashboardHttpError("Billing is not configured yet.", 503);
		}

		await db.transaction(async (tx) => {
			await tx.execute(
				sql`SELECT id FROM "user" WHERE id = ${signedInUser.id} FOR UPDATE`
			);
			const current = await tx
				.select()
				.from(apiEntitlement)
				.where(eq(apiEntitlement.userId, signedInUser.id));
			if (
				current[0] &&
				!["cancelled", "expired", "failed", "unsupported_product"].includes(
					current[0].status
				)
			) {
				throw new DashboardHttpError(
					"An existing subscription prevents another checkout. Plan changes are currently unavailable.",
					409
				);
			}
			const pending = await tx
				.select()
				.from(apiCheckoutIntent)
				.where(eq(apiCheckoutIntent.userId, signedInUser.id));
			if (pending[0] && pending[0].expiresAt > new Date()) {
				throw new DashboardHttpError(
					"A checkout is already in progress. Try again in a few minutes.",
					409
				);
			}
			await tx
				.insert(apiCheckoutIntent)
				.values({
					expiresAt: new Date(Date.now() + CHECKOUT_LOCK_MINUTES * 60_000),
					plan: `${plan}_${cadence}`,
					userId: signedInUser.id,
				})
				.onConflictDoUpdate({
					set: {
						expiresAt: new Date(Date.now() + CHECKOUT_LOCK_MINUTES * 60_000),
						plan: `${plan}_${cadence}`,
					},
					target: apiCheckoutIntent.userId,
				});
		});
		lockedUserId = signedInUser.id;

		const rows = await db
			.select()
			.from(user)
			.where(eq(user.id, signedInUser.id));
		const [account] = rows;
		if (!account) {
			throw new DashboardHttpError("Account not found.", 404);
		}
		let customerId = account.dodoCustomerId;
		if (!customerId) {
			const customer = await dodoClient.customers.create(
				{
					email: account.email,
					metadata: { blobz_user_id: account.id },
					name: account.name,
				},
				{ idempotencyKey: `blobz-user-${account.id}` }
			);
			customerId = customer.customer_id;
			await db
				.update(user)
				.set({ dodoCustomerId: customerId })
				.where(eq(user.id, account.id));
		}

		const checkout = await dodoClient.checkoutSessions.create({
			cancel_url: `${ENV.BETTER_AUTH_URL}/dashboard?checkout=cancelled`,
			customer: { customer_id: customerId },
			metadata: { blobz_user_id: account.id, cadence, plan },
			product_cart: [{ product_id: productId, quantity: 1 }],
			return_url: `${ENV.BETTER_AUTH_URL}/dashboard?checkout=return`,
		});
		return Response.json(
			{ url: checkout.checkout_url },
			{ headers: { "Cache-Control": "no-store" } }
		);
	} catch (error) {
		if (lockedUserId) {
			await db
				.delete(apiCheckoutIntent)
				.where(eq(apiCheckoutIntent.userId, lockedUserId));
		}
		return dashboardError(error);
	}
}
