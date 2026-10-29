"use client";

import { useRouter } from "next/navigation";
import { X, ArrowRight, Scale } from "lucide-react";
import type { CollegeCardData } from "./CollegeCard";

interface CompareBarProps {
  selectedColleges: CollegeCardData[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function CompareBar({ selectedColleges, onRemove, onClear }: CompareBarProps) {
  const router = useRouter();

  if (selectedColleges.length === 0) return null;

  const handleCompare = () => {
    const slugs = selectedColleges.map((c) => c.slug).join("-vs-");
    router.push(`/compare/${slugs}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t shadow-2xl p-3 sm:p-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Selected List */}
        <div className="flex items-center gap-3 overflow-x-auto py-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground shrink-0">
            <Scale className="w-4 h-4 text-primary" />
            <span>Compare ({selectedColleges.length}/4):</span>
          </div>

          <div className="flex items-center gap-2">
            {selectedColleges.map((col) => (
              <div
                key={col.id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-muted/50 text-xs font-semibold text-foreground shrink-0 shadow-2xs"
              >
                <span className="truncate max-w-[120px]">{col.shortName || col.name}</span>
                <button
                  onClick={() => onRemove(col.id)}
                  className="p-0.5 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 ml-auto">
          <button
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
          >
            Clear All
          </button>
          <button
            onClick={handleCompare}
            disabled={selectedColleges.length < 2}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

