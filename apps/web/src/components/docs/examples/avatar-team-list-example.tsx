import { DEMO_PEOPLE, getFirstName } from "@/lib/demo-people";
import { AvatarTeamList } from "@/registry/blobz/blocks/avatar-team-list";

const TEAM_MEMBERS = [
	{
		avatar: {
			name: getFirstName(DEMO_PEOPLE.janakiAmmal),
			palette: ["#dff4ff", "#38bdf8"],
		},
		description: "janaki@example.com",
		id: "janaki",
		name: DEMO_PEOPLE.janakiAmmal,
		role: "Owner",
		status: "online",
	},
	{
		avatar: {
			name: getFirstName(DEMO_PEOPLE.vikramSarabhai),
			palette: ["#fff0e2", "#fa9769"],
		},
		description: "vikram@example.com",
		id: "vikram",
		name: DEMO_PEOPLE.vikramSarabhai,
		role: "Engineer",
		status: "away",
	},
	{
		avatar: {
			name: getFirstName(DEMO_PEOPLE.kalpanaChawla),
			palette: ["#e7fbe8", "#9ce786"],
		},
		description: "kalpana@example.com",
		id: "kalpana",
		name: DEMO_PEOPLE.kalpanaChawla,
		role: "Scientist",
		status: "offline",
	},
] as const;

export function AvatarTeamListExample() {
	return <AvatarTeamList className="w-full max-w-xl" members={TEAM_MEMBERS} />;
}
