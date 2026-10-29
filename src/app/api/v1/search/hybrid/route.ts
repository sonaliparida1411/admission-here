import { NextRequest, NextResponse } from "next/server";
import { performHybridCollegeSearch } from "@/lib/db/hybrid-search";
import { z } from "zod";

const SearchQuerySchema = z.object({
  q: z.string().default(""),
  limit: z.coerce.number().min(1).max(50).default(10),
});

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const parsed = SearchQuerySchema.safeParse({
      q: url.searchParams.get("q") ?? "",
      limit: url.searchParams.get("limit") ?? 10,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid search parameters", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { q, limit } = parsed.data;
    const results = await performHybridCollegeSearch(q, limit);

    return NextResponse.json({
      success: true,
      query: q,
      total: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Hybrid search API error:", error);
    return NextResponse.json(
      { error: "Internal server error during search execution" },
      { status: 500 }
    );
  }
}

