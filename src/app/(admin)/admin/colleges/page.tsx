import Link from "next/link";
import { db } from "@/lib/db";
import { Building2, Plus, Edit, Eye, Award, ExternalLink, Download } from "lucide-react";
import { checkAdminAccess } from "@/lib/auth/staff-guard";
import { StaffAccessDenied } from "@/components/admin/StaffAccessDenied";

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

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Colleges Master Directory
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage institutional profiles, verify NIRF ranks, and configure 9 profile sub-tabs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/colleges/new"
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:bg-primary/90 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New College</span>
          </Link>
        </div>
      </div>

      {/* Colleges Data Table */}
      <div className="bg-card border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto touch-scroll">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">College Name</th>
                <th className="p-4">Location</th>
                <th className="p-4">NIRF Rank</th>
                <th className="p-4">Ownership</th>
                <th className="p-4">Courses</th>
                <th className="p-4">Leads</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-foreground">
              {colleges.map((c) => (
                <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-sm text-foreground">{c.name}</div>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      /college/{c.slug}
                    </span>
                  </td>
                  <td className="p-4">
                    {c.city}, {c.state}
                  </td>
                  <td className="p-4 font-extrabold text-amber-600">
                    {c.nirfRank ? `#${c.nirfRank}` : "Unranked"}
                  </td>
                  <td className="p-4">{c.ownershipType.replace("_", " ")}</td>
                  <td className="p-4 font-semibold">{c._count.courses} programs</td>
                  <td className="p-4 font-bold text-blue-600">{c._count.leads} leads</td>
                  <td className="p-4">
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
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/college/${c.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg border hover:bg-accent text-muted-foreground"
                        title="View Public Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/colleges/${c.id}/edit`}
                        className="px-2.5 py-1.5 rounded-lg border bg-background hover:bg-accent text-foreground font-semibold flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Manage Tabs</span>
                      </Link>
                    </div>
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

