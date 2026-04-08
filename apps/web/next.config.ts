import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@unitforge/analytics", "@unitforge/billing", "@unitforge/config", "@unitforge/core", "@unitforge/db", "@unitforge/ui"],
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
