"use client";

import {
	type AvatarRenderResult,
	createAvatar,
	createCustomAvatar,
} from "@blobz/avatar-core";
import { AvatarBuilder, type AvatarBuilderValue } from "@blobz/react/builder";
import { Button } from "@blobz/ui/components/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@blobz/ui/components/card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@blobz/ui/components/tabs";
import {
	BracesIcon,
	ClipboardIcon,
	DownloadIcon,
	FileCode2Icon,
	ImageDownIcon,
	PaletteIcon,
} from "lucide-react";
import type { Language } from "prism-react-renderer";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { HighlightedCode } from "./highlighted-code";

const EXPORT_SIZE_PX = 1280;
const FILE_NAME_SEPARATOR_PATTERN = /[^a-z0-9]+/g;
const LEADING_OR_TRAILING_DASH_PATTERN = /^-+|-+$/g;

const INITIAL_AVATAR = {
	frame: "rounded",
	name: "Ada Lovelace",
	palette: ["#eef9ff", "#38bdf8"],
	type: "generated",
	version: 1,
} as const satisfies AvatarBuilderValue;

const renderDefinition = (
	definition: AvatarBuilderValue
): AvatarRenderResult => {
	if (definition.type === "generated") {
		return createAvatar(definition);
	}

	return createCustomAvatar(definition);
};

const createFileName = (definition: AvatarBuilderValue): string => {
	if (definition.type === "custom") {
		return "custom-blobz";
	}

	const name = String(definition.name)
		.trim()
		.toLowerCase()
		.replace(FILE_NAME_SEPARATOR_PATTERN, "-")
		.replace(LEADING_OR_TRAILING_DASH_PATTERN, "");
	return `${name || "generated"}-blobz`;
};

const createDownload = (blob: Blob, fileName: string): void => {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.download = fileName;
	link.href = url;
	document.body.append(link);
	link.click();
	link.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 0);
};

const loadSvgImage = (svg: string): Promise<HTMLImageElement> => {
	const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
	const url = URL.createObjectURL(svgBlob);

	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => {
			URL.revokeObjectURL(url);
			resolve(image);
		};
		image.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error("The Blobz SVG could not be rendered."));
		};
		image.src = url;
	});
};

const createPngBlob = async (svg: string): Promise<Blob> => {
	const image = await loadSvgImage(svg);
	const canvas = document.createElement("canvas");
	canvas.height = EXPORT_SIZE_PX;
	canvas.width = EXPORT_SIZE_PX;
	const context = canvas.getContext("2d");

	if (!context) {
		throw new Error("Your browser could not prepare the PNG export.");
	}

	context.drawImage(image, 0, 0, EXPORT_SIZE_PX, EXPORT_SIZE_PX);
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (blob) {
				resolve(blob);
				return;
			}

			reject(new Error("Your browser could not encode the PNG export."));
		}, "image/png");
	});
};

const copyText = async (text: string): Promise<void> => {
	if (!navigator.clipboard?.writeText) {
		throw new Error("Clipboard access is not available in this browser.");
	}

	await navigator.clipboard.writeText(text);
};

interface CodePanelProps {
	readonly code: string;
	readonly copyLabel: string;
	readonly description: string;
	readonly language: Language;
	readonly onCopy: () => void;
	readonly title: string;
}

function CodePanel({
	code,
	copyLabel,
	description,
	language,
	onCopy,
	title,
}: CodePanelProps) {
	return (
		<Card className="w-full [--card-spacing:--spacing(5)]">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
				<CardAction>
					<Button onClick={onCopy} size="sm" variant="outline">
						<ClipboardIcon aria-hidden="true" data-icon="inline-start" />
						{copyLabel}
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent className="px-0">
				<HighlightedCode code={code} label={title} language={language} />
			</CardContent>
		</Card>
	);
}

