import type { Metadata } from "next";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { getPaginatedPosts, POSTS_PER_PAGE } from "@/lib/blog";
import { BlogList } from "@/components/blog/blog-list";

export const metadata: Metadata = {
  title: "Blog — Propsly",
  description:
    "Tips, strategies, and insights on proposals, pricing, and growing your freelance or agency business.",
};

export const revalidate = 60;

export default async function BlogPage() {
  const { posts, hasMore } = await getPaginatedPosts(0, POSTS_PER_PAGE);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[var(--content-max-width)] pt-32 pb-20 px-6">
        <h1 className="heading-display text-4xl sm:text-5xl mb-4">Blog</h1>
        <p className="text-[var(--text-secondary)] text-lg mb-12">
          Insights on proposals, pricing, and winning more clients.
        </p>

        <BlogList initialPosts={posts} initialHasMore={hasMore} />
      </main>
      <Footer />
    </>
  );
}
