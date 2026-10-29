import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const ModerateSchema = z.object({
  reviewId: z.string().uuid(),
  status: z.enum(["APPROVED", "REJECTED"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ModerateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { reviewId, status } = parsed.data;

    const review = await db.review.update({
      where: { id: reviewId },
      data: {
        moderationStatus: status,
        isVerified: status === "APPROVED",
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update review" }, { status: 500 });
  }
}

