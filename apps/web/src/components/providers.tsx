"use client";

import { Toaster } from "@blobz/ui/components/sonner";

import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			disableTransitionOnChange
			enableSystem={false}
			forcedTheme="light"
		>
			{children}
			<Toaster richColors />
		</ThemeProvider>
	);
}
