import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { constructSeoMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { BlogCategory } from "@prisma/client";
import { User, Radio } from "lucide-react";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ cat: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { cat } = await params;
  const normalizedCategory = cat.replace(/-/g, "_").toUpperCase();

  return constructSeoMetadata({
    title: `${cat.replace(/-/g, " ").toUpperCase()} - AdmissionsHub News`,
    description: `Latest articles, cutoff analyses, and official updates for ${cat.replace(/-/g, " ")}.`,
    canonicalPath: `/blog/category/${cat}`,
  });
}

export default async function BlogCategoryPage({ params }: CategoryPageProps) {
  const { cat } = await params;
  const normalizedCategory = cat.replace(/-/g, "_").toUpperCase();

  const posts = await db.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      category: normalizedCategory as BlogCategory,
    },
    orderBy: { publishedAt: "desc" },
    include: {
      author: { select: { name: true } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blog" },
          { label: cat.replace(/-/g, " ").toUpperCase() },
        ]}
      />

      <div className="border-b pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground capitalize">
          {cat.replace(/-/g, " ")} Articles
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Showing {posts.length} verified news and editorial analyses in this category.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-2xl border bg-card hover:shadow-md transition-all p-6 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <Link href={`/blog/${post.slug}`}>
                <h3 className="font-bold text-base text-foreground hover:text-primary transition-colors">
                  {post.title}
                </h3>
              </Link>
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {post.metaDescription || (post.tldrSummary && post.tldrSummary[0]) || ""}
              </p>
            </div>

            <div className="pt-4 border-t mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>{post.author.name}</span>
              <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

