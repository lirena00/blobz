"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import {
	Avatar as GeneratedAvatar,
	type AvatarProps as GeneratedAvatarProps,
} from "@blobz/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { type ComponentProps, createContext, use } from "react";

export type AvatarFrame = NonNullable<GeneratedAvatarProps["frame"]>;
export type AvatarStatus = "online" | "away" | "busy" | "offline";

export interface AvatarSource
	extends Pick<GeneratedAvatarProps, "name" | "palette" | "choices"> {
	readonly frame?: AvatarFrame;
	readonly src?: string;
}

const AvatarFrameContext = createContext<AvatarFrame>("rounded");

const avatarVariants = cva(
	"relative inline-flex shrink-0 select-none items-center justify-center align-middle text-sm [--avatar-inset:0px]",
	{
		defaultVariants: { frame: "rounded", size: "default", variant: "default" },
		variants: {
			frame: {
				circle: "rounded-full",
				// The generated SVG uses an 18px radius in an 80px viewBox.
				rounded: "rounded-[22.5%]",
				square: "rounded-none",
			},
			size: {
				default: "size-10 [--avatar-badge-size:--spacing(3)]",
				lg: "size-12 [--avatar-badge-size:--spacing(3.5)]",
				sm: "size-8 [--avatar-badge-size:--spacing(2.5)]",
				xl: "size-16 [--avatar-badge-size:--spacing(4)]",
			},
			variant: {
				default: "bg-transparent",
				elevated:
					"bg-card p-1 shadow-lg ring-1 ring-border [--avatar-inset:--spacing(1)]",
				outline:
					"bg-transparent ring-2 ring-foreground/40 ring-offset-2 ring-offset-background",
			},
		},
	}
);

export interface AvatarProps
	extends AvatarPrimitive.Root.Props,
		VariantProps<typeof avatarVariants> {}

function Avatar({
	className,
	frame = "rounded",
	size = "default",
	variant = "default",
	...props
}: AvatarProps) {
	return (
		<AvatarFrameContext value={frame ?? "rounded"}>
			<AvatarPrimitive.Root
				className={cn(avatarVariants({ frame, size, variant }), className)}
				data-frame={frame}
				data-size={size}
				data-slot="avatar"
				data-variant={variant}
				{...props}
			/>
		</AvatarFrameContext>
	);
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
	return (
		<AvatarPrimitive.Image
			className={cn(
				"absolute inset-(--avatar-inset) size-[calc(100%_-_var(--avatar-inset)_*_2)] rounded-[inherit] object-cover aria-hidden:hidden data-[error]:hidden data-[loading]:hidden",
				className
			)}
			data-slot="avatar-image"
			{...props}
		/>
	);
}

export interface AvatarFallbackProps
	extends AvatarPrimitive.Fallback.Props,
		Pick<GeneratedAvatarProps, "alt" | "choices" | "palette"> {
	readonly name?: GeneratedAvatarProps["name"];
}

function AvatarFallback({
	alt,
	children,
	choices,
	className,
	name,
	palette,
	...props
}: AvatarFallbackProps) {
	const frame = use(AvatarFrameContext);
	const generated = name !== undefined && children === undefined;
	return (
		<AvatarPrimitive.Fallback
			className={cn(
				"flex size-full items-center justify-center overflow-hidden rounded-[inherit] font-medium text-muted-foreground text-sm",
				generated ? "bg-transparent" : "bg-muted",
				className
			)}
			data-slot="avatar-fallback"
			{...props}
		>
			{generated ? (
				<GeneratedAvatar
					alt={alt}
					choices={choices}
					className="block size-full object-cover"
					frame={frame}
					name={name}
					palette={palette}
					size="100%"
				/>
			) : (
				children
			)}
		</AvatarPrimitive.Fallback>
	);
}

const badgeVariants = cva(
	"absolute z-10 inline-flex size-(--avatar-badge-size) items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background [&>svg]:size-2",
	{
		defaultVariants: { position: "bottom-end" },
		variants: {
			position: {
				"bottom-end": "end-0 bottom-0",
				"bottom-start": "start-0 bottom-0",
				"top-end": "end-0 top-0",
				"top-start": "start-0 top-0",
			},
			status: {
				away: "bg-[var(--avatar-status-away)]",
				busy: "bg-destructive",
				offline: "bg-muted-foreground",
				online: "bg-[var(--avatar-status-online)]",
			},
		},
	}
);

const STATUS_LABELS: Record<AvatarStatus, string> = {
	away: "Away",
	busy: "Busy",
	offline: "Offline",
	online: "Online",
};

function AvatarBadge({
	"aria-label": ariaLabel,
	className,
	position,
	status,
	...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
	return (
		<span
			aria-label={ariaLabel ?? (status ? STATUS_LABELS[status] : undefined)}
			className={cn(badgeVariants({ position, status }), className)}
			data-slot="avatar-badge"
			role="status"
			{...props}
		/>
	);
}

function AvatarCount({
	"aria-label": ariaLabel,
	className,
	count,
	...props
}: Omit<ComponentProps<"span">, "children"> & { readonly count: number }) {
	if (!Number.isFinite(count) || count < 1) {
		return null;
	}
	const unreadCount = Math.floor(count);
	return (
		<span
			aria-label={ariaLabel ?? `${unreadCount} unread messages`}
			className={cn(
				"absolute -end-1.5 -top-1.5 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 font-medium text-[10px] text-background tabular-nums ring-2 ring-background",
				className
			)}
			data-slot="avatar-count"
			role="status"
			{...props}
		>
			<span aria-hidden="true">
				{unreadCount > 99 ? "99+" : String(unreadCount)}
			</span>
		</span>
	);
}

function AvatarGroup({ className, ...props }: ComponentProps<"div">) {
	return (
		// biome-ignore lint/a11y/useSemanticElements: This names a collection of images, not a group of form controls.
		<div
			className={cn(
				"group/avatar-group flex items-center [&>[data-slot=avatar]:not(:first-child)]:-ms-2 [&>[data-slot=avatar]]:ring-2 [&>[data-slot=avatar]]:ring-background",
				className
			)}
			data-slot="avatar-group"
			role="group"
			{...props}
		/>
	);
}

function AvatarGroupCount({
	"aria-label": ariaLabel,
	children,
	className,
	count,
	frame = "rounded",
	size = "default",
	...props
}: ComponentProps<"span"> &
	Pick<AvatarProps, "frame" | "size"> & { readonly count?: number }) {
	if (count !== undefined && (!Number.isFinite(count) || count < 1)) {
		return null;
	}
	const label =
		ariaLabel ||
		(count === undefined ? undefined : `${Math.floor(count)} more people`);
	return (
		<span
			aria-label={label}
			className={cn(
				avatarVariants({ frame, size }),
				"not-first:-ms-2 bg-muted font-medium text-muted-foreground tabular-nums ring-2 ring-background",
				className
			)}
			data-slot="avatar-group-count"
			role="img"
			{...props}
		>
			{children ??
				(count === undefined ? null : (
					<span aria-hidden="true">+{Math.floor(count)}</span>
				))}
		</span>
	);
}

export {
	Avatar,
	AvatarBadge,
	AvatarCount,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
	avatarVariants,
};
