import { Avatar } from "@blobz/react";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { CloudIcon, HouseIcon, PackageIcon } from "lucide-react";

export const docsLayoutOptions = (): BaseLayoutProps => ({
	links: [
		{
			active: "nested-url",
			icon: <PackageIcon aria-hidden="true" />,
			text: "React package",
			url: "/docs/react",
		},
		{
			active: "nested-url",
			icon: <CloudIcon aria-hidden="true" />,
			text: "Hosted API",
			url: "/docs/api",
		},
		{
			icon: <HouseIcon aria-hidden="true" />,
			label: "Blobz home",
			text: "Home",
			type: "icon",
			url: "/",
		},
	],
	nav: {
		title: (
			<span className="flex items-center gap-2 font-semibold">
				<Avatar alt="" name="blobz docs" size={28} />
				<span>Blobz docs</span>
			</span>
		),
		url: "/docs",
	},
	themeSwitch: {
		enabled: false,
	},
});
