import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
	alternates: { canonical: "/cookie-policy" },
	description: "How Blobz uses cookies and local browser storage.",
	title: "Cookie policy | Blobz",
};

const SECTIONS = [
	{ id: "what", label: "What we use" },
	{ id: "essential", label: "Essential cookies" },
	{ id: "preferences", label: "Preferences" },
	{ id: "analytics", label: "Analytics" },
	{ id: "third-parties", label: "Third-party checkout" },
	{ id: "controls", label: "Your controls" },
] as const;

export default function CookiePolicyPage() {
	return (
		<LegalPage
			intro="A short guide to the cookies and browser storage used by Blobz, Google Analytics, and its checkout provider."
			sections={SECTIONS}
			title="Cookie policy"
		>
			<LegalSection id="what" title="What we use">
				<p>
					Cookies are small pieces of data stored by your browser. Similar
					browser storage can remember interface preferences. Blobz uses these
					technologies for sign-in, preferences, and website analytics.
				</p>
			</LegalSection>
			<LegalSection id="essential" title="Essential cookies">
				<p>
					When you sign in, authentication cookies keep your session working and
					help protect account access. These are necessary for the dashboard and
					cannot be switched off in Blobz while staying signed in. The free
					avatar toolkit does not require a Blobz account.
				</p>
			</LegalSection>
			<LegalSection id="preferences" title="Preferences">
				<p>
					The documentation interface may remember display preferences such as
					theme or sidebar state in your browser. These settings support the
					interface and can be cleared through your browser controls.
				</p>
			</LegalSection>
			<LegalSection id="analytics" title="Analytics">
				<p>
					We use Google Analytics to understand visits and interactions on the
					Blobz website. Its tag can set first-party cookies named _ga and
					_ga_&lt;container-id&gt; to distinguish visitors and sessions. Google
					Analytics also receives page and browser information to produce usage
					reports.
				</p>
			</LegalSection>
			<LegalSection id="third-parties" title="Third-party checkout">
				<p>
					If you choose a paid plan, checkout takes place with Dodo Payments.
					That service may use its own cookies or similar technologies under its
					policies. You can review those details on the checkout page.
				</p>
			</LegalSection>
			<LegalSection id="controls" title="Your controls">
				<p>
					You can remove or block cookies and local storage in your browser.
					Blocking essential cookies may prevent sign-in or dashboard features
					from working. For information about account and analytics data, read
					our <Link href={{ pathname: "/privacy-policy" }}>privacy policy</Link>
					. Questions? Email <a href="mailto:hi@lirena.in">hi@lirena.in</a>.
				</p>
			</LegalSection>
		</LegalPage>
	);
}
