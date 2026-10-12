"use client";

import { makeAvatar } from "@blobz/avatar-core";
import { Avatar } from "@blobz/react";
import { Button, buttonVariants } from "@blobz/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@blobz/ui/components/dropdown-menu";
import { InputGroup, InputGroupInput } from "@blobz/ui/components/input-group";
import {
	ArrowDownRight,
	ArrowRight,
	Check,
	ChevronDown,
	Copy,
	Download,
	FileCode2,
	FileImage,
} from "lucide-react";
import Link from "next/link";
import { type ChangeEvent, useCallback, useState } from "react";

import styles from "@/app/personalized-hero.module.css";
import { useLandingName } from "@/components/landing/landing-name";

const SAMPLE_NAME = "Alex";
const HERO_PALETTE = ["#e8f7ff", "#38bdf8"] as const;
const FILE_NAME_CHARACTERS = /[^a-z0-9]+/g;
const FILE_NAME_EDGES = /^-+|-+$/g;
const PNG_SIZE = 1280;

const createPngBlob = async (svg: string): Promise<Blob> => {
	const url = URL.createObjectURL(
		new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
	);
	try {
		const image = new Image();
		await new Promise<void>((resolve, reject) => {
			image.onload = () => resolve();
			image.onerror = () => reject(new Error("Could not render the avatar."));
			image.src = url;
		});
		const canvas = document.createElement("canvas");
		canvas.width = PNG_SIZE;
		canvas.height = PNG_SIZE;
		const context = canvas.getContext("2d");
		if (!context) {
			throw new Error("Could not create a PNG canvas.");
		}
		context.drawImage(image, 0, 0, PNG_SIZE, PNG_SIZE);
		return await new Promise<Blob>((resolve, reject) => {
			canvas.toBlob((blob) => {
				if (blob) {
					resolve(blob);
				} else {
					reject(new Error("Could not create a PNG file."));
				}
			}, "image/png");
		});
	} finally {
		URL.revokeObjectURL(url);
	}
};

const downloadBlob = (blob: Blob, fileName: string): void => {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.download = fileName;
	link.href = url;
	document.body.append(link);
	link.click();
	link.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export function PersonalizedHero() {
	const { name, setName } = useLandingName();
	const [exportStatus, setExportStatus] = useState("");
	const avatarName = name.trim() || SAMPLE_NAME;
	const fileName =
		avatarName
			.toLowerCase()
			.replace(FILE_NAME_CHARACTERS, "-")
			.replace(FILE_NAME_EDGES, "") || "avatar";

	const handleNameChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setName(event.currentTarget.value);
			setExportStatus("");
		},
		[setName]
	);

	const copySvg = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(
				makeAvatar(avatarName, HERO_PALETTE, "rounded").svg
			);
			setExportStatus("SVG copied");
		} catch {
			setExportStatus("Could not copy SVG");
		}
	}, [avatarName]);

	const copyPng = useCallback(async () => {
		try {
			const { svg } = makeAvatar(avatarName, HERO_PALETTE, "rounded");
			const png = await createPngBlob(svg);
			await navigator.clipboard.write([
				new ClipboardItem({ "image/png": png }),
			]);
			setExportStatus("PNG copied");
		} catch {
			setExportStatus("Could not copy PNG");
		}
	}, [avatarName]);

	const downloadSvg = useCallback(() => {
		const { svg } = makeAvatar(avatarName, HERO_PALETTE, "rounded");
		downloadBlob(
			new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
			`blobz-${fileName}.svg`
		);
		setExportStatus("SVG downloaded");
	}, [avatarName, fileName]);

	const downloadPng = useCallback(async () => {
		try {
			const { svg } = makeAvatar(avatarName, HERO_PALETTE, "rounded");
			const png = await createPngBlob(svg);
			downloadBlob(png, `blobz-${fileName}.png`);
			setExportStatus("PNG downloaded");
		} catch {
			setExportStatus("Could not download PNG");
		}
	}, [avatarName, fileName]);

	return (
		<section aria-labelledby="hero-title" className={styles.hero}>
			<div className={styles.inner}>
				<div className={styles.copy}>
					<h1 className={styles.title} id="hero-title">
						Blobz for
					</h1>
					<div className={styles.nameRow}>
						<label className={styles.inputLabel} htmlFor="hero-name">
							<span className="sr-only">
								Enter a name to generate a Blobz avatar
							</span>
							<InputGroup className={styles.inputGroup}>
								<InputGroupInput
									autoComplete="name"
									className={styles.nameInput}
									id="hero-name"
									maxLength={42}
									name="name"
									onChange={handleNameChange}
									placeholder="your name"
									value={name}
								/>
							</InputGroup>
						</label>
					</div>
					<p className={styles.description}>
						Type a name and meet its avatar. Blobz turns any username, email, or
						ID into the same playful SVG face every time.
					</p>
					<div className={styles.actions}>
						<Link
							className={buttonVariants({
								className: styles.primaryLink,
								size: "lg",
							})}
							href="#surfaces"
						>
							See it everywhere
							<ArrowDownRight aria-hidden="true" data-icon="inline-end" />
						</Link>
						<Link className={styles.secondaryLink} href="/docs/components">
							Explore components
							<ArrowRight aria-hidden="true" />
						</Link>
					</div>
				</div>

				<div className={styles.preview}>
					<div className={styles.avatarStage}>
						<div className={styles.avatarFrame}>
							<Avatar
								alt={`Generated Blobz avatar for ${avatarName}`}
								className={styles.avatarImage}
								name={avatarName}
								palette={HERO_PALETTE}
								size="100%"
							/>
						</div>
					</div>
					<div className={styles.previewFooter}>
						<span
							aria-live="polite"
							className={styles.exportStatus}
							role="status"
						>
							{exportStatus}
						</span>
						<DropdownMenu>
							<DropdownMenuTrigger
								render={<Button type="button" variant="outline" />}
							>
								{exportStatus.endsWith("copied") ? (
									<Check aria-hidden="true" data-icon="inline-start" />
								) : (
									<Copy aria-hidden="true" data-icon="inline-start" />
								)}
								Copy <ChevronDown aria-hidden="true" data-icon="inline-end" />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" sideOffset={8}>
								<DropdownMenuGroup>
									<DropdownMenuItem onClick={copyPng}>
										<FileImage aria-hidden="true" /> Copy PNG
									</DropdownMenuItem>
									<DropdownMenuItem onClick={copySvg}>
										<FileCode2 aria-hidden="true" /> Copy SVG
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
						<DropdownMenu>
							<DropdownMenuTrigger render={<Button type="button" />}>
								<Download aria-hidden="true" data-icon="inline-start" />
								Download{" "}
								<ChevronDown aria-hidden="true" data-icon="inline-end" />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" sideOffset={8}>
								<DropdownMenuGroup>
									<DropdownMenuItem onClick={downloadPng}>
										<FileImage aria-hidden="true" /> Download PNG
									</DropdownMenuItem>
									<DropdownMenuItem onClick={downloadSvg}>
										<FileCode2 aria-hidden="true" /> Download SVG
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</section>
	);
}
