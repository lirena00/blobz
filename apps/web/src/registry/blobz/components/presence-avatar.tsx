import { cn } from "cn";
import type { ComponentProps } from "react";
import {
	BlobAvatar,
	type BlobAvatarProps,
} from "@/registry/blobz/components/avatar";

const PRESENCE_LABELS = {
	away: "Away",
	offline: "Offline",
	online: "Online",
	thinking: "Thinking",
} as const;

export type PresenceStatus = keyof typeof PRESENCE_LABELS;

export interface PresenceAvatarProps
	extends Omit<ComponentProps<"span">, "children"> {
	readonly avatar: Omit<BlobAvatarProps, "size">;
	readonly size?: BlobAvatarProps["size"];
	readonly status?: PresenceStatus;
	readonly statusLabel?: string;
	readonly unreadCount?: number;
}

export function PresenceAvatar({
	avatar,
	className,
	size = "lg",
	status = "online",
	statusLabel,
	unreadCount = 0,
	...props
}: PresenceAvatarProps) {
	const hasUnread = unreadCount > 0;
	const label = statusLabel ?? PRESENCE_LABELS[status];

	return (
		<span
			className={cn(
				"relative inline-flex shrink-0 flex-col items-center",
				className
			)}
			data-slot="presence-avatar"
			{...props}
		>
			<span className="relative inline-flex">
				<BlobAvatar {...avatar} size={size} />
				{status !== "thinking" && (
					<span
						aria-label={label}
						className={cn(
							"absolute -end-0.5 -top-0.5 size-3.5 rounded-full ring-[3px] ring-background motion-safe:animate-pulse",
							status === "online" && "bg-emerald-500",
							status === "away" && "bg-amber-500",
							status === "offline" && "bg-zinc-500"
						)}
						data-slot="presence-avatar-indicator"
						role="status"
					/>
				)}
				{hasUnread && (
					<span
						aria-label={`${unreadCount} unread messages`}
						className="absolute -end-2 -bottom-2 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-foreground px-1 font-semibold text-[10px] text-background leading-none"
						data-slot="presence-avatar-unread"
						role="status"
					>
						{unreadCount > 99 ? "99+" : String(unreadCount)}
					</span>
				)}
			</span>
			{status === "thinking" && (
				<span
					aria-label={label}
					className="absolute -bottom-4 flex items-center gap-0.5"
					data-slot="presence-avatar-thinking"
					role="status"
				>
					<span className="size-1 rounded-full bg-muted-foreground motion-safe:animate-pulse" />
					<span className="size-1 rounded-full bg-muted-foreground [animation-delay:150ms] motion-safe:animate-pulse" />
					<span className="size-1 rounded-full bg-muted-foreground [animation-delay:300ms] motion-safe:animate-pulse" />
				</span>
			)}
		</span>
	);
}
