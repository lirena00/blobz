"use client";

import { Toaster } from "@blobz/ui/components/sonner";
import { RootProvider } from "fumadocs-ui/provider/next";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<RootProvider
			theme={{
				attribute: "class",
				defaultTheme: "light",
				enableSystem: false,
			}}
		>
			{children}
			<Toaster richColors theme="light" />
		</RootProvider>
	);
}
