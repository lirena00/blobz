import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;

export function AvatarSquareExample() {
	return (
		<div className="flex items-center gap-5">
			<Avatar frame="square" size="xl">
				<AvatarFallback
					alt={`${"Kalpana Chawla"} avatar`}
					name={"Kalpana"}
					palette={BLUE_PALETTE}
				/>
			</Avatar>
			<Avatar frame="square" size="xl" variant="outline">
				<AvatarFallback
					alt={`${"Srinivasa Ramanujan"} avatar`}
					name={"Srinivasa"}
					palette={BLUE_PALETTE}
				/>
			</Avatar>
		</div>
	);
}
