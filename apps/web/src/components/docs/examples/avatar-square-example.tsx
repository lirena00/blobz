import { DEMO_PEOPLE, getFirstName } from "@/lib/demo-people";
import { BlobAvatar } from "@/registry/blobz/components/avatar";

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;

export function AvatarSquareExample() {
	return (
		<div className="flex items-center gap-5">
			<BlobAvatar
				alt={`${DEMO_PEOPLE.kalpanaChawla} avatar`}
				frame="square"
				name={getFirstName(DEMO_PEOPLE.kalpanaChawla)}
				palette={BLUE_PALETTE}
				size="xl"
			/>
			<BlobAvatar
				alt={`${DEMO_PEOPLE.srinivasaRamanujan} avatar`}
				frame="square"
				name={getFirstName(DEMO_PEOPLE.srinivasaRamanujan)}
				palette={BLUE_PALETTE}
				size="xl"
				variant="outline"
			/>
		</div>
	);
}
