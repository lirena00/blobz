import { Avatar } from "@blobz/react";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { IdentitySurfaces } from "@/components/landing/identity-surfaces";
import { LandingNameProvider } from "@/components/landing/landing-name";
import { PersonalizedHero } from "@/components/landing/personalized-hero";
import { Pricing } from "@/components/landing/pricing";
import { WaysToUse } from "@/components/landing/ways-to-use";
import { SiteFooter } from "@/components/site-footer";
import { SponsorCard } from "@/components/sponsor-card";
import { DEMO_PEOPLE, getFirstName } from "@/lib/demo-people";
import { SPONSOR_URL } from "@/lib/site";
import footerAvatarStyles from "./footer-avatars.module.css";

const EYEBROW_CLASS =
	"mb-4 text-[0.72rem] font-[850] uppercase tracking-[0.17em] text-sky-600";
const DISPLAY_FONT_CLASS = "font-[family-name:var(--font-bricolage)]";
const SECTION_HEADING_CLASS = `${DISPLAY_FONT_CLASS} text-[clamp(3rem,6vw,6rem)] font-[780] leading-[0.93] tracking-[-0.055em] max-[640px]:text-[3.2rem]`;
const SURFACE_COPY_CLASS = "leading-[1.75] text-[#60708a]";
const HOME_TITLE = "Blobz — SVG Avatar Generator for React & shadcn";
const HOME_DESCRIPTION =
	"Generate expressive default avatars from user IDs. Blobz is an open-source SVG avatar library with React components, shadcn blocks and customizable brand colors.";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
	description: HOME_DESCRIPTION,
	openGraph: {
		description: HOME_DESCRIPTION,
		siteName: "Blobz",
		title: HOME_TITLE,
		type: "website",
		url: "/",
	},
	title: HOME_TITLE,
	twitter: {
		card: "summary_large_image",
		description: HOME_DESCRIPTION,
		title: HOME_TITLE,
	},
};

const FOOTER_BLOBZ = [
	[getFirstName(DEMO_PEOPLE.janakiAmmal), ["#eef9ff", "#38bdf8"]],
	[getFirstName(DEMO_PEOPLE.vikramSarabhai), ["#fff7ed", "#fb923c"]],
	[getFirstName(DEMO_PEOPLE.kalpanaChawla), ["#f0fdf4", "#4ade80"]],
	[getFirstName(DEMO_PEOPLE.srinivasaRamanujan), ["#faf5ff", "#c084fc"]],
	[getFirstName(DEMO_PEOPLE.gagandeepKang), ["#fff1f2", "#fb7185"]],
] as const;

