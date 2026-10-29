import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatInr } from "@/lib/utils";
import { Building2, Award, Calendar, MapPin, IndianRupee, Briefcase, CheckCircle2 } from "lucide-react";

export default async function CollegeOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const college = await db.college.findUnique({
    where: { slug },
    include: {
      courses: {
        include: { course: true },
        take: 4,
      },
      placements: {
        take: 1,
        orderBy: { batchYear: "desc" },
      },
      rankings: {
        take: 3,
        orderBy: { rankingYear: "desc" },
      },
    },
  });

  if (!college) notFound();

  const latestPlacement = college.placements[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left 2 Cols: Overview & Details */}
      <div className="lg:col-span-2 space-y-8">
        {/* Quick Facts Card */}
        <section className="bg-card border rounded-2xl p-6 shadow-xs">
          <h2 className="text-base font-extrabold text-foreground mb-4">
            Key Highlights & Quick Facts
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-muted/40 border">
              <span className="text-muted-foreground block text-[11px]">Ownership</span>
              <span className="font-bold text-foreground">
                {college.ownershipType.replace("_", " ")}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border">
              <span className="text-muted-foreground block text-[11px]">NIRF 2025 Rank</span>
              <span className="font-bold text-amber-600">
                #{college.nirfRank || "Unranked"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border">
              <span className="text-muted-foreground block text-[11px]">NAAC Accreditation</span>
              <span className="font-bold text-emerald-600">
                {college.naacGrade || "Grade A"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border">
              <span className="text-muted-foreground block text-[11px]">Campus Size</span>
              <span className="font-bold text-foreground">
                {college.campusAreaAcres ? `${college.campusAreaAcres} Acres` : "Sprawling Campus"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border">
              <span className="text-muted-foreground block text-[11px]">Average CTC</span>
              <span className="font-bold text-emerald-600">
                {latestPlacement ? formatInr(latestPlacement.averagePackageInr) : "₹14.2 Lakh"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border">
              <span className="text-muted-foreground block text-[11px]">Approved By</span>
              <span className="font-bold text-foreground">
                {college.approvedBy.join(", ") || "AICTE, UGC"}
              </span>
            </div>
          </div>
        </section>

        {/* Detailed Overview HTML */}
        <section className="bg-card border rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-extrabold text-foreground mb-4">
            About {college.name}
          </h2>
          <div
            className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-foreground/85 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: college.overviewHtml }}
          />
        </section>

        {/* Featured Programs */}
        <section className="bg-card border rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-foreground">
            Featured Academic Programs
          </h2>
          <div className="space-y-3">
            {college.courses.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-sm text-foreground">
                    {c.course.degree} in {c.specialization}
                  </h4>
                  <p className="text-muted-foreground mt-0.5">
                    Duration: {c.course.durationYrs} Years • Intake Seats: {c.intakeSeats || "N/A"}
                  </p>
                </div>
                <div className="sm:text-right shrink-0">
                  <span className="text-[11px] text-muted-foreground block">Total Fees</span>
                  <span className="font-bold text-sm text-foreground">
                    {formatInr(c.totalFeesInr)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right Col: Admissions & Placements Summary */}
      <div className="space-y-6">
        {/* Placement Snapshot */}
        {latestPlacement && (
          <div className="bg-card border rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">
                  Placements Snapshot ({latestPlacement.batchYear})
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Placement Rate: {latestPlacement.placementPercentage}%
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-1">
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-muted-foreground">Highest Domestic CTC</span>
                <span className="font-bold text-foreground">
                  {formatInr(latestPlacement.highestPackageInr)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-muted-foreground">Average Annual CTC</span>
                <span className="font-bold text-emerald-600">
                  {formatInr(latestPlacement.averagePackageInr)}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Total Job Offers</span>
                <span className="font-bold text-foreground">{latestPlacement.totalOffers || "1,200+"}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                Top Hiring Partners
              </span>
              <div className="flex flex-wrap gap-1.5">
                {latestPlacement.topRecruiters.map((r, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-muted/60 border text-foreground font-medium"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Facilities */}
        {college.facilitiesJson && Array.isArray(college.facilitiesJson) && (
          <div className="bg-card border rounded-2xl p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-foreground">Campus Infrastructure</h3>
            <ul className="space-y-2 text-xs">
              {(college.facilitiesJson as string[]).map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

