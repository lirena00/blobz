import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { docsLayoutOptions } from "@/lib/docs-layout";
import { source } from "@/lib/source";

export const metadata: Metadata = {
	description:
		"Complete guides and references for the Blobz React package and hosted avatar API.",
	title: {
		default: "Blobz documentation",
		template: "%s | Blobz docs",
	},
};

export default function DocumentationLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	return (
		<DocsLayout {...docsLayoutOptions()} tree={source.getPageTree()}>
			{children}
		</DocsLayout>
	);
}
