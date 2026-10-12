import { DEMO_PEOPLE, getFirstName } from "@/lib/demo-people";
import { BlobAvatar } from "@/registry/blobz/components/avatar";

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;

export function AvatarExample() {
	return (
		<div className="flex items-end gap-5">
			<BlobAvatar
				alt={`${DEMO_PEOPLE.janakiAmmal} avatar`}
				name={getFirstName(DEMO_PEOPLE.janakiAmmal)}
				palette={BLUE_PALETTE}
				size="lg"
			/>
			<BlobAvatar
				alt={`${DEMO_PEOPLE.vikramSarabhai} avatar`}
				name={getFirstName(DEMO_PEOPLE.vikramSarabhai)}
				palette={BLUE_PALETTE}
				size="xl"
				variant="outline"
			/>
			<BlobAvatar
				alt={`${DEMO_PEOPLE.kalpanaChawla} avatar`}
				name={getFirstName(DEMO_PEOPLE.kalpanaChawla)}
				palette={BLUE_PALETTE}
				size="lg"
				variant="elevated"
			/>
		</div>
	);
}
