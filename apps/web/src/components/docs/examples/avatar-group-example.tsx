import { DEMO_PEOPLE, getFirstName } from "@/lib/demo-people";
import { BlobAvatar } from "@/registry/blobz/components/avatar";
import {
	BlobAvatarGroup,
	BlobAvatarGroupCount,
	BlobAvatarGroupItem,
} from "@/registry/blobz/components/avatar-group";

const TEAM = [
	{ id: "janaki", name: getFirstName(DEMO_PEOPLE.janakiAmmal) },
	{ id: "vikram", name: getFirstName(DEMO_PEOPLE.vikramSarabhai) },
	{ id: "kalpana", name: getFirstName(DEMO_PEOPLE.kalpanaChawla) },
] as const;

const BLUE_PALETTE = ["#dff4ff", "#38bdf8"] as const;

export function AvatarGroupExample() {
	return (
		<BlobAvatarGroup aria-label="Project team">
			{TEAM.map((member) => (
				<BlobAvatarGroupItem key={member.id}>
					<BlobAvatar alt="" name={member.name} palette={BLUE_PALETTE} />
				</BlobAvatarGroupItem>
			))}
			<BlobAvatarGroupCount count={4} />
		</BlobAvatarGroup>
	);
}
