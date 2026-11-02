import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAccess } from "@/lib/auth/staff-guard";
import { ApprovalStatus, ApprovalActionType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  try {
    const access = await checkAdminAccess("colleges");
    if (!access.allowed) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status");

    const where: any = {};
    if (statusParam && statusParam !== "ALL") {
      where.status = statusParam as ApprovalStatus;
    }

    // If STAFF member, show their own requests
    if (access.role === "STAFF") {
      where.staffId = access.userId;
    }

    const [requests, activityLogs] = await Promise.all([
      db.collegeApprovalRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          staff: { select: { id: true, name: true, email: true } },
          college: { select: { id: true, name: true, slug: true, city: true, state: true } },
          reviewedBy: { select: { id: true, name: true } },
        },
        take: 100,
      }),
      db.staffActivityLog.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          staff: { select: { name: true, email: true } },
        },
        take: 30,
      }),
    ]);

    return NextResponse.json({
      success: true,
      requests,
      activityLogs,
      isSuperAdmin: access.isSuperAdmin,
    });
  } catch (error: any) {
    console.error("Approvals API GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch approvals" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const access = await checkAdminAccess("colleges");
    if (!access.isSuperAdmin) {
      return NextResponse.json(
        { error: "Only Super Administrators can review, approve, or reject staff submissions." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { requestId, action, adminFeedback } = body;

    if (!requestId || !action) {
      return NextResponse.json({ error: "Request ID and review action required" }, { status: 400 });
    }

    const approvalReq = await db.collegeApprovalRequest.findUnique({
      where: { id: requestId },
      include: {
        college: true,
        staff: { select: { id: true, name: true, email: true } },
      },
    });

    if (!approvalReq) {
      return NextResponse.json({ error: "Approval request not found" }, { status: 404 });
    }

    if (action === "APPROVE") {
      const proposed = approvalReq.proposedData as any;

      if (approvalReq.actionType === ApprovalActionType.CREATE) {
        // Create new live college
        const createdCollege = await db.college.create({
          data: proposed,
        });

        await db.collegeApprovalRequest.update({
          where: { id: requestId },
          data: {
            status: ApprovalStatus.APPROVED,
            collegeId: createdCollege.id,
            reviewedById: access.userId,
            reviewedAt: new Date(),
            adminFeedback: adminFeedback || "Approved and published to public directory.",
          },
        });

        try {
          revalidatePath("/colleges");
          revalidatePath(`/college/${createdCollege.slug}`);
          revalidatePath("/sitemap.xml");
        } catch {}

        await db.staffActivityLog.create({
          data: {
            staffId: approvalReq.staffId,
            collegeId: createdCollege.id,
            action: "APPROVED",
            details: `Admin ${access.userName} approved and published new college "${createdCollege.name}" submitted by ${approvalReq.staff.name}.`,
          },
        });

        return NextResponse.json({
          success: true,
          message: `Approved & Published "${createdCollege.name}" to the public website!`,
          status: ApprovalStatus.APPROVED,
        });
      } else {
        // UPDATE existing college
        if (!approvalReq.collegeId) {
          return NextResponse.json({ error: "Missing collegeId on update request" }, { status: 400 });
        }

        const updatedCollege = await db.college.update({
          where: { id: approvalReq.collegeId },
          data: proposed,
        });

        await db.collegeApprovalRequest.update({
          where: { id: requestId },
          data: {
            status: ApprovalStatus.APPROVED,
            reviewedById: access.userId,
            reviewedAt: new Date(),
            adminFeedback: adminFeedback || "Approved and updated in live website.",
          },
        });

        try {
          revalidatePath("/colleges");
          revalidatePath(`/college/${updatedCollege.slug}`);
          revalidatePath("/sitemap.xml");
        } catch {}

        await db.staffActivityLog.create({
          data: {
            staffId: approvalReq.staffId,
            collegeId: updatedCollege.id,
            action: "APPROVED",
            details: `Admin ${access.userName} approved changes to "${updatedCollege.name}" submitted by ${approvalReq.staff.name}.`,
          },
        });

        return NextResponse.json({
          success: true,
          message: `Approved and published updates for "${updatedCollege.name}"!`,
          status: ApprovalStatus.APPROVED,
        });
      }
    } else if (action === "REJECT") {
      await db.collegeApprovalRequest.update({
        where: { id: requestId },
        data: {
          status: ApprovalStatus.REJECTED,
          reviewedById: access.userId,
          reviewedAt: new Date(),
          adminFeedback: adminFeedback || "Rejected by administrator. Public website remains unchanged.",
        },
      });

      await db.staffActivityLog.create({
        data: {
          staffId: approvalReq.staffId,
          collegeId: approvalReq.collegeId,
          action: "REJECTED",
          details: `Admin ${access.userName} rejected submission from ${approvalReq.staff.name}. Reason: ${adminFeedback || "None specified"}.`,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Submission rejected. The published website remains unchanged.",
        status: ApprovalStatus.REJECTED,
      });
    } else if (action === "REQUEST_REVISION") {
      await db.collegeApprovalRequest.update({
        where: { id: requestId },
        data: {
          status: ApprovalStatus.REVISION_REQUESTED,
          reviewedById: access.userId,
          reviewedAt: new Date(),
          adminFeedback: adminFeedback || "Please review and revise the requested fields.",
        },
      });

      await db.staffActivityLog.create({
        data: {
          staffId: approvalReq.staffId,
          collegeId: approvalReq.collegeId,
          action: "REVISION_REQUESTED",
          details: `Admin ${access.userName} requested revisions from ${approvalReq.staff.name}. Feedback: ${adminFeedback || "Please revise."}`,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Revision requested. Feedback sent to staff member.",
        status: ApprovalStatus.REVISION_REQUESTED,
      });
    }

    return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
  } catch (error: any) {
    console.error("Approvals review error:", error);
    return NextResponse.json({ error: error.message || "Failed to process review action" }, { status: 500 });
  }
}

