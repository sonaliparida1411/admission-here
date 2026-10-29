import Link from "next/link";
import { db } from "@/lib/db";
import { Plus, Edit, Eye, Radio, Sparkles } from "lucide-react";
import { checkAdminAccess } from "@/lib/auth/staff-guard";
import { StaffAccessDenied } from "@/components/admin/StaffAccessDenied";

export const revalidate = 0;

export default async function AdminBlogsPage() {
  const access = await checkAdminAccess("blogs");
  if (!access.allowed) {
    return (
      <StaffAccessDenied
        featureName="Editorial Blog CMS"
        allowedFeatures={access.permissions}
      />
    );
  }

  const posts = await db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      _count: { select: { generatedLeads: true } },
    },
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Editorial Blog CMS Desk
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Publish GEO-optimized exam guides, cutoff breakdowns, live tickers, and manage inline college CTAs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/blogs/new"
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:bg-primary/90 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </Link>
        </div>
      </div>

      <div className="bg-card border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto touch-scroll">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Title & Slug</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">Status</th>
                <th className="p-4">Reads</th>
                <th className="p-4">Leads Generated</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-foreground">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 max-w-sm">
                    <div className="font-bold text-sm text-foreground line-clamp-1">
                      {post.title}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-muted-foreground font-mono">
                        /blog/{post.slug}
                      </span>
                      {post.isLiveBlog && (
                        <span className="text-[10px] font-extrabold text-red-600 flex items-center gap-0.5">
                          <Radio className="w-3 h-3 animate-pulse" /> LIVE
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[10px]">
                      {post.category.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4">{post.author.name}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        post.status === "PUBLISHED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4 font-semibold">{post.viewCount.toLocaleString()}</td>
                  <td className="p-4 font-bold text-blue-600">
                    {post._count.generatedLeads} leads
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg border hover:bg-accent text-muted-foreground"
                        title="View Live Article"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/blogs/${post.id}/edit`}
                        className="px-2.5 py-1.5 rounded-lg border bg-background hover:bg-accent text-foreground font-semibold flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

