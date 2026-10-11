import { BlobAvatar } from "@/registry/blobz/components/avatar";

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;

export function AvatarSquareExample() {
	return (
		<div className="flex items-center gap-5">
			<BlobAvatar
				alt="Katherine Johnson avatar"
				frame="square"
				name="Katherine Johnson"
				palette={BLUE_PALETTE}
				size="xl"
			/>
			<BlobAvatar
				alt="Dorothy Vaughan avatar"
				frame="square"
				name="Dorothy Vaughan"
				palette={BLUE_PALETTE}
				size="xl"
				variant="outline"
			/>
		</div>
	);
}
