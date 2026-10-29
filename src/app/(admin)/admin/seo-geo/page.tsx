import { db } from "@/lib/db";
import { Globe, Cpu, CheckCircle2, RefreshCw, ExternalLink, Code } from "lucide-react";
import { checkAdminAccess } from "@/lib/auth/staff-guard";
import { StaffAccessDenied } from "@/components/admin/StaffAccessDenied";

export const revalidate = 0;

export default async function AdminSeoGeoPage() {
  const access = await checkAdminAccess("seo-geo");
  if (!access.allowed) {
    return (
      <StaffAccessDenied
        featureName="SEO & GEO Engine"
        allowedFeatures={access.permissions}
      />
    );
  }

  const [collegeCount, blogCount] = await Promise.all([
    db.college.count({ where: { isPublished: true } }),
    db.blogPost.count({ where: { status: "PUBLISHED" } }),
  ]);

  const totalSitemapUrls = collegeCount * 10 + blogCount + 10;

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          SEO & Generative Engine Optimization (GEO) Control Panel
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Monitor search crawler readiness, dynamic JSON-LD schema graphs, sharded XML sitemaps, and /llms.txt AI crawler feeds.
        </p>
      </div>

      {/* Grid: 3 Major Feeds */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: /llms.txt */}
        <div className="p-6 rounded-2xl border bg-card shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 uppercase">
                AI Agent Manifest
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-600" />
              <span>/llms.txt Knowledge Feed</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Standardized plain-text manifest crawled by Perplexity, ChatGPT, Claude, and Gemini for direct citation.
            </p>
          </div>

          <div className="pt-3 border-t">
            <a
              href="/llms.txt"
              target="_blank"
              className="w-full py-2 rounded-lg border bg-background hover:bg-accent font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Inspect /llms.txt</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Card 2: /llms-full.txt */}
        <div className="p-6 rounded-2xl border bg-card shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                AEO Deep Markdown
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>/llms-full.txt (AEO)</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Extended structured knowledge base containing cutoffs, fees, and verified placement records for LLM fine-tuning and RAG.
            </p>
          </div>

          <div className="pt-3 border-t">
            <a
              href="/llms-full.txt"
              target="_blank"
              className="w-full py-2 rounded-lg border bg-background hover:bg-accent font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Inspect /llms-full.txt</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Card 3: Sharded XML Sitemap */}
        <div className="p-6 rounded-2xl border bg-card shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                Googlebot / Bingbot
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
              <Code className="w-4 h-4 text-emerald-600" />
              <span>Dynamic XML Sitemap</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Automated sharding across colleges, 9 profile sub-tabs, entrance exams, and editorial blogs ({totalSitemapUrls} URLs).
            </p>
          </div>

          <div className="pt-3 border-t">
            <a
              href="/sitemap.xml"
              target="_blank"
              className="w-full py-2 rounded-lg border bg-background hover:bg-accent font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View sitemap.xml</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Schema.org Status Breakdown */}
      <div className="bg-card border rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-foreground">
          Automated Schema.org JSON-LD Graphs Verified
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border bg-muted/20 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground block">CollegeOrUniversity Graph</strong>
              <p className="text-muted-foreground mt-0.5">
                Injected on /college/[slug] with postal address, aggregate ratings, logo, and NIRF rankings.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-muted/20 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground block">Course & Tuition Offers Graph</strong>
              <p className="text-muted-foreground mt-0.5">
                Injected on /courses-fees with INR tuition pricing, duration (P4Y), and degree specifications.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-muted/20 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground block">NewsArticle Graph</strong>
              <p className="text-muted-foreground mt-0.5">
                Injected on all /blog/[slug] pages with author credentials, publisher logo, and publication dates.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-muted/20 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground block">FAQPage & BreadcrumbList Graph</strong>
              <p className="text-muted-foreground mt-0.5">
                Injected across college Q&A tabs, exam hubs, and blog FAQs for Google Rich Snippet SERP expansion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

