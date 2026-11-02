import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CollegeHeaderClient } from "./CollegeHeaderClient";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { generateCollegeJsonLd } from "@/lib/seo/json-ld";
import { constructSeoMetadata } from "@/lib/seo/metadata";

interface CollegeLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const college = await db.college.findUnique({
    where: { slug },
    select: { name: true, city: true, state: true, nirfRank: true, overviewHtml: true },
  });

  if (!college) {
    return constructSeoMetadata({
      title: "College Not Found",
      description: "The requested college profile could not be found.",
    });
  }

  return constructSeoMetadata({
    title: `${college.name} Admissions 2026: Cutoffs, Fees, Placements & Ranking`,
    description: `Check complete details for ${college.name}, ${college.city}, ${college.state}. Explore B.Tech/MBA fees, official JoSAA cutoffs, highest packages, and NIRF rank #${college.nirfRank || "N/A"}.`,
    canonicalPath: `/college/${slug}`,
  });
}

export default async function CollegeLayout({ children, params }: CollegeLayoutProps) {
  const { slug } = await params;

  const college = await db.college.findUnique({
    where: { slug },
  });

  if (!college) {
    notFound();
  }

  const collegeSchema = generateCollegeJsonLd({
    name: college.name,
    slug: college.slug,
    city: college.city,
    state: college.state,
    pincode: college.pincode,
    fullAddress: college.fullAddress,
    websiteUrl: college.websiteUrl,
    contactPhone: college.contactPhone,
    contactEmail: college.contactEmail,
    logoUrl: college.logoUrl,
    coverImageUrl: college.coverImageUrl,
    overviewText: college.overviewHtml,
    ratingOverall: college.ratingOverall,
    reviewCount: college.reviewCount,
    establishedYear: college.estYear,
  });

  return (
    <div>
      <JsonLdScript data={collegeSchema} />
      <CollegeHeaderClient college={college} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 sm:pb-12">{children}</main>
    </div>
  );
}

