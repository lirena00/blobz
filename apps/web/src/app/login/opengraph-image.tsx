import { createBlobzOgImage, OG_SIZE } from "@/components/og/blobz-og-image";

export const alt = "Blobz hosted API account preview";
export const contentType = "image/png";
export const size = OG_SIZE;

export default async function OpenGraphImage() {
	return await createBlobzOgImage({
		description:
			"Sign in to manage your hosted avatar API, approved origins, usage, and billing.",
		seed: "blobz-login",
		title: "Your Blobz account.",
	});
}
