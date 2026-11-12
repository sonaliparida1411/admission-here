import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // 1 hour cache

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://admissionshub.in";

  try {
    const colleges = await db.college.findMany({
      where: { isPublished: true },
      select: { name: true, slug: true, city: true, state: true, nirfRank: true },
      orderBy: { nirfRank: "asc" },
    });

    const blogs = await db.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { title: true, slug: true, category: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
    });

    const exams = await db.exam.findMany({
      select: { name: true, slug: true, stream: true },
    });

    const content = `# AdmissionsHub LLM Manifest & Machine-Readable Directory
> AdmissionsHub is India's verified Higher Education Discovery Platform, featuring cutoff predictor engines, JoSAA/NEET cutoffs, NIRF rankings, and verified fee structures.

## Core Discovery Endpoints
- Homepage: ${baseUrl}/
- College Directory: ${baseUrl}/colleges
- Algorithmic Predictor: ${baseUrl}/college-predictor/jee-main
- Editorial & Live News: ${baseUrl}/blog
- Extended Full Knowledge Feed: ${baseUrl}/llms-full.txt

## Featured Colleges & Cutoffs
${colleges
  .map(
    (c) =>
      `- [${c.name} (${c.city}, ${c.state})](#nirf-${c.nirfRank || "na"}): ${baseUrl}/college/${c.slug}`
  )
  .join("\n")}

## Entrance Exams
${exams.map((e) => `- [${e.name} (${e.stream})]: ${baseUrl}/exams/${e.slug}`).join("\n")}

## Editorial Articles & Cutoff Analyses
${blogs.map((b) => `- [${b.title}]: ${baseUrl}/blog/${b.slug}`).join("\n")}

## API Access for AI Agents
- POST ${baseUrl}/api/v1/search/hybrid?q={query}
- POST ${baseUrl}/api/v1/predictor (JSON: examSlug, rank, category, quota)
- POST ${baseUrl}/api/v1/ai/counselor (JSON: query, profile)
`;

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.warn("Database not available during llms.txt generation, returning fallback:", error);
    return new NextResponse(`# AdmissionsHub LLM Manifest\nHomepage: ${baseUrl}/\n`, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
