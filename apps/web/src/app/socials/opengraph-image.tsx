import { createBlobzOgImage, OG_SIZE } from "@/components/og/blobz-og-image";

export const alt =
	"Blobz social image studio: create a matching set of launch images";
export const contentType = "image/png";
export const size = OG_SIZE;

export default async function OpenGraphImage() {
	return await createBlobzOgImage({
		description: "Matching launch images, sized for anywhere you share Blobz.",
		seed: "blobz-social-studio",
		title: "Make Blobz look good everywhere.",
	});
}
