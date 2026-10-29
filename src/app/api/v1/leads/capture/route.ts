import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { LeadCtaType, LeadStatus } from "@prisma/client";
import { z } from "zod";

const LeadCaptureSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9+ -]{10,15}$/, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  city: z.string().optional(),
  state: z.string().optional(),
  targetStream: z.string().default("Engineering"),
  targetDegree: z.string().optional(),
  examRankInfo: z.string().optional(),
  targetCollegeId: z.string().uuid().optional(),
  sourceBlogId: z.string().uuid().optional(),
  sourceUrl: z.string().default("/"),
  ctaType: z.nativeEnum(LeadCtaType).default(LeadCtaType.APPLY_NOW),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  otpCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LeadCaptureSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Simulate OTP verification (in dev/demo, any 4-digit code e.g. 1234 or auto-verify)
    const isOtpProvided = !!data.otpCode;
    const initialStatus = isOtpProvided ? LeadStatus.OTP_VERIFIED : LeadStatus.NEW;

    const lead = await db.lead.create({
      data: {
        studentName: data.studentName,
        phone: data.phone,
        email: data.email.toLowerCase(),
        city: data.city,
        state: data.state,
        targetStream: data.targetStream,
        targetDegree: data.targetDegree,
        examRankInfo: data.examRankInfo,
        targetCollegeId: data.targetCollegeId || null,
        sourceBlogId: data.sourceBlogId || null,
        sourceUrl: data.sourceUrl,
        ctaType: data.ctaType,
        utmSource: data.utmSource,
        utmMedium: data.utmMedium,
        utmCampaign: data.utmCampaign,
        status: initialStatus,
      },
      include: {
        targetCollege: {
          select: { name: true, slug: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Lead successfully captured and routed to admissions counselor desk",
      leadId: lead.id,
      status: lead.status,
      assignedCollege: lead.targetCollege?.name || "General Counseling Desk",
    });
  } catch (error) {
    console.error("Lead capture API error:", error);
    return NextResponse.json(
      { error: "Failed to submit application lead" },
      { status: 500 }
    );
  }
}

