import { AvatarTeamList } from "@/registry/blobz/blocks/avatar-team-list";

const TEAM_MEMBERS = [
	{
		avatar: {
			name: "Ada Lovelace",
			palette: ["#dff4ff", "#38bdf8"],
		},
		description: "ada@example.com",
		id: "ada",
		name: "Ada Lovelace",
		role: "Owner",
		status: "online",
	},
	{
		avatar: {
			name: "Grace Hopper",
			palette: ["#dff4ff", "#38bdf8"],
		},
		description: "grace@example.com",
		id: "grace",
		name: "Grace Hopper",
		role: "Engineer",
		status: "away",
	},
	{
		avatar: {
			name: "Katherine Johnson",
			palette: ["#dff4ff", "#38bdf8"],
		},
		description: "katherine@example.com",
		id: "katherine",
		name: "Katherine Johnson",
		role: "Scientist",
		status: "offline",
	},
] as const;

export function AvatarTeamListExample() {
	return <AvatarTeamList className="w-full max-w-xl" members={TEAM_MEMBERS} />;
}
