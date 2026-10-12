"use client";

import { Toaster } from "@blobz/ui/components/sonner";
import { RootProvider } from "fumadocs-ui/provider/next";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

function AppToaster({ isDocsRoute }: { isDocsRoute: boolean }) {
	const { resolvedTheme } = useTheme();
	const docsTheme = resolvedTheme === "light" ? "light" : "dark";
	return <Toaster richColors theme={isDocsRoute ? docsTheme : "light"} />;
}

export default function Providers({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isDocsRoute = pathname === "/docs" || pathname.startsWith("/docs/");

	return (
		<RootProvider
			theme={{
				attribute: "class",
				defaultTheme: "dark",
				enableSystem: true,
				forcedTheme: isDocsRoute ? undefined : "light",
			}}
		>
			{children}
			<AppToaster isDocsRoute={isDocsRoute} />
		</RootProvider>
	);
}
