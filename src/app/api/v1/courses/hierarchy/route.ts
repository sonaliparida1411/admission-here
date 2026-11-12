import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  try {
    const courses = await db.course.findMany({
      include: {
        offerings: {
          include: {
            college: {
              select: {
                id: true,
                name: true,
                shortName: true,
                slug: true,
                city: true,
                state: true,
                logoUrl: true,
                nirfRank: true,
              },
            },
          },
          take: 6,
        },
      },
      orderBy: { fullName: "asc" },
    });

    const ugCourses = courses
      .filter((c) => c.level.toUpperCase() === "UG")
      .map((c) => ({
        id: c.id,
        slug: c.slug,
        degree: c.degree,
        stream: c.stream,
        fullName: c.fullName,
        colleges: c.offerings.map((o) => o.college).filter(Boolean),
      }));

    const pgCourses = courses
      .filter((c) => c.level.toUpperCase() === "PG")
      .map((c) => ({
        id: c.id,
        slug: c.slug,
        degree: c.degree,
        stream: c.stream,
        fullName: c.fullName,
        colleges: c.offerings.map((o) => o.college).filter(Boolean),
      }));

    return NextResponse.json({
      success: true,
      hierarchy: {
        ug: ugCourses,
        pg: pgCourses,
      },
    });
  } catch (error: any) {
    console.error("Course hierarchy API error:", error);
    return NextResponse.json({ success: false, error: "Failed to load course hierarchy" }, { status: 500 });
  }
}

