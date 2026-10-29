"use client";

import { useState } from "react";
import { Star, ShieldCheck, CheckCircle2, XCircle, ThumbsUp, ThumbsDown } from "lucide-react";

export function ReviewModerationClient({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleModerate = async (reviewId: string, status: "APPROVED" | "REJECTED") => {
    setLoadingId(reviewId);
    try {
      const res = await fetch("/api/v1/cms/reviews/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, status }),
      });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, moderationStatus: status, isVerified: status === "APPROVED" } : r
          )
        );
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.id} className="p-4 sm:p-6 rounded-2xl border bg-card shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {r.college.name}
              </span>
              <h3 className="font-bold text-base text-foreground mt-1">{r.title}</h3>
              <p className="text-xs text-muted-foreground">
                Author: {r.user.name} ({r.user.email}) • {r.courseName} (Class of {r.batchYear})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-700">
                ★ {r.ratingOverall.toFixed(1)}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  r.moderationStatus === "APPROVED"
                    ? "bg-emerald-100 text-emerald-800"
                    : r.moderationStatus === "REJECTED"
                    ? "bg-red-100 text-red-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {r.moderationStatus}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <strong className="text-emerald-700 flex items-center gap-1 mb-1">
                <ThumbsUp className="w-3.5 h-3.5" /> Pros:
              </strong>
              <p className="text-foreground/90">{r.prosText}</p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20">
              <strong className="text-red-700 flex items-center gap-1 mb-1">
                <ThumbsDown className="w-3.5 h-3.5" /> Cons:
              </strong>
              <p className="text-foreground/90">{r.consText}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t text-xs">
            <span className="text-[11px] text-muted-foreground">
              Submitted: {new Date(r.createdAt).toLocaleDateString()}
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={loadingId === r.id || r.moderationStatus === "REJECTED"}
                onClick={() => handleModerate(r.id, "REJECTED")}
                className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-600 hover:bg-red-500/10 font-bold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
              <button
                disabled={loadingId === r.id || r.moderationStatus === "APPROVED"}
                onClick={() => handleModerate(r.id, "APPROVED")}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Review</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

