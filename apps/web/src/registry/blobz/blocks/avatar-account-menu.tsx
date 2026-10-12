"use client";

import { cva } from "class-variance-authority";
import { cn } from "cn";
import type { ReactNode } from "react";
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
	BlobAvatar,
	type BlobAvatarProps,
} from "@/registry/blobz/components/avatar";

const avatarAccountMenuTriggerVariants = cva(
	"inline-flex rounded-xl border border-border bg-card p-1 shadow-sm outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/50",
	{
		defaultVariants: {
			frame: "rounded",
		},
		variants: {
			frame: {
				circle: "rounded-full",
				rounded: "rounded-lg",
				square: "rounded-none",
			},
		},
	}
);

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
	readonly avatar: Omit<BlobAvatarProps, "alt">;
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
					avatarAccountMenuTriggerVariants({
						frame: avatar.frame ?? "rounded",
					}),
					className
				)}
				data-frame={avatar.frame ?? "rounded"}
			>
				<BlobAvatar {...avatar} alt="" variant="outline" />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className={cn("min-w-64", contentClassName)}
				sideOffset={8}
			>
				<DropdownMenuGroup>
					<DropdownMenuLabel className="flex items-center gap-3">
						<BlobAvatar {...avatar} alt="" size="lg" variant="outline" />
						<span className="min-w-0">
							<span className="block truncate font-medium text-foreground text-sm">
								{name}
							</span>
							{email ? (
								<span className="block truncate text-muted-foreground text-xs">
									{email}
								</span>
							) : null}
						</span>
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

export { avatarAccountMenuTriggerVariants };
