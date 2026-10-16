import { AvatarTeamList } from "@/registry/blobz/blocks/avatar-team-list";

const TEAM_MEMBERS = [
	{
		avatar: {
			name: "Janaki",
			palette: ["#dff4ff", "#38bdf8"],
		},
		description: "janaki@example.com",
		id: "janaki",
		name: "Janaki Ammal",
		role: "Owner",
		status: "online",
	},
	{
		avatar: {
			name: "Vikram",
			palette: ["#fff0e2", "#fa9769"],
		},
		description: "vikram@example.com",
		id: "vikram",
		name: "Vikram Sarabhai",
		role: "Engineer",
		status: "away",
	},
	{
		avatar: {
			name: "Kalpana",
			palette: ["#e7fbe8", "#9ce786"],
		},
		description: "kalpana@example.com",
		id: "kalpana",
		name: "Kalpana Chawla",
		role: "Scientist",
		status: "offline",
	},
] as const;

export function AvatarTeamListExample() {
	return <AvatarTeamList className="w-full max-w-xl" members={TEAM_MEMBERS} />;
}
