import { varlockNextConfigPlugin } from "@varlock/nextjs-integration/plugin";
import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withVarlock = varlockNextConfigPlugin();
const withMDX = createMDX();

const nextConfig: NextConfig = {
	allowedDevOrigins: ["equation-straw-bamboo.ngrok-free.dev"],
	reactCompiler: true,
	typedRoutes: true,
};

export default withVarlock(withMDX(nextConfig));
