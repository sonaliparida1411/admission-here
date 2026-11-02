import Link from "next/link";
import { db } from "@/lib/db";
import { Building2, Plus, Award, CheckCircle2, Globe2, BookOpen } from "lucide-react";
import { checkAdminAccess } from "@/lib/auth/staff-guard";
import { StaffAccessDenied } from "@/components/admin/StaffAccessDenied";
import { AdminCollegeActions } from "./AdminCollegeActions";

export const revalidate = 0;

export default async function AdminCollegesPage() {
  const access = await checkAdminAccess("colleges");
  if (!access.allowed) {
    return (
      <StaffAccessDenied
        featureName="Colleges Directory"
        allowedFeatures={access.permissions}
      />
    );
  }

  const colleges = await db.college.findMany({
    orderBy: [{ nirfRank: "asc" }, { name: "asc" }],
    include: {
      _count: {
        select: { courses: true, reviews: true, leads: true },
      },
    },
  });

  const totalCount = colleges.length;
  const publishedCount = colleges.filter((c) => c.isPublished).length;
  const draftCount = totalCount - publishedCount;
  const rankedCount = colleges.filter((c) => c.nirfRank && c.nirfRank > 0).length;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Colleges Master Directory
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Manage institutional profiles, logos, campus gallery, fees, hostel, eligibility, and SEO discovery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/colleges/new"
            className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:bg-primary/90 transition-colors shadow-2xs cursor-pointer"
            style={{ background: "#1a3068" }}
          >
            <Plus className="w-4 h-4" />
            <span>Add New College</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-card shadow-2xs">
          <span className="text-xs font-semibold text-muted-foreground">Total Institutions</span>
          <p className="text-2xl font-black text-foreground mt-1">{totalCount}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Directory database</p>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-2xs">
          <span className="text-xs font-semibold text-muted-foreground">Published Live</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{publishedCount}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Visible to students</p>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-2xs">
          <span className="text-xs font-semibold text-muted-foreground">Drafts / In Review</span>
          <p className="text-2xl font-black text-amber-700 mt-1">{draftCount}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Pending publication</p>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-2xs">
          <span className="text-xs font-semibold text-muted-foreground">NIRF Ranked</span>
          <p className="text-2xl font-black text-blue-700 mt-1">{rankedCount}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Verified NIRF 2025</p>
        </div>
      </div>

      {/* Colleges Data Table */}
      <div className="bg-card border rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b bg-muted/10 flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing <strong className="text-foreground">{colleges.length}</strong> onboarded institutions</span>
          <span className="text-[11px]">Click <strong>Edit</strong> to configure fees, hostel, gallery, and SEO tags</span>
        </div>

        <div className="overflow-x-auto touch-scroll">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">College Name &amp; Slug</th>
                <th className="p-4">Location</th>
                <th className="p-4">NIRF Rank</th>
                <th className="p-4">Ownership</th>
                <th className="p-4">Programs</th>
                <th className="p-4">Leads</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-foreground">
              {colleges.map((c) => (
                <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 max-w-xs">
                    <div className="flex items-center gap-2.5">
                      {c.logoUrl ? (
                        <img
                          src={c.logoUrl}
                          alt=""
                          className="w-8 h-8 rounded-lg object-contain border bg-white p-0.5 shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-foreground truncate" title={c.name}>
                          {c.name}
                        </div>
                        <span className="text-[11px] text-muted-foreground font-mono block truncate">
                          /colleges/{c.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    {c.city}, {c.state}
                  </td>

                  <td className="p-4 font-black text-amber-600 whitespace-nowrap">
                    {c.nirfRank ? `#${c.nirfRank}` : "—"}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span className="text-[11px] font-medium text-foreground">
                      {c.ownershipType.replace(/_/g, " ")}
                    </span>
                  </td>

                  <td className="p-4 font-semibold whitespace-nowrap">
                    {c._count.courses} courses
                  </td>

                  <td className="p-4 font-bold text-blue-600 whitespace-nowrap">
                    {c._count.leads} leads
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.isPublished
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {c.isPublished ? "PUBLISHED" : "DRAFT"}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <AdminCollegeActions
                      collegeId={c.id}
                      collegeSlug={c.slug}
                      collegeName={c.name}
                      isPublished={c.isPublished}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
