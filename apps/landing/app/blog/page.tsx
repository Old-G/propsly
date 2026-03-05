import type { Metadata } from "next";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "@/components/blog/blog-card";

export const metadata: Metadata = {
  title: "Blog — Propsly",
  description:
    "Tips, strategies, and insights on proposals, pricing, and growing your freelance or agency business.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[var(--content-max-width)] pt-32 pb-20 px-6">
        <h1 className="heading-display text-4xl sm:text-5xl mb-4">Blog</h1>
        <p className="text-[var(--text-secondary)] text-lg mb-12">
          Insights on proposals, pricing, and winning more clients.
        </p>

        {posts.length === 0 && (
          <p className="text-[var(--text-tertiary)]">No posts yet. Check back soon.</p>
        )}

        {posts.length > 0 && (
          <div className="space-y-6">
            <BlogCard post={posts[0]} featured />

            {posts.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.slice(1).map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
