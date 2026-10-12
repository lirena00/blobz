"use client";

import { DEMO_PEOPLE, getFirstName } from "@/lib/demo-people";

import { AvatarSelect } from "@/registry/blobz/blocks/avatar-select";

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;
const PEOPLE = [
	{
		avatar: { name: getFirstName(DEMO_PEOPLE.rajReddy), palette: BLUE_PALETTE },
		description: "Product designer",
		id: "raj",
		name: DEMO_PEOPLE.rajReddy,
	},
	{
		avatar: {
			name: getFirstName(DEMO_PEOPLE.janakiAmmal),
			palette: BLUE_PALETTE,
		},
		description: "Engineering lead",
		id: "janaki",
		name: DEMO_PEOPLE.janakiAmmal,
	},
	{
		avatar: {
			name: getFirstName(DEMO_PEOPLE.vikramSarabhai),
			palette: BLUE_PALETTE,
		},
		description: "Platform engineer",
		id: "vikram",
		name: DEMO_PEOPLE.vikramSarabhai,
	},
] as const;

export function AvatarSelectExample() {
	return (
		<AvatarSelect
			className="max-w-sm"
			contentClassName="dark"
			defaultValue="raj"
			items={PEOPLE}
		/>
	);
}
