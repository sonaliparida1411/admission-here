import { auth } from "@/lib/auth/config";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user as any;
  const role = user?.role || "SUPER_ADMIN";
  const permissions: string[] = user?.permissions || [];
  const userName = user?.name || "Super Administrator";
  const userEmail = user?.email || "superadmin@admissionhere.in";

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
