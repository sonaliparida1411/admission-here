import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { checkAdminAccess } from "@/lib/auth/staff-guard";
import { auth } from "@/lib/auth/config";
import { StaffEditBlogClient } from "./StaffEditBlogClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StaffEditBlogPage({ params }: Props) {
  const { id } = await params;

  const access = await checkAdminAccess("blogs");
  if (!access.allowed) redirect("/admin/staff-blogs");

  const session = await auth();
  const user = session?.user as any;
  const permissions: string[] = user?.permissions || [];

  const post = await db.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  // STAFF may only edit their own posts
  if (!access.isSuperAdmin && post.authorId !== user?.id) {
    redirect("/admin/staff-blogs");
  }

  const canPublish =
    access.isSuperAdmin ||
    permissions.includes("blogs:publish") ||
    permissions.includes("blogs");

  return (
    <StaffEditBlogClient
      post={{
        id: post.id,
        title: post.title,
        metaTitle: post.metaTitle ?? undefined,
        metaDescription: post.metaDescription ?? undefined,
        featuredImageUrl: post.featuredImageUrl ?? undefined,
        tldrSummary: post.tldrSummary,
        contentMdx: post.contentMdx,
        category: post.category,
        tags: post.tags,
        isLiveBlog: post.isLiveBlog,
      }}
      canPublish={canPublish}
    />
  );
}

