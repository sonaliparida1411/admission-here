"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building2, ArrowRight } from "lucide-react";

export function HeroSearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [stream, setStream] = useState("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      if (stream !== "all") {
        router.push(`/colleges/${stream}`);
      } else {
        router.push("/colleges");
      }
      return;
    }
    router.push(`/colleges?q=${encodeURIComponent(query.trim())}${stream !== "all" ? `&stream=${stream}` : ""}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-xl border border-slate-200 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 flex flex-col sm:flex-row items-stretch gap-2"
      >
        <div className="flex-1 flex items-center px-3.5 py-2.5 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by college name, city, state, or course (e.g. IIT Bombay, NIT Rourkela)..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3">
          <select
            value={stream}
            onChange={(e) => setStream(e.target.value)}
            className="bg-slate-100 text-xs sm:text-sm font-semibold text-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none cursor-pointer border-0"
          >
            <option value="all">All Courses</option>
            <option value="b-tech">Engineering</option>
            <option value="mba">Management</option>
            <option value="mbbs">Medical</option>
          </select>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#1a3068] hover:bg-[#152754] active:bg-[#0f1f45] transition-colors shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Realistic Popular Searches */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3.5 text-xs">
        <span className="text-slate-500 font-medium">Popular:</span>
        {[
          { label: "IIT Bombay", q: "IIT Bombay" },
          { label: "NIT Rourkela", q: "NIT Rourkela" },
          { label: "BITS Pilani", q: "BITS Pilani" },
          { label: "Top B.Tech Colleges", href: "/colleges/b-tech" },
          { label: "Top MBA Colleges", href: "/colleges/mba" },
        ].map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              if (item.href) {
                router.push(item.href);
              } else {
                router.push(`/colleges?q=${encodeURIComponent(item.q || "")}`);
              }
            }}
            className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-[#1a3068] hover:text-[#1a3068] transition-colors text-[11px] font-medium shadow-xs"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
