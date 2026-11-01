import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PostStatus, BlogCategory } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth/config";

const BlogPatchSchema = z.object({
  title: z.string().min(3).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  featuredImageUrl: z.string().optional(),
  category: z.nativeEnum(BlogCategory).optional(),
  tags: z.array(z.string()).optional(),
  tldrSummary: z.array(z.string()).optional(),
  contentMdx: z.string().min(10).optional(),
  isLiveBlog: z.boolean().optional(),
  status: z.nativeEnum(PostStatus).optional(),
  authorId: z.string().uuid().optional(),
});

async function getSessionUser() {
  const session = await auth();
  return session?.user as any;
}

function hasPermission(user: any, permission: string) {
  if (!user) return false;
  if (user.role === "SUPER_ADMIN") return true;
  const perms: string[] = user.permissions || [];
  return perms.includes(permission);
}

/** PATCH — partial update of a blog post */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSessionUser();

    if (!hasPermission(user, "blogs")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch existing post for ownership check
    const existing = await db.blogPost.findUnique({
      where: { id },
      select: { authorId: true, slug: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // STAFF can only edit own posts
    if (user.role === "STAFF" && existing.authorId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: you can only edit your own posts" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = BlogPatchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updateData: any = { ...parsed.data };

    // Only SUPER_ADMIN can change author
    if (user.role !== "SUPER_ADMIN") {
      delete updateData.authorId;
    }

    // Permission to publish
    const canPublish =
      user.role === "SUPER_ADMIN" ||
      (user.permissions || []).includes("blogs:publish") ||
      (user.permissions || []).includes("blogs");

    if (
      updateData.status === PostStatus.PUBLISHED &&
      !canPublish
    ) {
      updateData.status = PostStatus.DRAFT;
    }

    if (updateData.status === PostStatus.PUBLISHED && !existing.slug) {
      updateData.publishedAt = new Date();
    }

    const post = await db.blogPost.update({ where: { id }, data: updateData });

    try {
      revalidatePath("/blog");
      revalidatePath(`/blog/${post.slug}`);
    } catch {
      /* ignore */
    }

    return NextResponse.json({ success: true, post });
  } catch (err: any) {
    console.error("Blog PATCH error:", err);
    return NextResponse.json({ error: err.message || "Failed to update post" }, { status: 500 });
  }
}

/** DELETE — remove a blog post */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSessionUser();

    if (!hasPermission(user, "blogs")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await db.blogPost.findUnique({
      where: { id },
      select: { authorId: true, slug: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // STAFF: only delete own posts; also need blogs:delete sub-permission
    if (user.role === "STAFF") {
      const perms: string[] = user.permissions || [];
      if (existing.authorId !== user.id) {
        return NextResponse.json(
          { error: "Forbidden: you can only delete your own posts" },
          { status: 403 }
        );
      }
      if (!perms.includes("blogs:delete") && !perms.includes("blogs")) {
        return NextResponse.json(
          { error: "Forbidden: blogs:delete permission required" },
          { status: 403 }
        );
      }
    }

    await db.blogPost.delete({ where: { id } });

    try {
      revalidatePath("/blog");
      revalidatePath(`/blog/${existing.slug}`);
    } catch {
      /* ignore */
    }

    return NextResponse.json({ success: true, message: "Blog post deleted." });
  } catch (err: any) {
    console.error("Blog DELETE error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete post" }, { status: 500 });
  }
}

