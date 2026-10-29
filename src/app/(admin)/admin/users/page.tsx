import { db } from "@/lib/db";
import { Users, ShieldCheck, UserCheck } from "lucide-react";
import { checkAdminAccess } from "@/lib/auth/staff-guard";
import { StaffAccessDenied } from "@/components/admin/StaffAccessDenied";

export const revalidate = 0;

export default async function AdminUsersPage() {
  const access = await checkAdminAccess("users");
  if (!access.isSuperAdmin) {
    return (
      <StaffAccessDenied
        featureName="User & Role Access"
        allowedFeatures={access.permissions}
      />
    );
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { leads: true, reviews: true, blogPosts: true },
      },
    },
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            User & RBAC Role Directory
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage permissions across STUDENT, AUTHOR (Editorial Staff), COLLEGE_ADMIN (Partner Reps), and SUPER_ADMIN.
          </p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto touch-scroll">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">User Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">RBAC Role</th>
                <th className="p-4">Activity</th>
                <th className="p-4">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y text-foreground">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-bold text-sm text-foreground">{u.name}</td>
                  <td className="p-4 text-muted-foreground">{u.email}</td>
                  <td className="p-4">{u.phone || "—"}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                        u.role === "SUPER_ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : u.role === "AUTHOR"
                          ? "bg-amber-100 text-amber-800"
                          : u.role === "COLLEGE_ADMIN"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">
                    {u.role === "AUTHOR" && `${u._count.blogPosts} articles`}
                    {u.role === "STUDENT" && `${u._count.leads} inquiries, ${u._count.reviews} reviews`}
                    {u.role === "SUPER_ADMIN" && "Full System Access"}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString()}
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

