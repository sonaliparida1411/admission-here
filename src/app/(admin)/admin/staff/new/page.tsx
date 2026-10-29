import { checkAdminAccess } from "@/lib/auth/staff-guard";
import { StaffAccessDenied } from "@/components/admin/StaffAccessDenied";
import { CreateStaffForm } from "./CreateStaffForm";

export const metadata = {
  title: "Create Staff Member | Admission Here Admin",
};

export default async function NewStaffPage() {
  const access = await checkAdminAccess("staff");

  if (!access.isSuperAdmin) {
    return (
      <StaffAccessDenied
        featureName="Staff Management"
        allowedFeatures={access.permissions}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <CreateStaffForm />
    </div>
  );
}

