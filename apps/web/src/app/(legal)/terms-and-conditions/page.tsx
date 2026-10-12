import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
	alternates: { canonical: "/terms-and-conditions" },
	description:
		"Terms for using the Blobz website, free toolkit, and hosted avatar API.",
	title: "Terms and conditions | Blobz",
};

const SECTIONS = [
	{ id: "service", label: "The service" },
	{ id: "accounts", label: "Accounts and use" },
	{ id: "subscriptions", label: "Paid subscriptions" },
	{ id: "content", label: "Your inputs and the toolkit" },
	{ id: "availability", label: "Availability and changes" },
	{ id: "contact", label: "Questions" },
] as const;

export default function TermsAndConditionsPage() {
	return (
		<LegalPage
			intro="These terms explain how you may use Blobz and what to expect from the free toolkit and hosted API."
			sections={SECTIONS}
			title="Terms & conditions"
		>
			<LegalSection id="service" title="The service">
				<p>
					Blobz creates deterministic avatars from a seed you provide. The free
					toolkit runs in your app. The hosted API provides image URLs under a
					paid subscription. By using the website or hosted service, you agree
					to these terms and the linked policies.
				</p>
			</LegalSection>
			<LegalSection id="accounts" title="Accounts and acceptable use">
				<p>
					Keep your account credentials secure and provide accurate account
					information. You are responsible for activity through your account and
					for the seeds you place in hosted API URLs. Do not use Blobz to break
					the law, interfere with the service, bypass usage limits or origin
					restrictions, or harm other users.
				</p>
				<p>
					Hosted image URLs are public. Do not put sensitive personal data in a
					seed unless its exposure in the URL is acceptable to you.
				</p>
			</LegalSection>
			<LegalSection id="subscriptions" title="Paid subscriptions">
				<p>
					The checkout page shows the plan price and billing period before you
					pay. Paid API access begins after payment is confirmed. Each plan has
					an account-wide request allowance and an approved-origin limit shown
					on the pricing page. Requests over the allowance are not charged as
					overages; service may be limited until the allowance resets.
				</p>
				<p>
					Subscriptions renew for the selected billing period unless you cancel
					renewal in the dashboard. After cancellation, access continues through
					the current paid period and then ends. See our{" "}
					<Link href={{ pathname: "/refund-policy" }}>refund policy</Link> for
					the no-refund terms and legally required exceptions.
				</p>
			</LegalSection>
			<LegalSection id="content" title="Your inputs and the toolkit">
				<p>
					You remain responsible for the data you supply as avatar seeds and for
					how you use generated avatars. The open-source toolkit is also subject
					to its repository license. These terms do not transfer ownership of
					your input data to Blobz.
				</p>
			</LegalSection>
			<LegalSection id="availability" title="Availability and changes">
				<p>
					We work to keep Blobz available, but uninterrupted access is not
					guaranteed. We may update features, plans, or these terms as the
					service evolves. Material changes to a paid plan will be communicated
					before they take effect where required by law.
				</p>
			</LegalSection>
			<LegalSection id="contact" title="Questions">
				<p>
					For questions about these terms or your subscription, email
					<a href="mailto:hi@lirena.in"> hi@lirena.in</a>.
				</p>
			</LegalSection>
		</LegalPage>
	);
}
