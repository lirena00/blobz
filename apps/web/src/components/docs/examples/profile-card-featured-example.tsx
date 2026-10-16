import { Badge } from "@/components/ui/badge";
import { DEMO_PEOPLE } from "@/lib/demo-people";
import { ProfileCard } from "@/registry/blobz/components/profile-card";

export function ProfileCardFeaturedExample() {
	return (
		<ProfileCard
			avatar={{
				name: DEMO_PEOPLE.janakiAmmal,
				palette: ["#e7f4ea", "#8aca9a"],
			}}
			badge={<Badge variant="outline">Research</Badge>}
			bio="A botanist and cytogeneticist whose work opened new perspectives on the plants around us."
			className="max-w-sm"
			description="A life of curiosity"
			metadata="Botany · Cytogenetics"
			name={DEMO_PEOPLE.janakiAmmal}
			variant="featured"
		/>
	);
}
