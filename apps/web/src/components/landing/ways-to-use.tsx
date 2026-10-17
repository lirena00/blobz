import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@blobz/ui/components/tabs";
import { ArrowUpRight, Code2, Component, Globe2 } from "lucide-react";
import Link from "next/link";

import { CopyCode } from "./copy-code";
import styles from "./ways-to-use.module.css";

const PACKAGE_MANAGERS = [
	{ install: "npm i", name: "npm", runner: "npx" },
	{ install: "pnpm add", name: "pnpm", runner: "pnpm dlx" },
	{ install: "yarn add", name: "yarn", runner: "yarn dlx" },
	{ install: "bun add", name: "bun", runner: "bunx --bun" },
] as const;

const REACT_EXAMPLE = `import { Avatar } from "@blobz/react";

<Avatar
  name={user.id}
  palette={["#eef9ff", "#38bdf8"]}
  size={48}
/>`;

const SHADCN_EXAMPLE = `import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

<Avatar>
  <AvatarFallback name={user.id} />
</Avatar>`;

const API_EXAMPLE = `<img
  src="https://blobz.lirena.in/api/v1/avatars/YOUR_ENDPOINT_ID?name=user_123"
  crossorigin="anonymous"
  width="48"
  height="48"
  alt="User avatar"
/>`;

function CodeSnippet({
	code,
	label,
}: {
	readonly code: string;
	readonly label: string;
}) {
	return (
		<div className={styles.snippet}>
			<div className={styles.snippetHeader}>
				<span>{label}</span>
				<CopyCode code={code} label={`Copy ${label}`} />
			</div>
			<pre className={styles.code}>
				<code>{code}</code>
			</pre>
		</div>
	);
}

function PackageInstall({ mode }: { readonly mode: "react" | "shadcn" }) {
	return (
		<Tabs className="min-w-0 gap-3" defaultValue="npm">
			<TabsList aria-label={`${mode} package manager`} variant="line">
				{PACKAGE_MANAGERS.map(({ name }) => (
					<TabsTrigger className="min-h-11 px-3" key={name} value={name}>
						{name}
					</TabsTrigger>
				))}
			</TabsList>
			{PACKAGE_MANAGERS.map(({ install, name, runner }) => (
				<TabsContent key={name} value={name}>
					<CodeSnippet
						code={
							mode === "react"
								? `${install} @blobz/react`
								: `${runner} shadcn@latest add @blobz/avatar`
						}
						label={`${mode} · ${name}`}
					/>
				</TabsContent>
			))}
		</Tabs>
	);
}

export function WaysToUse() {
	return (
		<section
			aria-labelledby="install-title"
			className={styles.section}
			id="install"
		>
			<div className={`site-container ${styles.inner}`}>
				<div className={styles.intro}>
					<p className={styles.eyebrow}>From preview to production</p>
					<h2 className={styles.title} id="install-title">
						Add Blobz to your app.
					</h2>
					<p className={styles.description}>
						A React component, source you own with shadcn, or an image URL for
						any stack. Pick what fits your project.
					</p>
					<p className={styles.freeNote}>
						React and shadcn are free and open source.
						<br />
						No account or API key needed.
					</p>
				</div>

				<Tabs className="min-w-0 gap-6" defaultValue="react">
					<TabsList
						aria-label="Integration method"
						className="w-full"
						variant="line"
					>
						<TabsTrigger className="min-h-11 px-3" value="react">
							<Code2
								aria-hidden="true"
								className="max-[380px]:hidden"
								data-icon="inline-start"
							/>
							React
						</TabsTrigger>
						<TabsTrigger className="min-h-11 px-3" value="shadcn">
							<Component
								aria-hidden="true"
								className="max-[380px]:hidden"
								data-icon="inline-start"
							/>
							shadcn
						</TabsTrigger>
						<TabsTrigger className="min-h-11 px-3" value="api">
							<Globe2
								aria-hidden="true"
								className="max-[380px]:hidden"
								data-icon="inline-start"
							/>
							Hosted API
						</TabsTrigger>
					</TabsList>

					<TabsContent className={styles.panel} value="react">
						<PackageInstall mode="react" />
						<CodeSnippet code={REACT_EXAMPLE} label="your-component.tsx" />
						<div className={styles.panelFooter}>
							<p>React 19+ · Renders locally · No global stylesheet</p>
							<Link className={styles.docsLink} href="/docs/react/installation">
								React docs <ArrowUpRight aria-hidden="true" />
							</Link>
						</div>
					</TabsContent>

					<TabsContent className={styles.panel} value="shadcn">
						<PackageInstall mode="shadcn" />
						<CodeSnippet code={SHADCN_EXAMPLE} label="your-component.tsx" />
						<div className={styles.panelFooter}>
							<p>
								Run in an existing shadcn project. Review the diff if replacing
								an Avatar.
							</p>
							<Link className={styles.docsLink} href="/docs/components">
								Components &amp; blocks <ArrowUpRight aria-hidden="true" />
							</Link>
						</div>
					</TabsContent>

					<TabsContent className={styles.panel} value="api">
						<div className={styles.apiIntro}>
							<p className={styles.apiLabel}>Paid hosted API · Any stack</p>
							<p>
								Activate a plan, approve your website origin, then copy your
								endpoint ID from the dashboard.
							</p>
						</div>
						<CodeSnippet code={API_EXAMPLE} label="your-page.html" />
						<div className={styles.panelFooter}>
							<p>Replace YOUR_ENDPOINT_ID with your active endpoint ID.</p>
							<Link className={styles.docsLink} href="/docs/api/quickstart">
								API quickstart <ArrowUpRight aria-hidden="true" />
							</Link>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</section>
	);
}
