import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const SIZES = ["sm", "default", "lg", "xl"] as const;

export function AvatarSizesExample() {
	return (
		<div className="flex flex-wrap items-end justify-center gap-7">
			{SIZES.map((size) => (
				<div className="flex flex-col items-center gap-3" key={size}>
					<Avatar size={size}>
						<AvatarFallback name="Janaki" />
					</Avatar>
					<span className="text-muted-foreground text-xs">{size}</span>
				</div>
			))}
		</div>
	);
}
