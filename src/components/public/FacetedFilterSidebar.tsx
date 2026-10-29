"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, RotateCcw, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

interface FacetedFilterSidebarProps {
  availableStreams?: string[];
  availableStates?: string[];
}

export function FacetedFilterSidebar({
  availableStreams = ["Engineering", "Management", "Medical", "Law"],
  availableStates = ["Odisha", "Maharashtra", "Delhi", "Rajasthan", "Gujarat"],
}: FacetedFilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const currentStream = searchParams.get("stream") || "";
  const currentState = searchParams.get("state") || "";
  const currentOwnership = searchParams.get("ownership") || "";
  const currentMaxFees = searchParams.get("maxFees") || "";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/colleges?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/colleges");
  };

  const activeFilterCount = [currentStream, currentState, currentOwnership, currentMaxFees].filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <aside className="w-full lg:w-64 bg-card border rounded-xl p-4 sm:p-5 space-y-4 lg:space-y-6 shrink-0 h-fit shadow-xs">
      {/* Header with Mobile Accordion Toggle */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2 font-bold text-sm text-foreground">
          <SlidersHorizontal className="w-4 h-4" style={{ color: "#1a3068" }} />
          <span>Filter Colleges</span>
          {hasActiveFilters && (
            <span
              className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full text-white"
              style={{ background: "#c41e1e" }}
            >
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          {/* Mobile Accordion Toggle Button */}
          <button
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className="lg:hidden p-1 rounded-md text-muted-foreground hover:bg-muted"
            aria-label="Toggle filter options"
          >
            {mobileExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Filter Options (Always visible on lg, collapsible on mobile) */}
      <div className={`space-y-5 ${mobileExpanded ? "block" : "hidden lg:block"}`}>
        {/* Stream Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
            Stream / Discipline
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-1.5 text-xs">
            {availableStreams.map((st) => (
              <label
                key={st}
                className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors p-1 rounded hover:bg-muted/40"
              >
                <input
                  type="radio"
                  name="streamFilter"
                  checked={currentStream.toLowerCase() === st.toLowerCase()}
                  onChange={() =>
                    updateFilter("stream", currentStream.toLowerCase() === st.toLowerCase() ? "" : st)
                  }
                  className="text-primary focus:ring-primary rounded"
                />
                <span className="truncate">{st}</span>
              </label>
            ))}
          </div>
        </div>

        {/* State Filter */}
        <div className="space-y-2 border-t pt-4">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
            State / Location
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-1.5 text-xs">
            {availableStates.map((st) => (
              <label
                key={st}
                className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors p-1 rounded hover:bg-muted/40"
              >
                <input
                  type="radio"
                  name="stateFilter"
                  checked={currentState.toLowerCase() === st.toLowerCase()}
                  onChange={() =>
                    updateFilter("state", currentState.toLowerCase() === st.toLowerCase() ? "" : st)
                  }
                  className="text-primary focus:ring-primary rounded"
                />
                <span className="truncate">{st}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ownership Type */}
        <div className="space-y-2 border-t pt-4">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
            Institute Ownership
          </label>
          <div className="space-y-1.5 text-xs">
            {[
              { label: "Public / Government", val: "PUBLIC_GOVERNMENT" },
              { label: "Private", val: "PRIVATE" },
              { label: "Deemed University", val: "DEEMED" },
            ].map((item) => (
              <label
                key={item.val}
                className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors p-1 rounded hover:bg-muted/40"
              >
                <input
                  type="radio"
                  name="ownershipFilter"
                  checked={currentOwnership === item.val}
                  onChange={() => updateFilter("ownership", currentOwnership === item.val ? "" : item.val)}
                  className="text-primary focus:ring-primary rounded"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Max Fees Filter */}
        <div className="space-y-2 border-t pt-4">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
            Total Tuition Fees
          </label>
          <div className="space-y-1.5 text-xs">
            {[
              { label: "Under ₹5 Lakh", val: "500000" },
              { label: "Under ₹10 Lakh", val: "1000000" },
              { label: "Under ₹20 Lakh", val: "2000000" },
            ].map((item) => (
              <label
                key={item.val}
                className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors p-1 rounded hover:bg-muted/40"
              >
                <input
                  type="radio"
                  name="feeFilter"
                  checked={currentMaxFees === item.val}
                  onChange={() => updateFilter("maxFees", currentMaxFees === item.val ? "" : item.val)}
                  className="text-primary focus:ring-primary rounded"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Apply & Close on Mobile */}
        <div className="lg:hidden pt-3 border-t">
          <button
            onClick={() => setMobileExpanded(false)}
            className="w-full py-2 rounded-lg text-xs font-bold text-white text-center"
            style={{ background: "#1a3068" }}
          >
            Apply &amp; View Results
          </button>
        </div>
      </div>
    </aside>
  );
}
