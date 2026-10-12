"use client";

import { Avatar } from "@blobz/react";
import { ArrowDown, ArrowRight, Code2 } from "lucide-react";
import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";

import styles from "@/app/landing.module.css";

const PREFIXES = ["b", "bl", "blo", "blob", "blobz"] as const;
const ORBIT_DURATION_MS = 42_000;

const SWARM = [
	{
		angle: -90,
		name: "aster",
		palette: ["#f1f9ff", "#38bdf8"],
		rotation: -3,
		scale: 1.02,
		scatterX: -0.41,
		scatterY: -0.32,
		size: 78,
	},
	{
		angle: -66,
		name: "mango",
		palette: ["#fff7ed", "#fb923c"],
		rotation: 5,
		scale: 0.84,
		scatterX: 0.31,
		scatterY: -0.38,
		size: 66,
	},
	{
		angle: -43,
		name: "plum",
		palette: ["#faf5ff", "#c084fc"],
		rotation: -7,
		scale: 1.16,
		scatterX: 0.43,
		scatterY: -0.12,
		size: 86,
	},
	{
		angle: -20,
		name: "fern",
		palette: ["#f0fdf4", "#4ade80"],
		rotation: 2,
		scale: 0.78,
		scatterX: 0.19,
		scatterY: -0.19,
		size: 64,
	},
	{
		angle: 2,
		name: "coral",
		palette: ["#fff1f2", "#fb7185"],
		rotation: 7,
		scale: 1.08,
		scatterX: 0.41,
		scatterY: 0.31,
		size: 82,
	},
	{
		angle: 25,
		name: "lake",
		palette: ["#ecfeff", "#22d3ee"],
		rotation: -4,
		scale: 0.86,
		scatterX: 0.09,
		scatterY: 0.38,
		size: 68,
	},
	{
		angle: 47,
		name: "lemon",
		palette: ["#fffbeb", "#fbbf24"],
		rotation: 4,
		scale: 1.12,
		scatterX: 0.32,
		scatterY: 0.18,
		size: 84,
	},
	{
		angle: 70,
		name: "indigo",
		palette: ["#eef2ff", "#818cf8"],
		rotation: -6,
		scale: 0.9,
		scatterX: -0.25,
		scatterY: 0.4,
		size: 72,
	},
	{
		angle: 92,
		name: "peach",
		palette: ["#fff7ed", "#fd8a6a"],
		rotation: 5,
		scale: 1.05,
		scatterX: 0.18,
		scatterY: 0.26,
		size: 80,
	},
	{
		angle: 115,
		name: "mint",
		palette: ["#ecfdf5", "#34d399"],
		rotation: -3,
		scale: 0.8,
		scatterX: -0.42,
		scatterY: 0.25,
		size: 64,
	},
	{
		angle: 138,
		name: "berry",
		palette: ["#fdf2f8", "#e879b7"],
		rotation: 6,
		scale: 1.14,
		scatterX: -0.18,
		scatterY: 0.18,
		size: 86,
	},
	{
		angle: 160,
		name: "violet",
		palette: ["#f5f3ff", "#a78bfa"],
		rotation: -8,
		scale: 0.84,
		scatterX: -0.32,
		scatterY: 0.4,
		size: 68,
	},
	{
		angle: 183,
		name: "sea",
		palette: ["#ecfeff", "#06b6d4"],
		rotation: 2,
		scale: 1.04,
		scatterX: -0.43,
		scatterY: 0.02,
		size: 80,
	},
	{
		angle: 206,
		name: "poppy",
		palette: ["#fff1f2", "#f43f5e"],
		rotation: 5,
		scale: 0.82,
		scatterX: -0.22,
		scatterY: -0.17,
		size: 66,
	},
] as const;

const MOBILE_SWARM_INDICES = [0, 1, 3, 4, 6, 7, 8, 10, 11, 13] as const;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;
const smoothStep = (value: number): number => value * value * (3 - 2 * value);
const clampUnit = (value: number): number => Math.min(Math.max(value, 0), 1);
interface SwarmLayout {
	readonly height: number;
	readonly orbitDegrees: number;
	readonly progress: number;
	readonly tileSize: number;
	readonly width: number;
}

const setHeroTransitionVariables = (
	hero: HTMLElement,
	progress: number
): void => {
	hero.style.setProperty("--hero-shift", `${(-progress * 80).toFixed(1)}px`);
	hero.style.setProperty("--hero-scale", (1 - progress * 0.08).toFixed(4));
	hero.style.setProperty(
		"--hero-opacity",
		clampUnit(1 - progress * 2.5).toFixed(4)
	);
	hero.style.setProperty(
		"--scatter-shift",
		`${((1 - progress) * 64).toFixed(1)}px`
	);
	hero.style.setProperty(
		"--scatter-opacity",
		clampUnit((progress - 0.25) * 4).toFixed(4)
	);
	hero.style.setProperty(
		"--cue-opacity",
		clampUnit(1 - progress * 4).toFixed(4)
	);
};

