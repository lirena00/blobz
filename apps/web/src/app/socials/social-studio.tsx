// biome-ignore-all lint/performance/noJsxPropsBind: These handlers stay within this editor and its native controls.
// biome-ignore-all lint/performance/noAwaitInLoops: Exporting sequentially bounds canvas memory and reports progress for each image.
"use client";

import { ArrowDownToLine, Check, Download, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
	type ImageSize,
	renderSocialImage,
	SOCIAL_IMAGES,
	type SocialImageId,
} from "./social-renderer";
import styles from "./social-studio.module.css";

const DEFAULT_SIZE = { height: "630", width: "1200" };
const MIN_DIMENSION = 320;
const MAX_DIMENSION = 4096;
const PRESETS = [
	{ height: "630", label: "Landscape", width: "1200" },
	{ height: "1080", label: "Square", width: "1080" },
	{ height: "1350", label: "Portrait", width: "1080" },
] as const;

interface DraftSize {
	height: string;
	width: string;
}
type SizeMap = Record<SocialImageId, DraftSize>;

const INITIAL_SIZES = Object.fromEntries(
	SOCIAL_IMAGES.map(({ id }) => [id, { ...DEFAULT_SIZE }])
) as SizeMap;

const readSize = (draft: DraftSize): ImageSize | null => {
	const width = Number(draft.width);
	const height = Number(draft.height);
	if (
		!(Number.isInteger(width) && Number.isInteger(height)) ||
		width < MIN_DIMENSION ||
		height < MIN_DIMENSION ||
		width > MAX_DIMENSION ||
		height > MAX_DIMENSION
	) {
		return null;
	}
	return { height, width };
};

const previewSize = (size: ImageSize, longestEdge: number): ImageSize => {
	const scale = Math.min(1, longestEdge / Math.max(size.width, size.height));
	return {
		height: Math.max(1, Math.round(size.height * scale)),
		width: Math.max(1, Math.round(size.width * scale)),
	};
};

const saveFile = (blob: Blob, filename: string) => {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.append(link);
	link.click();
	link.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const canvasToPng = (canvas: HTMLCanvasElement): Promise<Blob> =>
	new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (blob) {
				resolve(blob);
				return;
			}
			reject(new Error("The PNG could not be created."));
		}, "image/png");
	});

async function makePng(id: SocialImageId, size: ImageSize): Promise<Blob> {
	const canvas = document.createElement("canvas");
	try {
		await renderSocialImage(canvas, id, size);
		return await canvasToPng(canvas);
	} finally {
		canvas.width = 0;
		canvas.height = 0;
	}
}

