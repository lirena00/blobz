import type { AvatarFrame, AvatarPalette } from "@blobz/avatar-core";
import { DEMO_PEOPLE } from "@/lib/demo-people";

export interface HeroAvatarValue {
	readonly frame: AvatarFrame;
	readonly name: string;
	readonly palette: AvatarPalette;
}

// The light Mint, Peach, Plum, Lemon, and Sky presets from /create.
export const HERO_AVATAR_PRESETS = [
	{
		id: "mint",
		label: "Mint",
		name: DEMO_PEOPLE.janakiAmmal,
		palette: ["#ecfdf5", "#34d399"],
	},
	{
		id: "peach",
		label: "Peach",
		name: DEMO_PEOPLE.vikramSarabhai,
		palette: ["#fff7ed", "#fd8a6a"],
	},
	{
		id: "plum",
		label: "Plum",
		name: DEMO_PEOPLE.kalpanaChawla,
		palette: ["#faf5ff", "#c084fc"],
	},
	{
		id: "lemon",
		label: "Lemon",
		name: DEMO_PEOPLE.salimAli,
		palette: ["#fffbeb", "#fbbf24"],
	},
	{
		id: "sky",
		label: "Sky",
		name: DEMO_PEOPLE.gagandeepKang,
		palette: ["#eef9ff", "#38bdf8"],
	},
] as const;
