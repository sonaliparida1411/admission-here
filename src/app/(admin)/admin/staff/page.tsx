import { checkAdminAccess } from "@/lib/auth/staff-guard";
import { StaffAccessDenied } from "@/components/admin/StaffAccessDenied";
import { StaffManagementClient } from "./StaffManagementClient";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export const metadata = {
  title: "Staff Management | Admission Here Admin",
  description: "Create and manage staff accounts with granular feature access control.",
};

export default async function StaffManagementPage() {
  const access = await checkAdminAccess("staff");

  // If a staff member tries to access staff management, forbid them
  if (!access.isSuperAdmin) {
    return (
      <StaffAccessDenied
        featureName="Staff Management"
        allowedFeatures={access.permissions}
      />
    );
  }

  // Fetch initial staff list from database
  const staffMembers = await db.user.findMany({
    where: {
      role: UserRole.STAFF,
    },
    include: {
      staffPermission: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedStaff = staffMembers.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    phone: s.phone,
    isActive: s.isActive,
    createdAt: s.createdAt.toISOString(),
    permissions: s.staffPermission?.permissions || [],
    assignedCollegeIds: s.staffPermission?.assignedCollegeIds || [],
  }));

  return <StaffManagementClient initialStaff={formattedStaff} />;
}

