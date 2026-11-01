"use client";

import { useRouter } from "next/navigation";
import { BlogMdxEditor } from "@/components/admin/BlogMdxEditor";

export function EditBlogClient({ post }: { post: any }) {
  const router = useRouter();

  const handleSave = async (data: any, isPublish: boolean) => {
    const res = await fetch("/api/v1/cms/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, id: post.id, publish: isPublish }),
    });

    if (res.ok) {
      router.push("/admin/blogs");
    } else {
      const json = await res.json();
      alert(json.error || "Failed to update article");
    }
  };

  return (
    <BlogMdxEditor
      initialData={{
        id: post.id,
        title: post.title,
        metaTitle: post.metaTitle || undefined,
        metaDescription: post.metaDescription || undefined,
        featuredImageUrl: post.featuredImageUrl || undefined,
        tldrSummary: post.tldrSummary || [],
        contentMdx: post.contentMdx,
        category: post.category,
        tags: post.tags || [],
        isLiveBlog: post.isLiveBlog,
      }}
      canPublish={true}
      onSave={handleSave}
    />
  );
}


