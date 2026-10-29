import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Contact2, Building2, TrendingUp, Download, Phone, Mail, Award } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

interface PartnerPageProps {
  params: Promise<{ collegeId: string }>;
}

export default async function PartnerDashboardPage({ params }: PartnerPageProps) {
  const { collegeId } = await params;

  // Locate college by either ID or slug
  const college = await db.college.findFirst({
    where: {
      OR: [
        { slug: collegeId },
        ...(collegeId.length === 36 ? [{ id: collegeId }] : []),
      ],
    },
    include: {
      leads: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!college) notFound();

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Top Header */}
      <header className="h-16 border-b bg-card px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-foreground block">
              {college.name} Partner Portal
            </span>
            <span className="text-[10px] text-muted-foreground">
              Direct Counselor & Lead Management Center
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/partner/${college.slug}/profile`}
            className="px-3 py-1.5 rounded-lg border text-xs font-semibold hover:bg-accent text-foreground"
          >
            Propose Fee/Brochure Updates
          </Link>
          <Link
            href={`/college/${college.slug}`}
            target="_blank"
            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90"
          >
            View Live Public Profile
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-6 sm:p-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Assigned Student Applications & Leads
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time inquiries received from student portal &quot;Apply Now&quot; and &quot;Download Brochure&quot; CTAs.
          </p>
        </div>

        {/* Funnel Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Inquiries
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {college.leads.length}
            </div>
            <span className="text-[11px] text-muted-foreground">High-Intent Prospective Students</span>
          </div>

          <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              OTP Verified
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {college.leads.filter((l) => l.status !== "NEW").length}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">
              Ready for Counselor Calling
            </span>
          </div>

          <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Enrolled / Applied
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">
              {college.leads.filter((l) => l.status === "ENROLLED" || l.status === "APPLICATION_SUBMITTED").length}
            </div>
            <span className="text-[11px] text-muted-foreground">Final Stage Conversion</span>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-card border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Target Stream</th>
                  <th className="p-4">Exam Rank</th>
                  <th className="p-4">CTA Origin</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Inquiry Date</th>
                </tr>
              </thead>
              <tbody className="divide-y text-foreground">
                {college.leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-bold text-sm">{lead.studentName}</td>
                    <td className="p-4 font-mono">{lead.phone}</td>
                    <td className="p-4 text-muted-foreground">{lead.email}</td>
                    <td className="p-4 font-semibold">{lead.targetStream}</td>
                    <td className="p-4 text-amber-600 font-bold">{lead.examRankInfo || "—"}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-bold">
                        {lead.ctaType.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-primary/10 text-primary">
                        {lead.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

