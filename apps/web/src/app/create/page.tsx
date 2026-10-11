import type { Metadata } from "next";

import { BlobzCreator } from "./blobz-creator";

export const metadata: Metadata = {
	description:
		"Generate a Blobz from any string or build one feature by feature, then copy its config and export it as PNG or SVG.",
	openGraph: {
		description:
			"Generate a Blobz from any string, customize it, and export it as PNG or SVG.",
		title: "Create your Blobz",
	},
	title: "Create your Blobz",
	twitter: {
		description:
			"Generate a Blobz from any string, customize it, and export it as PNG or SVG.",
		title: "Create your Blobz",
	},
};

export default function CreatePage() {
	return <BlobzCreator />;
}
