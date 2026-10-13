import type { Metadata, Viewport } from "next";
import {
	Bricolage_Grotesque,
	Geist,
	Geist_Mono,
	Inter,
} from "next/font/google";
import Script from "next/script";

import "../index.css";
import { cn } from "@blobz/ui/lib/utils";
import Header from "@/components/header";
import Providers from "@/components/providers";
import { SITE_URL } from "@/lib/site";

const GOOGLE_ANALYTICS_ID = "G-1K83GYYD16";

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
	alternates: { canonical: "/" },
	applicationName: "Blobz",
	description:
		"Playful, deterministic SVG avatars for default profile pictures. Generate the same unique avatar from any username, email, or ID.",
	metadataBase: SITE_URL,
	openGraph: {
		description:
			"Playful, deterministic SVG avatars for default profile pictures. Generate the same unique avatar from any username, email, or ID.",
		siteName: "Blobz",
		title: "Blobz: deterministic avatars worth keeping",
		type: "website",
		url: "/",
	},
	title: "Blobz: deterministic avatars worth keeping",
	twitter: {
		card: "summary_large_image",
		description:
			"Playful, deterministic SVG avatars for default profile pictures. Generate the same unique avatar from any username, email, or ID.",
		title: "Blobz: deterministic avatars worth keeping",
	},
};

export const viewport: Viewport = {
	initialScale: 1,
	interactiveWidget: "resizes-content",
	themeColor: "#38bdf8",
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
			{process.env.NODE_ENV === "production" ? (
				<>
					<Script id="google-analytics" strategy="afterInteractive">
						{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GOOGLE_ANALYTICS_ID}');
            `}
					</Script>
					<Script
						src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
						strategy="afterInteractive"
					/>
				</>
			) : null}
		</html>
	);
}
