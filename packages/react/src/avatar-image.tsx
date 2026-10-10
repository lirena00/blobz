import type { ComponentPropsWithRef, CSSProperties } from "react";

export type AvatarSize = CSSProperties["width"];

export interface AvatarImageProps
	extends Omit<
		ComponentPropsWithRef<"img">,
		"alt" | "children" | "height" | "src" | "width"
	> {
	readonly alt?: string;
	readonly fallbackAlt: string;
	readonly size?: AvatarSize;
	readonly source: "custom" | "generated";
	readonly svg: string;
}

export const createAvatarDataUri = (svg: string): string =>
	`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export function AvatarImage({
	alt,
	decoding = "async",
	draggable = false,
	fallbackAlt,
	ref,
	size = 80,
	source,
	style,
	svg,
	...imageProps
}: AvatarImageProps) {
	const numericSize = typeof size === "number" ? size : undefined;

	return (
		// biome-ignore lint/performance/noImgElement: Blobz renders an in-memory SVG data URI that image optimizers cannot improve.
		<img
			{...imageProps}
			alt={alt ?? fallbackAlt}
			data-blobz-avatar=""
			data-blobz-source={source}
			decoding={decoding}
			draggable={draggable}
			height={numericSize}
			ref={ref}
			src={createAvatarDataUri(svg)}
			style={{ height: size, width: size, ...style }}
			width={numericSize}
		/>
	);
}
