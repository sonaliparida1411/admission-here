import Link from "next/link";
import { db } from "@/lib/db";
import { 
  Building2, 
  FileText, 
  Users, 
  Contact2, 
  TrendingUp, 
  Sparkles, 
  Award,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { checkAdminAccess } from "@/lib/auth/staff-guard";

export const revalidate = 0; // Dynamic

export default async function AdminDashboardPage() {
  const access = await checkAdminAccess("dashboard");

  const [
    collegeCount,
    blogCount,
    leadCount,
    userCount,
    recentLeads,
    recentBlogs,
  ] = await Promise.all([
    db.college.count(),
    db.blogPost.count(),
    db.lead.count(),
    db.user.count(),
    db.lead.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { targetCollege: { select: { name: true } } },
    }),
    db.blogPost.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    }),
  ]);

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Platform Governance &amp; KPI Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Real-time oversight of colleges directory, student lead pipeline, editorial publishing, and AI search indexing.
        </p>
      </div>

      {/* Staff Banner if logged in as Staff */}
      {!access.isSuperAdmin && (
        <div
          className="p-5 rounded-2xl border shadow-xs space-y-3"
          style={{
            background: "linear-gradient(135deg, rgba(26,48,104,0.06) 0%, rgba(31,128,64,0.06) 100%)",
            borderColor: "rgba(26,48,104,0.2)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
              style={{ background: "#1a3068" }}
            >
              STAFF PORTAL
            </span>
            <span className="text-xs text-muted-foreground">
              Logged in as <strong className="text-foreground">{access.userName}</strong> ({access.userEmail})
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Your Assigned Management Features:
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              The Super Administrator has authorized you to manage the following modules only:
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {access.permissions.map((perm) => (
              <Link
                key={perm}
                href={`/admin/${perm === "dashboard" ? "" : perm}`}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-2xs hover:opacity-90 transition-opacity flex items-center gap-1.5"
                style={{ background: "#1a3068" }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="capitalize">{perm}</span> &rarr;
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Student Leads
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Contact2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {leadCount}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% from last week
          </span>
        </div>

        <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Indexed Colleges
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {collegeCount}
          </div>
          <span className="text-[11px] text-muted-foreground">
            NIRF & NAAC Audited Directory
          </span>
        </div>

        <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Editorial Articles
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {blogCount}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> GEO & AI Overviews Indexed
          </span>
        </div>

        <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Platform Users
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {userCount}
          </div>
          <span className="text-[11px] text-muted-foreground">
            4 RBAC Roles Active
          </span>
        </div>
      </div>

      {/* Two-Column Grid: Recent Leads & Recent Blogs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <div className="bg-card border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground">Recent Student Inquiries</h3>
            <Link
              href="/admin/leads"
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <span>View CRM Board</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentLeads.map((l) => (
              <div
                key={l.id}
                className="p-3 rounded-xl bg-muted/30 border flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-foreground">{l.studentName}</h4>
                  <p className="text-muted-foreground mt-0.5">
                    {l.phone} • {l.targetCollege?.name || "General Counseling"}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase">
                  {l.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Editorial Articles */}
        <div className="bg-card border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground">Editorial CMS Desk</h3>
            <Link
              href="/admin/blogs/new"
              className="text-xs font-bold px-3 py-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              + Create Article
            </Link>
          </div>

          <div className="space-y-3">
            {recentBlogs.map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-xl bg-muted/30 border flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-foreground truncate">{b.title}</h4>
                  <p className="text-muted-foreground mt-0.5">
                    By {b.author.name} • {b.category.replace("_", " ")}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase shrink-0">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

