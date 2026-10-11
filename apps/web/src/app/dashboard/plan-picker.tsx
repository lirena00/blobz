// biome-ignore-all lint/performance/noJsxPropsBind: Checkout callbacks bind the selected product.
"use client";

import { Badge } from "@blobz/ui/components/badge";
import { Button } from "@blobz/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@blobz/ui/components/card";
import { Spinner } from "@blobz/ui/components/spinner";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@blobz/ui/components/tabs";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PLAN_OPTIONS = [
	{ label: "Plus", limit: "5 million", plan: "plus" },
	{ label: "Pro", limit: "10 million", plan: "pro" },
] as const;
const BILLING_CADENCES = ["monthly", "yearly"] as const;

export default function PlanPicker({
	billingConfigured,
}: {
	billingConfigured: boolean;
}) {
	const [pendingPlan, setPendingPlan] = useState<string | null>(null);

	const beginCheckout = async (
		plan: "plus" | "pro",
		cadence: "monthly" | "yearly"
	) => {
		setPendingPlan(`${plan}-${cadence}`);
		try {
			const response = await fetch("/api/dashboard/billing/checkout", {
				body: JSON.stringify({ cadence, plan }),
				credentials: "same-origin",
				headers: { "Content-Type": "application/json" },
				method: "POST",
			});
			const data: unknown = await response.json();
			if (
				!response.ok ||
				typeof data !== "object" ||
				!data ||
				!("url" in data) ||
				typeof data.url !== "string"
			) {
				const message =
					typeof data === "object" &&
					data &&
					"error" in data &&
					typeof data.error === "string"
						? data.error
						: "Could not start checkout. Please try again.";
				throw new Error(message);
			}
			window.location.assign(data.url);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Could not start checkout."
			);
			setPendingPlan(null);
		}
	};

	return (
		<section
			aria-labelledby="choose-plan-title"
			className="flex flex-col gap-5"
		>
			<div className="flex flex-col gap-2">
				<h2
					className="font-heading text-2xl tracking-tight"
					id="choose-plan-title"
				>
					Choose your plan
				</h2>
				<p className="text-muted-foreground text-sm">
					Your image endpoint is created automatically after your first
					successful payment. Both yearly plans receive a fresh allowance every
					month.
				</p>
			</div>
			<Tabs defaultValue="monthly">
				<TabsList aria-label="Billing frequency" className="w-fit">
					<TabsTrigger value="monthly">Monthly</TabsTrigger>
					<TabsTrigger value="yearly">Yearly</TabsTrigger>
				</TabsList>
				{BILLING_CADENCES.map((cadence) => (
					<TabsContent
						className="grid gap-4 pt-4 md:grid-cols-2"
						key={cadence}
						value={cadence}
					>
						{PLAN_OPTIONS.map(({ label, limit, plan }) => (
							<Card className="h-full" key={plan}>
								<CardHeader>
									<CardTitle>{label}</CardTitle>
									<CardDescription>Billed {cadence}</CardDescription>
								</CardHeader>
								<CardContent className="flex flex-col gap-4">
									<p className="font-heading text-2xl tracking-tight">
										{limit}
										<span className="font-normal text-muted-foreground text-sm">
											{" "}
											requests / month
										</span>
									</p>
									<ul className="flex flex-col gap-2 text-sm">
										<li className="flex items-center gap-2">
											<CheckIcon aria-hidden="true" className="size-4" />
											One automatically provisioned image endpoint
										</li>
										<li className="flex items-center gap-2">
											<CheckIcon aria-hidden="true" className="size-4" />
											Up to five approved browser origins
										</li>
										<li className="flex items-center gap-2">
											<CheckIcon aria-hidden="true" className="size-4" />
											No overage charges; requests stop at the cap
										</li>
									</ul>
								</CardContent>
								<CardFooter className="flex flex-col items-start gap-3">
									<Button
										disabled={!billingConfigured || pendingPlan !== null}
										onClick={async () => await beginCheckout(plan, cadence)}
									>
										{pendingPlan === `${plan}-${cadence}` ? (
											<Spinner data-icon="inline-start" />
										) : (
											<ArrowRightIcon data-icon="inline-start" />
										)}
										Choose {label}
									</Button>
									<Badge variant="outline">
										Final price shown at secure checkout
									</Badge>
								</CardFooter>
							</Card>
						))}
					</TabsContent>
				))}
			</Tabs>
		</section>
	);
}
