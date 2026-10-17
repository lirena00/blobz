"use client";

import { Button } from "@blobz/ui/components/button";
import { Check, Copy, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";

export function CopyCode({
	code,
	label,
}: {
	readonly code: string;
	readonly label: string;
}) {
	const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

	const handleCopy = useCallback(async (): Promise<void> => {
		try {
			await navigator.clipboard.writeText(code);
			setStatus("copied");
		} catch {
			setStatus("failed");
		}
	}, [code]);

	let icon = <Copy aria-hidden="true" data-icon="inline-start" />;
	let text = "Copy";
	let announcement = "";
	if (status === "copied") {
		icon = <Check aria-hidden="true" data-icon="inline-start" />;
		text = "Copied";
		announcement = `${label}: copied to clipboard.`;
	} else if (status === "failed") {
		icon = <RotateCcw aria-hidden="true" data-icon="inline-start" />;
		text = "Retry";
		announcement =
			"Could not copy. Select the code to copy it manually, or try again.";
	}

	return (
		<>
			<Button
				aria-label={label}
				className="min-h-11 w-22 shrink-0"
				onClick={handleCopy}
				size="sm"
				type="button"
				variant="ghost"
			>
				{icon}
				{text}
			</Button>
			<span aria-live="polite" className="sr-only" role="status">
				{announcement}
			</span>
		</>
	);
}
