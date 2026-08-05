import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/pricing",
        "/contact",
        "/privacy",
        "/terms",
        "/request-access",
        "/price-sheets/",
      ],
      disallow: ["/app/", "/login", "/api/"],
    },
    sitemap: new URL("/sitemap.xml", baseUrl).toString(),
  };
}
