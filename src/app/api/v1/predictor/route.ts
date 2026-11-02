import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const PredictorSchema = z.object({
  examSlug: z.string().default("jee-main"),
  rank: z.coerce.number().min(1, "Rank must be at least 1"),
  category: z.string().default("GEN"),
  quota: z.string().default("AI"),
  homeState: z.string().optional().nullable(),
  targetCourse: z.string().optional().nullable(),
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

    const { examSlug, rank, category, quota, homeState, targetCourse } = parsed.data;

    // Find the exam
    const exam = await db.exam.findUnique({
      where: { slug: examSlug },
    });

    if (!exam) {
      return NextResponse.json({ error: "Selected entrance examination not found." }, { status: 404 });
    }

    // Query historical cutoffs for this exam matching category & quotas
    const whereConditions: any = {
      examId: exam.id,
      category: { equals: category, mode: "insensitive" },
    };

    if (quota && quota !== "ALL") {
      whereConditions.quota = { in: [quota, "AI"] };
    }

    const cutoffs = await db.examCutoff.findMany({
      where: whereConditions,
      include: {
        collegeCourse: {
          include: {
            college: true,
            course: true,
          },
        },
      },
      orderBy: { closingRank: "asc" },
      take: 60,
    });

    // Optional filter by target course / stream if specified
    const filteredCutoffs = targetCourse && targetCourse !== "ALL"
      ? cutoffs.filter((c) =>
          c.collegeCourse.specialization.toLowerCase().includes(targetCourse.toLowerCase()) ||
          c.collegeCourse.course.degree.toLowerCase().includes(targetCourse.toLowerCase()) ||
          c.collegeCourse.course.stream.toLowerCase().includes(targetCourse.toLowerCase())
        )
      : cutoffs;

    if (filteredCutoffs.length === 0) {
      return NextResponse.json({
        success: true,
        insufficientData: true,
        message: "Sufficient verified historical cutoff data is not currently available for this exact combination. Predictions cannot be reliably determined. Please consult an official admissions counselor.",
        query: { examSlug, rank, category, quota, homeState, targetCourse },
        totalFound: 0,
        predictions: {
          highChance: [],
          moderateChance: [],
          lowChance: [],
        },
      });
    }

    const highProbability: any[] = [];
    const moderateProbability: any[] = [];
    const lowProbability: any[] = [];

    filteredCutoffs.forEach((item) => {
      const closing = item.closingRank || 999999;
      const option = {
        id: item.id,
        collegeName: item.collegeCourse.college.name,
        collegeShortName: item.collegeCourse.college.shortName,
        collegeSlug: item.collegeCourse.college.slug,
        city: item.collegeCourse.college.city,
        state: item.collegeCourse.college.state,
        logoUrl: item.collegeCourse.college.logoUrl,
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
        eligibility: item.collegeCourse.eligibilityCriteria,
      };

      // Classification based on student AIR compared to closing rank
      if (closing >= rank * 1.15) {
        highProbability.push({ ...option, chanceCategory: "High Chance" });
      } else if (closing >= rank * 0.9) {
        moderateProbability.push({ ...option, chanceCategory: "Moderate Chance" });
      } else {
        lowProbability.push({ ...option, chanceCategory: "Low Chance" });
      }
    });

    return NextResponse.json({
      success: true,
      insufficientData: false,
      query: { examSlug, rank, category, quota, homeState, targetCourse },
      totalFound: filteredCutoffs.length,
      predictions: {
        highChance: highProbability.slice(0, 15),
        moderateChance: moderateProbability.slice(0, 15),
        lowChance: lowProbability.slice(0, 15),
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
