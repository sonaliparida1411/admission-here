import Link from "next/link";
import { db } from "@/lib/db";
import { BookOpen, Calendar, Clock, Award, Layers } from "lucide-react";
import { checkAdminAccess } from "@/lib/auth/staff-guard";
import { StaffAccessDenied } from "@/components/admin/StaffAccessDenied";

export const revalidate = 0;

export default async function AdminExamsPage() {
  const access = await checkAdminAccess("exams");
  if (!access.allowed) {
    return (
      <StaffAccessDenied
        featureName="Entrance Exams"
        allowedFeatures={access.permissions}
      />
    );
  }

  const exams = await db.exam.findMany({
    include: {
      _count: {
        select: { cutoffs: true, blogPosts: true },
      },
    },
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Entrance Exams & Cutoff Matrix Manager
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Maintain national examinations, counseling schedules, syllabus schemas, and rank predictor matrices.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="p-6 rounded-2xl border bg-card shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                  {exam.stream}
                </span>
                <span className="text-xs text-muted-foreground">{exam.examLevel}</span>
              </div>

              <h3 className="font-bold text-base text-foreground">{exam.name}</h3>
              <p className="text-xs text-muted-foreground">
                Conducting: <strong>{exam.conductingBody}</strong>
              </p>
            </div>

            <div className="space-y-2 text-xs border-t pt-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exam Date:</span>
                <span className="font-semibold text-foreground">
                  {exam.examDate ? new Date(exam.examDate).toLocaleDateString() : "TBA"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cutoff Data Points:</span>
                <span className="font-bold text-emerald-600">
                  {exam._count.cutoffs} round benchmarks
                </span>
              </div>
            </div>

            <div className="pt-2 border-t flex justify-end gap-2">
              <Link
                href={`/exams/${exam.slug}`}
                target="_blank"
                className="px-3 py-1.5 rounded-lg border text-xs font-semibold hover:bg-accent text-foreground"
              >
                View Hub
              </Link>
              <Link
                href={`/college-predictor/${exam.slug}`}
                target="_blank"
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90"
              >
                Test Predictor
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

