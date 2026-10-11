import { varlockNextConfigPlugin } from "@varlock/nextjs-integration/plugin";
import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withVarlock = varlockNextConfigPlugin();
const withMDX = createMDX();

const nextConfig: NextConfig = {
	allowedDevOrigins: ["equation-straw-bamboo.ngrok-free.dev"],
	reactCompiler: true,
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
