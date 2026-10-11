import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";
import {
	BlobAvatar,
	type BlobAvatarProps,
} from "@/registry/blobz/components/avatar";

const avatarProfileVariants = cva(
	"flex min-w-0 items-center gap-3 rounded-xl text-sm",
	{
		defaultVariants: {
			density: "default",
			variant: "default",
		},
		variants: {
			density: {
				compact: "gap-2 px-2 py-1.5",
				default: "px-3 py-2.5",
				spacious: "gap-4 px-4 py-3.5",
			},
			variant: {
				default: "bg-transparent",
				muted: "bg-muted/60",
				outline: "border border-border bg-background",
			},
		},
	}
);

export interface AvatarProfileProps
	extends ComponentProps<"div">,
		VariantProps<typeof avatarProfileVariants> {}

export function AvatarProfile({
	className,
	density = "default",
	variant = "default",
	...props
}: AvatarProfileProps) {
	return (
		<div
			className={cn(avatarProfileVariants({ density, variant }), className)}
			data-slot="avatar-profile"
			{...props}
		/>
	);
}

export function AvatarProfileAvatar(props: BlobAvatarProps) {
	return <BlobAvatar {...props} />;
}

export function AvatarProfileContent({
	className,
	...props
}: ComponentProps<"div">) {
	return (
		<div
			className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)}
			data-slot="avatar-profile-content"
			{...props}
		/>
	);
}

export function AvatarProfileName({
	className,
	...props
}: ComponentProps<"p">) {
	return (
		<p
			className={cn("truncate font-medium text-foreground", className)}
			data-slot="avatar-profile-name"
			{...props}
		/>
	);
}

export function AvatarProfileDescription({
	className,
	...props
}: ComponentProps<"p">) {
	return (
		<p
			className={cn("truncate text-muted-foreground text-xs", className)}
			data-slot="avatar-profile-description"
			{...props}
		/>
	);
}

export function AvatarProfileAction({
	className,
	...props
}: ComponentProps<"div">) {
	return (
		<div
			className={cn("ms-auto flex shrink-0 items-center", className)}
			data-slot="avatar-profile-action"
			{...props}
		/>
	);
}

export { avatarProfileVariants };
