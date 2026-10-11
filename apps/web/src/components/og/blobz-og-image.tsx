import { type AvatarPalette, makeAvatar } from "@blobz/avatar-core";
import { ImageResponse } from "next/og";

const OG_SIZE = {
	height: 630,
	width: 1200,
} as const;

const BRICOLAGE_GROTESQUE_URL =
	"https://fonts.gstatic.com/s/bricolagegrotesque/v9/3y9U6as8bTXq_nANBjzKo3IeZx8z6up5BeSl5jBNz_19PpbpMXuECpwUxJBOm_OJWiaaD30YfKfjZZoLvZvlyM0.ttf";

const OG_AVATARS = [
	{
		borderRadius: "31% 27% 34% 24%",
		palette: ["#e8f7ff", "#38bdf8"],
		position: { left: 791, top: 89 },
		rotation: -7,
		size: 118,
	},
	{
		borderRadius: "24% 35% 27% 32%",
		palette: ["#fff7ed", "#fb923c"],
		position: { left: 934, top: 162 },
		rotation: 6,
		size: 202,
	},
	{
		borderRadius: "29% 23% 32% 26%",
		palette: ["#faf5ff", "#c084fc"],
		position: { left: 1067, top: -42 },
		rotation: 10,
		size: 137,
	},
	{
		borderRadius: "25% 31% 24% 35%",
		palette: ["#f0fdf4", "#4ade80"],
		position: { left: 846, top: 406 },
		rotation: -5,
		size: 138,
	},
	{
		borderRadius: "34% 25% 29% 23%",
		palette: ["#fff1f2", "#fb7185"],
		position: { left: 1041, top: 426 },
		rotation: 8,
		size: 108,
	},
] as const satisfies readonly {
	readonly borderRadius: string;
	readonly palette: AvatarPalette;
	readonly position: { readonly left: number; readonly top: number };
	readonly rotation: number;
	readonly size: number;
}[];

interface AvatarTileProps {
	readonly borderRadius: string;
	readonly palette: AvatarPalette;
	readonly position: { readonly left: number; readonly top: number };
	readonly rotation: number;
	readonly seed: string;
	readonly size: number;
}

interface BlobzOgImageProps {
	readonly description: string;
	readonly seed: string;
	readonly title: string;
}

