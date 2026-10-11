// biome-ignore-all lint/performance/noJsxPropsBind: Refresh action has no child render cost.
"use client";

import { Button } from "@blobz/ui/components/button";
import { RefreshCwIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

const REFRESH_INTERVAL_MS = 5000;
const MAX_AUTOMATIC_CHECKS = 12;

export default function PaymentStatusRefresh() {
	const router = useRouter();
	const [checking, startChecking] = useTransition();
	const [checks, setChecks] = useState(0);

	useEffect(() => {
		if (checks >= MAX_AUTOMATIC_CHECKS) {
			return;
		}
		const timer = window.setInterval(() => {
			if (document.visibilityState !== "visible") {
				return;
			}
			setChecks((previous) => previous + 1);
			startChecking(() => router.refresh());
		}, REFRESH_INTERVAL_MS);
		return () => window.clearInterval(timer);
	}, [checks, router]);

	return (
		<div className="mt-3 flex flex-wrap items-center gap-3">
			<span className="text-sm" role="status">
				{checks < MAX_AUTOMATIC_CHECKS
					? "Checking payment status automatically…"
					: "Still waiting for confirmation. You can check again."}
			</span>
			<Button
				disabled={checking}
				onClick={() => startChecking(() => router.refresh())}
				size="sm"
				variant="outline"
			>
				<RefreshCwIcon data-icon="inline-start" /> Refresh now
			</Button>
			{checks >= MAX_AUTOMATIC_CHECKS ? (
				<Link
					className="text-sm underline underline-offset-4"
					href="/dashboard"
				>
					Return to dashboard
				</Link>
			) : null}
		</div>
	);
}
