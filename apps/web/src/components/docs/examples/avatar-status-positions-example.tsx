import { BlobAvatarStatus } from "@/registry/blobz/components/avatar-status";

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;
const POSITIONS = [
	{ label: "Top start", position: "top-start" },
	{ label: "Top end", position: "top-end" },
	{ label: "Bottom start", position: "bottom-start" },
	{ label: "Bottom end", position: "bottom-end" },
] as const;

export function AvatarStatusPositionsExample() {
	return (
		<div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4">
			{POSITIONS.map(({ label, position }) => (
				<div className="flex flex-col items-center gap-3" key={position}>
					<BlobAvatarStatus
						alt={`${label} status position`}
						name={position}
						palette={BLUE_PALETTE}
						position={position}
						size="xl"
						status="online"
					/>
					<span className="text-muted-foreground text-xs">{label}</span>
				</div>
			))}
		</div>
	);
}
