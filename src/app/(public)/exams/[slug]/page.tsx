import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { constructSeoMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { BookOpen, Calendar, Clock, Award, Building2, ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface ExamPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ExamPageProps) {
  const { slug } = await params;
  const exam = await db.exam.findUnique({
    where: { slug },
  });

  if (!exam) {
    return constructSeoMetadata({
      title: "Exam Not Found",
      description: "Requested entrance exam details not found.",
    });
  }

  return constructSeoMetadata({
    title: `${exam.name} 2026: Exam Dates, Syllabus, Pattern & Cutoffs`,
    description: `Complete guide for ${exam.name} conducted by ${exam.conductingBody}. Check application deadlines, syllabus, exam pattern, and participating colleges.`,
    canonicalPath: `/exams/${slug}`,
  });
}

export default async function ExamHubPage({ params }: ExamPageProps) {
  const { slug } = await params;

  const exam = await db.exam.findUnique({
    where: { slug },
    include: {
      cutoffs: {
        take: 5,
        include: {
          collegeCourse: {
            include: {
              college: true,
              course: true,
            },
          },
        },
      },
    },
  });

  if (!exam) notFound();

  const pattern = (exam.patternJson as Record<string, any>) || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: "Entrance Exams", href: "/exams/jee-main" },
          { label: exam.name },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-card border rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">
            {exam.stream} Entrance Exam
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-muted-foreground">
            {exam.examLevel} Level
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          {exam.name}
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground">
          Conducting Body: <strong className="text-foreground">{exam.conductingBody}</strong>
        </p>

        {/* Date Timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t text-xs">
          <div className="p-3 rounded-xl bg-muted/40 border">
            <span className="text-muted-foreground block text-[11px]">Application Window</span>
            <span className="font-bold text-foreground">
              {exam.applicationStart ? new Date(exam.applicationStart).toLocaleDateString() : "Nov 2025"} –{" "}
              {exam.applicationEnd ? new Date(exam.applicationEnd).toLocaleDateString() : "Dec 2025"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border">
            <span className="text-muted-foreground block text-[11px]">Examination Date</span>
            <span className="font-bold text-primary">
              {exam.examDate ? new Date(exam.examDate).toLocaleDateString() : "Jan 2026"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border">
            <span className="text-muted-foreground block text-[11px]">Result Announcement</span>
            <span className="font-bold text-emerald-600">
              {exam.resultDate ? new Date(exam.resultDate).toLocaleDateString() : "Feb 2026"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border">
            <span className="text-muted-foreground block text-[11px]">Predictor Tool</span>
            <Link
              href={`/college-predictor/${exam.slug}`}
              className="font-bold text-amber-600 hover:underline block"
            >
              Open Predictor →
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Overview & Pattern */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="bg-card border rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="text-lg font-bold text-foreground">About the Examination</h2>
            <div
              className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: exam.overviewHtml }}
            />
          </div>

          {/* Syllabus */}
          {exam.syllabusHtml && (
            <div className="bg-card border rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
              <h2 className="text-lg font-bold text-foreground">Syllabus Breakdown</h2>
              <div
                className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: exam.syllabusHtml }}
              />
            </div>
          )}
        </div>

        {/* Right Col: Pattern & Quick Links */}
        <div className="space-y-6">
          <div className="bg-card border rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-foreground">Exam Pattern Highlights</h3>
            <div className="space-y-3 text-xs">
              {Object.entries(pattern).map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5 border-b">
                  <span className="text-muted-foreground capitalize">
                    {k.replace(/([A-Z])/g, " $1")}
                  </span>
                  <span className="font-bold text-foreground">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-950/20 via-purple-950/20 to-primary/10 border border-primary/20 rounded-2xl p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-foreground">
              Calculate Your Admissions Chance
            </h3>
            <p className="text-xs text-muted-foreground">
              Know where you stand with your {exam.name} rank or percentile.
            </p>
            <Link
              href={`/college-predictor/${exam.slug}`}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors shadow-2xs block text-center"
            >
              <span>Launch {exam.slug.toUpperCase()} Predictor</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

