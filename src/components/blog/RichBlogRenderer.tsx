"use client";

import { BlogTldrBox } from "./BlogTldrBox";
import { LiveBlogTicker, type LiveUpdateItem } from "./LiveBlogTicker";
import { EmbeddedCollegeCTA } from "./EmbeddedCollegeCTA";

interface RichBlogRendererProps {
  content: string;
  tldrSummary?: string[];
  isLiveBlog?: boolean;
  liveUpdates?: LiveUpdateItem[];
  relatedCollege?: {
    id: string;
    slug: string;
    name: string;
    city: string;
    state: string;
    nirfRank?: number | null;
    ratingOverall: number;
    logoUrl?: string | null;
  } | null;
  blogId: string;
}

export function RichBlogRenderer({
  content,
  tldrSummary,
  isLiveBlog,
  liveUpdates,
  relatedCollege,
  blogId,
}: RichBlogRendererProps) {
  // Check if content has shortcodes
  const hasTldrShortcode = content.includes("<BlogTldrBox />") || content.includes("<BlogTldrBox/>");
  const hasLiveTickerShortcode = content.includes("<LiveBlogTicker />") || content.includes("<LiveBlogTicker/>");
  const hasCtaShortcode = content.includes("<EmbeddedCollegeCTA");

  // Clean raw markdown shortcodes for default prose rendering
  let cleanedHtml = content
    .replace(/<BlogTldrBox\s*\/>/g, "")
    .replace(/<LiveBlogTicker\s*\/>/g, "")
    .replace(/<EmbeddedCollegeCTA[^>]*\/>/g, "");

  // Simple markdown heading/paragraph formatting
  cleanedHtml = cleanedHtml
    .split("\n\n")
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      if (block.startsWith("# ")) return `<h1 class="text-2xl sm:text-3xl font-extrabold text-foreground mt-8 mb-4">${block.slice(2)}</h1>`;
      if (block.startsWith("## ")) return `<h2 class="text-xl sm:text-2xl font-bold text-foreground mt-7 mb-3">${block.slice(3)}</h2>`;
      if (block.startsWith("### ")) return `<h3 class="text-lg font-bold text-foreground mt-6 mb-2">${block.slice(4)}</h3>`;
      if (block.startsWith("- ")) {
        const items = block.split("\n").map(li => `<li>${li.replace(/^- /, "")}</li>`).join("");
        return `<ul class="list-disc pl-5 my-4 space-y-1 text-sm text-foreground/80">${items}</ul>`;
      }
      return `<p class="my-3 text-sm sm:text-base leading-relaxed text-foreground/85">${block}</p>`;
    })
    .join("");

  return (
    <article className="max-w-4xl mx-auto">
      {/* 1. TL;DR AI & GEO Box */}
      {tldrSummary && tldrSummary.length > 0 && (
        <BlogTldrBox bullets={tldrSummary} />
      )}

      {/* 2. Embedded College Card if high-intent */}
      {relatedCollege && (
        <EmbeddedCollegeCTA college={relatedCollege} blogId={blogId} />
      )}

      {/* 3. Live Ticker for Exam Results / Live Feeds */}
      {isLiveBlog && liveUpdates && liveUpdates.length > 0 && (
        <LiveBlogTicker updates={liveUpdates} />
      )}

      {/* 4. Article Main Body */}
      <div
        className="prose prose-slate dark:prose-invert max-w-none text-foreground/90 leading-relaxed break-words overflow-x-auto touch-scroll"
        dangerouslySetInnerHTML={{ __html: cleanedHtml }}
      />
    </article>
  );
}

