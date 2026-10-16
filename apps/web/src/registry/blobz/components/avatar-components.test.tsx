import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import {
	Avatar,
	AvatarBadge,
	AvatarCount,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
} from "@/components/ui/avatar";
import { AvatarSelect } from "@/registry/blobz/blocks/avatar-select";
import { AvatarTeamList } from "@/registry/blobz/blocks/avatar-team-list";

describe("avatar composition", () => {
	test("renders a generated fallback with the inherited frame and an accessible description", () => {
		const markup = renderToStaticMarkup(
			<Avatar frame="square" size="lg">
				<AvatarFallback alt="Janaki avatar" name="Janaki" />
			</Avatar>
		);
		expect(markup).toContain('data-frame="square"');
		expect(markup).toContain('data-blobz-source="generated"');
		expect(markup).toContain('alt="Janaki avatar"');
		expect(markup).toContain('data-slot="avatar-fallback"');
	});

	test("keeps custom fallback children and supports numeric seeds", () => {
		const text = renderToStaticMarkup(
			<Avatar>
				<AvatarFallback name="Lirena">LR</AvatarFallback>
			</Avatar>
		);
		expect(text).toContain(">LR</span>");
		expect(text).not.toContain("data-blobz-source");
		const generated = renderToStaticMarkup(
			<Avatar>
				<AvatarFallback name={0} />
			</Avatar>
		);
		expect(generated).toContain('data-blobz-source="generated"');
	});

	test("renders the generated face in server HTML while an image is unavailable", () => {
		const markup = renderToStaticMarkup(
			<Avatar>
				<AvatarImage alt="Lirena" src="https://example.com/avatar.jpg" />
				<AvatarFallback name="Lirena" />
			</Avatar>
		);
		expect(markup).toContain('data-slot="avatar-fallback"');
		expect(markup).toContain('data-blobz-source="generated"');
	});

	test("announces status and the full unread count while capping its visible value", () => {
		const markup = renderToStaticMarkup(
			<Avatar>
				<AvatarFallback alt="" name="Vikram" />
				<AvatarBadge status="away" />
				<AvatarCount count={128} />
			</Avatar>
		);
		expect(markup).toContain('aria-label="Away"');
		expect(markup).toContain('aria-label="128 unread messages"');
		expect(markup).toContain(">99+</span>");
		expect(renderToStaticMarkup(<AvatarCount count={0} />)).toBe("");
		expect(renderToStaticMarkup(<AvatarCount count={Number.NaN} />)).toBe("");
	});

	test("gives group counts a useful accessible name and hides invalid counts", () => {
		const markup = renderToStaticMarkup(
			<AvatarGroup aria-label="Project team">
				<Avatar>
					<AvatarFallback alt="" name="Kalpana" />
				</Avatar>
				<AvatarGroupCount count={4} />
			</AvatarGroup>
		);
		expect(markup).toContain('aria-label="Project team"');
		expect(markup).toContain('aria-label="4 more people"');
		expect(renderToStaticMarkup(<AvatarGroupCount count={-1} />)).toBe("");
	});

	test("renders team identities, roles, and status through the shared primitives", () => {
		const markup = renderToStaticMarkup(
			<AvatarTeamList
				aria-label="Engineering team"
				members={[
					{
						avatar: { name: "Ritu", src: "https://example.com/avatar.jpg" },
						description: "ritu@example.com",
						id: "ritu",
						name: "Ritu",
						role: "Lead",
						status: "online",
					},
				]}
			/>
		);
		expect(markup).toContain("ritu@example.com");
		expect(markup).toContain("Lead");
		expect(markup).toContain('aria-label="Online"');
		expect(markup).toContain('data-slot="avatar-profile"');
	});

	test("renders a labelled person selector with its initial identity", () => {
		const markup = renderToStaticMarkup(
			<AvatarSelect
				defaultValue="raj"
				items={[
					{
						avatar: { name: "Raj" },
						description: "Product designer",
						id: "raj",
						name: "Raj",
					},
				]}
			/>
		);
		expect(markup).toContain('aria-label="Select a person"');
		expect(markup).toContain("Product designer");
		expect(markup).toContain('data-slot="avatar-profile"');
	});
});
