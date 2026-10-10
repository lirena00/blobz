"use client";

import { Avatar } from "@blobz/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import styles from "./header.module.css";

const SCROLL_COLLAPSE_THRESHOLD_PX = 24;

export default function Header() {
	const [isExpanded, setIsExpanded] = useState(true);

	useEffect(() => {
		let animationFrame = 0;

		const updateHeader = () => {
			animationFrame = 0;
			const shouldExpand = window.scrollY <= SCROLL_COLLAPSE_THRESHOLD_PX;
			setIsExpanded((currentState) =>
				currentState === shouldExpand ? currentState : shouldExpand
			);
		};

		const handleScroll = () => {
			if (animationFrame === 0) {
				animationFrame = window.requestAnimationFrame(updateHeader);
			}
		};

		updateHeader();
		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.cancelAnimationFrame(animationFrame);
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<header className="pointer-events-none sticky top-3 z-50 -mb-[5.75rem] h-[5.75rem] px-4 max-[760px]:top-[0.6rem] max-[760px]:-mb-[5.4rem] max-[760px]:h-[5.4rem] max-[760px]:px-[0.6rem]">
			<div
				className={`${styles.headerChrome} pointer-events-none relative isolate mx-auto h-[4.25rem] w-full max-w-[88rem] max-[760px]:h-16`}
				data-expanded={isExpanded}
			>
				<div className="pointer-events-none relative z-1 grid h-full grid-cols-[1fr_auto_1fr] items-center py-[0.45rem] pr-[0.55rem] pl-4 max-[760px]:grid-cols-[1fr_auto] max-[760px]:pl-[0.8rem]">
					<Link
						aria-label="Blobz home"
						className={`${styles.headerBrand} pointer-events-auto inline-flex items-center gap-[0.65rem] justify-self-start font-[780] font-[family-name:var(--font-bricolage)] text-[#0b1830] text-[1.12rem] tracking-[-0.035em] max-[760px]:text-base`}
						href="/"
					>
						<Avatar
							alt=""
							className="max-[760px]:!size-[2.1rem] rounded-full border border-[#d3edf9] bg-[#eef9ff] p-[0.15rem]"
							name="blobz"
							palette={["#eaf8ff", "#38bdf8"]}
							size={38}
						/>
						<span>blobz</span>
					</Link>

					<nav
						aria-label="Primary navigation"
						className={`${styles.headerNav} flex items-center gap-1 justify-self-center max-[760px]:hidden`}
					>
						<Link
							className="rounded-full px-[0.85rem] py-[0.7rem] font-[720] text-[#52647c] text-[0.78rem] transition-colors duration-150 hover:bg-sky-100/80 hover:text-[#0b1830]"
							href="#surfaces"
						>
							Live demo
						</Link>
						<Link
							className="rounded-full px-[0.85rem] py-[0.7rem] font-[720] text-[#52647c] text-[0.78rem] transition-colors duration-150 hover:bg-sky-100/80 hover:text-[#0b1830]"
							href="#principles"
						>
							Why Blobz
						</Link>
						<Link
							className="rounded-full px-[0.85rem] py-[0.7rem] font-[720] text-[#52647c] text-[0.78rem] transition-colors duration-150 hover:bg-sky-100/80 hover:text-[#0b1830]"
							href="#developers"
						>
							Developers
						</Link>
					</nav>

					<Link
						className={`${styles.headerAction} pointer-events-auto inline-flex h-[3.25rem] items-center justify-center gap-[0.45rem] justify-self-end whitespace-nowrap rounded-full bg-[#0b1830] px-[1.15rem] font-[820] text-[0.8rem] text-white shadow-[0_12px_26px_rgb(11_24_48_/_18%)] transition-colors duration-150 hover:bg-sky-600 max-[760px]:h-12 max-[760px]:px-4`}
						href="#surfaces"
					>
						Try it live
						<ArrowUpRight aria-hidden="true" className="size-[0.95rem]" />
					</Link>
				</div>
			</div>
		</header>
	);
}
