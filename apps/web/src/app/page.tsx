import { Avatar } from "@blobz/react";
import {
	ArrowRight,
	Box,
	Braces,
	Fingerprint,
	MoveRight,
	Palette,
	Zap,
} from "lucide-react";
import Link from "next/link";

import { AvatarSwarmHero } from "@/components/landing/avatar-swarm-hero";
import { IdentitySurfaces } from "@/components/landing/identity-surfaces";

const EYEBROW_CLASS =
	"mb-4 text-[0.72rem] font-[850] uppercase tracking-[0.17em] text-sky-600";
const DISPLAY_FONT_CLASS = "font-[family-name:var(--font-bricolage)]";
const SECTION_HEADING_CLASS = `${DISPLAY_FONT_CLASS} text-[clamp(3rem,6vw,6rem)] font-[780] leading-[0.93] tracking-[-0.055em] max-[640px]:text-[3.2rem]`;
const SURFACE_COPY_CLASS = "leading-[1.75] text-[#60708a]";

const PRINCIPLES = [
	{
		copy: "Use a username, email, or internal ID. Blobz deterministically maps that stable seed to one avatar from more than a billion combinations.",
		icon: Fingerprint,
		index: "01",
		title: "One stable input becomes one identity.",
	},
	{
		copy: "Playful faces make a new profile feel intentional from its first session—not like an empty state waiting to be fixed.",
		icon: Palette,
		index: "02",
		title: "A default people might actually keep.",
	},
	{
		copy: "Render the same SVG again whenever you need it. There is no uploaded image, database blob, or asset URL to keep alive.",
		icon: Braces,
		index: "03",
		title: "Recreate it instead of storing it.",
	},
] as const;

const FOOTER_BLOBZ = [
	["nova", ["#eef9ff", "#38bdf8"]],
	["mika", ["#fff7ed", "#fb923c"]],
	["sol", ["#f0fdf4", "#4ade80"]],
	["lumi", ["#faf5ff", "#c084fc"]],
	["rio", ["#fff1f2", "#fb7185"]],
] as const;

function ProfileCodeExample() {
	return (
		<pre className="overflow-x-auto bg-[linear-gradient(180deg,rgb(3_105_161_/_4%),transparent)] p-8 font-mono text-[#bee6fb] text-[clamp(0.7rem,1.2vw,0.82rem)] leading-[1.9] max-[640px]:p-5">
			<code>
				<span className="text-[#c084fc]">import</span>
				{" { "}
				<span className="text-[#67e8f9]">Avatar</span>
				{" } "}
				<span className="text-[#c084fc]">from</span>{" "}
				<span className="text-[#fbbf24]">&quot;@blobz/react&quot;</span>
				{";"}
				{"\n\n"}
				<span className="text-[#c084fc]">export function</span>{" "}
				<span className="text-[#34d399]">Profile</span>
				{"({ user }) {\n  "}
				<span className="text-[#c084fc]">return</span>
				{" (\n    <"}
				<span className="text-[#67e8f9]">Avatar</span>
				{"\n      "}
				<span className="text-[#7dd3fc]">name</span>={"{"}user.id{"}"}
				{"\n      "}
				<span className="text-[#7dd3fc]">palette</span>={"{"}
				<span className="text-[#fbbf24]">{`["#e8f7ff", "#38bdf8"]`}</span>
				{"}"}
				{"\n      "}
				<span className="text-[#7dd3fc]">frame</span>=
				<span className="text-[#fbbf24]">&quot;rounded&quot;</span>
				{"\n      "}
				<span className="text-[#7dd3fc]">size</span>={"{"}
				<span className="text-[#fb7185]">64</span>
				{"}"}
				{"\n    />\n  );\n}"}
			</code>
		</pre>
	);
}

