import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAdminAccess } from "@/lib/auth/staff-guard";
import { OwnershipType, ApprovalActionType, ApprovalStatus } from "@prisma/client";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const CollegeCreateSchema = z.object({
  name: z.string().min(2, "College name must be at least 2 characters"),
  shortName: z.string().optional().nullable(),
  slug: z.string().min(2, "Valid slug required"),
  logoUrl: z.string().optional().nullable(),
  coverImageUrl: z.string().optional().nullable(),
  brochurePdfUrl: z.string().optional().nullable(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().optional().nullable(),
  fullAddress: z.string().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  contactEmail: z.string().optional().nullable(),
  estYear: z.number().nullable().optional(),
  ownershipType: z.nativeEnum(OwnershipType).default(OwnershipType.PUBLIC_GOVERNMENT),
  nirfRank: z.number().nullable().optional(),
  naacGrade: z.string().optional().nullable(),
  campusAreaAcres: z.number().nullable().optional(),
  overviewHtml: z.string().default("<p>Institutional overview and campus highlights...</p>"),
  admissionHtml: z.string().optional().nullable(),
  scholarshipInfo: z.string().optional().nullable(),
  hostelInfo: z.string().optional().nullable(),
  facilitiesJson: z.any().optional(),
  faqsJson: z.any().optional(),
  qnaJson: z.any().optional(),
  galleryUrls: z.array(z.string()).default([]),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
});

export async function GET() {
  try {
    const access = await checkAdminAccess("colleges");
    if (!access.allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const colleges = await db.college.findMany({
      orderBy: [{ nirfRank: "asc" }, { name: "asc" }],
      include: {
        _count: { select: { courses: true, reviews: true, leads: true } },
      },
    });

    return NextResponse.json({ success: true, colleges });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch colleges" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const access = await checkAdminAccess("colleges");
    if (!access.allowed) {
      return NextResponse.json({ error: "Unauthorized access: colleges permission required" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CollegeCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid college parameters", details: parsed.error.format() },
        { status: 400 }
      );
    }

    // Check slug collision
    const existing = await db.college.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: `A college with URL slug "${parsed.data.slug}" already exists.` },
        { status: 409 }
      );
    }

    // Staff workflow: Submit for Admin Approval
    if (access.role === "STAFF") {
      const approvalRequest = await db.collegeApprovalRequest.create({
        data: {
          staffId: access.userId,
          actionType: ApprovalActionType.CREATE,
          section: "ALL",
          title: `Onboard New College Profile: ${parsed.data.name}`,
          proposedData: parsed.data,
          status: ApprovalStatus.PENDING,
        },
      });

      // Audit Log
      try {
        await db.staffActivityLog.create({
          data: {
            staffId: access.userId,
            action: "SUBMITTED_CHANGES",
            details: `Staff ${access.userName} submitted new college "${parsed.data.name}" for admin approval.`,
          },
        });
      } catch {}

      return NextResponse.json({
        success: true,
        pendingApproval: true,
        message: "New college submission safely stored and sent for Administrator review & publishing approval.",
        requestId: approvalRequest.id,
      });
    }

    // Super Admin: direct publication
    const college = await db.college.create({
      data: parsed.data,
    });

    try {
      revalidatePath("/colleges");
      revalidatePath(`/college/${college.slug}`);
      revalidatePath("/sitemap.xml");
    } catch {
      // non-blocking
    }

    return NextResponse.json({
      success: true,
      message: "College profile onboarded successfully.",
      college,
    });
  } catch (err: any) {
    console.error("College create error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create college profile" },
      { status: 500 }
    );
  }
}
