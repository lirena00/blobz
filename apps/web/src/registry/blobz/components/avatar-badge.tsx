import { cn } from "cn";
import type { ComponentProps } from "react";
import { Badge as UiBadge } from "@/components/ui/badge";
import {
	BlobAvatar,
	type BlobAvatarProps,
} from "@/registry/blobz/components/avatar";

export interface AvatarBadgeProps
	extends Omit<ComponentProps<"div">, "children"> {
	readonly avatar: Omit<BlobAvatarProps, "alt">;
	readonly badge?: string;
	readonly description?: string;
	readonly name: string;
}

export function AvatarBadge({
	avatar,
	badge,
	className,
	description,
	name,
	...props
}: AvatarBadgeProps) {
	return (
		<div
			className={cn(
				"inline-flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-sm",
				className
			)}
			data-slot="avatar-badge"
			{...props}
		>
			<BlobAvatar {...avatar} alt="" />
			<span className="flex min-w-0 flex-col gap-0.5">
				<span className="flex min-w-0 items-center gap-2">
					<span className="truncate font-semibold text-foreground text-sm">
						{name}
					</span>
					{badge ? <UiBadge variant="secondary">{badge}</UiBadge> : null}
				</span>
				{description ? (
					<span className="truncate text-muted-foreground text-xs">
						{description}
					</span>
				) : null}
			</span>
		</div>
	);
}
