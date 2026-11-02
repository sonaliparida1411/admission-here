"use client";

import { useState } from "react";
import { Send, FileText, Download } from "lucide-react";
import { LeadCaptureModal } from "./LeadCaptureModal";
import { BrochureDownloadModal } from "./BrochureDownloadModal";
import { LeadCtaType } from "@prisma/client";

interface CollegeApplyButtonProps {
  collegeId: string;
  collegeName: string;
  defaultStream?: string;
  brochureUrl?: string;
  ctaType?: LeadCtaType;
  buttonText?: string;
  variant?: "primary" | "outline" | "secondary";
  className?: string;
}

export function CollegeApplyButton({
  collegeId,
  collegeName,
  defaultStream = "Engineering",
  brochureUrl,
  ctaType = LeadCtaType.APPLY_NOW,
  buttonText,
  variant = "primary",
  className = "",
}: CollegeApplyButtonProps) {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);

  const isBrochure = ctaType === LeadCtaType.DOWNLOAD_BROCHURE;
  const label = buttonText || (isBrochure ? "Download Official Brochure" : "Apply Now (3-Field Form)");

  const getVariantStyles = () => {
    if (variant === "outline") {
      return "border border-primary text-primary hover:bg-primary/10 bg-background";
    }
    if (variant === "secondary") {
      return "bg-secondary text-secondary-foreground hover:bg-secondary/90 border";
    }
    return "text-white font-bold shadow-md hover:opacity-95 active:scale-98";
  };

  const handleClick = () => {
    if (isBrochure) {
      setBrochureModalOpen(true);
    } else {
      setApplyModalOpen(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${getVariantStyles()} ${className}`}
        style={variant === "primary" ? { background: isBrochure ? "#1a3068" : "#c41e1e" } : {}}
      >
        {isBrochure ? (
          <Download className="w-3.5 h-3.5" />
        ) : (
          <Send className="w-3.5 h-3.5" />
        )}
        <span>{label}</span>
      </button>

      {/* 3-Field Direct Apply Form */}
      <LeadCaptureModal
        open={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        collegeId={collegeId}
        collegeName={collegeName}
        ctaType={LeadCtaType.APPLY_NOW}
        defaultStream={defaultStream}
        brochureUrl={brochureUrl}
      />

      {/* 7-Field Brochure Download Modal */}
      <BrochureDownloadModal
        open={brochureModalOpen}
        onClose={() => setBrochureModalOpen(false)}
        collegeId={collegeId}
        collegeName={collegeName}
        brochureUrl={brochureUrl}
        defaultCourse={`${defaultStream}`}
      />
    </>
  );
}
