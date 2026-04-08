import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@unitforge/analytics", "@unitforge/billing", "@unitforge/config", "@unitforge/core", "@unitforge/ui"],
};

export default nextConfig;

