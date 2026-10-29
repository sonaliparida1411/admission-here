import Link from "next/link";
import { db } from "@/lib/db";
import { CollegeCard } from "@/components/public/CollegeCard";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { constructSeoMetadata } from "@/lib/seo/metadata";
import { 
  Sparkles, 
  Search, 
  Compass, 
  Award, 
  BookOpen, 
  TrendingUp, 
  ChevronRight, 
  Layers,
  ArrowRight
} from "lucide-react";

export const revalidate = 3600; // ISR 1 hour

export const metadata = constructSeoMetadata({
  title: "Top Colleges, Cutoffs, Admissions & AI Counselor Platform",
  description:
    "Explore 1,000+ top verified Indian universities, compare fees and NIRF rankings, calculate your admission chances with official JoSAA/NEET cutoffs, and consult our 24/7 AI Counselor.",
  canonicalPath: "/",
});

export default async function HomePage() {
  // Fetch top colleges
  const colleges = await db.college.findMany({
    where: { isPublished: true },
    orderBy: [{ nirfRank: "asc" }, { ratingOverall: "desc" }],
    take: 6,
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
  });

  // Fetch live and featured blogs
  const blogs = await db.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 3,
    include: { author: { select: { name: true } } },
  });

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AdmissionsHub",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://admissionshub.in",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || "https://admissionshub.in"}/api/v1/search/hybrid?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLdScript data={websiteSchema} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pt-8 sm:pt-12 pb-14 sm:pb-20 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-primary/10 text-primary border border-primary/20 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>AI-Powered Higher Education Discovery 2026</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            Discover Your Dream College with{" "}
            <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
              Verified Data &amp; AI Intelligence
            </span>
          </h1>

          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Compare verified NIRF rankings, calculate admission probabilities using official JoSAA/CSAB cutoffs, and get personalized recommendations from our AI Counselor.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full max-w-sm sm:max-w-none mx-auto">
            <Link
              href="/colleges"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore 1,000+ Colleges</span>
            </Link>

            <Link
              href="/college-predictor/jee-main"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border bg-background hover:bg-accent font-bold text-sm text-foreground transition-all flex items-center justify-center gap-2 shadow-2xs"
            >
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Run Rank Predictor</span>
            </Link>
          </div>

          {/* Stream Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            <span className="text-xs text-muted-foreground mr-1">Popular Streams:</span>
            {[
              { label: "Engineering (B.Tech)", href: "/colleges/b-tech" },
              { label: "Management (MBA)", href: "/colleges/mba" },
              { label: "Medical (MBBS)", href: "/colleges/mbbs" },
              { label: "Top Odisha Colleges", href: "/colleges/b-tech/odisha" },
            ].map((stream) => (
              <Link
                key={stream.label}
                href={stream.href}
                className="text-xs px-3 py-1 rounded-full border bg-muted/40 hover:bg-accent hover:text-primary transition-colors"
              >
                {stream.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stream Hub Grid */}
      <section className="py-12 border-b bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                Explore by Academic Discipline
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Curated catalogs of verified institutions, exams, and degree pathways
              </p>
            </div>
            <Link
              href="/colleges"
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
            >
              <span>View All Streams</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Engineering",
                desc: "IITs, NITs, BITS, and State Technical Universities",
                count: "450+ Colleges",
                href: "/colleges/b-tech",
                accent: "from-blue-600 to-indigo-600",
              },
              {
                title: "Management",
                desc: "IIMs, XLRI, FMS, and Top Tier-1 Business Schools",
                count: "320+ Colleges",
                href: "/colleges/mba",
                accent: "from-purple-600 to-pink-600",
              },
              {
                title: "Medical & Dental",
                desc: "AIIMS, Government Medical Colleges (NEET UG)",
                count: "180+ Colleges",
                href: "/colleges/mbbs",
                accent: "from-emerald-600 to-teal-600",
              },
              {
                title: "Rank Predictor",
                desc: "Calculate cutoff probabilities by category & quota",
                count: "JEE, NEET, CAT",
                href: "/college-predictor/jee-main",
                accent: "from-amber-600 to-orange-600",
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="p-5 rounded-2xl border bg-card hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${card.accent} text-white flex items-center justify-center font-bold text-sm mb-3 shadow-2xs`}
                  >
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <div className="pt-4 border-t mt-4 flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground/80">{card.count}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Ranked Verified Colleges */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                <Award className="w-4 h-4" />
                <span>NIRF & JoSAA Audited</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-foreground">
                Top Ranked Universities in India
              </h2>
            </div>
            <Link
              href="/colleges"
              className="px-4 py-2 rounded-lg border bg-background hover:bg-accent text-xs font-bold text-foreground transition-colors self-start sm:self-auto flex items-center gap-1.5"
            >
              <span>Explore All Colleges</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </section>

      {/* Editorial Blog & Live Exam Updates */}
      <section className="py-14 bg-muted/30 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Editorial & Real-time Alerts</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                Exam News & Cutoff Analyses
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
            >
              <span>Read All Articles</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <Link
                key={b.id}
                href={`/blog/${b.slug}`}
                className="p-5 rounded-2xl border bg-card hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {b.category.replace("_", " ")}
                  </span>
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {b.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {b.metaDescription || (b.tldrSummary && b.tldrSummary[0]) || ""}
                  </p>
                </div>

                <div className="pt-4 border-t mt-4 text-[11px] text-muted-foreground flex items-center justify-between">
                  <span>By {b.author.name}</span>
                  <span>{new Date(b.publishedAt || b.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

