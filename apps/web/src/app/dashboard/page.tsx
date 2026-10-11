import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ENV } from "../../env.server";
import { getDashboardState } from "../../lib/api-platform";
import { auth, db } from "../../services";
import Dashboard from "./dashboard";

const description =
	"Manage Blobz hosted API usage, approved origins, plan details, and billing.";

export const metadata: Metadata = {
	description,
	openGraph: {
		description,
		title: "Blobz dashboard",
	},
	title: "Blobz dashboard",
	twitter: {
		description,
		title: "Blobz dashboard",
	},
};

export default async function DashboardPage({
	searchParams,
}: {
	searchParams: Promise<{ checkout?: string }>;
}) {
	const { checkout } = await searchParams;
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	const state = await getDashboardState(db, session.user.id);
	const { entitlement } = state;
	return (
		<Dashboard
			apiBaseUrl={ENV.BETTER_AUTH_URL}
			billingConfigured={Boolean(
				ENV.DODO_PAYMENTS_API_KEY &&
					ENV.DODO_PAYMENTS_WEBHOOK_SECRET &&
					ENV.DODO_PRODUCT_PLUS_MONTHLY &&
					ENV.DODO_PRODUCT_PLUS_YEARLY &&
					ENV.DODO_PRODUCT_PRO_MONTHLY &&
					ENV.DODO_PRODUCT_PRO_YEARLY &&
					new Set([
						ENV.DODO_PRODUCT_PLUS_MONTHLY,
						ENV.DODO_PRODUCT_PLUS_YEARLY,
						ENV.DODO_PRODUCT_PRO_MONTHLY,
						ENV.DODO_PRODUCT_PRO_YEARLY,
					]).size === 4
			)}
			checkoutReturned={checkout === "return"}
			endpoint={state.endpoint}
			entitlement={
				entitlement
					? {
							cadence: entitlement.cadence === "yearly" ? "yearly" : "monthly",
							periodEnd: entitlement.periodEnd?.toISOString() ?? null,
							periodStart: entitlement.periodStart?.toISOString() ?? null,
							plan: entitlement.plan,
							status: entitlement.status,
							subscriptionId: entitlement.subscriptionId,
						}
					: null
			}
			origins={state.origins}
			recentDays={state.recentDays}
			usage={state.usage}
			usageWindowEnd={state.usageWindow?.end.toISOString() ?? null}
			userName={session.user.name}
		/>
	);
}
