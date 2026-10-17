import { Avatar } from "@blobz/react";
import Link from "next/link";
import styles from "./site-footer.module.css";

export const LEGAL_LINKS = [
	{ href: "/privacy-policy", label: "Privacy policy" },
	{ href: "/terms-and-conditions", label: "Terms & conditions" },
	{ href: "/cookie-policy", label: "Cookie policy" },
	{ href: "/refund-policy", label: "Refund policy" },
] as const;

export function SiteFooter() {
	return (
		<footer className="border-[#d8eef9] border-t bg-white text-[#60708a]">
			<div className="site-container flex flex-wrap items-center justify-between gap-x-10 gap-y-6 py-7 text-xs">
				<Link
					className="inline-flex items-center gap-[0.55rem] rounded-sm focus-visible:outline-2 focus-visible:outline-sky-600 focus-visible:outline-offset-4"
					href="/"
				>
					<Avatar
						alt=""
						name="blobz-footer"
						palette={["#eef9ff", "#38bdf8"]}
						size={30}
					/>
					<strong className="font-[760] font-[family-name:var(--font-bricolage)] text-[#0b1830] text-[0.92rem]">
						blobz
					</strong>
					<span>Tiny faces. Serious utility.</span>
				</Link>
				<nav
					aria-label="Legal information"
					className="flex flex-wrap gap-x-5 gap-y-3"
				>
					{LEGAL_LINKS.map(({ href, label }) => (
						<Link
							className="rounded-sm transition-colors duration-150 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-sky-600 focus-visible:outline-offset-4"
							href={{ pathname: href }}
							key={href}
						>
							{label}
						</Link>
					))}
				</nav>
			</div>
			<div className={`site-container ${styles.creditRow}`}>
				<p className={styles.credit}>
					made by bored{" "}
					<span className={styles.author}>
						<a
							href="https://lirena.in"
							rel="noopener noreferrer"
							target="_blank"
						>
							saksham
						</a>
						<Avatar
							alt=""
							frame="square"
							name="Saksham"
							palette={["#e8f7ff", "#38bdf8"]}
							size={24}
						/>
					</span>{" "}
					on a random friday
				</p>
				<Link className={styles.accountLink} href="/login">
					Sign in to hosted API
				</Link>
			</div>
		</footer>
	);
}
