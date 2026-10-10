"use client";

import { Avatar } from "@blobz/react";
import { ArrowDown, ArrowRight, Code2 } from "lucide-react";
import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";

import styles from "@/app/landing.module.css";

const PREFIXES = ["b", "bl", "blo", "blob", "blobz"] as const;
const ORBIT_DURATION_MS = 24_000;

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
	{
		angle: 229,
		name: "lime",
		palette: ["#f7fee7", "#a3e635"],
		rotation: -4,
		scale: 1.1,
		scatterX: -0.38,
		scatterY: -0.29,
		size: 84,
	},
	{
		angle: 252,
		name: "ocean",
		palette: ["#eff6ff", "#3b82f6"],
		rotation: 7,
		scale: 0.9,
		scatterX: 0.05,
		scatterY: -0.36,
		size: 72,
	},
] as const;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;
const smoothStep = (value: number): number => value * value * (3 - 2 * value);
const clampUnit = (value: number): number => Math.min(Math.max(value, 0), 1);
const clampToLimit = (value: number, limit: number): number =>
	Math.min(Math.max(value, -limit), limit);

interface SwarmLayout {
	readonly compact: boolean;
	readonly height: number;
	readonly orbitDegrees: number;
	readonly progress: number;
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
		clampUnit(1 - progress * 2.2).toFixed(4)
	);
	hero.style.setProperty(
		"--scatter-shift",
		`${((1 - progress) * 64).toFixed(1)}px`
	);
	hero.style.setProperty(
		"--scatter-opacity",
		clampUnit(progress * 2.2 - 1.15).toFixed(4)
	);
	hero.style.setProperty(
		"--cue-opacity",
		clampUnit(1 - progress * 4).toFixed(4)
	);
};

