// biome-ignore-all lint/suspicious/noBitwiseOperators: cyrb53 and mulberry32 intentionally use 32-bit bitwise arithmetic for stable seeded output.
export const AVATAR_CHOICES = {
	brows: [
		"none",
		"raised",
		"angry",
		"worried",
		"flat",
		"quizzical",
		"high",
		"tilted",
		"unibrow",
	],
	eyes: [
		"big",
		"dots",
		"sleepy",
		"happy",
		"wink",
		"squint",
		"distorted",
		"grumpy",
		"uneven",
		"oval",
		"side-eye",
		"crossed",
		"shocked",
		"peep wink",
	],
	gap: ["close", "medium", "wide"],
	look: ["centre", "left", "right", "up", "down"],
	mouth: [
		"smile",
		"flat",
		"open",
		"frown",
		"oh",
		"smirk",
		"tongue out",
		"grin",
		"buck teeth",
		"wobbly",
		"wide smile",
	],
	shape: [
		"eared",
		"lopsided",
		"pillow",
		"star",
		"ghost",
		"pebble",
		"squircle",
		"pentagon",
		"flower",
		"clover",
		"sun",
		"fuzz",
		"sparkle",
		"pill",
		"quarter",
		"round",
		"leaf",
		"soft triangle",
		"cloud",
		"drop",
		"bean",
	],
} as const;

export const CHOICE_LABELS = AVATAR_CHOICES;
export const AVATAR_COMBINATION_COUNT = 4_911_637_500;
export const DEFAULT_AVATAR_PALETTE = ["#f2f1f4", "#7c6cf2"] as const;

export type AvatarFrame = "circle" | "rounded" | "square";
export type AvatarPalette = readonly [background: string, body: string];

export interface AvatarChoiceOverrides {
	readonly browI?: number;
	readonly dxI?: number;
	readonly dyI?: number;
	readonly eyeI?: number;
	readonly faceTiltI?: number;
	readonly flip?: number;
	readonly gapI?: number;
	readonly lookI?: number;
	readonly mouthI?: number;
	readonly shapeI?: number;
	readonly tiltI?: number;
}

export interface AvatarChoices {
	readonly browI: number;
	readonly dxI: number;
	readonly dyI: number;
	readonly eyeI: number;
	readonly faceTiltI: number;
	readonly flip: number;
	readonly gapI: number;
	readonly lookI: number;
	readonly mouthI: number;
	readonly shapeI: number;
	readonly tiltI: number;
}

export type AvatarBrow = (typeof AVATAR_CHOICES.brows)[number];
export type AvatarEye = (typeof AVATAR_CHOICES.eyes)[number];
export type AvatarEyeSpacing = (typeof AVATAR_CHOICES.gap)[number];
export type AvatarLook = (typeof AVATAR_CHOICES.look)[number];
export type AvatarMouth = (typeof AVATAR_CHOICES.mouth)[number];
export type AvatarShape = (typeof AVATAR_CHOICES.shape)[number];

export interface CustomAvatarChoices {
	readonly bodyTilt: number;
	readonly brows: AvatarBrow;
	readonly eyeSpacing: AvatarEyeSpacing;
	readonly eyes: AvatarEye;
	readonly faceAngle: number;
	readonly facePosition: {
		readonly x: number;
		readonly y: number;
	};
	readonly look: AvatarLook;
	readonly mirrored: boolean;
	readonly mouth: AvatarMouth;
	readonly shape: AvatarShape;
}

export interface GeneratedAvatarDefinition {
	readonly frame: AvatarFrame;
	readonly name: string | number;
	readonly palette: AvatarPalette;
	readonly type: "generated";
	readonly version: 1;
}

export interface CustomAvatarDefinition {
	readonly choices: CustomAvatarChoices;
	readonly frame: AvatarFrame;
	readonly palette: AvatarPalette;
	readonly type: "custom";
	readonly version: 1;
}

export type AvatarDefinition =
	| GeneratedAvatarDefinition
	| CustomAvatarDefinition;

export interface AvatarFeature {
	readonly at: number;
	readonly label: string;
	readonly of: number;
	readonly swatch?: string;
	readonly value: string;
}

export interface AvatarRenderResult {
	readonly choices: AvatarChoices;
	readonly combos: number;
	readonly features: readonly AvatarFeature[];
	readonly key: string;
	readonly svg: string;
}

export interface AvatarResult extends AvatarRenderResult {
	readonly hash: number;
}

export interface CustomAvatarResult extends AvatarRenderResult {
	readonly key: "custom avatar";
}

export interface CreateAvatarOptions {
	readonly choices?: AvatarChoiceOverrides | null;
	readonly frame?: AvatarFrame;
	readonly name: unknown;
	readonly palette?: AvatarPalette;
}

export interface CreateCustomAvatarOptions {
	readonly choices: CustomAvatarChoices;
	readonly frame?: AvatarFrame;
	readonly palette?: AvatarPalette;
}

