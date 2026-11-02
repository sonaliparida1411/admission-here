import { db } from "@/lib/db";
import { CollegeCard } from "@/components/public/CollegeCard";
import { FacetedFilterSidebar } from "@/components/public/FacetedFilterSidebar";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { constructSeoMetadata } from "@/lib/seo/metadata";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { generateBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { Building2 } from "lucide-react";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export const revalidate = 3600;

interface CollegesPageProps {
  params: Promise<{ filters?: string[] }>;
  searchParams: Promise<{
    stream?: string;
    course?: string;
    level?: string;
    state?: string;
    ownership?: string;
    maxFees?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ params, searchParams }: CollegesPageProps) {
  const { filters = [] } = await params;
  const sParams = await searchParams;

  let title = "Top Colleges in India 2026";
  let description =
    "Explore, compare and filter verified Indian colleges by NIRF rankings, cutoffs, tuition fees, and placements.";

  if (filters.length > 0) {
    const filterText = filters.join(" ").replace(/-/g, " ");
    title = `Top ${filterText.toUpperCase()} Colleges in India`;
    description = `Find the best ${filterText} colleges in India with verified cutoff ranks, total fees, and official NIRF rankings.`;
  } else if (sParams.stream || sParams.state) {
    const parts = [sParams.stream, sParams.state ? `in ${sParams.state}` : ""].filter(Boolean);
    title = `Top ${parts.join(" ")} Colleges`;
  }

  return constructSeoMetadata({
    title,
    description,
    canonicalPath: `/colleges/${filters.join("/")}`,
  });
}

export default async function CollegesDirectoryPage({
  params,
  searchParams,
}: CollegesPageProps) {
  const { filters = [] } = await params;
  const sParams = await searchParams;

  // If a single slug parameter is passed, check if it matches a college profile directly (e.g. /colleges/nit-rourkela)
  if (filters.length === 1) {
    const slugQuery = filters[0].toLowerCase();
    const collegeMatch = await db.college.findUnique({
      where: { slug: slugQuery },
      select: { slug: true },
    });
    if (collegeMatch) {
      redirect(`/college/${collegeMatch.slug}`);
    }
  }

  // Determine stream and state from URL path segments or query parameters
  let targetStream = sParams.stream || sParams.course || "";
  let targetState = sParams.state || "";
  let targetLevel = sParams.level || "";

  if (filters.length === 1) {
    targetStream = filters[0].replace(/-/g, " ");
  } else if (filters.length >= 2) {
    targetStream = filters[0].replace(/-/g, " ");
    targetState = filters[1].replace(/-/g, " ");
  }

  // Build Prisma Where Clause
  const whereClause: any = {
    isPublished: true,
  };

  if (targetState) {
    whereClause.state = { contains: targetState, mode: "insensitive" };
  }

  if (sParams.ownership) {
    whereClause.ownershipType = sParams.ownership as any;
  }

  if (targetStream || targetLevel) {
    whereClause.courses = {
      some: {
        course: {
          AND: [
            targetLevel ? { level: { equals: targetLevel, mode: "insensitive" } } : {},
            targetStream
              ? {
                  OR: [
                    { stream: { contains: targetStream, mode: "insensitive" } },
                    { degree: { contains: targetStream, mode: "insensitive" } },
                    { slug: { contains: targetStream, mode: "insensitive" } },
                  ],
                }
              : {},
          ],
        },
      },
    };
  }

  if (sParams.maxFees) {
    const maxFee = parseInt(sParams.maxFees, 10);
    whereClause.courses = {
      ...(whereClause.courses || {}),
      some: {
        totalFeesInr: { lte: maxFee },
      },
    };
  }

  const colleges = await db.college.findMany({
    where: whereClause,
    orderBy: [{ nirfRank: "asc" }, { ratingOverall: "desc" }],
    include: {
      courses: {
        include: { course: true },
        take: 1,
      },
      placements: {
        take: 1,
        orderBy: { batchYear: "desc" },
      },
    },
    take: 24,
  });

  const breadcrumbs = [
    { label: "Colleges", href: "/colleges" },
    ...(targetStream ? [{ label: targetStream, href: `/colleges/${targetStream}` }] : []),
    ...(targetState ? [{ label: targetState }] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <JsonLdScript
        data={generateBreadcrumbJsonLd(
          breadcrumbs.map((b) => ({ name: b.label, url: b.href || "/colleges" }))
        )}
      />

      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground capitalize">
          {targetStream ? `Top ${targetStream} Colleges` : "Discover Top Colleges in India"}{" "}
          {targetState ? `in ${targetState}` : ""}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Showing {colleges.length} verified institutions ranked by official NIRF scores and placement records.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Faceted Sidebar */}
        <Suspense fallback={<div className="w-full lg:w-64 h-96 bg-muted/20 animate-pulse rounded-xl" />}>
          <FacetedFilterSidebar />
        </Suspense>

        {/* Results Grid */}
        <div className="flex-1 min-w-0">
          {colleges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {colleges.map((c) => (
                <CollegeCard
                  key={c.id}
                  college={{
                    id: c.id,
                    slug: c.slug,
                    name: c.name,
                    shortName: c.shortName,
                    logoUrl: c.logoUrl,
                    coverImageUrl: c.coverImageUrl,
                    brochurePdfUrl: c.brochurePdfUrl,
                    city: c.city,
                    state: c.state,
                    estYear: c.estYear,
                    ownershipType: c.ownershipType,
                    naacGrade: c.naacGrade,
                    nirfRank: c.nirfRank,
                    ratingOverall: c.ratingOverall,
                    reviewCount: c.reviewCount,
                    featuredCourse: c.courses[0]
                      ? {
                          degree: c.courses[0].course.degree,
                          specialization: c.courses[0].specialization,
                          totalFeesInr: c.courses[0].totalFeesInr,
                        }
                      : null,
                    latestPlacement: c.placements[0] || null,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-card border rounded-2xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">No matching colleges found</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  Try clearing some filter criteria (such as max tuition fee or state) to see more institutions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
