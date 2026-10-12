import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import {
	AVATAR_CHOICES,
	AVATAR_COMBINATION_COUNT,
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
	test("matches the rounded index.html output", () => {
		const avatar = makeAvatar("Janaki", ["#f2f1f4", "#7c6cf2"], "rounded");

		expect(avatar.key).toBe("janaki");
		expect(avatar.hash).toBe(4_216_952_012_017_202);
		expect(avatar.combos).toBe(4_911_637_500);
		expect(avatar.choices).toEqual({
			browI: 7,
			dxI: 2,
			dyI: 1,
			eyeI: 0,
			faceTiltI: 20,
			flip: 1,
			gapI: 1,
			lookI: 0,
			mouthI: 8,
			shapeI: 1,
			tiltI: 0,
		});
		expect(digest(avatar.svg)).toBe(
			"48745f125fe596ff9e116476aaaf2295ecca286872dd20ce006bfb6a4782e32a"
		);
	});

	test("matches the circle index.html output", () => {
		const avatar = makeAvatar(
			"Blobz <Admin>",
			["#101828", "#f79009"],
			"circle"
		);

		expect(avatar.hash).toBe(1_665_355_454_956_846);
		expect(digest(avatar.svg)).toBe(
			"c0cf729908dd0791d4d429a22ad26c6b7e3245f442843efd51ca0b0ac17058bd"
		);
		expect(avatar.svg).toContain("Blob avatar for blobz &lt;admin&gt;");
	});

	test("supports every manual face choice", () => {
		const choices = {
			browI: 8,
			dxI: 4,
			dyI: 2,
			eyeI: 6,
			faceTiltI: 24,
			flip: 1,
			gapI: 2,
			lookI: 4,
			mouthI: 10,
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
		expect(digest(avatar.svg)).toBe(
			"39a1de2cad99598136aedcd222e4c7c793ab32357309aff76057c877a2c2ba0f"
		);
	});

	test("exposes the complete choice catalogue", () => {
		expect(AVATAR_CHOICES.shape).toHaveLength(21);
		expect(AVATAR_CHOICES.eyes).toHaveLength(14);
		expect(AVATAR_CHOICES.look).toHaveLength(5);
		expect(AVATAR_CHOICES.mouth).toHaveLength(11);
		expect(AVATAR_CHOICES.brows).toHaveLength(9);
		expect(AVATAR_CHOICES.gap).toHaveLength(3);
		expect(AVATAR_COMBINATION_COUNT).toBe(4_911_637_500);
	});

	test("normalizes names and stays deterministic", () => {
		const first = makeAvatar("  Blobz  ", ["#fffafa", "#7c6cf2"]);
		const second = makeAvatar("blobz", ["#fffafa", "#7c6cf2"]);
		expect(first).toEqual(second);
	});

	test("ignores invalid overrides", () => {
		const generated = makeAvatar("fallback", ["#f8fafc", "#14b8a6"]);
		const invalid = makeAvatar("fallback", ["#f8fafc", "#14b8a6"], "rounded", {
			eyeI: -1,
			mouthI: 1.5,
			shapeI: 99,
		});
		expect(invalid).toEqual(generated);
	});

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