export function BlobzCreator() {
	const [definition, setDefinition] =
		useState<AvatarBuilderValue>(INITIAL_AVATAR);
	const avatar = useMemo(() => renderDefinition(definition), [definition]);
	const config = useMemo(
		() => JSON.stringify(definition, null, 2),
		[definition]
	);
	const fileName = createFileName(definition);

	const handleCopyConfig = useCallback(async (): Promise<void> => {
		try {
			await copyText(config);
			toast.success("Avatar config copied.");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Could not copy the config."
			);
		}
	}, [config]);

	const handleCopySvg = useCallback(async (): Promise<void> => {
		try {
			await copyText(avatar.svg);
			toast.success("SVG source copied.");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Could not copy the SVG."
			);
		}
	}, [avatar.svg]);

	const handleCopyPng = useCallback(async (): Promise<void> => {
		try {
			if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
				throw new Error(
					"Image clipboard access is not available in this browser."
				);
			}

			const png = await createPngBlob(avatar.svg);
			await navigator.clipboard.write([
				new ClipboardItem({ "image/png": png }),
			]);
			toast.success("Blobz copied as a PNG.");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Could not copy the Blobz."
			);
		}
	}, [avatar.svg]);

	const handleDownloadPng = useCallback(async (): Promise<void> => {
		try {
			const png = await createPngBlob(avatar.svg);
			createDownload(png, `${fileName}.png`);
			toast.success("PNG downloaded.");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Could not download the PNG."
			);
		}
	}, [avatar.svg, fileName]);

	const handleDownloadSvg = useCallback((): void => {
		const svg = new Blob([avatar.svg], {
			type: "image/svg+xml;charset=utf-8",
		});
		createDownload(svg, `${fileName}.svg`);
		toast.success("SVG downloaded.");
	}, [avatar.svg, fileName]);

	return (
		<main className="blobz-creator min-h-screen bg-background px-4 pt-28 pb-20 text-foreground sm:px-6 sm:pt-32">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
				<header className="grid max-w-4xl gap-3">
					<p className="font-bold text-muted-foreground text-xs uppercase tracking-[0.18em]">
						Blobz creator
					</p>
					<h1 className="text-balance font-[780] font-[family-name:var(--font-bricolage)] text-4xl leading-[0.98] tracking-[-0.05em] sm:text-6xl">
						Make the face that fits.
					</h1>
					<p className="max-w-2xl text-pretty text-base text-muted-foreground leading-7">
						Start with any string for a stable, repeatable identity—or switch to
						Build my own and choose every feature yourself. Everything updates
						live and stays ready to export.
					</p>
				</header>

				<Tabs defaultValue="design">
					<TabsList aria-label="Creator workspace" variant="line">
						<TabsTrigger value="design">
							<PaletteIcon aria-hidden="true" data-icon="inline-start" />
							Design
						</TabsTrigger>
						<TabsTrigger value="config">
							<BracesIcon aria-hidden="true" data-icon="inline-start" />
							JSON config
						</TabsTrigger>
						<TabsTrigger value="svg">
							<FileCode2Icon aria-hidden="true" data-icon="inline-start" />
							SVG source
						</TabsTrigger>
					</TabsList>

					<TabsContent value="design">
						<Card className="w-full overflow-visible [--card-spacing:--spacing(6)]">
							<CardHeader>
								<CardTitle>Design your Blobz</CardTitle>
								<CardDescription>
									Use From name for deterministic generation, or Build my own
									for manual control without a seed hash.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<AvatarBuilder
									aria-label="Blobz avatar builder"
									onValueChange={setDefinition}
									value={definition}
								>
									<p className="font-bold text-muted-foreground text-xs uppercase tracking-[0.12em]">
										Export avatar
									</p>
									<Button
										className="w-full justify-start"
										onClick={handleCopyPng}
									>
										<ClipboardIcon
											aria-hidden="true"
											data-icon="inline-start"
										/>
										Copy PNG
									</Button>
									<Button
										className="w-full justify-start"
										onClick={handleDownloadPng}
										variant="secondary"
									>
										<ImageDownIcon
											aria-hidden="true"
											data-icon="inline-start"
										/>
										Download PNG
									</Button>
									<Button
										className="w-full justify-start"
										onClick={handleDownloadSvg}
										variant="outline"
									>
										<DownloadIcon aria-hidden="true" data-icon="inline-start" />
										Download SVG
									</Button>
								</AvatarBuilder>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="config">
						<CodePanel
							code={config}
							copyLabel="Copy config"
							description="This versioned definition recreates the current Blobz exactly."
							language="json"
							onCopy={handleCopyConfig}
							title="Avatar configuration"
						/>
					</TabsContent>

					<TabsContent value="svg">
						<CodePanel
							code={avatar.svg}
							copyLabel="Copy SVG"
							description="Use the rendered vector anywhere SVG images are accepted."
							language="markup"
							onCopy={handleCopySvg}
							title="Rendered SVG source"
						/>
					</TabsContent>
				</Tabs>
			</div>
		</main>
	);
}
