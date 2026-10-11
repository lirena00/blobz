import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentProps } from "react";
import { OpenAPIPage } from "@/components/api-page";
import { getMDXComponents } from "@/components/mdx";
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
	return {
		description: page.data.description,
		title: page.data.title,
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
	const components = getMDXComponents({
		// The generated MDX override must close over this page's preloaded API data.
		// biome-ignore lint/correctness/noNestedComponentDefinitions: Fumadocs' OpenAPI adapter requires a page-scoped component override.
		OpenAPIPage: async (props: ComponentProps<typeof OpenAPIPage>) => (
			<OpenAPIPage {...(await openapi.preloadOpenAPIPage(page))} {...props} />
		),
	});

	return (
		<DocsPage full={page.data.full} toc={page.data.toc}>
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription>{page.data.description}</DocsDescription>
			<DocsBody>
				<Content components={components} />
			</DocsBody>
		</DocsPage>
	);
}
