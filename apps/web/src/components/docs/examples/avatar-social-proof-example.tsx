import { AvatarSocialProof } from "@/registry/blobz/components/avatar-social-proof";

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;
const DEVELOPERS = [
	{ id: "ada", name: "Ada Lovelace", palette: BLUE_PALETTE },
	{ id: "grace", name: "Grace Hopper", palette: BLUE_PALETTE },
	{ id: "katherine", name: "Katherine Johnson", palette: BLUE_PALETTE },
	{ id: "dorothy", name: "Dorothy Vaughan", palette: BLUE_PALETTE },
] as const;

export function AvatarSocialProofExample() {
	return (
		<div className="flex flex-col items-center gap-4">
			<AvatarSocialProof avatars={DEVELOPERS}>
				Joined by <strong className="text-foreground">500+</strong> developers.
			</AvatarSocialProof>
			<AvatarSocialProof avatars={DEVELOPERS.slice(0, 3)} variant="default">
				Trusted by <strong className="text-foreground">100K+</strong> users.
			</AvatarSocialProof>
		</div>
	);
}
