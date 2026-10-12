import { DEMO_PEOPLE, getFirstName } from "@/lib/demo-people";
import { AvatarSocialProof } from "@/registry/blobz/components/avatar-social-proof";

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;
const DEVELOPERS = [
	{
		id: "janaki",
		name: getFirstName(DEMO_PEOPLE.janakiAmmal),
		palette: BLUE_PALETTE,
	},
	{
		id: "vikram",
		name: getFirstName(DEMO_PEOPLE.vikramSarabhai),
		palette: ["#fff0e2", "#fa9769"],
	},
	{
		id: "kalpana",
		name: getFirstName(DEMO_PEOPLE.kalpanaChawla),
		palette: ["#e7fbe8", "#9ce786"],
	},
	{
		id: "srinivasa",
		name: getFirstName(DEMO_PEOPLE.srinivasaRamanujan),
		palette: ["#f4e7ff", "#c994ec"],
	},
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
