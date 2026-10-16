// biome-ignore-all lint/performance/noJsxPropsBind: Test callbacks are scoped to a single render and collect emitted values.
import "@/test/dom";
import { afterEach, describe, expect, test } from "bun:test";
import type { AvatarDefinition } from "@blobz/avatar-core";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { AvatarBuilder } from "./avatar-builder";
import { AvatarPalettePicker } from "./avatar-palette-picker";

const mountedRoots: Root[] = [];

const click = (element: Element | null): void => {
	if (!(element instanceof HTMLButtonElement)) {
		throw new Error("Expected an avatar-builder button.");
	}
	act(() => {
		element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
};

afterEach(() => {
	for (const root of mountedRoots.splice(0)) {
		act(() => root.unmount());
	}
	document.body.textContent = "";
});

describe("AvatarBuilder", () => {
	test("renders preview actions and applies a named palette", () => {
		const changes: AvatarDefinition[] = [];
		const recordChange = (value: AvatarDefinition) => {
			changes.push(value);
		};
		const container = document.createElement("div");
		document.body.append(container);
		const root = createRoot(container);
		mountedRoots.push(root);

		act(() => {
			root.render(
				<AvatarBuilder onValueChange={recordChange}>
					<button type="button">Export avatar</button>
				</AvatarBuilder>
			);
		});

		expect(
			container.querySelector(".blobz-builder__preview-actions")?.textContent
		).toContain("Export avatar");
		const paletteButton = container.querySelector(
			"button[aria-label='Use Coral palette']"
		);
		click(paletteButton);

		const updated = changes.at(-1);
		expect(updated?.palette).toEqual(["#fff1f2", "#fb7185"]);
		expect(paletteButton?.getAttribute("aria-pressed")).toBe("true");
	});

	test("switches to custom mode and emits semantic choices", () => {
		const changes: AvatarDefinition[] = [];
		const recordChange = (value: AvatarDefinition) => {
			changes.push(value);
		};
		const container = document.createElement("div");
		document.body.append(container);
		const root = createRoot(container);
		mountedRoots.push(root);

		act(() => {
			root.render(<AvatarBuilder onValueChange={recordChange} />);
		});

		expect(container.querySelector("[data-mode='generated']")).not.toBeNull();
		const modeButtons = container.querySelectorAll(
			".blobz-builder__mode-switch button"
		);
		click(modeButtons.item(1));

		const customValue = changes.at(-1);
		expect(customValue?.type).toBe("custom");
		expect(container.querySelector("[data-mode='custom']")).not.toBeNull();
		expect(
			container.querySelector("img[data-blobz-source='custom']")
		).not.toBeNull();
	});

	test("preserves a manual draft while switching modes", () => {
		const changes: AvatarDefinition[] = [];
		const recordChange = (value: AvatarDefinition) => {
			changes.push(value);
		};
		const container = document.createElement("div");
		document.body.append(container);
		const root = createRoot(container);
		mountedRoots.push(root);

		act(() => {
			root.render(<AvatarBuilder onValueChange={recordChange} />);
		});

		let modeButtons = container.querySelectorAll(
			".blobz-builder__mode-switch button"
		);
		click(modeButtons.item(1));
		click(container.querySelector("button[aria-label='Use blob shape: leaf']"));

		const edited = changes.at(-1);
		expect(edited?.type).toBe("custom");
		if (edited?.type !== "custom") {
			throw new Error("Expected a custom avatar definition.");
		}
		expect(edited.choices.shape).toBe("leaf");

		modeButtons = container.querySelectorAll(
			".blobz-builder__mode-switch button"
		);
		click(modeButtons.item(0));
		modeButtons = container.querySelectorAll(
			".blobz-builder__mode-switch button"
		);
		click(modeButtons.item(1));

		const restored = changes.at(-1);
		if (restored?.type !== "custom") {
			throw new Error("Expected the custom avatar draft to be restored.");
		}
		expect(restored.choices.shape).toBe("leaf");
	});
});

test("standalone palette picker renders presets and circular custom colours", () => {
	const changes: [string, string][] = [];
	const container = document.createElement("div");
	document.body.append(container);
	const root = createRoot(container);
	mountedRoots.push(root);

	const renderPicker = (palette: [string, string]) => {
		act(() => {
			root.render(
				<AvatarPalettePicker
					idPrefix="test-palette"
					onPaletteChange={(nextPalette) => changes.push([...nextPalette])}
					palette={palette}
				/>
			);
		});
	};
	renderPicker(["#eef9ff", "#38bdf8"]);
	click(container.querySelector("button[aria-label='Use Coral palette']"));
	expect(changes.at(-1)).toEqual(["#fff1f2", "#fb7185"]);
	renderPicker(["#fff1f2", "#fb7185"]);

	const background = container.querySelector("#test-palette-background");
	const body = container.querySelector("#test-palette-body");
	expect(background).toBeInstanceOf(HTMLInputElement);
	expect(body).toBeInstanceOf(HTMLInputElement);
	if (!(background instanceof HTMLInputElement)) {
		throw new Error("Expected custom background colour input.");
	}
	if (!(body instanceof HTMLInputElement)) {
		throw new Error("Expected custom body colour input.");
	}
	expect(background.value).toBe("#fff1f2");
	expect(body.value).toBe("#fb7185");
});
