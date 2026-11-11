"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Sparkles, 
  Compass, 
  BookOpen, 
  Layers, 
  Menu, 
  X,
  UserCheck,
  Newspaper,
  ChevronRight,
  ChevronDown,
  Building2,
  GraduationCap,
  MapPin,
  ArrowRight
} from "lucide-react";
import { AiCounselorDrawer } from "../ai/AiCounselorDrawer";
import { AiSearchCommandBar } from "../ai/AiSearchCommandBar";

interface SubItem {
  label: string;
  href: string;
  badge?: string;
}

interface StreamColumn {
  title: string;
  items: SubItem[];
}

interface NavCategory {
  key: string;
  label: string;
  mainHref: string;
  columns: StreamColumn[];
}

const CATEGORIES: NavCategory[] = [
  {
    key: "mba",
    label: "MBA",
    mainHref: "/colleges/mba",
    columns: [
      {
        title: "Top MBA Colleges",
        items: [
          { label: "Top MBA Colleges in India", href: "/colleges/mba" },
          { label: "Top IIMs in India", href: "/colleges?q=IIM" },
          { label: "Top MBA in Delhi NCR", href: "/colleges/mba?state=Delhi" },
          { label: "Top MBA in Mumbai", href: "/colleges/mba?state=Maharashtra" },
          { label: "Top MBA in Bengaluru", href: "/colleges/mba?state=Karnataka" },
        ],
      },
      {
        title: "MBA Exams & Cutoffs",
        items: [
          { label: "CAT 2026 Exam", href: "/exams/cat" },
          { label: "XAT 2026 Exam", href: "/exams/cat" },
          { label: "MAT Exam Details", href: "/exams/cat" },
          { label: "CAT College Predictor", href: "/college-predictor/cat" },
          { label: "IIM Cutoff Analysis", href: "/blog/top-10-mba-colleges-in-india-cat-cutoffs-placements" },
        ],
      },
      {
        title: "Popular Specializations",
        items: [
          { label: "MBA in Finance", href: "/colleges/mba" },
          { label: "MBA in Marketing", href: "/colleges/mba" },
          { label: "MBA in Human Resources", href: "/colleges/mba" },
          { label: "MBA in Business Analytics", href: "/colleges/mba" },
          { label: "Executive MBA Programs", href: "/colleges/mba" },
        ],
      },
    ],
  },
  {
    key: "engineering",
    label: "ENGINEERING",
    mainHref: "/colleges/b-tech",
    columns: [
      {
        title: "Top Engineering Colleges",
        items: [
          { label: "Top B.Tech Colleges in India", href: "/colleges/b-tech" },
          { label: "Top IITs in India", href: "/colleges?q=IIT" },
          { label: "Top NITs in India", href: "/colleges?q=NIT" },
          { label: "Top IIITs in India", href: "/colleges?q=IIIT" },
          { label: "Top Colleges in Odisha", href: "/colleges/b-tech/odisha" },
        ],
      },
      {
        title: "Engineering Exams",
        items: [
          { label: "JEE Main 2026", href: "/exams/jee-main", badge: "Live" },
          { label: "GATE 2026", href: "/exams/gate" },
          { label: "OJEE Engineering", href: "/exams/ojee" },
          { label: "JoSAA Cutoffs Predictor", href: "/college-predictor/jee-main" },
          { label: "NIT Opening & Closing Ranks", href: "/blog/jee-main-2026-cutoff-analysis-for-top-nits" },
        ],
      },
      {
        title: "Top Branches",
        items: [
          { label: "Computer Science (CSE)", href: "/colleges/b-tech" },
          { label: "Artificial Intelligence & ML", href: "/colleges/b-tech" },
          { label: "Electronics & Communication", href: "/colleges/b-tech" },
          { label: "Mechanical Engineering", href: "/colleges/b-tech" },
          { label: "Civil Engineering", href: "/colleges/b-tech" },
        ],
      },
    ],
  },
  {
    key: "medical",
    label: "MEDICAL",
    mainHref: "/colleges/mbbs",
    columns: [
      {
        title: "Top Medical Colleges",
        items: [
          { label: "Top MBBS Colleges in India", href: "/colleges/mbbs" },
          { label: "AIIMS Institutes Across India", href: "/colleges?q=AIIMS" },
          { label: "Top Govt Medical Colleges", href: "/colleges/mbbs?ownership=PUBLIC_GOVERNMENT" },
          { label: "Top BDS (Dental) Colleges", href: "/colleges/mbbs" },
          { label: "Medical Colleges in Delhi", href: "/colleges/mbbs?state=Delhi" },
        ],
      },
      {
        title: "Medical Exams & Alerts",
        items: [
          { label: "NEET UG 2026 Exam", href: "/exams/neet-ug", badge: "Key" },
          { label: "NEET UG Counseling & Seat Matrix", href: "/blog/neet-ug-2026-counseling-dates-seat-matrix-breakdown" },
          { label: "NEET College Predictor", href: "/college-predictor/neet-ug" },
          { label: "MCC 15% AIQ Cutoffs", href: "/colleges/mbbs" },
        ],
      },
      {
        title: "Healthcare Degrees",
        items: [
          { label: "MBBS (Medicine)", href: "/colleges/mbbs" },
          { label: "BDS (Dental)", href: "/colleges/mbbs" },
          { label: "B.Pharm (Pharmacy)", href: "/colleges" },
          { label: "B.Sc Nursing", href: "/colleges" },
        ],
      },
    ],
  },
  {
    key: "design",
    label: "DESIGN",
    mainHref: "/colleges",
    columns: [
      {
        title: "Top Design Institutes",
        items: [
          { label: "National Institute of Design (NID)", href: "/colleges?q=NID" },
          { label: "National Institute of Fashion Tech (NIFT)", href: "/colleges?q=NIFT" },
          { label: "Top Architecture Colleges (B.Arch)", href: "/colleges?q=Architecture" },
          { label: "Top Private Design Colleges", href: "/colleges" },
        ],
      },
      {
        title: "Design Entrance Exams",
        items: [
          { label: "UCEED Exam 2026", href: "/exams/jee-main" },
          { label: "NID DAT Exam", href: "/exams/jee-main" },
          { label: "NATA Architecture Exam", href: "/exams/jee-main" },
        ],
      },
      {
        title: "Popular Programs",
        items: [
          { label: "B.Des (Fashion Design)", href: "/colleges" },
          { label: "B.Des (UI/UX & Interaction)", href: "/colleges" },
          { label: "B.Arch (Architecture)", href: "/colleges" },
          { label: "Animation & Game Design", href: "/colleges" },
        ],
      },
    ],
  },
  {
    key: "more",
    label: "MORE",
    mainHref: "/colleges",
    columns: [
      {
        title: "General & Law Streams",
        items: [
          { label: "Law Colleges (BA LLB / CLAT)", href: "/colleges?q=Law" },
          { label: "Top BCA / MCA Colleges", href: "/colleges?q=BCA" },
          { label: "Commerce & B.Com Colleges", href: "/colleges?q=Commerce" },
          { label: "Science & B.Sc Colleges", href: "/colleges?q=Science" },
        ],
      },
      {
        title: "State Direct Hubs",
        items: [
          { label: "Colleges in Odisha", href: "/colleges/b-tech/odisha" },
          { label: "Colleges in Maharashtra", href: "/colleges/b-tech/maharashtra" },
          { label: "Colleges in Delhi NCR", href: "/colleges?state=Delhi" },
          { label: "Colleges in Karnataka", href: "/colleges?state=Karnataka" },
        ],
      },
      {
        title: "Student Tools",
        items: [
          { label: "College Compare Tool", href: "/compare/iit-bombay-vs-nit-rourkela" },
          { label: "JEE Main Predictor", href: "/college-predictor/jee-main" },
          { label: "Editorial & Live News", href: "/blog" },
        ],
      },
    ],
  },
  {
    key: "study_abroad",
    label: "STUDY ABROAD",
    mainHref: "/colleges",
    columns: [
      {
        title: "Top Study Destinations",
        items: [
          { label: "Study in USA (Universities & Visas)", href: "/colleges" },
          { label: "Study in UK (Russell Group)", href: "/colleges" },
          { label: "Study in Canada (PGWP & Colleges)", href: "/colleges" },
          { label: "Study in Germany (Tuition-Free)", href: "/colleges" },
          { label: "Study in Australia", href: "/colleges" },
        ],
      },
      {
        title: "Abroad Entrance Exams",
        items: [
          { label: "IELTS Exam Preparation", href: "/exams/jee-main" },
          { label: "TOEFL Exam Updates", href: "/exams/jee-main" },
          { label: "GRE Test Guidelines", href: "/exams/gate" },
          { label: "GMAT for Global MBA", href: "/exams/cat" },
        ],
      },
      {
        title: "Admissions Guidance",
        items: [
          { label: "International Scholarship Grants", href: "/blog" },
          { label: "SOP & LOR Writing Guidance", href: "/blog" },
          { label: "Student Visa Counseling", href: "/login" },
        ],
      },
    ],
  },
  {
    key: "counseling",
    label: "COUNSELING",
    mainHref: "/colleges",
    columns: [
      {
        title: "Institutional Counseling",
        items: [
          { label: "JoSAA Counseling 2026 Process", href: "/exams/jee-main" },
          { label: "CSAB Special Rounds", href: "/college-predictor/jee-main" },
          { label: "MCC NEET Medical Allotment", href: "/blog/neet-ug-2026-counseling-dates-seat-matrix-breakdown" },
          { label: "State Quota Seat Matrix", href: "/colleges/b-tech/odisha" },
        ],
      },
      {
        title: "Predictor Tools",
        items: [
          { label: "JEE Main College Predictor", href: "/college-predictor/jee-main", badge: "Hot" },
          { label: "NEET Medical Rank Matcher", href: "/college-predictor/neet-ug" },
          { label: "CAT Percentile Calculator", href: "/college-predictor/cat" },
        ],
      },
      {
        title: "Direct Support",
        items: [
          { label: "Book 1-on-1 Counselor Call", href: "/login" },
          { label: "College Fee Waiver Check", href: "/colleges" },
          { label: "Verified Reviews & Ratings", href: "/colleges" },
        ],
      },
    ],
  },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [counselorOpen, setCounselorOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Active hover category for the stream bar
  const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(null);
  const [mobileOpenCategory, setMobileOpenCategory] = useState<string | null>(null);

  const activeCategory = CATEGORIES.find((c) => c.key === activeCategoryKey);

  const navBarRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navBarRef.current && !navBarRef.current.contains(e.target as Node)) {
        setActiveCategoryKey(null);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveCategoryKey(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <header ref={navBarRef} className="sticky top-0 z-50 w-full shadow-md">
        {/* Top Header Row: Logo, Search, Action Buttons */}
        <div className="w-full bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 py-1">
              <Image
                src="/logo.png"
                alt="Admission Here Logo"
                width={220}
                height={55}
                className="h-11 sm:h-12 w-auto object-contain transition-transform hover:scale-[1.02]"
                priority
              />
            </Link>

            {/* Global Search Bar (Center) */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search colleges, exams, courses"
                className="w-full flex items-center justify-between px-4 py-2 text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-full transition-all cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-slate-400" />
                  <span>Search for colleges, exams, courses, degrees...</span>
                </div>
                <kbd className="px-2 py-0.5 text-[10px] bg-white border rounded text-slate-500 font-mono shadow-2xs">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Mobile Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Free Counseling Button */}
              <button
                onClick={() => setCounselorOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg text-white shadow-xs transition-all cursor-pointer active:scale-95 bg-[#C41E1E] hover:bg-[#a81919]"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="hidden sm:inline">Free Counseling</span>
                <span className="sm:hidden">Help</span>
              </button>

              {/* Admin Portal Button */}
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-[#1a3068] text-[#1a3068] rounded-lg hover:bg-[#1a3068] hover:text-white transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-800 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-red-600" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Second Row: Collegedunia/Shiksha Style Dark Teal/Navy Stream Navigation Bar */}
        <div
          className="relative hidden md:block w-full border-t border-teal-800"
          style={{ background: "#0b5858" }} // Deep Teal matching user screenshot
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-0.5 lg:gap-1">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategoryKey === cat.key;
                return (
                  <div 
                    key={cat.key} 
                    className="relative"
                    onMouseEnter={() => setActiveCategoryKey(cat.key)}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveCategoryKey(isActive ? null : cat.key)}
                      className={`px-3 py-2 text-[12px] font-black uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "bg-black/25 text-white"
                          : "text-white/95 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isActive ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Mega Dropdown Menu Panel (Full Width Floating Container) */}
          {activeCategory && (
            <div
              className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-2xl py-6 animate-in fade-in slide-in-from-top-1 duration-150 z-50 text-slate-800"
              onMouseLeave={() => setActiveCategoryKey(null)}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1F8040]" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                      {activeCategory.label} Admissions &amp; College Directory 2026
                    </h3>
                  </div>
                  <Link
                    href={activeCategory.mainHref}
                    onClick={() => setActiveCategoryKey(null)}
                    className="text-xs font-bold text-[#0b5858] hover:underline flex items-center gap-1"
                  >
                    <span>View All {activeCategory.label} Colleges</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* 3-Column Structured Grid */}
                <div className="grid grid-cols-3 gap-8">
                  {activeCategory.columns.map((col, idx) => (
                    <div key={idx} className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
                        {col.title}
                      </h4>
                      <ul className="space-y-2">
                        {col.items.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            <Link
                              href={item.href}
                              onClick={() => setActiveCategoryKey(null)}
                              className="text-xs text-slate-700 hover:text-[#0b5858] hover:font-bold transition-colors flex items-center justify-between group"
                            >
                              <span className="group-hover:translate-x-0.5 transition-transform">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded-sm">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Accordion Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Academic Streams &amp; Programs
            </div>

            <div className="space-y-1">
              {CATEGORIES.map((cat) => {
                const isOpen = mobileOpenCategory === cat.key;
                return (
                  <div key={cat.key} className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                    <button
                      type="button"
                      onClick={() => setMobileOpenCategory(isOpen ? null : cat.key)}
                      className="w-full flex items-center justify-between p-3 text-left font-bold text-xs text-slate-800"
                    >
                      <span className="uppercase">{cat.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="p-3 pt-0 border-t border-slate-200 bg-white space-y-3">
                        {cat.columns.map((col, idx) => (
                          <div key={idx} className="space-y-1 pt-2">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">
                              {col.title}
                            </div>
                            {col.items.map((sub, sIdx) => (
                              <Link
                                key={sIdx}
                                href={sub.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-1 text-xs text-slate-700 hover:text-[#0b5858] font-medium"
                              >
                                • {sub.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Links */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800"
              >
                <UserCheck className="w-4 h-4 text-[#1a3068]" />
                <span>Admin Login Portal</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* AI Counselor Drawer Modal */}
      <AiCounselorDrawer open={counselorOpen} onClose={() => setCounselorOpen(false)} />

      {/* Search Command Bar Modal */}
      <AiSearchCommandBar open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
