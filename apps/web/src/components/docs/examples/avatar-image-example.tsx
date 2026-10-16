import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AvatarImageExample() {
	return (
		<div className="flex flex-wrap justify-center gap-8 sm:gap-12">
			<div className="flex flex-col items-center gap-3">
				<Avatar size="xl">
					<AvatarImage alt="Lirena" src="https://www.lirena.in/favicon.jpg" />
					<AvatarFallback name="Lirena" />
				</Avatar>
				<span className="text-muted-foreground text-xs">Image</span>
			</div>
			<div className="flex flex-col items-center gap-3">
				<Avatar size="xl">
					<AvatarFallback name="Lirena" />
				</Avatar>
				<span className="text-muted-foreground text-xs">Generated</span>
			</div>
			<div className="flex flex-col items-center gap-3">
				<Avatar size="xl">
					<AvatarImage alt="Lirena" src="data:image/png;base64,invalid" />
					<AvatarFallback name="Lirena" />
				</Avatar>
				<span className="text-muted-foreground text-xs">Image unavailable</span>
			</div>
		</div>
	);
}
