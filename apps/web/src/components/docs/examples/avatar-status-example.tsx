import { BlobAvatarStatus } from "@/registry/blobz/components/avatar-status";

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;

export function AvatarStatusExample() {
	return (
		<div className="flex items-center gap-6">
			<BlobAvatarStatus
				alt="Ada Lovelace avatar"
				name="Ada Lovelace"
				palette={BLUE_PALETTE}
				size="xl"
				status="online"
			/>
			<BlobAvatarStatus
				alt="Grace Hopper avatar"
				name="Grace Hopper"
				palette={BLUE_PALETTE}
				size="xl"
				status="away"
			/>
			<BlobAvatarStatus
				alt="Katherine Johnson avatar"
				name="Katherine Johnson"
				palette={BLUE_PALETTE}
				size="xl"
				status="busy"
			/>
			<BlobAvatarStatus
				alt="Dorothy Vaughan avatar"
				name="Dorothy Vaughan"
				palette={BLUE_PALETTE}
				size="xl"
				status="offline"
			/>
		</div>
	);
}
