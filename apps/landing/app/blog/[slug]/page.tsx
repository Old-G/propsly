import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { getPostBySlug } from "@/lib/blog";
import type { ComponentPropsWithoutRef } from "react";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Propsly Blog`,
    description: post.description,
  };
}

const mdxComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="heading-display text-3xl mt-12 mb-4" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="heading-display text-2xl mt-10 mb-3" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="text-xl font-medium mt-8 mb-2" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p
      className="text-[var(--text-secondary)] leading-relaxed mb-6 text-lg"
      {...props}
    />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a className="text-[var(--accent)] hover:underline" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="list-disc pl-6 mb-6 space-y-2 text-[var(--text-secondary)]"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="list-decimal pl-6 mb-6 space-y-2 text-[var(--text-secondary)]"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="text-lg leading-relaxed" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="border-l-2 border-[var(--accent)] pl-4 italic text-[var(--text-secondary)] my-6"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="font-mono bg-[var(--bg-surface)] px-1.5 py-0.5 rounded text-sm"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-4 overflow-x-auto my-6"
      {...props}
    />
  ),
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Header />
      <main className="max-w-[800px] mx-auto pt-32 pb-20 px-6">
        <Link
          href="/blog"
          className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          &larr; Back to Blog
        </Link>

        <div className="font-mono text-xs text-[var(--text-tertiary)] mt-8 mb-4">
          {formattedDate} &middot; {post.readingTime}
        </div>

        <h1 className="heading-display text-4xl mb-6">{post.title}</h1>

        <MDXRemote source={post.content} components={mdxComponents} />
      </main>
      <Footer />
    </>
  );
}
