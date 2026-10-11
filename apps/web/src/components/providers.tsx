"use client";

import { Toaster } from "@blobz/ui/components/sonner";
import { RootProvider } from "fumadocs-ui/provider/next";
import { usePathname } from "next/navigation";

export default function Providers({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isDocsRoute = pathname === "/docs" || pathname.startsWith("/docs/");

	return (
		<RootProvider
			theme={{
				attribute: "class",
				defaultTheme: "light",
				enableSystem: false,
				forcedTheme: isDocsRoute ? "dark" : undefined,
			}}
		>
			{children}
			<Toaster richColors theme={isDocsRoute ? "dark" : "light"} />
		</RootProvider>
	);
}
