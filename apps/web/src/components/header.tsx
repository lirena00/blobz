"use client";

import { Avatar } from "@blobz/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import styles from "./header.module.css";
import UserMenu from "./user-menu";

const NAV_ITEMS = [
	{ href: "/#docs", label: "Docs" },
	{ href: "/#api", label: "Hosted API" },
] as const;

const NAV_LINK_CLASS =
	"border-transparent border-b border-dotted px-1  font-[720] text-[#52647c] text-[0.78rem] transition-[border-color,color] duration-150 hover:border-sky-500 hover:text-[#0b1830] focus-visible:border-sky-600 focus-visible:text-[#0b1830] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600";

export default function Header() {
	return (
		<header className="pointer-events-none sticky top-3 z-50 -mb-[5.75rem] h-[5.75rem] px-4 max-[760px]:top-[0.6rem] max-[760px]:-mb-[5.4rem] max-[760px]:h-[5.4rem] max-[760px]:px-[0.6rem]">
			<div
				className={`${styles.headerChrome} pointer-events-none relative isolate mx-auto h-[4.25rem] w-full max-w-[74rem] max-[760px]:h-16`}
			>
				<div className="pointer-events-none relative z-1 grid h-full grid-cols-[auto_1fr] items-center py-[0.45rem] pr-[0.55rem] pl-4 max-[760px]:pl-[0.8rem]">
					<Link
						aria-label="Blobz home"
						className="pointer-events-auto inline-flex items-center gap-[0.65rem] justify-self-start rounded-full font-[780] font-[family-name:var(--font-bricolage)] text-[#0b1830] text-[1.12rem] tracking-[-0.035em] focus-visible:outline-2 focus-visible:outline-sky-600 focus-visible:outline-offset-2 max-[460px]:gap-0 max-[760px]:text-base"
						href="/"
					>
						<Avatar
							alt=""
							className="max-[760px]:!size-[2.1rem] rounded-full border border-[#d3edf9] bg-[#eef9ff] p-[0.15rem]"
							name="blobz"
							palette={["#eaf8ff", "#38bdf8"]}
							size={38}
						/>
						<span className="max-[460px]:sr-only">blobz</span>
					</Link>

					<div className="pointer-events-auto flex min-w-0 items-center gap-4 justify-self-end max-[460px]:gap-1.5">
						<nav
							aria-label="Primary navigation"
							className="flex items-center gap-4 max-[760px]:hidden"
						>
							{NAV_ITEMS.map(({ href, label }) => (
								<Link className={NAV_LINK_CLASS} href={href} key={href}>
									{label}
								</Link>
							))}
						</nav>
						<UserMenu signInClassName={NAV_LINK_CLASS} />
						<Link
							className={`${styles.headerAction} inline-flex h-[3.25rem] items-center justify-center gap-[0.45rem] whitespace-nowrap rounded-full bg-[#0b1830] px-[1.15rem] font-[820] text-[0.8rem] text-white shadow-[0_12px_26px_rgb(11_24_48_/_18%)] transition-[background-color,transform] duration-150 hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-sky-600 focus-visible:outline-offset-2 max-[460px]:size-11 max-[760px]:h-12 max-[460px]:px-0 max-[760px]:px-4`}
							href="/create"
						>
							<span className="max-[460px]:sr-only">Try it live</span>
							<ArrowUpRight aria-hidden="true" className="size-[0.95rem]" />
						</Link>
					</div>
				</div>
			</div>
		</header>
	);
}
