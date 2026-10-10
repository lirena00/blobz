import { describe, expect, test } from "bun:test";
import {
	createCustomAvatar,
	DEFAULT_CUSTOM_AVATAR_CHOICES,
	makeAvatar,
} from "@blobz/avatar-core";
import { renderToStaticMarkup } from "react-dom/server";
import { Avatar, createAvatarDataUri } from "../src/avatar";
import { CustomAvatar } from "../src/custom-avatar";

describe("Avatar", () => {
	test("renders the avatar-core result as an image", () => {
		const coreAvatar = makeAvatar(
			"Ada Lovelace",
			["#f2f1f4", "#7c6cf2"],
			"rounded"
		);
		const markup = renderToStaticMarkup(
			<Avatar
				className="profile-avatar"
				name="Ada Lovelace"
				palette={["#f2f1f4", "#7c6cf2"]}
				size={48}
			/>
		);

		expect(markup).toContain('class="profile-avatar"');
		expect(markup).toContain('alt="Blob avatar for ada lovelace"');
		expect(markup).toContain('height="48"');
		expect(markup).toContain('width="48"');
		expect(markup).toContain(
			createAvatarDataUri(coreAvatar.svg).replaceAll("&", "&amp;")
		);
	});

	test("passes manual face choices to avatar-core", () => {
		const markup = renderToStaticMarkup(
			<Avatar
				choices={{ eyeI: 13, mouthI: 10, shapeI: 11 }}
				frame="circle"
				name="custom-face"
				palette={["#ffffff", "#12b76a"]}
			/>
		);
		const expected = makeAvatar(
			"custom-face",
			["#ffffff", "#12b76a"],
			"circle",
			{ eyeI: 13, mouthI: 10, shapeI: 11 }
		);

		expect(markup).toContain(
			createAvatarDataUri(expected.svg).replaceAll("&", "&amp;")
		);
	});

	test("supports decorative alt text and CSS sizes", () => {
		const markup = renderToStaticMarkup(
			<Avatar alt="" name="decorative" size="2.5rem" />
		);

		expect(markup).toContain('alt=""');
		expect(markup).toContain("height:2.5rem");
		expect(markup).toContain("width:2.5rem");
		expect(markup).not.toContain('height="');
	});

	test("is deterministic across React renders", () => {
		const first = renderToStaticMarkup(<Avatar name="same-user" />);
		const second = renderToStaticMarkup(<Avatar name="same-user" />);

		expect(first).toBe(second);
	});

	test("renders a complete custom definition as an image", () => {
		const definition = {
			choices: {
				...DEFAULT_CUSTOM_AVATAR_CHOICES,
				brows: "high",
				shape: "pillow",
			},
			frame: "circle",
			palette: ["#fff0f6", "#f52b96"],
			type: "custom",
			version: 1,
		} as const;
		const custom = createCustomAvatar(definition);
		const markup = renderToStaticMarkup(
			<CustomAvatar definition={definition} size={72} />
		);

		expect(markup).toContain('alt="Custom blob avatar"');
		expect(markup).toContain('data-blobz-source="custom"');
		expect(markup).toContain('height="72"');
		expect(markup).toContain(
			createAvatarDataUri(custom.svg).replaceAll("&", "&amp;")
		);
	});
});
