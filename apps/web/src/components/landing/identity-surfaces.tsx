"use client";

import { Avatar } from "@blobz/react";
import { Input } from "@blobz/ui/components/input";
import { AtSign, Heart, MessageCircle, Send, Sparkles } from "lucide-react";
import {
	type ChangeEvent,
	type CSSProperties,
	useCallback,
	useState,
} from "react";

import styles from "@/app/landing.module.css";
import {
	DEFAULT_HOME_NAME,
	useLandingName,
} from "@/components/landing/landing-name";
import { DEMO_PEOPLE, getFirstName } from "@/lib/demo-people";

const SURFACE_CARD_CLASS =
	"relative min-w-0 border border-[rgb(201_230_245_/_92%)] bg-white/92 shadow-[0_24px_70px_rgb(14_87_120_/_15%)] backdrop-blur-2xl";
const SURFACE_KICKER_CLASS =
	"text-[0.62rem] font-[850] uppercase tracking-[0.13em] text-[#74849a]";

const PALETTES = [
	["#e8f7ff", "#38bdf8"],
	["#fff7ed", "#fb923c"],
	["#f0fdf4", "#4ade80"],
	["#faf5ff", "#c084fc"],
	["#fff1f2", "#fb7185"],
] as const;

const TEAM = [
	{ name: getFirstName(DEMO_PEOPLE.janakiAmmal), palette: PALETTES[0] },
	{ name: getFirstName(DEMO_PEOPLE.vikramSarabhai), palette: PALETTES[1] },
	{ name: getFirstName(DEMO_PEOPLE.kalpanaChawla), palette: PALETTES[2] },
	{ name: getFirstName(DEMO_PEOPLE.srinivasaRamanujan), palette: PALETTES[3] },
] as const;

const SECONDARY_ACTIVITY = [
	{
		action: "joined the tiny-wins channel",
		id: "kalpana-joined",
		name: getFirstName(DEMO_PEOPLE.kalpanaChawla),
		palette: PALETTES[1],
		time: "12m",
	},
	{
		action: "remixed a new palette",
		id: "vikram-remixed",
		name: getFirstName(DEMO_PEOPLE.vikramSarabhai),
		palette: PALETTES[3],
		time: "28m",
	},
] as const;
const WHITESPACE_PATTERN = /\s+/;

