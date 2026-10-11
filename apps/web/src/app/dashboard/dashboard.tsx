import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@blobz/ui/components/alert";
import { Badge } from "@blobz/ui/components/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@blobz/ui/components/card";
import { Progress } from "@blobz/ui/components/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@blobz/ui/components/table";
import { ActivityIcon, CreditCardIcon, ShieldCheckIcon } from "lucide-react";
import ApprovedOrigins from "./approved-origins";
import EmbedQuickstart from "./embed-quickstart";
import PaymentStatusRefresh from "./payment-status-refresh";
import PlanPicker from "./plan-picker";

export interface DashboardProps {
	apiBaseUrl: string;
	billingConfigured: boolean;
	checkoutReturned: boolean;
	endpoint: {
		createdAt: string;
		id: string;
		lastUsedAt: string | null;
	} | null;
	entitlement: {
		cadence: "monthly" | "yearly";
		periodEnd: string | null;
		periodStart: string | null;
		plan: string;
		status: string;
		subscriptionId: string | null;
	} | null;
	origins: string[];
	recentDays: { day: string; requestCount: number }[];
	usage: number;
	usageWindowEnd: string | null;
	userName: string;
}

const number = new Intl.NumberFormat("en-US");
const date = new Intl.DateTimeFormat("en-US", {
	day: "numeric",
	month: "short",
	timeZone: "UTC",
	year: "numeric",
});
const CHECKOUTABLE_STATUSES = new Set([
	"cancelled",
	"expired",
	"failed",
	"unsupported_product",
]);

const formatDate = (value: string | null): string =>
	value ? date.format(new Date(value)) : "—";

const monthlyLimit = (plan: string): number => {
	if (plan === "plus") {
		return 5_000_000;
	}
	if (plan === "pro") {
		return 10_000_000;
	}
	return 0;
};

const planName = (plan: string): string => (plan === "pro" ? "Pro" : "Plus");

function UsageOverview({
	entitlement,
	endpoint,
	usage,
	usageWindowEnd,
}: Pick<
	DashboardProps,
	"endpoint" | "entitlement" | "usage" | "usageWindowEnd"
>) {
	if (!entitlement) {
		return null;
	}
	const limit = monthlyLimit(entitlement.plan);
	const remaining = Math.max(0, limit - usage);
	const percentage = limit > 0 ? Math.min(100, (usage / limit) * 100) : 0;

	return (
		<section
			aria-label="Usage overview"
			className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(17rem,1fr)]"
		>
			<Card>
				<CardHeader>
					<CardTitle>Monthly usage</CardTitle>
					<CardDescription>Accepted image requests this month</CardDescription>
					<CardAction>
						<Badge variant="outline">{number.format(limit)} limit</Badge>
					</CardAction>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<p className="font-heading text-3xl tabular-nums tracking-tight sm:text-4xl">
						{number.format(usage)}
						<span className="font-normal text-base text-muted-foreground">
							{" "}
							/ {number.format(limit)}
						</span>
					</p>
					<Progress aria-label="Monthly request usage" value={percentage} />
					<p className="text-muted-foreground text-sm">
						{number.format(remaining)} requests remaining. Requests beyond the
						limit are rejected, not billed as overage.
					</p>
				</CardContent>
				<CardFooter>
					<p className="text-muted-foreground text-xs">
						Allowance resets {formatDate(usageWindowEnd)} (UTC), including on
						yearly plans.
					</p>
				</CardFooter>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Current plan</CardTitle>
					<CardDescription>Subscription and endpoint</CardDescription>
					<CardAction>
						<Badge>Active</Badge>
					</CardAction>
				</CardHeader>
				<CardContent className="flex flex-col gap-3">
					<p className="font-heading text-2xl tracking-tight">
						{planName(entitlement.plan)} · {entitlement.cadence}
					</p>
					<p className="text-muted-foreground text-sm">
						Next billing date: {formatDate(entitlement.periodEnd)} (UTC)
					</p>
					<p className="text-muted-foreground text-sm">
						Image endpoint: {endpoint ? "Ready" : "Provisioning"}
					</p>
				</CardContent>
			</Card>
		</section>
	);
}