const positionSwarmItem = (
	item: HTMLElement,
	avatarIndex: number,
	orbitIndex: number,
	orbitCount: number,
	{ height, orbitDegrees, progress, tileSize, width }: SwarmLayout
): void => {
	const avatar = SWARM[avatarIndex];
	const angle = toRadians(-90 + (orbitIndex * 360) / orbitCount + orbitDegrees);
	let horizontalGutter = 28;
	let horizontalRadiusRatio = 0.39;
	if (width < 480) {
		horizontalGutter = 8;
		horizontalRadiusRatio = 0.44;
	} else if (width < 640) {
		horizontalGutter = 10;
		horizontalRadiusRatio = 0.4;
	}
	const topGutter = width < 640 ? 72 : 106;
	const bottomGutter = width < 640 ? 38 : 48;
	const radiusX = Math.min(
		width * horizontalRadiusRatio,
		width / 2 - tileSize / 2 - horizontalGutter
	);
	const radiusY = Math.min(
		height * (width < 480 ? 0.35 : 0.33),
		height / 2 - tileSize / 2 - topGutter,
		height / 2 - tileSize / 2 - bottomGutter
	);
	const ringX = Math.cos(angle) * Math.max(0, radiusX);
	const ringY = Math.sin(angle) * Math.max(0, radiusY);
	const scatterX = avatar.scatterX * width * 1.6;
	const scatterY = avatar.scatterY * height * 1.6;
	const x = ringX + (scatterX - ringX) * progress;
	const y = ringY + (scatterY - ringY) * progress;
	const scale = 1 + (avatar.scale - 1) * progress;

	item.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px), 0) scale(${scale.toFixed(3)})`;
};

export function AvatarSwarmHero() {
	const [step, setStep] = useState(0);
	const heroRef = useRef<HTMLElement | null>(null);
	const stickyRef = useRef<HTMLDivElement | null>(null);
	const typedName = PREFIXES[step] ?? "blobz";

	useEffect(() => {
		const delay = step === PREFIXES.length - 1 ? 1800 : 430;
		const timer = window.setTimeout(() => {
			setStep((current) => (current + 1) % PREFIXES.length);
		}, delay);

		return () => window.clearTimeout(timer);
	}, [step]);

	useEffect(() => {
		const hero = heroRef.current;
		const sticky = stickyRef.current;
		if (hero === null || sticky === null) {
			return;
		}

		const items = hero.querySelectorAll<HTMLElement>("[data-swarm-item]");
		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		);
		let animationFrame = 0;
		let isVisible = false;
		let orbitDegrees = 0;
		let previousTimestamp = 0;
		let progress = 0;
		let width = sticky.clientWidth;
		let height = sticky.clientHeight;
		let tileSize = items[0]?.offsetWidth ?? 72;
		let scrollDistance = 1;
		let stickyTop = 0;
		let activeIndices: readonly number[] = SWARM.map((_, index) => index);

		const render = (timestamp: number) => {
			animationFrame = 0;
			if (
				isVisible &&
				!document.hidden &&
				!prefersReducedMotion.matches &&
				progress < 1
			) {
				const elapsed = Math.min(
					timestamp - (previousTimestamp || timestamp),
					64
				);
				orbitDegrees =
					(orbitDegrees + (elapsed / ORBIT_DURATION_MS) * 360) % 360;
			}
			previousTimestamp = timestamp;

			for (const [orbitIndex, avatarIndex] of activeIndices.entries()) {
				const item = items[avatarIndex];
				positionSwarmItem(item, avatarIndex, orbitIndex, activeIndices.length, {
					height,
					orbitDegrees: orbitDegrees * (1 - progress) ** 2,
					progress,
					tileSize,
					width,
				});
			}

			if (
				isVisible &&
				!document.hidden &&
				!prefersReducedMotion.matches &&
				progress < 1
			) {
				animationFrame = window.requestAnimationFrame(render);
			}
		};

		const scheduleRender = () => {
			if (animationFrame === 0) {
				animationFrame = window.requestAnimationFrame(render);
			}
		};

		const updateScroll = () => {
			const rawProgress = clampUnit(
				(stickyTop - hero.getBoundingClientRect().top) / scrollDistance
			);
			progress = prefersReducedMotion.matches ? 0 : smoothStep(rawProgress);
			setHeroTransitionVariables(hero, progress);
			scheduleRender();
		};

		const measure = () => {
			width = sticky.clientWidth;
			height = sticky.clientHeight;
			activeIndices =
				width < 480 ? MOBILE_SWARM_INDICES : SWARM.map((_, index) => index);
			for (const [index, item] of items.entries()) {
				item.hidden = !activeIndices.includes(index);
			}
			tileSize = items[0]?.offsetWidth ?? 72;
			stickyTop = Number.parseFloat(window.getComputedStyle(sticky).top) || 0;
			scrollDistance = Math.max(hero.offsetHeight - height, 1);
			updateScroll();
		};

		const visibilityObserver = new IntersectionObserver(
			(entries) => {
				isVisible = entries.some((entry) => entry.isIntersecting);
				if (isVisible) {
					previousTimestamp = 0;
					updateScroll();
				} else {
					window.cancelAnimationFrame(animationFrame);
					animationFrame = 0;
				}
			},
			{ rootMargin: "120px" }
		);
		const handleScroll = () => {
			if (isVisible) {
				updateScroll();
			}
		};
		const handleVisibilityChange = () => {
			if (document.hidden) {
				window.cancelAnimationFrame(animationFrame);
				animationFrame = 0;
				return;
			}
			previousTimestamp = 0;
			scheduleRender();
		};

		measure();
		const resizeObserver = new ResizeObserver(measure);
		resizeObserver.observe(sticky);
		visibilityObserver.observe(hero);
		prefersReducedMotion.addEventListener("change", updateScroll);
		window.addEventListener("scroll", handleScroll, { passive: true });
		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			window.cancelAnimationFrame(animationFrame);
			resizeObserver.disconnect();
			visibilityObserver.disconnect();
			prefersReducedMotion.removeEventListener("change", updateScroll);
			window.removeEventListener("scroll", handleScroll);
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, []);

	return (
		<section className={styles.swarmHero} ref={heroRef}>
			<div
				className="sticky top-0 isolate h-svh overflow-hidden"
				ref={stickyRef}
			>
				<div aria-hidden="true" className={styles.heroSky} />
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 z-2"
				>
					{SWARM.map((item, index) => {
						const angle = toRadians(-90 + (index * 360) / SWARM.length);
						const initialStyle = {
							"--swarm-x": `${(Math.cos(angle) * 39).toFixed(2)}vw`,
							"--swarm-y": `${(Math.sin(angle) * 30).toFixed(2)}vh`,
						} as CSSProperties;

						return (
							<div
								className={styles.swarmItem}
								data-swarm-item=""
								key={item.name}
								style={initialStyle}
							>
								<Avatar
									alt=""
									className="block rounded-[21%]"
									name={item.name}
									palette={item.palette}
									size="100%"
								/>
							</div>
						);
					})}
				</div>

				<div className={styles.heroCopy}>
					<h1
						className={`${styles.heroTitle} font-[800] font-[family-name:var(--font-bricolage)] tracking-[-0.07em]`}
					>
						<span className="sr-only">Blobz</span>
						<span
							aria-hidden="true"
							className="inline-flex min-w-[4.9ch] items-center pl-[0.03em] text-left [text-shadow:0_18px_50px_rgb(14_165_233_/_10%)]"
						>
							{typedName}
							<span className={styles.caret} />
						</span>
						<span
							aria-hidden="true"
							className={styles.wordAvatar}
							key={typedName}
						>
							<Avatar
								alt=""
								name={typedName}
								palette={["#e8f7ff", "#38bdf8"]}
								size="100%"
							/>
						</span>
					</h1>
					<p className={styles.heroSubhead}>
						Blobz is an avatar-generation library for playful default profile
						pictures. Give it a username, email, or ID and it returns the same
						unique SVG face every time.
					</p>
					<div
						className={`${styles.heroActions} mt-[1.8rem] flex items-center gap-3 max-[640px]:mt-[1.35rem] max-[640px]:w-full max-[640px]:max-w-72 max-[640px]:flex-col`}
					>
						<Link
							className={`${styles.primaryAction} inline-flex h-[3.15rem] items-center justify-center gap-[0.55rem] rounded-[0.95rem] bg-[#0b1830] px-5 font-extrabold text-[0.9rem] text-white shadow-[0_15px_35px_rgb(15_23_42_/_20%)] transition-[transform,box-shadow,background] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-[3px] hover:bg-sky-600 hover:shadow-[0_18px_38px_rgb(14_165_233_/_28%)] active:scale-[0.97] motion-reduce:transition-none max-[640px]:w-full`}
							href="/create"
						>
							Try it live
							<ArrowRight aria-hidden="true" className="size-4" />
						</Link>
						<Link
							className={`${styles.secondaryAction} inline-flex h-[3.15rem] items-center justify-center gap-[0.55rem] rounded-[0.95rem] border border-[#cdeaff] bg-white/78 px-5 font-extrabold text-[#30425d] text-[0.9rem] shadow-[0_12px_30px_rgb(14_165_233_/_8%)] transition-[transform,box-shadow,background] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-[3px] active:scale-[0.97] motion-reduce:transition-none max-[640px]:w-full`}
							href="#docs"
						>
							<Code2 aria-hidden="true" className="size-4" />
							React docs
						</Link>
					</div>
				</div>

				<div className={styles.scatterCopy}>
					<p className="font-bold text-[#4e6582] text-[clamp(1.15rem,2vw,1.5rem)]">
						Same seed.
					</p>
					<strong className="mt-1 block font-[780] font-[family-name:var(--font-bricolage)] text-[clamp(2.75rem,5vw,4.5rem)] leading-[0.98] tracking-[-0.055em] max-[640px]:text-[2.7rem]">
						Same face. Every time.
					</strong>
				</div>

				<div aria-hidden="true" className={styles.scrollCue}>
					<ArrowDown className="size-4" />
					Scroll to let them loose
				</div>
			</div>
		</section>
	);
}
