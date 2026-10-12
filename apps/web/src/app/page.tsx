import { AVATAR_COMBINATION_COUNT } from "@blobz/avatar-core";
import { Avatar } from "@blobz/react";
import {
	ArrowRight,
	Braces,
	Fingerprint,
	MoveRight,
	Palette,
} from "lucide-react";
import Link from "next/link";

import { IdentitySurfaces } from "@/components/landing/identity-surfaces";
import { LandingNameProvider } from "@/components/landing/landing-name";
import { PersonalizedHero } from "@/components/landing/personalized-hero";
import { Pricing } from "@/components/landing/pricing";
import { WaysToUse } from "@/components/landing/ways-to-use";
import footerAvatarStyles from "./footer-avatars.module.css";

const EYEBROW_CLASS =
	"mb-4 text-[0.72rem] font-[850] uppercase tracking-[0.17em] text-sky-600";
const DISPLAY_FONT_CLASS = "font-[family-name:var(--font-bricolage)]";
const SECTION_HEADING_CLASS = `${DISPLAY_FONT_CLASS} text-[clamp(3rem,6vw,6rem)] font-[780] leading-[0.93] tracking-[-0.055em] max-[640px]:text-[3.2rem]`;
const SURFACE_COPY_CLASS = "leading-[1.75] text-[#60708a]";
const COMBINATION_LABEL = `${(AVATAR_COMBINATION_COUNT / 1_000_000_000).toFixed(1)}B+`;

const PRINCIPLES = [
	{
		copy: "Use a username, email, or internal ID. Blobz deterministically maps that stable seed to one avatar from nearly five billion combinations.",
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

export default function Home() {
	return (
		<main className="overflow-clip bg-[#f9fdff] text-[#0b1830] [--ease-in-out:cubic-bezier(0.77,0,0.175,1)] [--ease-out:cubic-bezier(0.23,1,0.32,1)] [--ink:#0b1830] [--line:#d8eef9] [--muted:#60708a] [--sky-soft:#e8f7ff] [--sky:#38bdf8]">
			<LandingNameProvider>
				<PersonalizedHero />

				<section
					aria-label="Blobz at a glance"
					className="relative z-8 mx-auto -mt-8 grid min-h-32 max-w-[78rem] grid-cols-[1fr_auto_1fr_auto_1fr] items-center rounded-[2rem] border border-[#d7eefb] bg-white/88 px-6 py-[1.15rem] shadow-[0_30px_90px_rgb(14_165_233_/_13%)] backdrop-blur-[20px] max-[820px]:mx-4 max-[640px]:-mt-6 max-[640px]:grid-cols-1 max-[820px]:grid-cols-3 max-[820px]:gap-4 max-[640px]:rounded-[1.4rem] max-[640px]:p-6"
				>
					<div className="flex items-baseline justify-center gap-[0.65rem] text-center max-[820px]:flex-col max-[820px]:items-start max-[820px]:gap-1 max-[820px]:text-left">
						<strong className="whitespace-nowrap font-[950] text-[clamp(1.35rem,2.6vw,2.15rem)] tracking-normal">
							{COMBINATION_LABEL}
						</strong>
						<span className="max-w-32 font-[650] text-[#60708a] text-[0.72rem] leading-[1.4]">
							possible combinations
						</span>
					</div>
					<div
						aria-hidden="true"
						className="h-[2.7rem] w-px bg-[#d9edf8] max-[820px]:hidden"
					/>
					<div className="flex items-baseline justify-center gap-[0.65rem] text-center max-[820px]:flex-col max-[820px]:items-start max-[820px]:gap-1 max-[820px]:text-left">
						<strong className="whitespace-nowrap font-[950] text-[clamp(1.35rem,2.6vw,2.15rem)] tracking-normal">
							1 seed
						</strong>
						<span className="max-w-32 font-[650] text-[#60708a] text-[0.72rem] leading-[1.4]">
							the same face, every time
						</span>
					</div>
					<div
						aria-hidden="true"
						className="h-[2.7rem] w-px bg-[#d9edf8] max-[820px]:hidden"
					/>
					<div className="flex items-baseline justify-center gap-[0.65rem] text-center max-[820px]:flex-col max-[820px]:items-start max-[820px]:gap-1 max-[820px]:text-left">
						<strong className="whitespace-nowrap font-[950] text-[clamp(1.35rem,2.6vw,2.15rem)] tracking-normal">
							0 files
						</strong>
						<span className="max-w-32 font-[650] text-[#60708a] text-[0.72rem] leading-[1.4]">
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
			</LandingNameProvider>

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

			<WaysToUse />

			<Pricing />

			<section className="relative min-h-[50rem] overflow-hidden bg-[radial-gradient(circle_at_50%_30%,white_0_14rem,transparent_34rem),linear-gradient(180deg,#f7fcff,#e8f7ff)] px-8 pt-44 pb-32 text-center max-[640px]:min-h-[44rem] max-[640px]:px-4 max-[640px]:pt-32 max-[640px]:pb-24">
				<div
					aria-hidden="true"
					className="mb-12 flex h-[8.5rem] items-end justify-center"
				>
					{FOOTER_BLOBZ.map(([name, palette]) => (
						<div
							className={`${footerAvatarStyles.item} -mx-[0.45rem] size-[6.75rem] rotate-[-7deg] even:-translate-y-4 even:rotate-6 max-[640px]:-mx-[0.55rem] max-[640px]:size-[5.1rem] [&:nth-child(3)]:-translate-y-[1.7rem] [&:nth-child(3)]:rotate-[-1deg] [&:nth-child(3)]:scale-[1.08]`}
							key={name}
						>
							<div
								className={`${footerAvatarStyles.card} size-full rounded-[1.45rem] border border-[#d8eef9] bg-white p-[0.3rem] shadow-[0_20px_45px_rgb(14_165_233_/_16%)] [&_img]:block`}
							>
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
				<span>Free React package. Hosted API when you need it.</span>
			</footer>
		</main>
	);
}
