import { BlobAvatar } from "@/registry/blobz/components/avatar";

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;

export function AvatarCircleExample() {
	return (
		<div className="flex items-center gap-5">
			<BlobAvatar
				alt="Ada Lovelace avatar"
				frame="circle"
				name="Ada Lovelace"
				palette={BLUE_PALETTE}
				size="xl"
			/>
			<BlobAvatar
				alt="Grace Hopper avatar"
				frame="circle"
				name="Grace Hopper"
				palette={BLUE_PALETTE}
				size="xl"
				variant="outline"
			/>
		</div>
	);
}