function RecentRequests({ recentDays }: Pick<DashboardProps, "recentDays">) {
	const dailyTotals = new Map<string, number>();
	for (const item of recentDays) {
		dailyTotals.set(
			item.day,
			(dailyTotals.get(item.day) ?? 0) + item.requestCount
		);
	}
	const rows = [...dailyTotals.entries()]
		.sort(([first], [second]) => second.localeCompare(first))
		.slice(0, 7);

	return (
		<section aria-labelledby="activity-title">
			<Card className="h-full">
				<CardHeader>
					<CardTitle className="flex items-center gap-2" id="activity-title">
						<ActivityIcon aria-hidden="true" /> Recent requests
					</CardTitle>
					<CardDescription>Accepted image requests by UTC day</CardDescription>
				</CardHeader>
				<CardContent>
					{rows.length === 0 ? (
						<p className="text-muted-foreground text-sm">
							No accepted requests yet. Requests from unapproved sites are
							rejected and do not count.
						</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Day</TableHead>
									<TableHead className="text-right">Requests</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{rows.map(([day, count]) => (
									<TableRow key={day}>
										<TableCell>{formatDate(`${day}T00:00:00Z`)}</TableCell>
										<TableCell className="text-right tabular-nums">
											{number.format(count)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</section>
	);
}

function InactiveWorkspace({
	awaitingPayment,
	billingConfigured,
	entitlement,
	origins,
}: Pick<DashboardProps, "billingConfigured" | "entitlement" | "origins"> & {
	awaitingPayment: boolean;
}) {
	const canCheckout =
		!awaitingPayment &&
		(!entitlement || CHECKOUTABLE_STATUSES.has(entitlement.status));

	return (
		<>
			{awaitingPayment || (entitlement && !canCheckout) ? (
				<Alert>
					<CreditCardIcon />
					<AlertTitle>
						{awaitingPayment
							? "Waiting for payment confirmation"
							: "Subscription needs attention"}
					</AlertTitle>
					<AlertDescription>
						Your image endpoint becomes available after Dodo confirms a
						successful payment.
						{entitlement ? ` Current status: ${entitlement.status}.` : null}
						{awaitingPayment ? <PaymentStatusRefresh /> : null}
					</AlertDescription>
				</Alert>
			) : null}
			{canCheckout ? (
				<PlanPicker billingConfigured={billingConfigured} />
			) : null}
			<div className="grid gap-6 lg:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1.4fr)]">
				<ApprovedOrigins origins={origins} />
				<Card>
					<CardHeader>
						<CardTitle>Your image endpoint</CardTitle>
						<CardDescription>
							Provisioned automatically after your first confirmed payment
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-muted-foreground text-sm">
							You can approve website origins now. Once your subscription is
							active, your image URL and embed builder appear here—no keys or
							manual setup required.
						</p>
					</CardContent>
				</Card>
			</div>
		</>
	);
}

export default function Dashboard({
	apiBaseUrl,
	billingConfigured,
	checkoutReturned,
	endpoint,
	entitlement,
	origins,
	recentDays,
	usage,
	usageWindowEnd,
	userName,
}: DashboardProps) {
	const isActive = entitlement?.status === "active";
	const awaitingPayment =
		!isActive &&
		(checkoutReturned || entitlement?.status === "pending_payment");
	let subscriptionLabel = "No active subscription";
	if (isActive) {
		subscriptionLabel = "Subscription active";
	} else if (awaitingPayment) {
		subscriptionLabel = "Payment pending";
	}

	return (
		<main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pt-28 pb-20 sm:px-6 lg:px-8">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div className="flex flex-col gap-2">
					<Badge className="w-fit" variant="secondary">
						Image API workspace
					</Badge>
					<h1 className="font-heading text-3xl tracking-tight sm:text-4xl">
						Your Blobz dashboard
					</h1>
					<p className="max-w-2xl break-words text-muted-foreground">
						Welcome back, {userName}. Set up your websites, copy an image tag,
						and keep an eye on monthly usage.
					</p>
				</div>
				<Badge className="w-fit" variant={isActive ? "default" : "outline"}>
					{subscriptionLabel}
				</Badge>
			</header>

			{billingConfigured ? null : (
				<Alert>
					<ShieldCheckIcon />
					<AlertTitle>Billing setup needed</AlertTitle>
					<AlertDescription>
						Configure the Dodo API key, webhook secret, and four product IDs on
						the server before customers can subscribe.
					</AlertDescription>
				</Alert>
			)}

			{isActive ? (
				<>
					<UsageOverview
						endpoint={endpoint}
						entitlement={entitlement}
						usage={usage}
						usageWindowEnd={usageWindowEnd}
					/>
					<div className="flex flex-col gap-2">
						<h2 className="font-heading text-2xl tracking-tight">
							Connect your website
						</h2>
						<p className="text-muted-foreground text-sm">
							First approve the sites that can request images. Then customize
							and copy your embed code.
						</p>
					</div>
					<div className="grid items-start gap-6 lg:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1.4fr)]">
						<ApprovedOrigins origins={origins} />
						<section aria-labelledby="quickstart-title">
							<EmbedQuickstart
								apiBaseUrl={apiBaseUrl}
								endpoint={endpoint}
								hasApprovedOrigin={origins.length > 0}
							/>
						</section>
					</div>
					<RecentRequests recentDays={recentDays} />
				</>
			) : (
				<InactiveWorkspace
					awaitingPayment={awaitingPayment}
					billingConfigured={billingConfigured}
					entitlement={entitlement}
					origins={origins}
				/>
			)}
		</main>
	);
}
