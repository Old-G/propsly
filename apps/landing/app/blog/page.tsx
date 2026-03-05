import type { Metadata } from "next";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { getPaginatedPosts, POSTS_PER_PAGE } from "@/lib/blog";
import { BlogList } from "@/components/blog/blog-list";
import { blogSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, strategies, and insights on proposals, pricing, and growing your freelance or agency business.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog — Propsly",
    description:
      "Tips, strategies, and insights on proposals, pricing, and growing your business.",
    images: [
      {
        url: "/og?title=Blog&description=Insights+on+proposals,+pricing,+and+winning+more+clients",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    images: ["/og?title=Blog&description=Insights+on+proposals,+pricing,+and+winning+more+clients"],
  },
};

export const revalidate = 60;

export default async function BlogPage() {
  const { posts, hasMore } = await getPaginatedPosts(0, POSTS_PER_PAGE);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema()) }}
      />
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
