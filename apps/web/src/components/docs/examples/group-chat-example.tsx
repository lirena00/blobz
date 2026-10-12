import { DEMO_PEOPLE, getFirstName } from "@/lib/demo-people";
import {
	GroupChat,
	type GroupChatPerson,
} from "@/registry/blobz/blocks/group-chat";

const PARTICIPANTS = [
	{
		avatar: {
			name: getFirstName(DEMO_PEOPLE.janakiAmmal),
			palette: ["#dff4ff", "#38bdf8"],
		},
		id: "janaki",
		name: DEMO_PEOPLE.janakiAmmal,
	},
	{
		avatar: {
			name: getFirstName(DEMO_PEOPLE.vikramSarabhai),
			palette: ["#fff0e2", "#fa9769"],
		},
		id: "vikram",
		name: DEMO_PEOPLE.vikramSarabhai,
	},
	{
		avatar: {
			name: getFirstName(DEMO_PEOPLE.kalpanaChawla),
			palette: ["#e7fbe8", "#9ce786"],
		},
		id: "kalpana",
		name: DEMO_PEOPLE.kalpanaChawla,
	},
	{
		avatar: {
			name: getFirstName(DEMO_PEOPLE.srinivasaRamanujan),
			palette: ["#f4e7ff", "#c994ec"],
		},
		id: "srinivasa",
		name: DEMO_PEOPLE.srinivasaRamanujan,
	},
	{
		avatar: {
			name: getFirstName(DEMO_PEOPLE.gagandeepKang),
			palette: ["#fff0e2", "#efa973"],
		},
		id: "gagandeep",
		name: DEMO_PEOPLE.gagandeepKang,
	},
] as const satisfies readonly GroupChatPerson[];

const MESSAGES = [
	{
		author: PARTICIPANTS[0],
		id: "1",
		text: "The new avatars are live. Every account has one now.",
		time: "9:41",
	},
	{
		author: PARTICIPANTS[1],
		id: "2",
		text: "Generated from the name?",
		time: "9:42",
	},
	{
		author: PARTICIPANTS[2],
		id: "3",
		text: "Same name, same face, every time.",
		time: "9:43",
	},
	{
		author: PARTICIPANTS[3],
		id: "4",
		text: "That makes staging and production feel like the same place.",
		time: "9:44",
	},
] as const;

export function GroupChatExample() {
	return (
		<GroupChat
			channel="release"
			className="max-w-2xl"
			messages={MESSAGES}
			participants={PARTICIPANTS}
			typing={PARTICIPANTS[1]}
		/>
	);
}
