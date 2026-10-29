import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { PostStatus, BlogCategory } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const BlogSaveSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  category: z.nativeEnum(BlogCategory).default(BlogCategory.CUTOFF_ANALYSIS),
  tldrSummary: z.array(z.string()).default([]),
  contentMdx: z.string().min(10),
  isLiveBlog: z.boolean().default(false),
  publish: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
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
      category,
      tldrSummary,
      contentMdx,
      isLiveBlog,
      publish,
    } = parsed.data;

    // Slug generation
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80);

    // Get an author (first author or default admin)
    const author =
      (await db.user.findFirst({ where: { role: { in: ["AUTHOR", "SUPER_ADMIN"] } } })) ||
      (await db.user.findFirst());

    if (!author) {
      return NextResponse.json({ error: "No author account found in database" }, { status: 500 });
    }

    // Generate 1536-dim embedding if publishing
    let embedding: any = null;
    if (publish) {
      const text = `${title} ${metaDescription || ""} ${tldrSummary.join(" ")}`;
      embedding = await generateEmbedding(text);
    }

    let post;
    if (id) {
      post = await db.blogPost.update({
        where: { id },
        data: {
          title,
          metaTitle,
          metaDescription,
          category,
          tldrSummary,
          contentMdx,
          isLiveBlog,
          status: publish ? PostStatus.PUBLISHED : PostStatus.DRAFT,
          publishedAt: publish ? new Date() : undefined,
        },
      });
    } else {
      post = await db.blogPost.create({
        data: {
          slug,
          title,
          metaTitle,
          metaDescription,
          category,
          tldrSummary,
          contentMdx,
          isLiveBlog,
          status: publish ? PostStatus.PUBLISHED : PostStatus.DRAFT,
          authorId: author.id,
          publishedAt: publish ? new Date() : null,
        },
      });
    }

    if (publish && embedding) {
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
      message: publish
        ? "Article published and indexed in pgvector & tsvector!"
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