export default function Home() {
	return (
		<main className="overflow-clip bg-[#f9fdff] text-[#0b1830] [--ease-in-out:cubic-bezier(0.77,0,0.175,1)] [--ease-out:cubic-bezier(0.23,1,0.32,1)] [--ink:#0b1830] [--line:#d8eef9] [--muted:#60708a] [--sky-soft:#e8f7ff] [--sky:#38bdf8]">
			<AvatarSwarmHero />

			<section
				aria-label="Blobz at a glance"
				className="relative z-8 mx-auto -mt-18 grid min-h-32 max-w-[78rem] grid-cols-[1fr_auto_1fr_auto_1fr] items-center rounded-[2rem] border border-[#d7eefb] bg-white/88 px-6 py-[1.15rem] shadow-[0_30px_90px_rgb(14_165_233_/_13%)] backdrop-blur-[20px] max-[820px]:mx-4 max-[640px]:-mt-11 max-[640px]:grid-cols-1 max-[640px]:gap-4 max-[640px]:rounded-[1.4rem] max-[640px]:p-6"
			>
				<div className="flex items-baseline justify-center gap-[0.65rem] text-center max-[640px]:justify-between max-[640px]:text-left">
					<strong className="font-[950] text-[clamp(1.35rem,2.6vw,2.15rem)] tracking-[-0.06em]">
						1.13B+
					</strong>
					<span className="max-w-32 font-[650] text-[#60708a] text-[0.72rem] leading-[1.4] max-[640px]:text-right">
						possible combinations
					</span>
				</div>
				<div
					aria-hidden="true"
					className="h-[2.7rem] w-px bg-[#d9edf8] max-[640px]:h-px max-[640px]:w-full"
				/>
				<div className="flex items-baseline justify-center gap-[0.65rem] text-center max-[640px]:justify-between max-[640px]:text-left">
					<strong className="font-[950] text-[clamp(1.35rem,2.6vw,2.15rem)] tracking-[-0.06em]">
						1 seed
					</strong>
					<span className="max-w-32 font-[650] text-[#60708a] text-[0.72rem] leading-[1.4] max-[640px]:text-right">
						the same face, every time
					</span>
				</div>
				<div
					aria-hidden="true"
					className="h-[2.7rem] w-px bg-[#d9edf8] max-[640px]:h-px max-[640px]:w-full"
				/>
				<div className="flex items-baseline justify-center gap-[0.65rem] text-center max-[640px]:justify-between max-[640px]:text-left">
					<strong className="font-[950] text-[clamp(1.35rem,2.6vw,2.15rem)] tracking-[-0.06em]">
						0 files
					</strong>
					<span className="max-w-32 font-[650] text-[#60708a] text-[0.72rem] leading-[1.4] max-[640px]:text-right">
						to upload or store
					</span>
				</div>
			</section>

			<section
				className="mx-auto max-w-[82rem] scroll-mt-20 px-6 pt-32 pb-36 max-[640px]:px-4 max-[640px]:py-24"
				id="surfaces"
			>
				<div className="mb-13 grid grid-cols-[minmax(0,1fr)_minmax(18rem,0.42fr)] items-end gap-20 max-[640px]:mb-10 max-[820px]:grid-cols-1 max-[820px]:gap-6">
					<div>
						<p className={EYEBROW_CLASS}>Built for onboarding</p>
						<h2 className={SECTION_HEADING_CLASS}>
							Give every new user
							<br />a face worth keeping.
						</h2>
					</div>
					<p className={`max-w-[30rem] text-[1.02rem] ${SURFACE_COPY_CLASS}`}>
						Instead of assigning a generic silhouette or pulling from a tiny
						image pool, Blobz gives every seed its own playful avatar. Change
						the name below and watch that exact identity follow the user
						everywhere.
					</p>
				</div>
				<IdentitySurfaces />
			</section>

			<section
				className="mx-auto grid max-w-[82rem] scroll-mt-24 grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-[5.5rem] px-6 pt-[8.5rem] pb-[9.5rem] max-[820px]:grid-cols-1 max-[1050px]:gap-16 max-[820px]:gap-16 max-[640px]:px-4 max-[640px]:py-24"
				id="principles"
			>
				<div className="sticky top-[8.5rem] self-start max-[820px]:static">
					<p className={EYEBROW_CLASS}>Why deterministic matters</p>
					<h2
						className={`${DISPLAY_FONT_CLASS} max-w-xl font-[780] text-[clamp(3.25rem,5.5vw,5.5rem)] leading-[0.93] tracking-[-0.055em] max-[640px]:text-[3.2rem]`}
					>
						Their default should still be theirs.
					</h2>
					<p
						className={`mt-[1.6rem] max-w-[30rem] text-[1.05rem] ${SURFACE_COPY_CLASS}`}
					>
						Say 100 people join your app today. Each gets a Blobz generated from
						their stable ID. If someone uploads a photo and removes it later,
						their original Blobz comes back—not a newly assigned random one.
					</p>
					<div
						aria-hidden="true"
						className="mt-10 flex items-center gap-4 text-[#8aa1b7] [&_img]:rounded-[1.55rem] [&_img]:border [&_img]:border-[#d8eef9] [&_img]:bg-white [&_img]:p-[0.35rem] [&_img]:shadow-[0_14px_35px_rgb(14_165_233_/_12%)]"
					>
						<Avatar
							alt=""
							name="identity-before"
							palette={["#eef9ff", "#38bdf8"]}
							size={92}
						/>
						<MoveRight className="size-6" />
						<Avatar
							alt=""
							name="identity-after"
							palette={["#fff7ed", "#fb923c"]}
							size={92}
						/>
					</div>
				</div>

				<ol className="list-none">
					{PRINCIPLES.map(({ copy, icon: Icon, index, title }) => (
						<li
							className="grid grid-cols-[2.5rem_3.25rem_1fr] items-start gap-5 border-[#d8eef9] border-t py-[2.6rem] last:border-b max-[640px]:grid-cols-[2.8rem_1fr] max-[640px]:gap-4"
							key={index}
						>
							<div className="pt-[0.9rem] font-mono text-[#8ca2b7] text-[0.68rem] max-[640px]:hidden">
								{index}
							</div>
							<div className="grid size-13 place-items-center rounded-2xl bg-[#e7f7ff] text-sky-600">
								<Icon aria-hidden="true" className="size-5" />
							</div>
							<div>
								<h3
									className={`${DISPLAY_FONT_CLASS} font-[720] text-[clamp(1.4rem,2.6vw,2rem)] tracking-[-0.035em]`}
								>
									{title}
								</h3>
								<p
									className={`mt-[0.65rem] max-w-[35rem] ${SURFACE_COPY_CLASS}`}
								>
									{copy}
								</p>
							</div>
						</li>
					))}
				</ol>
			</section>

			<section
				className="relative scroll-mt-[4.5rem] overflow-hidden bg-[#071426] text-white"
				id="developers"
			>
				<div
					aria-hidden="true"
					className="absolute -top-[22rem] -left-48 size-[55rem] rounded-full bg-[radial-gradient(circle,rgb(14_165_233_/_24%),transparent_65%)]"
				/>
				<div className="relative mx-auto grid max-w-[82rem] grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] items-center gap-24 px-6 py-36 max-[820px]:grid-cols-1 max-[1050px]:gap-16 max-[640px]:px-4 max-[640px]:py-24 max-[820px]:py-28">
					<div>
						<div className="inline-flex items-center gap-[0.45rem] rounded-full border border-white/10 bg-white/[0.06] px-[0.85rem] py-[0.55rem] font-extrabold text-[#9cddff] text-[0.7rem] uppercase tracking-[0.15em] backdrop-blur-xl">
							<Box aria-hidden="true" className="size-4" />
							Available now · @blobz/react
						</div>
						<h2
							className={`${DISPLAY_FONT_CLASS} mt-6 font-[780] text-[clamp(3rem,5.5vw,5.5rem)] leading-[0.93] tracking-[-0.055em] max-[640px]:text-[3.2rem]`}
						>
							Like Lucide,
							<br />
							but for avatars.
						</h2>
						<p className="mt-[1.6rem] max-w-[34rem] text-[#9fb4ca] text-[1.05rem] leading-[1.75]">
							Install the React package, pass any stable string, and render a
							typed, SSR-ready SVG. The framework-free core keeps the result
							identical from server to browser.
						</p>
						<div className="mt-8 flex flex-wrap gap-[0.65rem] max-[640px]:gap-[0.45rem] [&>span]:inline-flex [&>span]:items-center [&>span]:gap-[0.45rem] [&>span]:rounded-[0.7rem] [&>span]:border [&>span]:border-white/[0.09] [&>span]:bg-white/[0.05] [&>span]:px-3 [&>span]:py-[0.55rem] [&>span]:font-[750] [&>span]:text-[#b7d3e5] [&>span]:text-[0.7rem]">
							<span>
								<Zap className="size-4" /> No image request
							</span>
							<span>
								<Braces className="size-4" /> TypeScript
							</span>
							<span>
								<Fingerprint className="size-4" /> Deterministic
							</span>
						</div>
						<div className="mt-5 grid max-w-[34rem] grid-cols-2 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] max-[480px]:grid-cols-1 [&>div+div]:border-white/10 [&>div+div]:border-l max-[480px]:[&>div+div]:border-t max-[480px]:[&>div+div]:border-l-0 [&>div]:px-4 [&>div]:py-3.5">
							<div>
								<span className="block font-bold text-[#6f8ca4] text-[0.62rem] uppercase tracking-[0.13em]">
									Use today
								</span>
								<strong className="mt-1 block text-[#d9effb] text-sm">
									React package
								</strong>
							</div>
							<div>
								<span className="block font-bold text-[#6f8ca4] text-[0.62rem] uppercase tracking-[0.13em]">
									On the roadmap
								</span>
								<strong className="mt-1 block text-[#d9effb] text-sm">
									API + shadcn CLI
								</strong>
							</div>
						</div>
					</div>

					<div className="overflow-hidden rounded-[1.6rem] border border-sky-200/12 bg-[#0b1b30] shadow-[0_35px_100px_rgb(0_0_0_/_32%)]">
						<div className="flex h-[3.4rem] items-center justify-between border-white/8 border-b bg-white/[0.03] px-[1.15rem]">
							<div aria-hidden="true" className="flex gap-[0.42rem]">
								<span className="size-[0.55rem] rounded-full bg-[#fb7185]" />
								<span className="size-[0.55rem] rounded-full bg-[#fbbf24]" />
								<span className="size-[0.55rem] rounded-full bg-[#34d399]" />
							</div>
							<code className="text-[#658099] text-[0.7rem]">profile.tsx</code>
						</div>
						<ProfileCodeExample />
						<div className="flex items-center gap-[0.85rem] border-white/8 border-t bg-[#f8fcff] px-5 py-[1.1rem] max-[640px]:p-[0.9rem] [&_img]:rounded-2xl [&_img]:border [&_img]:border-[#d5edf9] [&_img]:bg-white [&_img]:p-1">
							<Avatar
								alt="Generated example Blobz for lirena00"
								name="lirena00"
								palette={["#e8f7ff", "#38bdf8"]}
								size={76}
							/>
							<strong className="font-[850] text-[#0b1830] text-[0.85rem] tracking-[-0.02em]">
								lirena00
							</strong>
						</div>
					</div>
				</div>
			</section>

			<section className="relative min-h-[50rem] overflow-hidden bg-[radial-gradient(circle_at_50%_30%,white_0_14rem,transparent_34rem),linear-gradient(180deg,#f7fcff,#e8f7ff)] px-8 pt-44 pb-32 text-center max-[640px]:min-h-[44rem] max-[640px]:px-4 max-[640px]:pt-32 max-[640px]:pb-24">
				<div
					aria-hidden="true"
					className="mb-12 flex h-[8.5rem] items-end justify-center"
				>
					{FOOTER_BLOBZ.map(([name, palette]) => (
						<div
							className="relative -mx-[0.45rem] size-[6.75rem] rotate-[-7deg] even:-translate-y-4 even:rotate-6 hover:z-3 max-[640px]:-mx-[0.55rem] max-[640px]:size-[5.1rem] [&:nth-child(3)]:-translate-y-[1.7rem] [&:nth-child(3)]:rotate-[-1deg] [&:nth-child(3)]:scale-[1.08]"
							key={name}
						>
							<div className="size-full rounded-[1.45rem] border border-[#d8eef9] bg-white p-[0.3rem] shadow-[0_20px_45px_rgb(14_165_233_/_16%)] transition-[transform,box-shadow] duration-240 ease-[cubic-bezier(0.77,0,0.175,1)] hover:-translate-y-2 hover:scale-[1.055] hover:shadow-[0_26px_56px_rgb(14_165_233_/_23%)] motion-reduce:transform-none motion-reduce:transition-none [&_img]:block">
								<Avatar alt="" name={name} palette={palette} size="100%" />
							</div>
						</div>
					))}
				</div>
				<p className={EYEBROW_CLASS}>A better default avatar</p>
				<h2
					className={`${DISPLAY_FONT_CLASS} font-[780] text-[clamp(3.5rem,7.5vw,7.5rem)] leading-[0.93] tracking-[-0.055em] max-[640px]:text-[3.2rem]`}
				>
					The profile picture users
					<br />
					won&apos;t rush to replace.
				</h2>
				<p
					className={`mx-auto mt-[1.6rem] max-w-[38rem] text-[1.05rem] ${SURFACE_COPY_CLASS}`}
				>
					Playful enough to feel personal. Deterministic enough to return
					exactly the same whenever that user needs it.
				</p>
				<Link
					className="mt-8 inline-flex h-[3.15rem] items-center justify-center gap-[0.55rem] rounded-[0.95rem] bg-[#0b1830] px-5 font-extrabold text-[0.9rem] text-white shadow-[0_18px_40px_rgb(11_24_48_/_20%)] transition-[transform,box-shadow,background] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-[3px] hover:bg-sky-600 active:scale-[0.97] motion-reduce:transition-none"
					href="/create"
				>
					Create yours
					<ArrowRight aria-hidden="true" className="size-4" />
				</Link>
			</section>

			<footer className="mx-auto flex max-w-[82rem] items-center justify-between bg-white p-6 text-[#73839a] text-xs before:absolute before:right-0 before:left-0 before:-mt-[4.55rem] before:h-px before:bg-[#d8eef9] max-[640px]:flex-col max-[640px]:gap-3 max-[640px]:px-4 max-[640px]:text-center">
				<div className="flex items-center gap-[0.55rem]">
					<Avatar
						alt=""
						name="blobz-footer"
						palette={["#eef9ff", "#38bdf8"]}
						size={30}
					/>
					<strong
						className={`${DISPLAY_FONT_CLASS} font-[760] text-[#0b1830] text-[0.92rem]`}
					>
						blobz
					</strong>
					<span>Tiny faces. Serious utility.</span>
				</div>
				<span>Framework-free core and React components.</span>
			</footer>
		</main>
	);
}
