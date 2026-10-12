// biome-ignore-all lint/performance/noAwaitInLoops: Painting in order preserves the intentional overlap of the Blobz.
import { type AvatarPalette, makeAvatar } from "@blobz/avatar-core";

export const SOCIAL_IMAGES = [
	{
		category: "Cover",
		file: "blobz-cover",
		id: "cover",
		label: "A face worth keeping",
	},
	{
		category: "The idea",
		file: "blobz-from-a-name",
		id: "what",
		label: "How Blobz works",
	},
	{
		category: "The product",
		file: "blobz-everywhere",
		id: "includes",
		label: "What Blobz includes",
	},
	{
		category: "Getting started",
		file: "blobz-one-line",
		id: "integrate",
		label: "Easy to integrate",
	},
	{
		category: "React package",
		file: "blobz-react",
		id: "react",
		label: "React package",
	},
	{
		category: "shadcn CLI",
		file: "blobz-shadcn",
		id: "shadcn",
		label: "shadcn components",
	},
	{ category: "Hosted API", file: "blobz-api", id: "api", label: "Hosted API" },
	{
		category: "Overview",
		file: "blobz-three-ways",
		id: "ways",
		label: "Ways to add Blobz",
	},
] as const;

export type SocialImageId = (typeof SOCIAL_IMAGES)[number]["id"];
export interface ImageSize {
	readonly height: number;
	readonly width: number;
}

interface Artboard {
	readonly font: string;
	readonly h: number;
	readonly margin: number;
	readonly portrait: boolean;
	readonly w: number;
}

const INK = "#0b1830";
const MUTED = "#586b83";
const BLUE = "#0284c7";
const WHITE = "#ffffff";
const FONT_FALLBACK = "Arial, sans-serif";
const avatarCache = new Map<string, Promise<HTMLImageElement>>();

const PALETTES = {
	blue: ["#e8f7ff", "#38bdf8"],
	green: ["#edfff4", "#4ade80"],
	orange: ["#fff7ed", "#fb923c"],
	pink: ["#fff1f2", "#fb7185"],
	purple: ["#faf5ff", "#c084fc"],
	yellow: ["#fefce8", "#facc15"],
} as const satisfies Record<string, AvatarPalette>;

