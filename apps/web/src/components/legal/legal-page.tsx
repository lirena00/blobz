import { Avatar } from "@blobz/react";
import type { ReactNode } from "react";
import styles from "./legal-page.module.css";

interface SectionLink {
	id: string;
	label: string;
}

export function LegalPage({
	children,
	intro,
	sections,
	title,
}: {
	children: ReactNode;
	intro: string;
	sections: readonly SectionLink[];
	title: string;
}) {
	return (
		<main className="min-h-[calc(100vh-7rem)] bg-[#f9fdff] pt-36 text-[#0b1830] max-[640px]:pt-28">
			<div className="mx-auto max-w-[82rem] px-6 max-[640px]:px-4">
				<div className="relative overflow-hidden rounded-[2rem] border border-[#d8eef9] bg-[radial-gradient(circle_at_86%_20%,#dff4ff_0,transparent_29rem),linear-gradient(135deg,#fff,#f0faff)] px-12 py-14 max-[640px]:rounded-[1.5rem] max-[640px]:px-6 max-[640px]:py-10">
					<div className="relative z-1 max-w-[48rem]">
						<p className="mb-5 font-[850] text-[0.72rem] text-sky-700 uppercase tracking-[0.17em]">
							The details
						</p>
						<h1 className="font-[780] font-[family-name:var(--font-bricolage)] text-[clamp(3rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.055em]">
							{title}
						</h1>
						<p className="mt-6 max-w-[42rem] text-[#52647c] text-[1.05rem] leading-7">
							{intro}
						</p>
						<p className="mt-8 font-semibold text-[#60708a] text-xs">
							Last updated 13 October 2026
						</p>
					</div>
					<div
						aria-hidden="true"
						className="absolute right-12 bottom-[-2.5rem] rotate-[-10deg] opacity-90 max-[760px]:right-[-2rem] max-[760px]:bottom-[-2rem] max-[760px]:opacity-20"
					>
						<Avatar
							alt=""
							name={title}
							palette={["#eef9ff", "#38bdf8"]}
							size={180}
						/>
					</div>
				</div>
				<div className="grid grid-cols-[minmax(12rem,0.28fr)_minmax(0,1fr)] gap-16 py-16 max-[820px]:grid-cols-1 max-[820px]:gap-10 max-[640px]:py-10">
					<aside className="self-start max-[820px]:border-[#d8eef9] max-[820px]:border-b max-[820px]:pb-8">
						<nav aria-label={`${title} sections`} className="sticky top-28">
							<p className="mb-4 font-[850] text-[0.68rem] text-sky-700 uppercase tracking-[0.17em]">
								On this page
							</p>
							<ul className="grid gap-1">
								{sections.map(({ id, label }) => (
									<li key={id}>
										<a
											className="inline-block rounded-md py-1.5 text-[#52647c] text-sm transition-colors duration-150 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-sky-600 focus-visible:outline-offset-2"
											href={`#${id}`}
										>
											{label}
										</a>
									</li>
								))}
							</ul>
						</nav>
					</aside>
					<article className={styles.content}>{children}</article>
				</div>
			</div>
		</main>
	);
}

export function LegalSection({
	children,
	id,
	title,
}: {
	children: ReactNode;
	id: string;
	title: string;
}) {
	return (
		<section className={styles.section} id={id}>
			<h2>{title}</h2>
			{children}
		</section>
	);
}
