import {
	AvatarChip,
	AvatarChipAvatar,
	AvatarChipLabel,
	AvatarChipRemove,
} from "@/registry/blobz/components/avatar-chip";

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;

export function AvatarChipExample() {
	return (
		<div className="flex flex-wrap items-center gap-3">
			<AvatarChip>
				<AvatarChipAvatar alt="" name="Ada Lovelace" palette={BLUE_PALETTE} />
				<AvatarChipLabel>Ada Lovelace</AvatarChipLabel>
			</AvatarChip>
			<AvatarChip variant="outline">
				<AvatarChipAvatar alt="" name="Grace Hopper" palette={BLUE_PALETTE} />
				<AvatarChipLabel>Grace Hopper</AvatarChipLabel>
				<AvatarChipRemove aria-label="Remove Grace Hopper" />
			</AvatarChip>
		</div>
	);
}
