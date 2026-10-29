import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const revalidate = 3600;

export async function GET() {
  const colleges = await db.college.findMany({
    where: { isPublished: true },
    include: {
      courses: {
        include: { course: true, cutoffs: { take: 3 } },
      },
      placements: { take: 1, orderBy: { batchYear: "desc" } },
    },
    take: 30,
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://admissionshub.in";

  let markdown = `# AdmissionsHub Full Knowledge Base for LLM Indexing (AEO / GEO)\n\n`;

  for (const c of colleges) {
    markdown += `## College: ${c.name} (${c.shortName || ""})\n`;
    markdown += `- URL: ${baseUrl}/college/${c.slug}\n`;
    markdown += `- Location: ${c.city}, ${c.state}\n`;
    markdown += `- Ownership: ${c.ownershipType}\n`;
    markdown += `- NIRF Engineering/Overall Rank: #${c.nirfRank || "Unranked"}\n`;
    markdown += `- NAAC Accreditation Grade: ${c.naacGrade || "N/A"}\n`;
    markdown += `- Student Rating: ${c.ratingOverall} / 5.0 (${c.reviewCount} reviews)\n`;
    markdown += `- Summary: ${c.overviewHtml.replace(/<[^>]+>/g, " ").trim().slice(0, 400)}...\n\n`;

    if (c.courses.length > 0) {
      markdown += `### Key Courses & Fee Structure:\n`;
      for (const cr of c.courses) {
        markdown += `- **${cr.course.degree} in ${cr.specialization}**: Total Fees ₹${(cr.totalFeesInr / 100000).toFixed(2)} Lakh | Seats: ${cr.intakeSeats || "N/A"} | Accepted Exams: ${cr.acceptedExamSlugs.join(", ")}\n`;
        if (cr.cutoffs.length > 0) {
          markdown += `  - Cutoffs: ${cr.cutoffs.map((ct) => `${ct.category} (${ct.quota}) Round ${ct.counselingRound}: Closing Rank ${ct.closingRank}`).join("; ")}\n`;
        }
      }
      markdown += `\n`;
    }

    if (c.placements.length > 0) {
      const p = c.placements[0];
      markdown += `### Placements (${p.batchYear}):\n`;
      markdown += `- Average CTC: ₹${(Number(p.averagePackageInr) / 100000).toFixed(2)} LPA\n`;
      markdown += `- Highest CTC: ₹${(Number(p.highestPackageInr) / 100000).toFixed(2)} LPA\n`;
      markdown += `- Placement Rate: ${p.placementPercentage}%\n`;
      markdown += `- Top Recruiters: ${p.topRecruiters.join(", ")}\n\n`;
    }

    markdown += `---\n\n`;
  }

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