export default function Home() {
	return (
		<>
			<main className="overflow-clip bg-[#f9fdff] text-[#0b1830] [--ease-in-out:cubic-bezier(0.77,0,0.175,1)] [--ease-out:cubic-bezier(0.23,1,0.32,1)] [--ink:#0b1830] [--line:#d8eef9] [--muted:#60708a] [--sky-soft:#e8f7ff] [--sky:#38bdf8]">
				<LandingNameProvider>
					<PersonalizedHero />
					<WaysToUse />

					<section
						className="site-container scroll-mt-24 pt-28 pb-20 max-[640px]:py-20"
						id="surfaces"
					>
						<div className="mb-13 grid grid-cols-[minmax(0,1fr)_minmax(18rem,0.42fr)] items-end gap-20 max-[640px]:mb-10 max-[820px]:grid-cols-1 max-[820px]:gap-6">
							<div>
								<p className={EYEBROW_CLASS}>Made for your interface</p>
								<h2 className={SECTION_HEADING_CLASS}>
									Your app.
									<br />
									Your colors.
								</h2>
							</div>
							<p
								className={`max-w-[30rem] text-[1.02rem] ${SURFACE_COPY_CLASS}`}
							>
								Drop avatars into profiles, teams, and account menus. Try a
								palette or bring your own brand colors to see how they fit.
							</p>
						</div>
						<IdentitySurfaces />
					</section>
				</LandingNameProvider>

				<section
					aria-labelledby="principles-title"
					className="site-container scroll-mt-24 pb-24 max-[640px]:pb-20"
					id="principles"
				>
					<div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-center gap-12 rounded-[2rem] border border-[#d8eef9] bg-[#eef9ff] p-10 max-[820px]:grid-cols-1 max-[820px]:gap-5 max-[640px]:rounded-3xl max-[640px]:p-6">
						<div>
							<p className={EYEBROW_CLASS}>Predictable by design</p>
							<h2
								className={`${DISPLAY_FONT_CLASS} font-[780] text-[clamp(2.25rem,4vw,3.5rem)] leading-none tracking-[-0.045em]`}
								id="principles-title"
							>
								Stable by default.
							</h2>
						</div>
						<p className={`max-w-[35rem] text-[1.02rem] ${SURFACE_COPY_CLASS}`}>
							Use a stable user ID with the same palette and settings to get the
							same avatar across sessions and surfaces. Render it on demand,
							with no uploaded images to store.
						</p>
					</div>
				</section>

				<Pricing />

				<section
					aria-labelledby="sponsors-heading"
					className="site-container grid grid-cols-[minmax(0,1fr)_minmax(19rem,0.6fr)] items-center gap-12 py-28 max-[820px]:grid-cols-1 max-[640px]:gap-8 max-[640px]:py-20"
				>
					<div>
						<p className={EYEBROW_CLASS}>Back the project</p>
						<h2 className={SECTION_HEADING_CLASS} id="sponsors-heading">
							<a
								className="rounded-sm transition-colors duration-150 hover:text-sky-600 focus-visible:outline-2 focus-visible:outline-sky-600 focus-visible:outline-offset-4"
								href={SPONSOR_URL}
								rel="noopener noreferrer"
								target="_blank"
							>
								Help keep Blobz open source.
							</a>
						</h2>
						<p
							className={`mt-5 max-w-[34rem] text-[1.02rem] ${SURFACE_COPY_CLASS}`}
						>
							Your support helps keep Blobz open, playful, and growing.
						</p>
					</div>
					<div className="w-full max-w-[24rem] justify-self-end max-[820px]:justify-self-start">
						<SponsorCard />
					</div>
				</section>

				<section className="relative overflow-hidden bg-[radial-gradient(circle_at_50%_30%,white_0_14rem,transparent_34rem),linear-gradient(180deg,#f7fcff,#e8f7ff)] py-24 text-center max-[640px]:py-20">
					<div className="site-container">
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
						<p className={EYEBROW_CLASS}>A better default, ready to ship</p>
						<h2
							className={`${DISPLAY_FONT_CLASS} font-[780] text-[clamp(3rem,6vw,6rem)] leading-[0.98] tracking-[-0.055em] max-[640px]:text-[3.2rem]`}
						>
							Give your app a little character.
						</h2>
						<p
							className={`mx-auto mt-[1.6rem] max-w-[38rem] text-[1.05rem] ${SURFACE_COPY_CLASS}`}
						>
							Start with the free React package or add a shadcn component. Make
							it yours from there.
						</p>
						<Link
							className="mt-8 inline-flex h-[3.15rem] items-center justify-center gap-[0.55rem] rounded-[0.95rem] bg-[#0b1830] px-5 font-extrabold text-[0.9rem] text-white shadow-[0_18px_40px_rgb(11_24_48_/_20%)] transition-[transform,box-shadow,background] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-[3px] hover:bg-sky-600 active:scale-[0.97] motion-reduce:transition-none"
							href="#install"
						>
							Add to your app
							<ArrowRight aria-hidden="true" className="size-4" />
						</Link>
					</div>
				</section>
			</main>
			<SiteFooter />
		</>
	);
}
