"use client";

import { useState } from "react";
import { 
  Sparkles, 
  Building2, 
  Radio, 
  HelpCircle, 
  ListOrdered, 
  Save, 
  Send,
  Eye,
  Edit3
} from "lucide-react";
import { SeoGeoChecklist } from "./SeoGeoChecklist";
import { RichBlogRenderer } from "../blog/RichBlogRenderer";

interface BlogMdxEditorProps {
  initialData?: {
    id?: string;
    title: string;
    metaTitle?: string;
    metaDescription?: string;
    featuredImageUrl?: string;
    tldrSummary?: string[];
    contentMdx: string;
    category: string;
    tags?: string[];
    isLiveBlog?: boolean;
    relatedCollegeSlug?: string;
  };
  /** When false, the Publish button is hidden (staff without publish permission). */
  canPublish?: boolean;
  onSave: (data: any, isPublish: boolean) => Promise<void>;
}

export function BlogMdxEditor({ initialData, canPublish = true, onSave }: BlogMdxEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(initialData?.featuredImageUrl || "");
  const [category, setCategory] = useState(initialData?.category || "CUTOFF_ANALYSIS");
  const [tagsText, setTagsText] = useState((initialData?.tags || []).join(", "));
  const [tldrText, setTldrText] = useState(
    (initialData?.tldrSummary || [
      "Top NIT CSE opening ranks range between 1,000 to 7,000 AIR.",
      "Home State quota provides 40-60% rank relaxation.",
      "NIT Rourkela Round 1 CSE closed at 6,420 rank.",
      "Session 2 registration window remains open until March 5, 2026.",
    ]).join("\n")
  );
  const [contentMdx, setContentMdx] = useState(
    initialData?.contentMdx ||
      `# Article Heading\n\n<BlogTldrBox />\n\n## Official Cutoff Breakdown\n\nJoSAA counseling statistics indicate heightened competition for Tier-1 engineering seats.\n\n<EmbeddedCollegeCTA slug="nit-rourkela" />\n\n## Summary & Strategy Advice\n\nEnsure your choice preferences are locked prior to the Round 1 deadline.`
  );
  const [isLiveBlog, setIsLiveBlog] = useState(initialData?.isLiveBlog || false);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [saving, setSaving] = useState(false);

  const insertShortcode = (shortcode: string) => {
    setContentMdx((prev) => `${prev}\n\n${shortcode}\n\n`);
  };

  const handleFormSubmit = async (publish: boolean) => {
    setSaving(true);
    try {
      const tldrArray = tldrText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const tagsArray = tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await onSave(
        {
          id: initialData?.id,
          title,
          metaTitle,
          metaDescription,
          featuredImageUrl: featuredImageUrl.trim() || undefined,
          category,
          tags: tagsArray,
          tldrSummary: tldrArray,
          contentMdx,
          isLiveBlog,
        },
        publish
      );
    } finally {
      setSaving(false);
    }
  };

  const tldrBullets = tldrText.split("\n").filter(Boolean);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Editor Col */}
      <div className="lg:col-span-2 space-y-5">
        {/* Title Input */}
        <div className="bg-card border rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">
              Article Editorial Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. JEE Main 2026 Cutoff Analysis: Opening and Closing Ranks for Top NITs"
              className="w-full text-base sm:text-lg font-bold border rounded-lg px-3.5 py-2.5 bg-background outline-hidden focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs border rounded-lg px-3 py-2 bg-background"
              >
                <option value="EXAM_NEWS">Exam News & Live Updates</option>
                <option value="ADMISSION_ALERT">Admission Alert</option>
                <option value="CUTOFF_ANALYSIS">Cutoff Analysis</option>
                <option value="COLLEGE_ROUNDUP">College Roundup</option>
                <option value="CAREER_GUIDE">Career Guide</option>
                <option value="SCHOLARSHIP">Scholarships</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLiveBlog}
                  onChange={(e) => setIsLiveBlog(e.target.checked)}
                  className="rounded text-primary"
                />
                <span className="flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-red-500" />
                  Enable Live Exam Updates Mode
                </span>
              </label>
            </div>
          </div>

          {/* Featured Image URL */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Featured Image URL <span className="font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full text-xs border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
            />
            {featuredImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={featuredImageUrl}
                alt="Featured preview"
                className="mt-2 h-24 w-auto rounded-lg object-cover border"
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Tags <span className="font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="jee-main, cutoff-2026, nit-rourkela"
              className="w-full text-xs border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
            />
          </div>
        </div>

        {/* 4-Bullet TLDR Box (AI / GEO Answer Box) */}
        <div className="bg-card border rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>GEO / AEO 4-Bullet Answer Box (1 line per bullet)</span>
            </label>
            <span className="text-[11px] text-muted-foreground">
              {tldrBullets.length} bullet(s)
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Extracted by search engines (Perplexity, Google AI Overviews, ChatGPT) as immediate cited answer.
          </p>
          <textarea
            rows={4}
            value={tldrText}
            onChange={(e) => setTldrText(e.target.value)}
            className="w-full text-xs font-mono border rounded-lg p-3 bg-background outline-hidden focus:border-primary"
          />
        </div>

        {/* MDX & Shortcode Toolbar */}
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="p-3 border-b bg-muted/30 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("write")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === "write" ? "bg-background border shadow-2xs text-primary" : "text-muted-foreground"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Write MDX</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === "preview" ? "bg-background border shadow-2xs text-primary" : "text-muted-foreground"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            {/* Shortcode Inserters */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground text-[11px] mr-1 hidden sm:inline">Insert Block:</span>
              <button
                type="button"
                onClick={() => insertShortcode('<EmbeddedCollegeCTA slug="nit-rourkela" />')}
                className="px-2 py-1 rounded border bg-background hover:bg-accent text-[11px] font-medium flex items-center gap-1 cursor-pointer"
              >
                <Building2 className="w-3 h-3 text-blue-600" />
                <span>+ College CTA</span>
              </button>
              <button
                type="button"
                onClick={() => insertShortcode("<BlogTldrBox />")}
                className="px-2 py-1 rounded border bg-background hover:bg-accent text-[11px] font-medium flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span>+ TL;DR</span>
              </button>
              <button
                type="button"
                onClick={() => insertShortcode("<LiveBlogTicker />")}
                className="px-2 py-1 rounded border bg-background hover:bg-accent text-[11px] font-medium flex items-center gap-1 cursor-pointer"
              >
                <Radio className="w-3 h-3 text-red-600" />
                <span>+ Live Feed</span>
              </button>
            </div>
          </div>

          {activeTab === "write" ? (
            <textarea
              rows={16}
              value={contentMdx}
              onChange={(e) => setContentMdx(e.target.value)}
              placeholder="Write your article content in MDX/Markdown format..."
              className="w-full p-4 text-xs font-mono bg-background outline-hidden resize-y leading-relaxed"
            />
          ) : (
            <div className="p-6 bg-background max-h-[500px] overflow-y-auto">
              <RichBlogRenderer
                content={contentMdx}
                tldrSummary={tldrBullets}
                isLiveBlog={isLiveBlog}
                blogId={initialData?.id || "preview-id"}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleFormSubmit(false)}
            className="px-4 py-2 rounded-lg border bg-background hover:bg-accent text-xs font-bold text-foreground flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save as Draft</span>
          </button>
          {canPublish ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => handleFormSubmit(true)}
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish & Index with Vector AI</span>
            </button>
          ) : (
            <span className="text-[11px] text-amber-600 font-semibold px-3 py-2 rounded-lg border bg-amber-50">
              Publishing requires admin approval
            </span>
          )}
        </div>
      </div>

      {/* SEO & GEO Optimization Sidebar */}
      <div className="space-y-5">
        <div className="bg-card border rounded-xl p-5 space-y-4">
          <h4 className="font-bold text-sm text-foreground">SEO & Metadata Configuration</h4>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-muted-foreground">SEO Meta Title</span>
              <span className={`text-[11px] font-mono ${metaTitle.length >= 50 && metaTitle.length <= 65 ? "text-emerald-600 font-bold" : "text-amber-600"}`}>
                {metaTitle.length} / 60
              </span>
            </div>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Optimized title tag for SERP (50-60 chars)"
              className="w-full text-xs border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-muted-foreground">Meta Description</span>
              <span className={`text-[11px] font-mono ${metaDescription.length >= 140 && metaDescription.length <= 165 ? "text-emerald-600 font-bold" : "text-amber-600"}`}>
                {metaDescription.length} / 160
              </span>
            </div>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Compelling SERP snippet summarizing key facts (150-160 chars)"
              className="w-full text-xs border rounded-lg p-2.5 bg-background outline-hidden focus:border-primary"
            />
          </div>
        </div>

        {/* Real-time GEO / SEO Checklist */}
        <SeoGeoChecklist
          metaTitle={metaTitle}
          metaDescription={metaDescription}
          tldrBullets={tldrBullets}
          contentLength={contentMdx.length}
          hasShortcodes={contentMdx.includes("<EmbeddedCollegeCTA")}
        />
      </div>
    </div>
  );
}

