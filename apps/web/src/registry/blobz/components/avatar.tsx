import {
	Avatar as BlobzAvatarImage,
	type AvatarProps as BlobzAvatarImageProps,
} from "@blobz/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const blobAvatarVariants = cva(
	"relative inline-flex shrink-0 overflow-hidden align-middle ring-1 ring-foreground/5",
	{
		defaultVariants: {
			frame: "rounded",
			size: "default",
			variant: "default",
		},
		variants: {
			frame: {
				circle: "rounded-full",
				rounded: "rounded-lg",
				square: "rounded-none",
			},
			size: {
				default: "size-10",
				lg: "size-12",
				sm: "size-8",
				xl: "size-16",
			},
			variant: {
				default: "bg-muted",
				elevated: "bg-muted shadow-md ring-1 ring-border/80",
				outline: "bg-background ring-1 ring-border",
			},
		},
	}
);

export interface BlobAvatarProps
	extends Omit<BlobzAvatarImageProps, "className" | "frame" | "size">,
		VariantProps<typeof blobAvatarVariants> {
	readonly className?: string;
	readonly imageClassName?: string;
}

export function BlobAvatar({
	className,
	frame = "rounded",
	imageClassName,
	size = "default",
	variant = "default",
	...imageProps
}: BlobAvatarProps) {
	return (
		<span
			className={cn(blobAvatarVariants({ frame, size, variant }), className)}
			data-frame={frame}
			data-size={size}
			data-slot="blob-avatar"
			data-variant={variant}
		>
			<BlobzAvatarImage
				{...imageProps}
				className={cn("block size-full object-cover", imageClassName)}
				frame={frame ?? "rounded"}
				size="100%"
			/>
		</span>
	);
}

export { blobAvatarVariants };