const getAvatar = (
	seed: string,
	palette: AvatarPalette
): Promise<HTMLImageElement> => {
	const key = `${seed}:${palette.join(":")}`;
	const cached = avatarCache.get(key);
	if (cached) {
		return cached;
	}
	const image = new Image();
	image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(makeAvatar(seed, palette, "rounded").svg)}`;
	const loading = image.decode().then(() => image);
	avatarCache.set(key, loading);
	return loading;
};

const box = (
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	radius: number,
	fill: string,
	stroke?: string
) => {
	ctx.beginPath();
	ctx.roundRect(x, y, w, h, radius);
	ctx.fillStyle = fill;
	ctx.fill();
	if (stroke) {
		ctx.strokeStyle = stroke;
		ctx.lineWidth = 1.5;
		ctx.stroke();
	}
};

const write = (
	ctx: CanvasRenderingContext2D,
	value: string,
	x: number,
	y: number,
	size: number,
	weight: number,
	color: string,
	font: string,
	maxWidth?: number,
	align: CanvasTextAlign = "left"
) => {
	ctx.textAlign = align;
	ctx.textBaseline = "alphabetic";
	ctx.fillStyle = color;
	let fittedSize = size;
	ctx.font = `${weight} ${fittedSize}px ${font}`;
	while (
		maxWidth &&
		ctx.measureText(value).width > maxWidth &&
		fittedSize > 16
	) {
		fittedSize -= 1;
		ctx.font = `${weight} ${fittedSize}px ${font}`;
	}
	ctx.fillText(value, x, y);
};

const writeLines = (
	ctx: CanvasRenderingContext2D,
	values: readonly string[],
	x: number,
	y: number,
	size: number,
	leading: number,
	weight: number,
	color: string,
	font: string,
	maxWidth: number
) => {
	for (const [index, value] of values.entries()) {
		write(
			ctx,
			value,
			x,
			y + index * leading,
			size,
			weight,
			color,
			font,
			maxWidth
		);
	}
};

const background = (
	ctx: CanvasRenderingContext2D,
	board: Artboard,
	variant: "pale" | "blue" | "dark" = "pale"
) => {
	const { w, h } = board;
	const gradient = ctx.createLinearGradient(0, 0, w, h);
	if (variant === "dark") {
		gradient.addColorStop(0, "#071426");
		gradient.addColorStop(1, "#123454");
	} else if (variant === "blue") {
		gradient.addColorStop(0, "#d7f3ff");
		gradient.addColorStop(0.58, "#f9fdff");
		gradient.addColorStop(1, "#d8f3ff");
	} else {
		gradient.addColorStop(0, "#fafdff");
		gradient.addColorStop(0.5, "#f1faff");
		gradient.addColorStop(1, "#dff4ff");
	}
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, w, h);
	const glow = ctx.createRadialGradient(
		w * 0.82,
		h * 0.35,
		0,
		w * 0.82,
		h * 0.35,
		w * 0.64
	);
	glow.addColorStop(0, variant === "dark" ? "#2e6d9c80" : "#a8e4ff9c");
	glow.addColorStop(1, "#a8e4ff00");
	ctx.fillStyle = glow;
	ctx.fillRect(0, 0, w, h);
};

const grid = (ctx: CanvasRenderingContext2D, board: Artboard) => {
	ctx.strokeStyle = "#0ea5e912";
	ctx.lineWidth = 1;
	for (let x = 0; x < board.w; x += 64) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, board.h);
		ctx.stroke();
	}
	for (let y = 0; y < board.h; y += 64) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(board.w, y);
		ctx.stroke();
	}
};

const avatarTile = async (
	ctx: CanvasRenderingContext2D,
	seed: string,
	palette: AvatarPalette,
	cx: number,
	cy: number,
	size: number,
	rotation = 0
) => {
	const image = await getAvatar(seed, palette);
	ctx.save();
	ctx.translate(cx, cy);
	ctx.rotate((rotation * Math.PI) / 180);
	ctx.shadowColor = "#125f8c2b";
	ctx.shadowBlur = size * 0.23;
	ctx.shadowOffsetY = size * 0.1;
	box(ctx, -size / 2, -size / 2, size, size, size * 0.26, WHITE, "#bce8fb");
	ctx.shadowColor = "transparent";
	ctx.beginPath();
	ctx.roundRect(
		-size * 0.455,
		-size * 0.455,
		size * 0.91,
		size * 0.91,
		size * 0.2
	);
	ctx.clip();
	ctx.drawImage(image, -size * 0.455, -size * 0.455, size * 0.91, size * 0.91);
	ctx.restore();
};

const site = (ctx: CanvasRenderingContext2D, board: Artboard, dark = false) => {
	write(
		ctx,
		"blobz.lirena.in",
		board.w - board.margin,
		board.h - 38,
		17,
		700,
		dark ? "#b7d6e9" : "#6b8298",
		FONT_FALLBACK,
		undefined,
		"right"
	);
};

const accentLine = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
	box(ctx, x, y, 52, 6, 3, "#0ea5d9");
};

const drawCover = async (ctx: CanvasRenderingContext2D, board: Artboard) => {
	const { w, h, margin, portrait, font } = board;
	background(ctx, board, "blue");
	const logo = await getAvatar("blobz", PALETTES.blue);
	ctx.save();
	ctx.beginPath();
	ctx.arc(margin + 23, 63, 23, 0, Math.PI * 2);
	ctx.clip();
	ctx.drawImage(logo, margin, 40, 46, 46);
	ctx.restore();
	write(ctx, "blobz", margin + 58, 73, 29, 800, INK, font);
	const titleTop = portrait ? 195 : 252;
	accentLine(ctx, margin, portrait ? 136 : 164);
	const headline = portrait
		? ["A face worth", "keeping."]
		: ["A face worth keeping."];
	writeLines(
		ctx,
		headline,
		margin,
		titleTop,
		portrait ? 70 : 76,
		portrait ? 73 : 80,
		850,
		INK,
		font,
		portrait ? w - margin * 2 : w * 0.67
	);
	const copyY = portrait ? titleTop + 174 : 309;
	writeLines(
		ctx,
		[
			"Generate the same playful SVG avatar from any username,",
			"email, or ID.",
		],
		margin,
		copyY,
		portrait ? 23 : 25,
		33,
		650,
		MUTED,
		FONT_FALLBACK,
		portrait ? w - margin * 2 : w * 0.63
	);
	if (portrait) {
		const fieldY = h * 0.73;
		await avatarTile(
			ctx,
			"blobz-open-graph-swarm-1",
			PALETTES.orange,
			w * 0.27,
			fieldY - 65,
			w * 0.25,
			-10
		);
		await avatarTile(
			ctx,
			"blobz-open-graph-swarm-0",
			PALETTES.blue,
			w * 0.69,
			fieldY - 97,
			w * 0.17,
			7
		);
		await avatarTile(
			ctx,
			"blobz-open-graph-swarm-3",
			PALETTES.green,
			w * 0.4,
			fieldY + 125,
			w * 0.2,
			-7
		);
		await avatarTile(
			ctx,
			"blobz-open-graph-swarm-4",
			PALETTES.pink,
			w * 0.78,
			fieldY + 85,
			w * 0.15,
			11
		);
		await avatarTile(
			ctx,
			"blobz-open-graph-swarm-2",
			PALETTES.purple,
			w * 0.85,
			fieldY - 130,
			w * 0.14,
			9
		);
	} else {
		await avatarTile(
			ctx,
			"blobz-open-graph-swarm-0",
			PALETTES.blue,
			w * 0.71,
			h * 0.23,
			116,
			-8
		);
		await avatarTile(
			ctx,
			"blobz-open-graph-swarm-1",
			PALETTES.orange,
			w * 0.86,
			h * 0.42,
			218,
			6
		);
		await avatarTile(
			ctx,
			"blobz-open-graph-swarm-3",
			PALETTES.green,
			w * 0.77,
			h * 0.77,
			143,
			-7
		);
		await avatarTile(
			ctx,
			"blobz-open-graph-swarm-4",
			PALETTES.pink,
			w * 0.92,
			h * 0.77,
			104,
			9
		);
		await avatarTile(
			ctx,
			"blobz-open-graph-swarm-2",
			PALETTES.purple,
			w * 0.96,
			h * 0.02,
			145,
			10
		);
	}
	site(ctx, board);
};

const drawWhat = async (ctx: CanvasRenderingContext2D, board: Artboard) => {
	const { w, h, margin, portrait, font } = board;
	background(ctx, board);
	accentLine(ctx, margin, portrait ? 72 : 90);
	writeLines(
		ctx,
		["A name in.", "A Blobz out."],
		margin,
		portrait ? 151 : 159,
		portrait ? 68 : 77,
		portrait ? 69 : 77,
		850,
		INK,
		font,
		portrait ? w - margin * 2 : w * 0.64
	);
	writeLines(
		ctx,
		[
			"Turn a username, email, or ID into a playful SVG avatar.",
			"The same input gives them the same face every time.",
		],
		margin,
		portrait ? 285 : 284,
		portrait ? 21 : 23,
		portrait ? 30 : 32,
		560,
		MUTED,
		FONT_FALLBACK,
		portrait ? w - margin * 2 : w * 0.59
	);
	const inputX = margin;
	const inputY = portrait ? Math.max(365, h * 0.37) : 365;
	const inputW = portrait ? w - margin * 2 : 470;
	const inputH = portrait ? 132 : 142;
	ctx.save();
	ctx.shadowColor = "#236f9726";
	ctx.shadowBlur = 32;
	ctx.shadowOffsetY = 14;
	box(ctx, inputX, inputY, inputW, inputH, 24, WHITE, "#b5e5fa");
	ctx.restore();
	write(
		ctx,
		"NAME, EMAIL, OR ID",
		inputX + 26,
		inputY + 37,
		17,
		800,
		BLUE,
		FONT_FALLBACK
	);
	write(
		ctx,
		"saksham",
		inputX + 26,
		inputY + 104,
		portrait ? 54 : 62,
		800,
		INK,
		font,
		inputW - 78
	);
	const nameWidth = ctx.measureText("saksham").width;
	box(
		ctx,
		Math.min(inputX + 28 + nameWidth, inputX + inputW - 42),
		inputY + 62,
		3,
		48,
		1,
		"#0ea5d9"
	);
	const faceX = portrait ? w * 0.5 : w * 0.78;
	const faceY = portrait ? h * 0.76 : h * 0.59;
	const faceSize = portrait ? Math.min(w * 0.32, 250) : 298;
	ctx.strokeStyle = "#36b9e9";
	ctx.lineWidth = 7;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.beginPath();
	if (portrait) {
		const arrowY = faceY - faceSize * 0.5 - 18;
		ctx.moveTo(w * 0.5, inputY + inputH + 18);
		ctx.lineTo(w * 0.5, arrowY);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(w * 0.5 - 14, arrowY - 14);
		ctx.lineTo(w * 0.5, arrowY);
		ctx.lineTo(w * 0.5 + 14, arrowY - 14);
	} else {
		const arrowX = faceX - faceSize * 0.66;
		ctx.moveTo(inputX + inputW + 19, inputY + inputH * 0.5);
		ctx.lineTo(arrowX, inputY + inputH * 0.5);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(arrowX - 15, inputY + inputH * 0.5 - 14);
		ctx.lineTo(arrowX, inputY + inputH * 0.5);
		ctx.lineTo(arrowX - 15, inputY + inputH * 0.5 + 14);
	}
	ctx.stroke();
	await avatarTile(ctx, "saksham", PALETTES.purple, faceX, faceY, faceSize, -6);
	write(
		ctx,
		"PLAYFUL SVG AVATAR",
		faceX,
		faceY + faceSize * 0.5 + 28,
		17,
		800,
		BLUE,
		FONT_FALLBACK,
		undefined,
		"center"
	);
	site(ctx, board);
};

const drawSurfaceCard = async (
	ctx: CanvasRenderingContext2D,
	seed: string,
	palette: AvatarPalette,
	x: number,
	y: number,
	w: number,
	h: number,
	label: string,
	font: string,
	kind: "single" | "group" | "profile"
) => {
	ctx.save();
	ctx.shadowColor = "#135f8524";
	ctx.shadowBlur = 30;
	ctx.shadowOffsetY = 14;
	box(ctx, x, y, w, h, 24, WHITE, "#cbeafa");
	ctx.restore();
	if (kind === "group") {
		await avatarTile(
			ctx,
			`${seed}-a`,
			PALETTES.orange,
			x + w * 0.37,
			y + h * 0.47,
			Math.min(h * 0.52, 128),
			-8
		);
		await avatarTile(
			ctx,
			`${seed}-b`,
			PALETTES.green,
			x + w * 0.58,
			y + h * 0.47,
			Math.min(h * 0.52, 128),
			7
		);
		await avatarTile(
			ctx,
			`${seed}-c`,
			PALETTES.pink,
			x + w * 0.76,
			y + h * 0.47,
			Math.min(h * 0.52, 128),
			12
		);
	} else {
		await avatarTile(
			ctx,
			seed,
			palette,
			x + w * 0.5,
			y + h * 0.45,
			Math.min(h * 0.68, 156),
			kind === "profile" ? 5 : -5
		);
	}
	write(ctx, label, x + 24, y + h - 25, 22, 780, INK, font, w - 48);
};

const drawIncludes = async (ctx: CanvasRenderingContext2D, board: Artboard) => {
	const { w, h, margin, portrait, font } = board;
	background(ctx, board, "blue");
	grid(ctx, board);
	accentLine(ctx, margin, portrait ? 84 : 96);
	write(
		ctx,
		"A face for every surface.",
		margin,
		portrait ? 170 : 182,
		portrait ? 60 : 76,
		850,
		INK,
		font,
		w - 2 * margin
	);
	write(
		ctx,
		"Avatars, groups, and profile UI that feel like one family.",
		margin,
		portrait ? 218 : 235,
		portrait ? 21 : 24,
		550,
		MUTED,
		FONT_FALLBACK,
		w - 2 * margin
	);
	if (portrait) {
		const cardW = w - margin * 2;
		const cardH = Math.min(170, (h - 315) / 3 - 12);
		const startY = 288;
		await drawSurfaceCard(
			ctx,
			"includes-avatar",
			PALETTES.green,
			margin,
			startY,
			cardW,
			cardH,
			"Avatars",
			font,
			"single"
		);
		await drawSurfaceCard(
			ctx,
			"includes-group",
			PALETTES.orange,
			margin,
			startY + cardH + 16,
			cardW,
			cardH,
			"Groups",
			font,
			"group"
		);
		await drawSurfaceCard(
			ctx,
			"includes-profile",
			PALETTES.pink,
			margin,
			startY + (cardH + 16) * 2,
			cardW,
			cardH,
			"Profile UI",
			font,
			"profile"
		);
	} else {
		const gap = 22;
		const cardW = (w - margin * 2 - gap * 2) / 3;
		const cardH = Math.min(315, h * 0.47);
		const y = h * 0.4;
		await drawSurfaceCard(
			ctx,
			"includes-avatar",
			PALETTES.green,
			margin,
			y,
			cardW,
			cardH,
			"Avatars",
			font,
			"single"
		);
		await drawSurfaceCard(
			ctx,
			"includes-group",
			PALETTES.orange,
			margin + cardW + gap,
			y,
			cardW,
			cardH,
			"Groups",
			font,
			"group"
		);
		await drawSurfaceCard(
			ctx,
			"includes-profile",
			PALETTES.pink,
			margin + (cardW + gap) * 2,
			y,
			cardW,
			cardH,
			"Profile UI",
			font,
			"profile"
		);
	}
	site(ctx, board);
};

const drawCodeStrip = (
	ctx: CanvasRenderingContext2D,
	code: string,
	x: number,
	y: number,
	w: number,
	h: number,
	dark = false
) => {
	box(
		ctx,
		x,
		y,
		w,
		h,
		18,
		dark ? "#102a47" : "#ffffff",
		dark ? "#2f5c79" : "#b8e2f5"
	);
	write(
		ctx,
		code,
		x + 24,
		y + h * 0.63,
		Math.min(25, h * 0.3),
		600,
		dark ? "#b9e8ff" : "#0c648e",
		"monospace",
		w - 48
	);
};

const drawIntegrate = async (
	ctx: CanvasRenderingContext2D,
	board: Artboard
) => {
	const { w, h, margin, portrait, font } = board;
	background(ctx, board);
	accentLine(ctx, margin, portrait ? 88 : 107);
	writeLines(
		ctx,
		["Small change.", "Big hello."],
		margin,
		portrait ? 176 : 215,
		portrait ? 72 : 82,
		portrait ? 76 : 82,
		850,
		INK,
		font,
		portrait ? w - 2 * margin : w * 0.62
	);
	writeLines(
		ctx,
		["Use a stable seed and the avatar", "is ready wherever you need it."],
		margin,
		portrait ? 354 : 380,
		portrait ? 21 : 23,
		32,
		550,
		MUTED,
		FONT_FALLBACK,
		portrait ? w - 2 * margin : w * 0.53
	);
	const stripY = portrait ? h * 0.53 : h * 0.76;
	drawCodeStrip(
		ctx,
		"<Avatar name={user.id} />",
		margin,
		stripY,
		portrait ? w - 2 * margin : w * 0.56,
		82
	);
	const faceX = portrait ? w * 0.5 : w * 0.78;
	const faceY = portrait ? h * 0.76 : h * 0.5;
	ctx.strokeStyle = "#94dffa";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(faceX, faceY, portrait ? 170 : 210, 0, Math.PI * 2);
	ctx.stroke();
	await avatarTile(
		ctx,
		"integrate-leaf",
		PALETTES.green,
		faceX,
		faceY,
		portrait ? 220 : 280,
		7
	);
	site(ctx, board);
};

const drawReact = async (ctx: CanvasRenderingContext2D, board: Artboard) => {
	const { w, h, margin, portrait, font } = board;
	background(ctx, board, "dark");
	ctx.strokeStyle = "#49baf45c";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(
		portrait ? w * 0.55 : w * 0.78,
		portrait ? h * 0.74 : h * 0.48,
		portrait ? 240 : 310,
		0,
		Math.PI * 2
	);
	ctx.stroke();
	accentLine(ctx, margin, portrait ? 95 : 116);
	writeLines(
		ctx,
		portrait ? ["Made for", "React."] : ["Made for React."],
		margin,
		portrait ? 188 : 227,
		portrait ? 76 : 82,
		portrait ? 80 : 88,
		850,
		WHITE,
		font,
		portrait ? w - 2 * margin : w * 0.6
	);
	writeLines(
		ctx,
		[
			"A component that renders crisp SVG",
			"right where your product needs a face.",
		],
		margin,
		portrait ? 355 : 315,
		portrait ? 22 : 24,
		34,
		500,
		"#b6d2e5",
		FONT_FALLBACK,
		portrait ? w - 2 * margin : w * 0.54
	);
	drawCodeStrip(
		ctx,
		"import { Avatar } from '@blobz/react'",
		margin,
		portrait ? h * 0.49 : h * 0.63,
		portrait ? w - 2 * margin : w * 0.61,
		80,
		true
	);
	await avatarTile(
		ctx,
		"react-cloud",
		PALETTES.pink,
		portrait ? w * 0.5 : w * 0.83,
		portrait ? h * 0.76 : h * 0.52,
		portrait ? 250 : 300,
		-8
	);
	site(ctx, board, true);
};

const drawShadcn = async (ctx: CanvasRenderingContext2D, board: Artboard) => {
	const { w, h, margin, portrait, font } = board;
	background(ctx, board, "blue");
	accentLine(ctx, margin, portrait ? 90 : 108);
	writeLines(
		ctx,
		["Your UI.", "Your code."],
		margin,
		portrait ? 176 : 207,
		portrait ? 67 : 77,
		portrait ? 70 : 80,
		850,
		INK,
		font,
		portrait ? w - 2 * margin : w * 0.59
	);
	writeLines(
		ctx,
		["Add ready-made avatar UI with", "the shadcn CLI, then make it yours."],
		margin,
		portrait ? 355 : 388,
		portrait ? 22 : 23,
		32,
		550,
		MUTED,
		FONT_FALLBACK,
		portrait ? w - 2 * margin : w * 0.54
	);
	const cardX = portrait ? margin : w * 0.62;
	const cardY = portrait ? h * 0.53 : h * 0.28;
	const cardW = portrait ? w - 2 * margin : w * 0.32;
	const cardH = portrait ? 240 : 275;
	ctx.save();
	ctx.shadowColor = "#14536d2d";
	ctx.shadowBlur = 32;
	ctx.shadowOffsetY = 18;
	box(ctx, cardX, cardY, cardW, cardH, 30, WHITE, "#bce7f7");
	ctx.restore();
	write(
		ctx,
		"Profile preview",
		cardX + 28,
		cardY + 46,
		17,
		750,
		MUTED,
		FONT_FALLBACK
	);
	await avatarTile(
		ctx,
		"shadcn-petal",
		PALETTES.orange,
		cardX + cardW * 0.5,
		cardY + 135,
		128,
		5
	);
	box(ctx, cardX + 30, cardY + cardH - 48, cardW - 60, 12, 6, "#e1edf4");
	const stripY = portrait ? h * 0.85 : h * 0.77;
	drawCodeStrip(
		ctx,
		"npx shadcn@latest add @blobz/avatar",
		margin,
		stripY,
		portrait ? w - 2 * margin : w * 0.53,
		74
	);
	site(ctx, board);
};

const drawApi = async (ctx: CanvasRenderingContext2D, board: Artboard) => {
	const { w, h, margin, portrait, font } = board;
	background(ctx, board, "blue");
	accentLine(ctx, margin, portrait ? 91 : 110);
	writeLines(
		ctx,
		["A face for", "any stack."],
		margin,
		portrait ? 177 : 209,
		portrait ? 77 : 86,
		portrait ? 80 : 86,
		850,
		INK,
		font,
		portrait ? w - 2 * margin : w * 0.58
	);
	writeLines(
		ctx,
		[
			"The hosted API gives you an image URL.",
			"Use it anywhere an image works.",
		],
		margin,
		portrait ? 358 : 378,
		portrait ? 21 : 23,
		32,
		550,
		MUTED,
		FONT_FALLBACK,
		portrait ? w - 2 * margin : w * 0.58
	);
	drawCodeStrip(
		ctx,
		"GET /api/v1/avatars/{endpointId}",
		margin,
		portrait ? h * 0.52 : h * 0.76,
		portrait ? w - 2 * margin : w * 0.56,
		78
	);
	const faceX = portrait ? w * 0.5 : w * 0.8;
	const faceY = portrait ? h * 0.77 : h * 0.48;
	await avatarTile(
		ctx,
		"api-spark",
		PALETTES.yellow,
		faceX,
		faceY,
		portrait ? 235 : 292,
		-6
	);
	site(ctx, board);
};

const drawWays = async (ctx: CanvasRenderingContext2D, board: Artboard) => {
	const { w, h, margin, portrait, font } = board;
	background(ctx, board);
	accentLine(ctx, margin, portrait ? 85 : 94);
	write(
		ctx,
		"Choose how to add Blobz.",
		margin,
		portrait ? 166 : 180,
		portrait ? 65 : 78,
		850,
		INK,
		font,
		w - 2 * margin
	);
	write(
		ctx,
		"One identity across the tools you already use.",
		margin,
		portrait ? 215 : 235,
		portrait ? 21 : 24,
		550,
		MUTED,
		FONT_FALLBACK,
		w - 2 * margin
	);
	const items = [
		{
			copy: "Render SVG in your app.",
			label: "React package",
			palette: PALETTES.blue,
			seed: "ways-react",
		},
		{
			copy: "Add UI to your codebase.",
			label: "shadcn CLI",
			palette: PALETTES.green,
			seed: "ways-shadcn",
		},
		{
			copy: "Use an image URL anywhere.",
			label: "Hosted API",
			palette: PALETTES.purple,
			seed: "ways-api",
		},
	] as const;
	if (portrait) {
		const rowH = Math.min(173, (h - 308) / 3 - 12);
		for (const [index, item] of items.entries()) {
			const y = 278 + index * (rowH + 18);
			box(ctx, margin, y, w - margin * 2, rowH, 22, WHITE, "#c9e9f8");
			write(ctx, item.label, margin + 25, y + 57, 30, 800, INK, font, w * 0.53);
			write(
				ctx,
				item.copy,
				margin + 25,
				y + 93,
				18,
				500,
				MUTED,
				FONT_FALLBACK,
				w * 0.57
			);
			await avatarTile(
				ctx,
				item.seed,
				item.palette,
				w - margin - 73,
				y + rowH * 0.5,
				Math.min(rowH * 0.66, 107),
				index % 2 ? 7 : -7
			);
		}
	} else {
		const gap = 22;
		const cardW = (w - margin * 2 - gap * 2) / 3;
		const cardY = h * 0.41;
		const cardH = Math.min(315, h * 0.48);
		for (const [index, item] of items.entries()) {
			const x = margin + index * (cardW + gap);
			box(ctx, x, cardY, cardW, cardH, 26, WHITE, "#c9e9f8");
			await avatarTile(
				ctx,
				item.seed,
				item.palette,
				x + cardW * 0.5,
				cardY + cardH * 0.4,
				Math.min(cardH * 0.43, 145),
				index % 2 ? 7 : -7
			);
			write(
				ctx,
				item.label,
				x + 23,
				cardY + cardH - 71,
				26,
				800,
				INK,
				font,
				cardW - 46
			);
			write(
				ctx,
				item.copy,
				x + 23,
				cardY + cardH - 39,
				18,
				500,
				MUTED,
				FONT_FALLBACK,
				cardW - 46
			);
		}
	}
	site(ctx, board);
};

export const renderSocialImage = async (
	canvas: HTMLCanvasElement,
	id: SocialImageId,
	size: ImageSize
): Promise<void> => {
	const context = canvas.getContext("2d");
	if (!context) {
		throw new Error("Your browser could not create an image canvas.");
	}
	await document.fonts.ready;
	const font =
		getComputedStyle(document.body)
			.getPropertyValue("--font-bricolage")
			.trim() || FONT_FALLBACK;
	const ratio = size.width / size.height;
	let virtualWidth = 720;
	if (ratio >= 1.2) {
		virtualWidth = 1200;
	} else if (ratio >= 0.82) {
		virtualWidth = 900 * ratio;
	}
	const virtualHeight = virtualWidth / ratio;
	const board: Artboard = {
		font,
		h: virtualHeight,
		margin: ratio < 1.2 ? 50 : 55,
		portrait: ratio < 1.2,
		w: virtualWidth,
	};
	canvas.width = size.width;
	canvas.height = size.height;
	context.scale(size.width / virtualWidth, size.height / virtualHeight);
	if (id === "cover") {
		await drawCover(context, board);
	} else if (id === "what") {
		await drawWhat(context, board);
	} else if (id === "includes") {
		await drawIncludes(context, board);
	} else if (id === "integrate") {
		await drawIntegrate(context, board);
	} else if (id === "react") {
		await drawReact(context, board);
	} else if (id === "shadcn") {
		await drawShadcn(context, board);
	} else if (id === "api") {
		await drawApi(context, board);
	} else {
		await drawWays(context, board);
	}
};
