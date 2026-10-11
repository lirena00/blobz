"use client";

import { AvatarSelect } from "@/registry/blobz/blocks/avatar-select";

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;
const PEOPLE = [
	{
		avatar: { name: "Paul Smith", palette: BLUE_PALETTE },
		description: "Product designer",
		id: "paul",
		name: "Paul Smith",
	},
	{
		avatar: { name: "Ada Lovelace", palette: BLUE_PALETTE },
		description: "Engineering lead",
		id: "ada",
		name: "Ada Lovelace",
	},
	{
		avatar: { name: "Grace Hopper", palette: BLUE_PALETTE },
		description: "Platform engineer",
		id: "grace",
		name: "Grace Hopper",
	},
] as const;

export function AvatarSelectExample() {
	return (
		<AvatarSelect
			className="max-w-sm"
			contentClassName="dark"
			defaultValue="paul"
			items={PEOPLE}
		/>
	);
}
