import { db } from "@/lib/db";
import { LeadCrmKanban } from "@/components/admin/LeadCrmKanban";
import { Contact2, TrendingUp, Users } from "lucide-react";
import { checkAdminAccess } from "@/lib/auth/staff-guard";
import { StaffAccessDenied } from "@/components/admin/StaffAccessDenied";

export const revalidate = 0;

export default async function AdminLeadsPage() {
  const access = await checkAdminAccess("leads");
  if (!access.allowed) {
    return (
      <StaffAccessDenied
        featureName="B2B Student Leads"
        allowedFeatures={access.permissions}
      />
    );
  }

  const leads = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      targetCollege: { select: { name: true, slug: true } },
      sourceBlog: { select: { title: true, slug: true } },
    },
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            B2B Student Lead CRM & Attribution Desk
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time pipeline routing for student applications, brochure downloads, blog CTA attribution, and counselor follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>{leads.length} Active Leads</span>
          </span>
        </div>
      </div>

      <LeadCrmKanban initialLeads={leads as any} />
    </div>
  );
}

