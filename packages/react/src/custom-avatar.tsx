import {
	type CustomAvatarDefinition,
	type CustomAvatarResult,
	createCustomAvatar,
} from "@blobz/avatar-core";
import type { ComponentPropsWithRef } from "react";
import { AvatarImage, type AvatarSize } from "./avatar-image";

export type CustomAvatarValue = CustomAvatarDefinition;

export interface CustomAvatarProps
	extends Omit<
		ComponentPropsWithRef<"img">,
		"alt" | "children" | "height" | "src" | "width"
	> {
	/** Accessible image description. Pass an empty string for a decorative avatar. */
	readonly alt?: string;
	/** Complete, serializable face definition produced by AvatarBuilder. */
	readonly definition: CustomAvatarDefinition;
	/** Square rendered size. Defaults to 80 pixels. */
	readonly size?: AvatarSize;
}

export function CustomAvatar({
	alt,
	decoding = "async",
	definition,
	draggable = false,
	ref,
	size = 80,
	style,
	...imageProps
}: CustomAvatarProps) {
	const avatar: CustomAvatarResult = createCustomAvatar(definition);

	return (
		<AvatarImage
			{...imageProps}
			alt={alt}
			decoding={decoding}
			draggable={draggable}
			fallbackAlt="Custom blob avatar"
			ref={ref}
			size={size}
			source="custom"
			style={style}
			svg={avatar.svg}
		/>
	);
}
