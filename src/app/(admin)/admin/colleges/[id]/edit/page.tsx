import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { checkAdminAccess } from "@/lib/auth/staff-guard";
import { StaffAccessDenied } from "@/components/admin/StaffAccessDenied";
import { EditCollegeClient } from "./EditCollegeClient";

interface EditCollegePageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function EditCollegePage({ params }: EditCollegePageProps) {
  const access = await checkAdminAccess("colleges");
  if (!access.allowed) {
    return (
      <StaffAccessDenied
        featureName="Colleges Directory"
        allowedFeatures={access.permissions}
      />
    );
  }

  const { id } = await params;

  const college = await db.college.findUnique({
    where: { id },
    include: {
      courses: {
        include: { course: true },
      },
    },
  });

  if (!college) notFound();

  return <EditCollegeClient college={college as any} />;
}
