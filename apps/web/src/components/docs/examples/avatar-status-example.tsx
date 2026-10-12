import { DEMO_PEOPLE, getFirstName } from "@/lib/demo-people";
import { BlobAvatarStatus } from "@/registry/blobz/components/avatar-status";

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;

export function AvatarStatusExample() {
	return (
		<div className="flex items-center gap-6">
			<BlobAvatarStatus
				alt={`${DEMO_PEOPLE.janakiAmmal} avatar`}
				name={getFirstName(DEMO_PEOPLE.janakiAmmal)}
				palette={BLUE_PALETTE}
				size="xl"
				status="online"
			/>
			<BlobAvatarStatus
				alt={`${DEMO_PEOPLE.vikramSarabhai} avatar`}
				name={getFirstName(DEMO_PEOPLE.vikramSarabhai)}
				palette={BLUE_PALETTE}
				size="xl"
				status="away"
			/>
			<BlobAvatarStatus
				alt={`${DEMO_PEOPLE.kalpanaChawla} avatar`}
				name={getFirstName(DEMO_PEOPLE.kalpanaChawla)}
				palette={BLUE_PALETTE}
				size="xl"
				status="busy"
			/>
			<BlobAvatarStatus
				alt={`${DEMO_PEOPLE.srinivasaRamanujan} avatar`}
				name={getFirstName(DEMO_PEOPLE.srinivasaRamanujan)}
				palette={BLUE_PALETTE}
				size="xl"
				status="offline"
			/>
		</div>
	);
}
