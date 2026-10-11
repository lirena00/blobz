import { llms, loader } from "fumadocs-core/source";
import { defineDocs } from "fumadocs-mdx/macro";
import {
	BlocksIcon,
	CloudIcon,
	type LucideIcon,
	PackageIcon,
} from "lucide-react";
import { createElement, type ReactNode } from "react";

const docsSectionIcons = new Map<string, LucideIcon>([
	["components", BlocksIcon],
	["react", PackageIcon],
	["api", CloudIcon],
]);

const resolveDocsIcon = (name: string | undefined): ReactNode => {
	const Icon = name ? docsSectionIcons.get(name) : undefined;

	if (!Icon) {
		return;
	}

	return createElement(Icon, { "aria-hidden": true });
};

const docs = defineDocs({
	dir: "content/docs",
	docs: {
		postprocess: {
			includeProcessedMarkdown: true,
		},
	},
});

export const source = loader({
	baseUrl: "/docs",
	icon: resolveDocsIcon,
	source: docs.toFumadocsSource(),
});

export const docsLlms = llms(source, {
	renderPage: async (page) =>
		`# ${page.data.title} (${page.url})\n\n${await page.data.getText("processed")}`,
});
