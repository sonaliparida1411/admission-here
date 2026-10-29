"use client";

import { Pin, Radio, Clock } from "lucide-react";

export interface LiveUpdateItem {
  id: string;
  timestamp: string;
  headline: string;
  bodyHtml: string;
  isPinned?: boolean;
}

interface LiveBlogTickerProps {
  updates?: LiveUpdateItem[];
}

export function LiveBlogTicker({ updates }: LiveBlogTickerProps) {
  if (!updates || updates.length === 0) return null;

  const sorted = [...updates].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="my-8 border rounded-2xl bg-card overflow-hidden shadow-xs">
      <div className="p-4 bg-muted/40 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-red-500" />
            <span>Live Coverage Feed & Verified Updates</span>
          </h4>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {updates.length} updates logged
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {sorted.map((item) => (
          <div
            key={item.id}
            className={`relative pl-6 border-l-2 transition-all ${
              item.isPinned
                ? "border-amber-500 bg-amber-500/5 -mx-3 p-3 rounded-r-xl"
                : "border-primary/40 hover:border-primary"
            }`}
          >
            {item.isPinned && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 mb-1">
                <Pin className="w-3 h-3 rotate-45" /> PINNED UPDATE
              </span>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Clock className="w-3 h-3" />
              <time dateTime={item.timestamp}>
                {new Date(item.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })} IST
              </time>
            </div>

            <h5 className="font-bold text-sm sm:text-base text-foreground mb-2">
              {item.headline}
            </h5>

            <div
              className="text-xs sm:text-sm text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: item.bodyHtml }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

