"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  CheckCircle2, 
  FileText, 
  Download, 
  Sparkles, 
  Phone, 
  User, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Users, 
  AlertCircle 
} from "lucide-react";
import { LeadCtaType } from "@prisma/client";

interface BrochureDownloadModalProps {
  open: boolean;
  onClose: () => void;
  collegeId: string;
  collegeName: string;
  brochureUrl?: string | null;
  defaultCourse?: string;
}

export function BrochureDownloadModal({
  open,
  onClose,
  collegeId,
  collegeName,
  brochureUrl,
  defaultCourse = "B.Tech Computer Science",
}: BrochureDownloadModalProps) {
  const [step, setStep] = useState<"form" | "success" | "already_submitted">("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [targetCourse, setTargetCourse] = useState(defaultCourse);
  const [parentPhone, setParentPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storageKey = `admision_brochure_${collegeId}`;
  const effectiveBrochureUrl = brochureUrl || `/brochures/${collegeName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-2026.pdf`;

  // Check if user already submitted the brochure form for this college
  useEffect(() => {
    if (open && typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setStep("already_submitted");
      } else {
        setStep("form");
      }
    }
  }, [open, collegeId, storageKey]);

  if (!open) return null;

  const validatePhone = (phoneNumber: string): boolean => {
    const cleaned = phoneNumber.replace(/[\s\-()]/g, "");
    return /^(\+?\d{1,3})?[6-9]\d{9}$|^[0-9]{10,14}$/.test(cleaned);
  };

  const validateEmail = (mail: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  };

  const handleDownload = () => {
    // Open/download PDF
    window.open(effectiveBrochureUrl, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedState = state.trim();
    const trimmedDistrict = district.trim();
    const trimmedCourse = targetCourse.trim();
    const trimmedParentPhone = parentPhone.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!trimmedPhone || !validatePhone(trimmedPhone)) {
      setError("Please enter a valid 10-digit mobile contact number.");
      return;
    }

    if (!trimmedEmail || !validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address to receive brochure updates.");
      return;
    }

    if (!trimmedState) {
      setError("Please enter your home state.");
      return;
    }

    if (!trimmedDistrict) {
      setError("Please enter your district.");
      return;
    }

    if (!trimmedCourse) {
      setError("Please select or enter your target course.");
      return;
    }

    if (!trimmedParentPhone || !validatePhone(trimmedParentPhone)) {
      setError("Please enter a valid 10-digit parent or guardian contact number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: trimmedName,
          phone: trimmedPhone,
          email: trimmedEmail,
          state: trimmedState,
          district: trimmedDistrict,
          parentPhone: trimmedParentPhone,
          targetCourse: trimmedCourse,
          targetStream: trimmedCourse.split(" ")[0] || "General",
          targetCollegeId: collegeId,
          sourceUrl: typeof window !== "undefined" ? window.location.pathname : "/",
          ctaType: LeadCtaType.DOWNLOAD_BROCHURE,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        // Cache submission in localStorage to avoid repeated prompts
        if (typeof window !== "undefined") {
          localStorage.setItem(storageKey, JSON.stringify({ submittedAt: new Date().toISOString(), phone: trimmedPhone }));
        }
        setStep("success");
        // Automatically trigger download
        handleDownload();
      } else {
        setError(json.error || "Failed to submit enquiry. Please try again.");
      }
    } catch {
      setError("Network error. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-background rounded-2xl shadow-2xl border overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-transparent flex items-start justify-between shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary mb-1">
              <FileText className="w-3 h-3" />
              <span>Official 2026 Institutional Brochure</span>
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-foreground leading-snug">
              Download Brochure: {collegeName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground shrink-0 ml-2 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {/* Step 1: Already Submitted Mode */}
          {step === "already_submitted" && (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-base text-foreground">Brochure Already Unlocked!</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  You previously requested the brochure for <strong>{collegeName}</strong>. You can download the PDF copy directly below without resubmitting your details.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Brochure Now</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="px-4 py-2.5 rounded-xl border text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Update Details &amp; Resubmit
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Brochure Enquiry Form */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <p className="text-xs text-muted-foreground">
                Please complete this verification form to instantly download the comprehensive fee structure, cutoff handbook, and admission syllabus.
              </p>

              {error && (
                <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  1. Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2 text-xs border rounded-xl bg-background outline-hidden focus:border-primary font-medium"
                  />
                </div>
              </div>

              {/* 2 & 3: Contact & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    2. Contact Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full pl-9 pr-3 py-2 text-xs border rounded-xl bg-background outline-hidden focus:border-primary font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    3. Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3 py-2 text-xs border rounded-xl bg-background outline-hidden focus:border-primary font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* 4 & 5: State & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    4. State *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Odisha / Maharashtra"
                      className="w-full pl-9 pr-3 py-2 text-xs border rounded-xl bg-background outline-hidden focus:border-primary font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    5. District *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Khordha / Sundargarh"
                      className="w-full pl-9 pr-3 py-2 text-xs border rounded-xl bg-background outline-hidden focus:border-primary font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* 6. Target Course */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  6. Target Course *
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={targetCourse}
                    onChange={(e) => setTargetCourse(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science / MBA Marketing"
                    className="w-full pl-9 pr-3 py-2 text-xs border rounded-xl bg-background outline-hidden focus:border-primary font-medium"
                  />
                </div>
              </div>

              {/* 7. Parent / Guardian Contact Number */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  7. Parent / Guardian Contact Number *
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="e.g. 9812345678"
                    className="w-full pl-9 pr-3 py-2 text-xs border rounded-xl bg-background outline-hidden focus:border-primary font-medium"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-60"
                style={{ background: "#1a3068" }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Details &amp; Preparing PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Submit &amp; Download Official Brochure (PDF)</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-muted-foreground">
                Your information is safely stored for official counseling communication only.
              </p>
            </form>
          )}

          {/* Step 3: Success State */}
          {step === "success" && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-lg text-foreground">Brochure Request Confirmed!</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>! Your inquiry for <strong>{targetCourse}</strong> at <strong>{collegeName}</strong> has been received and verified.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Brochure Again</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="mt-4 px-5 py-2 rounded-lg border text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

