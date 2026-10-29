"use client";

import { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  Clock, 
  Award, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { LeadStatus, LeadCtaType } from "@prisma/client";

export interface LeadItem {
  id: string;
  studentName: string;
  phone: string;
  email: string;
  city?: string | null;
  state?: string | null;
  targetStream: string;
  targetDegree?: string | null;
  examRankInfo?: string | null;
  targetCollege?: { name: string; slug: string } | null;
  sourceBlog?: { title: string; slug: string } | null;
  ctaType: LeadCtaType;
  status: LeadStatus;
  counselorNotes?: string | null;
  createdAt: Date | string;
}

interface LeadCrmKanbanProps {
  initialLeads: LeadItem[];
}

export function LeadCrmKanban({ initialLeads }: LeadCrmKanbanProps) {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [notes, setNotes] = useState("");

  const stages: Array<{ key: LeadStatus; label: string; color: string }> = [
    { key: LeadStatus.NEW, label: "Fresh Inquiries", color: "border-blue-500" },
    { key: LeadStatus.OTP_VERIFIED, label: "OTP Verified", color: "border-emerald-500" },
    { key: LeadStatus.ASSIGNED_TO_COUNSELOR, label: "Counselor Assigned", color: "border-purple-500" },
    { key: LeadStatus.CONTACTED, label: "Under Discussion", color: "border-amber-500" },
    { key: LeadStatus.APPLICATION_SUBMITTED, label: "Form Submitted", color: "border-indigo-500" },
    { key: LeadStatus.ENROLLED, label: "Final Admission", color: "border-emerald-600" },
  ];

  const updateStatus = (leadId: string, nextStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: nextStatus } : l))
    );
  };

  return (
    <div className="space-y-6">
      {/* Kanban Board Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 touch-scroll scrollbar-none">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.key);

          return (
            <div
              key={stage.key}
              className={`w-72 shrink-0 bg-muted/40 rounded-xl border-t-4 ${stage.color} border-x border-b p-3 flex flex-col max-h-[75vh]`}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="font-bold text-xs text-foreground">{stage.label}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-background border text-muted-foreground">
                  {stageLeads.length}
                </span>
              </div>

              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => {
                      setSelectedLead(lead);
                      setNotes(lead.counselorNotes || "");
                    }}
                    className="p-3.5 rounded-xl bg-card border hover:shadow-md transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-start justify-between">
                      <h5 className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                        {lead.studentName}
                      </h5>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {lead.ctaType.replace("_", " ")}
                      </span>
                    </div>

                    <div className="text-[11px] text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        <span>{lead.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3 h-3 text-muted-foreground" />
                        <span className="truncate">
                          {lead.targetCollege?.name || "General Counseling Desk"}
                        </span>
                      </div>
                      {lead.examRankInfo && (
                        <div className="flex items-center gap-1.5 text-amber-600 font-semibold">
                          <Award className="w-3 h-3" />
                          <span>{lead.examRankInfo}</span>
                        </div>
                      )}
                    </div>

                    {lead.sourceBlog && (
                      <div className="pt-1.5 border-t text-[10px] text-muted-foreground flex items-center gap-1 truncate">
                        <FileText className="w-3 h-3 shrink-0 text-blue-500" />
                        <span className="truncate">Attributed: {lead.sourceBlog.title}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Lead Drawer/Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-lg bg-background rounded-2xl border p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  Lead Profile #{selectedLead.id.slice(0, 8)}
                </span>
                <h3 className="font-bold text-lg text-foreground mt-1">
                  {selectedLead.studentName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground block">Phone</span>
                <span className="font-semibold text-foreground">{selectedLead.phone}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Email</span>
                <span className="font-semibold text-foreground">{selectedLead.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Target College</span>
                <span className="font-semibold text-foreground">
                  {selectedLead.targetCollege?.name || "General Counseling"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Stream & Exam Rank</span>
                <span className="font-semibold text-foreground">
                  {selectedLead.targetStream} {selectedLead.examRankInfo ? `(${selectedLead.examRankInfo})` : ""}
                </span>
              </div>
            </div>

            {/* Change Pipeline Stage */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Move Pipeline Stage
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {stages.map((st) => (
                  <button
                    key={st.key}
                    onClick={() => updateStatus(selectedLead.id, st.key)}
                    className={`py-1.5 px-2 rounded-lg border text-center font-semibold transition-all ${
                      selectedLead.status === st.key
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 hover:bg-accent text-foreground"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Counselor Follow-up Notes */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Counselor Follow-up Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Logged call summary, preferred branch, or financial aid inquiries..."
                className="w-full text-xs border rounded-lg p-3 bg-background outline-hidden focus:border-primary"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

