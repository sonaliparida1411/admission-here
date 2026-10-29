"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  Building2, 
  MapPin, 
  Award, 
  ShieldCheck, 
  Download, 
  Send,
  Star,
  Calendar,
  Share2
} from "lucide-react";
import { LeadCaptureModal } from "@/components/public/LeadCaptureModal";
import { LeadCtaType } from "@prisma/client";

interface CollegeHeaderClientProps {
  college: {
    id: string;
    slug: string;
    name: string;
    shortName?: string | null;
    logoUrl?: string | null;
    coverImageUrl?: string | null;
    brochurePdfUrl?: string | null;
    city: string;
    state: string;
    estYear?: number | null;
    ownershipType: string;
    naacGrade?: string | null;
    nirfRank?: number | null;
    ratingOverall: number;
    reviewCount: number;
  };
}

export function CollegeHeaderClient({ college }: CollegeHeaderClientProps) {
  const pathname = usePathname();
  const [modalOpen, setModalOpen] = useState(false);
  const [ctaType, setCtaType] = useState<LeadCtaType>(LeadCtaType.APPLY_NOW);

  const tabs = [
    { label: "Overview", path: `/college/${college.slug}` },
    { label: "Courses & Fees", path: `/college/${college.slug}/courses-fees` },
    { label: "Admission 2026", path: `/college/${college.slug}/admission` },
    { label: "Cutoff", path: `/college/${college.slug}/cutoff` },
    { label: "Placements", path: `/college/${college.slug}/placements` },
    { label: "Rankings", path: `/college/${college.slug}/rankings` },
    { label: "Campus Gallery", path: `/college/${college.slug}/gallery` },
    { label: "Reviews", path: `/college/${college.slug}/reviews` },
    { label: "Q&A", path: `/college/${college.slug}/qna` },
  ];

  const handleOpenCta = (type: LeadCtaType) => {
    setCtaType(type);
    setModalOpen(true);
  };

  return (
    <>
      <div className="bg-card border-b">
        {/* Cover Banner */}
        <div className="h-36 sm:h-56 w-full relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900">
          {college.coverImageUrl ? (
            <img
              src={college.coverImageUrl}
              alt={`${college.name} Campus`}
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-20">
              <Building2 className="w-24 sm:w-32 h-24 sm:h-32 text-white" />
            </div>
          )}
        </div>

        {/* Info Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-14 sm:-mt-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 sm:gap-6 pb-5">
            <div className="flex items-start sm:items-end gap-3.5 sm:gap-5 w-full md:w-auto">
              {/* College Logo */}
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl border-4 border-background bg-card shadow-lg p-2 flex items-center justify-center shrink-0">
                {college.logoUrl ? (
                  <img
                    src={college.logoUrl}
                    alt={`${college.name} Logo`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Building2 className="w-10 sm:w-12 h-10 sm:h-12 text-primary" />
                )}
              </div>

              {/* Title & Metadata */}
              <div className="space-y-1 pt-1 sm:pt-0 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {college.nirfRank && (
                    <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400">
                      <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> NIRF #{college.nirfRank}
                    </span>
                  )}
                  {college.naacGrade && (
                    <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                      <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> NAAC {college.naacGrade}
                    </span>
                  )}
                  <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">
                    {college.ownershipType.replace("_", " ")}
                  </span>
                </div>

                <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight line-clamp-2 sm:line-clamp-none">
                  {college.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span>{college.city}, {college.state}</span>
                  </span>
                  {college.estYear && (
                    <span className="hidden xs:flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 shrink-0" /> Estd. {college.estYear}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                    {college.ratingOverall.toFixed(1)} <span className="text-[11px] text-muted-foreground font-normal">({college.reviewCount})</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Top Action CTAs (Desktop / Tablet) */}
            <div className="hidden sm:flex items-center gap-2.5 w-full sm:w-auto shrink-0">
              <button
                onClick={() => handleOpenCta(LeadCtaType.DOWNLOAD_BROCHURE)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border bg-background hover:bg-accent font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>Download Brochure</span>
              </button>

              <button
                onClick={() => handleOpenCta(LeadCtaType.APPLY_NOW)}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#c41e1e" }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Apply Now 2026</span>
              </button>
            </div>
          </div>

          {/* Sticky 9 Sub-Tabs with Smooth Horizontal Touch Scroll */}
          <div className="flex gap-2 overflow-x-auto border-t py-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none touch-scroll">
            {tabs.map((tab) => {
              const isActive = pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors shrink-0 ${
                    isActive
                      ? "text-white shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  style={isActive ? { background: "#1a3068" } : {}}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Mobile Bottom Action Bar (Mobile Only) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t px-4 py-2.5 flex items-center gap-2.5 mobile-bottom-bar shadow-xl">
        <button
          onClick={() => handleOpenCta(LeadCtaType.DOWNLOAD_BROCHURE)}
          className="flex-1 py-2.5 px-3 rounded-xl border bg-background font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs text-foreground active:scale-95 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-blue-600" />
          <span>Brochure</span>
        </button>
        <button
          onClick={() => handleOpenCta(LeadCtaType.APPLY_NOW)}
          className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          style={{ background: "#c41e1e" }}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Apply Now</span>
        </button>
      </div>

      <LeadCaptureModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        collegeId={college.id}
        collegeName={college.name}
        ctaType={ctaType}
        brochureUrl={college.brochurePdfUrl || undefined}
      />
    </>
  );
}
