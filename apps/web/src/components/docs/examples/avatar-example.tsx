import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;

export function AvatarExample() {
	return (
		<div className="flex items-end gap-5">
			<Avatar size="lg">
				<AvatarFallback
					alt={`${"Janaki Ammal"} avatar`}
					name={"Janaki"}
					palette={BLUE_PALETTE}
				/>
			</Avatar>
			<Avatar size="xl" variant="outline">
				<AvatarFallback
					alt={`${"Vikram Sarabhai"} avatar`}
					name={"Vikram"}
					palette={BLUE_PALETTE}
				/>
			</Avatar>
			<Avatar size="lg" variant="elevated">
				<AvatarFallback
					alt={`${"Kalpana Chawla"} avatar`}
					name={"Kalpana"}
					palette={BLUE_PALETTE}
				/>
			</Avatar>
		</div>
	);
}
