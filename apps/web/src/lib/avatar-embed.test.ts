import { describe, expect, it } from "bun:test";
import { createAvatar } from "@blobz/avatar-core";
import { parseEmbedAvatarQuery, renderEmbeddedAvatar } from "./avatar-embed";

describe("avatar image URLs", () => {
	it("uses the same deterministic face and defaults as the React package", () => {
		const options = parseEmbedAvatarQuery(new URLSearchParams("name=Janaki"));
		expect(options).not.toBeNull();
		if (!options) {
			throw new Error("Expected a valid avatar URL.");
		}
		expect(renderEmbeddedAvatar(options)).toBe(
			createAvatar({ name: "Janaki" }).svg
		);
	});

	it("supports Blobz frame, two-color palette, and size", () => {
		const options = parseEmbedAvatarQuery(
			new URLSearchParams({
				frame: "circle",
				name: "Janaki",
				palette: "#EEF9FF,#38BDF8",
				size: "160",
			})
		);
		expect(options).toEqual({
			frame: "circle",
			name: "Janaki",
			palette: ["#eef9ff", "#38bdf8"],
			size: 160,
		});
		if (!options) {
			throw new Error("Expected a valid avatar URL.");
		}
		expect(renderEmbeddedAvatar(options)).toContain('width="160" height="160"');
		expect(renderEmbeddedAvatar(options)).toContain('viewBox="0 0 80 80"');
	});

	it("rejects unknown, repeated, and malformed parameters", () => {
		for (const query of [
			"name=Janaki&variant=beam",
			"name=Janaki&__proto__=polluted",
			"name=Janaki&name=Other",
			"name=Janaki&palette=red,blue",
			"name=Janaki&palette=%23ffffff",
			"name=Janaki&frame=triangle",
			"name=Janaki&size=0",
			"name=Janaki&size=5000",
			"name=%20",
			"size=80",
		]) {
			expect(parseEmbedAvatarQuery(new URLSearchParams(query))).toBeNull();
		}
	});
});
