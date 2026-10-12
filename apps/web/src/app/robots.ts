import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			allow: ["/", "/create", "/docs/"],
			disallow: ["/api/", "/dashboard", "/login", "/og/"],
			userAgent: "*",
		},
		sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
	};
}
