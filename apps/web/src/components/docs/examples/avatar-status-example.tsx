import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;

export function AvatarStatusExample() {
	return (
		<div className="flex items-center gap-6">
			<Avatar size="xl">
				<AvatarFallback
					alt={`${"Janaki Ammal"} avatar`}
					name={"Janaki"}
					palette={BLUE_PALETTE}
				/>
				<AvatarBadge status="online" />
			</Avatar>
			<Avatar size="xl">
				<AvatarFallback
					alt={`${"Vikram Sarabhai"} avatar`}
					name={"Vikram"}
					palette={BLUE_PALETTE}
				/>
				<AvatarBadge status="away" />
			</Avatar>
			<Avatar size="xl">
				<AvatarFallback
					alt={`${"Kalpana Chawla"} avatar`}
					name={"Kalpana"}
					palette={BLUE_PALETTE}
				/>
				<AvatarBadge status="busy" />
			</Avatar>
			<Avatar size="xl">
				<AvatarFallback
					alt={`${"Srinivasa Ramanujan"} avatar`}
					name={"Srinivasa"}
					palette={BLUE_PALETTE}
				/>
				<AvatarBadge status="offline" />
			</Avatar>
		</div>
	);
}
