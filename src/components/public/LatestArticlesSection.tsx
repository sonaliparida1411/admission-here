import Link from "next/link";
import Image from "next/image";
import { 
  TrendingUp, 
  ChevronRight, 
  Calendar, 
  Eye, 
  Radio, 
  ArrowRight, 
  Clock, 
  Bookmark, 
  Sparkles,
  BookOpen
} from "lucide-react";

export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  metaDescription?: string | null;
  tldrSummary?: string[] | null;
  category: string;
  featuredImageUrl?: string | null;
  isLiveBlog: boolean;
  viewCount: number;
  publishedAt?: Date | null;
  createdAt: Date;
  author: {
    name: string;
  };
}

interface LatestArticlesSectionProps {
  articles: ArticleItem[];
}

export function LatestArticlesSection({ articles }: LatestArticlesSectionProps) {
  if (!articles || articles.length === 0) return null;

  // Split into featured spotlight and secondary list
  const featuredArticle = articles[0];
  const sideArticles = articles.slice(1, 4);

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "EXAM_NEWS":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200/50";
      case "CUTOFF_ANALYSIS":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50";
      case "ADMISSION_ALERT":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/50";
      case "COLLEGE_ROUNDUP":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200/50";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50/70 via-background to-slate-50/50 dark:from-slate-900/40 dark:via-background dark:to-slate-900/30 border-t border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40">
              <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Editorial Desk &amp; Real-time Coverage</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              Latest News &amp; Expert Analysis
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Authentic updates on entrance examinations, official JoSAA/CSAB cutoffs, counseling dates, and university rankings.
            </p>
          </div>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-primary hover:text-white bg-primary/5 hover:bg-primary border border-primary/20 transition-all self-start md:self-auto shrink-0 shadow-2xs"
          >
            <span>Explore All Articles</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Magazine Style Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Hero Article (7 Cols) */}
          {featuredArticle && (
            <div className="lg:col-span-7">
              <Link
                href={`/blog/${featuredArticle.slug}`}
                className="group relative flex flex-col h-full bg-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Hero Image Container */}
                <div className="relative w-full h-64 sm:h-80 overflow-hidden bg-slate-900">
                  <Image
                    src={
                      featuredArticle.featuredImageUrl ||
                      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80"
                    }
                    alt={featuredArticle.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Badges Overlay */}
                  <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                    {featuredArticle.isLiveBlog && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-lg animate-pulse">
                        <Radio className="w-3.5 h-3.5" /> LIVE UPDATES
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md border ${getCategoryBadgeClass(
                        featuredArticle.category
                      )}`}
                    >
                      {featuredArticle.category.replace("_", " ")}
                    </span>
                  </div>

                  {/* Views counter overlay */}
                  <div className="absolute bottom-3 right-4 flex items-center gap-1.5 text-xs font-semibold text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{featuredArticle.viewCount.toLocaleString()} views</span>
                  </div>
                </div>

                {/* Hero Content */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-xl sm:text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {featuredArticle.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {featuredArticle.metaDescription ||
                        (featuredArticle.tldrSummary && featuredArticle.tldrSummary[0]) ||
                        "Get full details, expert counseling perspective, and actionable admission instructions."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                        {featuredArticle.author.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-foreground">
                        {featuredArticle.author.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(
                          featuredArticle.publishedAt || featuredArticle.createdAt
                        ).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <div className="hidden sm:flex items-center gap-1 text-primary font-bold group-hover:translate-x-1 transition-transform">
                        <span>Read Article</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Secondary Feed List (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {sideArticles.map((article, idx) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group p-4 sm:p-5 rounded-2xl bg-card border border-slate-200 dark:border-slate-800 hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-4 justify-between"
              >
                {/* Thumbnail */}
                <div className="relative w-full sm:w-32 h-36 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                  <Image
                    src={
                      article.featuredImageUrl ||
                      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80"
                    }
                    alt={article.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 150px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {article.isLiveBlog && (
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-rose-600 text-white">
                      LIVE
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0 space-y-2">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(
                          article.category
                        )}`}
                      >
                        {article.category.replace("_", " ")}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 4 min read
                      </span>
                    </div>

                    <h4 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                    <span className="truncate max-w-[130px] font-medium text-slate-600 dark:text-slate-400">
                      {article.author.name}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-primary group-hover:translate-x-0.5 transition-transform shrink-0">
                      <span>Read</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Newsletter / Instant Alert Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900/10 via-primary/5 to-rose-900/10 border border-primary/20 flex items-center justify-between gap-4 mt-auto">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Never Miss An Admission Deadline</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Get instant JoSAA, CSAB, and NEET notification alerts delivered to you.
                </p>
              </div>
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shrink-0 shadow-xs"
              >
                Join Alerts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

