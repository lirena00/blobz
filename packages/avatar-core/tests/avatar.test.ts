import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import {
	AVATAR_CHOICES,
	AVATAR_COMBINATION_COUNT,
	createAvatar,
	makeAvatar,
} from "../src/avatar";

const digest = (value: string) =>
	createHash("sha256").update(value).digest("hex");

describe("avatar-core", () => {
	test("matches the rounded index.html output", () => {
		const avatar = makeAvatar(
			"Ada Lovelace",
			["#f2f1f4", "#7c6cf2"],
			"rounded"
		);

		expect(avatar.key).toBe("ada lovelace");
		expect(avatar.hash).toBe(426_552_004_313_640);
		expect(avatar.combos).toBe(1_135_134_000);
		expect(avatar.choices).toEqual({
			browI: 2,
			dxI: 1,
			dyI: 2,
			eyeI: 5,
			faceTiltI: 9,
			flip: 0,
			gapI: 1,
			lookI: 3,
			mouthI: 4,
			shapeI: 14,
			tiltI: 6,
		});
		expect(digest(avatar.svg)).toBe(
			"df677c49b77227a713bccb10fb4fa2236c41d828a082bc8f444046207726c487"
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
			"2062c8bc16004778fd41f8bff74b1dc0fa9e8afa4d161a1552e2871dd8fe9952"
		);
		expect(avatar.svg).toContain("Blob avatar for blobz &lt;admin&gt;");
	});

	test("supports every manual face choice", () => {
		const choices = {
			browI: 3,
			dxI: 4,
			dyI: 2,
			eyeI: 13,
			faceTiltI: 12,
			flip: 1,
			gapI: 2,
			lookI: 4,
			mouthI: 10,
			shapeI: 11,
			tiltI: 14,
		} as const;
		const avatar = createAvatar({
			choices,
			frame: "square",
			name: "custom",
			palette: ["#ffffff", "#12b76a"],
		});

		expect(avatar.choices).toEqual(choices);
		expect(avatar.features.map(({ value }) => value)).toContain("peep wink");
		expect(digest(avatar.svg)).toBe(
			"09644392d6cd5f8db1c87147b4451fa94817889e6baa98429ad8851a53c3686f"
		);
	});

	test("exposes the complete builder catalogue", () => {
		expect(AVATAR_CHOICES.shape).toHaveLength(21);
		expect(AVATAR_CHOICES.eyes).toHaveLength(14);
		expect(AVATAR_CHOICES.look).toHaveLength(5);
		expect(AVATAR_CHOICES.mouth).toHaveLength(11);
		expect(AVATAR_CHOICES.brows).toHaveLength(4);
		expect(AVATAR_CHOICES.gap).toHaveLength(3);
		expect(AVATAR_COMBINATION_COUNT).toBe(1_135_134_000);
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
});
