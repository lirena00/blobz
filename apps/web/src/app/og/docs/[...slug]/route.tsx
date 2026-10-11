import { notFound } from "next/navigation";

import { createBlobzOgImage } from "@/components/og/blobz-og-image";
import { getPageImageUrl } from "@/lib/docs-shared";
import { source } from "@/lib/source";

export const revalidate = false;

export async function GET(
	_req: Request,
	{ params }: RouteContext<"/og/docs/[...slug]">
) {
	const { slug } = await params;
	const page = source.getPage(slug.slice(0, -1));
	if (!page) {
		notFound();
	}

	return await createBlobzOgImage({
		description:
			page.data.description ??
			"Ready-to-ship avatar components powered by the Blobz React package.",
		seed: page.url,
		title: page.data.title,
	});
}

export function generateStaticParams() {
	return source.getPages().map((page) => ({
		slug: getPageImageUrl(page).segments,
	}));
}
