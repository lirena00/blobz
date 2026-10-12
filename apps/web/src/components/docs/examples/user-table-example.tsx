import { DEMO_PEOPLE, getFirstName } from "@/lib/demo-people";
import {
	UserTable,
	type UserTableRow,
} from "@/registry/blobz/blocks/user-table";

const USERS: readonly UserTableRow[] = [
	{
		avatar: {
			name: getFirstName(DEMO_PEOPLE.janakiAmmal),
			palette: ["#e7efff", "#91bafa"],
		},
		email: "janaki@example.com",
		id: "janaki",
		lastSeen: "2m ago",
		name: DEMO_PEOPLE.janakiAmmal,
		role: "Owner",
		status: "active",
	},
	{
		avatar: {
			name: getFirstName(DEMO_PEOPLE.vikramSarabhai),
			palette: ["#e3fff4", "#46c888"],
		},
		email: "vikram@example.com",
		id: "vikram",
		lastSeen: "1h ago",
		name: DEMO_PEOPLE.vikramSarabhai,
		role: "Admin",
		status: "active",
	},
	{
		avatar: {
			name: getFirstName(DEMO_PEOPLE.kalpanaChawla),
			palette: ["#e1fff9", "#4bd3b5"],
		},
		email: "kalpana@example.com",
		id: "kalpana",
		lastSeen: "yesterday",
		name: DEMO_PEOPLE.kalpanaChawla,
		role: "Developer",
		status: "active",
	},
	{
		avatar: {
			name: getFirstName(DEMO_PEOPLE.srinivasaRamanujan),
			palette: ["#e5f9ff", "#32c4d6"],
		},
		email: "srinivasa@example.com",
		id: "srinivasa",
		lastSeen: "never",
		name: DEMO_PEOPLE.srinivasaRamanujan,
		role: "Developer",
		status: "invited",
	},
	{
		avatar: {
			name: getFirstName(DEMO_PEOPLE.gagandeepKang),
			palette: ["#fff0dc", "#e7ad55"],
		},
		email: "gagandeep@example.com",
		id: "gagandeep",
		lastSeen: "3 weeks ago",
		name: DEMO_PEOPLE.gagandeepKang,
		role: "Billing",
		status: "suspended",
	},
];

export function UserTableExample() {
	return <UserTable className="max-w-3xl" users={USERS} />;
}
