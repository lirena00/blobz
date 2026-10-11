import {
	type AvatarFrame,
	type AvatarPalette,
	createAvatar,
	DEFAULT_AVATAR_PALETTE,
} from "@blobz/avatar-core";
import { z } from "zod";

const HEX_COLOR = z
	.string()
	.regex(/^#?[0-9a-fA-F]{6}$/)
	.transform((color) => `#${color.replace("#", "").toLowerCase()}`);
const AVATAR_QUERY = z.strictObject({
	frame: z.enum(["circle", "rounded", "square"]).optional(),
	name: z.string().trim().min(1).max(256),
	palette: z
		.string()
		.transform((value) => value.split(","))
		.pipe(z.tuple([HEX_COLOR, HEX_COLOR]))
		.optional(),
	size: z
		.string()
		.regex(/^\d{1,4}$/)
		.transform(Number)
		.pipe(z.number().int().min(16).max(1024))
		.optional(),
});

export interface EmbedAvatarOptions {
	frame: AvatarFrame;
	name: string;
	palette: AvatarPalette;
	size: number;
}

export function parseEmbedAvatarQuery(
	searchParams: URLSearchParams
): EmbedAvatarOptions | null {
	const seen = new Set<string>();
	for (const name of searchParams.keys()) {
		if (seen.has(name)) {
			return null;
		}
		seen.add(name);
	}
	const parsed = AVATAR_QUERY.safeParse(Object.fromEntries(searchParams));
	if (!parsed.success) {
		return null;
	}
	return {
		frame: parsed.data.frame ?? "rounded",
		name: parsed.data.name,
		palette: parsed.data.palette ?? DEFAULT_AVATAR_PALETTE,
		size: parsed.data.size ?? 80,
	};
}

export function renderEmbeddedAvatar(options: EmbedAvatarOptions): string {
	const { frame, name, palette, size } = options;
	const { svg } = createAvatar({
		frame,
		name,
		palette,
	});
	return svg.replace(
		'viewBox="0 0 80 80" width="80" height="80"',
		`viewBox="0 0 80 80" width="${size}" height="${size}"`
	);
}
