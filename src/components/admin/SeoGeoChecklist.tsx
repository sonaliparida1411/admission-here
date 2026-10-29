"use client";

import { CheckCircle2, XCircle, Sparkles, Globe, Cpu } from "lucide-react";

interface SeoGeoChecklistProps {
  metaTitle: string;
  metaDescription: string;
  tldrBullets: string[];
  contentLength: number;
  hasShortcodes: boolean;
}

export function SeoGeoChecklist({
  metaTitle,
  metaDescription,
  tldrBullets,
  contentLength,
  hasShortcodes,
}: SeoGeoChecklistProps) {
  const isTitleOptimal = metaTitle.length >= 50 && metaTitle.length <= 65;
  const isDescOptimal = metaDescription.length >= 135 && metaDescription.length <= 165;
  const hasTldrBox = tldrBullets.length >= 3;
  const isContentDetailed = contentLength > 800;

  let score = 0;
  if (isTitleOptimal) score += 20;
  else if (metaTitle.length > 20) score += 10;

  if (isDescOptimal) score += 20;
  else if (metaDescription.length > 50) score += 10;

  if (hasTldrBox) score += 25;
  if (hasShortcodes) score += 15;
  if (isContentDetailed) score += 20;

  const getScoreColor = () => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-500";
  };

  return (
    <div className="bg-card border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>SEO & GEO Audit Engine</span>
        </div>
        <span className={`text-base font-extrabold ${getScoreColor()}`}>
          {score}/100
        </span>
      </div>

      <div className="space-y-2.5 text-xs">
        <div className="flex items-start gap-2">
          {isTitleOptimal ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-semibold text-foreground">Optimal Title Length (50-65 chars)</span>
            <p className="text-[11px] text-muted-foreground">Current: {metaTitle.length} chars</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          {isDescOptimal ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-semibold text-foreground">SERP Meta Snippet (135-165 chars)</span>
            <p className="text-[11px] text-muted-foreground">Current: {metaDescription.length} chars</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          {hasTldrBox ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-semibold text-foreground">GEO 4-Bullet Answer Box</span>
            <p className="text-[11px] text-muted-foreground">
              Required for LLM answer engines (Perplexity / ChatGPT citation)
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          {hasShortcodes ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-semibold text-foreground">High-Intent College CTA Card</span>
            <p className="text-[11px] text-muted-foreground">Shortcode embedded for lead conversion</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          {isContentDetailed ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-semibold text-foreground">Comprehensive Content Depth</span>
            <p className="text-[11px] text-muted-foreground">{contentLength} characters drafted</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-3 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
        <span className="flex items-center gap-1">
          <Globe className="w-3 h-3 text-blue-500" /> JSON-LD Ready
        </span>
        <span className="flex items-center gap-1">
          <Cpu className="w-3 h-3 text-purple-500" /> Vector Indexable
        </span>
      </div>
    </div>
  );
}

