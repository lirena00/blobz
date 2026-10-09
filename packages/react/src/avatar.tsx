import {
	type AvatarChoiceOverrides,
	type AvatarFrame,
	type AvatarPalette,
	type AvatarResult,
	DEFAULT_AVATAR_PALETTE,
	makeAvatar,
} from "@blobz/avatar-core";
import type { ComponentPropsWithRef, CSSProperties } from "react";

export type AvatarSize = CSSProperties["width"];

export interface AvatarProps
	extends Omit<
		ComponentPropsWithRef<"img">,
		"alt" | "children" | "height" | "src" | "width"
	> {
	/** Accessible image description. Pass an empty string for a decorative avatar. */
	readonly alt?: string;
	/** Zero-based selections used by a custom face builder. */
	readonly choices?: AvatarChoiceOverrides | null;
	/** Shape of the avatar's outer crop. */
	readonly frame?: AvatarFrame;
	/** Stable value used to deterministically generate the face. */
	readonly name: string | number;
	/** Background and body colours, in that order. */
	readonly palette?: AvatarPalette;
	/** Square rendered size. Defaults to 80 pixels. */
	readonly size?: AvatarSize;
}

export const createAvatarDataUri = (svg: string): string =>
	`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export function Avatar({
	alt,
	choices = null,
	decoding = "async",
	draggable = false,
	frame = "rounded",
	name,
	palette = DEFAULT_AVATAR_PALETTE,
	ref,
	size = 80,
	style,
	...imageProps
}: AvatarProps) {
	const avatar: AvatarResult = makeAvatar(name, palette, frame, choices);
	const numericSize = typeof size === "number" ? size : undefined;

	return (
		// biome-ignore lint/performance/noImgElement: Blobz is framework-neutral and generates an in-memory SVG rather than an optimizable remote asset.
		<img
			{...imageProps}
			alt={alt ?? `Blob avatar for ${avatar.key}`}
			data-blobz-avatar=""
			decoding={decoding}
			draggable={draggable}
			height={numericSize}
			ref={ref}
			src={createAvatarDataUri(avatar.svg)}
			style={{ height: size, width: size, ...style }}
			width={numericSize}
		/>
	);
}
