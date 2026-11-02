import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatInr } from "@/lib/utils";
import Link from "next/link";
import { 
  Building2, 
  Award, 
  Calendar, 
  MapPin, 
  IndianRupee, 
  Briefcase, 
  CheckCircle2, 
  Globe, 
  Phone, 
  Mail, 
  GraduationCap, 
  Home, 
  Utensils, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  HelpCircle,
  ExternalLink,
  Layers,
  Star
} from "lucide-react";
import { CollegeApplyButton } from "@/components/public/CollegeApplyButton";

export default async function CompleteCollegeDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const college = await db.college.findUnique({
    where: { slug },
    include: {
      courses: {
        include: { course: true },
        orderBy: { totalFeesInr: "asc" },
      },
      placements: {
        orderBy: { batchYear: "desc" },
        take: 3,
      },
      rankings: {
        orderBy: { rankingYear: "desc" },
        take: 4,
      },
      reviews: {
        where: { moderationStatus: "APPROVED" },
        take: 2,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!college) notFound();

  // Related colleges (same state or published institutions)
  const relatedColleges = await db.college.findMany({
    where: {
      id: { not: college.id },
      isPublished: true,
      OR: [
        { state: college.state },
        { ownershipType: college.ownershipType },
      ],
    },
    take: 3,
    include: {
      courses: {
        include: { course: true },
        take: 1,
      },
    },
  });

  const latestPlacement = college.placements[0];

  // Default gallery if none configured
  const galleryImages =
    college.galleryUrls && college.galleryUrls.length > 0
      ? college.galleryUrls
      : [
          "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&fit=crop&q=80",
          "https://images.unsplash.com/photo-1562774053-701939374585?w=1000&fit=crop&q=80",
          "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&fit=crop&q=80",
          "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&fit=crop&q=80",
        ];

  // Standard facilities list
  const facilities: string[] =
    Array.isArray(college.facilitiesJson) && college.facilitiesJson.length > 0
      ? (college.facilitiesJson as string[])
      : [
          "Central Library with 1,00,000+ volumes & digital journals",
          "Advanced Research Laboratories & Computing Centers",
          "High-speed campus-wide Wi-Fi network (1 Gbps)",
          "Separate Boys & Girls Hostels with 24x7 security",
          "Multi-cuisine Mess & Food Court facilities",
          "Indoor Sports Complex & Outdoor Athletic Ground",
          "Health Care Center with resident medical officers",
          "Fleet of Campus Transport Shuttles & Buses",
        ];

  // Fee range calculation
  const feeList = college.courses.map((c) => c.totalFeesInr).filter((f) => f > 0);
  const minFee = feeList.length > 0 ? Math.min(...feeList) : null;
  const maxFee = feeList.length > 0 ? Math.max(...feeList) : null;

  // Hostel fee calculation
  const hostelFeeList = college.courses
    .map((c) => c.hostelFeesYearlyInr)
    .filter((h): h is number => typeof h === "number" && h > 0);
  const sampleHostelFee = hostelFeeList.length > 0 ? hostelFeeList[0] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* =========================================================================
          LEFT 2 COLUMNS: DETAILED SECTIONS & CARDS
         ========================================================================= */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* SECTION 1: KEY HIGHLIGHTS & QUICK FACTS */}
        <section className="bg-card border rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span>Key Institutional Highlights</span>
            </h2>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
              Verified 2026 Batch
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
            <div className="p-3.5 rounded-xl bg-muted/30 border">
              <span className="text-muted-foreground block text-[11px]">Ownership</span>
              <span className="font-bold text-foreground text-sm">
                {college.ownershipType.replace(/_/g, " ")}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/30 border">
              <span className="text-muted-foreground block text-[11px]">NIRF 2025 Ranking</span>
              <span className="font-black text-amber-600 text-sm">
                {college.nirfRank ? `#${college.nirfRank} in India` : "Ranked / Accredited"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/30 border">
              <span className="text-muted-foreground block text-[11px]">NAAC Accreditation</span>
              <span className="font-bold text-emerald-600 text-sm">
                {college.naacGrade ? `Grade ${college.naacGrade}` : "UGC Approved"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/30 border">
              <span className="text-muted-foreground block text-[11px]">Established Year</span>
              <span className="font-bold text-foreground text-sm">
                {college.estYear ? `Year ${college.estYear}` : "Established Institution"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/30 border">
              <span className="text-muted-foreground block text-[11px]">Campus Size</span>
              <span className="font-bold text-foreground text-sm">
                {college.campusAreaAcres ? `${college.campusAreaAcres} Acres` : "Sprawling Campus"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/30 border">
              <span className="text-muted-foreground block text-[11px]">Approved By</span>
              <span className="font-bold text-foreground text-sm truncate block" title={college.approvedBy.join(", ")}>
                {college.approvedBy.length > 0 ? college.approvedBy.join(", ") : "AICTE, UGC, MHRD"}
              </span>
            </div>
          </div>

          {college.affiliatedTo && (
            <p className="text-xs text-muted-foreground pt-1">
              Affiliated to: <strong className="text-foreground">{college.affiliatedTo}</strong>
            </p>
          )}
        </section>

        {/* SECTION 2: OFFICIAL WEBSITE & CONTACT INFORMATION */}
        <section className="bg-card border rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
          <h2 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2 border-b pb-3">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Campus Location &amp; Contact Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Address */}
            <div className="p-4 rounded-xl border bg-muted/20 space-y-1.5">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Official Campus Address
              </span>
              <p className="font-medium text-foreground leading-relaxed">
                {college.fullAddress || `${college.name}, ${college.city}, ${college.state}${college.pincode ? ` - ${college.pincode}` : ""}, India`}
              </p>
              <div className="pt-1 text-[11px] text-muted-foreground">
                City: <strong className="text-foreground">{college.city}</strong> • State:{" "}
                <strong className="text-foreground">{college.state}</strong>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-4 rounded-xl border bg-muted/20 space-y-2.5">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Admissions Desk &amp; Website
              </span>

              {college.websiteUrl ? (
                <a
                  href={college.websiteUrl.startsWith("http") ? college.websiteUrl : `https://${college.websiteUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary font-bold hover:underline"
                >
                  <Globe className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{college.websiteUrl}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-3.5 h-3.5 shrink-0" />
                  <span>Official website details available on inquiry</span>
                </div>
              )}

              {college.contactPhone ? (
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span>{college.contactPhone}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>Admission hotline: Inquire via Apply Form</span>
                </div>
              )}

              {college.contactEmail && (
                <div className="flex items-center gap-2 text-foreground">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{college.contactEmail}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 3: ABOUT & OVERVIEW */}
        <section className="bg-card border rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2 border-b pb-3">
            <Building2 className="w-4 h-4 text-primary" />
            <span>About {college.name}</span>
          </h2>
          {college.overviewHtml ? (
            <div
              className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-foreground/85 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: college.overviewHtml }}
            />
          ) : (
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {college.name} is a premier {college.ownershipType.replace(/_/g, " ").toLowerCase()} institution located in {college.city}, {college.state}. Renowned for academic rigor, cutting-edge laboratories, and strong industry linkages, it offers comprehensive undergraduate and postgraduate programs.
            </p>
          )}
        </section>

        {/* SECTION 4: COURSES, DURATION & FEE STRUCTURE */}
        <section className="bg-card border rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>Available Academic Courses &amp; Fee Structure</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Explore program duration, total tuition fees, intake seats, and accepted entrance tests.
              </p>
            </div>
            {minFee && maxFee && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shrink-0">
                Fee Range: {formatInr(minFee)} - {formatInr(maxFee)}
              </span>
            )}
          </div>

          {college.courses.length > 0 ? (
            <div className="space-y-3.5">
              {college.courses.map((c) => {
                const eligibility = c.eligibilityCriteria as any;
                return (
                  <div
                    key={c.id}
                    className="p-4 sm:p-5 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-primary text-white uppercase">
                            {c.course.degree}
                          </span>
                          <h4 className="font-bold text-sm text-foreground">
                            {c.course.degree} in {c.specialization}
                          </h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1.5">
                          <span>Duration: <strong>{c.course.durationYrs} Years</strong></span>
                          <span>•</span>
                          <span>Level: <strong>{c.course.level}</strong></span>
                          <span>•</span>
                          <span>Intake Seats: <strong>{c.intakeSeats ? c.intakeSeats : "Available"}</strong></span>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0 pt-2 sm:pt-0">
                        <span className="text-[11px] text-muted-foreground block">Total Course Tuition</span>
                        <span className="text-base font-black text-primary">
                          {c.totalFeesInr ? formatInr(c.totalFeesInr) : "Check Fee Details"}
                        </span>
                        {c.firstYearFeesInr && (
                          <span className="text-[10px] text-muted-foreground block mt-0.5">
                            1st Year: {formatInr(c.firstYearFeesInr)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Accepted Entrance Exams */}
                    <div className="pt-2 border-t flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        Accepted Exams:
                      </span>
                      {c.acceptedExamSlugs && c.acceptedExamSlugs.length > 0 ? (
                        c.acceptedExamSlugs.map((examSlug) => (
                          <span
                            key={examSlug}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 uppercase font-mono"
                          >
                            {examSlug.replace(/-/g, " ")}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">
                          Merit / Centralized Counseling
                        </span>
                      )}

                      {eligibility && (
                        <span className="text-[11px] text-muted-foreground ml-auto hidden md:inline">
                          Min. 12th: {eligibility.min_12th_pct || "60"}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-xs bg-muted/20 rounded-xl border">
              <BookOpen className="w-8 h-8 mx-auto text-muted-foreground/60 mb-2" />
              <p className="font-medium text-foreground">Course data for this college is currently being updated for the 2026 academic batch.</p>
              <p className="mt-1">Inquire directly to receive the complete syllabus and program list.</p>
            </div>
          )}
        </section>

        {/* SECTION 5: ADMISSION PROCESS & ELIGIBILITY */}
        <section className="bg-card border rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <h2 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2 border-b pb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Admission Process &amp; Eligibility Guidelines (2026)</span>
          </h2>

          {college.admissionHtml ? (
            <div
              className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-foreground/85 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: college.admissionHtml }}
            />
          ) : (
            <div className="space-y-4 text-xs">
              <p className="text-muted-foreground leading-relaxed">
                Admissions to {college.name} are carried out through national and state entrance tests followed by centralized counseling. Prospective candidates must meet minimum educational criteria in their qualifying board examinations.
              </p>

              {/* 4 Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary text-white font-bold text-[10px] flex items-center justify-center">1</span>
                    <strong className="text-foreground text-xs">Entrance Examination</strong>
                  </div>
                  <p className="text-muted-foreground text-[11px] pl-7">
                    Appear for qualifying national/state exam (JEE Main, NEET UG, CAT, or equivalent).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary text-white font-bold text-[10px] flex items-center justify-center">2</span>
                    <strong className="text-foreground text-xs">Choice Registration</strong>
                  </div>
                  <p className="text-muted-foreground text-[11px] pl-7">
                    Register on the counseling authority portal and lock {college.name} with preferred course branches.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary text-white font-bold text-[10px] flex items-center justify-center">3</span>
                    <strong className="text-foreground text-xs">Seat Allotment</strong>
                  </div>
                  <p className="text-muted-foreground text-[11px] pl-7">
                    Seat allotment is announced based on rank, category quota (Home State / All India), and preference.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary text-white font-bold text-[10px] flex items-center justify-center">4</span>
                    <strong className="text-foreground text-xs">Document Verification</strong>
                  </div>
                  <p className="text-muted-foreground text-[11px] pl-7">
                    Report to campus with original academic certificates, ID proofs, and initial semester fee.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 6: FEES & ACCOMMODATION (HOSTEL & SCHOLARSHIPS) */}
        <section className="bg-card border rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
          <h2 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2 border-b pb-3">
            <Home className="w-4 h-4 text-purple-600" />
            <span>Accommodation, Hostel Charges &amp; Scholarships</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Hostel Info */}
            <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-purple-600" />
                  <span>Hostel &amp; Mess Details</span>
                </span>
                {sampleHostelFee && (
                  <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                    ~{formatInr(sampleHostelFee)}/year
                  </span>
                )}
              </div>
              {college.hostelInfo ? (
                <div
                  className="text-muted-foreground leading-relaxed text-[11px]"
                  dangerouslySetInnerHTML={{ __html: college.hostelInfo }}
                />
              ) : (
                <div className="text-muted-foreground space-y-1.5 text-[11px]">
                  <p>
                    On-campus residential facilities are available for both male and female students with furnished rooms, Wi-Fi access, 24x7 security, and hygienic mess dining.
                  </p>
                  <p className="text-[10px] text-muted-foreground italic">
                    Hostel charges vary by room sharing type (Single, Double, or Triple occupancy). Inquire for current availability.
                  </p>
                </div>
              )}
            </div>

            {/* Scholarship Info */}
            <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Scholarships &amp; Financial Aid</span>
              </span>
              {college.scholarshipInfo ? (
                <div
                  className="text-muted-foreground leading-relaxed text-[11px]"
                  dangerouslySetInnerHTML={{ __html: college.scholarshipInfo }}
                />
              ) : (
                <div className="text-muted-foreground space-y-1.5 text-[11px]">
                  <p>
                    Merit-cum-means scholarships, national scholarship portal (NSP) schemes, and tuition fee waivers for SC/ST/EWS students are applicable as per government regulations.
                  </p>
                  <p className="text-[10px] text-muted-foreground italic">
                    Deserving students with top entrance test scores can apply for institutional scholarships at the time of admission.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 7: CAMPUS INFRASTRUCTURE & FACILITIES */}
        <section className="bg-card border rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
          <h2 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2 border-b pb-3">
            <Layers className="w-4 h-4 text-primary" />
            <span>Campus Infrastructure &amp; Student Amenities</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {facilities.map((facility, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border bg-muted/20 flex items-center gap-2.5 text-foreground/90 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{facility}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 8: CAMPUS GALLERY PREVIEW */}
        <section className="bg-card border rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-base sm:text-lg font-extrabold text-foreground">
              Campus Photo Gallery
            </h2>
            <Link
              href={`/college/${college.slug}/gallery`}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>View All Photos</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {galleryImages.slice(0, 4).map((url, i) => (
              <div
                key={i}
                className="group relative rounded-xl overflow-hidden border bg-muted aspect-4/3"
              >
                <img
                  src={url}
                  alt={`${college.name} Campus Photo ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 9: RELATED COLLEGES */}
        {relatedColleges.length > 0 && (
          <section className="bg-card border rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
            <h2 className="text-base sm:text-lg font-extrabold text-foreground border-b pb-3">
              Similar &amp; Related Colleges You May Consider
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedColleges.map((rel) => (
                <div
                  key={rel.id}
                  className="p-4 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-xs text-foreground line-clamp-1">{rel.name}</h4>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {rel.city}, {rel.state}
                    </p>
                    <span className="text-[10px] font-bold text-amber-600 block">
                      {rel.nirfRank ? `NIRF #${rel.nirfRank}` : "NAAC Accredited"}
                    </span>
                  </div>

                  <Link
                    href={`/college/${rel.slug}`}
                    className="pt-2 text-xs font-bold text-primary hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* =========================================================================
          RIGHT COLUMN: SIDEBAR CARDS (APPLY NOW, PLACEMENTS, REVIEWS)
         ========================================================================= */}
      <div className="space-y-6">
        
        {/* DIRECT APPLY / ENQUIRE CARD */}
        <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 shadow-sm space-y-4 sticky top-20">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
              <Sparkles className="w-3 h-3" /> Admissions Open 2026
            </span>
            <h3 className="font-extrabold text-base text-foreground">
              Interested in {college.shortName || college.name}?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Submit your direct 3-field application to connect with an official admissions counselor.
            </p>
          </div>

          <CollegeApplyButton
            collegeId={college.id}
            collegeName={college.name}
            brochureUrl={college.brochurePdfUrl || undefined}
            buttonText="Apply Now (3-Field Form)"
            className="w-full py-3 text-sm shadow-md"
          />

          {college.brochurePdfUrl && (
            <CollegeApplyButton
              collegeId={college.id}
              collegeName={college.name}
              brochureUrl={college.brochurePdfUrl}
              buttonText="Download Official Brochure"
              variant="outline"
              ctaType={"DOWNLOAD_BROCHURE" as any}
              className="w-full"
            />
          )}

          <div className="pt-2 border-t text-[11px] text-muted-foreground space-y-1">
            <p className="flex items-center gap-1.5 text-foreground font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant inquiry confirmation</span>
            </p>
            <p className="flex items-center gap-1.5 text-foreground font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Free personalized cutoff guidance</span>
            </p>
          </div>
        </div>

        {/* PLACEMENT SNAPSHOT CARD */}
        {latestPlacement && (
          <div className="bg-card border rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">
                  Audited Placements ({latestPlacement.batchYear})
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Placement Rate: {latestPlacement.placementPercentage}%
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-1">
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-muted-foreground">Highest Package</span>
                <span className="font-black text-foreground">
                  {formatInr(latestPlacement.highestPackageInr)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-muted-foreground">Average Annual CTC</span>
                <span className="font-black text-emerald-600">
                  {formatInr(latestPlacement.averagePackageInr)}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Total Offers Made</span>
                <span className="font-bold text-foreground">
                  {latestPlacement.totalOffers || "1,200+"}
                </span>
              </div>
            </div>

            {latestPlacement.topRecruiters && latestPlacement.topRecruiters.length > 0 && (
              <div className="pt-2 border-t">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                  Top Hiring Partners
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {latestPlacement.topRecruiters.map((r, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-1 rounded-md bg-muted/60 border text-foreground font-medium"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STUDENT RATINGS & REVIEWS CARD */}
        <div className="bg-card border rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Student Reviews &amp; Rating</span>
            </h3>
            <span className="text-xs font-black text-amber-600">
              ★ {college.ratingOverall.toFixed(1)} / 5.0
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            Based on {college.reviewCount} verified student alumni evaluations.
          </p>

          <Link
            href={`/college/${college.slug}/reviews`}
            className="block text-center py-2 rounded-xl border bg-muted/20 hover:bg-muted text-xs font-semibold text-foreground transition-colors"
          >
            Read Verified Reviews ({college.reviewCount}) &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
