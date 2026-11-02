"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Save, ArrowLeft, MapPin, Globe, Phone, Mail, Home, GraduationCap, ImageIcon } from "lucide-react";
import Link from "next/link";

export default function NewCollegePage() {
  const router = useRouter();

  // Basic Information
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [slug, setSlug] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [brochurePdfUrl, setBrochurePdfUrl] = useState("");
  const [ownershipType, setOwnershipType] = useState("PUBLIC_GOVERNMENT");
  const [estYear, setEstYear] = useState("");
  const [nirfRank, setNirfRank] = useState("");
  const [naacGrade, setNaacGrade] = useState("A++");
  const [campusAreaAcres, setCampusAreaAcres] = useState("");

  // Location & Contact
  const [city, setCity] = useState("");
  const [state, setState] = useState("Odisha");
  const [pincode, setPincode] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  // Descriptions & Details
  const [overviewHtml, setOverviewHtml] = useState(
    "<p>Enter comprehensive institutional overview and history here...</p>"
  );
  const [admissionHtml, setAdmissionHtml] = useState("");
  const [hostelInfo, setHostelInfo] = useState("");
  const [scholarshipInfo, setScholarshipInfo] = useState("");
  const [facilitiesText, setFacilitiesText] = useState(
    "Central Library with digital catalog\nAdvanced Laboratories\nHigh-Speed Campus Wi-Fi\nResidential Hostels for Boys & Girls\nMulti-cuisine Mess & Cafeteria\nSports Arena & Gymnasium"
  );
  const [galleryText, setGalleryText] = useState("");

  // SEO & Status
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 80)
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const facilitiesArray = facilitiesText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const galleryArray = galleryText
      .split("\n")
      .map((g) => g.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/v1/cms/colleges", {
        method: "POST",
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
          metaTitle: metaTitle.trim() || null,
          metaDescription: metaDescription.trim() || null,
          isPublished,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        router.push("/admin/colleges");
      } else {
        setError(json.error || "Failed to create college profile");
      }
    } catch {
      setError("Network error while creating college profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/colleges"
          className="p-2 rounded-lg border hover:bg-accent text-muted-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Onboard New Institutional Profile
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter verified details for NIRF indexing, schema generation, and SEO directory discovery.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl">
            {error}
          </div>
        )}

        {/* BASIC INFORMATION */}
        <div className="bg-card border rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground border-b pb-2 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-primary" />
            <span>1. Basic Profile</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-foreground mb-1">
                Full Official Institution Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. National Institute of Technology Rourkela"
                className="w-full border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary font-medium"
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
                className="w-full border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
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
                placeholder="e.g. nit-rourkela"
                className="w-full font-mono border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                Ownership Type
              </label>
              <select
                value={ownershipType}
                onChange={(e) => setOwnershipType(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 bg-background"
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
                className="w-full border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                NIRF Rank (2025)
              </label>
              <input
                type="number"
                value={nirfRank}
                onChange={(e) => setNirfRank(e.target.value)}
                placeholder="e.g. 16"
                className="w-full border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary font-bold text-amber-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                NAAC Accreditation
              </label>
              <select
                value={naacGrade}
                onChange={(e) => setNaacGrade(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 bg-background"
              >
                <option value="A++">A++</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B++">B++</option>
                <option value="B">B</option>
                <option value="Not Accredited">Not Accredited</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">
                Campus Size (in Acres)
              </label>
              <input
                type="number"
                step="0.1"
                value={campusAreaAcres}
                onChange={(e) => setCampusAreaAcres(e.target.value)}
                placeholder="e.g. 647"
                className="w-full border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* MEDIA & IMAGES */}
        <div className="bg-card border rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground border-b pb-2 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-purple-600" />
            <span>2. Media Assets (Logo, Cover Banner &amp; Gallery)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Logo URL</label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Cover Image URL</label>
              <input
                type="url"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-muted-foreground mb-1">
                Gallery Photos (1 URL per line)
              </label>
              <textarea
                rows={3}
                value={galleryText}
                onChange={(e) => setGalleryText(e.target.value)}
                placeholder="https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2"
                className="w-full p-2.5 font-mono text-xs border rounded-lg bg-background outline-hidden focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* LOCATION & CONTACT */}
        <div className="bg-card border rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground border-b pb-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>3. Location &amp; Contact</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-foreground mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Rourkela"
                className="w-full border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-bold text-foreground mb-1">State *</label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Odisha"
                className="w-full border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 769008"
                className="w-full border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-semibold text-muted-foreground mb-1">Full Campus Address</label>
              <input
                type="text"
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="e.g. Sector 1, Rourkela, Sundargarh, Odisha, India"
                className="w-full border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Official Website</label>
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://www.nitrkl.ac.in"
                className="w-full border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Admissions Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 661 2462020"
                className="w-full border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-muted-foreground mb-1">Admissions Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="admissions@nitrkl.ac.in"
                className="w-full border rounded-lg px-3 py-2 bg-background outline-hidden focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* OVERVIEW & DESCRIPTIONS */}
        <div className="bg-card border rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground border-b pb-2 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>4. Overview, Hostel &amp; Facilities</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-foreground mb-1">
                Overview &amp; History HTML
              </label>
              <textarea
                rows={4}
                value={overviewHtml}
                onChange={(e) => setOverviewHtml(e.target.value)}
                className="w-full p-3 font-mono border rounded-lg bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  Hostel &amp; Mess Information
                </label>
                <textarea
                  rows={3}
                  value={hostelInfo}
                  onChange={(e) => setHostelInfo(e.target.value)}
                  placeholder="Furnished hostels with Wi-Fi, 24x7 security, and mess dining..."
                  className="w-full p-2.5 border rounded-lg bg-background outline-hidden focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  Scholarships &amp; Concessions
                </label>
                <textarea
                  rows={3}
                  value={scholarshipInfo}
                  onChange={(e) => setScholarshipInfo(e.target.value)}
                  placeholder="Government NSP scholarships and merit-cum-means fee waivers..."
                  className="w-full p-2.5 border rounded-lg bg-background outline-hidden focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTONS */}
        <div className="flex justify-end gap-3 pt-3 border-t">
          <Link
            href="/admin/colleges"
            className="px-4 py-2.5 rounded-xl border text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 hover:opacity-95 active:scale-98 transition-all cursor-pointer"
            style={{ background: "#1a3068" }}
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Onboarding College...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Create Institutional Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
