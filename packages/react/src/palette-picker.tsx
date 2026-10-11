// biome-ignore-all lint/performance/noJsxPropsBind: Palette controls update the current controlled value.
"use client";

import type { AvatarPalette } from "@blobz/avatar-core";
import type { ChangeEvent, CSSProperties, MouseEvent } from "react";

export const AVATAR_PALETTE_PRESETS = [
	{ name: "Sky", palette: ["#eef9ff", "#38bdf8"] },
	{ name: "Mango", palette: ["#fff7ed", "#fb923c"] },
	{ name: "Fern", palette: ["#f0fdf4", "#4ade80"] },
	{ name: "Plum", palette: ["#faf5ff", "#c084fc"] },
	{ name: "Coral", palette: ["#fff1f2", "#fb7185"] },
	{ name: "Lake", palette: ["#ecfeff", "#22d3ee"] },
	{ name: "Lemon", palette: ["#fffbeb", "#fbbf24"] },
	{ name: "Indigo", palette: ["#eef2ff", "#818cf8"] },
	{ name: "Peach", palette: ["#fff7ed", "#fd8a6a"] },
	{ name: "Mint", palette: ["#ecfdf5", "#34d399"] },
	{ name: "Berry", palette: ["#fdf2f8", "#e879b7"] },
	{ name: "Violet", palette: ["#f5f3ff", "#a78bfa"] },
	{ name: "Grape", palette: ["#f2f1f4", "#7c6cf2"] },
	{ name: "Bubblegum", palette: ["#fff0f6", "#f52b96"] },
	{ name: "Citrus", palette: ["#fff6e8", "#ff8a00"] },
	{ name: "Cocoa", palette: ["#f7f1eb", "#a06d3d"] },
] as const satisfies ReadonlyArray<{
	readonly name: string;
	readonly palette: AvatarPalette;
}>;

export interface AvatarPalettePickerProps {
	readonly className?: string;
	readonly idPrefix: string;
	readonly onPaletteChange: (palette: AvatarPalette) => void;
	readonly palette: AvatarPalette;
}

export function AvatarPalettePicker({
	className,
	idPrefix,
	onPaletteChange,
	palette,
}: AvatarPalettePickerProps) {
	const handleBackgroundChange = (event: ChangeEvent<HTMLInputElement>) => {
		onPaletteChange([event.currentTarget.value, palette[1]]);
	};
	const handleBodyChange = (event: ChangeEvent<HTMLInputElement>) => {
		onPaletteChange([palette[0], event.currentTarget.value]);
	};
	const handlePaletteChange = (event: MouseEvent<HTMLButtonElement>) => {
		const preset = AVATAR_PALETTE_PRESETS.find(
			(candidate) => candidate.name === event.currentTarget.value
		);
		if (preset) {
			onPaletteChange(preset.palette);
		}
	};

	return (
		<fieldset
			className={`blobz-builder__palette blobz-palette-picker${className ? ` ${className}` : ""}`}
		>
			<legend className="blobz-builder__visually-hidden">Avatar palette</legend>
			<div className="blobz-builder__palette-row">
				<span className="blobz-builder__palette-label">Palette</span>
				<div className="blobz-builder__palette-presets">
					{AVATAR_PALETTE_PRESETS.map((preset) => {
						const isSelected =
							palette[0] === preset.palette[0] &&
							palette[1] === preset.palette[1];

						return (
							<button
								aria-label={`Use ${preset.name} palette`}
								aria-pressed={isSelected}
								className="blobz-builder__palette-preset"
								key={preset.name}
								onClick={handlePaletteChange}
								type="button"
								value={preset.name}
							>
								<span
									aria-hidden="true"
									className="blobz-builder__swatches"
									style={
										{
											"--blobz-palette-background": preset.palette[0],
											"--blobz-palette-body": preset.palette[1],
										} as CSSProperties
									}
								/>
							</button>
						);
					})}
				</div>
				<span aria-hidden="true" className="blobz-builder__palette-divider" />
				<span className="blobz-builder__palette-label">Custom</span>
				<div className="blobz-builder__custom-colours">
					<label htmlFor={`${idPrefix}-background`}>
						<span className="blobz-builder__visually-hidden">
							Custom background colour
						</span>
						<input
							id={`${idPrefix}-background`}
							onChange={handleBackgroundChange}
							type="color"
							value={palette[0]}
						/>
					</label>
					<label htmlFor={`${idPrefix}-body`}>
						<span className="blobz-builder__visually-hidden">
							Custom body colour
						</span>
						<input
							id={`${idPrefix}-body`}
							onChange={handleBodyChange}
							type="color"
							value={palette[1]}
						/>
					</label>
				</div>
			</div>
		</fieldset>
	);
}
