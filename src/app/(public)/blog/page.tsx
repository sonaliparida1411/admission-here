import Link from "next/link";
import { db } from "@/lib/db";
import { constructSeoMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Sparkles, Radio, Calendar, User, ArrowRight, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = constructSeoMetadata({
  title: "AdmissionsHub Editorial & Live Exam Updates 2026",
  description:
    "Authoritative cutoff analysis, JoSAA seat allotment updates, entrance exam results, and college roundups authored by education specialists.",
  canonicalPath: "/blog",
});

export default async function BlogHubPage() {
  const posts = await db.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: {
      author: { select: { name: true } },
      relatedCollege: { select: { name: true, slug: true } },
    },
  });

  const categories = [
    { label: "All Topics", href: "/blog", active: true },
    { label: "Cutoff Analysis", href: "/blog/category/cutoff-analysis" },
    { label: "Exam News & Live", href: "/blog/category/exam-news" },
    { label: "Admission Alerts", href: "/blog/category/admission-alerts" },
    { label: "College Roundups", href: "/blog/category/college-roundup" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: "Editorial & News Hub" }]} />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Authoritative Education Journalism & Live Tickers</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Editorial Blog & Exam News Desk
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            In-depth analysis of national entrance examinations, JoSAA cutoff trends, scholarship deadlines, and institutional admissions.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                c.active
                  ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                  : "bg-background hover:bg-accent text-foreground"
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-2xl border bg-card hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between group"
          >
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                  {post.category.replace("_", " ")}
                </span>
                {post.isLiveBlog && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-red-600 bg-red-500/10 px-2 py-0.5 rounded-full animate-pulse">
                    <Radio className="w-3 h-3" /> LIVE BLOG
                  </span>
                )}
              </div>

              <Link href={`/blog/${post.slug}`}>
                <h3 className="font-extrabold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </Link>

              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {post.metaDescription || (post.tldrSummary && post.tldrSummary[0]) || ""}
              </p>
            </div>

            <div className="p-6 pt-0 border-t mt-4 flex items-center justify-between text-xs text-muted-foreground pt-4">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span className="truncate max-w-[120px]">{post.author.name}</span>
              </div>
              <time dateTime={new Date(post.publishedAt || post.createdAt).toISOString()}>
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
              </time>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

