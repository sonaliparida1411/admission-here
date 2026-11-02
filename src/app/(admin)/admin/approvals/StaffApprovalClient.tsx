"use client";

import { useState } from "react";
import { 
  CheckSquare, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileEdit, 
  Building2, 
  User, 
  Calendar, 
  AlertCircle, 
  Eye, 
  MessageSquare, 
  Filter, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  RotateCcw,
  History,
  X
} from "lucide-react";
import { ApprovalStatus, ApprovalActionType } from "@prisma/client";

interface ApprovalItem {
  id: string;
  collegeId?: string | null;
  staffId: string;
  actionType: ApprovalActionType;
  section: string;
  title: string;
  proposedData: any;
  status: ApprovalStatus;
  adminFeedback?: string | null;
  reviewedById?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  staff: {
    id: string;
    name: string;
    email: string;
  };
  college?: {
    id: string;
    name: string;
    slug: string;
    city: string;
    state: string;
  } | null;
  reviewedBy?: {
    id: string;
    name: string;
  } | null;
}

interface ActivityLogItem {
  id: string;
  staffId: string;
  action: string;
  details: string;
  createdAt: string;
  staff: {
    name: string;
    email: string;
  };
}

interface StaffApprovalClientProps {
  initialRequests: ApprovalItem[];
  initialLogs: ActivityLogItem[];
  isSuperAdmin: boolean;
}

