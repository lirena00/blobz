import { createBlobzOgImage, OG_SIZE } from "@/components/og/blobz-og-image";

export const alt = "Blobz — playful deterministic avatars";
export const contentType = "image/png";
export const size = OG_SIZE;

export default function OpenGraphImage() {
	return createBlobzOgImage({
		description:
			"Generate the same playful SVG avatar from any username, email, or ID.",
		eyebrow: "Deterministic avatars",
		seed: "blobz-open-graph",
		title: "A face worth keeping.",
	});
}
