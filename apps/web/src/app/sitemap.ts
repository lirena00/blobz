import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { source } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
	const paths = [
		"/",
		"/create",
		"/socials",
		"/privacy-policy",
		"/terms-and-conditions",
		"/cookie-policy",
		"/refund-policy",
		...source.getPages().map((page) => page.url),
	];

	return [...new Set(paths)].map((path) => ({
		url: new URL(path, SITE_URL).toString(),
	}));
}
