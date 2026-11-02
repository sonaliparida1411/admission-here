"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Send, 
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  GraduationCap, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Eye,
  X
} from "lucide-react";
import { LeadStatus, LeadCtaType } from "@prisma/client";

interface LeadItem {
  id: string;
  studentName: string;
  phone: string;
  email?: string | null;
  state?: string | null;
  district?: string | null;
  parentPhone?: string | null;
  targetCourse?: string | null;
  targetStream: string;
  targetCollegeId?: string | null;
  targetCollege?: {
    id: string;
    name: string;
    slug: string;
    city: string;
    state: string;
  } | null;
  ctaType: LeadCtaType;
  status: LeadStatus;
  counselorNotes?: string | null;
  createdAt: string;
}

interface EnquiriesManagementClientProps {
  initialLeads: LeadItem[];
  colleges: { id: string; name: string }[];
}

export function EnquiriesManagementClient({
  initialLeads,
  colleges,
}: EnquiriesManagementClientProps) {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  // Filtering
  const filteredLeads = leads.filter((item) => {
    const matchSearch =
      searchTerm === "" ||
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm) ||
      (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.targetCourse && item.targetCourse.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.targetCollege?.name && item.targetCollege.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchCollege = collegeFilter === "ALL" || item.targetCollegeId === collegeFilter;
    const matchType = typeFilter === "ALL" || item.ctaType === typeFilter;
    const matchStatus = statusFilter === "ALL" || item.status === statusFilter;

    return matchSearch && matchCollege && matchType && matchStatus;
  });

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/v1/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setUpdatingId(selectedLead.id);
    try {
      const res = await fetch("/api/v1/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedLead.id, counselorNotes: notesDraft }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === selectedLead.id ? { ...l, counselorNotes: notesDraft } : l))
        );
        setSelectedLead((prev) => (prev ? { ...prev, counselorNotes: notesDraft } : null));
      }
    } catch (err) {
      console.error("Failed to save notes", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCsv = () => {
    const params = new URLSearchParams();
    params.set("export", "csv");
    if (searchTerm) params.set("search", searchTerm);
    if (collegeFilter !== "ALL") params.set("collegeId", collegeFilter);
    if (typeFilter !== "ALL") params.set("ctaType", typeFilter);
    if (statusFilter !== "ALL") params.set("status", statusFilter);

    window.open(`/api/v1/admin/enquiries?${params.toString()}`, "_blank");
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW:
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case LeadStatus.CONTACTED:
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
      case LeadStatus.ASSIGNED_TO_COUNSELOR:
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";
      case LeadStatus.APPLICATION_SUBMITTED:
        return "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20";
      case LeadStatus.ENROLLED:
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Search Bar */}
      <div className="bg-card border rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search enquiries by name, phone, email, course, college..."
              className="w-full pl-9 pr-3 py-2 text-xs border rounded-xl bg-background outline-hidden focus:border-primary font-medium"
            />
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl border bg-background hover:bg-muted font-bold text-xs flex items-center justify-center gap-2 text-foreground transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Enquiries (CSV)</span>
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t">
          {/* College Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Filter by College
            </label>
            <select
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs border rounded-lg bg-background outline-hidden focus:border-primary cursor-pointer font-medium"
            >
              <option value="ALL">All Colleges ({colleges.length})</option>
              {colleges.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          {/* Enquiry Type Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Filter by Enquiry Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs border rounded-lg bg-background outline-hidden focus:border-primary cursor-pointer font-medium"
            >
              <option value="ALL">All Types</option>
              <option value={LeadCtaType.DOWNLOAD_BROCHURE}>Brochure Download</option>
              <option value={LeadCtaType.APPLY_NOW}>Apply Now (3-Field Form)</option>
              <option value={LeadCtaType.CHECK_ELIGIBILITY}>Eligibility Check</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Filter by Pipeline Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs border rounded-lg bg-background outline-hidden focus:border-primary cursor-pointer font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value={LeadStatus.NEW}>New Enquiry</option>
              <option value={LeadStatus.CONTACTED}>Contacted</option>
              <option value={LeadStatus.ASSIGNED_TO_COUNSELOR}>Assigned to Counselor</option>
              <option value={LeadStatus.APPLICATION_SUBMITTED}>Application Submitted</option>
              <option value={LeadStatus.ENROLLED}>Enrolled</option>
              <option value={LeadStatus.INVALID}>Invalid / Spam</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enquiries Data Table */}
      <div className="bg-card border rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="text-xs font-bold text-foreground">
            Showing <span className="text-primary">{filteredLeads.length}</span> verified enquiries
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">User Name &amp; Contact</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Target Course &amp; College</th>
                <th className="p-3.5">Enquiry Type</th>
                <th className="p-3.5">Parent Contact</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Submitted</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-foreground">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground text-xs">
                    No enquiries found matching your active filters.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    {/* 1. Name & Contact */}
                    <td className="p-3.5">
                      <div className="font-bold text-foreground">{item.studentName}</div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        <span>{item.phone}</span>
                      </div>
                      {item.email && (
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <span className="truncate max-w-[140px]">{item.email}</span>
                        </div>
                      )}
                    </td>

                    {/* 2. Location */}
                    <td className="p-3.5">
                      {item.district || item.state ? (
                        <div className="text-xs font-medium">
                          {item.district ? `${item.district}, ` : ""}
                          {item.state || ""}
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-[11px]">Not provided</span>
                      )}
                    </td>

                    {/* 3. Course & College */}
                    <td className="p-3.5">
                      <div className="font-bold text-primary line-clamp-1">
                        {item.targetCollege?.name || "General Admissions Desk"}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                        {item.targetCourse || item.targetStream}
                      </div>
                    </td>

                    {/* 4. Enquiry Type */}
                    <td className="p-3.5">
                      {item.ctaType === LeadCtaType.DOWNLOAD_BROCHURE ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                          <FileText className="w-3 h-3" />
                          <span>Brochure</span>
                        </span>
                      ) : item.ctaType === LeadCtaType.APPLY_NOW ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20">
                          <Send className="w-3 h-3" />
                          <span>Apply Now</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20">
                          {item.ctaType.replace(/_/g, " ")}
                        </span>
                      )}
                    </td>

                    {/* 5. Parent Phone */}
                    <td className="p-3.5">
                      {item.parentPhone ? (
                        <div className="font-semibold text-xs flex items-center gap-1">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <span>{item.parentPhone}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-[11px]">-</span>
                      )}
                    </td>

                    {/* 6. Pipeline Status Dropdown */}
                    <td className="p-3.5">
                      <select
                        value={item.status}
                        disabled={updatingId === item.id}
                        onChange={(e) => handleStatusChange(item.id, e.target.value as LeadStatus)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border outline-hidden cursor-pointer ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        <option value={LeadStatus.NEW}>New</option>
                        <option value={LeadStatus.CONTACTED}>Contacted</option>
                        <option value={LeadStatus.ASSIGNED_TO_COUNSELOR}>Assigned Counselor</option>
                        <option value={LeadStatus.APPLICATION_SUBMITTED}>Applied</option>
                        <option value={LeadStatus.ENROLLED}>Enrolled</option>
                        <option value={LeadStatus.INVALID}>Invalid</option>
                      </select>
                    </td>

                    {/* 7. Submission Date */}
                    <td className="p-3.5 text-muted-foreground text-[11px] whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                      <div className="text-[10px] opacity-75">
                        {new Date(item.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>

                    {/* 8. Action */}
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLead(item);
                          setNotesDraft(item.counselorNotes || "");
                        }}
                        className="px-2.5 py-1 rounded-lg border hover:bg-muted text-[11px] font-bold text-foreground transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-primary" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details & Notes Drawer Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-card border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Enquiry ID: {selectedLead.id.slice(0, 8)}...
                </span>
                <h3 className="font-extrabold text-base text-foreground">
                  {selectedLead.studentName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/30 border">
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-bold block">
                    Student Phone
                  </span>
                  <span className="font-bold text-foreground">{selectedLead.phone}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-bold block">
                    Parent Phone
                  </span>
                  <span className="font-bold text-foreground">
                    {selectedLead.parentPhone || "Not provided"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-bold block">
                    Email
                  </span>
                  <span className="font-medium text-foreground">{selectedLead.email || "-"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase font-bold block">
                    Home Location
                  </span>
                  <span className="font-medium text-foreground">
                    {selectedLead.district ? `${selectedLead.district}, ` : ""}
                    {selectedLead.state || "Not provided"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Target College &amp; Program
                </span>
                <p className="font-bold text-sm text-primary">
                  {selectedLead.targetCollege?.name || "General Admissions Desk"}
                </p>
                <p className="text-xs font-semibold text-foreground">
                  Course: {selectedLead.targetCourse || selectedLead.targetStream}
                </p>
                <div className="pt-1 text-[11px] text-muted-foreground flex items-center gap-2">
                  <span>Enquiry Type: <strong>{selectedLead.ctaType}</strong></span>
                  <span>•</span>
                  <span>
                    Received:{" "}
                    <strong>{new Date(selectedLead.createdAt).toLocaleString("en-IN")}</strong>
                  </span>
                </div>
              </div>

              {/* Counselor Notes Editor */}
              <div className="space-y-1.5 pt-2 border-t">
                <label className="block text-xs font-bold text-foreground">
                  Counselor Follow-up Notes
                </label>
                <textarea
                  rows={3}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Record conversation outcome, fee discussion, preferred branch, or next calling time..."
                  className="w-full p-2.5 text-xs border rounded-xl bg-background outline-hidden focus:border-primary font-medium"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={updatingId === selectedLead.id}
                  className="px-4 py-1.5 rounded-lg font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
                  style={{ background: "#1a3068" }}
                >
                  {updatingId === selectedLead.id ? "Saving Notes..." : "Save Counselor Notes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

