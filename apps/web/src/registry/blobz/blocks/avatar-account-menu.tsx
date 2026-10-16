"use client";

import { cn } from "cn";
import type { ReactNode } from "react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	type AvatarSource,
} from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AvatarProfile,
	AvatarProfileContent,
	AvatarProfileDescription,
	AvatarProfileName,
} from "@/registry/blobz/components/avatar-profile";

export interface AvatarAccountMenuAction {
	readonly disabled?: boolean;
	readonly icon?: ReactNode;
	readonly id: string;
	readonly label: string;
	readonly onSelect: () => void;
	readonly variant?: "default" | "destructive";
}

export interface AvatarAccountMenuProps {
	readonly actions: readonly AvatarAccountMenuAction[];
	readonly avatar: AvatarSource;
	readonly className?: string;
	readonly contentClassName?: string;
	readonly email?: string;
	readonly name: string;
	readonly signOutAction?: AvatarAccountMenuAction;
	readonly triggerLabel?: string;
}

export function AvatarAccountMenu({
	actions,
	avatar,
	className,
	contentClassName,
	email,
	name,
	signOutAction,
	triggerLabel = `Open account menu for ${name}`,
}: AvatarAccountMenuProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				aria-label={triggerLabel}
				className={cn(
					"inline-flex rounded-xl border border-border/70 bg-card p-1 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring data-[frame=circle]:rounded-full data-[frame=square]:rounded-none motion-reduce:transition-none",
					className
				)}
				data-frame={avatar.frame ?? "rounded"}
			>
				<Avatar frame={avatar.frame} variant="outline">
					<AvatarImage alt="" src={avatar.src} />
					<AvatarFallback
						alt=""
						choices={avatar.choices}
						name={avatar.name}
						palette={avatar.palette}
					/>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className={cn("min-w-64", contentClassName)}
				sideOffset={8}
			>
				<DropdownMenuGroup>
					<DropdownMenuLabel>
						<AvatarProfile density="compact">
							<Avatar frame={avatar.frame} size="lg">
								<AvatarImage alt="" src={avatar.src} />
								<AvatarFallback
									alt=""
									choices={avatar.choices}
									name={avatar.name}
									palette={avatar.palette}
								/>
							</Avatar>
							<AvatarProfileContent>
								<AvatarProfileName>{name}</AvatarProfileName>
								{email ? (
									<AvatarProfileDescription>{email}</AvatarProfileDescription>
								) : null}
							</AvatarProfileContent>
						</AvatarProfile>
					</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{actions.map((action) => (
						<DropdownMenuItem
							disabled={action.disabled}
							key={action.id}
							onClick={action.onSelect}
							variant={action.variant}
						>
							{action.icon}
							{action.label}
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
				{signOutAction ? (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem
								disabled={signOutAction.disabled}
								onClick={signOutAction.onSelect}
								variant={signOutAction.variant ?? "destructive"}
							>
								{signOutAction.icon}
								{signOutAction.label}
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</>
				) : null}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
