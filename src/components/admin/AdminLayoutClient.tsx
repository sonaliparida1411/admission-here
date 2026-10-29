"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Menu, ShieldCheck, Database } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  role: string;
  permissions: string[];
  userName: string;
  userEmail: string;
}

export function AdminLayoutClient({
  children,
  role,
  permissions,
  userName,
  userEmail,
}: AdminLayoutClientProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-muted/20">
      {/* Desktop Sidebar (hidden on mobile, sticky on md+) */}
      <div className="hidden md:block w-64 h-screen sticky top-0 shrink-0">
        <AdminSidebar
          role={role}
          permissions={permissions}
          userName={userName}
          userEmail={userEmail}
        />
      </div>

      {/* Mobile Sidebar Slide-Over Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Drawer container */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <AdminSidebar
              role={role}
              permissions={permissions}
              userName={userName}
              userEmail={userEmail}
              onClose={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Top Header */}
        <header className="h-16 border-b bg-card px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs gap-3">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-muted text-foreground transition-colors cursor-pointer"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Logo Brand */}
            <Link href="/" className="md:hidden flex items-center shrink-0">
              <Image
                src="/logo.png"
                alt="Admission Here"
                width={120}
                height={32}
                className="h-7 w-auto object-contain"
              />
            </Link>

            {/* Active Role Pill */}
            <span
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
              style={{
                backgroundColor:
                  role === "STAFF"
                    ? "rgba(26, 48, 104, 0.1)"
                    : "rgba(31, 128, 64, 0.12)",
                color: role === "STAFF" ? "#1a3068" : "#1f8040",
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                {role === "STAFF"
                  ? `Staff (${permissions.length} module${
                      permissions.length === 1 ? "" : "s"
                    })`
                  : "Super Admin (Full Access)"}
              </span>
            </span>
          </div>

          {/* User Status */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="hidden xs:inline">User:</span>
              <strong className="text-foreground max-w-[120px] sm:max-w-none truncate font-medium">
                {userName}
              </strong>
            </div>

            <div className="h-4 w-px bg-border hidden sm:block" />

            <div className="hidden lg:flex items-center gap-1.5 text-muted-foreground font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              admission_db
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

