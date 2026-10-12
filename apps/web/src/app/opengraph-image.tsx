import { createBlobzOgImage, OG_SIZE } from "@/components/og/blobz-og-image";

export const alt = "Blobz: playful deterministic avatars";
export const contentType = "image/png";
export const size = OG_SIZE;

export default async function OpenGraphImage() {
	return await createBlobzOgImage({
		description:
			"Generate the same playful SVG avatar from any username, email, or ID.",
		seed: "blobz-open-graph",
		title: "A face worth keeping.",
	});
}
