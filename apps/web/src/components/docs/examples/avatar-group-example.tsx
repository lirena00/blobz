import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
} from "@/components/ui/avatar";

const TEAM = [
	{ id: "janaki", name: "Janaki", palette: ["#dff4ff", "#38bdf8"] },
	{ id: "vikram", name: "Vikram", palette: ["#fff0e2", "#fa9769"] },
	{ id: "kalpana", name: "Kalpana", palette: ["#e7fbe8", "#9ce786"] },
] as const;

export function AvatarGroupExample() {
	return (
		<AvatarGroup aria-label="Project team">
			{TEAM.map((member) => (
				<Avatar key={member.id}>
					<AvatarFallback alt="" name={member.name} palette={member.palette} />
				</Avatar>
			))}
			<AvatarGroupCount count={4} />
		</AvatarGroup>
	);
}
