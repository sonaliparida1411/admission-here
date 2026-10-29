"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Users, 
  Globe2, 
  LogOut, 
  Contact2,
  UserCog,
  ShieldCheck,
  X
} from "lucide-react";

export type StaffPermission = 
  | "dashboard"
  | "colleges"
  | "exams"
  | "blogs"
  | "reviews"
  | "leads"
  | "seo-geo"
  | "users"
  | "staff"
  | "all";

const navItems = [
  { label: "Dashboard",          href: "/admin",          icon: LayoutDashboard, permission: "dashboard" as const },
  { label: "Colleges Directory", href: "/admin/colleges", icon: Building2,        permission: "colleges"  as const },
  { label: "Entrance Exams",     href: "/admin/exams",    icon: BookOpen,         permission: "exams"     as const },
  { label: "Editorial Blog CMS", href: "/admin/blogs",    icon: FileText,         permission: "blogs"     as const },
  { label: "Review Moderation",  href: "/admin/reviews",  icon: MessageSquare,    permission: "reviews"   as const },
  { label: "B2B Student Leads",  href: "/admin/leads",    icon: Contact2,         permission: "leads"     as const },
  { label: "SEO & GEO Engine",   href: "/admin/seo-geo",  icon: Globe2,           permission: "seo-geo"   as const },
  { label: "User & Role Access", href: "/admin/users",    icon: Users,            permission: "users"     as const },
  { label: "Staff Management",   href: "/admin/staff",    icon: UserCog,          permission: "all"       as const },
];

interface AdminSidebarProps {
  role?: "SUPER_ADMIN" | "STAFF" | string;
  permissions?: string[];
  userName?: string;
  userEmail?: string;
  onClose?: () => void;
}

export function AdminSidebar({
  role = "SUPER_ADMIN",
  permissions = [],
  userName = "Super Administrator",
  userEmail = "superadmin@admissionhere.in",
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const visibleItems = navItems.filter((item) => {
    if (role === "SUPER_ADMIN") return true;
    if (item.permission === "all") return false;
    return permissions.includes(item.permission);
  });

  return (
    <aside
      className="w-full h-full flex flex-col justify-between shrink-0 overflow-y-auto"
      style={{ background: "linear-gradient(180deg, #0f1f4a 0%, #1a3068 100%)" }}
    >
      <div className="space-y-4 pt-4">
        {/* Brand Logo & Close Button (for mobile) */}
        <div className="flex items-center justify-between px-4 pb-2 border-b border-white/10">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <div className="bg-white rounded-lg p-1.5">
              <Image
                src="/logo.png"
                alt="Admission Here"
                width={120}
                height={34}
                className="h-7 w-auto object-contain"
              />
            </div>
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Role Badge */}
        <div className="px-4">
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(31,128,64,0.25)", color: "#6ee7a8" }}
          >
            <ShieldCheck className="w-3 h-3" />
            {role === "SUPER_ADMIN" ? "SUPER ADMIN" : "STAFF"}
          </span>
        </div>

        {/* Navigation */}
        <nav className="px-3 space-y-0.5">
          {visibleItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "text-white shadow-lg"
                    : "text-blue-200/80 hover:text-white hover:bg-white/10"
                }`}
                style={isActive ? { background: "rgba(196,30,30,0.85)" } : {}}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer */}
      <div className="border-t border-white/10 p-4 space-y-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: "#c41e1e" }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white text-xs truncate">{userName}</p>
            <p className="text-[10px] text-blue-300 truncate">{userEmail}</p>
          </div>
        </div>
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Exit to Student Portal</span>
        </Link>
      </div>
    </aside>
  );
}
