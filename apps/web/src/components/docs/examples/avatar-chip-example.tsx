import { DEMO_PEOPLE, getFirstName } from "@/lib/demo-people";
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
				<AvatarChipAvatar
					alt=""
					name={getFirstName(DEMO_PEOPLE.janakiAmmal)}
					palette={["#fff0e2", "#fa9769"]}
				/>
				<AvatarChipLabel>{DEMO_PEOPLE.janakiAmmal}</AvatarChipLabel>
			</AvatarChip>
			<AvatarChip variant="outline">
				<AvatarChipAvatar
					alt=""
					name={getFirstName(DEMO_PEOPLE.vikramSarabhai)}
					palette={BLUE_PALETTE}
				/>
				<AvatarChipLabel>{DEMO_PEOPLE.vikramSarabhai}</AvatarChipLabel>
				<AvatarChipRemove aria-label={`Remove ${DEMO_PEOPLE.vikramSarabhai}`} />
			</AvatarChip>
		</div>
	);
}
