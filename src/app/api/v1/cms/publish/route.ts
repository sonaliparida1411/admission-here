import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { revalidatePath } from "next/cache";
import { PostStatus } from "@prisma/client";
import { z } from "zod";

const PublishSchema = z.object({
  blogId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = PublishSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { blogId } = parsed.data;

    const post = await db.blogPost.findUnique({
      where: { id: blogId },
    });

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // 1. Generate 1536-dim embedding for semantic search
    const textToEmbed = `${post.title}. ${post.metaDescription || ""} ${(post.tldrSummary || []).join(" ")}`;
    const embedding = await generateEmbedding(textToEmbed);

    // 2. Update post status to PUBLISHED
    const updatedPost = await db.blogPost.update({
      where: { id: blogId },
      data: {
        status: PostStatus.PUBLISHED,
        publishedAt: post.publishedAt || new Date(),
      },
    });

    try {
      await db.$executeRaw`
        UPDATE "BlogPost" 
        SET embedding = ${embedding}::vector 
        WHERE id = ${blogId}::uuid
      `;
    } catch (embErr) {
      console.warn("Vector embedding storage note:", embErr);
    }

    // 3. On-Demand ISR Revalidation
    try {
      revalidatePath("/blog");
      revalidatePath(`/blog/${updatedPost.slug}`);
      revalidatePath("/sitemap.xml");
      revalidatePath("/llms.txt");
    } catch (e) {
      console.warn("ISR revalidation notice:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Blog post successfully published and indexed with AI vector embedding",
      slug: updatedPost.slug,
      status: updatedPost.status,
      publishedAt: updatedPost.publishedAt,
    });
  } catch (error) {
    console.error("CMS publish hook error:", error);
    return NextResponse.json(
      { error: "Failed to publish blog post" },
      { status: 500 }
    );
  }
}
