import "@/test/dom";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const requests: ControlledImage[] = [];

class ControlledImage {
	readonly complete = false;
	crossOrigin: string | null = null;
	onerror: (() => void) | null = null;
	onload: (() => void) | null = null;
	src = "";

	constructor() {
		requests.push(this);
	}
}

let root: Root;
let container: HTMLDivElement;
const originalImage = window.Image;

beforeEach(() => {
	requests.length = 0;
	Object.defineProperty(window, "Image", {
		configurable: true,
		value: ControlledImage,
	});
	container = document.createElement("div");
	document.body.append(container);
	root = createRoot(container);
});

afterEach(() => {
	act(() => root.unmount());
	container.remove();
	Object.defineProperty(window, "Image", {
		configurable: true,
		value: originalImage,
	});
});

const renderAvatar = async (src?: string): Promise<void> => {
	await act(() => {
		root.render(
			<Avatar frame="circle">
				<AvatarImage alt="Lirena" src={src} />
				<AvatarFallback name="Lirena" />
			</Avatar>
		);
	});
};

const finishImage = async (status: "load" | "error"): Promise<void> => {
	const request = requests.at(-1);
	if (!request) {
		throw new Error("Expected an avatar image request.");
	}
	await act(() => {
		if (status === "load") {
			request.onload?.();
		} else {
			request.onerror?.();
		}
	});
};

describe("avatar image loading", () => {
	test("shows the generated face without requesting a missing image", async () => {
		await renderAvatar();
		expect(requests).toHaveLength(0);
		expect(
			container.querySelector('[data-blobz-source="generated"]')
		).not.toBeNull();
	});

	test("replaces the loading fallback with the supplied image", async () => {
		await renderAvatar("https://example.com/avatar.jpg");
		expect(
			container.querySelector('[data-slot="avatar-fallback"]')
		).not.toBeNull();
		await finishImage("load");
		expect(
			container.querySelector('[data-slot="avatar-image"]')?.getAttribute("src")
		).toBe("https://example.com/avatar.jpg");
		expect(container.querySelector('[data-slot="avatar-fallback"]')).toBeNull();
	});

	test("keeps a stable generated face after failure and recovers when the URL changes", async () => {
		await renderAvatar("https://example.com/unavailable.jpg");
		const initialFallback = container
			.querySelector('[data-blobz-source="generated"]')
			?.getAttribute("src");
		await finishImage("error");
		expect(
			container
				.querySelector('[data-blobz-source="generated"]')
				?.getAttribute("src")
		).toBe(initialFallback);
		await renderAvatar("https://example.com/avatar.jpg");
		expect(requests).toHaveLength(2);
		await finishImage("load");
		expect(container.querySelector('[data-slot="avatar-fallback"]')).toBeNull();
	});

	test("restores the fallback when a loaded image is removed", async () => {
		await renderAvatar("https://example.com/avatar.jpg");
		await finishImage("load");
		await renderAvatar();
		expect(
			container.querySelector('[data-blobz-source="generated"]')
		).not.toBeNull();
	});
});
