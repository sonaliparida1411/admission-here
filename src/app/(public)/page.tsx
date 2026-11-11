import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { CollegeCard } from "@/components/public/CollegeCard";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { HeroSearchBox } from "@/components/public/HeroSearchBox";
import { LatestArticlesSection } from "@/components/public/LatestArticlesSection";
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
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  GraduationCap,
  Calculator,
  MessageSquare,
  CheckCircle2,
  FileText,
  BadgeCheck,
  Star,
  MapPin
} from "lucide-react";

export const revalidate = 3600; // ISR 1 hour

export const metadata = constructSeoMetadata({
  title: "Top Colleges, Cutoffs, Admissions & AI Counselor Platform",
  description:
    "Explore top verified Indian universities, compare fees and NIRF rankings, calculate your admission chances with official JoSAA/NEET cutoffs, and consult our 24/7 AI Counselor.",
  canonicalPath: "/",
});

export default async function HomePage() {
  // Fetch Top Odisha Spotlight Institutions
  const odishaColleges = await db.college.findMany({
    where: { isPublished: true, state: "Odisha" },
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

  // Fetch National Top Colleges
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

  // Fetch National Entrance Exams
  const entranceExams = await db.exam.findMany({
    orderBy: { examDate: "asc" },
    take: 6,
  });

  // Fetch live and featured blogs
  const blogs = await db.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 5,
    include: { author: { select: { name: true } } },
  });

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Admission Here",
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
      <section className="relative bg-white border-b border-slate-200 pt-10 sm:pt-16 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 sm:space-y-6 max-w-4xl mx-auto">
            {/* Real Portal Header Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1a3068] border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-[#1F8040]" />
              <span>Admissions 2026-2027 • JoSAA, NEET &amp; CAT Counseling Platform</span>
            </div>

            {/* Natural Human Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Compare Colleges, Check Official Cutoffs &amp; Calculate Admission Odds
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Explore 1,000+ top Indian universities with audited tuition fees, authentic placement records, NIRF rankings, and previous-year category-wise opening &amp; closing cutoffs.
            </p>

            {/* Direct Search Form */}
            <div className="pt-2">
              <HeroSearchBox />
            </div>

            {/* Real Data Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200/80">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-left">
                <div className="text-2xl font-black text-[#1a3068]">1,000+</div>
                <div className="text-xs text-slate-600 font-semibold mt-0.5">Verified Institutions</div>
                <div className="text-[11px] text-slate-400">Govt, Deemed &amp; Private</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-left">
                <div className="text-2xl font-black text-[#1F8040]">100%</div>
                <div className="text-xs text-slate-600 font-semibold mt-0.5">Audited Data</div>
                <div className="text-[11px] text-slate-400">NIRF &amp; NAAC Grade A/A++</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-left">
                <div className="text-2xl font-black text-[#C41E1E]">50,000+</div>
                <div className="text-xs text-slate-600 font-semibold mt-0.5">Cutoff Ranks</div>
                <div className="text-[11px] text-slate-400">JoSAA, CSAB &amp; NEET</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-left">
                <div className="text-2xl font-black text-slate-800">Free</div>
                <div className="text-xs text-slate-600 font-semibold mt-0.5">Expert Counseling</div>
                <div className="text-[11px] text-slate-400">Guidance on Seat Matrix</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Discipline Cards */}
      <section className="py-14 sm:py-20 border-b bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-1">
                <BookOpen className="w-4 h-4" />
                <span>Programmatic Directories</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Explore by Academic Discipline
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Curated catalogs of verified institutions, entrance exams, and fee structures
              </p>
            </div>
            <Link
              href="/colleges"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary font-bold hover:underline"
            >
              <span>View All Streams</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: "Engineering",
                code: "B.Tech / B.E / M.Tech",
                desc: "IITs, NITs, IIITs, BITS, and State Technical Universities",
                count: "450+ Colleges",
                href: "/colleges/b-tech",
                gradient: "from-blue-600 to-indigo-700",
                badge: "JoSAA / CSAB",
              },
              {
                title: "Management",
                code: "MBA / PGDM / BBA",
                desc: "IIMs, XLRI, FMS, SPJIMR, and Top Tier-1 Business Schools",
                count: "320+ Colleges",
                href: "/colleges/mba",
                gradient: "from-purple-600 to-indigo-800",
                badge: "CAT / XAT / MAT",
              },
              {
                title: "Medical & Dental",
                code: "MBBS / BDS / MD",
                desc: "AIIMS, Top Government Medical Colleges & Private Institutes",
                count: "180+ Colleges",
                href: "/colleges/mbbs",
                gradient: "from-emerald-600 to-teal-700",
                badge: "NEET UG / PG",
              },
              {
                title: "Rank Predictor",
                code: "Score-to-College AI",
                desc: "Calculate cutoff probabilities based on category, state quota & rank",
                count: "JEE, NEET, CAT",
                href: "/college-predictor/jee-main",
                gradient: "from-rose-600 to-amber-600",
                badge: "Live 2026 Engine",
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group relative bg-card hover:bg-card/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.gradient} text-white flex items-center justify-center font-black text-lg shadow-md`}>
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-lg text-foreground group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-500 mb-2">
                      {card.code}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-5 flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">{card.count}</span>
                  <div className="flex items-center gap-1 font-bold text-primary group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Odisha Spotlight: Top Colleges & Universities */}
      <section className="py-14 sm:py-20 bg-gradient-to-b from-blue-50/60 via-white to-slate-50/50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#1a3068] bg-blue-100/70 border border-blue-200 mb-2">
                <MapPin className="w-3.5 h-3.5 text-[#C41E1E]" />
                <span>Odisha Higher Education Spotlight 2026</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Top Colleges &amp; Universities in Odisha
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Premier Government &amp; Deemed institutions in Bhubaneswar, Rourkela, Cuttack &amp; Sambalpur with official JoSAA, OJEE &amp; NEET cutoff data.
              </p>
            </div>
            <Link
              href="/colleges/b-tech/odisha"
              className="px-5 py-2.5 rounded-xl border border-[#1a3068] bg-[#1a3068] text-white hover:bg-[#152754] text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <span>View All Odisha Colleges</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {odishaColleges.map((c) => (
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

      {/* Top Ranked Verified Colleges */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 mb-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Audited Ranking 2025-2026</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
                Top Ranked Universities in India
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                Verified institutions with authentic tuition costs, placement records, and accreditation badges.
              </p>
            </div>
            <Link
              href="/colleges"
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-background hover:bg-accent text-xs font-bold text-foreground transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto"
            >
              <span>Explore All Colleges</span>
              <ChevronRight className="w-4 h-4" />
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

      {/* National Entrance Examinations Master Hub */}
      <section className="py-14 sm:py-20 border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 mb-2">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Admissions 2026 Examination Desk</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Top National Entrance Exams
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Check official dates, application deadlines, syllabus patterns, and college cutoffs.
              </p>
            </div>
            <Link
              href="/exams/jee-main"
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Explore All Exams</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {entranceExams.map((exam) => (
              <Link
                key={exam.id}
                href={`/exams/${exam.slug}`}
                className="group p-5 rounded-2xl border border-slate-200 bg-white hover:border-[#1a3068]/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1a3068] uppercase">
                      {exam.stream}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {exam.examLevel} Level
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 group-hover:text-[#1a3068] transition-colors leading-snug line-clamp-1">
                    {exam.name}
                  </h3>

                  <div className="text-xs text-slate-500 space-y-1">
                    <p className="line-clamp-1">
                      <span className="font-semibold text-slate-700">Conducted By:</span> {exam.conductingBody}
                    </p>
                    {exam.examDate && (
                      <p>
                        <span className="font-semibold text-slate-700">Exam Date:</span>{" "}
                        {new Date(exam.examDate).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-bold text-[#1a3068]">
                  <span>Exam Details &amp; Cutoffs</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Admission Here Section */}
      <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Students &amp; Parents Trust Admission Here
            </h2>
            <p className="text-sm text-slate-600">
              Direct, verified information designed to help you make informed higher education decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1a3068] border border-blue-100 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Official Cutoff Archive</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Opening and closing ranks compiled directly from institutional counseling bodies like JoSAA, CSAB, and State Counseling Cells.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1F8040] border border-emerald-100 flex items-center justify-center font-bold">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">College &amp; Branch Predictor</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Enter your exam score, home state, and category to see which institutes and branches match your admission prospects.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-[#C41E1E] border border-red-100 flex items-center justify-center font-bold">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Dedicated Admission Guidance</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Connect with verified academic counselors for personalized guidance on course fee structures, hostels, and scholarship options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Blog & Live Exam Updates */}
      <LatestArticlesSection articles={blogs} />
    </>
  );
}
