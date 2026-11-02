import { db } from "@/lib/db";
import { checkAdminAccess } from "@/lib/auth/staff-guard";
import { StaffAccessDenied } from "@/components/admin/StaffAccessDenied";
import { EnquiriesManagementClient } from "./EnquiriesManagementClient";
import { Contact2, FileText, Send, Sparkles } from "lucide-react";

export const revalidate = 0;

export default async function AdminEnquiriesPage() {
  const access = await checkAdminAccess("leads");
  if (!access.allowed) {
    return (
      <StaffAccessDenied
        featureName="Enquiry Management Desk"
        allowedFeatures={access.permissions}
      />
    );
  }

  const [leads, colleges] = await Promise.all([
    db.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        targetCollege: { select: { id: true, name: true, slug: true, city: true, state: true } },
      },
      take: 200,
    }),
    db.college.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const brochureCount = leads.filter((l) => l.ctaType === "DOWNLOAD_BROCHURE").length;
  const applyCount = leads.filter((l) => l.ctaType === "APPLY_NOW").length;

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Enquiry Management Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Dedicated administrative console tracking direct brochure download inquiries and 3-field admission applications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold text-xs flex items-center gap-1.5 border border-blue-500/20">
            <FileText className="w-3.5 h-3.5" />
            <span>{brochureCount} Brochure Downloads</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-700 dark:text-red-400 font-bold text-xs flex items-center gap-1.5 border border-red-500/20">
            <Send className="w-3.5 h-3.5" />
            <span>{applyCount} Direct Applications</span>
          </span>
        </div>
      </div>

      <EnquiriesManagementClient
        initialLeads={leads as any}
        colleges={colleges}
      />
    </div>
  );
}

