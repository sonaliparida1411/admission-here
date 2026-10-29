"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  UserPlus, 
  Trash2, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Contact2, 
  Globe2, 
  Search, 
  ShieldCheck, 
  Lock,
  Eye,
  EyeOff,
  UserCheck
} from "lucide-react";

interface StaffItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  createdAt: string;
  permissions: string[];
}

const AVAILABLE_PERMISSIONS = [
  {
    id: "colleges",
    label: "Colleges Directory",
    desc: "Manage college profiles, courses, fee structures, cutoffs & rankings",
    icon: Building2,
    badgeBg: "rgba(26, 48, 104, 0.1)",
    badgeColor: "#1a3068",
  },
  {
    id: "exams",
    label: "Entrance Exams",
    desc: "Manage exams dates, syllabus, counseling rounds & cutoffs",
    icon: BookOpen,
    badgeBg: "rgba(31, 128, 64, 0.12)",
    badgeColor: "#1f8040",
  },
  {
    id: "blogs",
    label: "Editorial Blog CMS",
    desc: "Create and publish admission articles, exam news & live tickers",
    icon: FileText,
    badgeBg: "rgba(217, 119, 6, 0.12)",
    badgeColor: "#b45309",
  },
  {
    id: "reviews",
    label: "Review Moderation",
    desc: "Approve or reject student college reviews and verify ID proofs",
    icon: MessageSquare,
    badgeBg: "rgba(124, 58, 237, 0.12)",
    badgeColor: "#7c3aed",
  },
  {
    id: "leads",
    label: "B2B Student Leads",
    desc: "View and manage student applications, OTP verification & counseling",
    icon: Contact2,
    badgeBg: "rgba(196, 30, 30, 0.12)",
    badgeColor: "#c41e1e",
  },
  {
    id: "seo-geo",
    label: "SEO & GEO Engine",
    desc: "Monitor sitemaps, /llms.txt AI crawler feeds & structured metadata",
    icon: Globe2,
    badgeBg: "rgba(14, 165, 233, 0.12)",
    badgeColor: "#0284c7",
  },
];

