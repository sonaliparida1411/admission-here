import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { OwnershipType } from "@prisma/client";

const CollegeCreateSchema = z.object({
  name: z.string().min(2),
  shortName: z.string().optional(),
  slug: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2),
  ownershipType: z.nativeEnum(OwnershipType).default(OwnershipType.PUBLIC_GOVERNMENT),
  nirfRank: z.number().nullable().optional(),
  naacGrade: z.string().optional(),
  campusAreaAcres: z.number().nullable().optional(),
  overviewHtml: z.string().default("<p>Overview...</p>"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CollegeCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid college parameters", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const college = await db.college.create({
      data: parsed.data,
    });

    return NextResponse.json({ success: true, college });
  } catch (err: any) {
    console.error("College create error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create college profile" },
      { status: 500 }
    );
  }
}

