import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { docsLayoutOptions } from "@/lib/docs-layout";
import { source } from "@/lib/source";

export const metadata: Metadata = {
	description:
		"Complete guides for Blobz components, the React package, and the hosted avatar API.",
	title: {
		default: "Blobz documentation",
		template: "%s | Blobz docs",
	},
};

export const viewport: Viewport = {
	themeColor: "#071426",
};

export default function DocumentationLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	return (
		<DocsLayout
			{...docsLayoutOptions()}
			containerProps={{
				className: "bg-fd-background text-fd-foreground",
			}}
			tree={source.getPageTree()}
		>
			{children}
		</DocsLayout>
	);
}
