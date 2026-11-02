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
  GraduationCap,
  Building2,
  ArrowRight
} from "lucide-react";
import { AiCounselorDrawer } from "../ai/AiCounselorDrawer";
import { AiSearchCommandBar } from "../ai/AiSearchCommandBar";

interface CollegeItem {
  id: string;
  name: string;
  shortName?: string | null;
  slug: string;
  city: string;
  state: string;
  nirfRank?: number | null;
}

interface CourseCategory {
  id: string;
  slug: string;
  degree: string;
  stream: string;
  fullName: string;
  colleges: CollegeItem[];
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [counselorOpen, setCounselorOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Desktop Dropdown State
  const [collegeDropdownOpen, setCollegeDropdownOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<"UG" | "PG">("UG");
  const [selectedCourseIdx, setSelectedCourseIdx] = useState(0);

  // Mobile Accordion State
  const [mobileCollegesOpen, setMobileCollegesOpen] = useState(false);
  const [mobileLevel, setMobileLevel] = useState<"UG" | "PG">("UG");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Default Course Hierarchy Fallbacks with live data enhancement
  const [hierarchy, setHierarchy] = useState<{
    ug: CourseCategory[];
    pg: CourseCategory[];
  }>({
    ug: [
      {
        id: "ug-1",
        slug: "b-tech",
        degree: "B.Tech",
        stream: "Engineering",
        fullName: "Bachelor of Technology",
        colleges: [
          { id: "1", name: "Indian Institute of Technology Bombay", shortName: "IIT Bombay", slug: "iit-bombay", city: "Mumbai", state: "Maharashtra", nirfRank: 3 },
          { id: "2", name: "National Institute of Technology Rourkela", shortName: "NIT Rourkela", slug: "nit-rourkela", city: "Rourkela", state: "Odisha", nirfRank: 16 },
          { id: "3", name: "Birla Institute of Technology and Science Pilani", shortName: "BITS Pilani", slug: "bits-pilani", city: "Pilani", state: "Rajasthan", nirfRank: 20 },
        ],
      },
      {
        id: "ug-2",
        slug: "mbbs",
        degree: "MBBS",
        stream: "Medical",
        fullName: "Bachelor of Medicine, Bachelor of Surgery",
        colleges: [
          { id: "4", name: "All India Institute of Medical Sciences", shortName: "AIIMS New Delhi", slug: "aiims-delhi", city: "New Delhi", state: "Delhi", nirfRank: 1 },
        ],
      },
      {
        id: "ug-3",
        slug: "bba",
        degree: "BBA",
        stream: "Management",
        fullName: "Bachelor of Business Administration",
        colleges: [
          { id: "5", name: "Birla Institute of Technology and Science Pilani", shortName: "BITS Pilani", slug: "bits-pilani", city: "Pilani", state: "Rajasthan", nirfRank: 20 },
        ],
      },
      {
        id: "ug-4",
        slug: "bca",
        degree: "BCA",
        stream: "Computer Applications",
        fullName: "Bachelor of Computer Applications",
        colleges: [
          { id: "2", name: "National Institute of Technology Rourkela", shortName: "NIT Rourkela", slug: "nit-rourkela", city: "Rourkela", state: "Odisha", nirfRank: 16 },
        ],
      },
      {
        id: "ug-5",
        slug: "b-sc",
        degree: "B.Sc",
        stream: "Science",
        fullName: "Bachelor of Science",
        colleges: [
          { id: "1", name: "Indian Institute of Technology Bombay", shortName: "IIT Bombay", slug: "iit-bombay", city: "Mumbai", state: "Maharashtra", nirfRank: 3 },
        ],
      },
    ],
    pg: [
      {
        id: "pg-1",
        slug: "mba",
        degree: "MBA",
        stream: "Management",
        fullName: "Master of Business Administration",
        colleges: [
          { id: "6", name: "Indian Institute of Management Ahmedabad", shortName: "IIM Ahmedabad", slug: "iim-ahmedabad", city: "Ahmedabad", state: "Gujarat", nirfRank: 1 },
          { id: "1", name: "Indian Institute of Technology Bombay", shortName: "IIT Bombay (SJMSOM)", slug: "iit-bombay", city: "Mumbai", state: "Maharashtra", nirfRank: 3 },
        ],
      },
      {
        id: "pg-2",
        slug: "m-tech",
        degree: "M.Tech",
        stream: "Engineering",
        fullName: "Master of Technology",
        colleges: [
          { id: "1", name: "Indian Institute of Technology Bombay", shortName: "IIT Bombay", slug: "iit-bombay", city: "Mumbai", state: "Maharashtra", nirfRank: 3 },
          { id: "2", name: "National Institute of Technology Rourkela", shortName: "NIT Rourkela", slug: "nit-rourkela", city: "Rourkela", state: "Odisha", nirfRank: 16 },
        ],
      },
      {
        id: "pg-3",
        slug: "mca",
        degree: "MCA",
        stream: "Computer Applications",
        fullName: "Master of Computer Applications",
        colleges: [
          { id: "2", name: "National Institute of Technology Rourkela", shortName: "NIT Rourkela", slug: "nit-rourkela", city: "Rourkela", state: "Odisha", nirfRank: 16 },
        ],
      },
    ],
  });

  // Fetch live hierarchy on mount
  useEffect(() => {
    async function loadHierarchy() {
      try {
        const res = await fetch("/api/v1/courses/hierarchy");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.hierarchy) {
            setHierarchy((prev) => ({
              ug: data.hierarchy.ug.length > 0 ? data.hierarchy.ug : prev.ug,
              pg: data.hierarchy.pg.length > 0 ? data.hierarchy.pg : prev.pg,
            }));
          }
        }
      } catch {
        // Fallback remains active
      }
    }
    loadHierarchy();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCollegeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeCourses = selectedLevel === "UG" ? hierarchy.ug : hierarchy.pg;
  const currentCourse = activeCourses[selectedCourseIdx] || activeCourses[0];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 nav-shadow">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src="/logo.png"
                alt="Admission Here Logo"
                width={150}
                height={40}
                className="h-8 sm:h-10 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-muted-foreground">
              {/* Colleges Mega-Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setCollegeDropdownOpen(!collegeDropdownOpen)}
                  onMouseEnter={() => setCollegeDropdownOpen(true)}
                  className={`hover:text-primary transition-colors flex items-center gap-1.5 py-2 cursor-pointer ${
                    collegeDropdownOpen ? "text-primary font-bold" : ""
                  }`}
                  aria-expanded={collegeDropdownOpen}
                >
                  <Compass className="w-4 h-4" style={{ color: "#1a3068" }} />
                  <span>Colleges</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${collegeDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Colleges Mega Menu */}
                {collegeDropdownOpen && (
                  <div
                    onMouseLeave={() => setCollegeDropdownOpen(false)}
                    className="absolute top-full left-0 w-[640px] bg-card border rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-150 z-50 grid grid-cols-12 gap-3"
                  >
                    {/* Column 1: Level Selector (UG / PG) */}
                    <div className="col-span-3 border-r pr-2 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1">
                        Select Level
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLevel("UG");
                          setSelectedCourseIdx(0);
                        }}
                        onMouseEnter={() => {
                          setSelectedLevel("UG");
                          setSelectedCourseIdx(0);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                          selectedLevel === "UG"
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "hover:bg-muted text-foreground"
                        }`}
                        style={selectedLevel === "UG" ? { background: "#1a3068" } : {}}
                      >
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 shrink-0" />
                          <span>UG</span>
                        </div>
                        <span className="text-[10px] opacity-80">Bachelor</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLevel("PG");
                          setSelectedCourseIdx(0);
                        }}
                        onMouseEnter={() => {
                          setSelectedLevel("PG");
                          setSelectedCourseIdx(0);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                          selectedLevel === "PG"
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "hover:bg-muted text-foreground"
                        }`}
                        style={selectedLevel === "PG" ? { background: "#1a3068" } : {}}
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 shrink-0" />
                          <span>PG</span>
                        </div>
                        <span className="text-[10px] opacity-80">Master</span>
                      </button>

                      <div className="pt-3 border-t">
                        <Link
                          href="/colleges"
                          onClick={() => setCollegeDropdownOpen(false)}
                          className="block text-[11px] font-bold text-primary hover:underline px-2 py-1"
                        >
                          View All Colleges &rarr;
                        </Link>
                      </div>
                    </div>

                    {/* Column 2: Available Courses under UG/PG */}
                    <div className="col-span-4 border-r pr-2 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1">
                        {selectedLevel === "UG" ? "Undergraduate Courses" : "Postgraduate Courses"}
                      </div>
                      <div className="space-y-0.5 max-h-64 overflow-y-auto pr-1">
                        {activeCourses.map((course, idx) => (
                          <button
                            key={course.id}
                            type="button"
                            onClick={() => setSelectedCourseIdx(idx)}
                            onMouseEnter={() => setSelectedCourseIdx(idx)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                              selectedCourseIdx === idx
                                ? "bg-muted text-foreground font-bold border-l-2 border-primary"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            }`}
                          >
                            <span className="truncate">{course.degree} - {course.stream}</span>
                            <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                          </button>
                        ))}
                      </div>

                      {currentCourse && (
                        <div className="pt-2 border-t">
                          <Link
                            href={`/colleges?course=${encodeURIComponent(currentCourse.degree)}&level=${selectedLevel}`}
                            onClick={() => setCollegeDropdownOpen(false)}
                            className="block text-[11px] font-bold text-primary hover:underline px-2 py-1 truncate"
                          >
                            All {currentCourse.degree} Colleges &rarr;
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Column 3: Colleges offering selected course */}
                    <div className="col-span-5 space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1 py-1 flex items-center justify-between">
                        <span>Colleges for {currentCourse?.degree || "Course"}</span>
                        <span className="text-[10px] text-muted-foreground">Top Ranked</span>
                      </div>

                      {currentCourse && currentCourse.colleges && currentCourse.colleges.length > 0 ? (
                        <div className="space-y-1.5">
                          {currentCourse.colleges.slice(0, 4).map((college) => (
                            <Link
                              key={college.id}
                              href={`/college/${college.slug}`}
                              onClick={() => setCollegeDropdownOpen(false)}
                              className="p-2 rounded-xl border bg-muted/20 hover:bg-muted/60 transition-colors flex items-start gap-2 group block"
                            >
                              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                <Building2 className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                  {college.shortName || college.name}
                                </h4>
                                <p className="text-[10px] text-muted-foreground">
                                  {college.city}, {college.state}
                                  {college.nirfRank ? ` • NIRF #${college.nirfRank}` : ""}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl border bg-muted/20 text-center text-xs text-muted-foreground">
                          <p>Explore institutes offering {currentCourse?.degree}.</p>
                          <Link
                            href={`/colleges?course=${encodeURIComponent(currentCourse?.degree || "")}&level=${selectedLevel}`}
                            onClick={() => setCollegeDropdownOpen(false)}
                            className="mt-2 inline-block text-[11px] font-bold text-primary hover:underline"
                          >
                            Browse Directory &rarr;
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/exams/jee-main" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" style={{ color: "#1f8040" }} />
                <span>Exams</span>
              </Link>
              <Link href="/college-predictor/jee-main" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <Layers className="w-4 h-4" style={{ color: "#c41e1e" }} />
                <span>Rank Predictor</span>
              </Link>
              <Link href="/blog" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <Newspaper className="w-4 h-4 text-purple-600" />
                <span>Articles &amp; News</span>
              </Link>
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search colleges"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs text-muted-foreground border rounded-full hover:border-primary/50 hover:bg-accent/40 transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Search colleges...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-muted border rounded text-muted-foreground font-mono">
                ⌘K
              </kbd>
            </button>

            {/* AI Counselor Button */}
            <button
              onClick={() => setCounselorOpen(true)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-bold rounded-full text-white shadow-xs transition-all cursor-pointer active:scale-95"
              style={{ background: "linear-gradient(135deg, #1a3068, #1e4db7)" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse shrink-0" />
              <span className="hidden xs:inline sm:inline">AI Counselor</span>
              <span className="xs:hidden sm:hidden">AI</span>
            </button>

            {/* Admin / Login Link (Desktop) */}
            <Link
              href="/admin"
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border rounded-lg hover:bg-accent text-foreground transition-colors"
              style={{ borderColor: "#1a3068", color: "#1a3068" }}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted/80 transition-colors focus:outline-hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-red-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b bg-card/98 backdrop-blur-md px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-2">
              Explore &amp; Discover
            </div>

            <div className="space-y-1">
              {/* Colleges Accordion in Mobile */}
              <div className="rounded-xl border bg-muted/30 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMobileCollegesOpen(!mobileCollegesOpen)}
                  className="w-full flex items-center justify-between p-2.5 text-left font-medium text-sm text-foreground"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(26,48,104,0.1)", color: "#1a3068" }}>
                      <Compass className="w-4 h-4" />
                    </div>
                    <span>Colleges &amp; Courses</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileCollegesOpen ? "rotate-180" : ""}`} />
                </button>

                {mobileCollegesOpen && (
                  <div className="p-3 pt-0 border-t space-y-3">
                    {/* UG / PG Tabs */}
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setMobileLevel("UG")}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border text-center transition-colors ${
                          mobileLevel === "UG" ? "bg-primary text-white border-primary" : "bg-card text-foreground"
                        }`}
                        style={mobileLevel === "UG" ? { background: "#1a3068" } : {}}
                      >
                        UG (Undergraduate)
                      </button>
                      <button
                        type="button"
                        onClick={() => setMobileLevel("PG")}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border text-center transition-colors ${
                          mobileLevel === "PG" ? "bg-primary text-white border-primary" : "bg-card text-foreground"
                        }`}
                        style={mobileLevel === "PG" ? { background: "#1a3068" } : {}}
                      >
                        PG (Postgraduate)
                      </button>
                    </div>

                    {/* Course List */}
                    <div className="space-y-1">
                      {(mobileLevel === "UG" ? hierarchy.ug : hierarchy.pg).map((course) => (
                        <Link
                          key={course.id}
                          href={`/colleges?course=${encodeURIComponent(course.degree)}&level=${mobileLevel}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg bg-card border hover:bg-muted text-xs font-semibold text-foreground"
                        >
                          <span>{course.degree} ({course.stream})</span>
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>

                    <Link
                      href="/colleges"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center py-2 text-xs font-bold text-primary hover:underline"
                    >
                      Browse All Colleges Directory &rarr;
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/exams/jee-main"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted font-medium text-sm text-foreground transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(31,128,64,0.1)", color: "#1f8040" }}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span>Entrance Exams</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>

              <Link
                href="/college-predictor/jee-main"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted font-medium text-sm text-foreground transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(196,30,30,0.1)", color: "#c41e1e" }}>
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span>College Predictor</span>
                    <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: "#c41e1e" }}>
                      NEW
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>

              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted font-medium text-sm text-foreground transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-purple-100 text-purple-700">
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <span>Editorial &amp; Live News</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </div>

            {/* Quick Actions in Mobile Menu */}
            <div className="pt-2 border-t space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCounselorOpen(true);
                }}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                style={{ background: "linear-gradient(135deg, #1a3068, #1e4db7)" }}
              >
                <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                <span>Launch AI Counselor Chat</span>
              </button>

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 hover:bg-muted text-foreground transition-colors"
                style={{ borderColor: "#1a3068", color: "#1a3068" }}
              >
                <UserCheck className="w-4 h-4" />
                <span>Admin &amp; Staff Control Panel</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global AI Search Modal */}
      <AiSearchCommandBar open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Global AI Counselor Drawer */}
      <AiCounselorDrawer open={counselorOpen} onClose={() => setCounselorOpen(false)} />
    </>
  );
}
