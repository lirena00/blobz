import { DEMO_PEOPLE, getFirstName } from "@/lib/demo-people";
import {
	PresenceAvatar,
	type PresenceStatus,
} from "@/registry/blobz/components/presence-avatar";

const PEOPLE = [
	{
		name: DEMO_PEOPLE.janakiAmmal,
		palette: ["#dff4ff", "#38bdf8"],
		status: "online",
	},
	{
		name: DEMO_PEOPLE.vikramSarabhai,
		palette: ["#f4e8ff", "#b881eb"],
		status: "online",
		unreadCount: 3,
	},
	{
		name: DEMO_PEOPLE.kalpanaChawla,
		palette: ["#e1ffe8", "#91e36c"],
		status: "thinking",
	},
	{
		name: DEMO_PEOPLE.srinivasaRamanujan,
		palette: ["#fff1df", "#f48a61"],
		status: "away",
	},
	{
		name: DEMO_PEOPLE.gagandeepKang,
		palette: ["#e8edff", "#a7a8f4"],
		status: "offline",
		unreadCount: 128,
	},
] as const satisfies readonly {
	name: string;
	palette: readonly [string, string];
	status: PresenceStatus;
	unreadCount?: number;
}[];

export function PresenceAvatarExample() {
	return (
		<div className="grid w-full max-w-2xl grid-cols-2 justify-items-center gap-9 sm:grid-cols-5">
			{PEOPLE.map((person) => (
				<div
					className="flex flex-col items-center gap-5 text-center"
					key={person.name}
				>
					<PresenceAvatar
						avatar={{
							alt: `${person.name} avatar`,
							frame: "circle",
							name: getFirstName(person.name),
							palette: person.palette,
						}}
						status={person.status}
						unreadCount={"unreadCount" in person ? person.unreadCount : 0}
					/>
					<span className="text-muted-foreground text-xs">
						{person.status}
						{"unreadCount" in person ? `, ${person.unreadCount} unread` : ""}
					</span>
				</div>
			))}
		</div>
	);
}
