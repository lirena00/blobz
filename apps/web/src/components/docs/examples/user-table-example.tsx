import {
	UserTable,
	type UserTableRow,
} from "@/registry/blobz/blocks/user-table";

const USERS: readonly UserTableRow[] = [
	{
		avatar: {
			name: "Janaki",
			palette: ["#e7efff", "#91bafa"],
		},
		email: "janaki@example.com",
		id: "janaki",
		lastSeen: "2m ago",
		name: "Janaki Ammal",
		role: "Owner",
		status: "active",
	},
	{
		avatar: {
			name: "Vikram",
			palette: ["#e3fff4", "#46c888"],
		},
		email: "vikram@example.com",
		id: "vikram",
		lastSeen: "1h ago",
		name: "Vikram Sarabhai",
		role: "Admin",
		status: "active",
	},
	{
		avatar: {
			name: "Kalpana",
			palette: ["#e1fff9", "#4bd3b5"],
		},
		email: "kalpana@example.com",
		id: "kalpana",
		lastSeen: "yesterday",
		name: "Kalpana Chawla",
		role: "Developer",
		status: "active",
	},
	{
		avatar: {
			name: "Srinivasa",
			palette: ["#e5f9ff", "#32c4d6"],
		},
		email: "srinivasa@example.com",
		id: "srinivasa",
		lastSeen: "never",
		name: "Srinivasa Ramanujan",
		role: "Developer",
		status: "invited",
	},
	{
		avatar: {
			name: "Gagandeep",
			palette: ["#fff0dc", "#e7ad55"],
		},
		email: "gagandeep@example.com",
		id: "gagandeep",
		lastSeen: "3 weeks ago",
		name: "Gagandeep Kang",
		role: "Billing",
		status: "suspended",
	},
];

export function UserTableExample() {
	return <UserTable className="max-w-3xl" users={USERS} />;
}
