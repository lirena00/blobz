import { BlobAvatar } from "@/registry/blobz/components/avatar";

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;

export function AvatarExample() {
	return (
		<div className="flex items-end gap-5">
			<BlobAvatar
				alt="Ada Lovelace avatar"
				name="Ada Lovelace"
				palette={BLUE_PALETTE}
				size="lg"
			/>
			<BlobAvatar
				alt="Grace Hopper avatar"
				name="Grace Hopper"
				palette={BLUE_PALETTE}
				size="xl"
				variant="outline"
			/>
			<BlobAvatar
				alt="Katherine Johnson avatar"
				name="Katherine Johnson"
				palette={BLUE_PALETTE}
				size="lg"
				variant="elevated"
			/>
		</div>
	);
}
