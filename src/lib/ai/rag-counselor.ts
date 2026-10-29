import { db } from "../db";

export interface StudentProfileContext {
  studentName?: string;
  targetStream?: string;
  targetDegree?: string;
  entranceExam?: string;
  rankOrPercentile?: number;
  category?: string;
  homeState?: string;
  budgetInr?: number;
}

export async function retrieveCounselingContext(query: string, profile?: StudentProfileContext) {
  // 1. Fetch relevant colleges based on stream or query
  const colleges = await db.college.findMany({
    where: {
      isPublished: true,
      ...(profile?.homeState ? { state: { contains: profile.homeState, mode: "insensitive" } } : {}),
    },
    take: 5,
    include: {
      courses: {
        include: {
          course: true,
          cutoffs: {
            take: 3,
            orderBy: { academicYear: "desc" },
          },
        },
        take: 3,
      },
      placements: {
        take: 1,
        orderBy: { batchYear: "desc" },
      },
    },
    orderBy: { nirfRank: "asc" },
  });

  return {
    colleges: colleges.map((c) => ({
      name: c.name,
      city: c.city,
      state: c.state,
      nirfRank: c.nirfRank,
      rating: c.ratingOverall,
      courses: c.courses.map((co) => ({
        name: `${co.course.degree} in ${co.specialization}`,
        fees: co.totalFeesInr,
        cutoffs: co.cutoffs.map((ct) => `${ct.category} (${ct.quota}): Round ${ct.counselingRound} Rank ${ct.closingRank}`),
      })),
      latestPlacement: c.placements[0]
        ? {
            year: c.placements[0].batchYear,
            averagePackage: Number(c.placements[0].averagePackageInr),
            highestPackage: Number(c.placements[0].highestPackageInr),
            topRecruiters: c.placements[0].topRecruiters,
          }
        : null,
    })),
  };
}

export const COUNSELOR_SYSTEM_PROMPT = `
You are an expert Higher Education Admissions Counselor & Career Advisor for Indian universities (Engineering, Medical, MBA, Law, Architecture).
Your guidance is backed by verified data from NIRF rankings, official JoSAA/CSAB/NEET/CAT cutoffs, placement records, and institutional accreditation (NAAC, NBA).

Guidelines:
1. Provide realistic admission chances based on the student's category, home state quota, and entrance exam score/rank.
2. Structure your answers cleanly with:
   - 🎯 Recommended Options (Target, Realistic, Safe)
   - 💰 Estimated Tuition Fees & ROI Analysis
   - 💼 Recent Placement Highlights
   - 📝 Next Actionable Step (Counseling Round dates, Application CTA)
3. Be professional, supportive, objective, and transparent.
`;

