import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
	alternates: { canonical: "/privacy-policy" },
	description:
		"How Blobz handles account, analytics, billing, and hosted avatar API data.",
	title: "Privacy policy | Blobz",
};

const SECTIONS = [
	{ id: "scope", label: "What this covers" },
	{ id: "data", label: "Information we handle" },
	{ id: "use", label: "How we use it" },
	{ id: "sharing", label: "Service providers" },
	{ id: "retention", label: "Retention and security" },
	{ id: "choices", label: "Your choices" },
] as const;

export default function PrivacyPolicyPage() {
	return (
		<LegalPage
			intro="This policy explains the information involved when you browse Blobz, create an account, or use the hosted avatar API."
			sections={SECTIONS}
			title="Privacy policy"
		>
			<LegalSection id="scope" title="What this covers">
				<p>
					Blobz provides a free avatar toolkit and a paid hosted image API. The
					free toolkit can generate avatars in your own app without a Blobz
					account or an image request to our servers. This policy covers the
					Blobz website, account dashboard, and hosted API.
				</p>
			</LegalSection>
			<LegalSection id="data" title="Information we handle">
				<ul>
					<li>
						<strong>Account data:</strong> your name, email address, Google
						account identifier, and session information when you sign in.
						Existing accounts may also have a password credential from an
						earlier sign-up.
					</li>
					<li>
						<strong>Security and usage data:</strong> session IP address and
						user agent, approved website origins, endpoint identifiers, request
						counts, and related timestamps for the hosted API.
					</li>
					<li>
						<strong>Website analytics:</strong> our self-hosted Umami instance
						records page views, referrers, browser and device types, and country
						of origin. Its tracking script does not set analytics cookies.
					</li>
					<li>
						<strong>Billing data:</strong> your plan, billing period,
						subscription status, and payment provider identifiers. Checkout and
						payment details are handled by Dodo Payments; Blobz does not store
						your full card number.
					</li>
					<li>
						<strong>Avatar requests:</strong> a seed used in a hosted image URL,
						such as a name or ID, is part of the request and may appear in
						browser history and infrastructure logs. Use an opaque ID instead of
						a private email address or sensitive value.
					</li>
				</ul>
			</LegalSection>
			<LegalSection id="use" title="How we use it">
				<p>
					We use this information to create and secure accounts, provide your
					hosted endpoint, enforce approved origins and usage limits, process
					billing, understand website usage, troubleshoot issues, and prevent
					abuse. We may also use it to respond to your requests and meet
					applicable legal obligations.
				</p>
			</LegalSection>
			<LegalSection id="sharing" title="Service providers">
				<p>
					Google handles account sign-in. Dodo Payments processes checkout and
					subscriptions. Hosting and infrastructure providers may process
					requests and logs needed to deliver the service. We share information
					with providers only as needed for these purposes, or when required by
					law. If you follow a link to a third-party service, its own privacy
					terms apply.
				</p>
			</LegalSection>
			<LegalSection id="retention" title="Retention and security">
				<p>
					We keep account and subscription records while needed to run the
					service and meet legal obligations. The service removes some
					short-lived usage and billing-event records on a schedule; aggregated
					usage totals may be retained longer. We use reasonable technical
					safeguards, but no online service can guarantee absolute security.
				</p>
			</LegalSection>
			<LegalSection id="choices" title="Your choices and questions">
				<p>
					You can stop using the hosted API and cancel renewal from your
					dashboard. For access, correction, deletion, or other privacy
					requests, contact <a href="mailto:hi@lirena.in">hi@lirena.in</a>. We
					will handle requests in line with applicable law. We may update this
					policy as the service changes; the date above shows the latest
					version.
				</p>
			</LegalSection>
		</LegalPage>
	);
}
