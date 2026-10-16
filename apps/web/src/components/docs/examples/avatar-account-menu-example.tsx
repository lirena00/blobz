"use client";

import { AvatarAccountMenu } from "@/registry/blobz/blocks/avatar-account-menu";

const ignoreAction = () => undefined;

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;

const ACTIONS = [
	{
		id: "profile",
		label: "View profile",
		onSelect: ignoreAction,
	},
	{
		id: "settings",
		label: "Account settings",
		onSelect: ignoreAction,
	},
] as const;

export function AvatarAccountMenuExample() {
	return (
		<AvatarAccountMenu
			actions={ACTIONS}
			avatar={{
				name: "Janaki",
				palette: BLUE_PALETTE,
			}}
			email="janaki@example.com"
			name={"Janaki Ammal"}
			signOutAction={{
				id: "sign-out",
				label: "Sign out",
				onSelect: ignoreAction,
			}}
		/>
	);
}
