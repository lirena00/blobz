"use client";

import { Toaster } from "@blobz/ui/components/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<>
			{children}
			<Toaster richColors theme="light" />
		</>
	);
}
