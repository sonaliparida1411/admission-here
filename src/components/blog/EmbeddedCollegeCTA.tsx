"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Award, Download, ChevronRight, CheckCircle } from "lucide-react";
import { LeadCaptureModal } from "../public/LeadCaptureModal";
import { LeadCtaType } from "@prisma/client";

interface EmbeddedCollegeCTAProps {
  college: {
    id: string;
    slug: string;
    name: string;
    city: string;
    state: string;
    nirfRank?: number | null;
    ratingOverall: number;
    logoUrl?: string | null;
  };
  blogId?: string;
}

export function EmbeddedCollegeCTA({ college, blogId }: EmbeddedCollegeCTAProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [ctaType, setCtaType] = useState<LeadCtaType>(LeadCtaType.APPLY_NOW);

  const openModal = (type: LeadCtaType) => {
    setCtaType(type);
    setModalOpen(true);
  };

  return (
    <>
      <div className="my-6 p-5 rounded-2xl border-2 border-primary/20 bg-card shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl border bg-muted/40 p-2 shrink-0 flex items-center justify-center">
            {college.logoUrl ? (
              <img
                src={college.logoUrl}
                alt={college.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <Building2 className="w-8 h-8 text-primary" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              {college.nirfRank && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 flex items-center gap-1">
                  <Award className="w-3 h-3" /> NIRF #{college.nirfRank}
                </span>
              )}
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5">
                <CheckCircle className="w-3 h-3" /> Verified Institute
              </span>
            </div>

            <Link href={`/college/${college.slug}`}>
              <h4 className="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors">
                {college.name}
              </h4>
            </Link>

            <p className="text-xs text-muted-foreground mt-0.5">
              {college.city}, {college.state} • ★ {college.ratingOverall.toFixed(1)} / 5.0
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => openModal(LeadCtaType.DOWNLOAD_BROCHURE)}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg border bg-background hover:bg-accent font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Brochure</span>
          </button>

          <button
            onClick={() => openModal(LeadCtaType.APPLY_NOW)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Apply Now</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <LeadCaptureModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        collegeId={college.id}
        collegeName={college.name}
        blogId={blogId}
        ctaType={ctaType}
      />
    </>
  );
}

