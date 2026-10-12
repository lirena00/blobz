import { createBlobzOgImage, OG_SIZE } from "@/components/og/blobz-og-image";

export const alt = "Create your Blobz: avatar builder preview";
export const contentType = "image/png";
export const size = OG_SIZE;

export default async function OpenGraphImage() {
	return await createBlobzOgImage({
		description:
			"Generate a Blobz from any string, customize it, and export it as PNG or SVG.",
		seed: "blobz-create",
		title: "Make a Blobz of your own.",
	});
}
