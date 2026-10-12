"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@blobz/ui/components/alert-dialog";
import { Button } from "@blobz/ui/components/button";
import { Spinner } from "@blobz/ui/components/spinner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const date = new Intl.DateTimeFormat("en-US", {
	day: "numeric",
	month: "long",
	timeZone: "UTC",
	year: "numeric",
});

export default function CancelSubscription({
	cancelAtPeriodEnd,
	periodEnd,
}: {
	cancelAtPeriodEnd: boolean;
	periodEnd: string | null;
}) {
	const router = useRouter();
	const [scheduledHere, setScheduledHere] = useState(false);
	const [pending, setPending] = useState(false);
	const [open, setOpen] = useState(false);
	const scheduled = cancelAtPeriodEnd || scheduledHere;
	const endDate = periodEnd ? date.format(new Date(periodEnd)) : null;
	const endLabel = endDate
		? `${endDate} (UTC)`
		: "the end of the current billing period";

	const cancelSubscription = async (): Promise<void> => {
		setPending(true);
		try {
			const response = await fetch("/api/dashboard/billing/cancel", {
				body: "{}",
				credentials: "same-origin",
				headers: { "Content-Type": "application/json" },
				method: "POST",
			});
			if (!response.ok) {
				const data: unknown = await response.json();
				const message =
					typeof data === "object" &&
					data &&
					"error" in data &&
					typeof data.error === "string"
						? data.error
						: "Could not cancel the subscription. Please try again.";
				throw new Error(message);
			}
			setScheduledHere(true);
			setOpen(false);
			toast.success("Subscription cancellation scheduled.");
			router.refresh();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Could not cancel the subscription."
			);
		} finally {
			setPending(false);
		}
	};

	if (scheduled) {
		return (
			<p className="text-muted-foreground text-sm" role="status">
				Cancellation scheduled. Your API access continues until {endLabel}; it
				will not renew.
			</p>
		);
	}

	return (
		<AlertDialog onOpenChange={setOpen} open={open}>
			<AlertDialogTrigger
				render={
					<Button
						className="w-fit"
						disabled={pending}
						size="sm"
						variant="outline"
					/>
				}
			>
				Cancel subscription
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Cancel your subscription?</AlertDialogTitle>
					<AlertDialogDescription>
						Your subscription will not renew. Your image API will keep working
						until {endLabel}, then access will stop.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={pending}>
						Keep subscription
					</AlertDialogCancel>
					<AlertDialogAction
						disabled={pending}
						onClick={cancelSubscription}
						variant="destructive"
					>
						{pending ? <Spinner data-icon="inline-start" /> : null}
						Confirm cancellation
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
