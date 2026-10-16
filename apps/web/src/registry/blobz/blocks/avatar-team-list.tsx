import { cn } from "cn";
import type { ComponentProps, ReactNode } from "react";
import {
	Avatar,
	AvatarBadge,
	AvatarFallback,
	AvatarImage,
	type AvatarSource,
	type AvatarStatus,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	AvatarProfile,
	AvatarProfileAction,
	AvatarProfileContent,
	AvatarProfileDescription,
	AvatarProfileName,
} from "@/registry/blobz/components/avatar-profile";

export interface AvatarTeamMember {
	readonly action?: ReactNode;
	readonly avatar: AvatarSource;
	readonly description?: string;
	readonly id: string;
	readonly name: string;
	readonly role?: string;
	readonly status?: AvatarStatus;
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
				"flex w-full flex-col divide-y divide-border/60 overflow-hidden rounded-2xl border border-border bg-card p-1 shadow-xs",
				className
			)}
			data-slot="avatar-team-list"
			{...props}
		>
			{members.map((member) => (
				<li data-slot="avatar-team-list-item" key={member.id}>
					<AvatarProfile density="spacious">
						<Avatar frame={member.avatar.frame}>
							<AvatarImage alt="" src={member.avatar.src} />
							<AvatarFallback
								alt=""
								choices={member.avatar.choices}
								name={member.avatar.name}
								palette={member.avatar.palette}
							/>
							{member.status ? <AvatarBadge status={member.status} /> : null}
						</Avatar>
						<AvatarProfileContent>
							<div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
								<AvatarProfileName>{member.name}</AvatarProfileName>
								{member.role ? (
									<Badge variant="secondary">{member.role}</Badge>
								) : null}
							</div>
							{member.description ? (
								<AvatarProfileDescription>
									{member.description}
								</AvatarProfileDescription>
							) : null}
						</AvatarProfileContent>
						{member.action ? (
							<AvatarProfileAction>{member.action}</AvatarProfileAction>
						) : null}
					</AvatarProfile>
				</li>
			))}
		</ul>
	);
}