const positionSwarmItem = (
	item: HTMLElement,
	{ compact, height, orbitDegrees, progress, width }: SwarmLayout
): void => {
	const baseAngle = Number(item.dataset.angle ?? 0);
	const orbitInfluence = (1 - progress) ** 2;
	const angle = toRadians(baseAngle + orbitDegrees * orbitInfluence);
	const tileHalf = item.offsetWidth / 2;
	const horizontalGutter = compact ? 10 : 24;
	const verticalGutter = compact ? 14 : 24;
	const horizontalLimit = Math.max(0, width / 2 - tileHalf - horizontalGutter);
	const verticalLimit = Math.max(0, height / 2 - tileHalf - verticalGutter);
	const scatterHorizontalLimit = Math.max(0, width / 2 - tileHalf * 0.2);
	const scatterVerticalLimit = Math.max(0, height / 2 - tileHalf * 0.2);
	const radiusX = Math.min(width * (compact ? 0.42 : 0.38), horizontalLimit);
	const radiusY = Math.min(height * (compact ? 0.38 : 0.36), verticalLimit);
	const scatterRatioX = Number(item.dataset.scatterX ?? 0);
	const scatterRatioY = Number(item.dataset.scatterY ?? 0);
	const scatterDistance = Math.hypot(scatterRatioX, scatterRatioY);
	const minimumScatterDistance = compact ? 0.42 : 0.44;
	const scatterBoost = Math.max(
		1,
		minimumScatterDistance / Math.max(scatterDistance, 0.001)
	);
	const scatterX = clampToLimit(
		scatterRatioX * scatterBoost * width,
		scatterHorizontalLimit
	);
	const scatterY = clampToLimit(
		scatterRatioY * scatterBoost * height,
		scatterVerticalLimit
	);
	const rotation = Number(item.dataset.rotation ?? 0);
	const endScale = Number(item.dataset.scale ?? 1);
	const ringX = Math.cos(angle) * radiusX;
	const ringY = Math.sin(angle) * radiusY;
	const orbitDepth = (Math.sin(angle) + 1) / 2;
	const ringScale = 0.9 + orbitDepth * 0.14;
	const x = ringX + (scatterX - ringX) * progress;
	const y = ringY + (scatterY - ringY) * progress;
	const scale = ringScale + (endScale - ringScale) * progress;

	item.style.setProperty("--swarm-x", `${x.toFixed(1)}px`);
	item.style.setProperty("--swarm-y", `${y.toFixed(1)}px`);
	item.style.setProperty(
		"--swarm-rotation",
		`${(rotation * progress).toFixed(2)}deg`
	);
	item.style.setProperty("--swarm-scale", scale.toFixed(3));
	item.style.zIndex = String(Math.round(orbitDepth * 10));
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
		const hero = heroRef.current as HTMLElement;
		const sticky = stickyRef.current as HTMLDivElement;
		const items = hero.querySelectorAll<HTMLElement>("[data-swarm-item]");
		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		);
		let animationFrame = 0;
		let isVisible = true;

		const update = (timestamp = performance.now()) => {
			animationFrame = 0;
			const rect = hero.getBoundingClientRect();
			const stickyStyle = window.getComputedStyle(sticky);
			const stickyTop = Number.parseFloat(stickyStyle.top) || 0;
			const scrollDistance = Math.max(
				hero.offsetHeight - sticky.clientHeight,
				1
			);
			const rawProgress = Math.min(
				Math.max((stickyTop - rect.top) / scrollDistance, 0),
				1
			);
			const progress = prefersReducedMotion.matches
				? 0
				: smoothStep(rawProgress);
			const width = sticky.clientWidth;
			const height = sticky.clientHeight;
			const compact = width < 720;
			const orbitDegrees = prefersReducedMotion.matches
				? 0
				: ((timestamp % ORBIT_DURATION_MS) / ORBIT_DURATION_MS) * 360;

			setHeroTransitionVariables(hero, progress);

			for (const item of items) {
				positionSwarmItem(item, {
					compact,
					height,
					orbitDegrees,
					progress,
					width,
				});
			}

			if (isVisible && !prefersReducedMotion.matches && progress < 1) {
				animationFrame = window.requestAnimationFrame(update);
			}
		};

		const scheduleUpdate = () => {
			if (animationFrame === 0) {
				animationFrame = window.requestAnimationFrame(update);
			}
		};

		const visibilityObserver = new IntersectionObserver(
			(entries) => {
				isVisible = entries.some((entry) => entry.isIntersecting);
				if (isVisible) {
					scheduleUpdate();
				}
			},
			{ rootMargin: "120px" }
		);

		update();
		const resizeObserver = new ResizeObserver(scheduleUpdate);
		resizeObserver.observe(sticky);
		visibilityObserver.observe(hero);
		prefersReducedMotion.addEventListener("change", scheduleUpdate);
		window.addEventListener("resize", scheduleUpdate);
		window.addEventListener("scroll", scheduleUpdate, { passive: true });

		return () => {
			window.cancelAnimationFrame(animationFrame);
			resizeObserver.disconnect();
			visibilityObserver.disconnect();
			prefersReducedMotion.removeEventListener("change", scheduleUpdate);
			window.removeEventListener("resize", scheduleUpdate);
			window.removeEventListener("scroll", scheduleUpdate);
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
					{SWARM.map((item) => {
						const angle = toRadians(item.angle);
						const initialStyle = {
							"--swarm-rotation": "0deg",
							"--swarm-scale": 1,
							"--swarm-x": `${(Math.cos(angle) * 38).toFixed(2)}vw`,
							"--swarm-y": `${(Math.sin(angle) * 34).toFixed(2)}vh`,
							"--tile-size": `${item.size}px`,
						} as CSSProperties;

						return (
							<div
								className={styles.swarmItem}
								data-angle={item.angle}
								data-rotation={item.rotation}
								data-scale={item.scale}
								data-scatter-x={item.scatterX}
								data-scatter-y={item.scatterY}
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
							href="#surfaces"
						>
							Generate an avatar
							<ArrowRight aria-hidden="true" className="size-4" />
						</Link>
						<Link
							className={`${styles.secondaryAction} inline-flex h-[3.15rem] items-center justify-center gap-[0.55rem] rounded-[0.95rem] border border-[#cdeaff] bg-white/78 px-5 font-extrabold text-[#30425d] text-[0.9rem] shadow-[0_12px_30px_rgb(14_165_233_/_8%)] transition-[transform,box-shadow,background] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-[3px] active:scale-[0.97] motion-reduce:transition-none max-[640px]:w-full`}
							href="#developers"
						>
							<Code2 aria-hidden="true" className="size-4" />
							Install for React
						</Link>
					</div>
				</div>

				<div className={styles.scatterCopy}>
					<p className="font-bold text-[#4e6582] text-[clamp(1.15rem,2vw,1.5rem)]">
						Same seed.
					</p>
					<strong className="mt-1 block font-[780] font-[family-name:var(--font-bricolage)] text-[clamp(3rem,7.5vw,6.4rem)] leading-[0.95] tracking-[-0.055em] max-[640px]:text-[3.25rem]">
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
