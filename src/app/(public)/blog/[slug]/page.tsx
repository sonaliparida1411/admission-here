import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { constructSeoMetadata } from "@/lib/seo/metadata";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { 
  generateNewsArticleJsonLd, 
  generateFaqJsonLd, 
  generateBreadcrumbJsonLd 
} from "@/lib/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { RichBlogRenderer } from "@/components/blog/RichBlogRenderer";
import { Calendar, User, Radio, Eye, Clock, HelpCircle } from "lucide-react";
import type { LiveUpdateItem } from "@/components/blog/LiveBlogTicker";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({
    where: { slug },
    select: { title: true, metaTitle: true, metaDescription: true, category: true },
  });

  if (!post) {
    return constructSeoMetadata({
      title: "Article Not Found",
      description: "The requested article could not be found.",
    });
  }

  return constructSeoMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription || `Read ${post.title} on AdmissionsHub.`,
    canonicalPath: `/blog/${slug}`,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await db.blogPost.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true } },
      relatedCollege: {
        select: {
          id: true,
          slug: true,
          name: true,
          city: true,
          state: true,
          nirfRank: true,
          ratingOverall: true,
          logoUrl: true,
        },
      },
    },
  });

  if (!post) notFound();

  // NewsArticle JSON-LD
  const articleSchema = generateNewsArticleJsonLd({
    title: post.title,
    slug: post.slug,
    metaDescription: post.metaDescription,
    featuredImageUrl: post.featuredImageUrl,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    authorName: post.author.name,
  });

  // FAQPage JSON-LD
  const faqs = (post.faqsJson as Array<{ question: string; answer: string }>) || [];
  const faqSchema = generateFaqJsonLd(faqs);

  const breadcrumbs = [
    { label: "Blog", href: "/blog" },
    { label: post.category.replace("_", " "), href: `/blog/category/${post.category.toLowerCase().replace(/_/g, "-")}` },
    { label: post.title },
  ];

  const breadcrumbSchema = generateBreadcrumbJsonLd(
    breadcrumbs.map((b) => ({ name: b.label, url: b.href || `/blog/${post.slug}` }))
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <JsonLdScript data={[articleSchema, faqSchema, breadcrumbSchema].filter(Boolean)} />

      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <header className="space-y-4 border-b pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
            {post.category.replace("_", " ")}
          </span>
          {post.isLiveBlog && (
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-red-600 bg-red-500/10 px-3 py-1 rounded-full animate-pulse">
              <Radio className="w-3.5 h-3.5" /> LIVE UPDATES
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <User className="w-3.5 h-3.5 text-primary" />
            <span>By {post.author.name}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={new Date(post.publishedAt || post.createdAt).toISOString()}>
              Published on {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>{post.viewCount.toLocaleString()} Reads</span>
          </span>
        </div>
      </header>

      {/* Main Body with MDX & Shortcodes (TLDR, Live Ticker, College CTA) */}
      <RichBlogRenderer
        content={post.contentMdx}
        tldrSummary={post.tldrSummary}
        isLiveBlog={post.isLiveBlog}
        liveUpdates={(post.liveUpdatesJson as unknown as LiveUpdateItem[]) || undefined}
        relatedCollege={post.relatedCollege}
        blogId={post.id}
      />

      {/* FAQs Section */}
      {faqs.length > 0 && (
        <section className="pt-8 border-t space-y-4">
          <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span>Frequently Asked Questions</span>
          </h3>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="p-4 rounded-xl border bg-muted/20 space-y-1.5 text-xs">
                <h4 className="font-bold text-foreground text-sm">{f.question}</h4>
                <p className="text-muted-foreground leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
