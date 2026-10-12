// biome-ignore-all lint/performance/noJsxPropsBind: React Compiler handles these interactive form callbacks.
"use client";

import {
	type AvatarFrame,
	type AvatarPalette,
	DEFAULT_AVATAR_PALETTE,
} from "@blobz/avatar-core";
import { Avatar } from "@blobz/react";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@blobz/ui/components/alert";
import { Button } from "@blobz/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@blobz/ui/components/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@blobz/ui/components/empty";
import { Field, FieldGroup, FieldLabel } from "@blobz/ui/components/field";
import { Input } from "@blobz/ui/components/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blobz/ui/components/select";
import { CodeXmlIcon, CopyIcon, InfoIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DEMO_PEOPLE, getFirstName } from "@/lib/demo-people";
import { AvatarPalettePicker } from "@/registry/blobz/avatar-palette-picker";

interface EmbedQuickstartProps {
	apiBaseUrl: string;
	endpoint: { id: string } | null;
	hasApprovedOrigin: boolean;
}

const FRAMES = ["rounded", "circle", "square"] as const;
const SAMPLE_NAME = getFirstName(DEMO_PEOPLE.janakiAmmal);

export default function EmbedQuickstart({
	apiBaseUrl,
	endpoint,
	hasApprovedOrigin,
}: EmbedQuickstartProps) {
	const [name, setName] = useState(SAMPLE_NAME);
	const [frame, setFrame] = useState<AvatarFrame>("rounded");
	const [palette, setPalette] = useState<AvatarPalette>(DEFAULT_AVATAR_PALETTE);
	const [size, setSize] = useState(80);
	const imageUrl = endpoint
		? new URL(`/api/v1/avatars/${endpoint.id}`, apiBaseUrl)
		: null;
	if (imageUrl) {
		imageUrl.searchParams.set("name", name.trim() || SAMPLE_NAME);
		imageUrl.searchParams.set("frame", frame);
		imageUrl.searchParams.set("palette", palette.join(","));
		imageUrl.searchParams.set("size", String(size));
	}
	const snippet = imageUrl
		? `<img src="${imageUrl.toString().replaceAll("&", "&amp;")}" crossorigin="anonymous" width="${size}" height="${size}" alt="Avatar" />`
		: "";

	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle className="flex items-center gap-2" id="quickstart-title">
					<CodeXmlIcon aria-hidden="true" /> 2. Embed an avatar
				</CardTitle>
				<CardDescription>
					Your image URL was created automatically with your subscription.
					Choose the look, then paste the tag into an approved website.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-5">
				{endpoint ? (
					<>
						{hasApprovedOrigin ? null : (
							<Alert>
								<InfoIcon />
								<AlertTitle>Approve a website first</AlertTitle>
								<AlertDescription>
									The embed will start working after you add the site’s exact
									origin in the adjacent card.
								</AlertDescription>
							</Alert>
						)}
						<div className="flex items-center gap-4 rounded-xl border border-border p-4">
							<Avatar
								alt="Preview of the generated Blobz avatar"
								frame={frame}
								name={name.trim() || SAMPLE_NAME}
								palette={palette}
								size={80}
							/>
							<p className="text-muted-foreground text-sm">
								Local preview. The same name, frame and palette create the same
								hash-based avatar.
							</p>
						</div>
						<FieldGroup className="gap-4">
							<div className="grid gap-4 sm:grid-cols-2">
								<Field>
									<FieldLabel htmlFor="embed-name">
										Name or stable ID
									</FieldLabel>
									<Input
										id="embed-name"
										maxLength={256}
										onChange={(event) => setName(event.target.value)}
										value={name}
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="embed-frame">Frame</FieldLabel>
									<Select
										items={FRAMES.map((value) => ({ label: value, value }))}
										onValueChange={(value) => {
											if (
												value === "rounded" ||
												value === "circle" ||
												value === "square"
											) {
												setFrame(value);
											}
										}}
										value={frame}
									>
										<SelectTrigger id="embed-frame">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{FRAMES.map((value) => (
													<SelectItem key={value} value={value}>
														{value}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</Field>
							</div>
							<AvatarPalettePicker
								className="blobz-embed-palette"
								idPrefix="embed-palette"
								onPaletteChange={setPalette}
								palette={palette}
							/>
							<Field className="max-w-32">
								<FieldLabel htmlFor="embed-size">Size (px)</FieldLabel>
								<Input
									id="embed-size"
									max={1024}
									min={16}
									onChange={(event) => {
										const next = Number(event.target.value);
										if (Number.isInteger(next) && next >= 16 && next <= 1024) {
											setSize(next);
										}
									}}
									type="number"
									value={size}
								/>
							</Field>
						</FieldGroup>
						<pre className="overflow-x-auto rounded-xl bg-muted p-4 text-xs leading-relaxed">
							<code>{snippet}</code>
						</pre>
						<Alert>
							<InfoIcon />
							<AlertTitle>Public image URL</AlertTitle>
							<AlertDescription>
								The browser must send crossorigin from one of your approved
								origins. Rejected requests do not use your monthly allowance. A
								non-browser client can spoof Origin, so treat the URL as public.
							</AlertDescription>
						</Alert>
					</>
				) : (
					<Empty className="min-h-60 border border-dashed">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<CodeXmlIcon />
							</EmptyMedia>
							<EmptyTitle>No image endpoint yet</EmptyTitle>
							<EmptyDescription>
								Your endpoint is provisioned after Dodo confirms payment.
								Refresh this page in a moment if your purchase just completed.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				)}
			</CardContent>
			{endpoint ? (
				<CardFooter>
					<Button
						onClick={async () => {
							try {
								await navigator.clipboard.writeText(snippet);
								toast.success("Embed code copied.");
							} catch {
								toast.error("Could not copy embed code.");
							}
						}}
						variant="outline"
					>
						<CopyIcon data-icon="inline-start" /> Copy embed code
					</Button>
				</CardFooter>
			) : null}
		</Card>
	);
}
