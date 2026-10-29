import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CheckCircle2, Calendar, FileText, ArrowRight } from "lucide-react";

export default async function CollegeAdmissionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const college = await db.college.findUnique({
    where: { slug },
  });

  if (!college) notFound();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
          {college.name} Admission Process 2026
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Complete step-by-step application guidelines, counseling rounds, and selection criteria.
        </p>
      </div>

      {college.admissionHtml ? (
        <div
          className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed p-6 bg-card border rounded-2xl shadow-xs"
          dangerouslySetInnerHTML={{ __html: college.admissionHtml }}
        />
      ) : (
        <div className="bg-card border rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="font-bold text-base text-foreground">Admissions Overview</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Admissions to undergraduate B.Tech programs at {college.name} are conducted strictly through centralized counseling rounds based on entrance exam merit. Candidates must fulfill the minimum 75% aggregate requirement in Class 12 board examinations (or be in the top 20 percentile).
          </p>
        </div>
      )}

      {/* Step-by-Step Flow */}
      <div className="bg-card border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <h3 className="font-bold text-base text-foreground">
          Step-by-Step JoSAA / Institutional Counseling Procedure
        </h3>

        <div className="space-y-4">
          {[
            {
              step: "1",
              title: "Entrance Exam Qualification",
              desc: "Appear for JEE Main / BITSAT / CAT and score above the official qualifying cutoff percentile.",
            },
            {
              step: "2",
              title: "Online Choice Filling & Locking",
              desc: `Register on the centralized counseling portal and submit ${college.name} with your preferred branch order.`,
            },
            {
              step: "3",
              title: "Seat Allotment & Document Verification",
              desc: "Review allotted seat, pay the seat acceptance fee, and complete online document verification.",
            },
            {
              step: "4",
              title: "Physical Campus Reporting",
              desc: "Report to the institute with original certificates, medical fitness proof, and fee receipt for final enrollment.",
            },
          ].map((s) => (
            <div key={s.step} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0">
                {s.step}
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">{s.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

