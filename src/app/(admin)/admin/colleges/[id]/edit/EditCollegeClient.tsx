"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Building2, 
  Save, 
  ArrowLeft, 
  Eye, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Home, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon,
  Check,
  Plus,
  Trash2
} from "lucide-react";

interface EditCollegeClientProps {
  college: {
    id: string;
    name: string;
    shortName?: string | null;
    slug: string;
    logoUrl?: string | null;
    coverImageUrl?: string | null;
    brochurePdfUrl?: string | null;
    city: string;
    state: string;
    pincode?: string | null;
    fullAddress?: string | null;
    websiteUrl?: string | null;
    contactPhone?: string | null;
    contactEmail?: string | null;
    estYear?: number | null;
    ownershipType: string;
    nirfRank?: number | null;
    naacGrade?: string | null;
    campusAreaAcres?: number | null;
    overviewHtml: string;
    admissionHtml?: string | null;
    scholarshipInfo?: string | null;
    hostelInfo?: string | null;
    facilitiesJson?: any;
    galleryUrls: string[];
    faqsJson?: any;
    qnaJson?: any;
    metaTitle?: string | null;
    metaDescription?: string | null;
    isPublished: boolean;
    courses: any[];
  };
}

export function EditCollegeClient({ college }: EditCollegeClientProps) {
  const router = useRouter();

  // Basic Info Form States
  const [name, setName] = useState(college.name || "");
  const [shortName, setShortName] = useState(college.shortName || "");
  const [slug, setSlug] = useState(college.slug || "");
  const [logoUrl, setLogoUrl] = useState(college.logoUrl || "");
  const [coverImageUrl, setCoverImageUrl] = useState(college.coverImageUrl || "");
  const [brochurePdfUrl, setBrochurePdfUrl] = useState(college.brochurePdfUrl || "");
  const [ownershipType, setOwnershipType] = useState(college.ownershipType || "PUBLIC_GOVERNMENT");
  const [estYear, setEstYear] = useState(college.estYear ? String(college.estYear) : "");
  const [nirfRank, setNirfRank] = useState(college.nirfRank ? String(college.nirfRank) : "");
  const [naacGrade, setNaacGrade] = useState(college.naacGrade || "A++");
  const [campusAreaAcres, setCampusAreaAcres] = useState(college.campusAreaAcres ? String(college.campusAreaAcres) : "");

  // Location & Contact
  const [city, setCity] = useState(college.city || "");
  const [state, setState] = useState(college.state || "");
  const [pincode, setPincode] = useState(college.pincode || "");
  const [fullAddress, setFullAddress] = useState(college.fullAddress || "");
  const [websiteUrl, setWebsiteUrl] = useState(college.websiteUrl || "");
  const [contactPhone, setContactPhone] = useState(college.contactPhone || "");
  const [contactEmail, setContactEmail] = useState(college.contactEmail || "");

  // Descriptions & Info
  const [overviewHtml, setOverviewHtml] = useState(college.overviewHtml || "");
  const [admissionHtml, setAdmissionHtml] = useState(college.admissionHtml || "");
  const [hostelInfo, setHostelInfo] = useState(college.hostelInfo || "");
  const [scholarshipInfo, setScholarshipInfo] = useState(college.scholarshipInfo || "");

  // Facilities & Gallery
  const initialFacilities: string[] = Array.isArray(college.facilitiesJson)
    ? (college.facilitiesJson as string[])
    : [
        "Central Library with 1,00,000+ volumes",
        "Advanced Research Laboratories",
        "High-Speed Campus Wi-Fi",
        "Separate Boys & Girls Hostels",
        "Sports Complex & Gymnasium",
      ];
  const [facilitiesText, setFacilitiesText] = useState(initialFacilities.join("\n"));
  const [galleryText, setGalleryText] = useState((college.galleryUrls || []).join("\n"));

  // Q&A / FAQs Management
  const initialFaqs = Array.isArray(college.faqsJson)
    ? (college.faqsJson as Array<{ question: string; answer: string }>)
    : [
        {
          question: `What are the eligibility criteria for admissions at ${college.name}?`,
          answer: "Candidates must qualify with minimum 60% in board examinations and appear for the designated entrance test.",
        },
      ];
  const [faqsList, setFaqsList] = useState<Array<{ question: string; answer: string }>>(initialFaqs);

  // SEO & Status
  const [metaTitle, setMetaTitle] = useState(college.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(college.metaDescription || "");
  const [isPublished, setIsPublished] = useState(college.isPublished);

  // Status / Loading
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const facilitiesArray = facilitiesText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const galleryArray = galleryText
      .split("\n")
      .map((g) => g.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/v1/cms/colleges/${college.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          shortName: shortName.trim() || null,
          slug: slug.trim().toLowerCase(),
          logoUrl: logoUrl.trim() || null,
          coverImageUrl: coverImageUrl.trim() || null,
          brochurePdfUrl: brochurePdfUrl.trim() || null,
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim() || null,
          fullAddress: fullAddress.trim() || null,
          websiteUrl: websiteUrl.trim() || null,
          contactPhone: contactPhone.trim() || null,
          contactEmail: contactEmail.trim() || null,
          estYear: estYear ? parseInt(estYear, 10) : null,
          ownershipType,
          nirfRank: nirfRank ? parseInt(nirfRank, 10) : null,
          naacGrade: naacGrade.trim() || null,
          campusAreaAcres: campusAreaAcres ? parseFloat(campusAreaAcres) : null,
          overviewHtml,
          admissionHtml: admissionHtml.trim() || null,
          hostelInfo: hostelInfo.trim() || null,
          scholarshipInfo: scholarshipInfo.trim() || null,
          facilitiesJson: facilitiesArray,
          galleryUrls: galleryArray,
          faqsJson: faqsList.filter((f) => f.question.trim() && f.answer.trim()),
          metaTitle: metaTitle.trim() || null,
          metaDescription: metaDescription.trim() || null,
          isPublished,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        if (json.pendingApproval) {
          setSuccessMsg(
            "Your changes have been submitted to the Administrator for approval and will publish live once approved!"
          );
        } else {
          setSuccessMsg("College profile updated and synced successfully!");
        }
        router.refresh();
      } else {
        setErrorMsg(json.error || "Failed to update college details.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/colleges"
            className="p-2 rounded-lg border hover:bg-accent text-muted-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">
              Edit College: {college.name}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configure basic info, logos, gallery, contact details, fees, hostel, and SEO discovery tags.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/college/${slug}`}
            target="_blank"
            className="px-4 py-2 rounded-xl border bg-background hover:bg-accent text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Public Page</span>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 text-xs bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* CARD 1: BASIC INFORMATION */}
        <div className="bg-card border rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider text-muted-foreground border-b pb-2">
            <Building2 className="w-4 h-4 text-primary" />
            <span>1. Basic Institutional Profile</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-foreground mb-1">
                Full Official College Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background outline-hidden focus:border-primary font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                Short Name / Acronym
              </label>
              <input
                type="text"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="e.g. NIT Rourkela"
                className="w-full px-3 py-2 border rounded-lg bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                Canonical URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 font-mono border rounded-lg bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                Ownership Type
              </label>
              <select
                value={ownershipType}
                onChange={(e) => setOwnershipType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              >
                <option value="PUBLIC_GOVERNMENT">Public / Government</option>
                <option value="PRIVATE">Private</option>
                <option value="DEEMED">Deemed to be University</option>
                <option value="AUTONOMOUS">Autonomous</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                Establishment Year
              </label>
              <input
                type="number"
                value={estYear}
                onChange={(e) => setEstYear(e.target.value)}
                placeholder="e.g. 1961"
                className="w-full px-3 py-2 border rounded-lg bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                NIRF Ranking (2025)
              </label>
              <input
                type="number"
                value={nirfRank}
                onChange={(e) => setNirfRank(e.target.value)}
                placeholder="e.g. 16 (leave blank if unranked)"
                className="w-full px-3 py-2 border rounded-lg bg-background outline-hidden focus:border-primary font-bold text-amber-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                NAAC Accreditation Grade
              </label>
              <select
                value={naacGrade}
                onChange={(e) => setNaacGrade(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              >
                <option value="A++">A++ (Highest)</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B++">B++</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="Not Accredited">Not Accredited</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                Campus Area (in Acres)
              </label>
              <input
                type="number"
                step="0.1"
                value={campusAreaAcres}
                onChange={(e) => setCampusAreaAcres(e.target.value)}
                placeholder="e.g. 647"
                className="w-full px-3 py-2 border rounded-lg bg-background outline-hidden focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* CARD 2: MEDIA ASSETS (LOGOS & GALLERY) */}
        <div className="bg-card border rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider text-muted-foreground border-b pb-2">
            <ImageIcon className="w-4 h-4 text-purple-600" />
            <span>2. Media Assets (Logo, Cover &amp; Gallery)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                Logo Image URL
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full px-3 py-2 border rounded-lg bg-background outline-hidden focus:border-primary"
              />
              {logoUrl && (
                <div className="mt-2 flex items-center gap-2 p-2 rounded-lg border bg-muted/20">
                  <img src={logoUrl} alt="Logo Preview" className="h-10 w-10 object-contain" />
                  <span className="text-[11px] text-muted-foreground">Logo preview</span>
                </div>
              )}
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                Campus Cover Image URL
              </label>
              <input
                type="url"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 border rounded-lg bg-background outline-hidden focus:border-primary"
              />
              {coverImageUrl && (
                <div className="mt-2 rounded-lg overflow-hidden border h-16 w-32 bg-muted/20">
                  <img src={coverImageUrl} alt="Cover Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-muted-foreground mb-1">
                Official Brochure PDF URL
              </label>
              <input
                type="url"
                value={brochurePdfUrl}
                onChange={(e) => setBrochurePdfUrl(e.target.value)}
                placeholder="https://example.com/brochure-2026.pdf"
                className="w-full px-3 py-2 border rounded-lg bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-muted-foreground mb-1">
                Campus Gallery Image URLs <span className="font-normal">(1 URL per line)</span>
              </label>
              <textarea
                rows={4}
                value={galleryText}
                onChange={(e) => setGalleryText(e.target.value)}
                placeholder="https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2"
                className="w-full p-3 font-mono text-xs border rounded-lg bg-background outline-hidden focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* CARD 3: LOCATION & CONTACT DETAILS */}
        <div className="bg-card border rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider text-muted-foreground border-b pb-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>3. Location &amp; Official Contact Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-foreground mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">State *</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 769008"
                className="w-full px-3 py-2 border rounded-lg bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-semibold text-muted-foreground mb-1">
                Full Street Campus Address
              </label>
              <input
                type="text"
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="e.g. Sector 1, Rourkela, Sundargarh District, Odisha, India"
                className="w-full px-3 py-2 border rounded-lg bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Official Website</label>
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="e.g. https://www.nitrkl.ac.in"
                className="w-full px-3 py-2 border rounded-lg bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Contact Phone Number</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="e.g. +91 661 2462020"
                className="w-full px-3 py-2 border rounded-lg bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Contact Email Address</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="e.g. admissions@nitrkl.ac.in"
                className="w-full px-3 py-2 border rounded-lg bg-background outline-hidden focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* CARD 4: OVERVIEW, ADMISSION & HOSTEL DETAILS */}
        <div className="bg-card border rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider text-muted-foreground border-b pb-2">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>4. Overview, Admission, Hostel &amp; Scholarships</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-foreground mb-1">
                Institutional Description &amp; Overview (HTML supported)
              </label>
              <textarea
                rows={5}
                value={overviewHtml}
                onChange={(e) => setOverviewHtml(e.target.value)}
                className="w-full p-3 font-mono border rounded-lg bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  Admission Procedure &amp; Eligibility Criteria
                </label>
                <textarea
                  rows={4}
                  value={admissionHtml}
                  onChange={(e) => setAdmissionHtml(e.target.value)}
                  placeholder="Admission is conducted via centralized JoSAA / state counseling..."
                  className="w-full p-3 text-xs border rounded-lg bg-background outline-hidden focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  Hostel Facilities &amp; Mess Details
                </label>
                <textarea
                  rows={4}
                  value={hostelInfo}
                  onChange={(e) => setHostelInfo(e.target.value)}
                  placeholder="Separate hostel facilities for boys and girls with 24x7 security, Wi-Fi, and mess dining..."
                  className="w-full p-3 text-xs border rounded-lg bg-background outline-hidden focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  Scholarships &amp; Financial Concessions
                </label>
                <textarea
                  rows={3}
                  value={scholarshipInfo}
                  onChange={(e) => setScholarshipInfo(e.target.value)}
                  placeholder="Merit-cum-means fee waivers and government NSP scholarships are available..."
                  className="w-full p-3 text-xs border rounded-lg bg-background outline-hidden focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  Campus Facilities <span className="font-normal">(1 amenity per line)</span>
                </label>
                <textarea
                  rows={3}
                  value={facilitiesText}
                  onChange={(e) => setFacilitiesText(e.target.value)}
                  placeholder="Central Library&#10;Sports Arena&#10;Research Labs"
                  className="w-full p-3 text-xs border rounded-lg bg-background outline-hidden focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 4.5: QUESTIONS & ANSWERS (Q&A) MANAGEMENT */}
        <div className="bg-card border rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Questions &amp; Answers (Q&amp;A / FAQs)</span>
            </h2>
            <button
              type="button"
              onClick={() => setFaqsList([...faqsList, { question: "", answer: "" }])}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqsList.map((faq, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border bg-muted/20 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    FAQ #{idx + 1}
                  </span>
                  {faqsList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setFaqsList(faqsList.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => {
                    const updated = [...faqsList];
                    updated[idx].question = e.target.value;
                    setFaqsList(updated);
                  }}
                  placeholder="Question: e.g. What is the average placement CTC?"
                  className="w-full px-3 py-1.5 text-xs border rounded-lg bg-background outline-hidden focus:border-primary font-semibold"
                />
                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => {
                    const updated = [...faqsList];
                    updated[idx].answer = e.target.value;
                    setFaqsList(updated);
                  }}
                  placeholder="Answer: e.g. The average annual package for the graduating batch was ₹18.5 LPA..."
                  className="w-full p-2.5 text-xs border rounded-lg bg-background outline-hidden focus:border-primary"
                />
              </div>
            ))}
          </div>
        </div>

        {/* CARD 5: SEO METADATA & PUBLISHING TOGGLE */}
        <div className="bg-card border rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider text-muted-foreground border-b pb-2">
            <Globe className="w-4 h-4 text-primary" />
            <span>5. Search Engine Optimization (SEO &amp; GEO) &amp; Status</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-muted-foreground">Custom Meta Title</span>
                <span className="text-[11px] font-mono text-muted-foreground">{metaTitle.length}/60</span>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="e.g. NIT Rourkela Admissions 2026: Cutoffs, Fees & Placements"
                className="w-full px-3 py-2 border rounded-lg bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-muted-foreground">Custom Meta Description</span>
                <span className="text-[11px] font-mono text-muted-foreground">{metaDescription.length}/160</span>
              </div>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Check verified details for NIT Rourkela..."
                className="w-full p-3 border rounded-lg bg-background outline-hidden focus:border-primary"
              />
            </div>

            {/* Publish Toggle */}
            <div className="p-4 rounded-xl border bg-muted/20 flex items-center justify-between">
              <div>
                <strong className="block text-foreground text-xs">Profile Publication Status</strong>
                <p className="text-[11px] text-muted-foreground">
                  When enabled, this college is indexed by search engines and displayed publicly to student visitors.
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4"
                />
                <span className="font-bold text-xs text-foreground">
                  {isPublished ? "PUBLISHED LIVE" : "DRAFT MODE"}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t">
          <Link
            href="/admin/colleges"
            className="px-4 py-2.5 rounded-xl border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-md flex items-center gap-2 hover:opacity-95 active:scale-98 transition-all cursor-pointer"
            style={{ background: "#1a3068" }}
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save College Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

