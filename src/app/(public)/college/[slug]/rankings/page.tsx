import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Award, ShieldCheck, Trophy, Globe } from "lucide-react";

export default async function CollegeRankingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const college = await db.college.findUnique({
    where: { slug },
    include: {
      rankings: {
        orderBy: [{ rankingYear: "desc" }, { rankNumber: "asc" }],
      },
    },
  });

  if (!college) notFound();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
          {college.name} Rankings & Accreditations 2026
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          National and international ranking trends from NIRF, IIRF, India Today, and NAAC accreditation grades.
        </p>
      </div>

      {/* NIRF Hero Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
            #{college.nirfRank || "Top"}
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              Ministry of Education, Govt. of India
            </span>
            <h3 className="font-extrabold text-lg text-foreground">
              NIRF India Rankings 2025: Engineering
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ranked among India&apos;s elite technical and research universities.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
            NAAC Grade {college.naacGrade || "A++"}
          </span>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="bg-card border rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-muted/40 border-b">
          <h3 className="font-bold text-sm text-foreground">
            Historical Ranking Benchmarks
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Agency / Publisher</th>
                <th className="p-4">Category</th>
                <th className="p-4">Year</th>
                <th className="p-4">National Rank</th>
                <th className="p-4">Out of Total Colleges</th>
              </tr>
            </thead>
            <tbody className="divide-y text-foreground">
              {college.rankings.map((r) => (
                <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-bold flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>{r.agencyName}</span>
                  </td>
                  <td className="p-4">{r.category}</td>
                  <td className="p-4 font-semibold">{r.rankingYear}</td>
                  <td className="p-4 font-extrabold text-sm text-amber-600">
                    #{r.rankNumber}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {r.outOfTotal ? `Top ${r.outOfTotal}` : "National Pool"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

