"use client";

import { Badge } from "@blobz/ui/components/badge";
import { buttonVariants } from "@blobz/ui/components/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@blobz/ui/components/card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@blobz/ui/components/tabs";
import { ArrowRight, Code2, Component, Globe2 } from "lucide-react";
import Link from "next/link";

const PLANS = [
	{
		featured: true,
		monthlyPrice: "$4.99",
		name: "Plus",
		requests: "5M",
		yearlyPrice: "$49.90",
	},
	{
		featured: false,
		monthlyPrice: "$9.99",
		name: "Pro",
		requests: "10M",
		yearlyPrice: "$99.90",
	},
] as const;
const CADENCES = ["yearly", "monthly"] as const;
type Cadence = (typeof CADENCES)[number];

function FreeCard() {
	return (
		<Card className="h-full gap-6 border-sky-100 bg-white py-7 shadow-[0_18px_50px_rgb(14_116_168_/_6%)]">
			<CardHeader className="gap-4">
				<span className="grid size-12 place-items-center rounded-2xl bg-sky-100 text-sky-700">
					<Code2 aria-hidden="true" className="size-6" />
				</span>
				<div className="flex flex-wrap items-center gap-2">
					<CardTitle>
						<h3 className="font-[760] font-[family-name:var(--font-bricolage)] text-2xl tracking-[-0.04em]">
							Free toolkit
						</h3>
					</CardTitle>
					<Badge variant="secondary">Free forever</Badge>
				</div>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col gap-5">
				<p className="font-[780] font-[family-name:var(--font-bricolage)] text-[3.5rem] leading-none tracking-[-0.06em]">
					$0
				</p>
				<p className="text-[#60708a] text-sm leading-6">
					Generate unlimited avatars in your app. No account or image requests.
				</p>
				<div className="mt-auto grid gap-3 border-sky-100 border-t pt-5 text-sm">
					<Link
						className="group flex items-center gap-2 font-semibold text-[#0b1830] hover:text-sky-700"
						href="/docs/react"
					>
						<Code2 aria-hidden="true" className="size-4 text-sky-600" />
						React package
						<ArrowRight
							aria-hidden="true"
							className="ml-auto size-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
						/>
					</Link>
					<Link
						className="group flex items-center gap-2 font-semibold text-[#0b1830] hover:text-sky-700"
						href="/docs/components"
					>
						<Component aria-hidden="true" className="size-4 text-sky-600" />
						Ready-to-use shadcn components
						<ArrowRight
							aria-hidden="true"
							className="ml-auto size-4 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
						/>
					</Link>
				</div>
			</CardContent>
			<CardFooter>
				<Link
					className={buttonVariants({
						className: "w-full justify-between",
						size: "lg",
						variant: "outline",
					})}
					href="/docs/react"
				>
					Start for free{" "}
					<ArrowRight aria-hidden="true" data-icon="inline-end" />
				</Link>
			</CardFooter>
		</Card>
	);
}

function PaidCard({
	cadence,
	plan,
}: {
	cadence: Cadence;
	plan: (typeof PLANS)[number];
}) {
	const price = cadence === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
	return (
		<Card
			className={`h-full gap-6 py-7 ${plan.featured ? "border-sky-300 bg-[linear-gradient(145deg,#e0f5ff,#fff_70%)] shadow-[0_24px_70px_rgb(14_165_233_/_12%)]" : "border-sky-100 bg-white shadow-[0_18px_50px_rgb(14_116_168_/_6%)]"}`}
		>
			<CardHeader className="gap-4">
				<span
					className={`grid size-12 place-items-center rounded-2xl ${plan.featured ? "bg-sky-500 text-white" : "bg-sky-100 text-sky-700"}`}
				>
					<Globe2 aria-hidden="true" className="size-6" />
				</span>
				<div className="flex flex-wrap items-center gap-2">
					<CardTitle>
						<h3 className="font-[760] font-[family-name:var(--font-bricolage)] text-2xl tracking-[-0.04em]">
							{plan.name}
						</h3>
					</CardTitle>
					<Badge variant={plan.featured ? "default" : "secondary"}>
						Hosted API
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col gap-5">
				<p className="font-[family-name:var(--font-bricolage)] tabular-nums">
					<strong className="font-[780] text-[clamp(2.7rem,4vw,3.5rem)] leading-none tracking-[-0.06em]">
						{price}
					</strong>
					<span className="ml-2 text-[#60708a] text-sm">
						/ {cadence === "yearly" ? "year" : "month"}
					</span>
				</p>
				<p className="text-[#60708a] text-sm leading-6">
					A hosted image URL for every user. No file storage needed.
				</p>
				<div className="mt-auto border-sky-100 border-t pt-5">
					<strong className="font-[780] font-[family-name:var(--font-bricolage)] text-3xl tracking-[-0.05em]">
						{plan.requests}
					</strong>
					<span className="ml-2 text-[#60708a] text-sm">requests / month</span>
				</div>
			</CardContent>
			<CardFooter>
				<Link
					className={buttonVariants({
						className: "w-full justify-between",
						size: "lg",
					})}
					href={`/dashboard?billing=${cadence}`}
				>
					Choose {plan.name}{" "}
					<ArrowRight aria-hidden="true" data-icon="inline-end" />
				</Link>
			</CardFooter>
		</Card>
	);
}

export function Pricing() {
	return (
		<section
			aria-labelledby="api-pricing-title"
			className="scroll-mt-20 bg-[#f7fcff] px-6 pt-24 pb-28 max-[640px]:px-4 max-[640px]:pt-16 max-[640px]:pb-20"
			id="api"
		>
			<div className="mx-auto max-w-[78rem]">
				<div className="text-center">
					<p className="mb-4 font-[850] text-[0.72rem] text-sky-600 uppercase tracking-[0.17em]">
						Pricing
					</p>
					<h2
						className="font-[780] font-[family-name:var(--font-bricolage)] text-[clamp(3rem,6vw,6rem)] leading-[0.93] tracking-[-0.055em] max-[640px]:text-[3.2rem]"
						id="api-pricing-title"
					>
						Free to create. Scale with a URL.
					</h2>
				</div>
				<Tabs className="mt-10" defaultValue="yearly">
					<TabsList
						aria-label="Billing period"
						className="mx-auto h-auto rounded-full border border-sky-100 bg-white p-1 shadow-sm"
					>
						<TabsTrigger
							className="h-11 rounded-full px-5 data-active:bg-[#0b1830] data-active:text-white"
							value="monthly"
						>
							Monthly
						</TabsTrigger>
						<TabsTrigger
							className="h-11 rounded-full px-5 data-active:bg-[#0b1830] data-active:text-white"
							value="yearly"
						>
							Yearly{" "}
							<span className="rounded-full bg-sky-100 px-2 py-0.5 font-bold text-[0.68rem] text-sky-800">
								2 months free
							</span>
						</TabsTrigger>
					</TabsList>
					{CADENCES.map((cadence) => (
						<TabsContent
							className="mt-10 grid gap-5 min-[821px]:grid-cols-3"
							key={cadence}
							value={cadence}
						>
							<FreeCard />
							{PLANS.map((plan) => (
								<PaidCard cadence={cadence} key={plan.name} plan={plan} />
							))}
						</TabsContent>
					))}
				</Tabs>
				<p className="mt-7 text-center text-[#60708a] text-sm">
					Hosted plans include 5 approved origins and no overage charges.
				</p>
			</div>
		</section>
	);
}
