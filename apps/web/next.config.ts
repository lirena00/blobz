import { varlockNextConfigPlugin } from "@varlock/nextjs-integration/plugin";
import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withVarlock = varlockNextConfigPlugin();
const withMDX = createMDX();

const nextConfig: NextConfig = {
	allowedDevOrigins: ["equation-straw-bamboo.ngrok-free.dev"],
	reactCompiler: true,
	async redirects() {
		return [
			{
				destination: "/docs/components/avatar#status",
				permanent: true,
				source: "/docs/components/avatar-status",
			},
			{
				destination: "/docs/components/avatar#status",
				permanent: true,
				source: "/docs/components/presence-avatar",
			},
			{
				destination: "/docs/components/avatar-profile#badges",
				permanent: true,
				source: "/docs/components/avatar-badge",
			},
			{
				destination: "/docs/components/avatar-group#social-proof",
				permanent: true,
				source: "/docs/components/avatar-social-proof",
			},
		];
	},
	async rewrites() {
		return [
			{
				destination: "/llms.mdx/docs/:slug*/content.md",
				source: "/docs/:slug*.md",
			},
		];
	},
	typedRoutes: true,
};

export default withVarlock(withMDX(nextConfig));
