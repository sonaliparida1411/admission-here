"use client";

import { useState } from "react";
import { X, CheckCircle2, FileText, Send, Sparkles, Phone, User, GraduationCap, AlertCircle } from "lucide-react";
import { LeadCtaType } from "@prisma/client";

interface LeadCaptureModalProps {
  open: boolean;
  onClose: () => void;
  collegeId?: string;
  collegeName?: string;
  blogId?: string;
  ctaType?: LeadCtaType;
  brochureUrl?: string;
  defaultStream?: string;
}

export function LeadCaptureModal({
  open,
  onClose,
  collegeId,
  collegeName = "Top College",
  blogId,
  ctaType = LeadCtaType.APPLY_NOW,
  brochureUrl,
  defaultStream = "Engineering",
}: LeadCaptureModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [stream, setStream] = useState(defaultStream);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  // Strict Phone Validation (India standard: 10 digits or with optional +91/country code)
  const validatePhone = (phoneNumber: string): boolean => {
    const cleaned = phoneNumber.replace(/[\s\-()]/g, "");
    // Matches 10-digit mobile number, or with leading 0 or +91
    const phoneRegex = /^(\+?\d{1,3})?[6-9]\d{9}$|^[0-9]{10,14}$/;
    return phoneRegex.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent double submission

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedStream = stream.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setError("Please enter your full name (minimum 2 characters).");
      return;
    }

    if (!trimmedPhone) {
      setError("Please enter your contact number.");
      return;
    }

    if (!validatePhone(trimmedPhone)) {
      setError("Please enter a valid 10-digit mobile contact number.");
      return;
    }

    if (!trimmedStream) {
      setError("Please select or enter your target stream.");
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
          targetStream: trimmedStream,
          targetCollegeId: collegeId,
          sourceBlogId: blogId,
          sourceUrl: typeof window !== "undefined" ? window.location.pathname : "/",
          ctaType,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setStep("success");
      } else {
        setError(json.error || "Failed to submit application. Please try again.");
      }
    } catch {
      setError("Network connection issue. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setStep("form");
    setName("");
    setPhone("");
    setError(null);
    onClose();
  };

  const getTitle = () => {
    if (ctaType === LeadCtaType.DOWNLOAD_BROCHURE) return `Download Brochure: ${collegeName}`;
    if (ctaType === LeadCtaType.CHECK_ELIGIBILITY) return `Check Eligibility: ${collegeName}`;
    return `Apply for Admission: ${collegeName}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-background rounded-2xl shadow-2xl border overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-transparent flex items-start justify-between shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary mb-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Direct College Application Portal</span>
            </div>
            <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug">{getTitle()}</h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground shrink-0 ml-2 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Field 1: Student Name */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  1. Student Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border rounded-xl bg-background outline-hidden focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>
              </div>

              {/* Field 2: Contact Number */}
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
                    placeholder="e.g. 9876543210 or +91 9876543210"
                    className="w-full pl-9 pr-3 py-2.5 text-xs border rounded-xl bg-background outline-hidden focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                  />
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  Official counseling guidance and updates will be communicated on this number.
                </span>
              </div>

              {/* Field 3: Target Stream */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  3. Target Stream *
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <select
                    required
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs border rounded-xl bg-background outline-hidden focus:border-primary focus:ring-1 focus:ring-primary font-medium cursor-pointer"
                  >
                    <option value="Engineering">Engineering (B.Tech / M.Tech)</option>
                    <option value="Management">Management (MBA / BBA)</option>
                    <option value="Medical">Medical (MBBS / BDS / AYUSH)</option>
                    <option value="Law">Law (BA LLB / LLM)</option>
                    <option value="Commerce">Commerce & Accounting (B.Com / M.Com)</option>
                    <option value="Science">Pure Sciences (B.Sc / M.Sc)</option>
                    <option value="Design">Architecture & Design (B.Arch / B.Des)</option>
                    <option value="Arts">Humanities & Social Sciences (BA / MA)</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "#c41e1e" }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit College Application</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-muted-foreground">
                Zero spam policy • Strictly confidential direct admission inquiry
              </p>
            </form>
          )}

          {step === "success" && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-lg text-foreground">Application Submitted Successfully!</h4>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  Your interest in <strong>{collegeName}</strong> for <strong>{stream}</strong> has been logged. An authorized admission counselor will contact you at <strong>{phone}</strong> with next steps.
                </p>
              </div>

              {ctaType === LeadCtaType.DOWNLOAD_BROCHURE && brochureUrl && (
                <div className="pt-2">
                  <a
                    href={brochureUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download Official PDF Brochure</span>
                  </a>
                </div>
              )}

              <button
                onClick={handleResetAndClose}
                className="mt-4 px-5 py-2 rounded-lg border text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Done / Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
