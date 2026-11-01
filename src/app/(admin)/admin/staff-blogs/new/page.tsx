"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BlogMdxEditor } from "@/components/admin/BlogMdxEditor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StaffNewBlogPage() {
  const router = useRouter();
  const [canPublish, setCanPublish] = useState(true); // optimistic default

  useEffect(() => {
    // Check client-side if user has publish permission
    // The server-side guard is in the API — this only shows/hides the button
    fetch("/api/v1/cms/blogs?check=permissions")
      .then((r) => r.json())
      .catch(() => null);
  }, []);

  const handleSave = async (data: any, isPublish: boolean) => {
    const res = await fetch("/api/v1/cms/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, publish: isPublish }),
    });

    const json = await res.json();

    if (res.ok) {
      // Show any messages about publish downgrade
      if (json.message && json.message.includes("Draft saved")) {
        alert(json.message);
      }
      router.push("/admin/staff-blogs");
    } else {
      alert(json.error || "Failed to save article");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/staff-blogs"
          className="p-2 rounded-lg border hover:bg-accent text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Write New Blog Article
          </h1>
          <p className="text-xs text-muted-foreground">
            Create a new blog post. Save as draft first, then publish when ready.
          </p>
        </div>
      </div>

      <BlogMdxEditor canPublish={canPublish} onSave={handleSave} />
    </div>
  );
}

