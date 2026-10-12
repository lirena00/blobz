import type { Metadata } from "next";

import { SocialStudio } from "./social-studio";

const description =
	"Create a matching set of Blobz launch images for Product Hunt, Peerlist, and social sharing. Set custom dimensions and download the complete set in one ZIP.";

export const metadata: Metadata = {
	alternates: { canonical: "/socials" },
	description,
	openGraph: {
		description,
		siteName: "Blobz",
		title: "Blobz social image studio",
		type: "website",
		url: "/socials",
	},
	title: "Blobz social image studio",
	twitter: {
		card: "summary_large_image",
		description,
		title: "Blobz social image studio",
	},
};

export default function SocialsPage() {
	return <SocialStudio />;
}
