import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Save, Building2, UploadCloud, CheckCircle } from "lucide-react";

interface ProfilePageProps {
  params: Promise<{ collegeId: string }>;
}

export default async function PartnerProfilePage({ params }: ProfilePageProps) {
  const { collegeId } = await params;

  const college = await db.college.findFirst({
    where: {
      OR: [
        { slug: collegeId },
        ...(collegeId.length === 36 ? [{ id: collegeId }] : []),
      ],
    },
    include: { courses: { include: { course: true } } },
  });

  if (!college) notFound();

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/partner/${college.slug}`}
          className="p-2 rounded-lg border hover:bg-accent text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Propose Institutional Profile & Fee Updates
          </h1>
          <p className="text-xs text-muted-foreground">
            Institute: <strong>{college.name}</strong> • City: {college.city}, {college.state}
          </p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 leading-relaxed">
          <strong>Notice for Partner Institutes:</strong> Proposed fee adjustments, placement record audits, and updated 2026 brochures are reviewed by AdmissionsHub Editorial Desk within 24 business hours prior to live publication.
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-sm text-foreground">
            Update Program Tuition Fees
          </h3>

          <div className="space-y-3">
            {college.courses.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-foreground">
                    {c.course.degree} in {c.specialization}
                  </h4>
                  <p className="text-muted-foreground">
                    Current Listed Fee: ₹{(c.totalFeesInr / 100000).toFixed(2)} Lakh
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={c.totalFeesInr}
                    className="w-32 text-xs border rounded-lg px-3 py-1.5 bg-background font-mono"
                  />
                  <span className="text-[11px] text-muted-foreground">INR</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brochure Upload Proposal */}
        <div className="border-t pt-6 space-y-3">
          <h3 className="font-bold text-sm text-foreground">
            Upload 2026 Official PDF Brochure
          </h3>
          <div className="border-2 border-dashed rounded-xl p-8 text-center text-xs space-y-2 hover:border-primary/50 transition-colors">
            <UploadCloud className="w-8 h-8 mx-auto text-muted-foreground" />
            <p className="font-semibold text-foreground">
              Drag and drop updated admission brochure PDF here, or click to browse
            </p>
            <p className="text-[11px] text-muted-foreground">
              Maximum file size: 25 MB (PDF format only)
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link
            href={`/partner/${college.slug}`}
            className="px-4 py-2 rounded-lg border text-xs font-semibold hover:bg-accent text-foreground"
          >
            Cancel
          </Link>
          <button
            type="button"
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Submit Updates for Verification</span>
          </button>
        </div>
      </div>
    </div>
  );
}

