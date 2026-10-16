import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	AvatarProfile,
	AvatarProfileContent,
	AvatarProfileDescription,
	AvatarProfileName,
} from "@/registry/blobz/components/avatar-profile";

export function AvatarBadgeExample() {
	return (
		<AvatarProfile
			className="w-full max-w-sm"
			density="spacious"
			variant="outline"
		>
			<Avatar>
				<AvatarFallback
					alt=""
					name="Gagandeep"
					palette={["#fff0e2", "#fa9769"]}
				/>
			</Avatar>
			<AvatarProfileContent>
				<div className="flex min-w-0 flex-wrap items-center gap-2">
					<AvatarProfileName>Gagandeep Kang</AvatarProfileName>
					<Badge variant="secondary">Member</Badge>
				</div>
				<AvatarProfileDescription>
					Research & public health
				</AvatarProfileDescription>
			</AvatarProfileContent>
		</AvatarProfile>
	);
}
