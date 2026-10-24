import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import {
	AVATAR_CHOICES,
	AVATAR_COMBINATION_COUNT,
	type AvatarFrame,
	createAvatar,
	createCustomAvatar,
	DEFAULT_CUSTOM_AVATAR_CHOICES,
	makeAvatar,
	toAvatarChoices,
	toCustomAvatarChoices,
} from "../src/avatar";

const digest = (value: string) =>
	createHash("sha256").update(value).digest("hex");

describe("avatar-core", () => {
	test("matches the rounded Faceprint v2 output", () => {
		const avatar = makeAvatar("Janaki", ["#f2f1f4", "#7c6cf2"], "rounded");

		expect(avatar.key).toBe("janaki");
		expect(avatar.hash).toBe(4_216_952_012_017_202);
		expect(avatar.combos).toBe(5_159_700_000);
		expect(avatar.choices).toEqual({
			browI: 6,
			dxI: 2,
			dyI: 1,
			eyeI: 0,
			faceTiltI: 20,
			flip: 1,
			gapI: 1,
			lookI: 0,
			mouthI: 10,
			shapeI: 1,
			tiltI: 0,
		});
		expect(digest(avatar.svg)).toBe(
			"b827686a13c219bd9b7b2c5271ac2f4bfb704bf465956151161904dbf47d24d3"
		);
	});

	test("matches the circle Faceprint v2 output", () => {
		const avatar = makeAvatar(
			"Blobz <Admin>",
			["#101828", "#f79009"],
			"circle"
		);

		expect(avatar.hash).toBe(1_665_355_454_956_846);
		expect(digest(avatar.svg)).toBe(
			"5667914a244cf9d8f77355ac1b4099370fb1815e427a152e7af79454c1369937"
		);
		expect(avatar.svg).toContain("Blob avatar for blobz &lt;admin&gt;");
	});

	test("supports every manual face choice", () => {
		const choices = {
			browI: 7,
			dxI: 4,
			dyI: 2,
			eyeI: 6,
			faceTiltI: 24,
			flip: 1,
			gapI: 2,
			lookI: 4,
			mouthI: 12,
			shapeI: 16,
			tiltI: 14,
		} as const;
		const avatar = createAvatar({
			choices,
			frame: "square",
			name: "custom",
			palette: ["#ffffff", "#12b76a"],
		});

		expect(avatar.choices).toEqual(choices);
		const values = avatar.features.map(({ value }) => value);
		expect(values).toContain("leaf");
		expect(values).toContain("distorted");
		expect(values).toContain("unibrow");
		expect(values).toContain("angry");
		expect(digest(avatar.svg)).toBe(
			"99a6680e1531099ec7d2f5783f889ffcd3865120efb9620b67d23777b2d1ebea"
		);
	});

	test("exposes the complete choice catalogue", () => {
		expect(AVATAR_CHOICES.shape).toHaveLength(21);
		expect(AVATAR_CHOICES.eyes).toHaveLength(14);
		expect(AVATAR_CHOICES.look).toHaveLength(5);
		expect(AVATAR_CHOICES.mouth).toHaveLength(13);
		expect(AVATAR_CHOICES.brows).toHaveLength(8);
		expect(AVATAR_CHOICES.gap).toHaveLength(3);
		expect(AVATAR_COMBINATION_COUNT).toBe(5_159_700_000);
		expect(AVATAR_COMBINATION_COUNT).toBe(
			makeAvatar("catalogue", ["#f2f1f4", "#7c6cf2"]).combos
		);
	});

	test("matches Faceprint v2 shading and features across every silhouette", () => {
		const matrix = createHash("sha256");
		const frames: readonly AvatarFrame[] = ["rounded", "circle", "square"];
		const bodies = [
			"#7c6cf2",
			"#171717",
			"#000000",
			"#ffffff",
			"#aaaaaa",
			"#ff0000",
			"#ffff00",
			"#00ff00",
			"#00ffff",
			"#0000ff",
			"#ff00ff",
			"#595959",
			"#5a5a5a",
		];
		for (const [shapeI] of AVATAR_CHOICES.shape.entries()) {
			for (const frame of frames) {
				for (const [colourI, body] of bodies.entries()) {
					for (const flip of [0, 1]) {
						const avatar = makeAvatar(
							"Faceprint parity",
							["#f2f1f4", body],
							frame,
							{
								browI: (shapeI + colourI) % 8,
								dxI: colourI % 5,
								dyI: colourI % 3,
								eyeI: (shapeI + colourI) % 14,
								faceTiltI: shapeI % 25,
								flip,
								gapI: colourI % 3,
								lookI: colourI % 5,
								mouthI: (shapeI + colourI) % 13,
								shapeI,
								tiltI: shapeI % 15,
							}
						);
						matrix.update(avatar.svg);
					}
				}
			}
		}
		// Captured from faceprint-v2 (3).html, omitting its unused blur filter.
		expect(matrix.digest("hex")).toBe(
			"636ee4df85c0d2fb07ca1f59157ac68863f90cfaf4877c99e0c49b43608ba21e"
		);
	});

	test("keeps all SVG definition IDs unique for side-eye avatars", () => {
		const { svg } = createAvatar({ choices: { eyeI: 10 }, name: "side-eye" });
		const ids = Array.from(svg.matchAll(/\bid="([^"]+)"/g), ([, id]) => id);
		expect(new Set(ids).size).toBe(ids.length);
		expect(svg).toContain("<linearGradient ");
		expect(svg).toContain('stdDeviation="3.3"');
		for (const [, id] of svg.matchAll(/url\(#([^)]+)\)/g)) {
			expect(ids).toContain(id);
		}
	});

	test("normalizes names and stays deterministic", () => {
		const first = makeAvatar("  Blobz  ", ["#fffafa", "#7c6cf2"]);
		const second = makeAvatar("blobz", ["#fffafa", "#7c6cf2"]);
		expect(first).toEqual(second);
	});

	test("ignores invalid overrides", () => {
		const generated = makeAvatar("fallback", ["#f8fafc", "#14b8a6"]);
		const invalid = makeAvatar("fallback", ["#f8fafc", "#14b8a6"], "rounded", {
			browI: 8,
			eyeI: -1,
			mouthI: 1.5,
			shapeI: 99,
		});
		expect(invalid).toEqual(generated);
	});

	test.each(["uwu", "angry"] as const)(
		"supports the %s mouth in custom avatars",
		(mouth) => {
			const customChoices = {
				...DEFAULT_CUSTOM_AVATAR_CHOICES,
				brows: "unibrow",
				mouth,
			} as const;
			const avatar = createCustomAvatar({ choices: customChoices });
			expect(toCustomAvatarChoices(avatar.choices)).toEqual(customChoices);
			expect(avatar.choices.browI).toBe(7);
			expect(avatar.features).toContainEqual({
				at: avatar.choices.mouthI + 1,
				label: "Mouth",
				of: 13,
				value: mouth,
			});
		}
	);

	test("renders a custom avatar without a name-derived hash", () => {
		const avatar = createCustomAvatar({
			choices: {
				...DEFAULT_CUSTOM_AVATAR_CHOICES,
				brows: "quizzical",
				eyes: "distorted",
				faceAngle: 8,
				facePosition: { x: 2, y: -1 },
				shape: "leaf",
			},
			frame: "circle",
			palette: ["#eff8f5", "#10b8a6"],
		});

		expect(avatar.key).toBe("custom avatar");
		expect("hash" in avatar).toBe(false);
		expect(avatar.features.map(({ value }) => value)).toContain("quizzical");
		expect(avatar.features.map(({ value }) => value)).toContain("distorted");
		expect(avatar.features.map(({ value }) => value)).toContain("leaf");
	});

	test("round-trips semantic custom choices", () => {
		const indexed = toAvatarChoices(DEFAULT_CUSTOM_AVATAR_CHOICES);

		expect(indexed).toEqual({
			browI: 0,
			dxI: 2,
			dyI: 1,
			eyeI: 0,
			faceTiltI: 12,
			flip: 0,
			gapI: 1,
			lookI: 0,
			mouthI: 0,
			shapeI: 15,
			tiltI: 7,
		});
		expect(toCustomAvatarChoices(indexed)).toEqual(
			DEFAULT_CUSTOM_AVATAR_CHOICES
		);
	});

	test("rejects invalid custom geometry", () => {
		expect(() =>
			createCustomAvatar({
				choices: { ...DEFAULT_CUSTOM_AVATAR_CHOICES, bodyTilt: 3 },
			})
		).toThrow("Body tilt must use two-degree increments.");
	});
});
