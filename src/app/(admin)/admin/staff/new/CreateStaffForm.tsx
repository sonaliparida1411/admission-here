"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  UserPlus, 
  ArrowLeft, 
  Building2, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Contact2, 
  Globe2, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";

const AVAILABLE_PERMISSIONS = [
  {
    id: "colleges",
    label: "Colleges Directory",
    desc: "Manage college profiles, courses, fee structures, cutoffs & rankings",
    icon: Building2,
    badgeColor: "#1a3068",
  },
  {
    id: "exams",
    label: "Entrance Exams",
    desc: "Manage exams dates, syllabus, counseling rounds & cutoffs",
    icon: BookOpen,
    badgeColor: "#1f8040",
  },
  {
    id: "blogs",
    label: "Editorial Blog CMS",
    desc: "Create and publish admission articles, exam news & live tickers",
    icon: FileText,
    badgeColor: "#b45309",
  },
  {
    id: "reviews",
    label: "Review Moderation",
    desc: "Approve or reject student college reviews and verify ID proofs",
    icon: MessageSquare,
    badgeColor: "#7c3aed",
  },
  {
    id: "leads",
    label: "B2B Student Leads",
    desc: "View and manage student applications, OTP verification & counseling",
    icon: Contact2,
    badgeColor: "#c41e1e",
  },
  {
    id: "seo-geo",
    label: "SEO & GEO Engine",
    desc: "Monitor sitemaps, /llms.txt AI crawler feeds & structured metadata",
    icon: Globe2,
    badgeColor: "#0284c7",
  },
];

export function CreateStaffForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((p) => p !== permId)
        : [...prev, permId]
    );
  };

  const selectAllPermissions = () => {
    setSelectedPermissions(AVAILABLE_PERMISSIONS.map((p) => p.id));
  };

  const clearAllPermissions = () => {
    setSelectedPermissions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Please enter the staff member's full name.");
      return;
    }
    if (!userId.trim()) {
      setErrorMsg("Please enter a User ID or Email for the staff.");
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (selectedPermissions.length === 0) {
      setErrorMsg("Please select at least one feature permission for this staff.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/v1/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          userId: userId.trim(),
          password,
          permissions: selectedPermissions,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create staff account.");
      }

      router.push("/admin/staff");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while creating staff.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/staff"
          className="p-2 rounded-lg border hover:bg-muted text-muted-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">Create New Staff Member</h1>
          <p className="text-xs text-muted-foreground">
            Provide credentials and select specific features for staff access.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-card border rounded-2xl p-4 sm:p-8 shadow-xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Staff Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-background outline-hidden focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              User ID or Email *
            </label>
            <input
              type="text"
              required
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g. rahul_counselor or rahul@admissionhere.in"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-background outline-hidden focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Login Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set secure password (min. 6 characters)"
              className="w-full pl-3 pr-10 py-2 text-xs border rounded-lg bg-background outline-hidden focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-bold text-foreground">
                Select Feature Access Permissions *
              </label>
              <p className="text-[11px] text-muted-foreground">
                Check only the modules this staff member is permitted to manage.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <button
                type="button"
                onClick={selectAllPermissions}
                className="text-primary hover:underline font-semibold"
              >
                Select All
              </button>
              <span className="text-muted-foreground">•</span>
              <button
                type="button"
                onClick={clearAllPermissions}
                className="text-muted-foreground hover:underline"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {AVAILABLE_PERMISSIONS.map((perm) => {
              const isSelected = selectedPermissions.includes(perm.id);
              const Icon = perm.icon;

              return (
                <div
                  key={perm.id}
                  onClick={() => togglePermission(perm.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-2xs"
                      : "hover:bg-muted/30 border-border"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-primary focus:ring-primary shrink-0 cursor-pointer"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" style={{ color: perm.badgeColor }} />
                      <strong className="text-xs text-foreground block">{perm.label}</strong>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                      {perm.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Link
            href="/admin/staff"
            className="px-4 py-2 rounded-lg border text-xs font-semibold hover:bg-muted text-foreground transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-lg text-xs font-bold text-white shadow-xs transition-opacity flex items-center gap-1.5 cursor-pointer"
            style={{ background: "#1a3068" }}
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Staff...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span>Save Staff Account</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

