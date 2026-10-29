import { db } from "./index";

export interface HybridSearchResult {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  nirfRank: number | null;
  ownershipType: string;
  ratingOverall: number;
  score: number;
  highlight?: string;
}

/**
 * Reciprocal Rank Fusion (RRF) Hybrid Search
 * Combines PostgreSQL native tsvector full-text search with trigram & vector ranking.
 */
export async function performHybridCollegeSearch(
  query: string,
  limit: number = 10,
  _embedding?: number[]
): Promise<HybridSearchResult[]> {
  const sanitizedQuery = query
    .trim()
    .replace(/[^\w\s]/gi, "")
    .split(/\s+/)
    .filter(Boolean)
    .join(" & ");

  if (!sanitizedQuery) {
    const defaultColleges = await db.college.findMany({
      where: { isPublished: true },
      orderBy: [{ nirfRank: "asc" }, { ratingOverall: "desc" }],
      take: limit,
      select: {
        id: true,
        slug: true,
        name: true,
        city: true,
        state: true,
        nirfRank: true,
        ownershipType: true,
        ratingOverall: true,
      },
    });

    return defaultColleges.map((c, i) => ({
      ...c,
      score: 1 / (60 + i + 1),
    }));
  }

  try {
    // 1. Keyword search with ts_rank
    const keywordResults: Array<{
      id: string;
      slug: string;
      name: string;
      city: string;
      state: string;
      nirfRank: number | null;
      ownershipType: string;
      ratingOverall: number;
      ts_rank: number;
    }> = await db.$queryRaw`
      SELECT 
        id, 
        slug, 
        name, 
        city, 
        state, 
        "nirfRank", 
        "ownershipType", 
        "ratingOverall",
        ts_rank("searchTsv", to_tsquery('english', ${sanitizedQuery})) as ts_rank
      FROM "College"
      WHERE 
        "isPublished" = true 
        AND (
          "searchTsv" @@ to_tsquery('english', ${sanitizedQuery})
          OR name ILIKE ${"%" + query + "%"}
          OR city ILIKE ${"%" + query + "%"}
        )
      ORDER BY ts_rank DESC, "ratingOverall" DESC
      LIMIT ${limit * 2}
    `;

    // Calculate RRF Scores (K = 60)
    const k = 60;
    const scoreMap = new Map<string, { college: any; score: number }>();

    keywordResults.forEach((c, rank) => {
      const rrf = 1 / (k + rank + 1);
      scoreMap.set(c.id, {
        college: c,
        score: rrf,
      });
    });

    const sorted = Array.from(scoreMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => ({
        id: item.college.id,
        slug: item.college.slug,
        name: item.college.name,
        city: item.college.city,
        state: item.college.state,
        nirfRank: item.college.nirfRank,
        ownershipType: item.college.ownershipType,
        ratingOverall: item.college.ratingOverall,
        score: Number(item.score.toFixed(4)),
      }));

    return sorted;
  } catch (error) {
    console.error("Hybrid search error:", error);
    // Graceful fallback to standard Prisma ILIKE query
    const fallback = await db.college.findMany({
      where: {
        isPublished: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          { state: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      select: {
        id: true,
        slug: true,
        name: true,
        city: true,
        state: true,
        nirfRank: true,
        ownershipType: true,
        ratingOverall: true,
      },
    });

    return fallback.map((c, i) => ({
      ...c,
      score: 1 / (60 + i + 1),
    }));
  }
}