export function StaffManagementClient({
  initialStaff,
}: {
  initialStaff: StaffItem[];
}) {
  const [staffList, setStaffList] = useState<StaffItem[]>(initialStaff);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

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

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

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

      setSuccessMsg(`Staff account "${data.staff.name}" (${data.staff.email}) created successfully!`);
      setStaffList((prev) => [data.staff, ...prev]);

      // Reset form
      setName("");
      setUserId("");
      setPassword("");
      setSelectedPermissions([]);
      setShowCreateModal(false);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while creating staff.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStaff = async (id: string, staffName: string) => {
    if (!confirm(`Are you sure you want to delete staff account "${staffName}"? This action cannot be undone.`)) {
      return;
    }

    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/v1/admin/staff?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete staff member.");
      }

      setStaffList((prev) => prev.filter((s) => s.id !== id));
      setSuccessMsg(`Staff account "${staffName}" deleted.`);
    } catch (err: any) {
      alert(err.message || "Failed to delete staff account.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredStaff = staffList.filter((staff) => {
    const q = searchQuery.toLowerCase();
    return (
      staff.name.toLowerCase().includes(q) ||
      staff.email.toLowerCase().includes(q) ||
      staff.permissions.some((p) => p.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#c41e1e" }} />
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Staff &amp; Role Access Control
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Create staff accounts with custom login IDs &amp; passwords, and assign granular permissions so staff only manage designated sections.
          </p>
        </div>

        <button
          onClick={() => {
            setShowCreateModal(true);
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white shadow-xs transition-opacity cursor-pointer"
          style={{ background: "#1a3068" }}
        >
          <UserPlus className="w-4 h-4" />
          <span>Create New Staff</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 rounded-xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-emerald-700 font-bold hover:underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Staff Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border bg-card shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Active Staff</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(26, 48, 104, 0.1)", color: "#1a3068" }}>
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground mt-2">{staffList.length}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Staff users with restricted access</p>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Access Granularity</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(31, 128, 64, 0.1)", color: "#1f8040" }}>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground mt-2">6 Modules</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Colleges, Exams, Blogs, Reviews, Leads, SEO</p>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Security Policy</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(196, 30, 30, 0.1)", color: "#c41e1e" }}>
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground mt-2">Strict RBAC</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Staff blocked from unauthorized URLs &amp; Admin controls</p>
        </div>
      </div>

      {/* Staff Table Section */}
      <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
        {/* Table Filter Bar */}
        <div className="p-4 border-b flex flex-col sm:flex-row items-center justify-between gap-3 bg-muted/10">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search staff by name, user ID, or permission..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border rounded-lg bg-background outline-hidden focus:border-primary"
            />
          </div>

          <div className="text-xs text-muted-foreground">
            Showing <strong className="text-foreground">{filteredStaff.length}</strong> of {staffList.length} staff
          </div>
        </div>

        {/* Table */}
        {filteredStaff.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-muted-foreground bg-muted/40">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-foreground">No staff members found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery
                ? "No staff matching your search filter. Try clearing your query."
                : "No staff members have been created yet. Click 'Create New Staff' to add your first staff member."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                style={{ background: "#1a3068" }}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Staff Now</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground border-b text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">Staff Member</th>
                  <th className="py-3 px-4 font-semibold">User ID / Login Email</th>
                  <th className="py-3 px-4 font-semibold">Assigned Permissions / Features</th>
                  <th className="py-3 px-4 font-semibold">Created Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-muted/20 transition-colors">
                    {/* Staff Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0"
                          style={{ background: "#1a3068" }}
                        >
                          {staff.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong className="block text-foreground text-xs">{staff.name}</strong>
                          <span
                            className="inline-block text-[10px] font-bold px-1.5 py-0.2 rounded"
                            style={{ background: "rgba(26,48,104,0.1)", color: "#1a3068" }}
                          >
                            STAFF
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email / User ID */}
                    <td className="py-3 px-4 font-mono text-[11px] text-foreground">
                      {staff.email}
                    </td>

                    {/* Assigned Permissions */}
                    <td className="py-3 px-4">
                      {staff.permissions.length === 0 ? (
                        <span className="text-[11px] text-muted-foreground italic">No features assigned</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {staff.permissions.map((perm) => {
                            const pConfig = AVAILABLE_PERMISSIONS.find((p) => p.id === perm);
                            return (
                              <span
                                key={perm}
                                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{
                                  background: pConfig?.badgeBg || "rgba(26,48,104,0.1)",
                                  color: pConfig?.badgeColor || "#1a3068",
                                }}
                              >
                                {pConfig?.label || perm}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="py-3 px-4 text-muted-foreground text-[11px]">
                      {new Date(staff.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteStaff(staff.id, staff.name)}
                        disabled={deleteLoading === staff.id}
                        className="p-1.5 rounded-md hover:bg-red-500/10 text-red-600 transition-colors cursor-pointer"
                        title="Delete Staff Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE STAFF MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-card border rounded-2xl p-4 sm:p-7 shadow-2xl space-y-4 sm:space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: "#1a3068" }}
                  >
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Create New Staff Member</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Set up user credentials and choose only the specific features they are allowed to access.
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
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

                {/* User ID / Email */}
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
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">
                    If no &quot;@&quot; is entered, &quot;@admissionhere.in&quot; will be appended automatically.
                  </span>
                </div>
              </div>

              {/* Password */}
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
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                  <span>Staff will use this password to sign in at /login</span>
                  <button
                    type="button"
                    onClick={() => setPassword("Staff@" + Math.floor(1000 + Math.random() * 9000))}
                    className="text-primary hover:underline font-semibold"
                  >
                    Generate Random Password
                  </button>
                </div>
              </div>

              {/* Feature Permissions Checkboxes */}
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
                          onChange={() => {}} // Handled by parent div
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

              {/* Notice */}
              <div
                className="p-3 rounded-lg text-[11px] leading-relaxed flex items-center gap-2"
                style={{ background: "rgba(26, 48, 104, 0.06)", color: "#1a3068" }}
              >
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  Staff accounts <strong>never</strong> receive access to Staff Management or User Role management. Those remain restricted to Super Administrators only.
                </span>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border text-xs font-semibold hover:bg-muted text-foreground transition-colors"
                >
                  Cancel
                </button>
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
                      <span>Create Staff Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

