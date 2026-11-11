"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, BookOpen, Layers, Newspaper, Sparkles } from "lucide-react";
import { useState } from "react";
import { AiCounselorDrawer } from "../ai/AiCounselorDrawer";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [counselorOpen, setCounselorOpen] = useState(false);

  const navLinks = [
    { label: "Colleges", href: "/colleges", icon: Compass },
    { label: "Exams", href: "/exams/jee-main", icon: BookOpen },
    { label: "Predictor", href: "/college-predictor/jee-main", icon: Layers },
    { label: "News", href: "/blog", icon: Newspaper },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 md:hidden py-1.5 px-3 flex items-center justify-around shadow-lg">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? "text-[#1a3068] dark:text-blue-400 font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 font-medium"
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "scale-110" : ""}`} />
              <span className="text-[10px] leading-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* Quick Student Counselor Button */}
        <button
          type="button"
          onClick={() => setCounselorOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 text-[#C41E1E] font-bold cursor-pointer"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 mb-0.5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <span className="text-[10px] leading-tight">Counselor</span>
        </button>
      </div>

      <AiCounselorDrawer open={counselorOpen} onClose={() => setCounselorOpen(false)} />
    </>
  );
}

