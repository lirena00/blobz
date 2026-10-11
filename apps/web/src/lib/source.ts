import { llms, loader } from "fumadocs-core/source";
import { defineDocs } from "fumadocs-mdx/macro";

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
	source: docs.toFumadocsSource(),
});

export const docsLlms = llms(source, {
	renderPage: async (page) =>
		`# ${page.data.title} (${page.url})\n\n${await page.data.getText("processed")}`,
});
