"use client";

import { useState } from "react";
import { X, CheckCircle2, FileText, Send, Sparkles, Phone, Mail, User, MapPin } from "lucide-react";
import { LeadCtaType } from "@prisma/client";

interface LeadCaptureModalProps {
  open: boolean;
  onClose: () => void;
  collegeId?: string;
  collegeName?: string;
  blogId?: string;
  ctaType?: LeadCtaType;
  brochureUrl?: string;
}

export function LeadCaptureModal({
  open,
  onClose,
  collegeId,
  collegeName = "Top Partner Universities",
  blogId,
  ctaType = LeadCtaType.APPLY_NOW,
  brochureUrl,
}: LeadCaptureModalProps) {
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Odisha");
  const [stream, setStream] = useState("Engineering");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      setError("Please fill in your name, phone number, and email.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: name,
          phone,
          email,
          city,
          state,
          targetStream: stream,
          targetCollegeId: collegeId,
          sourceBlogId: blogId,
          sourceUrl: typeof window !== "undefined" ? window.location.pathname : "/",
          ctaType,
          otpCode: otp || undefined,
        }),
      });

      if (res.ok) {
        setStep("success");
      } else {
        const json = await res.json();
        setError(json.error || "Failed to submit application");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (ctaType === LeadCtaType.DOWNLOAD_BROCHURE) return `Download Official Brochure: ${collegeName}`;
    if (ctaType === LeadCtaType.CHECK_ELIGIBILITY) return `Check Admission Eligibility: ${collegeName}`;
    return `Apply for Admission: ${collegeName}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md bg-background rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-transparent flex items-start justify-between shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary mb-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Verified Direct Application Portal</span>
            </div>
            <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug">{getTitle()}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-muted-foreground hover:text-foreground shrink-0 ml-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2 text-xs border rounded-lg bg-background outline-hidden focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Phone Number (for OTP) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full pl-9 pr-3 py-2 text-xs border rounded-lg bg-background outline-hidden focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="w-full pl-9 pr-3 py-2 text-xs border rounded-lg bg-background outline-hidden focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Current City
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bhubaneswar, Mumbai..."
                      className="w-full pl-9 pr-3 py-2 text-xs border rounded-lg bg-background outline-hidden focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Target Stream
                  </label>
                  <select
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                    className="w-full py-2 px-3 text-xs border rounded-lg bg-background outline-hidden focus:border-primary"
                  >
                    <option value="Engineering">Engineering (B.Tech)</option>
                    <option value="Management">Management (MBA)</option>
                    <option value="Medical">Medical (MBBS)</option>
                    <option value="Law">Law (LLB)</option>
                  </select>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground leading-normal">
                By clicking Submit, you agree to receive official counseling SMS/call updates from partner admissions desks.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors shadow-xs"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit & Receive Counselor Guidance</span>
                  </>
                )}
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-foreground">Application Received!</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                  Your interest in <strong>{collegeName}</strong> has been routed to the official counseling desk. A senior admissions advisor will reach out shortly.
                </p>
              </div>

              {ctaType === LeadCtaType.DOWNLOAD_BROCHURE && brochureUrl && (
                <div className="pt-2">
                  <a
                    href={brochureUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download PDF Brochure Now</span>
                  </a>
                </div>
              )}

              <button
                onClick={onClose}
                className="text-xs text-muted-foreground hover:text-foreground underline pt-2 block mx-auto"
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