function Thumbnail({
	id,
	size,
}: {
	readonly id: SocialImageId;
	readonly size: ImageSize;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { width, height } = size;
	useEffect(() => {
		let cancelled = false;
		const target = canvasRef.current;
		const render = async () => {
			const canvas = document.createElement("canvas");
			await renderSocialImage(canvas, id, previewSize({ height, width }, 320));
			if (cancelled || !target) {
				return;
			}
			target.width = canvas.width;
			target.height = canvas.height;
			target.getContext("2d")?.drawImage(canvas, 0, 0);
		};
		render().catch(() => {
			if (!cancelled && target) {
				target.width = 0;
			}
		});
		return () => {
			cancelled = true;
		};
	}, [id, width, height]);
	return <canvas className={styles.thumbnail} ref={canvasRef} />;
}

export function SocialStudio() {
	const [selectedId, setSelectedId] = useState<SocialImageId>("cover");
	const [sizes, setSizes] = useState<SizeMap>(INITIAL_SIZES);
	const [busy, setBusy] = useState<"single" | "all" | null>(null);
	const [status, setStatus] = useState("");
	const [error, setError] = useState("");
	const previewRef = useRef<HTMLCanvasElement>(null);
	const current =
		SOCIAL_IMAGES.find((image) => image.id === selectedId) ?? SOCIAL_IMAGES[0];
	const selectedSize = readSize(sizes[selectedId]);
	const draftWidth = sizes[selectedId].width;
	const draftHeight = sizes[selectedId].height;

	useEffect(() => {
		const validSize = readSize({ height: draftHeight, width: draftWidth });
		if (!validSize) {
			return;
		}
		let cancelled = false;
		const target = previewRef.current;
		const render = async () => {
			try {
				const canvas = document.createElement("canvas");
				await renderSocialImage(
					canvas,
					selectedId,
					previewSize(validSize, 1400)
				);
				if (cancelled || !target) {
					return;
				}
				target.width = canvas.width;
				target.height = canvas.height;
				target.getContext("2d")?.drawImage(canvas, 0, 0);
				setError("");
			} catch (cause) {
				if (!cancelled) {
					setError(
						cause instanceof Error
							? cause.message
							: "Preview could not be rendered."
					);
				}
			}
		};
		render().catch((cause: unknown) => {
			if (!cancelled) {
				setError(
					cause instanceof Error
						? cause.message
						: "Preview could not be rendered."
				);
			}
		});
		return () => {
			cancelled = true;
		};
	}, [selectedId, draftWidth, draftHeight]);

	const changeDimension = (dimension: keyof DraftSize, value: string) => {
		setSizes((previous) => ({
			...previous,
			[selectedId]: { ...previous[selectedId], [dimension]: value },
		}));
		setStatus("");
	};

	const selectPreset = (width: string, height: string) => {
		setSizes((previous) => ({ ...previous, [selectedId]: { height, width } }));
		setStatus("");
	};

	const applySizeToAll = () => {
		if (!selectedSize) {
			return;
		}
		const next = Object.fromEntries(
			SOCIAL_IMAGES.map(({ id }) => [id, { ...sizes[selectedId] }])
		) as SizeMap;
		setSizes(next);
		setStatus("Size applied to every image.");
	};

	const downloadSelected = async () => {
		if (!selectedSize || busy) {
			return;
		}
		setBusy("single");
		setError("");
		setStatus("Creating PNG…");
		try {
			const png = await makePng(selectedId, selectedSize);
			saveFile(
				png,
				`${current.file}-${selectedSize.width}x${selectedSize.height}.png`
			);
			setStatus(`${current.label} downloaded.`);
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "Download failed.");
		} finally {
			setBusy(null);
		}
	};

	const downloadAll = async () => {
		if (busy) {
			return;
		}
		const entries = SOCIAL_IMAGES.map((image) => ({
			image,
			size: readSize(sizes[image.id]),
		}));
		if (entries.some(({ size }) => size === null)) {
			setError(
				`Each width and height must be a whole number from ${MIN_DIMENSION} to ${MAX_DIMENSION}.`
			);
			return;
		}
		setBusy("all");
		setError("");
		try {
			const files: Record<string, [Uint8Array, { level: 0 }]> = {};
			for (const { image, size } of entries) {
				if (!size) {
					throw new Error("An image size is missing.");
				}
				setStatus(`Rendering ${image.label}…`);
				const png = await makePng(image.id, size);
				files[`${image.file}-${size.width}x${size.height}.png`] = [
					new Uint8Array(await png.arrayBuffer()),
					{ level: 0 },
				];
			}
			setStatus("Packing your images…");
			const { zipSync } = await import("fflate");
			const archive = zipSync(files);
			saveFile(
				new Blob([archive], { type: "application/zip" }),
				"blobz-social-images.zip"
			);
			setStatus("The complete image set downloaded.");
		} catch (cause) {
			setError(
				cause instanceof Error
					? cause.message
					: "The image pack could not be created."
			);
		} finally {
			setBusy(null);
		}
	};

	return (
		<main className={styles.page}>
			<div className={styles.shell}>
				<div className={styles.heading}>
					<div>
						<p className={styles.eyebrow}>SOCIAL ASSET STUDIO</p>
						<h1>Social images, ready to share.</h1>
						<p className={styles.intro}>
							An art directed set for Product Hunt, Peerlist, and wherever you
							share Blobz. Choose the size for each image and export them
							together.
						</p>
					</div>
					<button
						className={styles.primaryButton}
						disabled={busy !== null}
						onClick={downloadAll}
						type="button"
					>
						{busy === "all" ? (
							<LoaderCircle
								aria-hidden="true"
								className={styles.spinner}
								size={18}
							/>
						) : (
							<Download aria-hidden="true" size={18} />
						)}
						Download complete set
					</button>
				</div>

				<div className={styles.workspace}>
					<section aria-label="Image selection" className={styles.library}>
						<div className={styles.libraryHeading}>THE SET</div>
						<div className={styles.imageList}>
							{SOCIAL_IMAGES.map((image) => {
								const validSize = readSize(sizes[image.id]) ?? {
									height: 630,
									width: 1200,
								};
								return (
									<button
										aria-current={selectedId === image.id ? "true" : undefined}
										className={styles.imageChoice}
										data-active={selectedId === image.id}
										key={image.id}
										onClick={() => setSelectedId(image.id)}
										type="button"
									>
										<span className={styles.thumbFrame}>
											<Thumbnail id={image.id} size={validSize} />
										</span>
										<span className={styles.choiceCopy}>
											<span className={styles.choiceCategory}>
												{image.category}
											</span>
											<span className={styles.choiceLabel}>{image.label}</span>
										</span>
										{selectedId === image.id ? (
											<Check
												aria-hidden="true"
												className={styles.choiceCheck}
												size={16}
											/>
										) : null}
									</button>
								);
							})}
						</div>
					</section>

					<section
						aria-label="Image preview and export"
						className={styles.editor}
					>
						<div className={styles.editorTop}>
							<div>
								<p className={styles.sectionKicker}>LIVE PREVIEW</p>
								<h2>{current.label}</h2>
							</div>
						</div>
						<div className={styles.previewStage}>
							<canvas
								aria-label={`${current.label} image preview`}
								className={styles.previewCanvas}
								ref={previewRef}
								role="img"
							/>
						</div>
						<div className={styles.controls}>
							<div className={styles.controlHeading}>
								<div>
									<h3>Canvas size</h3>
									<p>
										Set exact pixels for this image. Its composition reflows
										with the aspect ratio.
									</p>
								</div>
								<button
									className={styles.textButton}
									disabled={!selectedSize || busy !== null}
									onClick={applySizeToAll}
									type="button"
								>
									Apply to all <span aria-hidden="true">↗</span>
								</button>
							</div>
							<fieldset aria-label="Size presets" className={styles.presetRow}>
								{PRESETS.map((preset) => (
									<button
										aria-pressed={
											sizes[selectedId].width === preset.width &&
											sizes[selectedId].height === preset.height
										}
										className={styles.preset}
										key={preset.label}
										onClick={() => selectPreset(preset.width, preset.height)}
										type="button"
									>
										{preset.label}
									</button>
								))}
							</fieldset>
							<div className={styles.fields}>
								<label>
									Width <span>px</span>
									<input
										inputMode="numeric"
										max={MAX_DIMENSION}
										min={MIN_DIMENSION}
										onChange={(event) =>
											changeDimension("width", event.target.value)
										}
										type="number"
										value={sizes[selectedId].width}
									/>
								</label>
								<span aria-hidden="true" className={styles.multiply}>
									×
								</span>
								<label>
									Height <span>px</span>
									<input
										inputMode="numeric"
										max={MAX_DIMENSION}
										min={MIN_DIMENSION}
										onChange={(event) =>
											changeDimension("height", event.target.value)
										}
										type="number"
										value={sizes[selectedId].height}
									/>
								</label>
							</div>
							{selectedSize ? null : (
								<p className={styles.validation}>
									Enter whole numbers from {MIN_DIMENSION} to {MAX_DIMENSION}{" "}
									pixels.
								</p>
							)}
							<div className={styles.actions}>
								<button
									className={styles.secondaryButton}
									disabled={!selectedSize || busy !== null}
									onClick={downloadSelected}
									type="button"
								>
									{busy === "single" ? (
										<LoaderCircle
											aria-hidden="true"
											className={styles.spinner}
											size={17}
										/>
									) : (
										<ArrowDownToLine aria-hidden="true" size={17} />
									)}{" "}
									Download this PNG
								</button>
								<span className={styles.actionNote}>
									or download the complete set as one ZIP
								</span>
							</div>
							<p
								aria-live="polite"
								className={error ? styles.error : styles.status}
							>
								{error || status}
							</p>
						</div>
					</section>
				</div>
			</div>
		</main>
	);
}
