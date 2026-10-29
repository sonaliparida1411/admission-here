import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://admissionshub.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/partner/", "/api/auth/"],
      },
      {
        userAgent: ["GPTBot", "PerplexityBot", "ClaudeBot", "Applebot-Extended"],
        allow: ["/", "/llms.txt", "/llms-full.txt", "/colleges/", "/blog/"],
        disallow: ["/admin/", "/partner/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

