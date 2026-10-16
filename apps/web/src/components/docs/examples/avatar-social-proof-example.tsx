import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";

const PEOPLE = [
	{ name: "Janaki", palette: ["#dff4ff", "#38bdf8"] },
	{ name: "Vikram", palette: ["#fff0e2", "#fa9769"] },
	{ name: "Kalpana", palette: ["#e7fbe8", "#9ce786"] },
] as const;

export function AvatarSocialProofExample() {
	return (
		<div className="flex flex-wrap items-center justify-center gap-4">
			<AvatarGroup aria-label="Community members">
				{PEOPLE.map(({ name, palette }) => (
					<Avatar frame="circle" key={name} size="sm">
						<AvatarFallback alt="" name={name} palette={palette} />
					</Avatar>
				))}
			</AvatarGroup>
			<p className="text-muted-foreground text-sm">
				<span className="font-medium text-foreground">
					Made for your people.
				</span>{" "}
				A face for every profile.
			</p>
		</div>
	);
}
