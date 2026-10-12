import { Badge } from "@blobz/ui/components/badge";
import { buttonVariants } from "@blobz/ui/components/button";
import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@blobz/ui/components/card";
import { ArrowRight, Code2, Zap } from "lucide-react";
import Link from "next/link";

const ANNUAL_PLANS = [
	{
		annualPrice: "$49.90",
		featured: true,
		monthlyTotal: "$59.88",
		name: "Plus",
		requests: "5M",
	},
	{
		annualPrice: "$99.90",
		featured: false,
		monthlyTotal: "$119.88",
		name: "Pro",
		requests: "10M",
	},
] as const;

export function Pricing() {
	return (
		<section
			aria-labelledby="api-pricing-title"
			className="scroll-mt-20 bg-[#f7fcff] px-6 pt-24 pb-28 max-[640px]:px-4 max-[640px]:pt-16 max-[640px]:pb-20"
			id="api"
		>
			<div className="mx-auto max-w-[78rem]">
				<div className="flex flex-wrap items-end justify-between gap-8">
					<div>
						<p className="mb-4 font-[850] text-[0.72rem] text-sky-600 uppercase tracking-[0.17em]">
							Pricing
						</p>
						<h2
							className="font-[780] font-[family-name:var(--font-bricolage)] text-[clamp(3rem,6vw,6rem)] leading-[0.93] tracking-[-0.055em] max-[640px]:text-[3.2rem]"
							id="api-pricing-title"
						>
							Pay for the URL,
							<br />
							not the avatar.
						</h2>
					</div>
					<div className="flex items-center gap-3 rounded-full border border-sky-200 bg-[#e8f7ff] py-2 pr-5 pl-2 font-semibold text-sky-900 text-sm">
						<span className="grid size-9 place-items-center rounded-full bg-sky-500 text-white">
							<Zap aria-hidden="true" className="size-4" />
						</span>
						Yearly billing · 2 months free
					</div>
				</div>

				<Card className="mt-12 gap-4 border border-sky-100 bg-white py-5 md:flex-row md:items-center md:justify-between">
					<CardHeader className="gap-1 md:gap-2">
						<div className="flex items-center gap-3">
							<span className="grid size-10 place-items-center rounded-xl bg-sky-100 text-sky-700">
								<Code2 aria-hidden="true" className="size-5" />
							</span>
							<CardTitle>
								<h3 className="font-[760] text-lg">React package</h3>
							</CardTitle>
							<Badge variant="secondary">Free forever</Badge>
						</div>
						<p className="pl-[3.25rem] text-[#60708a] text-sm">
							Generate unlimited avatars in your app. No account needed.
						</p>
					</CardHeader>
					<CardFooter className="md:shrink-0">
						<Link
							className={buttonVariants({ variant: "outline" })}
							href="/docs/react"
						>
							Use the package
							<ArrowRight aria-hidden="true" data-icon="inline-end" />
						</Link>
					</CardFooter>
				</Card>

				<div className="mt-5 grid gap-5 md:grid-cols-2">
					{ANNUAL_PLANS.map((plan) => (
						<Card
							className={
								plan.featured
									? "gap-6 bg-[linear-gradient(145deg,#dff4ff,#fff_70%)] shadow-[0_24px_70px_rgb(14_165_233_/_14%)] ring-2 ring-sky-400"
									: "gap-6 bg-white ring-1 ring-sky-100"
							}
							key={plan.name}
						>
							<CardHeader>
								<CardTitle>
									<h3 className="font-[760] font-[family-name:var(--font-bricolage)] text-2xl tracking-[-0.04em]">
										{plan.name}
									</h3>
								</CardTitle>
								<CardAction>
									<Badge variant={plan.featured ? "default" : "secondary"}>
										Hosted API
									</Badge>
								</CardAction>
							</CardHeader>
							<CardContent className="flex-1">
								<p className="font-[family-name:var(--font-bricolage)] tabular-nums">
									<strong className="font-[780] text-[clamp(2.8rem,5vw,4.5rem)] leading-none tracking-[-0.06em]">
										{plan.annualPrice}
									</strong>
									<span className="ml-2 text-[#60708a] text-sm">/ year</span>
								</p>
								<p className="mt-2 text-[#60708a] text-sm">
									<span className="line-through">{plan.monthlyTotal}</span> if
									billed monthly
								</p>
								<div className="mt-9 flex items-end justify-between gap-4">
									<p>
										<strong className="font-[780] font-[family-name:var(--font-bricolage)] text-4xl tracking-[-0.05em]">
											{plan.requests}
										</strong>
										<span className="ml-2 text-[#60708a] text-sm">
											requests / month
										</span>
									</p>
								</div>
								<div
									aria-hidden="true"
									className="mt-4 h-2.5 overflow-hidden rounded-full bg-sky-100"
								>
									<div
										className={`h-full rounded-full bg-sky-500 ${plan.featured ? "w-1/2" : "w-full"}`}
									/>
								</div>
							</CardContent>
							<CardFooter>
								<Link
									className={buttonVariants({
										className: "w-full justify-between",
										size: "lg",
										variant: "default",
									})}
									href="/dashboard"
								>
									Choose {plan.name} yearly
									<ArrowRight aria-hidden="true" data-icon="inline-end" />
								</Link>
							</CardFooter>
						</Card>
					))}
				</div>
				<p className="mt-7 text-center text-[#60708a] text-sm">
					5 approved origins · no overage charges · monthly billing available in
					the dashboard
				</p>
			</div>
		</section>
	);
}
