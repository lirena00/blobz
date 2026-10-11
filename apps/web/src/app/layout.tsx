import type { Metadata, Viewport } from "next";
import {
	Bricolage_Grotesque,
	Geist,
	Geist_Mono,
	Inter,
} from "next/font/google";

import "../index.css";
import { cn } from "@blobz/ui/lib/utils";
import Header from "@/components/header";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
});

const bricolageGrotesque = Bricolage_Grotesque({
	subsets: ["latin"],
	variable: "--font-bricolage",
});

export const metadata: Metadata = {
	description:
		"Playful, deterministic SVG avatars for default profile pictures. Generate the same unique avatar from any username, email, or ID.",
	metadataBase: new URL("https://blobz.dev"),
	openGraph: {
		description:
			"Playful, deterministic SVG avatars for default profile pictures.",
		siteName: "Blobz",
		title: "Blobz — deterministic avatars worth keeping",
		type: "website",
	},
	title: "Blobz — deterministic avatars worth keeping",
	twitter: {
		card: "summary_large_image",
		description:
			"Playful, deterministic SVG avatars for default profile pictures.",
		title: "Blobz — deterministic avatars worth keeping",
	},
};

export const viewport: Viewport = {
	initialScale: 1,
	interactiveWidget: "resizes-content",
	themeColor: [
		{ color: "#f4fbff", media: "(prefers-color-scheme: light)" },
		{ color: "#f4fbff", media: "(prefers-color-scheme: dark)" },
	],
	viewportFit: "cover",
	width: "device-width",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			className={cn("font-sans", inter.variable)}
			data-scroll-behavior="smooth"
			lang="en"
			suppressHydrationWarning
		>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${bricolageGrotesque.variable} antialiased`}
			>
				<a
					className="fixed -top-16 left-4 z-[60] rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground text-sm focus:top-4 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
					href="#main-content"
				>
					Skip to content
				</a>
				<Providers>
					<div className="min-h-screen">
						<Header />
						<div className="scroll-mt-24" id="main-content">
							{children}
						</div>
					</div>
				</Providers>
			</body>
		</html>
	);
}
