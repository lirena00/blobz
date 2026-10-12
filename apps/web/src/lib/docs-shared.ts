import { createGetUrl } from "fumadocs-core/source";
import { GITHUB_REPOSITORY_URL } from "./site";

export const APP_NAME = "Blobz";
export const DOCS_CONTENT_ROUTE = "/llms.mdx/docs";

const getContentUrl = createGetUrl(DOCS_CONTENT_ROUTE);

interface DocsPageLocation {
	readonly locale?: string;
	readonly slugs: string[];
}

export function getPageMarkdownUrl(page: DocsPageLocation) {
	const segments = [...page.slugs, "content.md"];
	return {
		segments,
		url: getContentUrl(segments, page.locale),
	};
}

export function getPageImageUrl(page: DocsPageLocation) {
	const segments = [...page.slugs, "image.png"];
	return {
		segments,
		url: `/${[page.locale, "og", "docs", ...segments]
			.filter(Boolean)
			.join("/")}`,
	};
}

export function getPageSourceUrl(path: string): string {
	const encodedPath = path
		.split("/")
		.map((segment) => encodeURIComponent(segment))
		.join("/");
	return `${GITHUB_REPOSITORY_URL}/blob/main/apps/web/content/docs/${encodedPath}`;
}
