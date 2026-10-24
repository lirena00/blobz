// biome-ignore-all lint/performance/noImgElement: Satori renders these SVG data URLs directly into the social image.
import {
	MAIN_COVER_COLORS as colors,
	MAIN_COVER_COPY as copy,
	getMainCoverLayout,
	MAIN_COVER_LOGO,
} from "@/lib/main-social-cover";

export function MainCoverImage() {
	const layout = getMainCoverLayout(1200, 630);
	return (
		<div
			style={{
				background: colors.background,
				backgroundImage:
					"linear-gradient(rgba(14, 165, 233, 0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.055) 1px, transparent 1px)",
				backgroundSize: "64px 64px",
				color: colors.ink,
				display: "flex",
				fontFamily: "Bricolage Grotesque",
				height: "100%",
				position: "relative",
				width: "100%",
			}}
		>
			<div
				style={{
					alignItems: "center",
					display: "flex",
					gap: 12,
					left: layout.brand.left,
					position: "absolute",
					top: layout.brand.top,
				}}
			>
				<img alt="" height={40} src={MAIN_COVER_LOGO} width={40} />
				<span
					style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em" }}
				>
					blobz
				</span>
			</div>
			<div
				style={{
					background: colors.panel,
					border: `1px solid ${colors.border}`,
					borderRadius: 24,
					display: "flex",
					height: layout.panel.size,
					left: layout.panel.left,
					position: "absolute",
					top: layout.panel.top,
					width: layout.panel.size,
				}}
			/>
			{layout.tiles.map((tile) => (
				<img
					alt=""
					height={tile.size}
					key={tile.id}
					src={tile.source}
					style={{ left: tile.left, position: "absolute", top: tile.top }}
					width={tile.size}
				/>
			))}
			<h1
				style={{
					display: "flex",
					flexDirection: "column",
					fontSize: layout.title.size,
					fontWeight: 800,
					left: layout.title.left,
					letterSpacing: "-0.04em",
					lineHeight: 1,
					margin: 0,
					position: "absolute",
					top: layout.title.top,
				}}
			>
				<span>{copy.title[0]}</span>
				<span style={{ color: colors.accent }}>{copy.title[1]}</span>
			</h1>
			<p
				style={{
					color: colors.muted,
					display: "flex",
					flexDirection: "column",
					fontFamily: "Bricolage Grotesque",
					fontSize: 22,
					fontWeight: 400,
					left: layout.description.left,
					lineHeight: "31px",
					margin: 0,
					position: "absolute",
					top: layout.description.top,
				}}
			>
				{copy.description.map((line) => (
					<span key={line}>{line}</span>
				))}
			</p>
			<span
				style={{
					color: colors.accent,
					fontSize: 16,
					fontWeight: 800,
					left: layout.tagline.left,
					position: "absolute",
					top: layout.tagline.top,
				}}
			>
				{copy.tagline}
			</span>
			<span
				style={{
					fontSize: 18,
					fontWeight: 800,
					left: layout.site.left,
					position: "absolute",
					top: layout.site.top,
				}}
			>
				{copy.site}
			</span>
		</div>
	);
}
