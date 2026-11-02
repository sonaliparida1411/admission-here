import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAccess } from "@/lib/auth/staff-guard";
import { LeadStatus, LeadCtaType } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const access = await checkAdminAccess("leads");
    if (!access.allowed) {
      return NextResponse.json({ error: "Unauthorized access: enquiries permission required" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const collegeId = searchParams.get("collegeId") || "";
    const ctaType = searchParams.get("ctaType") || "";
    const status = searchParams.get("status") || "";
    const exportCsv = searchParams.get("export") === "csv";

    const where: any = {};

    if (search) {
      where.OR = [
        { studentName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { targetCourse: { contains: search, mode: "insensitive" } },
      ];
    }

    if (collegeId && collegeId !== "ALL") {
      where.targetCollegeId = collegeId;
    }

    if (ctaType && ctaType !== "ALL") {
      where.ctaType = ctaType as LeadCtaType;
    }

    if (status && status !== "ALL") {
      where.status = status as LeadStatus;
    }

    const leads = await db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        targetCollege: { select: { id: true, name: true, slug: true, city: true, state: true } },
      },
      take: exportCsv ? 5000 : 150,
    });

    if (exportCsv) {
      const headers = [
        "Enquiry ID",
        "Student Name",
        "Contact Number",
        "Email",
        "State",
        "District",
        "Parent Contact",
        "Target Course",
        "Target Stream",
        "College Name",
        "Enquiry Type",
        "Status",
        "Counselor Notes",
        "Submission Timestamp",
      ];

      const csvRows = [headers.join(",")];

      leads.forEach((l) => {
        const row = [
          `"${l.id}"`,
          `"${(l.studentName || "").replace(/"/g, '""')}"`,
          `"${l.phone}"`,
          `"${l.email || ""}"`,
          `"${l.state || ""}"`,
          `"${l.district || ""}"`,
          `"${l.parentPhone || ""}"`,
          `"${l.targetCourse || ""}"`,
          `"${l.targetStream || ""}"`,
          `"${(l.targetCollege?.name || "General Desk").replace(/"/g, '""')}"`,
          `"${l.ctaType}"`,
          `"${l.status}"`,
          `"${(l.counselorNotes || "").replace(/"/g, '""')}"`,
          `"${l.createdAt.toISOString()}"`,
        ];
        csvRows.push(row.join(","));
      });

      return new NextResponse(csvRows.join("\n"), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="admision-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    const colleges = await db.college.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      leads,
      colleges,
      totalCount: leads.length,
    });
  } catch (error: any) {
    console.error("Enquiries API error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch enquiries" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const access = await checkAdminAccess("leads");
    if (!access.allowed) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, counselorNotes } = body;

    if (!id) {
      return NextResponse.json({ error: "Enquiry ID required" }, { status: 400 });
    }

    const updated = await db.lead.update({
      where: { id },
      data: {
        ...(status ? { status: status as LeadStatus } : {}),
        ...(counselorNotes !== undefined ? { counselorNotes } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry status updated successfully",
      lead: updated,
    });
  } catch (error: any) {
    console.error("Enquiries update error:", error);
    return NextResponse.json({ error: error.message || "Failed to update enquiry" }, { status: 500 });
  }
}

