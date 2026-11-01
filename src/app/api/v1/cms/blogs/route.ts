import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { PostStatus, BlogCategory } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth/config";

const BlogSaveSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  featuredImageUrl: z.string().url().optional().or(z.literal("")),
  category: z.nativeEnum(BlogCategory).default(BlogCategory.CUTOFF_ANALYSIS),
  tags: z.array(z.string()).default([]),
  tldrSummary: z.array(z.string()).default([]),
  contentMdx: z.string().min(10),
  isLiveBlog: z.boolean().default(false),
  publish: z.boolean().default(false),
  authorId: z.string().uuid().optional(), // Admin can override author
});

/** GET — list blogs. SUPER_ADMIN sees all; STAFF sees own. */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user as any;
    const role = user?.role;
    const permissions: string[] = user?.permissions || [];

    // Must be SUPER_ADMIN or STAFF with blogs permission
    if (role !== "SUPER_ADMIN" && !(role === "STAFF" && permissions.includes("blogs"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where =
      role === "STAFF"
        ? { authorId: user.id }
        : undefined;

    const posts = await db.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true, id: true } },
        _count: { select: { generatedLeads: true } },
      },
    });

    return NextResponse.json({ success: true, posts });
  } catch (err: any) {
    console.error("Blog GET error:", err);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

/** POST — create or update a blog post. */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user as any;
    const role = user?.role;
    const permissions: string[] = user?.permissions || [];

    // Auth guard
    if (role !== "SUPER_ADMIN" && !(role === "STAFF" && permissions.includes("blogs"))) {
      return NextResponse.json({ error: "Unauthorized: blogs permission required" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = BlogSaveSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid blog data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      id,
      title,
      metaTitle,
      metaDescription,
      featuredImageUrl,
      category,
      tags,
      tldrSummary,
      contentMdx,
      isLiveBlog,
      publish,
      authorId: overrideAuthorId,
    } = parsed.data;

    // Determine publish permission:
    // SUPER_ADMIN can always publish.
    // STAFF: publish requires explicit "blogs:publish" sub-permission OR the general "blogs" permission.
    const canPublish =
      role === "SUPER_ADMIN" ||
      permissions.includes("blogs:publish") ||
      permissions.includes("blogs");

    const effectivePublish = publish && canPublish;

    // Slug generation
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80);

    // Determine authorId
    let resolvedAuthorId: string;
    if (role === "SUPER_ADMIN" && overrideAuthorId) {
      resolvedAuthorId = overrideAuthorId;
    } else if (user?.id) {
      resolvedAuthorId = user.id;
    } else {
      // Fallback for dev without session
      const fallbackAuthor =
        (await db.user.findFirst({ where: { role: { in: ["AUTHOR", "SUPER_ADMIN"] } } })) ||
        (await db.user.findFirst());
      if (!fallbackAuthor) {
        return NextResponse.json({ error: "No author account found in database" }, { status: 500 });
      }
      resolvedAuthorId = fallbackAuthor.id;
    }

    // If STAFF is editing, verify they own the post
    if (id && role === "STAFF") {
      const existing = await db.blogPost.findUnique({ where: { id }, select: { authorId: true } });
      if (!existing) {
        return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
      }
      if (existing.authorId !== user.id) {
        return NextResponse.json(
          { error: "Forbidden: you can only edit your own blog posts" },
          { status: 403 }
        );
      }
    }

    // Generate embedding if publishing
    let embedding: any = null;
    if (effectivePublish) {
      const text = `${title} ${metaDescription || ""} ${tldrSummary.join(" ")}`;
      embedding = await generateEmbedding(text);
    }

    let post;
    const postData = {
      title,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      featuredImageUrl: featuredImageUrl || null,
      category,
      tags,
      tldrSummary,
      contentMdx,
      isLiveBlog,
      status: effectivePublish ? PostStatus.PUBLISHED : PostStatus.DRAFT,
      publishedAt: effectivePublish ? new Date() : undefined,
    };

    if (id) {
      post = await db.blogPost.update({ where: { id }, data: postData });
    } else {
      post = await db.blogPost.create({
        data: {
          slug,
          ...postData,
          publishedAt: effectivePublish ? new Date() : null,
          authorId: resolvedAuthorId,
        },
      });
    }

    // Store vector embedding
    if (effectivePublish && embedding) {
      try {
        await db.$executeRaw`
          UPDATE "BlogPost" 
          SET embedding = ${embedding}::vector 
          WHERE id = ${post.id}::uuid
        `;
      } catch (embErr) {
        console.warn("Vector embedding storage note:", embErr);
      }
    }

    // Revalidate public caches
    try {
      revalidatePath("/blog");
      revalidatePath(`/blog/${post.slug}`);
      revalidatePath("/sitemap.xml");
      revalidatePath("/llms.txt");
    } catch (e) {
      console.warn("Revalidation warning:", e);
    }

    return NextResponse.json({
      success: true,
      post,
      message: effectivePublish
        ? "Article published and indexed!"
        : publish && !canPublish
        ? "Draft saved. You don't have publish permission — ask the admin to publish."
        : "Draft saved successfully.",
    });
  } catch (err: any) {
    console.error("CMS blog save error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to save blog post" },
      { status: 500 }
    );
  }
}
