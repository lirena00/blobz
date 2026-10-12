import { Button } from "@blobz/ui/components/button";
import { DEMO_PEOPLE, getFirstName } from "@/lib/demo-people";

import {
	AvatarProfile,
	AvatarProfileAction,
	AvatarProfileAvatar,
	AvatarProfileContent,
	AvatarProfileDescription,
	AvatarProfileName,
} from "@/registry/blobz/components/avatar-profile";

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;

export function AvatarProfileExample() {
	return (
		<AvatarProfile
			className="w-full max-w-md"
			density="spacious"
			variant="outline"
		>
			<AvatarProfileAvatar
				alt=""
				name={getFirstName(DEMO_PEOPLE.janakiAmmal)}
				palette={BLUE_PALETTE}
				size="xl"
			/>
			<AvatarProfileContent>
				<AvatarProfileName>{DEMO_PEOPLE.janakiAmmal}</AvatarProfileName>
				<AvatarProfileDescription>
					Botanist and cytogeneticist · India
				</AvatarProfileDescription>
			</AvatarProfileContent>
			<AvatarProfileAction>
				<Button size="sm" variant="outline">
					View
				</Button>
			</AvatarProfileAction>
		</AvatarProfile>
	);
}
