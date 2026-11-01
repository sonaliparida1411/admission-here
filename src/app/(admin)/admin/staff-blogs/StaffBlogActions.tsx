"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, EyeOff, CheckCircle } from "lucide-react";

interface StaffBlogActionsProps {
  postId: string;
  status: string;
  canPublish: boolean;
  canDelete: boolean;
}

export function StaffBlogActions({
  postId,
  status,
  canPublish,
  canDelete,
}: StaffBlogActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/cms/blogs/${postId}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete post");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async () => {
    const newStatus = status === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED";
    const label = status === "PUBLISHED" ? "Unpublish" : "Publish";
    if (!confirm(`${label} this post?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/cms/blogs/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          ...(newStatus === "PUBLISHED" ? { publishedAt: new Date().toISOString() } : {}),
        }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update post");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {canPublish && (
        <button
          onClick={handleTogglePublish}
          disabled={loading}
          title={status === "PUBLISHED" ? "Unpublish" : "Publish"}
          className="p-1.5 rounded-lg border hover:bg-accent text-muted-foreground disabled:opacity-50"
        >
          {status === "PUBLISHED" ? (
            <EyeOff className="w-3.5 h-3.5 text-amber-600" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          )}
        </button>
      )}

      {canDelete && (
        <button
          onClick={handleDelete}
          disabled={loading}
          title="Delete Post"
          className="p-1.5 rounded-lg border hover:bg-red-50 text-red-600 disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </>
  );
}

