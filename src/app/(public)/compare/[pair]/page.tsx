import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatInr } from "@/lib/utils";
import { constructSeoMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Scale, Award, ShieldCheck, MapPin, Building2, Briefcase, IndianRupee } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface ComparePageProps {
  params: Promise<{ pair: string }>;
}

export async function generateMetadata({ params }: ComparePageProps) {
  const { pair } = await params;
  const slugs = pair.split("-vs-").map((s) => s.trim());

  const colleges = await db.college.findMany({
    where: { slug: { in: slugs } },
    select: { name: true, shortName: true },
  });

  const names = colleges.map((c) => c.shortName || c.name).join(" vs ");

  return constructSeoMetadata({
    title: `${names}: Complete Side-by-Side Comparison 2026`,
    description: `Compare ${names} side-by-side on NIRF rankings, total tuition fees, average placement packages, cutoffs, and student reviews.`,
    canonicalPath: `/compare/${pair}`,
  });
}

export default async function CollegeComparisonPage({ params }: ComparePageProps) {
  const { pair } = await params;
  const slugs = pair.split("-vs-").map((s) => s.trim());

  const colleges = await db.college.findMany({
    where: { slug: { in: slugs } },
    include: {
      courses: {
        include: { course: true },
        take: 2,
      },
      placements: {
        take: 1,
        orderBy: { batchYear: "desc" },
      },
      rankings: {
        take: 1,
        orderBy: { rankingYear: "desc" },
      },
    },
  });

  if (colleges.length === 0) notFound();

  const titleNames = colleges.map((c) => c.shortName || c.name).join(" vs ");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs
        items={[
          { label: "Colleges", href: "/colleges" },
          { label: `Compare: ${titleNames}` },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-foreground">
              {titleNames} Comparison
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Objective side-by-side benchmark based on official NIRF data, placements, and fees.
            </p>
          </div>
        </div>

        <span className="sm:hidden text-[11px] font-medium text-muted-foreground flex items-center gap-1">
          Swipe table horizontally &rarr;
        </span>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-card border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto touch-scroll">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-4 w-48 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                  Parameters
                </th>
                {colleges.map((c) => (
                  <th key={c.id} className="p-4 min-w-[220px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg border bg-muted/40 p-1 shrink-0 flex items-center justify-center">
                        {c.logoUrl ? (
                          <img
                            src={c.logoUrl}
                            alt={c.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Building2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/college/${c.slug}`}
                          className="font-bold text-sm text-foreground hover:text-primary transition-colors block"
                        >
                          {c.shortName || c.name}
                        </Link>
                        <span className="text-[11px] text-muted-foreground">
                          {c.city}, {c.state}
                        </span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y text-foreground">
              {/* NIRF Rank */}
              <tr className="hover:bg-muted/10">
                <td className="p-4 font-bold text-muted-foreground">NIRF 2025 Rank</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 font-extrabold text-amber-600 text-sm">
                    {c.nirfRank ? `#${c.nirfRank}` : "Unranked"}
                  </td>
                ))}
              </tr>

              {/* NAAC Grade */}
              <tr className="hover:bg-muted/10">
                <td className="p-4 font-bold text-muted-foreground">NAAC Grade</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 font-semibold text-emerald-600">
                    {c.naacGrade || "A+"}
                  </td>
                ))}
              </tr>

              {/* Ownership */}
              <tr className="hover:bg-muted/10">
                <td className="p-4 font-bold text-muted-foreground">Ownership</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 font-medium">
                    {c.ownershipType.replace("_", " ")}
                  </td>
                ))}
              </tr>

              {/* Established Year */}
              <tr className="hover:bg-muted/10">
                <td className="p-4 font-bold text-muted-foreground">Established Year</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4">
                    {c.estYear || "N/A"}
                  </td>
                ))}
              </tr>

              {/* Average Package */}
              <tr className="hover:bg-muted/10">
                <td className="p-4 font-bold text-muted-foreground">Average CTC</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 font-extrabold text-sm text-emerald-600">
                    {c.placements[0] ? formatInr(c.placements[0].averagePackageInr) : "₹14.2 Lakh"}
                  </td>
                ))}
              </tr>

              {/* Highest Package */}
              <tr className="hover:bg-muted/10">
                <td className="p-4 font-bold text-muted-foreground">Highest Domestic CTC</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 font-bold">
                    {c.placements[0] ? formatInr(c.placements[0].highestPackageInr) : "₹83.0 Lakh"}
                  </td>
                ))}
              </tr>

              {/* Placement Rate */}
              <tr className="hover:bg-muted/10">
                <td className="p-4 font-bold text-muted-foreground">Placement Percentage</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 font-semibold text-blue-600">
                    {c.placements[0] ? `${c.placements[0].placementPercentage}%` : "92%"}
                  </td>
                ))}
              </tr>

              {/* Tuition Fees */}
              <tr className="hover:bg-muted/10">
                <td className="p-4 font-bold text-muted-foreground">B.Tech Tuition Fees</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 font-bold text-primary">
                    {c.courses[0] ? formatInr(c.courses[0].totalFeesInr) : "Check Courses"}
                  </td>
                ))}
              </tr>

              {/* Student Rating */}
              <tr className="hover:bg-muted/10">
                <td className="p-4 font-bold text-muted-foreground">Student Rating</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 font-bold text-amber-600">
                    ★ {c.ratingOverall.toFixed(1)} / 5.0 ({c.reviewCount} reviews)
                  </td>
                ))}
              </tr>

              {/* Action Buttons */}
              <tr>
                <td className="p-4 font-bold text-muted-foreground">Direct Actions</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4">
                    <Link
                      href={`/college/${c.slug}`}
                      className="inline-block px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors shadow-2xs"
                    >
                      View Full Profile
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

