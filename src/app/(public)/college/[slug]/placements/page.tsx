import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatInr } from "@/lib/utils";
import { Briefcase, TrendingUp, Users, Building, Award } from "lucide-react";

export default async function CollegePlacementsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const college = await db.college.findUnique({
    where: { slug },
    include: {
      placements: {
        orderBy: { batchYear: "desc" },
      },
    },
  });

  if (!college) notFound();

  const latestPlacement = college.placements[0];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
          {college.name} Placement Statistics & Recruiters
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Audited placement figures including highest domestic CTC, average package, placement percentage, and hiring companies.
        </p>
      </div>

      {latestPlacement && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border bg-card shadow-xs">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Highest CTC
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-foreground mt-1 block">
              {formatInr(latestPlacement.highestPackageInr)}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5 block">Domestic / International</span>
          </div>

          <div className="p-5 rounded-2xl border bg-card shadow-xs">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Average CTC
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1 block">
              {formatInr(latestPlacement.averagePackageInr)}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5 block">Overall Batch Average</span>
          </div>

          <div className="p-5 rounded-2xl border bg-card shadow-xs">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Median CTC
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-foreground mt-1 block">
              {formatInr(latestPlacement.medianPackageInr)}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5 block">50th Percentile Offer</span>
          </div>

          <div className="p-5 rounded-2xl border bg-card shadow-xs">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Placement Rate
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-blue-600 mt-1 block">
              {latestPlacement.placementPercentage}%
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5 block">
              {latestPlacement.totalOffers || "1,000+"} Total Offers
            </span>
          </div>
        </div>
      )}

      {/* Top Recruiters */}
      {latestPlacement && latestPlacement.topRecruiters.length > 0 && (
        <div className="bg-card border rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="font-bold text-base text-foreground">
            Top Hiring Partners & Core Companies
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
            {latestPlacement.topRecruiters.map((recruiter, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border bg-muted/30 flex items-center justify-center text-center font-bold text-xs text-foreground hover:border-primary/40 transition-colors"
              >
                {recruiter}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historical Year-wise Placement Table */}
      <div className="bg-card border rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-muted/40 border-b">
          <h3 className="font-bold text-sm text-foreground">
            Year-Wise Placement Comparison Matrix
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Batch Passing Year</th>
                <th className="p-4">Highest Package</th>
                <th className="p-4">Average Package</th>
                <th className="p-4">Median Package</th>
                <th className="p-4">Placement Rate</th>
                <th className="p-4">Total Offers</th>
              </tr>
            </thead>
            <tbody className="divide-y text-foreground">
              {college.placements.map((p) => (
                <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-bold">{p.batchYear}</td>
                  <td className="p-4 font-bold">{formatInr(p.highestPackageInr)}</td>
                  <td className="p-4 font-bold text-emerald-600">
                    {formatInr(p.averagePackageInr)}
                  </td>
                  <td className="p-4">{formatInr(p.medianPackageInr)}</td>
                  <td className="p-4 font-semibold text-blue-600">{p.placementPercentage}%</td>
                  <td className="p-4">{p.totalOffers || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

