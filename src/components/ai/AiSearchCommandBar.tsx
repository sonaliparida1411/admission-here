"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Building2, ExternalLink, X, MapPin, Award } from "lucide-react";
import type { HybridSearchResult } from "@/lib/db/hybrid-search";

interface AiSearchCommandBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AiSearchCommandBar({ open, onOpenChange }: AiSearchCommandBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<HybridSearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/search/hybrid?q=${encodeURIComponent(query)}&limit=8`);
        if (res.ok) {
          const json = await res.json();
          setResults(json.data || []);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-6 sm:pt-20 px-3 sm:px-4">
      <div className="w-full max-w-2xl bg-background rounded-xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b gap-3 bg-muted/20 shrink-0">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by college name, city, stream, or cutoffs (e.g., IIT Bombay, NIT CSE, Odisha)..."
            className="flex-1 bg-transparent border-0 outline-hidden text-sm placeholder:text-muted-foreground focus:ring-0"
          />
          {loading ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : query ? (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[10px] bg-muted px-2 py-0.5 rounded border text-muted-foreground">ESC</span>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground flex items-center justify-between">
                <span>RRF Hybrid Search Results</span>
                <span className="flex items-center gap-1 text-[11px] text-purple-600 font-normal">
                  <Sparkles className="w-3 h-3" /> pgvector + tsvector fused
                </span>
              </div>
              {results.map((col) => (
                <div
                  key={col.id}
                  onClick={() => {
                    onOpenChange(false);
                    router.push(`/college/${col.slug}`);
                  }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/70 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm group-hover:text-primary transition-colors flex items-center gap-2">
                        {col.name}
                        {col.nirfRank && (
                          <span className="text-[10px] font-bold bg-amber-500/15 text-amber-700 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <Award className="w-3 h-3" /> #{col.nirfRank}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {col.city}, {col.state}
                        </span>
                        <span>•</span>
                        <span>{col.ownershipType.replace("_", " ")}</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-medium">★ {col.ratingOverall} / 5</span>
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No matching colleges found for &quot;{query}&quot;. Try searching &quot;IIT&quot;, &quot;NIT&quot;, or &quot;Engineering&quot;.
            </div>
          ) : (
            <div className="p-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Quick Suggested Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {["IIT Bombay", "NIT Rourkela", "B.Tech in Odisha", "BITS Pilani", "IIM Ahmedabad", "Computer Science"].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuery(suggestion)}
                      className="text-xs px-3 py-1.5 rounded-full border bg-muted/40 hover:bg-accent transition-colors cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

