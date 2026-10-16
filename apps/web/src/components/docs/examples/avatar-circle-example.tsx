import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;

export function AvatarCircleExample() {
	return (
		<div className="flex items-center gap-5">
			<Avatar frame="circle" size="xl">
				<AvatarFallback
					alt={`${"Janaki Ammal"} avatar`}
					name={"Janaki"}
					palette={BLUE_PALETTE}
				/>
			</Avatar>
			<Avatar frame="circle" size="xl" variant="outline">
				<AvatarFallback
					alt={`${"Vikram Sarabhai"} avatar`}
					name={"Vikram"}
					palette={BLUE_PALETTE}
				/>
			</Avatar>
		</div>
	);
}
