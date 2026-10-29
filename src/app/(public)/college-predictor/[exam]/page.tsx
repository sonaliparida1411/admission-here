import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { constructSeoMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { PredictorForm } from "@/components/public/PredictorForm";
import { Sparkles, Layers, ShieldCheck, Award } from "lucide-react";

export const revalidate = 3600;

interface PredictorPageProps {
  params: Promise<{ exam: string }>;
}

export async function generateMetadata({ params }: PredictorPageProps) {
  const { exam: examSlug } = await params;
  const exam = await db.exam.findUnique({
    where: { slug: examSlug },
  });

  const examName = exam ? exam.name : examSlug.toUpperCase();

  return constructSeoMetadata({
    title: `${examName} College Predictor 2026: Calculate Your Admission Chances`,
    description: `Free algorithmic college predictor for ${examName}. Enter your rank, category, and state quota to get high, medium, and aspirational college admission probabilities.`,
    canonicalPath: `/college-predictor/${examSlug}`,
  });
}

export default async function CollegePredictorPage({ params }: PredictorPageProps) {
  const { exam: examSlug } = await params;

  const exam = await db.exam.findUnique({
    where: { slug: examSlug },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs
        items={[
          { label: "College Predictor", href: `/college-predictor/${examSlug}` },
          { label: exam?.name || examSlug.toUpperCase() },
        ]}
      />

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>JoSAA & CSAB Verified Historical Cutoff Engine</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          {exam?.name || examSlug.toUpperCase()} College Predictor 2026
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Predict your admission chances at top NITs, IIITs, CFTIs, and state universities using official previous year closing ranks, reservation categories, and home state quotas.
        </p>
      </div>

      <PredictorForm initialExamSlug={examSlug} />
    </div>
  );
}

