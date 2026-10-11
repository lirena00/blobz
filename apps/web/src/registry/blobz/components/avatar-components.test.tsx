import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { AvatarSelect } from "@/registry/blobz/blocks/avatar-select";
import { AvatarTeamList } from "@/registry/blobz/blocks/avatar-team-list";
import { BlobAvatar } from "@/registry/blobz/components/avatar";
import { AvatarBadge } from "@/registry/blobz/components/avatar-badge";
import {
	AvatarChip,
	AvatarChipAvatar,
	AvatarChipLabel,
	AvatarChipRemove,
} from "@/registry/blobz/components/avatar-chip";
import {
	BlobAvatarGroup,
	BlobAvatarGroupCount,
	BlobAvatarGroupItem,
} from "@/registry/blobz/components/avatar-group";
import {
	AvatarProfile,
	AvatarProfileAvatar,
	AvatarProfileContent,
	AvatarProfileDescription,
	AvatarProfileName,
} from "@/registry/blobz/components/avatar-profile";
import { AvatarSocialProof } from "@/registry/blobz/components/avatar-social-proof";
import { BlobAvatarStatus } from "@/registry/blobz/components/avatar-status";

describe("avatar registry components", () => {
	test("renders the avatar package inside the requested variants", () => {
		const markup = renderToStaticMarkup(
			<BlobAvatar
				alt="Ada Lovelace avatar"
				frame="rounded"
				name="Ada Lovelace"
				size="lg"
				variant="outline"
			/>
		);

		expect(markup).toContain('data-slot="blob-avatar"');
		expect(markup).toContain('data-frame="rounded"');
		expect(markup).toContain('data-size="lg"');
		expect(markup).toContain('data-variant="outline"');
		expect(markup).toContain('alt="Ada Lovelace avatar"');
	});

	test("uses the larger rounded avatar as the default", () => {
		const markup = renderToStaticMarkup(
			<BlobAvatar alt="Grace Hopper avatar" name="Grace Hopper" />
		);

		expect(markup).toContain('data-frame="rounded"');
		expect(markup).toContain('data-size="default"');
		expect(markup).toContain("size-10");
	});

	test("exposes an accessible presence label", () => {
		const markup = renderToStaticMarkup(
			<BlobAvatarStatus alt="" name="Grace Hopper" status="away" />
		);

		expect(markup).toContain('role="status"');
		expect(markup).toContain('aria-label="Away"');
		expect(markup).toContain("bg-[var(--blob-avatar-status-away)]");
	});

	test("composes groups, profiles, and removable chips", () => {
		const groupMarkup = renderToStaticMarkup(
			<BlobAvatarGroup aria-label="Project team">
				<BlobAvatarGroupItem frame="rounded">
					<BlobAvatar alt="" frame="rounded" name="Katherine Johnson" />
				</BlobAvatarGroupItem>
				<BlobAvatarGroupCount count={3} frame="rounded" />
			</BlobAvatarGroup>
		);
		const profileMarkup = renderToStaticMarkup(
			<AvatarProfile variant="outline">
				<AvatarProfileAvatar alt="" name="Dorothy Vaughan" />
				<AvatarProfileContent>
					<AvatarProfileName>Dorothy Vaughan</AvatarProfileName>
					<AvatarProfileDescription>Mathematician</AvatarProfileDescription>
				</AvatarProfileContent>
			</AvatarProfile>
		);
		const chipMarkup = renderToStaticMarkup(
			<AvatarChip>
				<AvatarChipAvatar alt="" name="Mary Jackson" />
				<AvatarChipLabel>Mary Jackson</AvatarChipLabel>
				<AvatarChipRemove aria-label="Remove Mary Jackson" />
			</AvatarChip>
		);

		expect(groupMarkup).toContain("Project team");
		expect(groupMarkup).toContain("3 more people");
		expect(groupMarkup).toContain('data-frame="rounded"');
		expect(profileMarkup).toContain("Dorothy Vaughan");
		expect(profileMarkup).toContain("Mathematician");
		expect(chipMarkup).toContain('aria-label="Remove Mary Jackson"');
	});

	test("renders a team roster with identity, role, and status", () => {
		const markup = renderToStaticMarkup(
			<AvatarTeamList
				aria-label="Engineering team"
				members={[
					{
						avatar: { name: "Margaret Hamilton" },
						description: "margaret@example.com",
						id: "margaret",
						name: "Margaret Hamilton",
						role: "Lead",
						status: "online",
					},
				]}
			/>
		);

		expect(markup).toContain('aria-label="Engineering team"');
		expect(markup).toContain("Margaret Hamilton");
		expect(markup).toContain("margaret@example.com");
		expect(markup).toContain("Lead");
		expect(markup).toContain('aria-label="Online"');
	});

	test("renders identity badges and social proof", () => {
		const badgeMarkup = renderToStaticMarkup(
			<AvatarBadge
				avatar={{ name: "Alex Johnson" }}
				badge="Pro"
				description="Founder & CEO"
				name="Alex Johnson"
			/>
		);
		const socialProofMarkup = renderToStaticMarkup(
			<AvatarSocialProof
				avatars={[
					{ id: "ada", name: "Ada Lovelace" },
					{ id: "grace", name: "Grace Hopper" },
				]}
			>
				Joined by <strong>500+</strong> developers.
			</AvatarSocialProof>
		);

		expect(badgeMarkup).toContain("Alex Johnson");
		expect(badgeMarkup).toContain("Founder &amp; CEO");
		expect(badgeMarkup).toContain("Pro");
		expect(socialProofMarkup).toContain("Community members");
		expect(socialProofMarkup).toContain("500+");
	});

	test("renders an avatar select with a labelled initial value", () => {
		const markup = renderToStaticMarkup(
			<AvatarSelect
				defaultValue="paul"
				items={[
					{
						avatar: { name: "Paul Smith" },
						description: "Product designer",
						id: "paul",
						name: "Paul Smith",
					},
				]}
			/>
		);

		expect(markup).toContain('aria-label="Select a person"');
		expect(markup).toContain("data-[size=default]:h-16");
		expect(markup).toContain('data-size="default"');
		expect(markup).toContain("size-10");
		expect(markup).toContain("Paul Smith");
		expect(markup).toContain("Product designer");
	});
});
