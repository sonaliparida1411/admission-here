import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const PredictorSchema = z.object({
  examSlug: z.string().default("jee-main"),
  rank: z.coerce.number().min(1, "Rank must be at least 1"),
  category: z.string().default("GEN"),
  quota: z.string().default("AI"),
  homeState: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = PredictorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid predictor inputs", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { examSlug, rank, category, quota, homeState } = parsed.data;

    // Find the exam
    const exam = await db.exam.findUnique({
      where: { slug: examSlug },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    // Query historical cutoffs for this exam matching category & quotas
    const cutoffs = await db.examCutoff.findMany({
      where: {
        examId: exam.id,
        category: { equals: category, mode: "insensitive" },
        ...(quota !== "ALL" ? { quota: { in: [quota, "AI"] } } : {}),
      },
      include: {
        collegeCourse: {
          include: {
            college: true,
            course: true,
          },
        },
      },
      orderBy: { closingRank: "asc" },
      take: 50,
    });

    const highProbability: any[] = [];
    const mediumProbability: any[] = [];
    const dreamOptions: any[] = [];

    cutoffs.forEach((item) => {
      const closing = item.closingRank || 999999;
      const option = {
        collegeName: item.collegeCourse.college.name,
        collegeSlug: item.collegeCourse.college.slug,
        city: item.collegeCourse.college.city,
        state: item.collegeCourse.college.state,
        nirfRank: item.collegeCourse.college.nirfRank,
        degree: item.collegeCourse.course.degree,
        specialization: item.collegeCourse.specialization,
        fees: item.collegeCourse.totalFeesInr,
        academicYear: item.academicYear,
        round: item.counselingRound,
        category: item.category,
        quota: item.quota,
        closingRank: closing,
        openingRank: item.openingRank,
      };

      if (closing >= rank * 1.15) {
        highProbability.push(option);
      } else if (closing >= rank * 0.9) {
        mediumProbability.push(option);
      } else {
        dreamOptions.push(option);
      }
    });

    return NextResponse.json({
      success: true,
      query: { examSlug, rank, category, quota, homeState },
      totalFound: cutoffs.length,
      predictions: {
        highChance: highProbability.slice(0, 10),
        mediumChance: mediumProbability.slice(0, 10),
        dreamChance: dreamOptions.slice(0, 10),
      },
    });
  } catch (error) {
    console.error("Predictor engine error:", error);
    return NextResponse.json(
      { error: "Error calculating admission predictions" },
      { status: 500 }
    );
  }
}