export function StaffApprovalClient({
  initialRequests,
  initialLogs,
  isSuperAdmin,
}: StaffApprovalClientProps) {
  const [requests, setRequests] = useState<ApprovalItem[]>(initialRequests);
  const [logs, setLogs] = useState<ActivityLogItem[]>(initialLogs);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [previewItem, setPreviewItem] = useState<ApprovalItem | null>(null);
  const [reviewActionModal, setReviewActionModal] = useState<{
    item: ApprovalItem;
    action: "APPROVE" | "REJECT" | "REQUEST_REVISION";
  } | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredRequests = requests.filter((req) => {
    if (statusFilter === "ALL") return true;
    return req.status === statusFilter;
  });

  const pendingCount = requests.filter((r) => r.status === ApprovalStatus.PENDING).length;

  const handleReviewAction = async () => {
    if (!reviewActionModal) return;
    setProcessing(true);
    setActionSuccess(null);

    try {
      const res = await fetch("/api/v1/admin/approvals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: reviewActionModal.item.id,
          action: reviewActionModal.action,
          adminFeedback: feedbackText,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setActionSuccess(json.message);
        // Update request in local state
        setRequests((prev) =>
          prev.map((r) =>
            r.id === reviewActionModal.item.id
              ? {
                  ...r,
                  status: json.status,
                  adminFeedback: feedbackText || r.adminFeedback,
                }
              : r
          )
        );
        setReviewActionModal(null);
        setPreviewItem(null);
        setFeedbackText("");
      } else {
        alert(json.error || "Failed to process review action");
      }
    } catch (err) {
      console.error(err);
      alert("Network issue while processing approval action.");
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.PENDING:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            <span>Pending Review</span>
          </span>
        );
      case ApprovalStatus.APPROVED:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Published Live</span>
          </span>
        );
      case ApprovalStatus.REJECTED:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/20">
            <XCircle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
        );
      case ApprovalStatus.REVISION_REQUESTED:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/20">
            <RotateCcw className="w-3 h-3" />
            <span>Revision Requested</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Alert banner if pending items exist */}
      {actionSuccess && (
        <div className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button
            onClick={() => setActionSuccess(null)}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-card border rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mr-2">
            Filter Requests:
          </span>
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === "ALL" ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-muted/80"
            }`}
            style={statusFilter === "ALL" ? { background: "#1a3068" } : {}}
          >
            All Requests ({requests.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter(ApprovalStatus.PENDING)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === ApprovalStatus.PENDING ? "bg-amber-600 text-white" : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter(ApprovalStatus.APPROVED)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === ApprovalStatus.APPROVED ? "bg-emerald-600 text-white" : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Approved
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter(ApprovalStatus.REVISION_REQUESTED)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === ApprovalStatus.REVISION_REQUESTED ? "bg-blue-600 text-white" : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Revision Requested
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter(ApprovalStatus.REJECTED)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === ApprovalStatus.REJECTED ? "bg-red-600 text-white" : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Rejected
          </button>
        </div>

        <div className="text-xs font-semibold text-muted-foreground">
          {pendingCount > 0 ? (
            <span className="text-amber-600 font-bold">⚠️ {pendingCount} submissions awaiting your approval</span>
          ) : (
            <span className="text-emerald-600 font-bold">✓ All submissions reviewed</span>
          )}
        </div>
      </div>

      {/* Submissions Queue Table */}
      <div className="bg-card border rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-extrabold text-sm sm:text-base text-foreground flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-primary" />
            <span>Staff Submission &amp; Publishing Queue</span>
          </h2>
          <span className="text-xs font-bold text-muted-foreground">
            {filteredRequests.length} Requests
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Staff Contributor</th>
                <th className="p-3.5">College &amp; Action</th>
                <th className="p-3.5">Section Updated</th>
                <th className="p-3.5">Submission Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-foreground">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground text-xs">
                    No submissions found in this status category.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-foreground">{req.staff.name}</div>
                      <div className="text-[11px] text-muted-foreground">{req.staff.email}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-primary line-clamp-1">
                        {req.college?.name || req.proposedData?.name || "New College Entry"}
                      </div>
                      <div className="text-[10px] uppercase font-bold text-muted-foreground mt-0.5">
                        {req.actionType === ApprovalActionType.CREATE ? "Add New College" : "Update Existing Profile"}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-muted border text-[11px] font-semibold text-foreground">
                        {req.section}
                      </span>
                    </td>

                    <td className="p-3.5 text-muted-foreground text-[11px] whitespace-nowrap">
                      {new Date(req.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="p-3.5">
                      {getStatusBadge(req.status)}
                      {req.adminFeedback && (
                        <div className="text-[10px] text-muted-foreground italic mt-1 line-clamp-1 max-w-[160px]" title={req.adminFeedback}>
                          Note: {req.adminFeedback}
                        </div>
                      )}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewItem(req)}
                          className="px-2.5 py-1 rounded-lg border hover:bg-muted text-[11px] font-bold text-foreground transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-primary" />
                          <span>Preview</span>
                        </button>

                        {isSuperAdmin && req.status === ApprovalStatus.PENDING && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setReviewActionModal({ item: req, action: "APPROVE" });
                                setFeedbackText("Approved and verified for publication.");
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Approve
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setReviewActionModal({ item: req, action: "REJECT" });
                                setFeedbackText("");
                              }}
                              className="px-2 py-1 rounded-lg border border-red-500/30 text-red-600 hover:bg-red-500/10 text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Activity & Publication Audit Log */}
      <div className="bg-card border rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-extrabold text-sm sm:text-base text-foreground flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <span>Staff Activity &amp; Publication History Log</span>
          </h2>
          <span className="text-[11px] text-muted-foreground">Immutable Audit Trail</span>
        </div>

        <div className="divide-y text-xs">
          {logs.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-xs">
              No activity logs recorded yet.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-muted/20 transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{log.staff.name}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-muted border text-muted-foreground">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {log.details}
                  </p>
                </div>

                <div className="text-[10px] text-muted-foreground sm:text-right shrink-0">
                  {new Date(log.createdAt).toLocaleString("en-IN")}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Preview Changes Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-card border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-muted/30">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Proposed Changes Preview
                </span>
                <h3 className="font-extrabold text-base text-foreground">{previewItem.title}</h3>
                <p className="text-xs text-muted-foreground">
                  Submitted by {previewItem.staff.name} on {new Date(previewItem.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-3.5 rounded-xl border bg-muted/20 space-y-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Proposed Metadata &amp; Content Fields
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground text-[10px] block">College Name:</span>
                    <strong className="text-foreground">{previewItem.proposedData?.name || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] block">Slug:</span>
                    <strong className="text-foreground font-mono">{previewItem.proposedData?.slug || "-"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] block">City &amp; State:</span>
                    <strong className="text-foreground">{previewItem.proposedData?.city}, {previewItem.proposedData?.state}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] block">NIRF Rank:</span>
                    <strong className="text-foreground">{previewItem.proposedData?.nirfRank ? `#${previewItem.proposedData.nirfRank}` : "Unranked"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] block">Brochure URL:</span>
                    <strong className="text-foreground truncate block">{previewItem.proposedData?.brochurePdfUrl || "Not attached"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[10px] block">NAAC Grade:</span>
                    <strong className="text-foreground">{previewItem.proposedData?.naacGrade || "N/A"}</strong>
                  </div>
                </div>
              </div>

              {previewItem.proposedData?.overviewHtml && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Institutional Overview Preview:
                  </span>
                  <div
                    className="p-3 rounded-xl border bg-background prose prose-xs max-h-40 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: previewItem.proposedData.overviewHtml }}
                  />
                </div>
              )}

              {previewItem.proposedData?.admissionHtml && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Admission 2026 Guidelines Preview:
                  </span>
                  <div
                    className="p-3 rounded-xl border bg-background prose prose-xs max-h-40 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: previewItem.proposedData.admissionHtml }}
                  />
                </div>
              )}

              {/* JSON Payload viewer for full accuracy */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Raw Proposed Payload:
                </span>
                <pre className="p-3 rounded-xl border bg-muted/40 text-[10px] font-mono max-h-40 overflow-y-auto">
                  {JSON.stringify(previewItem.proposedData, null, 2)}
                </pre>
              </div>

              {/* Action buttons inside preview */}
              {isSuperAdmin && previewItem.status === ApprovalStatus.PENDING && (
                <div className="pt-3 border-t flex flex-wrap gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setReviewActionModal({ item: previewItem, action: "REQUEST_REVISION" });
                      setFeedbackText("");
                    }}
                    className="px-3.5 py-2 rounded-xl border text-xs font-bold text-foreground hover:bg-muted"
                  >
                    Request Revision
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReviewActionModal({ item: previewItem, action: "REJECT" });
                      setFeedbackText("");
                    }}
                    className="px-3.5 py-2 rounded-xl border border-red-500/30 text-red-600 hover:bg-red-500/10 text-xs font-bold"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReviewActionModal({ item: previewItem, action: "APPROVE" });
                      setFeedbackText("Approved and published to public directory.");
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                  >
                    Approve &amp; Publish Live
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Confirmation Modal */}
      {reviewActionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-card border rounded-2xl shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="font-extrabold text-base text-foreground">
              {reviewActionModal.action === "APPROVE"
                ? "Approve & Publish to Public Website"
                : reviewActionModal.action === "REJECT"
                ? "Reject Staff Submission"
                : "Request Revision from Staff"}
            </h3>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {reviewActionModal.action === "APPROVE"
                ? `You are about to publish the changes for "${reviewActionModal.item.title}". The public website will immediately display the approved content.`
                : reviewActionModal.action === "REJECT"
                ? "Rejecting will preserve the currently published website content without applying any of the proposed changes."
                : "Enter guidance notes for the staff member so they can make the necessary corrections and resubmit."}
            </p>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Admin Feedback / Revision Note (Optional):
              </label>
              <textarea
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="e.g. Approved fee updates, or: please upload high-res brochure PDF..."
                className="w-full p-2.5 text-xs border rounded-xl bg-background outline-hidden focus:border-primary font-medium"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setReviewActionModal(null)}
                className="px-4 py-2 rounded-xl border text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={processing}
                onClick={handleReviewAction}
                className={`px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs transition-colors ${
                  reviewActionModal.action === "APPROVE"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : reviewActionModal.action === "REJECT"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {processing ? "Processing..." : "Confirm Decision"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

