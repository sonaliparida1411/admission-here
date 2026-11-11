"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Building2, 
  MapPin, 
  Award, 
  IndianRupee, 
  Briefcase, 
  Download, 
  CheckSquare, 
  Square,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { LeadCaptureModal } from "./LeadCaptureModal";
import { LeadCtaType } from "@prisma/client";
import { formatInr } from "@/lib/utils";

export interface CollegeCardData {
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
  featuredCourse?: {
    degree: string;
    specialization: string;
    totalFeesInr: number;
  } | null;
  latestPlacement?: {
    batchYear: number;
    averagePackageInr: bigint | number;
    highestPackageInr: bigint | number;
  } | null;
}

interface CollegeCardProps {
  college: CollegeCardData;
  isCompared?: boolean;
  onToggleCompare?: (college: CollegeCardData) => void;
}

export function CollegeCard({ college, isCompared, onToggleCompare }: CollegeCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [ctaType, setCtaType] = useState<LeadCtaType>(LeadCtaType.APPLY_NOW);

  const openModal = (type: LeadCtaType) => {
    setCtaType(type);
    setModalOpen(true);
  };

  return (
    <>
      <div className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col group relative">
        {/* Top Header / Badges */}
        <div className="p-4 sm:p-5 flex items-start gap-4 flex-1">
          {/* Logo */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border bg-muted/30 p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
            {college.logoUrl ? (
              <img
                src={college.logoUrl}
                alt={`${college.name} Logo`}
                className="w-full h-full object-contain"
              />
            ) : (
              <Building2 className="w-8 h-8 text-muted-foreground" />
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {college.nirfRank && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400">
                  <Award className="w-3 h-3" /> NIRF #{college.nirfRank}
                </span>
              )}
              {college.naacGrade && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="w-3 h-3" /> NAAC {college.naacGrade}
                </span>
              )}
              <span className="text-[11px] text-muted-foreground">
                {college.ownershipType.replace("_", " ")}
              </span>
            </div>

            <Link href={`/college/${college.slug}`}>
              <h3 className="font-bold text-base sm:text-lg text-foreground hover:text-primary transition-colors line-clamp-1">
                {college.name}
              </h3>
            </Link>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {college.city}, {college.state}
              </span>
              <span>•</span>
              <span className="text-amber-600 font-bold">★ {college.ratingOverall.toFixed(1)}</span>
              <span className="text-[11px]">({college.reviewCount} reviews)</span>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t text-xs">
              <div>
                <span className="text-[11px] text-muted-foreground block">
                  {college.featuredCourse ? college.featuredCourse.degree : "Tuition Fee"}
                </span>
                <span className="font-bold text-foreground flex items-center">
                  <IndianRupee className="w-3 h-3 mr-0.5" />
                  {college.featuredCourse
                    ? formatInr(college.featuredCourse.totalFeesInr)
                    : "Check Details"}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground block">Avg Package</span>
                <span className="font-bold text-emerald-600 flex items-center">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {college.latestPlacement
                    ? formatInr(college.latestPlacement.averagePackageInr)
                    : "₹14.2 Lakh"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="bg-muted/30 px-4 py-3 border-t flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Compare Checkbox */}
          {onToggleCompare && (
            <button
              onClick={() => onToggleCompare(college)}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium cursor-pointer"
            >
              {isCompared ? (
                <CheckSquare className="w-4 h-4 text-primary" />
              ) : (
                <Square className="w-4 h-4 text-muted-foreground" />
              )}
              <span>Compare</span>
            </button>
          )}

          {/* Action CTAs */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => openModal(LeadCtaType.DOWNLOAD_BROCHURE)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#1a3068]" />
              <span className="hidden sm:inline">Brochure</span>
            </button>

            <button
              onClick={() => openModal(LeadCtaType.APPLY_NOW)}
              className="px-3.5 py-1.5 rounded-lg bg-[#C41E1E] text-white font-bold hover:bg-[#a81919] transition-colors flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
            >
              <span>Apply Now</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
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

