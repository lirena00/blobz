import type { NextConfig } from "next";
import { varlockNextConfigPlugin } from "@varlock/nextjs-integration/plugin";

const withVarlock = varlockNextConfigPlugin();

const nextConfig: NextConfig = {
	allowedDevOrigins: ["equation-straw-bamboo.ngrok-free.dev"],
	reactCompiler: true,
	typedRoutes: true,
};

export default withVarlock(nextConfig);
