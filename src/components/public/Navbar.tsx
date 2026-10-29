"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
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
  ChevronRight
} from "lucide-react";
import { AiCounselorDrawer } from "../ai/AiCounselorDrawer";
import { AiSearchCommandBar } from "../ai/AiSearchCommandBar";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [counselorOpen, setCounselorOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
              <Link href="/colleges" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <Compass className="w-4 h-4" style={{ color: "#1a3068" }} />
                <span>Colleges</span>
              </Link>
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
          <div className="md:hidden border-b bg-card/98 backdrop-blur-md px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-xl">
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-2">
              Explore &amp; Discover
            </div>

            <div className="space-y-1">
              <Link
                href="/colleges"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted font-medium text-sm text-foreground transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(26,48,104,0.1)", color: "#1a3068" }}>
                    <Compass className="w-4 h-4" />
                  </div>
                  <span>Explore Colleges</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>

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
