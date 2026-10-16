"use client";

import { AvatarSelect } from "@/registry/blobz/blocks/avatar-select";

const PEOPLE = [
	{
		avatar: { name: "Raj", palette: ["#dff4ff", "#38bdf8"] },
		description: "Product designer",
		id: "raj",
		name: "Raj Reddy",
	},
	{
		avatar: {
			name: "Janaki",
			palette: ["#e7fbe8", "#9ce786"],
		},
		description: "Engineering lead",
		id: "janaki",
		name: "Janaki Ammal",
	},
	{
		avatar: {
			name: "Vikram",
			palette: ["#fff0e2", "#fa9769"],
		},
		description: "Platform engineer",
		id: "vikram",
		name: "Vikram Sarabhai",
	},
] as const;

export function AvatarSelectExample() {
	return (
		<AvatarSelect className="max-w-sm" defaultValue="raj" items={PEOPLE} />
	);
}
