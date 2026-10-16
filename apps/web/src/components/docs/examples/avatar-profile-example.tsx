import { Button } from "@blobz/ui/components/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	AvatarProfile,
	AvatarProfileAction,
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
			<Avatar size="xl">
				<AvatarFallback alt="" name={"Janaki"} palette={BLUE_PALETTE} />
			</Avatar>
			<AvatarProfileContent>
				<AvatarProfileName>{"Janaki Ammal"}</AvatarProfileName>
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
