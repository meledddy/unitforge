import type { MetadataRoute } from "next";

const publicRoutes = [
  "",
  "/request-access",
  "/contact",
  "/privacy",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return publicRoutes.map((route, index) => ({
    url: new URL(route || "/", baseUrl).toString(),
    changeFrequency: index < 2 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : index < 3 ? 0.8 : 0.5,
  }));
}
