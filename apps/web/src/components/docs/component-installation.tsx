import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";

const PACKAGE_MANAGERS = [
	{ label: "npm", runner: "npx" },
	{ label: "pnpm", runner: "pnpm dlx" },
	{ label: "yarn", runner: "yarn dlx" },
	{ label: "bun", runner: "bunx --bun" },
] as const;

export async function ComponentInstallation({
	name,
	dependencies = [],
}: {
	readonly name: string;
	readonly dependencies?: readonly string[];
}) {
	const commands = await Promise.all(
		PACKAGE_MANAGERS.map(async ({ label, runner }) => ({
			code: await ServerCodeBlock({
				code: `${runner} shadcn@latest add ${[`@blobz/${name}`, ...dependencies].join(" ")}`,
				codeblock: { allowCopy: true },
				lang: "bash",
				themes: { dark: "github-dark", light: "github-light" },
			}),
			label,
		}))
	);
	return (
		<Tabs
			groupId="component-package-manager"
			items={PACKAGE_MANAGERS.map(({ label }) => label)}
			persist
		>
			{commands.map(({ label, code }) => (
				<Tab key={label} value={label}>
					{code}
				</Tab>
			))}
		</Tabs>
	);
}
