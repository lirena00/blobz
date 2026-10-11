import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { HouseIcon } from "lucide-react";
import { DocsNavTitle } from "@/components/docs/docs-nav-title";

export const docsLayoutOptions = (): BaseLayoutProps => ({
	links: [
		{
			icon: <HouseIcon aria-hidden="true" />,
			label: "Blobz home",
			text: "Home",
			type: "icon",
			url: "/",
		},
	],
	nav: {
		title: <DocsNavTitle />,
		url: "/docs",
	},
	themeSwitch: {
		enabled: false,
	},
});
