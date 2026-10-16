import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cn } from "@blobz/ui/lib/utils";
import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc";
import { Code2Icon } from "lucide-react";
import { cache, type ReactNode } from "react";

const EXAMPLE_FILENAMES = {
	avatar: "avatar-example.tsx",
	"avatar-account-menu": "avatar-account-menu-example.tsx",
	"avatar-badge": "avatar-badge-example.tsx",
	"avatar-chip": "avatar-chip-example.tsx",
	"avatar-circle": "avatar-circle-example.tsx",
	"avatar-group": "avatar-group-example.tsx",
	"avatar-image": "avatar-image-example.tsx",
	"avatar-profile": "avatar-profile-example.tsx",
	"avatar-select": "avatar-select-example.tsx",
	"avatar-sizes": "avatar-sizes-example.tsx",
	"avatar-social-proof": "avatar-social-proof-example.tsx",
	"avatar-square": "avatar-square-example.tsx",
	"avatar-status": "avatar-status-example.tsx",
	"avatar-status-positions": "avatar-status-positions-example.tsx",
	"avatar-surfaces": "avatar-surfaces-example.tsx",
	"avatar-team-list": "avatar-team-list-example.tsx",
	"avatar-unread": "avatar-unread-example.tsx",
	"group-chat": "group-chat-example.tsx",
	"user-table": "user-table-example.tsx",
} as const;

export type ComponentPreviewName = keyof typeof EXAMPLE_FILENAMES;

interface ComponentPreviewProps {
	readonly children: ReactNode;
	readonly className?: string;
	readonly name: ComponentPreviewName;
}

const readExampleSource = cache(async (filename: string): Promise<string> => {
	const source = await readFile(
		join(process.cwd(), "src/components/docs/examples", filename),
		"utf8"
	);
	return source
		.replaceAll("@/registry/blobz/components/", "@/components/blobz/")
		.replaceAll("@/registry/blobz/blocks/", "@/components/blobz/")
		.replaceAll("@blobz/ui/components/", "@/components/ui/")
		.trim();
});

export async function ComponentPreview({
	children,
	className,
	name,
}: ComponentPreviewProps) {
	const filename = EXAMPLE_FILENAMES[name];
	const code = await readExampleSource(filename);
	const highlightedCode = await ServerCodeBlock({
		code,
		codeblock: {
			allowCopy: true,
			className: "m-0 rounded-none border-0",
			title: filename,
			viewportProps: { className: "max-h-[32rem]" },
		},
		lang: "tsx",
		themes: { dark: "github-dark", light: "github-light" },
	});
	return (
		<section
			className={cn(
				"not-prose my-6 min-w-0 rounded-xl border border-border bg-background",
				className
			)}
			data-slot="component-preview"
		>
			<div className="flex min-h-64 min-w-0 items-center justify-center px-5 py-10 sm:px-8 sm:py-12">
				<div className="flex w-full min-w-0 items-center justify-center">
					{children}
				</div>
			</div>
			<details className="group min-w-0 border-border border-t">
				<summary className="flex cursor-pointer list-none items-center justify-end gap-2 rounded-b-xl px-4 py-3 font-medium text-muted-foreground text-xs outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none [&::-webkit-details-marker]:hidden">
					<Code2Icon aria-hidden="true" className="size-3.5" />
					<span className="group-open:hidden">View code</span>
					<span className="hidden group-open:inline">Hide code</span>
				</summary>
				<div className="min-w-0 overflow-hidden rounded-b-xl border-border border-t">
					{highlightedCode}
				</div>
			</details>
		</section>
	);
}
