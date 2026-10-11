import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";
import {
	BlobAvatar,
	type BlobAvatarProps,
} from "@/registry/blobz/components/avatar";

const avatarChipVariants = cva(
	"inline-flex h-10 max-w-full items-center gap-2 rounded-full px-1.5 pe-3 text-sm",
	{
		defaultVariants: {
			variant: "secondary",
		},
		variants: {
			variant: {
				outline: "border border-border bg-background text-foreground",
				secondary: "bg-secondary text-secondary-foreground",
				soft: "bg-muted text-foreground",
			},
		},
	}
);

export interface AvatarChipProps
	extends ComponentProps<"span">,
		VariantProps<typeof avatarChipVariants> {}

export function AvatarChip({
	className,
	variant = "secondary",
	...props
}: AvatarChipProps) {
	return (
		<span
			className={cn(avatarChipVariants({ variant }), className)}
			data-slot="avatar-chip"
			{...props}
		/>
	);
}

export function AvatarChipAvatar(props: BlobAvatarProps) {
	return <BlobAvatar size="sm" {...props} />;
}

export function AvatarChipLabel({
	className,
	...props
}: ComponentProps<"span">) {
	return (
		<span
			className={cn("truncate", className)}
			data-slot="avatar-chip-label"
			{...props}
		/>
	);
}

export function AvatarChipRemove({
	"aria-label": ariaLabel = "Remove",
	className,
	...props
}: ComponentProps<"button">) {
	return (
		<button
			aria-label={ariaLabel}
			className={cn(
				"-me-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
				className
			)}
			data-slot="avatar-chip-remove"
			type="button"
			{...props}
		>
			<span aria-hidden="true">×</span>
		</button>
	);
}

export { avatarChipVariants };
