"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Eye, Edit, EyeOff, CheckCircle } from "lucide-react";
import Link from "next/link";

interface AdminCollegeActionsProps {
  collegeId: string;
  collegeSlug: string;
  isPublished: boolean;
  collegeName: string;
}

export function AdminCollegeActions({
  collegeId,
  collegeSlug,
  isPublished,
  collegeName,
}: AdminCollegeActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleTogglePublish = async () => {
    const nextState = !isPublished;
    const action = nextState ? "publish" : "unpublish";
    if (!confirm(`Are you sure you want to ${action} "${collegeName}"?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/v1/cms/colleges/${collegeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: nextState }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const json = await res.json();
        alert(json.error || `Failed to ${action} college.`);
      }
    } catch {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete "${collegeName}"? This will remove all associated course mappings and stats.`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/v1/cms/colleges/${collegeId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const json = await res.json();
        alert(json.error || "Failed to delete college.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      {/* View Public Profile */}
      <Link
        href={`/college/${collegeSlug}`}
        target="_blank"
        className="p-1.5 rounded-lg border hover:bg-accent text-muted-foreground transition-colors"
        title="View Live Public Profile"
      >
        <Eye className="w-3.5 h-3.5" />
      </Link>

      {/* Edit College Details */}
      <Link
        href={`/admin/colleges/${collegeId}/edit`}
        className="px-2.5 py-1.5 rounded-lg border bg-background hover:bg-accent text-foreground font-semibold flex items-center gap-1 transition-colors"
        title="Edit Profile, Courses, Fees & Facilities"
      >
        <Edit className="w-3.5 h-3.5" />
        <span>Edit</span>
      </Link>

      {/* Publish / Unpublish Toggle */}
      <button
        type="button"
        disabled={loading}
        onClick={handleTogglePublish}
        title={isPublished ? "Unpublish profile (hide from public)" : "Publish profile to public"}
        className="p-1.5 rounded-lg border hover:bg-accent text-muted-foreground disabled:opacity-50 transition-colors cursor-pointer"
      >
        {isPublished ? (
          <EyeOff className="w-3.5 h-3.5 text-amber-600" />
        ) : (
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
        )}
      </button>

      {/* Delete College */}
      <button
        type="button"
        disabled={loading}
        onClick={handleDelete}
        title="Delete Institutional Profile"
        className="p-1.5 rounded-lg border hover:bg-red-50 text-red-600 disabled:opacity-50 transition-colors cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