interface Body {
	readonly f: readonly [x: number, y: number, scale: number];
	readonly g: string;
}
type Point = readonly [x: number, y: number, radius: number];
type Rgb = readonly [red: number, green: number, blue: number];

const XML_ENTITIES: Readonly<Record<string, string>> = {
	'"': "&quot;",
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
};
const FRAME_RADII: Readonly<Record<AvatarFrame, number>> = {
	circle: 40,
	rounded: 18,
	square: 0,
};

const GLINTS = [
	[
		"M15.4 31.8C15.8 31.1 16.7 28.8 17.6 27.4C18.4 26.0 19.4 24.5 20.6 23.4C21.7 22.2 23.9 21.0 24.6 20.5",
		"M14.0 36.1L13.4 39.1",
	],
	[
		"M15.4 37.4C15.6 36.7 16.1 34.6 16.6 33.3C17.1 31.9 17.7 30.6 18.4 29.4C19.1 28.1 20.4 26.4 20.8 25.8",
		"M14.7 41.9L14.8 44.9",
	],
	[
		"M19.4 23.1L19.7 21.8L20.5 20.5L21.4 19.9L23.1 19.4L24.4 19.6L25.9 20.1L27.3 20.6L28.4 20.9",
		"M20.7 27.7L21.3 30.3",
	],
	["M33.7 25.7L37.7 18.9", "M21.1 32.1L24.1 31.5"],
	[
		"M18.9 36.4C19.0 35.7 19.2 33.5 19.5 32.1C19.9 30.7 20.3 29.3 21.0 28.1C21.6 26.8 22.9 25.0 23.3 24.4",
		"M18.9 40.9L18.9 44.0",
	],
	[
		"M17.2 41.6C17.3 41.1 17.6 39.2 18.2 38.2C18.7 37.1 19.5 36.2 20.4 35.4C21.3 34.6 23.0 33.7 23.5 33.4",
		"M17.6 46.1L18.7 49.0",
	],
	[
		"M16.9 34.9C16.9 34.1 17.0 32.0 17.2 30.6C17.3 29.1 17.4 27.7 17.8 26.3C18.1 24.9 19.0 23.0 19.2 22.3",
		"M16.9 39.4L17.0 42.5",
	],
	[
		"M19.7 40.9L18.6 37.6A2.5 2.5 0 0 1 19.5 34.8L24.8 31.0",
		"M27.6 28.9L29.7 27.4",
	],
	["M24.7 25.8A7 7 0 0 1 29.3 20.6", "M15.5 39.3A8 8 0 0 1 16.4 37.5"],
	["M18.6 27.8A8.5 8.5 0 0 1 23.3 21.4", "M18.9 31.6A8.5 8.5 0 0 1 18.6 30.2"],
	["M25.0 31.6L24.2 24.8", "M18.3 36.4L21.1 35.2"],
	["M21.9 32.8Q24.0 27.4 29.1 24.4", "M20.5 37.2L20.0 39.0"],
	["M33.6 30.8L36.7 23.4", "M19.3 39.5L23.1 38.0"],
	[
		"M12.2 34.5C12.5 33.9 13.2 31.8 14.0 30.7C14.8 29.5 15.8 28.4 17.0 27.6C18.1 26.8 20.2 26.1 20.9 25.8",
		"M11.1 38.9L10.6 42.0",
	],
	["M21.5 37V31Q21.5 22.6 28.5 22.6", "M21.5 45V42.5"],
	[
		"M17.5 36.0C17.8 35.3 18.4 33.3 19.1 32.0C19.8 30.7 20.6 29.5 21.5 28.4C22.3 27.3 23.9 25.8 24.4 25.3",
		"M16.7 40.4L16.7 43.5",
	],
	[
		"M23.0 28.1L24.0 26.8L25.2 25.7L26.0 24.8L27.2 23.7L28.2 23.0L29.5 22.0L30.8 21.1L31.9 20.5",
		"M20.4 31.7L19.1 34.2",
	],
	["M20.2 44.6L26.2 33.2", "M18.1 48.6L16.6 51.4"],
	[
		"M18.7 31.8A12.5 12.5 0 0 1 25.1 23.0",
		"M13.0 44.1A9.5 9.5 0 0 1 13.9 42.0",
	],
	["M21.9 44.1L27.7 32.6", "M21.0 48.5L21.0 51.6"],
	[
		"M17.4 39.0C17.6 38.3 18.1 36.2 18.5 34.8C18.9 33.4 19.4 32.1 20.0 30.8C20.7 29.5 22.0 27.8 22.3 27.2",
		"M16.6 43.4L16.5 46.5",
	],
] as const;

const getItem = <Item>(items: readonly Item[], index: number): Item => {
	const item = items[index];
	if (item === undefined) {
		throw new RangeError(
			`Avatar choice ${index} is outside the available range.`
		);
	}
	return item;
};

