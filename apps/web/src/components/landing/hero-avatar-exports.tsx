"use client";

import { makeAvatar } from "@blobz/avatar-core";
import { Button } from "@blobz/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@blobz/ui/components/dropdown-menu";
import {
	Check,
	ChevronDown,
	Copy,
	FileCode2,
	FileImage,
	LoaderCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import styles from "./hero-avatar-demo.module.css";
import type { HeroAvatarValue } from "./hero-avatar-presets";

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

export function HeroAvatarExports({
	value,
	onMenuOpenChange,
}: {
	readonly value: HeroAvatarValue;
	readonly onMenuOpenChange: (open: boolean) => void;
}) {
	const [copyOpen, setCopyOpen] = useState(false);
	const [downloadOpen, setDownloadOpen] = useState(false);
	const [pending, setPending] = useState(false);
	const [status, setStatus] = useState({ key: "", message: "" });
	const valueKey = `${value.name}|${value.palette.join("|")}|${value.frame}`;
	const message = status.key === valueKey ? status.message : "";
	const fileName =
		value.name
			.toLowerCase()
			.replace(FILE_NAME_CHARACTERS, "-")
			.replace(FILE_NAME_EDGES, "") || "avatar";

	useEffect(() => {
		onMenuOpenChange(copyOpen || downloadOpen || pending);
	}, [copyOpen, downloadOpen, onMenuOpenChange, pending]);

	const copySvg = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(
				makeAvatar(value.name, value.palette, value.frame).svg
			);
			setStatus({ key: valueKey, message: "SVG copied" });
		} catch {
			setStatus({
				key: valueKey,
				message: "Could not copy SVG. Try downloading it.",
			});
		}
	}, [value, valueKey]);
	const copyPng = useCallback(async () => {
		setPending(true);
		try {
			const png = await createPngBlob(
				makeAvatar(value.name, value.palette, value.frame).svg
			);
			await navigator.clipboard.write([
				new ClipboardItem({ "image/png": png }),
			]);
			setStatus({ key: valueKey, message: "PNG copied" });
		} catch {
			setStatus({
				key: valueKey,
				message: "Could not copy PNG. Try downloading it.",
			});
		} finally {
			setPending(false);
		}
	}, [value, valueKey]);
	const downloadSvg = useCallback(() => {
		const { svg } = makeAvatar(value.name, value.palette, value.frame);
		downloadBlob(
			new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
			`blobz-${fileName}.svg`
		);
		setStatus({ key: valueKey, message: "SVG downloaded" });
	}, [fileName, value, valueKey]);
	const downloadPng = useCallback(async () => {
		setPending(true);
		try {
			const png = await createPngBlob(
				makeAvatar(value.name, value.palette, value.frame).svg
			);
			downloadBlob(png, `blobz-${fileName}.png`);
			setStatus({ key: valueKey, message: "PNG downloaded" });
		} catch {
			setStatus({
				key: valueKey,
				message: "Could not download PNG. Please try again.",
			});
		} finally {
			setPending(false);
		}
	}, [fileName, value, valueKey]);

	return (
		<div className={styles.exports}>
			<DropdownMenu onOpenChange={setCopyOpen} open={copyOpen}>
				<DropdownMenuTrigger
					aria-label="Copy avatar"
					disabled={pending}
					render={
						<Button className={styles.iconButton} size="icon" variant="ghost" />
					}
					title="Copy avatar"
				>
					{message.endsWith("copied") ? (
						<Check aria-hidden="true" />
					) : (
						<Copy aria-hidden="true" />
					)}
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" sideOffset={8}>
					<DropdownMenuGroup>
						<DropdownMenuItem onClick={copySvg}>
							<FileCode2 aria-hidden="true" />
							Copy SVG
						</DropdownMenuItem>
						<DropdownMenuItem onClick={copyPng}>
							<FileImage aria-hidden="true" />
							Copy PNG
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<DropdownMenu onOpenChange={setDownloadOpen} open={downloadOpen}>
				<DropdownMenuTrigger
					disabled={pending}
					render={<Button className={styles.downloadButton} />}
				>
					Download
					{pending ? (
						<LoaderCircle
							aria-hidden="true"
							className={styles.spinner}
							data-icon="inline-end"
						/>
					) : (
						<ChevronDown aria-hidden="true" data-icon="inline-end" />
					)}
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" sideOffset={8}>
					<DropdownMenuGroup>
						<DropdownMenuItem onClick={downloadSvg}>
							<FileCode2 aria-hidden="true" />
							Download SVG
						</DropdownMenuItem>
						<DropdownMenuItem onClick={downloadPng}>
							<FileImage aria-hidden="true" />
							Download PNG
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<span className={styles.exportStatus} role="status">
				{message}
			</span>
		</div>
	);
}
