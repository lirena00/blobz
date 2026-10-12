import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SponsorCard } from "@/components/sponsor-card";
import { docsLayoutOptions } from "@/lib/docs-layout";
import { source } from "@/lib/source";

export const metadata: Metadata = {
	description:
		"Complete guides for Blobz components, the React package, and the hosted avatar API.",
	openGraph: {
		siteName: "Blobz",
		type: "article",
	},
	title: {
		default: "Blobz documentation",
		template: "%s | Blobz docs",
	},
};

export const viewport: Viewport = {
	themeColor: "#38bdf8",
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
			sidebar={{ footer: <SponsorCard compact /> }}
			tree={source.getPageTree()}
		>
			{children}
		</DocsLayout>
	);
}
