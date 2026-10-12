"use client";

import { makeAvatar } from "@blobz/avatar-core";
import { Avatar } from "@blobz/react";
import { Button, buttonVariants } from "@blobz/ui/components/button";
import { InputGroup, InputGroupInput } from "@blobz/ui/components/input-group";
import {
	ArrowDownRight,
	ArrowRight,
	Check,
	Copy,
	Download,
} from "lucide-react";
import Link from "next/link";
import { type ChangeEvent, useCallback, useState } from "react";

import styles from "@/app/personalized-hero.module.css";
import { useLandingName } from "@/components/landing/landing-name";

const SAMPLE_NAME = "Alex";
const HERO_PALETTE = ["#e8f7ff", "#38bdf8"] as const;
const FILE_NAME_CHARACTERS = /[^a-z0-9]+/g;
const FILE_NAME_EDGES = /^-+|-+$/g;

export function PersonalizedHero() {
	const { name, setName } = useLandingName();
	const [exportStatus, setExportStatus] = useState("");
	const avatarName = name.trim() || SAMPLE_NAME;

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

	const downloadSvg = useCallback(() => {
		const { svg } = makeAvatar(avatarName, HERO_PALETTE, "rounded");
		const fileName =
			avatarName
				.toLowerCase()
				.replace(FILE_NAME_CHARACTERS, "-")
				.replace(FILE_NAME_EDGES, "") || "avatar";
		const url = URL.createObjectURL(
			new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
		);
		const link = document.createElement("a");
		link.download = `blobz-${fileName}.svg`;
		link.href = url;
		document.body.append(link);
		link.click();
		link.remove();
		window.setTimeout(() => URL.revokeObjectURL(url), 1000);
		setExportStatus("SVG downloaded");
	}, [avatarName]);

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
						<Button onClick={copySvg} type="button" variant="outline">
							{exportStatus === "SVG copied" ? (
								<Check aria-hidden="true" data-icon="inline-start" />
							) : (
								<Copy aria-hidden="true" data-icon="inline-start" />
							)}
							Copy SVG
						</Button>
						<Button onClick={downloadSvg} type="button">
							<Download aria-hidden="true" data-icon="inline-start" />
							Download SVG
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
