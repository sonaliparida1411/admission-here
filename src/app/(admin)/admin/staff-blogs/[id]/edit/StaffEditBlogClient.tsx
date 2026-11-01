"use client";

import { useRouter } from "next/navigation";
import { BlogMdxEditor } from "@/components/admin/BlogMdxEditor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  post: {
    id: string;
    title: string;
    metaTitle?: string;
    metaDescription?: string;
    featuredImageUrl?: string;
    tldrSummary: string[];
    contentMdx: string;
    category: string;
    tags: string[];
    isLiveBlog: boolean;
  };
  canPublish: boolean;
}

export function StaffEditBlogClient({ post, canPublish }: Props) {
  const router = useRouter();

  const handleSave = async (data: any, isPublish: boolean) => {
    const res = await fetch("/api/v1/cms/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, id: post.id, publish: isPublish }),
    });

    const json = await res.json();

    if (res.ok) {
      if (json.message?.includes("Draft saved") && isPublish) {
        alert(json.message);
      }
      router.push("/admin/staff-blogs");
    } else {
      alert(json.error || "Failed to update article");
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
          <h1 className="text-2xl font-extrabold text-foreground">Edit Blog Article</h1>
          <p className="text-xs text-muted-foreground">
            Edit your blog post. Changes are saved immediately on submit.
          </p>
        </div>
      </div>

      <BlogMdxEditor
        initialData={{
          id: post.id,
          title: post.title,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          featuredImageUrl: post.featuredImageUrl,
          tldrSummary: post.tldrSummary,
          contentMdx: post.contentMdx,
          category: post.category,
          tags: post.tags,
          isLiveBlog: post.isLiveBlog,
        }}
        canPublish={canPublish}
        onSave={handleSave}
      />
    </div>
  );
}

