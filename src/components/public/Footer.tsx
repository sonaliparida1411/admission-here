import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Cpu, Globe, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t text-sm pt-12 pb-16" style={{ background: "#f0f4ff", color: "#4a5568" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Admission Here"
                width={160}
                height={44}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-xs leading-relaxed max-w-sm text-gray-500">
              India&apos;s authoritative Higher Education Discovery Directory, Cutoff Predictor Engine, and Generative Search Platform. Backed by verified NIRF rankings, JoSAA/CSAB historical cutoffs, and audited placement reports.
            </p>
            <div className="flex items-center gap-4 text-xs font-medium pt-1 flex-wrap">
              <span className="flex items-center gap-1" style={{ color: "#1f8040" }}>
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Cutoffs
              </span>
              <span className="flex items-center gap-1" style={{ color: "#1a3068" }}>
                <Cpu className="w-3.5 h-3.5" /> AI Semantic Search
              </span>
              <span className="flex items-center gap-1" style={{ color: "#c41e1e" }}>
                <Award className="w-3.5 h-3.5" /> NIRF Indexed
              </span>
            </div>
          </div>

          {/* Quick Links: Engineering */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider mb-3" style={{ color: "#1a3068" }}>
              Top Engineering
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/colleges/b-tech" className="hover:text-primary transition-colors">
                  Top B.Tech Colleges in India
                </Link>
              </li>
              <li>
                <Link href="/colleges/b-tech/odisha" className="hover:text-primary transition-colors">
                  B.Tech Colleges in Odisha
                </Link>
              </li>
              <li>
                <Link href="/colleges/b-tech/maharashtra" className="hover:text-primary transition-colors">
                  B.Tech Colleges in Maharashtra
                </Link>
              </li>
              <li>
                <Link href="/college-predictor/jee-main" className="hover:underline font-medium" style={{ color: "#c41e1e" }}>
                  JEE Main Rank Predictor
                </Link>
              </li>
              <li>
                <Link href="/exams/jee-main" className="hover:text-primary transition-colors">
                  JEE Main Exam Dates &amp; Cutoffs
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: Management & Medical */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider mb-3" style={{ color: "#1a3068" }}>
              Management &amp; Medical
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/colleges/mba" className="hover:text-primary transition-colors">
                  Top MBA Colleges in India
                </Link>
              </li>
              <li>
                <Link href="/colleges/mbbs" className="hover:text-primary transition-colors">
                  Top Medical / MBBS Colleges
                </Link>
              </li>
              <li>
                <Link href="/exams/cat" className="hover:text-primary transition-colors">
                  CAT Exam &amp; IIM Cutoffs
                </Link>
              </li>
              <li>
                <Link href="/exams/neet-ug" className="hover:text-primary transition-colors">
                  NEET UG Rank Matrix
                </Link>
              </li>
            </ul>
          </div>

          {/* Machine & AI Discovery (GEO) */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider mb-3" style={{ color: "#1a3068" }}>
              AI Crawlers &amp; SEO (GEO)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/llms.txt" target="_blank" className="hover:text-primary flex items-center gap-1 font-mono text-[11px]">
                  <Globe className="w-3 h-3" style={{ color: "#1a3068" }} /> /llms.txt Feed
                </a>
              </li>
              <li>
                <a href="/llms-full.txt" target="_blank" className="hover:text-primary flex items-center gap-1 font-mono text-[11px]">
                  <Globe className="w-3 h-3" style={{ color: "#c41e1e" }} /> /llms-full.txt (AEO)
                </a>
              </li>
              <li>
                <a href="/sitemap.xml" target="_blank" className="hover:text-primary font-mono text-[11px]">
                  Sharded XML Sitemaps
                </a>
              </li>
              <li>
                <Link href="/admin" className="font-semibold" style={{ color: "#1a3068" }}>
                  Admin CMS Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between text-xs gap-4 text-center md:text-left" style={{ borderColor: "#c7d3ec" }}>
          <p>© {new Date().getFullYear()} Admission Here Technologies Ltd. All rights reserved.</p>
          <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="/editorial-standards" className="hover:underline">
              Editorial Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
