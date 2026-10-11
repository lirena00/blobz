import { cn } from "cn";
import type { ComponentProps, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
	BlobAvatar,
	type BlobAvatarProps,
} from "@/registry/blobz/components/avatar";
import {
	BlobAvatarStatus,
	type BlobAvatarStatusProps,
} from "@/registry/blobz/components/avatar-status";

export interface AvatarTeamMember {
	readonly action?: ReactNode;
	readonly avatar: Omit<BlobAvatarProps, "alt">;
	readonly description?: string;
	readonly id: string;
	readonly name: string;
	readonly role?: string;
	readonly status?: NonNullable<BlobAvatarStatusProps["status"]>;
}

export interface AvatarTeamListProps
	extends Omit<ComponentProps<"ul">, "children"> {
	readonly members: readonly AvatarTeamMember[];
}

export function AvatarTeamList({
	className,
	members,
	...props
}: AvatarTeamListProps) {
	return (
		<ul
			className={cn(
				"flex w-full flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-background",
				className
			)}
			data-slot="avatar-team-list"
			{...props}
		>
			{members.map((member) => (
				<li
					className="flex min-w-0 items-center gap-3 px-4 py-3"
					data-slot="avatar-team-list-item"
					key={member.id}
				>
					{member.status ? (
						<BlobAvatarStatus
							{...member.avatar}
							alt=""
							status={member.status}
						/>
					) : (
						<BlobAvatar {...member.avatar} alt="" />
					)}
					<span className="min-w-0 flex-1">
						<span className="flex min-w-0 flex-wrap items-center gap-2">
							<span className="truncate font-medium text-foreground text-sm">
								{member.name}
							</span>
							{member.role ? (
								<Badge variant="secondary">{member.role}</Badge>
							) : null}
						</span>
						{member.description ? (
							<span className="block truncate text-muted-foreground text-xs">
								{member.description}
							</span>
						) : null}
					</span>
					{member.action ? (
						<span className="ms-auto shrink-0">{member.action}</span>
					) : null}
				</li>
			))}
		</ul>
	);
}
