import { DEMO_PEOPLE, getFirstName } from "@/lib/demo-people";
import { BlobAvatar } from "@/registry/blobz/components/avatar";

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;

export function AvatarCircleExample() {
	return (
		<div className="flex items-center gap-5">
			<BlobAvatar
				alt={`${DEMO_PEOPLE.janakiAmmal} avatar`}
				frame="circle"
				name={getFirstName(DEMO_PEOPLE.janakiAmmal)}
				palette={BLUE_PALETTE}
				size="xl"
			/>
			<BlobAvatar
				alt={`${DEMO_PEOPLE.vikramSarabhai} avatar`}
				frame="circle"
				name={getFirstName(DEMO_PEOPLE.vikramSarabhai)}
				palette={BLUE_PALETTE}
				size="xl"
				variant="outline"
			/>
		</div>
	);
}
