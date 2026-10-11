// biome-ignore-all lint/performance/noJsxPropsBind: Form callbacks use current input and origin state.
"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@blobz/ui/components/alert-dialog";
import { Badge } from "@blobz/ui/components/badge";
import { Button } from "@blobz/ui/components/button";
import {
	Card,
	CardAction,
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
	EmptyTitle,
} from "@blobz/ui/components/empty";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@blobz/ui/components/field";
import { Input } from "@blobz/ui/components/input";
import { Separator } from "@blobz/ui/components/separator";
import { Spinner } from "@blobz/ui/components/spinner";
import { Globe2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const MAX_ORIGINS = 5;

async function changeOrigin(
	method: "POST" | "DELETE",
	origin: string
): Promise<void> {
	const response = await fetch("/api/dashboard/origins", {
		body: JSON.stringify({ origin }),
		credentials: "same-origin",
		headers: { "Content-Type": "application/json" },
		method,
	});
	if (response.ok) {
		return;
	}
	const data: unknown = await response.json();
	const message =
		typeof data === "object" &&
		data &&
		"error" in data &&
		typeof data.error === "string"
			? data.error
			: "Could not update the origin. Please try again.";
	throw new Error(message);
}

export default function ApprovedOrigins({ origins }: { origins: string[] }) {
	const router = useRouter();
	const [originInput, setOriginInput] = useState("");
	const [pendingOrigin, setPendingOrigin] = useState<string | null>(null);
	const [refreshPending, startRefresh] = useTransition();

	const updateOrigin = async (method: "POST" | "DELETE", origin: string) => {
		setPendingOrigin(origin);
		try {
			await changeOrigin(method, origin);
			if (method === "POST") {
				setOriginInput("");
			}
			toast.success(method === "POST" ? "Origin approved." : "Origin removed.");
			startRefresh(() => router.refresh());
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Could not update the origin."
			);
		} finally {
			setPendingOrigin(null);
		}
	};

	return (
		<section aria-labelledby="origins-title">
			<Card className="h-full">
				<CardHeader>
					<CardTitle className="flex items-center gap-2" id="origins-title">
						<Globe2Icon aria-hidden="true" /> 1. Approved origins
					</CardTitle>
					<CardDescription>
						Only these websites can load your images in a browser.
					</CardDescription>
					<CardAction>
						<Badge variant="outline">
							{origins.length} / {MAX_ORIGINS}
						</Badge>
					</CardAction>
				</CardHeader>
				<CardContent className="flex flex-col gap-5">
					<form
						onSubmit={async (event) => {
							event.preventDefault();
							await updateOrigin("POST", originInput);
						}}
					>
						<FieldGroup className="gap-3">
							<Field>
								<FieldLabel htmlFor="origin">Website origin</FieldLabel>
								<Input
									id="origin"
									onChange={(event) => setOriginInput(event.target.value)}
									placeholder="https://app.example.com"
									required
									value={originInput}
								/>
								<FieldDescription>
									Local development: http://localhost:3000
								</FieldDescription>
							</Field>
							<Button
								className="w-fit"
								disabled={
									origins.length >= MAX_ORIGINS || pendingOrigin !== null
								}
								type="submit"
							>
								{pendingOrigin === originInput ? (
									<Spinner data-icon="inline-start" />
								) : (
									<PlusIcon data-icon="inline-start" />
								)}
								Add origin
							</Button>
						</FieldGroup>
					</form>
					<Separator />
					{origins.length === 0 ? (
						<Empty className="border border-dashed">
							<EmptyHeader>
								<EmptyTitle>No origins yet</EmptyTitle>
								<EmptyDescription>
									Add the site where you will embed Blobz images.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					) : (
						<ul className="flex flex-col gap-2">
							{origins.map((origin) => (
								<li
									className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-border p-3"
									key={origin}
								>
									<span className="min-w-0 break-all font-mono text-xs">
										{origin}
									</span>
									<AlertDialog>
										<AlertDialogTrigger
											render={
												<Button
													aria-label={`Remove ${origin}`}
													size="icon"
													variant="ghost"
												/>
											}
										>
											<Trash2Icon />
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>Remove this origin?</AlertDialogTitle>
												<AlertDialogDescription>
													Images embedded on {origin} will stop loading
													immediately.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Keep origin</AlertDialogCancel>
												<AlertDialogAction
													onClick={async () =>
														await updateOrigin("DELETE", origin)
													}
													variant="destructive"
												>
													Remove origin
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</li>
							))}
						</ul>
					)}
				</CardContent>
				<CardFooter>
					<p className="text-muted-foreground text-xs">
						Five exact origins per account. Include the scheme and any port; no
						wildcards or paths. Unlisted origins are rejected before usage is
						counted.
					</p>
				</CardFooter>
			</Card>
			{refreshPending ? (
				<span className="sr-only" role="status">
					Refreshing approved origins
				</span>
			) : null}
		</section>
	);
}
