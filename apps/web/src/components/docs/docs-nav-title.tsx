"use client";

import { Avatar } from "@blobz/react";
import { usePathname } from "next/navigation";

type SectionPalette = readonly [background: string, body: string];

const SECTION_PALETTES = {
	api: ["#ecfdf5", "#34d399"],
	components: ["#dff4ff", "#38bdf8"],
	docs: ["#f5f3ff", "#8b5cf6"],
	react: ["#fff1f2", "#fb7185"],
} as const satisfies Record<string, SectionPalette>;

const getSectionPalette = (pathname: string): SectionPalette => {
	if (pathname.startsWith("/docs/components")) {
		return SECTION_PALETTES.components;
	}
	if (pathname.startsWith("/docs/react")) {
		return SECTION_PALETTES.react;
	}
	if (pathname.startsWith("/docs/api")) {
		return SECTION_PALETTES.api;
	}
	return SECTION_PALETTES.docs;
};

export function DocsNavTitle() {
	const pathname = usePathname();

	return (
		<span className="flex items-center gap-2 font-semibold">
			<Avatar
				alt=""
				name="blobz docs"
				palette={getSectionPalette(pathname)}
				size={28}
			/>
			<span>Blobz docs</span>
		</span>
	);
}
