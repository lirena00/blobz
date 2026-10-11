import { BlobAvatar } from "@/registry/blobz/components/avatar";
import {
	BlobAvatarGroup,
	BlobAvatarGroupCount,
	BlobAvatarGroupItem,
} from "@/registry/blobz/components/avatar-group";

const TEAM = [
	{ id: "ada", name: "Ada Lovelace" },
	{ id: "grace", name: "Grace Hopper" },
	{ id: "katherine", name: "Katherine Johnson" },
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
