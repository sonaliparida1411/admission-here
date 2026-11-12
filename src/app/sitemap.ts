import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 86400; // 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://admissionshub.in";

  // Static high priority roots
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/colleges`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/college-predictor/jee-main`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];

  try {
    // College routes + 9 Sub-tabs
    const colleges = await db.college.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });

    const collegeTabs = [
      "",
      "/courses-fees",
      "/admission",
      "/cutoff",
      "/placements",
      "/rankings",
      "/gallery",
      "/reviews",
      "/qna",
    ];

    const collegeRoutes: MetadataRoute.Sitemap = colleges.flatMap((c) => [
      {
        url: `${baseUrl}/colleges/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
      ...collegeTabs.map((tab) => ({
        url: `${baseUrl}/college/${c.slug}${tab}`,
        lastModified: c.updatedAt,
        changeFrequency: tab === "" ? ("daily" as const) : ("weekly" as const),
        priority: tab === "" ? 0.9 : 0.7,
      })),
    ]);

    // Blog posts
    const blogs = await db.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });

    const blogRoutes: MetadataRoute.Sitemap = blogs.map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Exams
    const exams = await db.exam.findMany({
      select: { slug: true },
    });

    const examRoutes: MetadataRoute.Sitemap = exams.map((e) => ({
      url: `${baseUrl}/exams/${e.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...collegeRoutes, ...blogRoutes, ...examRoutes];
  } catch (error) {
    console.warn("Database not available during sitemap generation, returning static roots:", error);
    return staticRoutes;
  }
}