const createAvatarSource = (seed: string, palette: AvatarPalette): string => {
	const avatar = makeAvatar(seed, palette, "rounded");
	return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(avatar.svg)}`;
};

const getTitleFontSize = (title: string): number => {
	if (title.length > 72) {
		return 51;
	}
	if (title.length > 52) {
		return 58;
	}
	if (title.length > 34) {
		return 67;
	}
	return 78;
};

function AvatarTile({
	borderRadius,
	palette,
	position,
	rotation,
	seed,
	size,
}: AvatarTileProps) {
	const imageSize = size - 14;
	const source = createAvatarSource(seed, palette);

	return (
		<div
			style={{
				alignItems: "center",
				background: "rgba(255, 255, 255, 0.88)",
				border: "1px solid rgba(186, 230, 253, 0.95)",
				borderRadius,
				boxShadow:
					"inset 0 1px 0 rgba(255, 255, 255, 0.96), 0 22px 52px rgba(14, 165, 233, 0.18)",
				display: "flex",
				height: `${size}px`,
				justifyContent: "center",
				left: `${position.left}px`,
				padding: "7px",
				position: "absolute",
				top: `${position.top}px`,
				transform: `rotate(${rotation}deg)`,
				width: `${size}px`,
			}}
		>
			{/* biome-ignore lint/performance/noImgElement: next/og renders images through Satori, not the browser. */}
			<img
				alt=""
				height={imageSize}
				src={source}
				style={{ borderRadius: "22%" }}
				width={imageSize}
			/>
		</div>
	);
}

export function BlobzOgImage({ description, seed, title }: BlobzOgImageProps) {
	const brandAvatarSource = createAvatarSource("blobz", ["#eef9ff", "#38bdf8"]);

	return (
		<div
			style={{
				background:
					"radial-gradient(circle at 51% 42%, #ffffff 0, #ffffff 150px, rgba(255, 255, 255, 0) 370px), radial-gradient(circle at 5% 2%, rgba(186, 230, 253, 0.82), rgba(186, 230, 253, 0) 320px), radial-gradient(circle at 96% 12%, rgba(224, 242, 254, 0.95), rgba(224, 242, 254, 0) 350px), linear-gradient(180deg, #fbfeff 0%, #eaf7ff 100%)",
				color: "#0b1830",
				display: "flex",
				fontFamily: "Arial, sans-serif",
				height: "100%",
				overflow: "hidden",
				position: "relative",
				width: "100%",
			}}
		>
			<div
				style={{
					backgroundImage:
						"linear-gradient(rgba(14, 165, 233, 0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.055) 1px, transparent 1px)",
					backgroundSize: "64px 64px",
					display: "flex",
					inset: 0,
					maskImage:
						"radial-gradient(circle at 53% 48%, black, transparent 82%)",
					position: "absolute",
				}}
			/>

			<div
				style={{
					background:
						"radial-gradient(circle, rgba(56, 189, 248, 0.24), rgba(56, 189, 248, 0) 68%)",
					display: "flex",
					height: "560px",
					position: "absolute",
					right: "-80px",
					top: "20px",
					width: "560px",
				}}
			/>

			{OG_AVATARS.map((avatar, index) => (
				<AvatarTile
					borderRadius={avatar.borderRadius}
					key={`${avatar.position.left}-${avatar.position.top}`}
					palette={avatar.palette}
					position={avatar.position}
					rotation={avatar.rotation}
					seed={`${seed}-swarm-${index}`}
					size={avatar.size}
				/>
			))}

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
					padding: "43px 50px 39px",
					position: "relative",
					width: "100%",
				}}
			>
				<div
					style={{
						alignItems: "center",
						display: "flex",
						width: "100%",
					}}
				>
					<div style={{ alignItems: "center", display: "flex", gap: "11px" }}>
						<div
							style={{
								alignItems: "center",
								background: "rgba(255, 255, 255, 0.86)",
								border: "1px solid #d3edf9",
								borderRadius: "50%",
								display: "flex",
								height: "46px",
								justifyContent: "center",
								padding: "3px",
								width: "46px",
							}}
						>
							{/* biome-ignore lint/performance/noImgElement: next/og renders images through Satori, not the browser. */}
							<img
								alt=""
								height={38}
								src={brandAvatarSource}
								style={{ borderRadius: "50%" }}
								width={38}
							/>
						</div>
						<span
							style={{
								fontFamily: "Bricolage Grotesque",
								fontSize: "28px",
								fontWeight: 800,
								letterSpacing: "-0.045em",
							}}
						>
							blobz
						</span>
					</div>
				</div>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						marginTop: "77px",
						maxWidth: "760px",
					}}
				>
					<div
						style={{
							background: "#0ea5e9",
							borderRadius: "999px",
							display: "flex",
							height: "6px",
							marginBottom: "19px",
							width: "52px",
						}}
					/>
					<h1
						style={{
							fontFamily: "Bricolage Grotesque",
							fontSize: `${getTitleFontSize(title)}px`,
							fontWeight: 800,
							letterSpacing: "-0.062em",
							lineHeight: 0.93,
							margin: 0,
							maxWidth: "750px",
						}}
					>
						{title}
					</h1>
					<p
						style={{
							color: "#60708a",
							fontSize: "22px",
							fontWeight: 500,
							letterSpacing: "-0.015em",
							lineHeight: 1.45,
							margin: "21px 0 0",
							maxWidth: "670px",
						}}
					>
						{description}
					</p>
				</div>

				<div
					style={{
						alignItems: "center",
						display: "flex",
						justifyContent: "space-between",
						marginTop: "auto",
						width: "100%",
					}}
				>
					<div
						style={{
							alignItems: "center",
							color: "#526880",
							display: "flex",
							fontFamily: "Bricolage Grotesque",
							fontSize: "16px",
							fontWeight: 700,
							gap: "13px",
							letterSpacing: "-0.02em",
						}}
					>
						<span style={{ color: "#0b1830" }}>Same seed.</span>
						<span style={{ color: "#38bdf8" }}>→</span>
						<span style={{ color: "#0b1830" }}>Same face.</span>
						<span style={{ color: "#38bdf8" }}>→</span>
						<span>Every time.</span>
					</div>
					<span
						style={{
							color: "#7389a2",
							fontSize: "14px",
							fontWeight: 700,
							letterSpacing: "0.02em",
						}}
					>
						blobz.lirena.in
					</span>
				</div>
			</div>
		</div>
	);
}

let displayFontPromise: Promise<ArrayBuffer> | undefined;

const loadDisplayFont = (): Promise<ArrayBuffer> => {
	displayFontPromise ??= fetch(BRICOLAGE_GROTESQUE_URL).then(
		async (response) => {
			if (!response.ok) {
				throw new Error(
					`Failed to load the Blobz display font: ${response.status}`
				);
			}
			return await response.arrayBuffer();
		}
	);
	return displayFontPromise;
};

export const createBlobzOgImage = async (
	props: BlobzOgImageProps
): Promise<ImageResponse> => {
	const displayFont = await loadDisplayFont();

	return new ImageResponse(<BlobzOgImage {...props} />, {
		fonts: [
			{
				data: displayFont,
				name: "Bricolage Grotesque",
				style: "normal",
				weight: 800,
			},
		],
		height: OG_SIZE.height,
		width: OG_SIZE.width,
	});
};

export { OG_SIZE };
