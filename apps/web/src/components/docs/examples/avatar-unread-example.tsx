import {
	Avatar,
	AvatarBadge,
	AvatarCount,
	AvatarFallback,
} from "@/components/ui/avatar";

export function AvatarUnreadExample() {
	return (
		<div className="flex flex-wrap items-center justify-center gap-10">
			<Avatar frame="circle" size="xl">
				<AvatarFallback name="Vikram" palette={["#fff0e2", "#fa9769"]} />
				<AvatarCount count={3} />
			</Avatar>
			<Avatar frame="circle" size="xl">
				<AvatarFallback name="Kalpana" palette={["#e7fbe8", "#9ce786"]} />
				<AvatarBadge status="online" />
				<AvatarCount count={128} />
			</Avatar>
		</div>
	);
}
