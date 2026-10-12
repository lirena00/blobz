import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookOpenIcon, HouseIcon } from "lucide-react";
import { DocsNavTitle } from "@/components/docs/docs-nav-title";

export const docsLayoutOptions = (): BaseLayoutProps => ({
	links: [
		{
			icon: <HouseIcon aria-hidden="true" />,
			text: "Home",
			type: "main",
			url: "/",
		},
		{
			icon: <BookOpenIcon aria-hidden="true" />,
			text: "Introduction",
			type: "main",
			url: "/docs",
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
