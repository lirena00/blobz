import {
	type AvatarChoiceOverrides,
	type AvatarFrame,
	type AvatarPalette,
	type AvatarResult,
	DEFAULT_AVATAR_PALETTE,
	makeAvatar,
} from "@blobz/avatar-core";
import type { ComponentPropsWithRef, CSSProperties } from "react";
import { AvatarImage } from "./avatar-image";

export type AvatarSize = CSSProperties["width"];

export const createAvatarDataUri = (svg: string): string =>
	`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

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

	return (
		<AvatarImage
			{...imageProps}
			alt={alt ?? `Blob avatar for ${avatar.key}`}
			decoding={decoding}
			draggable={draggable}
			fallbackAlt={`Blob avatar for ${avatar.key}`}
			ref={ref}
			size={size}
			source="generated"
			style={style}
			svg={avatar.svg}
		/>
	);
}
