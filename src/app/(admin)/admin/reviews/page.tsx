import { db } from "@/lib/db";
import { ReviewModerationClient } from "./ReviewModerationClient";
import { checkAdminAccess } from "@/lib/auth/staff-guard";
import { StaffAccessDenied } from "@/components/admin/StaffAccessDenied";

export const revalidate = 0;

export default async function AdminReviewsPage() {
  const access = await checkAdminAccess("reviews");
  if (!access.allowed) {
    return (
      <StaffAccessDenied
        featureName="Review Moderation"
        allowedFeatures={access.permissions}
      />
    );
  }

  const reviews = await db.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      college: { select: { name: true, slug: true } },
      user: { select: { name: true, email: true } },
    },
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Student Review & ID Proof Moderation Queue
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review authentic student testimonials, verify college identity cards, and approve ratings for live publication.
        </p>
      </div>

      <ReviewModerationClient initialReviews={reviews} />
    </div>
  );
}

