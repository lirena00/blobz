import { type AvatarPalette, makeAvatar } from "@blobz/avatar-core";

export const MAIN_COVER_COPY = {
	description: [
		"Generate the same playful SVG avatar",
		"from any username, email, or ID.",
	],
	site: "blobz.lirena.in",
	tagline: "Same seed. Same face. Every time.",
	title: ["A face worth", "keeping."],
} as const;

export const MAIN_COVER_COLORS = {
	accent: "#0284c7",
	background: "#f1faff",
	border: "#cce6f3",
	grid: "rgba(14, 165, 233, 0.055)",
	ink: "#0b1830",
	muted: "#586b83",
	panel: "#fbfdff",
} as const;

const COVER_PALETTES = [
	["#e8f7ff", "#38bdf8"],
	["#fff7ed", "#fb923c"],
	["#faf5ff", "#a78bfa"],
	["#edfff4", "#4ade80"],
	["#fff1f2", "#fb7185"],
	["#fefce8", "#facc15"],
	["#e9faf8", "#2dd4bf"],
	["#eef2ff", "#818cf8"],
] as const satisfies readonly AvatarPalette[];

const COVER_FACES = [
	{ eyes: 0, mouth: 0, palette: 0, shape: 15 },
	{ eyes: 4, mouth: 7, palette: 1, shape: 8 },
	{ eyes: 6, mouth: 4, palette: 2, shape: 6 },
	{ eyes: 3, mouth: 10, palette: 3, shape: 3 },
	{ eyes: 13, mouth: 0, palette: 4, shape: 9 },
	{
		eyes: 6,
		id: "blobz-cover-wide-smile-star",
		mouth: 10,
		overrides: { browI: 2, tiltI: 3 },
		palette: 5,
		shape: 3,
	},
	{ eyes: 8, mouth: 2, palette: 6, shape: 13 },
	{ eyes: 9, mouth: 5, palette: 7, shape: 2 },
	{ eyes: 3, mouth: 0, palette: 3, shape: 18 },
	{ eyes: 12, mouth: 4, palette: 2, shape: 16 },
	{ eyes: 4, mouth: 7, palette: 0, shape: 20 },
	{ eyes: 0, mouth: 8, palette: 1, shape: 11 },
	{ eyes: 10, mouth: 5, palette: 7, shape: 5 },
	{ eyes: 6, mouth: 1, palette: 6, shape: 4 },
	{ eyes: 13, mouth: 0, palette: 4, shape: 19 },
	{ eyes: 0, mouth: 10, palette: 5, shape: 12 },
] as const;

export const MAIN_COVER_AVATARS = COVER_FACES.map((face) => {
	const palette = COVER_PALETTES[face.palette];
	const seed = "id" in face ? face.id : `blobz-cover-${face.shape}`;
	const { svg } = makeAvatar(seed, palette, "rounded", {
		browI: 0,
		dxI: 2,
		dyI: 1,
		eyeI: face.eyes,
		faceTiltI: 12,
		flip: 0,
		gapI: 1,
		lookI: 0,
		mouthI: face.mouth,
		shapeI: face.shape,
		tiltI: 7,
		...("overrides" in face ? face.overrides : {}),
	});
	return {
		id: seed,
		palette,
		source: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
	};
});

export const MAIN_COVER_LOGO = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
	makeAvatar("blobz", ["#e8f7ff", "#38bdf8"], "circle").svg
)}`;

export const getMainCoverLayout = (width: number, height: number) => {
	const ratio = width / height;
	const stacked = ratio < 1.45;
	const designWidth = stacked ? 900 : 1200;
	const designHeight = stacked
		? Math.min(1125, Math.max(900, 900 / ratio))
		: 630;
	const scale = Math.min(width / designWidth, height / designHeight);
	const panelSize = stacked ? Math.min(520, designHeight - 528) : 452;
	const panel = {
		left: stacked ? (designWidth - panelSize) / 2 : 684,
		size: panelSize,
		top: stacked ? 414 : 84,
	};
	const panelPadding = panelSize * (28 / 452);
	const gap = panelSize * (16 / 452);
	const tileSize = (panelSize - panelPadding * 2 - gap * 3) / 4;

	return {
		brand: { left: 64, top: stacked ? 52 : 72 },
		description: { left: 64, top: stacked ? 332 : 404 },
		designHeight,
		designWidth,
		offsetX: (width - designWidth * scale) / 2,
		offsetY: (height - designHeight * scale) / 2,
		panel,
		scale,
		site: { left: 64, top: stacked ? designHeight - 48 : 552 },
		tagline: { left: 64, top: stacked ? designHeight - 80 : 492 },
		tiles: MAIN_COVER_AVATARS.map((avatar, index) => ({
			...avatar,
			left: panel.left + panelPadding + (index % 4) * (tileSize + gap),
			size: tileSize,
			top: panel.top + panelPadding + Math.floor(index / 4) * (tileSize + gap),
		})),
		title: { left: 64, size: 84, top: stacked ? 148 : 212 },
	};
};
