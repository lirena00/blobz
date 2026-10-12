import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cn } from "@blobz/ui/lib/utils";
import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc";
import { Code2Icon } from "lucide-react";
import type { ReactNode } from "react";

const EXAMPLE_SOURCES = {
	avatar: readFileSync(
		join(process.cwd(), "src/components/docs/examples/avatar-example.tsx"),
		"utf8"
	),
	"avatar-account-menu": readFileSync(
		join(
			process.cwd(),
			"src/components/docs/examples/avatar-account-menu-example.tsx"
		),
		"utf8"
	),
	"avatar-badge": readFileSync(
		join(
			process.cwd(),
			"src/components/docs/examples/avatar-badge-example.tsx"
		),
		"utf8"
	),
	"avatar-chip": readFileSync(
		join(process.cwd(), "src/components/docs/examples/avatar-chip-example.tsx"),
		"utf8"
	),
	"avatar-circle": readFileSync(
		join(
			process.cwd(),
			"src/components/docs/examples/avatar-circle-example.tsx"
		),
		"utf8"
	),
	"avatar-group": readFileSync(
		join(
			process.cwd(),
			"src/components/docs/examples/avatar-group-example.tsx"
		),
		"utf8"
	),
	"avatar-profile": readFileSync(
		join(
			process.cwd(),
			"src/components/docs/examples/avatar-profile-example.tsx"
		),
		"utf8"
	),
	"avatar-select": readFileSync(
		join(
			process.cwd(),
			"src/components/docs/examples/avatar-select-example.tsx"
		),
		"utf8"
	),
	"avatar-social-proof": readFileSync(
		join(
			process.cwd(),
			"src/components/docs/examples/avatar-social-proof-example.tsx"
		),
		"utf8"
	),
	"avatar-square": readFileSync(
		join(
			process.cwd(),
			"src/components/docs/examples/avatar-square-example.tsx"
		),
		"utf8"
	),
	"avatar-status": readFileSync(
		join(
			process.cwd(),
			"src/components/docs/examples/avatar-status-example.tsx"
		),
		"utf8"
	),
	"avatar-status-positions": readFileSync(
		join(
			process.cwd(),
			"src/components/docs/examples/avatar-status-positions-example.tsx"
		),
		"utf8"
	),
	"avatar-team-list": readFileSync(
		join(
			process.cwd(),
			"src/components/docs/examples/avatar-team-list-example.tsx"
		),
		"utf8"
	),
	"group-chat": readFileSync(
		join(process.cwd(), "src/components/docs/examples/group-chat-example.tsx"),
		"utf8"
	),
	"presence-avatar": readFileSync(
		join(
			process.cwd(),
			"src/components/docs/examples/presence-avatar-example.tsx"
		),
		"utf8"
	),
	"user-table": readFileSync(
		join(process.cwd(), "src/components/docs/examples/user-table-example.tsx"),
		"utf8"
	),
} as const;

const EXAMPLE_FILENAMES = {
	avatar: "avatar-example.tsx",
	"avatar-account-menu": "avatar-account-menu-example.tsx",
	"avatar-badge": "avatar-badge-example.tsx",
	"avatar-chip": "avatar-chip-example.tsx",
	"avatar-circle": "avatar-circle-example.tsx",
	"avatar-group": "avatar-group-example.tsx",
	"avatar-profile": "avatar-profile-example.tsx",
	"avatar-select": "avatar-select-example.tsx",
	"avatar-social-proof": "avatar-social-proof-example.tsx",
	"avatar-square": "avatar-square-example.tsx",
	"avatar-status": "avatar-status-example.tsx",
	"avatar-status-positions": "avatar-status-positions-example.tsx",
	"avatar-team-list": "avatar-team-list-example.tsx",
	"group-chat": "group-chat-example.tsx",
	"presence-avatar": "presence-avatar-example.tsx",
	"user-table": "user-table-example.tsx",
} as const;

export type ComponentPreviewName = keyof typeof EXAMPLE_SOURCES;

interface ComponentPreviewProps {
	readonly children: ReactNode;
	readonly className?: string;
	readonly name: ComponentPreviewName;
}

const prepareConsumerSource = (source: string): string =>
	source
		.replaceAll("@/registry/blobz/components/", "@/components/blobz/")
		.replaceAll("@/registry/blobz/blocks/", "@/components/blobz/")
		.replaceAll("@blobz/ui/components/", "@/components/ui/")
		.trim();

export async function ComponentPreview({
	children,
	className,
	name,
}: ComponentPreviewProps) {
	const code = prepareConsumerSource(EXAMPLE_SOURCES[name]);
	const highlightedCode = await ServerCodeBlock({
		code,
		codeblock: {
			allowCopy: true,
			className: "m-0 rounded-none border-0",
			title: EXAMPLE_FILENAMES[name],
			viewportProps: {
				className: "max-h-[32rem]",
			},
		},
		lang: "tsx",
		themes: {
			dark: "github-dark",
			light: "github-light",
		},
	});

	return (
		<section
			className={cn(
				"not-prose my-7 overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm",
				className
			)}
			data-slot="component-preview"
		>
			<div className="flex min-h-80 items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/30 px-5 py-12 sm:px-10">
				<div className="flex w-full items-center justify-center">
					{children}
				</div>
			</div>
			<details className="group border-border border-t bg-card">
				<summary className="relative -mt-5 flex cursor-pointer list-none justify-center pb-3 [&::-webkit-details-marker]:hidden">
					<span className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 font-medium text-foreground text-sm shadow-lg transition-transform duration-150 active:scale-[0.97] motion-reduce:transition-none">
						<Code2Icon aria-hidden="true" />
						<span className="group-open:hidden">View code</span>
						<span className="hidden group-open:inline">Hide code</span>
					</span>
				</summary>
				<div className="border-border border-t">{highlightedCode}</div>
			</details>
		</section>
	);
}
