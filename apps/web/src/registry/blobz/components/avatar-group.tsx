import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";

import type { BlobAvatarProps } from "@/registry/blobz/components/avatar";

const avatarGroupFrameVariants = cva(
	"relative not-first:-ms-2 inline-flex shrink-0 ring-2 ring-background",
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

const avatarGroupCountVariants = cva(
	"relative inline-flex shrink-0 items-center justify-center bg-muted font-medium text-muted-foreground ring-2 ring-background",
	{
		defaultVariants: {
			frame: "rounded",
			size: "default",
		},
		variants: {
			frame: {
				circle: "rounded-full",
				rounded: "rounded-lg",
				square: "rounded-none",
			},
			size: {
				default: "size-10 text-sm",
				lg: "size-12 text-sm",
				sm: "size-8 text-xs",
				xl: "size-16 text-base",
			},
		},
	}
);

export function BlobAvatarGroup({
	className,
	...props
}: ComponentProps<"fieldset">) {
	return (
		<fieldset
			className={cn("flex min-w-0 items-center border-0 p-0", className)}
			data-slot="blob-avatar-group"
			{...props}
		/>
	);
}

export function BlobAvatarGroupItem({
	className,
	frame = "rounded",
	...props
}: ComponentProps<"span"> & { readonly frame?: BlobAvatarProps["frame"] }) {
	return (
		<span
			className={cn(avatarGroupFrameVariants({ frame }), className)}
			data-frame={frame}
			data-slot="blob-avatar-group-item"
			{...props}
		/>
	);
}

export interface BlobAvatarGroupCountProps
	extends Omit<ComponentProps<"span">, "children">,
		VariantProps<typeof avatarGroupCountVariants> {
	readonly count: number;
	readonly label?: string;
}

export function BlobAvatarGroupCount({
	className,
	count,
	frame = "rounded",
	label = `${count} more people`,
	size = "default",
	...props
}: BlobAvatarGroupCountProps) {
	return (
		<span
			className={cn(
				avatarGroupCountVariants({ frame, size }),
				"not-first:-ms-2",
				className
			)}
			data-frame={frame}
			data-slot="blob-avatar-group-count"
			{...props}
		>
			<span aria-hidden="true">+{count}</span>
			<span className="sr-only">{label}</span>
		</span>
	);
}

export { avatarGroupCountVariants, avatarGroupFrameVariants };
