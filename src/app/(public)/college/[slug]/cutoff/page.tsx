import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Award, Filter } from "lucide-react";

export default async function CollegeCutoffPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const college = await db.college.findUnique({
    where: { slug },
    include: {
      courses: {
        include: {
          course: true,
          cutoffs: {
            include: { exam: true },
            orderBy: [{ academicYear: "desc" }, { counselingRound: "asc" }, { closingRank: "asc" }],
          },
        },
      },
    },
  });

  if (!college) notFound();

  // Flatten all cutoffs across courses
  const allCutoffs = college.courses.flatMap((c) =>
    c.cutoffs.map((ct) => ({
      ...ct,
      courseName: `${c.course.degree} in ${c.specialization}`,
    }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
          {college.name} Cutoff 2026 / 2025: Opening & Closing Ranks
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Official round-wise closing ranks for General, OBC, SC, ST and EWS categories across Home State and All India quotas.
        </p>
      </div>

      {allCutoffs.length > 0 ? (
        <div className="bg-card border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Academic Year</th>
                  <th className="p-4">Degree & Branch</th>
                  <th className="p-4">Exam</th>
                  <th className="p-4">Round</th>
                  <th className="p-4">Quota</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Opening Rank</th>
                  <th className="p-4">Closing Rank</th>
                </tr>
              </thead>
              <tbody className="divide-y text-foreground">
                {allCutoffs.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-bold">{item.academicYear}</td>
                    <td className="p-4 font-semibold text-foreground">
                      {item.courseName}
                    </td>
                    <td className="p-4 font-bold uppercase text-[10px] text-primary">
                      {item.exam.slug.replace("-", " ")}
                    </td>
                    <td className="p-4">Round {item.counselingRound}</td>
                    <td className="p-4 font-semibold">{item.quota}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-muted font-bold">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {item.openingRank ? `#${item.openingRank.toLocaleString()}` : "—"}
                    </td>
                    <td className="p-4 font-bold text-emerald-600">
                      {item.closingRank
                        ? `#${item.closingRank.toLocaleString()}`
                        : item.cutoffPercentile
                        ? `${item.cutoffPercentile}%ile`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-8 border rounded-2xl bg-card text-center text-xs text-muted-foreground">
          Cutoff data is currently being updated for the latest counseling cycle.
        </div>
      )}
    </div>
  );
}

