import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user as any;

  // Strict Authentication: If user is not logged in or role is not authorized, redirect to /login
  if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "STAFF" && user.role !== "COLLEGE_ADMIN" && user.role !== "AUTHOR")) {
    redirect("/login?callbackUrl=/admin");
  }

  const role = user.role;
  const permissions: string[] = user.permissions || [];
  const userName = user.name || "Administrator";
  const userEmail = user.email || "";

  return (
    <AdminLayoutClient
      role={role}
      permissions={permissions}
      userName={userName}
      userEmail={userEmail}
    >
      {children}
    </AdminLayoutClient>
  );
}
