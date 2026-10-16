import { ArrowUpRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEMO_PEOPLE } from "@/lib/demo-people";
import { ProfileCard } from "@/registry/blobz/components/profile-card";

const PROFILE_NAME = DEMO_PEOPLE.kalpanaChawla;

export function ProfileCardExample() {
	return (
		<ProfileCard
			actions={
				<Button
					nativeButton={false}
					render={
						<a
							href="https://www.nasa.gov/image-article/kalpana-chawla/"
							rel="noopener"
							target="_blank"
						/>
					}
					size="sm"
					variant="outline"
				>
					Biography
					<ArrowUpRightIcon aria-hidden="true" data-icon="inline-end" />
				</Button>
			}
			avatar={{ name: PROFILE_NAME, palette: ["#dff4ff", "#38bdf8"] }}
			badge={<Badge variant="secondary">NASA</Badge>}
			bio="Exploring the skies through aerospace research and two Space Shuttle missions."
			className="max-w-sm"
			description="Astronaut & aerospace engineer"
			metadata="STS-87 · STS-107"
			name={PROFILE_NAME}
		/>
	);
}
