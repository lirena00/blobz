import { type AvatarPalette, makeAvatar } from "@blobz/avatar-core";
import { ImageResponse } from "next/og";

const OG_SIZE = {
	height: 630,
	width: 1200,
} as const;

const OG_PALETTES = [
	["#e8f7ff", "#38bdf8"],
	["#fff7ed", "#fb7185"],
	["#faf5ff", "#c084fc"],
] as const satisfies readonly AvatarPalette[];

interface BlobzOgImageProps {
	readonly description: string;
	readonly eyebrow: string;
	readonly seed: string;
	readonly title: string;
}

const createAvatarSource = (seed: string, palette: AvatarPalette): string => {
	const avatar = makeAvatar(seed, palette, "rounded");
	return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(avatar.svg)}`;
};

export function BlobzOgImage({
	description,
	eyebrow,
	seed,
	title,
}: BlobzOgImageProps) {
	const avatarSources = OG_PALETTES.map((palette, index) =>
		createAvatarSource(`${seed}-${index}`, palette)
	);
	const titleFontSize = title.length > 44 ? 58 : 72;

	return (
		<div
			style={{
				alignItems: "stretch",
				background: "#eaf8ff",
				color: "#0b1830",
				display: "flex",
				fontFamily: "sans-serif",
				height: "100%",
				overflow: "hidden",
				padding: "64px",
				position: "relative",
				width: "100%",
			}}
		>
			<div
				style={{
					background: "#22d3ee",
					borderRadius: "999px",
					display: "flex",
					height: "330px",
					left: "-210px",
					opacity: 0.82,
					position: "absolute",
					top: "180px",
					width: "330px",
				}}
			/>
			<div
				style={{
					background: "#fb7185",
					borderRadius: "999px",
					display: "flex",
					height: "280px",
					opacity: 0.24,
					position: "absolute",
					right: "-90px",
					top: "-100px",
					width: "280px",
				}}
			/>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: "10px 0",
					width: "650px",
				}}
			>
				<div
					style={{
						alignItems: "center",
						display: "flex",
						gap: "12px",
					}}
				>
					<div
						style={{
							background: "#0b1830",
							borderRadius: "999px",
							display: "flex",
							height: "16px",
							width: "16px",
						}}
					/>
					<span
						style={{
							fontSize: "20px",
							fontWeight: 800,
							letterSpacing: "0.14em",
							textTransform: "uppercase",
						}}
					>
						{eyebrow}
					</span>
				</div>
				<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
					<h1
						style={{
							fontSize: `${titleFontSize}px`,
							fontWeight: 850,
							letterSpacing: "-0.055em",
							lineHeight: 0.94,
							margin: 0,
						}}
					>
						{title}
					</h1>
					<p
						style={{
							color: "#526880",
							fontSize: "26px",
							lineHeight: 1.35,
							margin: 0,
							maxWidth: "620px",
						}}
					>
						{description}
					</p>
				</div>
				<div
					style={{
						alignItems: "center",
						display: "flex",
						fontSize: "22px",
						fontWeight: 800,
						gap: "10px",
					}}
				>
					<span>blobz.dev</span>
					<span style={{ color: "#38bdf8" }}>→</span>
					<span style={{ color: "#526880" }}>same seed, same face</span>
				</div>
			</div>

			<div
				style={{
					background: "#071426",
					border: "1px solid rgba(11, 24, 48, 0.1)",
					borderRadius: "52px",
					boxShadow: "0 35px 90px rgba(14, 116, 144, 0.18)",
					display: "flex",
					height: "502px",
					marginLeft: "auto",
					overflow: "hidden",
					position: "relative",
					width: "390px",
				}}
			>
				<div
					style={{
						background: "#38bdf8",
						borderRadius: "999px",
						display: "flex",
						height: "250px",
						left: "-145px",
						opacity: 0.9,
						position: "absolute",
						top: "205px",
						width: "250px",
					}}
				/>
				<div
					style={{
						alignItems: "center",
						background: "#ffffff",
						border: "2px solid #d5edf9",
						borderRadius: "44px",
						display: "flex",
						height: "264px",
						justifyContent: "center",
						left: "76px",
						position: "absolute",
						top: "105px",
						transform: "rotate(5deg)",
						width: "264px",
					}}
				>
					{/* biome-ignore lint/performance/noImgElement: next/og renders images through Satori, not the browser. */}
					<img
						alt=""
						height={224}
						src={avatarSources[1]}
						style={{ borderRadius: "34px" }}
						width={224}
					/>
				</div>
				<div
					style={{
						alignItems: "center",
						background: "#ffffff",
						border: "2px solid #d5edf9",
						borderRadius: "30px",
						display: "flex",
						height: "138px",
						justifyContent: "center",
						left: "-28px",
						position: "absolute",
						top: "36px",
						transform: "rotate(-8deg)",
						width: "138px",
					}}
				>
					{/* biome-ignore lint/performance/noImgElement: next/og renders images through Satori, not the browser. */}
					<img
						alt=""
						height={112}
						src={avatarSources[0]}
						style={{ borderRadius: "24px" }}
						width={112}
					/>
				</div>
				<div
					style={{
						alignItems: "center",
						background: "#ffffff",
						border: "2px solid #d5edf9",
						borderRadius: "28px",
						display: "flex",
						height: "124px",
						justifyContent: "center",
						position: "absolute",
						right: "-32px",
						top: "354px",
						transform: "rotate(10deg)",
						width: "124px",
					}}
				>
					{/* biome-ignore lint/performance/noImgElement: next/og renders images through Satori, not the browser. */}
					<img
						alt=""
						height={100}
						src={avatarSources[2]}
						style={{ borderRadius: "22px" }}
						width={100}
					/>
				</div>
			</div>
		</div>
	);
}

export const createBlobzOgImage = (props: BlobzOgImageProps): ImageResponse =>
	new ImageResponse(<BlobzOgImage {...props} />, {
		height: OG_SIZE.height,
		width: OG_SIZE.width,
	});

export { OG_SIZE };
