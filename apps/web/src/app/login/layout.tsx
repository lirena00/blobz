import type { Metadata } from "next";
import type { ReactNode } from "react";

const description =
	"Sign in to manage the Blobz hosted avatar API, approved origins, usage, and billing.";

export const metadata: Metadata = {
	description,
	openGraph: {
		description,
		title: "Sign in to Blobz",
	},
	title: "Sign in to Blobz",
	twitter: {
		description,
		title: "Sign in to Blobz",
	},
};

export default function LoginLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	return children;
}
