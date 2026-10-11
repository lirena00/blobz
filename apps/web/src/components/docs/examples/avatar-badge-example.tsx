import { AvatarBadge } from "@/registry/blobz/components/avatar-badge";

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;

export function AvatarBadgeExample() {
	return (
		<AvatarBadge
			avatar={{ name: "Alex Johnson", palette: BLUE_PALETTE, size: "lg" }}
			badge="Pro"
			description="Founder & CEO"
			name="Alex Johnson"
		/>
	);
}
