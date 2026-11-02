import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://admissionshub.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/colleges/", "/college/", "/blog/", "/llms.txt", "/llms-full.txt"],
        disallow: [
          "/admin/",
          "/partner/",
          "/api/v1/admin/",
          "/api/v1/cms/",
          "/api/auth/",
          "/api/v1/leads/",
        ],
      },
      {
        userAgent: [
          "GPTBot",
          "PerplexityBot",
          "ClaudeBot",
          "Applebot-Extended",
          "Google-Extended",
          "CCBot",
        ],
        allow: ["/", "/llms.txt", "/llms-full.txt", "/colleges/", "/college/", "/blog/"],
        disallow: ["/admin/", "/partner/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
