import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
	MarkdownCopyButton,
	ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentProps } from "react";
import { OpenAPIPage } from "@/components/api-page";
import { DocsThemeSwitch } from "@/components/docs/docs-theme-switch";
import { getMDXComponents } from "@/components/mdx";
import {
	getPageImageUrl,
	getPageMarkdownUrl,
	getPageSourceUrl,
	SITE_URL,
} from "@/lib/docs-shared";
import { openapi } from "@/lib/openapi";
import { source } from "@/lib/source";

interface DocumentationPageProps {
	readonly params: Promise<{ slug?: string[] }>;
}

export const generateStaticParams = () => source.generateParams();

export async function generateMetadata({
	params,
}: DocumentationPageProps): Promise<Metadata> {
	const { slug } = await params;
	const page = source.getPage(slug);
	if (!page) {
		return {};
	}
	const image = getPageImageUrl(page);
	return {
		alternates: {
			canonical: page.url,
		},
		description: page.data.description,
		openGraph: {
			description: page.data.description,
			images: [
				{
					alt: `${page.data.title} — Blobz documentation`,
					height: 630,
					url: image.url,
					width: 1200,
				},
			],
			title: page.data.title,
			type: "article",
			url: page.url,
		},
		title: page.data.title,
		twitter: {
			card: "summary_large_image",
			description: page.data.description,
			images: [image.url],
			title: page.data.title,
		},
	};
}

export default async function DocumentationPage({
	params,
}: DocumentationPageProps) {
	const { slug } = await params;
	const page = source.getPage(slug);
	if (!page) {
		notFound();
	}

	const Content = page.data.body;
	const markdownUrl = getPageMarkdownUrl(page).url;
	const components = getMDXComponents({
		// The generated MDX override must close over this page's preloaded API data.
		// biome-ignore lint/correctness/noNestedComponentDefinitions: Fumadocs' OpenAPI adapter requires a page-scoped component override.
		OpenAPIPage: async (props: ComponentProps<typeof OpenAPIPage>) => (
			<OpenAPIPage {...(await openapi.preloadOpenAPIPage(page))} {...props} />
		),
	});

	return (
		<DocsPage
			full={page.data.full}
			tableOfContent={{ header: <DocsThemeSwitch /> }}
			tableOfContentPopover={{ header: <DocsThemeSwitch /> }}
			toc={page.data.toc}
		>
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription>{page.data.description}</DocsDescription>
			<div className="not-prose flex items-center gap-2 border-border border-b pt-2 pb-6">
				<MarkdownCopyButton markdownUrl={markdownUrl} />
				<ViewOptionsPopover
					githubUrl={getPageSourceUrl(page.path)}
					markdownUrl={markdownUrl}
					pageUrl={new URL(page.url, SITE_URL).toString()}
				/>
			</div>
			<DocsBody>
				<Content components={components} />
			</DocsBody>
		</DocsPage>
	);
}