export const hashAvatarSeed = (value: string, seed = 0): number => {
	let first = 0xde_ad_be_ef ^ seed;
	let second = 0x41_c6_ce_57 ^ seed;
	for (let index = 0; index < value.length; index += 1) {
		const character = value.charCodeAt(index);
		first = Math.imul(first ^ character, 2_654_435_761);
		second = Math.imul(second ^ character, 1_597_334_677);
	}
	first =
		Math.imul(first ^ (first >>> 16), 2_246_822_507) ^
		Math.imul(second ^ (second >>> 13), 3_266_489_909);
	second =
		Math.imul(second ^ (second >>> 16), 2_246_822_507) ^
		Math.imul(first ^ (first >>> 13), 3_266_489_909);
	return 4_294_967_296 * (2_097_151 & second) + (first >>> 0);
};

export const createSeededRandom = (seed: number): (() => number) => {
	let state = seed;
	return () => {
		state |= 0;
		state = (state + 0x6d_2b_79_f5) | 0;
		let value = Math.imul(state ^ (state >>> 15), 1 | state);
		value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
		return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
	};
};

const toRgb = (hex: string): Rgb => {
	const value = Number.parseInt(hex.slice(1), 16);
	return [value >> 16, (value >> 8) & 255, value & 255];
};
const mix = (first: string, second: string, amount: number): string => {
	const a = toRgb(first);
	const b = toRgb(second);
	const channel = (start: number, end: number) =>
		Math.round(start + (end - start) * amount)
			.toString(16)
			.padStart(2, "0");
	return `#${channel(a[0], b[0])}${channel(a[1], b[1])}${channel(a[2], b[2])}`;
};
const luminance = (hex: string): number => {
	const [red, green, blue] = toRgb(hex);
	return 0.299 * red + 0.587 * green + 0.114 * blue;
};
const escapeXml = (value: string): string =>
	value.replace(/[&<>"]/g, (character) => XML_ENTITIES[character] ?? character);
const choiceOrFallback = (
	value: number | undefined,
	count: number,
	fallback: number
): number =>
	typeof value === "number" &&
	Number.isInteger(value) &&
	value >= 0 &&
	value < count
		? value
		: fallback;

interface RenderAvatarOptions {
	readonly choices: AvatarChoices;
	readonly colours: AvatarPalette;
	readonly frame: AvatarFrame;
	readonly id: string;
	readonly key: string;
}

const renderAvatar = ({
	choices,
	colours,
	frame,
	id,
	key,
}: RenderAvatarOptions): AvatarRenderResult => {
	const {
		browI,
		dxI,
		dyI,
		eyeI,
		faceTiltI,
		flip,
		gapI,
		lookI,
		mouthI,
		shapeI,
		tiltI,
	} = choices;
	const tilt = (tiltI - 7) * 2;
	const dx = dxI - 2;
	const dy = dyI - 1;
	const faceTilt = faceTiltI - 12;
	const [background, blob] = colours;
	const darkBlob = luminance(blob) < 90;
	const pupil = darkBlob ? "#1b1b1b" : mix(blob, "#0a1030", 0.78);
	const ink = darkBlob ? "#ffffff" : pupil;

	const shapePath = (path: string, width = 2.5) =>
		`<path d="${path}" fill="${blob}" stroke="${blob}" stroke-width="${width}" stroke-linejoin="round"/>`;
	const polygon = (points: string, width: number) =>
		`<polygon points="${points}" fill="${blob}" stroke="${blob}" stroke-width="${width}" stroke-linejoin="round"/>`;
	const burst = (
		points: number,
		outerRadius: number,
		innerRadius: number,
		width: number
	) =>
		polygon(
			Array.from({ length: points * 2 }, (_, index) => {
				const angle = ((-90 + index * (180 / points)) * Math.PI) / 180;
				const radius = index % 2 ? innerRadius : outerRadius;
				return `${(40 + radius * Math.cos(angle)).toFixed(1)},${(42 + radius * Math.sin(angle)).toFixed(1)}`;
			}).join(" "),
			width
		);
	const lobes = (list: readonly Point[]) =>
		list
			.map(
				([x, y, radius]) =>
					`<circle cx="${x}" cy="${y}" r="${radius}" fill="${blob}"/>`
			)
			.join("");
	const bodies: readonly Body[] = [
		{
			f: [40, 46, 1],
			g: shapePath(
				"M10 46C10 27 21 15 30 17C35 18 36 24 40 24C44 24 45 18 50 17C59 15 70 27 70 46C70 61 56 68 40 68C24 68 10 61 10 46Z"
			),
		},
		{
			f: [40, 44, 1],
			g: shapePath(
				"M12 40C14 24 26 14 36 18C40 20 42 26 48 24C60 20 70 30 68 46C66 62 50 68 36 66C22 64 10 54 12 40Z"
			),
		},
		{
			f: [40, 40, 0.95],
			g: shapePath(
				"M20 20Q40 29 60 20Q51 40 60 60Q40 51 20 60Q29 40 20 20Z",
				12
			),
		},
		{ f: [40, 45, 0.78], g: burst(5, 27, 15, 8) },
		{
			f: [40, 42, 1],
			g: shapePath(
				"M16 66V38C16 22 28 14 40 14C52 14 64 22 64 38V66Q58 62 52 66T40 66T28 66T16 66Z"
			),
		},
		{
			f: [41, 48, 1],
			g: shapePath(
				"M16 50C10 38 20 28 30 30C36 31 38 22 46 22C58 22 70 36 68 50C66 62 56 68 42 68C30 68 20 62 16 50Z"
			),
		},
		{
			f: [40, 41, 1],
			g: shapePath(
				"M14 38C14 18 18 14 38 14C60 14 67 18 67 40C67 62 60 67 40 67C20 67 14 60 14 38Z"
			),
		},
		{
			f: [40, 43, 0.95],
			g: polygon("40,23 59,36.8 51.8,59.2 28.2,59.2 21,36.8", 14),
		},
		{
			f: [40, 42, 0.95],
			g: lobes([
				[57, 42, 12],
				[48.5, 56.7, 11],
				[31.5, 56.7, 13],
				[23, 42, 12],
				[31.5, 27.3, 11],
				[48.5, 27.3, 13],
				[40, 42, 19],
			]),
		},
		{
			f: [40, 42, 0.9],
			g: lobes([
				[27, 29, 13],
				[53, 29, 14],
				[27, 55, 14],
				[53, 55, 13],
				[40, 42, 17],
			]),
		},
		{ f: [40, 42, 0.95], g: burst(9, 25, 17, 7) },
		{ f: [40, 42, 0.98], g: burst(16, 26, 22.5, 4) },
		{ f: [40, 42, 0.68], g: burst(4, 24, 10, 12) },
		{
			f: [40, 42, 1],
			g: shapePath(
				"M24 22C34 20 46 24 56 22C68 20 74 30 72 42C70 56 62 64 52 62C42 60 30 64 22 62C12 60 6 50 8 40C10 28 14 24 24 22Z"
			),
		},
		{ f: [38, 44, 1], g: shapePath("M21 61V20A41 41 0 0 1 62 61Z", 10) },
		{
			f: [40, 42, 1],
			g: `<ellipse cx="40" cy="42" rx="27.5" ry="26.5" fill="${blob}"/>`,
		},
		{
			f: [40, 41, 0.9],
			g: shapePath("M19 61C8 38 30 8 61 19C72 50 44 72 19 61Z", 9),
		},
		{
			f: [40, 50, 0.88],
			g: shapePath(
				"M40 13C47 13 51 22 58 35L68 54C73 64 64 69 53 69H27C16 69 7 64 12 54L22 35C29 22 33 13 40 13Z"
			),
		},
		{
			f: [40, 46, 0.92],
			g: lobes([
				[22, 47, 14],
				[31, 34, 17],
				[47, 34, 18],
				[59, 47, 14],
				[48, 56, 16],
				[31, 56, 16],
				[40, 46, 20],
			]),
		},
		{
			f: [40, 49, 0.9],
			g: shapePath(
				"M40 12C47 22 62 36 62 50C62 63 52 70 40 70C28 70 18 63 18 50C18 36 33 22 40 12Z"
			),
		},
		{
			f: [40, 45, 0.96],
			g: shapePath(
				"M15 37C18 21 32 14 45 18C54 21 57 30 64 36C73 44 68 59 56 65C43 72 23 67 16 55C13 50 13 43 15 37Z"
			),
		},
	];

	const body = getItem(bodies, shapeI);
	const bodySvg = body.g;
	const glint = getItem(GLINTS, shapeI);
	const whiteBody = bodySvg.split(blob).join("#fff");
	const shine =
		`<g mask="url(#${id}s)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" opacity=".62">` +
		`<path d="${glint[0]}" stroke-width="2.3"/>` +
		`<path d="${glint[1]}" stroke-width="2"/></g>`;

	const gap = getItem([8.5, 10, 11.5] as const, gapI);
	const leftX = -gap;
	const rightX = gap;
	const look = getItem(
		[
			[0, 0],
			[-1.6, 0],
			[1.6, 0],
			[0, -1.6],
			[0, 1.6],
		] as const,
		lookI
	);
	const stroke = (width: number) =>
		`fill="none" stroke="${ink}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"`;
	const big = (x: number, y = -2, radius = 7.2) =>
		`<circle cx="${x}" cy="${y}" r="${radius}" fill="#fff"/><circle cx="${x + look[0]}" cy="${y + look[1]}" r="${radius * 0.6}" fill="${pupil}"/>`;
	const happy = (x: number) =>
		`<path d="M${x - 4.5} 0Q${x} -8 ${x + 4.5} 0" ${stroke(2.4)}/>`;
	const sleepy = (x: number) =>
		`<path d="M${x - 4.5} -4Q${x} 3 ${x + 4.5} -4" ${stroke(2.4)}/>`;
	const grumpy = (x: number, side: number) => {
		const first = [x - 9 * side, -5.5];
		const second = [x + 9 * side, 0.5];
		const clipId = `${id}${side > 0 ? "a" : "b"}`;
		return (
			`<clipPath id="${clipId}"><polygon points="${first} ${second} ${x + 9 * side},9 ${x - 9 * side},9"/></clipPath>` +
			`<g clip-path="url(#${clipId})"><circle cx="${x}" cy="-2" r="7.2" fill="#fff"/><circle cx="${x + look[0]}" cy="${1 + look[1]}" r="4.2" fill="${pupil}"/></g>` +
			`<path d="M${x - 4.8 * side} -4.1L${x + 4.8 * side} -0.9" ${stroke(2)}/>`
		);
	};
	const oval = (x: number) =>
		`<ellipse cx="${x}" cy="-2" rx="3.7" ry="4.7" fill="${ink}"/><circle cx="${x + 1.2}" cy="-3.6" r="1.1" fill="${darkBlob ? "#1b1b1b" : "#fff"}"/>`;
	const lidded = (x: number, clipId: string) =>
		`<clipPath id="${clipId}"><polygon points="${x - 9},-3.5 ${x + 9},-3.5 ${x + 9},9 ${x - 9},9"/></clipPath>` +
		`<g clip-path="url(#${clipId})"><circle cx="${x}" cy="-2" r="7.2" fill="#fff"/><circle cx="${x + look[0] * 1.5}" cy="${1 + look[1] * 0.5}" r="3.8" fill="${pupil}"/></g>` +
		`<path d="M${x - 6.4} -3.5H${x + 6.4}" ${stroke(2.2)}/>`;
	const cross = (x: number, side: number) =>
		`<circle cx="${x}" cy="-2" r="7.2" fill="#fff"/><circle cx="${x + 3 * side}" cy="-1.5" r="3.6" fill="${pupil}"/>`;
	const shocked = (x: number) =>
		`<circle cx="${x}" cy="-2" r="7.2" fill="#fff"/><circle cx="${x + look[0] * 0.8}" cy="${-2 + look[1] * 0.8}" r="1.9" fill="${pupil}"/>`;
	const peepWink =
		`<circle cx="${leftX}" cy="-2.5" r="4.8" fill="#fff"/>` +
		`<circle cx="${leftX + look[0] * 0.45}" cy="${-2.5 + look[1] * 0.45}" r="2.45" fill="${pupil}"/>` +
		`<path d="M${rightX - 4.2} -1.4Q${rightX} -7.2 ${rightX + 4.4} -1.8" ${stroke(2.1)}/>`;
	const distortedEye = (x: number, side: number) => {
		const eyeX = x - side * 0.9;
		const centerY = -3.4;
		const pupilX = eyeX - side * 1.8 + look[0] * 1.2;
		const pupilY = centerY - 0.6 + look[1] * 1.2;
		return (
			`<path transform="translate(${eyeX} ${centerY}) scale(${1.04 * side} 1.04)" d="M-7.5 2.9C-7.6 -3.5 -4.2 -8.8 -0.5 -9.2C2.8 -9.5 6.2 -8.2 7 -5.6C7.9 -2.8 7.6 1.2 5.8 4.8C4 8.2 0.8 9.4 -1.2 9.3C-4.8 9.2 -7.3 6.2 -7.5 2.9Z" fill="#fff"/>` +
			`<ellipse cx="${pupilX}" cy="${pupilY}" rx="2.6" ry="4.3" fill="${pupil}" transform="rotate(${25 * side} ${pupilX} ${pupilY})"/>`
		);
	};
	const eyes = getItem(
		[
			big(leftX) + big(rightX),
			`<circle cx="${leftX}" cy="-2" r="3.6" fill="${ink}"/><circle cx="${rightX}" cy="-2" r="3.6" fill="${ink}"/>`,
			sleepy(leftX) + sleepy(rightX),
			happy(leftX) + happy(rightX),
			big(leftX) + happy(rightX),
			`<path d="M${leftX - 4} -6L${leftX + 3} -2L${leftX - 4} 2M${rightX + 4} -6L${rightX - 3} -2L${rightX + 4} 2" ${stroke(2.4)}/>`,
			distortedEye(leftX, 1) + distortedEye(rightX, -1),
			grumpy(leftX, 1) + grumpy(rightX, -1),
			big(leftX, -3.5, 8) + big(rightX, -0.5, 5.6),
			oval(leftX) + oval(rightX),
			lidded(leftX, `${id}c`) + lidded(rightX, `${id}d`),
			cross(leftX, 1) + cross(rightX, -1),
			shocked(leftX) + shocked(rightX),
			peepWink,
		],
		eyeI
	);

	const mouthY = 8;
	const mouthFill = darkBlob ? "#4a4a58" : pupil;
	const openMouth = (
		width: number,
		height: number,
		top: number,
		withTeeth: boolean
	) => {
		const path = `M${-width} ${top}H${width}C${width} ${top + height * 0.8} ${width * 0.55} ${top + height} 0 ${top + height}C${-width * 0.55} ${top + height} ${-width} ${top + height * 0.8} ${-width} ${top}Z`;
		const clipId = `${id}m`;
		const teeth = withTeeth
			? `<rect x="${-width}" y="${top}" width="${width * 2}" height="2.6" fill="#fff"/>`
			: "";
		return (
			`<clipPath id="${clipId}"><path d="${path}"/></clipPath>` +
			`<path d="${path}" fill="${mouthFill}" stroke="${mouthFill}" stroke-width="1.6" stroke-linejoin="round"/>` +
			`<g clip-path="url(#${clipId})">${teeth}` +
			`<ellipse cx="0" cy="${top + height}" rx="${width * 0.62}" ry="${height * 0.42}" fill="#ff8fa3"/></g>`
		);
	};
	const mouth = getItem(
		[
			`<path d="M-3.2 ${mouthY}Q0 ${mouthY + 3.8} 3.2 ${mouthY}" ${stroke(2.2)}/>`,
			`<path d="M-2.6 ${mouthY + 1}H2.6" ${stroke(2.2)}/>`,
			openMouth(4.4, 7.2, 6.2, false),
			`<path d="M-3 ${mouthY + 2}Q0 ${mouthY - 1.6} 3 ${mouthY + 2}" ${stroke(2.2)}/>`,
			`<ellipse cx="0" cy="${mouthY + 1}" rx="2" ry="2.5" fill="${ink}"/>`,
			`<path d="M-3 ${mouthY}Q0.5 ${mouthY + 4} 3.5 ${mouthY - 1}" ${stroke(2.2)}/>`,
			`<path d="M0.4 9.2V13.2a2.4 2.4 0 0 0 4.8 0V8.6Z" fill="#ff7a93"/><path d="M-5.5 7Q0 13 5.5 7" ${stroke(2.2)}/>`,
			openMouth(7, 7.8, 5.6, true),
			`<path d="M-4 7.5H4" ${stroke(2.2)}/><rect x="-2.6" y="8" width="2.4" height="3.2" rx=".7" fill="#fff" stroke="${pupil}" stroke-width=".8"/><rect x=".2" y="8" width="2.4" height="3.2" rx=".7" fill="#fff" stroke="${pupil}" stroke-width=".8"/>`,
			`<path d="M-5 8Q-2.5 5 0 8T5 8" ${stroke(2.2)}/>`,
			`<path d="M-7 5.4Q0 14.6 7 5.4" ${stroke(2.4)}/>`,
		],
		mouthI
	);
	const brow = (x: number, side: number) =>
		getItem(
			[
				"",
				`<path d="M${x - 4.5} -12Q${x} -16 ${x + 4.5} -12" ${stroke(2.2)}/>`,
				`<path d="M${x - 5 * side} -15.5L${x + 5 * side} -11.5" ${stroke(2.2)}/>`,
				`<path d="M${x - 5 * side} -11.5L${x + 5 * side} -15.5" ${stroke(2.2)}/>`,
				`<path d="M${x - 4.6} -12.6H${x + 4.6}" ${stroke(2.4)}/>`,
				side > 0
					? `<path d="M${x - 4.5} -13Q${x} -18.2 ${x + 4.5} -13" ${stroke(2.2)}/>`
					: `<path d="M${x - 4.5} -11.8H${x + 4.5}" ${stroke(2.2)}/>`,
				`<path d="M${x - 5} -14.6Q${x} -22.4 ${x + 5} -14.6" ${stroke(2.2)}/>`,
				`<path d="M${x - 4.6} -11.6L${x + 4.6} -14.4" ${stroke(2.2)}/>`,
				side > 0
					? `<path d="M${x - 5} -12.6Q0 -15.8 ${-x + 5} -12.6" ${stroke(2.4)}/>`
					: "",
			],
			browI
		);
	let browShift = 0;
	if (eyeI === 8) {
		browShift = -2.5;
	} else if (eyeI === 6) {
		browShift = -3;
	}
	const brows = `<g transform="translate(0 ${browShift})">${brow(leftX, 1)}${brow(rightX, -1)}</g>`;
	const face = `<g transform="translate(${body.f[0] + dx} ${body.f[1] + dy}) scale(${body.f[2]}) rotate(${faceTilt})">${brows}${eyes}${mouth}</g>`;

	const frameRadius = FRAME_RADII[frame] ?? 18;
	const flipTransform = flip ? ' transform="translate(80 0) scale(-1 1)"' : "";
	const svg =
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80" role="img" aria-label="Blob avatar for ${escapeXml(key)}">` +
		`<defs><clipPath id="${id}"><rect width="80" height="80" rx="${frameRadius}"/></clipPath>` +
		`<mask id="${id}s" maskUnits="userSpaceOnUse" x="0" y="0" width="80" height="80">${whiteBody}</mask></defs>` +
		`<g clip-path="url(#${id})"><rect width="80" height="80" fill="${background}"/>` +
		`<g transform="translate(40 42) rotate(${tilt}) scale(1.15) translate(-40 -42)"><g${flipTransform}>${bodySvg}${shine}</g><g${flipTransform}>${face}</g></g></g></svg>`;

	const features: readonly AvatarFeature[] = [
		{
			at: 1,
			label: "Background",
			of: 1,
			swatch: background,
			value: background,
		},
		{ at: 1, label: "Body colour", of: 1, swatch: blob, value: blob },
		{
			at: shapeI + 1,
			label: "Silhouette",
			of: 21,
			value: getItem(AVATAR_CHOICES.shape, shapeI),
		},
		{ at: flip + 1, label: "Mirrored", of: 2, value: flip ? "yes" : "no" },
		{
			at: eyeI + 1,
			label: "Eyes",
			of: 14,
			value: getItem(AVATAR_CHOICES.eyes, eyeI),
		},
		{
			at: lookI + 1,
			label: "Looking",
			of: 5,
			value: getItem(AVATAR_CHOICES.look, lookI),
		},
		{
			at: gapI + 1,
			label: "Eye gap",
			of: 3,
			value: getItem(AVATAR_CHOICES.gap, gapI),
		},
		{
			at: mouthI + 1,
			label: "Mouth",
			of: 11,
			value: getItem(AVATAR_CHOICES.mouth, mouthI),
		},
		{
			at: browI + 1,
			label: "Brows",
			of: 9,
			value: getItem(AVATAR_CHOICES.brows, browI),
		},
		{ at: faceTiltI + 1, label: "Face angle", of: 25, value: `${faceTilt}°` },
		{ at: tiltI + 1, label: "Tilt", of: 15, value: `${tilt}°` },
		{
			at: dxI * 3 + dyI + 1,
			label: "Face shift",
			of: 15,
			value: `${dx}, ${dy}`,
		},
	];
	const combos = features.reduce((total, feature) => total * feature.of, 1);
	return { choices, combos, features, key, svg };
};

export const makeAvatar = (
	input: unknown,
	colours: AvatarPalette,
	frame: AvatarFrame = "rounded",
	overrides: AvatarChoiceOverrides | null = null
): AvatarResult => {
	const key = String(input).trim().toLowerCase();
	const hash = hashAvatarSeed(key);
	const random = createSeededRandom(
		(hash % 4_294_967_296) ^ Math.floor(hash / 4_294_967_296)
	);
	const integer = (count: number) => Math.floor(random() * count);

	random();
	random();
	let shapeI = integer(21);
	let eyeI = integer(14);
	let lookI = integer(5);
	let mouthI = integer(11);
	let tiltI = integer(15);
	let dxI = integer(5);
	let dyI = integer(3);
	let gapI = integer(3);
	let flip = integer(2);
	let browI = integer(9);
	let faceTiltI = integer(25);
	if (overrides) {
		shapeI = choiceOrFallback(overrides.shapeI, 21, shapeI);
		eyeI = choiceOrFallback(overrides.eyeI, 14, eyeI);
		lookI = choiceOrFallback(overrides.lookI, 5, lookI);
		mouthI = choiceOrFallback(overrides.mouthI, 11, mouthI);
		tiltI = choiceOrFallback(overrides.tiltI, 15, tiltI);
		dxI = choiceOrFallback(overrides.dxI, 5, dxI);
		dyI = choiceOrFallback(overrides.dyI, 3, dyI);
		gapI = choiceOrFallback(overrides.gapI, 3, gapI);
		flip = choiceOrFallback(overrides.flip, 2, flip);
		browI = choiceOrFallback(overrides.browI, 9, browI);
		faceTiltI = choiceOrFallback(overrides.faceTiltI, 25, faceTiltI);
	}
	const choices: AvatarChoices = {
		browI,
		dxI,
		dyI,
		eyeI,
		faceTiltI,
		flip,
		gapI,
		lookI,
		mouthI,
		shapeI,
		tiltI,
	};
	const id = `fp${hash.toString(36)}-${shapeI}-${eyeI}-${mouthI}-${gapI}${frame.charAt(0)}`;
	const avatar = renderAvatar({ choices, colours, frame, id, key });
	return { ...avatar, hash, key };
};

export const DEFAULT_CUSTOM_AVATAR_CHOICES = {
	bodyTilt: 0,
	brows: "none",
	eyeSpacing: "medium",
	eyes: "big",
	faceAngle: 0,
	facePosition: { x: 0, y: 0 },
	look: "centre",
	mirrored: false,
	mouth: "smile",
	shape: "round",
} as const satisfies CustomAvatarChoices;

const getChoiceIndex = <Choice extends string>(
	choices: readonly Choice[],
	value: Choice,
	label: string
): number => {
	const index = choices.indexOf(value);
	if (index === -1) {
		throw new RangeError(`Unknown avatar ${label}: ${String(value)}`);
	}
	return index;
};

const requireIntegerInRange = (
	value: unknown,
	minimum: number,
	maximum: number,
	label: string
): number => {
	if (
		typeof value !== "number" ||
		!Number.isInteger(value) ||
		value < minimum ||
		value > maximum
	) {
		throw new RangeError(
			`${label} must be an integer from ${minimum} to ${maximum}.`
		);
	}
	return value;
};

const requireBoolean = (value: unknown, label: string): boolean => {
	if (typeof value !== "boolean") {
		throw new TypeError(`${label} must be a boolean.`);
	}
	return value;
};

export const toAvatarChoices = (
	choices: CustomAvatarChoices
): AvatarChoices => {
	const bodyTilt = requireIntegerInRange(
		choices.bodyTilt,
		-14,
		14,
		"Body tilt"
	);
	if (bodyTilt % 2 !== 0) {
		throw new RangeError("Body tilt must use two-degree increments.");
	}
	const faceAngle = requireIntegerInRange(
		choices.faceAngle,
		-12,
		12,
		"Face angle"
	);
	const positionX = requireIntegerInRange(
		choices.facePosition.x,
		-2,
		2,
		"Horizontal face position"
	);
	const positionY = requireIntegerInRange(
		choices.facePosition.y,
		-1,
		1,
		"Vertical face position"
	);

	return {
		browI: getChoiceIndex(AVATAR_CHOICES.brows, choices.brows, "brows"),
		dxI: positionX + 2,
		dyI: positionY + 1,
		eyeI: getChoiceIndex(AVATAR_CHOICES.eyes, choices.eyes, "eyes"),
		faceTiltI: faceAngle + 12,
		flip: requireBoolean(choices.mirrored, "Mirrored") ? 1 : 0,
		gapI: getChoiceIndex(AVATAR_CHOICES.gap, choices.eyeSpacing, "eye spacing"),
		lookI: getChoiceIndex(AVATAR_CHOICES.look, choices.look, "look"),
		mouthI: getChoiceIndex(AVATAR_CHOICES.mouth, choices.mouth, "mouth"),
		shapeI: getChoiceIndex(AVATAR_CHOICES.shape, choices.shape, "shape"),
		tiltI: bodyTilt / 2 + 7,
	};
};

export const toCustomAvatarChoices = (
	choices: AvatarChoices
): CustomAvatarChoices => ({
	bodyTilt: (choices.tiltI - 7) * 2,
	brows: getItem(AVATAR_CHOICES.brows, choices.browI),
	eyeSpacing: getItem(AVATAR_CHOICES.gap, choices.gapI),
	eyes: getItem(AVATAR_CHOICES.eyes, choices.eyeI),
	faceAngle: choices.faceTiltI - 12,
	facePosition: {
		x: choices.dxI - 2,
		y: choices.dyI - 1,
	},
	look: getItem(AVATAR_CHOICES.look, choices.lookI),
	mirrored: choices.flip === 1,
	mouth: getItem(AVATAR_CHOICES.mouth, choices.mouthI),
	shape: getItem(AVATAR_CHOICES.shape, choices.shapeI),
});

export const createCustomAvatar = ({
	choices: customChoices,
	palette = DEFAULT_AVATAR_PALETTE,
	frame = "rounded",
}: CreateCustomAvatarOptions): CustomAvatarResult => {
	const choices = toAvatarChoices(customChoices);
	const signature = [
		choices.shapeI,
		choices.eyeI,
		choices.lookI,
		choices.mouthI,
		choices.tiltI,
		choices.dxI,
		choices.dyI,
		choices.gapI,
		choices.flip,
		choices.browI,
		choices.faceTiltI,
		frame,
		palette[0],
		palette[1],
	].join("|");
	const technicalId = `fpc${hashAvatarSeed(signature).toString(36)}`;
	const avatar = renderAvatar({
		choices,
		colours: palette,
		frame,
		id: technicalId,
		key: "custom avatar",
	});
	return { ...avatar, key: "custom avatar" };
};

export const createAvatar = ({
	name,
	palette = DEFAULT_AVATAR_PALETTE,
	frame = "rounded",
	choices = null,
}: CreateAvatarOptions): AvatarResult =>
	makeAvatar(name, palette, frame, choices);
