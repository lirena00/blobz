import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import {
	BlobAvatar,
	type BlobAvatarProps,
} from "@/registry/blobz/components/avatar";

const avatarStatusVariants = cva(
	"absolute rounded-full ring-2 ring-background",
	{
		defaultVariants: {
			position: "bottom-end",
			size: "default",
			status: "offline",
		},
		variants: {
			position: {
				"bottom-end": "end-0 bottom-0",
				"bottom-start": "start-0 bottom-0",
				"top-end": "end-0 top-0",
				"top-start": "start-0 top-0",
			},
			size: {
				default: "size-3",
				lg: "size-3.5",
				sm: "size-2.5",
				xl: "size-4",
			},
			status: {
				away: "bg-[var(--blob-avatar-status-away)]",
				busy: "bg-[var(--blob-avatar-status-busy)]",
				offline: "bg-[var(--blob-avatar-status-offline)]",
				online: "bg-[var(--blob-avatar-status-online)]",
			},
		},
	}
);

const STATUS_LABELS = {
	away: "Away",
	busy: "Busy",
	offline: "Offline",
	online: "Online",
} as const;

export interface BlobAvatarStatusProps
	extends Omit<BlobAvatarProps, "className">,
		VariantProps<typeof avatarStatusVariants> {
	readonly avatarClassName?: string;
	readonly className?: string;
	readonly indicatorClassName?: string;
	readonly statusLabel?: string;
}

export function BlobAvatarStatus({
	avatarClassName,
	className,
	indicatorClassName,
	position = "bottom-end",
	size = "default",
	status = "offline",
	statusLabel,
	...avatarProps
}: BlobAvatarStatusProps) {
	const resolvedStatus = status ?? "offline";

	return (
		<span
			className={cn("relative inline-flex", className)}
			data-slot="blob-avatar-status"
		>
			<BlobAvatar {...avatarProps} className={avatarClassName} size={size} />
			<span
				aria-label={statusLabel ?? STATUS_LABELS[resolvedStatus]}
				className={cn(
					avatarStatusVariants({ position, size, status: resolvedStatus }),
					indicatorClassName
				)}
				data-slot="blob-avatar-status-indicator"
				role="status"
			/>
		</span>
	);
}

export { avatarStatusVariants };
