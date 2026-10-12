import type { Metadata } from "next";
import type { ReactNode } from "react";

const description =
	"Sign in to manage the Blobz hosted avatar API, approved origins, usage, and billing.";

export const metadata: Metadata = {
	alternates: { canonical: "/login" },
	description,
	openGraph: {
		description,
		siteName: "Blobz",
		title: "Sign in to Blobz",
		type: "website",
		url: "/login",
	},
	robots: { follow: false, index: false },
	title: "Sign in to Blobz",
	twitter: {
		card: "summary_large_image",
		description,
		title: "Sign in to Blobz",
	},
};

export default function LoginLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	return children;
}
