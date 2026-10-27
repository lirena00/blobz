"use client";

import { Avatar } from "@blobz/react";
import { Button } from "@blobz/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@blobz/ui/components/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@blobz/ui/components/input-group";
import { ArrowDownRight, Pause, Play, RotateCcw } from "lucide-react";
import {
	type ChangeEvent,
	type FocusEvent,
	type MouseEvent,
	type PointerEvent,
	useCallback,
	useEffect,
	useEffectEvent,
	useRef,
	useState,
} from "react";
import { useScramble } from "use-scramble";
import styles from "./hero-avatar-demo.module.css";
import { HeroAvatarExports } from "./hero-avatar-exports";
import {
	HERO_AVATAR_PRESETS,
	type HeroAvatarValue,
} from "./hero-avatar-presets";
import { useLandingName } from "./landing-name";

const HOLD_DURATION_MS = 4000;
const SWITCH_DURATION_MS = 680;
const NAME_SCRAMBLE_DELAY_MS = 220;
const VISIBLE_CARD_COUNT = 3;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
const HTML_CHARACTERS = /[&<>"']/g;
const HTML_ENTITIES: Readonly<Record<string, string>> = {
	"'": "&#39;",
	'"': "&quot;",
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
};

const getDepth = (index: number, activeIndex: number): number =>
	(index - activeIndex + HERO_AVATAR_PRESETS.length) %
	HERO_AVATAR_PRESETS.length;
const getCardFrame = (depth: number): Keyframe & { transform: string } => ({
	opacity: depth < VISIBLE_CARD_COUNT ? 1 : 0,
	transform: `translate3d(0, ${-depth * 9}%, ${-depth * 75}px)`,
});
const cancelAnimations = (animations: Animation[]): void => {
	for (const animation of animations.splice(0)) {
		animation.cancel();
	}
};

function ScrambledName({ name }: { readonly name: string }) {
	// use-scramble writes HTML internally; user-entered names must stay text.
	const escapedName = name.replace(
		HTML_CHARACTERS,
		(character) => HTML_ENTITIES[character] ?? character
	);
	const { ref, replay } = useScramble({
		chance: 1,
		overdrive: false,
		playOnMount: false,
		range: [65, 90],
		scramble: 5,
		seed: 1,
		speed: 0.75,
		step: Math.max(1, Math.ceil(escapedName.length / 10)),
		text: escapedName,
		tick: 2,
	});
	const replayName = useEffectEvent(() => replay());
	useEffect(() => {
		const timer = window.setTimeout(() => replayName(), NAME_SCRAMBLE_DELAY_MS);
		return () => window.clearTimeout(timer);
	}, []);
	return <span ref={ref}>{name}</span>;
}

export function HeroAvatarDemo() {
	const { name, setName } = useLandingName();
	const deckRef = useRef<HTMLElement | null>(null);
	const animationsRef = useRef<Animation[]>([]);
	const [activeIndex, setActiveIndex] = useState(0);
	const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
	const [scramble, setScramble] = useState(false);
	const [paused, setPaused] = useState<boolean | null>(null);
	const [reducedMotion, setReducedMotion] = useState(true);
	const [inView, setInView] = useState(false);
	const [documentVisible, setDocumentVisible] = useState(true);
	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [announcement, setAnnouncement] = useState("");
	const customName = name.trim();
	const personalized = customName.length > 0;
	const isPaused = paused ?? (reducedMotion || personalized);
	const interactionPaused = paused !== false && (hovered || focused);
	const isAnimating = outgoingIndex !== null;
	const activePreset = HERO_AVATAR_PRESETS[activeIndex];
	const activeAvatar: HeroAvatarValue = {
		frame: "square",
		name: customName || activePreset.name,
		palette: activePreset.palette,
	};

	const settleTransition = useCallback(() => {
		cancelAnimations(animationsRef.current);
		setOutgoingIndex(null);
	}, []);
	const stopMotion = useCallback(() => {
		settleTransition();
		setScramble(false);
	}, [settleTransition]);

	const advance = useCallback(
		(animate = true, announce = false) => {
			const deck = deckRef.current;
			if (animationsRef.current.length > 0 || !deck) {
				return;
			}
			const nextIndex = (activeIndex + 1) % HERO_AVATAR_PRESETS.length;
			const shouldAnimate = animate && !reducedMotion;
			setActiveIndex(nextIndex);
			setScramble(shouldAnimate);
			if (announce) {
				const next = HERO_AVATAR_PRESETS[nextIndex];
				setAnnouncement(
					`${customName || next.name}, ${next.label} palette, ${nextIndex + 1} of ${HERO_AVATAR_PRESETS.length}.`
				);
			}
			if (!shouldAnimate || typeof deck.animate !== "function") {
				return;
			}
			setOutgoingIndex(activeIndex);
			const easing = getComputedStyle(deck)
				.getPropertyValue("--ease-in-out")
				.trim();
			for (const [index, card] of deck
				.querySelectorAll<HTMLElement>("[data-profile-card]")
				.entries()) {
				const frames: Keyframe[] = [
					getCardFrame(getDepth(index, activeIndex)),
					getCardFrame(getDepth(index, nextIndex)),
				];
				if (index === activeIndex) {
					frames.splice(
						1,
						0,
						{
							offset: 0.38,
							opacity: 1,
							transform: "translate3d(2%, 24%, 30px) rotate(2deg)",
						},
						{
							offset: 0.64,
							opacity: 0,
							transform: "translate3d(1%, 18%, -300px) rotate(1deg)",
						}
					);
				}
				const animation = card.animate(frames, {
					duration: SWITCH_DURATION_MS,
					easing,
					fill: "both",
				});
				animationsRef.current.push(animation);
				if (index === activeIndex) {
					animation.addEventListener("finish", settleTransition, {
						once: true,
					});
				}
			}
		},
		[activeIndex, customName, reducedMotion, settleTransition]
	);

	useEffect(() => {
		const media = window.matchMedia(REDUCED_MOTION_QUERY);
		const updateMotion = () => {
			setReducedMotion(media.matches);
			if (media.matches) {
				setPaused(null);
			}
		};
		const updateVisibility = () => setDocumentVisible(!document.hidden);
		updateMotion();
		updateVisibility();
		media.addEventListener("change", updateMotion);
		document.addEventListener("visibilitychange", updateVisibility);
		return () => {
			media.removeEventListener("change", updateMotion);
			document.removeEventListener("visibilitychange", updateVisibility);
		};
	}, []);
	const observeDeck = useCallback((deck: HTMLElement | null) => {
		if (!deck) {
			return;
		}
		deckRef.current = deck;
		const observer = new IntersectionObserver(
			([entry]) => setInView(entry.isIntersecting),
			{ threshold: 0.25 }
		);
		observer.observe(deck);
		return () => {
			observer.disconnect();
			deckRef.current = null;
		};
	}, []);
	useEffect(() => {
		if (!(documentVisible && inView) || reducedMotion) {
			stopMotion();
		}
	}, [documentVisible, inView, reducedMotion, stopMotion]);
	useEffect(() => {
		if (
			isPaused ||
			interactionPaused ||
			menuOpen ||
			isAnimating ||
			!inView ||
			!documentVisible
		) {
			return;
		}
		const timer = window.setTimeout(() => advance(), HOLD_DURATION_MS);
		return () => window.clearTimeout(timer);
	}, [
		advance,
		documentVisible,
		interactionPaused,
		inView,
		isAnimating,
		isPaused,
		menuOpen,
	]);
	useEffect(() => {
		const animations = animationsRef.current;
		return () => cancelAnimations(animations);
	}, []);

	const handleNameChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			stopMotion();
			setName(event.currentTarget.value);
			setPaused(null);
		},
		[setName, stopMotion]
	);
	const handleReset = useCallback(() => {
		stopMotion();
		setName("");
		setPaused(null);
	}, [setName, stopMotion]);
	const handleNext = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => advance(event.detail !== 0, true),
		[advance]
	);
	const handlePause = useCallback(() => setPaused(!isPaused), [isPaused]);
	const handlePointerEnter = useCallback((event: PointerEvent<HTMLElement>) => {
		if (
			event.pointerType !== "touch" &&
			window.matchMedia(HOVER_QUERY).matches
		) {
			setHovered(true);
		}
	}, []);
	const handlePointerLeave = useCallback(() => setHovered(false), []);
	const handleFocus = useCallback(
		(event: FocusEvent<HTMLElement>) => {
			setFocused(true);
			if (event.target instanceof HTMLInputElement) {
				setPaused(null);
				stopMotion();
			}
		},
		[stopMotion]
	);
	const handleBlur = useCallback((event: FocusEvent<HTMLElement>) => {
		if (!event.currentTarget.contains(event.relatedTarget)) {
			setFocused(false);
		}
	}, []);
	const handleMenuOpenChange = useCallback(
		(open: boolean) => {
			if (open) {
				stopMotion();
			}
			setMenuOpen(open);
		},
		[stopMotion]
	);

	return (
		<div
			className={styles.demo}
			id="profile-stack"
			onBlurCapture={handleBlur}
			onFocusCapture={handleFocus}
			onPointerEnter={handlePointerEnter}
			onPointerLeave={handlePointerLeave}
		>
			<div className={styles.stage}>
				<section
					aria-label="Avatar preview"
					aria-live="off"
					aria-roledescription="carousel"
					className={styles.deck}
					ref={observeDeck}
				>
					{HERO_AVATAR_PRESETS.map((preset, index) => {
						const depth = getDepth(index, activeIndex);
						const active = depth === 0;
						const avatarName = customName || preset.name;
						return (
							<article
								aria-hidden={!active}
								className={styles.card}
								data-profile-card={preset.id}
								data-revealed={active || outgoingIndex === index}
								key={preset.id}
								style={{
									backgroundColor: preset.palette[0],
									opacity: depth < VISIBLE_CARD_COUNT ? 1 : 0,
									transform: getCardFrame(depth).transform,
								}}
							>
								<div className={styles.cardContent}>
									<div className={styles.cardHeader}>
										<h2 className={styles.name} title={avatarName}>
											<span aria-hidden="true">
												{active && scramble ? (
													<ScrambledName name={avatarName} />
												) : (
													avatarName
												)}
											</span>
											<span className="sr-only">{avatarName}</span>
										</h2>
										<span aria-hidden="true" className={styles.counter}>
											{String(index + 1).padStart(2, "0")}
											<span className={styles.counterTotal}> / 05</span>
										</span>
									</div>
									<Avatar
										alt=""
										className={styles.avatar}
										frame="square"
										name={avatarName}
										palette={preset.palette}
										size="100%"
									/>
									<div className={styles.cardFooter}>
										<span className={styles.paletteLabel}>
											<span
												aria-hidden="true"
												className={styles.paletteDot}
												style={{ backgroundColor: preset.palette[1] }}
											/>
											{preset.label} palette
										</span>
										<span aria-hidden="true" className={styles.wordmark}>
											blobz
										</span>
									</div>
								</div>
							</article>
						);
					})}
				</section>
			</div>
			<div className={styles.dock}>
				<FieldGroup className={styles.nameRow}>
					<Field orientation="horizontal">
						<FieldLabel className={styles.inputLabel} htmlFor="hero-name">
							Your name
						</FieldLabel>
						<InputGroup className={styles.nameInput}>
							<InputGroupInput
								autoCapitalize="none"
								autoComplete="off"
								enterKeyHint="done"
								id="hero-name"
								maxLength={42}
								name="name"
								onChange={handleNameChange}
								placeholder="Try it here…"
								spellCheck={false}
								value={name}
							/>
							{personalized ? (
								<InputGroupAddon align="inline-end">
									<InputGroupButton
										aria-label="Return to example avatars"
										className={styles.resetButton}
										onClick={handleReset}
										size="icon-sm"
										title="Return to examples"
									>
										<RotateCcw aria-hidden="true" />
									</InputGroupButton>
								</InputGroupAddon>
							) : null}
						</InputGroup>
					</Field>
				</FieldGroup>
				<div className={styles.toolbar}>
					<div className={styles.browseControls}>
						<Button
							aria-label={
								isPaused ? "Play avatar rotation" : "Pause avatar rotation"
							}
							className={styles.iconButton}
							onClick={handlePause}
							size="icon"
							title={
								isPaused ? "Play avatar rotation" : "Pause avatar rotation"
							}
							variant="ghost"
						>
							{isPaused ? (
								<Play aria-hidden="true" />
							) : (
								<Pause aria-hidden="true" />
							)}
						</Button>
						<Button
							aria-disabled={isAnimating}
							className={styles.nextButton}
							onClick={handleNext}
							variant="ghost"
						>
							Next look
							<ArrowDownRight aria-hidden="true" data-icon="inline-end" />
						</Button>
					</div>
					<HeroAvatarExports
						onMenuOpenChange={handleMenuOpenChange}
						value={activeAvatar}
					/>
				</div>
			</div>
			<p aria-atomic="true" className="sr-only" role="status">
				{announcement}
			</p>
		</div>
	);
}