export function IdentitySurfaces() {
	const { name, setName } = useLandingName();
	const [paletteIndex, setPaletteIndex] = useState<number | null>(0);
	const [customPalette, setCustomPalette] = useState<readonly [string, string]>(
		["#e8f7ff", "#38bdf8"]
	);
	const palette =
		paletteIndex === null
			? customPalette
			: (PALETTES[paletteIndex] ?? PALETTES[0]);
	const avatarName = name.trim() || DEFAULT_HOME_NAME;
	const firstName = avatarName.split(WHITESPACE_PATTERN)[0] ?? "Blobz";
	const handleNameChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setName(event.target.value);
		},
		[setName]
	);
	const handlePaletteChange = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			const nextIndex = Number(event.currentTarget.dataset.paletteIndex);
			if (Number.isInteger(nextIndex)) {
				setPaletteIndex(nextIndex);
			}
		},
		[]
	);
	const handleCustomColorChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const slot = event.currentTarget.dataset.paletteSlot;
			const color = event.currentTarget.value;
			setCustomPalette(([background, body]) =>
				slot === "background" ? [color, body] : [background, color]
			);
			setPaletteIndex(null);
		},
		[]
	);
	const canvasStyle = {
		"--surface-accent": palette[1],
		"--surface-soft": palette[0],
	} as CSSProperties;
	const activityItems = [
		{
			action: "shipped a new profile",
			id: "profile-shipped",
			name: firstName,
			palette,
			time: "now",
		},
		...SECONDARY_ACTIVITY,
	];

	return (
		<div className="flex flex-col overflow-hidden rounded-[2rem] border border-[#d8eef9] bg-[#f1faff] shadow-[0_40px_120px_rgb(14_165_233_/_12%)] max-[640px]:rounded-[1.4rem] max-[820px]:rounded-[1.65rem]">
			<div className="relative z-10 mx-[clamp(1rem,3vw,2.5rem)] mt-[clamp(1rem,2.5vw,1.75rem)] mb-[-1.25rem] grid grid-cols-[minmax(14rem,0.9fr)_auto] items-center gap-6 rounded-[1.35rem] border border-[#c7e5f5] bg-white/90 p-3 shadow-[0_18px_45px_rgb(20_113_153_/_14%)] backdrop-blur-xl max-[640px]:mx-3 max-[640px]:mt-3 max-[640px]:mb-[-0.6rem] max-[740px]:grid-cols-1 max-[740px]:gap-4 max-[640px]:rounded-[1.05rem]">
				<label
					className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 font-extrabold text-[#4d6078] text-[0.68rem] max-[480px]:grid-cols-1 max-[480px]:gap-1.5"
					htmlFor="surface-name"
				>
					<span className="whitespace-nowrap pl-1">Name or seed</span>
					<Input
						className="h-11 min-w-0 rounded-[0.8rem] border border-[#bfe1f2] bg-[#f8fcff] px-3.5 font-bold text-[#0b1830] text-sm shadow-[inset_0_1px_2px_rgb(11_24_48_/_3%)] outline-none focus:border-[#38bdf8] focus:bg-white focus:shadow-[0_0_0_4px_rgb(56_189_248_/_13%)]"
						id="surface-name"
						maxLength={42}
						onChange={handleNameChange}
						placeholder="Your name"
						value={name}
					/>
				</label>
				<fieldset className="m-0 border-0 max-[740px]:pl-1">
					<legend className="sr-only">Palette</legend>
					<div className="flex flex-wrap items-center justify-end gap-[0.55rem] max-[740px]:justify-start">
						<span className="mr-1 font-extrabold text-[#4d6078] text-[0.68rem]">
							Palette
						</span>
						{PALETTES.map((option, index) => (
							<button
								aria-label={`Use palette ${index + 1}`}
								aria-pressed={paletteIndex === index}
								className="size-8 rounded-full border-[3px] border-white shadow-[0_0_0_1px_#cee9f7] transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 active:scale-[0.92] aria-pressed:shadow-[0_0_0_2px_#0ea5e9,0_5px_15px_rgb(14_165_233_/_20%)] motion-reduce:transition-none"
								data-palette-index={index}
								key={option[1]}
								onClick={handlePaletteChange}
								style={{
									background: `linear-gradient(135deg, ${option[0]} 50%, ${option[1]} 50%)`,
								}}
								type="button"
							/>
						))}
						<div
							className="ml-[0.1rem] flex items-center gap-[0.4rem] border-[#cfe6f3] border-l pl-[0.65rem] data-[active=true]:text-sky-600"
							data-active={paletteIndex === null}
						>
							<span className="mr-[0.15rem] font-[750] text-[#718298] text-[0.62rem]">
								Custom
							</span>
							<input
								aria-label="Custom background colour"
								className={`${styles.customColorInput} size-8 cursor-pointer appearance-none overflow-hidden rounded-full border-[3px] border-white bg-white p-0 shadow-[0_0_0_1px_#cee9f7] transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:scale-[1.06] focus-visible:shadow-[0_0_0_2px_#0ea5e9,0_5px_15px_rgb(14_165_233_/_20%)] focus-visible:outline-none active:scale-[0.92] motion-reduce:transition-none`}
								data-palette-slot="background"
								onChange={handleCustomColorChange}
								type="color"
								value={customPalette[0]}
							/>
							<input
								aria-label="Custom body colour"
								className={`${styles.customColorInput} size-8 cursor-pointer appearance-none overflow-hidden rounded-full border-[3px] border-white bg-white p-0 shadow-[0_0_0_1px_#cee9f7] transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:scale-[1.06] focus-visible:shadow-[0_0_0_2px_#0ea5e9,0_5px_15px_rgb(14_165_233_/_20%)] focus-visible:outline-none active:scale-[0.92] motion-reduce:transition-none`}
								data-palette-slot="body"
								onChange={handleCustomColorChange}
								type="color"
								value={customPalette[1]}
							/>
						</div>
					</div>
				</fieldset>
			</div>

			<div
				className={`${styles.surfaceCanvas} relative grid min-w-0 grid-cols-[minmax(15.5rem,0.8fr)_minmax(24rem,1.2fr)] grid-rows-[minmax(16rem,auto)_auto] gap-x-7 gap-y-8 p-[clamp(2.7rem,5vw,4.25rem)_clamp(1.5rem,3.6vw,3rem)_clamp(1.5rem,3.6vw,3rem)] max-[1050px]:grid-cols-[minmax(14rem,0.8fr)_minmax(20rem,1.2fr)] max-[640px]:grid-cols-[minmax(0,1fr)] max-[820px]:grid-cols-[minmax(13rem,0.8fr)_minmax(18rem,1.2fr)] max-[640px]:grid-rows-[auto] max-[640px]:gap-[0.85rem] max-[640px]:p-[1.8rem_1rem_1rem] max-[820px]:px-6 max-[820px]:pb-6`}
				style={canvasStyle}
			>
				<article
					className={`${styles.translucentSurface} ${SURFACE_CARD_CLASS} max-[640px]:translate-0 col-start-1 row-start-1 translate-x-1 translate-y-2 rotate-[-1.1deg] overflow-hidden rounded-3xl max-[640px]:col-start-1 max-[640px]:row-auto max-[640px]:w-full max-[640px]:rotate-0`}
				>
					<div className={styles.profileBanner} />
					<div className="absolute top-13 left-[1.35rem] rounded-[1.35rem] bg-white p-[0.35rem] shadow-[0_8px_25px_rgb(15_23_42_/_16%)] max-[640px]:top-11 [&_img]:block">
						<Avatar
							alt={`${avatarName}'s Blobz avatar`}
							name={avatarName}
							palette={palette}
							size={88}
						/>
					</div>
					<div className="px-[1.35rem] pt-[3.4rem] pb-[1.35rem]">
						<span className={SURFACE_KICKER_CLASS}>Profile</span>
						<h3 className="mt-[0.35rem] font-[900] text-[1.2rem] tracking-[-0.03em]">
							{avatarName}
						</h3>
						<p className="mt-[0.4rem] text-[#65758b] text-[0.78rem] leading-[1.55]">
							Designing friendly things for the internet.
						</p>
						<div className="mt-5 flex gap-4 text-[#728198] text-[0.65rem] [&_strong]:text-[#0b1830]">
							<span>
								<strong>248</strong> posts
							</span>
							<span>
								<strong>12.8k</strong> friends
							</span>
						</div>
					</div>
				</article>

				<article className="max-[640px]:translate-0 relative col-start-2 row-start-1 -translate-y-1 rotate-[0.8deg] overflow-hidden rounded-[1.8rem] border border-white/12 bg-[#0b1830] p-[1.4rem] text-white shadow-[0_28px_80px_rgb(11_24_48_/_28%)] before:absolute before:-right-16 before:-bottom-24 before:size-68 before:rotate-[18deg] before:rounded-[46%_54%_65%_35%] before:bg-[var(--surface-accent)] before:opacity-[0.17] before:blur-[1px] max-[640px]:col-start-1 max-[640px]:row-auto max-[640px]:w-full max-[640px]:rotate-0 max-[640px]:p-4">
					<div className="relative flex items-center justify-between text-[#a7dffb]">
						<span className={`${SURFACE_KICKER_CLASS} text-[#a7dffb]`}>
							Social card
						</span>
						<Sparkles aria-hidden="true" className="size-4" />
					</div>
					<div className="relative grid min-h-48 grid-cols-[auto_1fr] items-center gap-[1.1rem] max-[640px]:min-h-[10.5rem]">
						<div className="max-[640px]:[&_img]:!h-auto max-[640px]:[&_img]:!w-full rotate-[-4deg] rounded-[1.7rem] border border-white/18 bg-white/10 p-[0.35rem] max-[640px]:w-19 [&_img]:block">
							<Avatar alt="" name={avatarName} palette={palette} size={104} />
						</div>
						<div>
							<p className="text-[#8ec9e7] text-[0.78rem]">Say hello to</p>
							<h3 className="mt-[0.3rem] max-w-68 font-[900] text-[clamp(1.5rem,3vw,2.25rem)] leading-none tracking-[-0.055em] max-[640px]:text-[1.45rem]">
								{firstName}&apos;s tiny internet face.
							</h3>
						</div>
					</div>
					<div className="relative flex items-center justify-between font-mono text-[#7aa2b9] text-[0.58rem]">
						<span>Made to match your palette.</span>
						<span>1200 × 630</span>
					</div>
				</article>

				<article
					className={`${styles.translucentSurface} ${SURFACE_CARD_CLASS} max-[640px]:translate-0 col-start-1 row-start-2 translate-x-2 rotate-[-0.7deg] overflow-hidden rounded-[1.25rem] p-4 max-[640px]:col-start-1 max-[640px]:row-auto max-[640px]:w-full max-[640px]:rotate-0`}
				>
					<div className="flex items-center justify-between border-[#d9ebf4] border-b pb-3">
						<span className={SURFACE_KICKER_CLASS}>Recent activity</span>
						<div className="flex gap-2 text-[#8091a7]">
							<Heart aria-hidden="true" className="size-3.5" />
							<MessageCircle aria-hidden="true" className="size-3.5" />
						</div>
					</div>
					<ul className="divide-y divide-[#e5f1f7]">
						{activityItems.map((item) => (
							<li
								className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 py-3 first:pt-3 last:pb-0"
								key={item.id}
							>
								<Avatar
									alt=""
									className="rounded-[0.68rem] ring-1 ring-[#c6e0ed]"
									name={item.name}
									palette={item.palette}
									size={36}
								/>
								<p className="min-w-0 text-[#6b7a8f] text-[0.68rem] leading-[1.4]">
									<strong className="text-[#0b1830]">{item.name}</strong>{" "}
									{item.action}
								</p>
								<time className="text-[#8b9aae] text-[0.58rem]">
									{item.time}
								</time>
							</li>
						))}
					</ul>
				</article>

				<article
					className={`${styles.translucentSurface} ${SURFACE_CARD_CLASS} max-[640px]:translate-0 col-start-2 row-start-2 -translate-x-1 translate-y-1 rotate-[0.55deg] rounded-[1.4rem] p-[1.2rem] max-[640px]:col-start-1 max-[640px]:row-auto max-[640px]:w-full max-[640px]:rotate-0`}
				>
					<div className="flex items-center justify-between border-[#e4f1f7] border-b pb-[0.9rem]">
						<div className="flex flex-col gap-[0.2rem]">
							<span className={SURFACE_KICKER_CLASS}>Team chat</span>
							<strong className="text-[0.9rem]"># tiny-wins</strong>
						</div>
						<div className="flex pl-2">
							{TEAM.map((member) => (
								<Avatar
									alt=""
									className="-ml-2 rounded-[0.55rem] border-2 border-white shadow-[0_2px_8px_rgb(11_24_48_/_14%)] ring-1 ring-[#aacfe2]"
									key={member.name}
									name={member.name}
									palette={member.palette}
									size={28}
								/>
							))}
						</div>
					</div>
					<div className="my-4 grid grid-cols-[auto_1fr] items-center gap-[0.65rem]">
						<Avatar
							alt=""
							className="rounded-[0.7rem]"
							name={avatarName}
							palette={palette}
							size={36}
						/>
						<div>
							<strong className="text-[0.7rem]">{avatarName}</strong>
							<p className="mt-[0.15rem] text-[#748399] text-[0.7rem]">
								These colors fit right in.
							</p>
						</div>
					</div>
					<div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-[0.8rem] border border-[#e1eef5] bg-[#f2f8fb] px-3 py-[0.7rem] text-[#8391a4] text-[0.65rem]">
						<AtSign aria-hidden="true" className="size-4" />
						<span>Message the team</span>
						<Send aria-hidden="true" className="size-4" />
					</div>
				</article>
			</div>
		</div>
	);
}
