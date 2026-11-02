import { db } from "@/lib/db";
import { checkAdminAccess } from "@/lib/auth/staff-guard";
import { StaffAccessDenied } from "@/components/admin/StaffAccessDenied";
import { StaffApprovalClient } from "./StaffApprovalClient";
import { CheckSquare, Clock, ShieldCheck } from "lucide-react";

export const revalidate = 0;

export default async function AdminApprovalsPage() {
  const access = await checkAdminAccess("colleges");
  if (!access.allowed) {
    return (
      <StaffAccessDenied
        featureName="Staff Approval & Publishing Console"
        allowedFeatures={access.permissions}
      />
    );
  }

  const where: any = {};
  if (access.role === "STAFF") {
    where.staffId = access.userId;
  }

  const [requests, activityLogs] = await Promise.all([
    db.collegeApprovalRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        staff: { select: { id: true, name: true, email: true } },
        college: { select: { id: true, name: true, slug: true, city: true, state: true } },
        reviewedBy: { select: { id: true, name: true } },
      },
      take: 100,
    }),
    db.staffActivityLog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        staff: { select: { name: true, email: true } },
      },
      take: 30,
    }),
  ]);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Staff Activity &amp; Approval Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Two-tier editorial publishing workflow: Review staff submissions, preview draft changes, and publish approved versions live.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center gap-1.5 border border-primary/20">
            <ShieldCheck className="w-4 h-4" />
            <span>{access.isSuperAdmin ? "Administrator Review Mode" : "Staff Submissions Mode"}</span>
          </span>
        </div>
      </div>

      <StaffApprovalClient
        initialRequests={requests as any}
        initialLogs={activityLogs as any}
        isSuperAdmin={access.isSuperAdmin}
      />
    </div>
  );
}

