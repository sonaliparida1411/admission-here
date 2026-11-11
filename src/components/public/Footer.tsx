import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, 
  Globe, 
  Award, 
  Calendar, 
  BookOpen, 
  GraduationCap, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  Sparkles 
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  // Month-wise Government & National Entrance Examinations Calendar 2026
  const govtExamsCalendar = [
    { month: "January", exam: "JEE Main (Session 1)", body: "NTA", stream: "Engineering", href: "/exams/jee-main" },
    { month: "February", exam: "GATE 2026", body: "IITs / IISc", stream: "M.Tech / PSU", href: "/exams/gate" },
    { month: "March", exam: "CUET PG 2026", body: "NTA", stream: "Postgraduate", href: "/exams/cuet-ug" },
    { month: "April", exam: "JEE Main (Session 2)", body: "NTA", stream: "Engineering", href: "/exams/jee-main" },
    { month: "May", exam: "NEET UG 2026", body: "NTA", stream: "Medical (MBBS)", href: "/exams/neet-ug" },
    { month: "May", exam: "OJEE 2026 (Odisha)", body: "OJEE Board", stream: "Odisha State", href: "/exams/ojee" },
    { month: "May", exam: "JEE Advanced", body: "IITs", stream: "IIT Admissions", href: "/exams/jee-main" },
    { month: "June", exam: "CUET UG 2026", body: "NTA", stream: "Central Univ", href: "/exams/cuet-ug" },
    { month: "November", exam: "CAT 2026", body: "IIMs", stream: "IIM / MBA", href: "/exams/cat" },
  ];

  const coursesDegrees = [
    { label: "B.Tech / B.E (Engineering)", href: "/colleges/b-tech" },
    { label: "M.Tech / ME (Postgraduate)", href: "/colleges/b-tech" },
    { label: "MBBS (Medicine & Surgery)", href: "/colleges/mbbs" },
    { label: "BDS (Dental Surgery)", href: "/colleges/mbbs" },
    { label: "MBA / PGDM (Management)", href: "/colleges/mba" },
    { label: "BBA (Bachelor of Business)", href: "/colleges/mba" },
    { label: "BCA / MCA (Computer Apps)", href: "/colleges" },
    { label: "B.Pharm / M.Pharm (Pharmacy)", href: "/colleges" },
    { label: "BA LLB (5-Year Integrated Law)", href: "/colleges" },
    { label: "B.Des / M.Des (Design & Fashion)", href: "/colleges" },
  ];

  const stateHubs = [
    { label: "Colleges in Odisha", href: "/colleges/b-tech/odisha" },
    { label: "Colleges in Bhubaneswar", href: "/colleges?q=Bhubaneswar" },
    { label: "Colleges in Rourkela", href: "/colleges?q=Rourkela" },
    { label: "Colleges in Cuttack", href: "/colleges?q=Cuttack" },
    { label: "Colleges in Sambalpur", href: "/colleges?q=Sambalpur" },
    { label: "Colleges in Maharashtra (Mumbai/Pune)", href: "/colleges/b-tech/maharashtra" },
    { label: "Colleges in Delhi NCR", href: "/colleges?state=Delhi" },
    { label: "Colleges in Karnataka (Bengaluru)", href: "/colleges?state=Karnataka" },
  ];

  return (
    <footer className="border-t text-sm pt-14 pb-20 md:pb-16 bg-[#f8faff] text-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main 4-Column Grid: Brand & Structured Directories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Admission Here"
                width={220}
                height={55}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-xs leading-relaxed text-slate-600">
              Admission Here is India&apos;s authoritative higher education discovery directory, cutoff analytics engine, and official counseling portal. Built for students navigating JoSAA, CSAB, NEET, OJEE, and CAT seat allotments.
            </p>

            <div className="flex flex-col gap-2 pt-1 text-xs font-semibold text-slate-800">
              <div className="flex items-center gap-2 text-[#1F8040]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>100% Verified JoSAA &amp; NEET Cutoffs</span>
              </div>
              <div className="flex items-center gap-2 text-[#1a3068]">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Odisha &amp; Pan-India University Data</span>
              </div>
              <div className="flex items-center gap-2 text-[#C41E1E]">
                <Award className="w-4 h-4 shrink-0" />
                <span>NIRF, NAAC &amp; AICTE Certified</span>
              </div>
            </div>

            {/* AI Search & Generative Engine Optimization (GEO / AEO) */}
            <div className="pt-3 border-t border-slate-200">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Machine &amp; AI Discovery (GEO / AEO)
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <a
                  href="/llms.txt"
                  target="_blank"
                  className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-primary font-mono text-[11px]"
                >
                  /llms.txt
                </a>
                <a
                  href="/llms-full.txt"
                  target="_blank"
                  className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-primary font-mono text-[11px]"
                >
                  /llms-full.txt
                </a>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:text-primary font-mono text-[11px]"
                >
                  sitemap.xml
                </a>
              </div>
            </div>
          </div>

          {/* Academic Degrees & Programs (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#1a3068] pb-1 border-b border-slate-200 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#1a3068]" />
              <span>Programs &amp; Degrees</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {coursesDegrees.map((c, i) => (
                <li key={i}>
                  <Link href={c.href} className="text-slate-600 hover:text-[#1a3068] hover:underline transition-colors block">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* State & City Campuses: Odisha & India (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#1a3068] pb-1 border-b border-slate-200 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C41E1E]" />
              <span>State &amp; City Hubs</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {stateHubs.map((s, i) => (
                <li key={i}>
                  <Link href={s.href} className="text-slate-600 hover:text-[#1a3068] hover:underline transition-colors block">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Student Tools & Quick Portals (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#1a3068] pb-1 border-b border-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C41E1E]" />
              <span>Student Portals</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/college-predictor/jee-main" className="text-[#C41E1E] font-bold hover:underline block">
                  • Rank Predictor 2026
                </Link>
              </li>
              <li>
                <Link href="/colleges/b-tech/odisha" className="text-[#1a3068] font-bold hover:underline block">
                  • Odisha Top Colleges
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-600 hover:text-[#1a3068] hover:underline block">
                  • Cutoff Analyses &amp; News
                </Link>
              </li>
              <li>
                <Link href="/compare/iit-bombay-vs-nit-rourkela" className="text-slate-600 hover:text-[#1a3068] hover:underline block">
                  • College Compare Matrix
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-600 hover:text-[#1a3068] hover:underline block">
                  • Student Login
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-600 hover:text-[#1a3068] font-semibold hover:underline block">
                  • Staff &amp; Admin Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Month-Wise Government & National Entrance Examinations Calendar */}
        <div className="pt-8 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1a3068]" />
              <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#1a3068]">
                2026 Government &amp; National Entrance Examinations Calendar (Month-Wise)
              </h4>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Conducted by NTA, IITs, IIMs &amp; State Boards
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-2.5">
            {govtExamsCalendar.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#1a3068] hover:shadow-sm transition-all group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-black uppercase text-[#C41E1E] block">
                    {item.month}
                  </span>
                  <div className="font-bold text-xs text-slate-900 group-hover:text-[#1a3068] transition-colors line-clamp-1 mt-0.5">
                    {item.exam}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 pt-1 border-t border-slate-100 flex items-center justify-between">
                  <span>{item.body}</span>
                  <span className="font-medium text-[#1a3068] group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Legal & Rights Row */}
        <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row items-center justify-between text-xs gap-4 text-center md:text-left text-slate-500">
          <div className="space-y-1">
            <p>© {currentYear} Admission Here Technologies Ltd. All rights reserved. Connecting students with verified Indian institutions.</p>
            <p className="text-[11px] text-slate-500">
              Designed &amp; Developed by{" "}
              <a
                href="https://logisaar.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#1a3068] hover:text-[#C41E1E] transition-colors hover:underline"
              >
                Logisaar
              </a>
            </p>
          </div>
          <div className="flex gap-4 sm:gap-6 flex-wrap justify-center font-medium">
            <Link href="/privacy" className="hover:text-slate-800 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-800 hover:underline">
              Terms of Use
            </Link>
            <Link href="/editorial-standards" className="hover:text-slate-800 hover:underline">
              Editorial Standards
            </Link>
            <Link href="/sitemap.xml" className="hover:text-slate-800 hover:underline">
              HTML/XML Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
