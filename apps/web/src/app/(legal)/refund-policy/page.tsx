import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
	alternates: { canonical: "/refund-policy" },
	description:
		"Blobz hosted API subscription cancellation and no-refund policy.",
	title: "Refund policy | Blobz",
};

const SECTIONS = [
	{ id: "no-refunds", label: "No voluntary refunds" },
	{ id: "cancel", label: "Cancel renewal" },
	{ id: "billing-issues", label: "Billing issues and rights" },
] as const;

export default function RefundPolicyPage() {
	return (
		<LegalPage
			intro="Paid hosted API subscriptions are non-refundable. You can stop the next renewal at any time from your dashboard."
			sections={SECTIONS}
			title="Refund policy"
		>
			<LegalSection id="no-refunds" title="No voluntary refunds">
				<p>
					Blobz does not offer voluntary refunds or prorated credits for paid
					hosted API subscriptions, including unused requests or unused time
					within a billing period. Please review the plan and billing period
					before you complete checkout.
				</p>
			</LegalSection>
			<LegalSection id="cancel" title="Cancel renewal">
				<p>
					You can cancel your subscription from the{" "}
					<Link href="/dashboard">dashboard</Link>. Cancellation stops the next
					renewal; your paid API access continues until the end of the current
					billing period. It does not refund that period.
				</p>
			</LegalSection>
			<LegalSection id="billing-issues" title="Billing issues and legal rights">
				<p>
					If you believe a charge was made in error or the service was not
					provided as described, email{" "}
					<a href="mailto:hi@lirena.in">hi@lirena.in</a> with the account email
					and charge details. Do not send a full card number. We will review the
					issue. This policy does not limit any refund, cancellation, or other
					remedy that applicable law requires.
				</p>
			</LegalSection>
		</LegalPage>
	);
}
