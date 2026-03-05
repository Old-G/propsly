import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-6 transition-colors hover:border-[var(--accent-border)]"
    >
      <div className="font-mono text-xs text-[var(--text-tertiary)] mb-3">
        {formattedDate} &middot; {post.readingTime}
      </div>
      <h2
        className={`heading-display mb-2 ${
          featured ? "text-2xl" : "text-lg"
        }`}
      >
        {post.title}
      </h2>
      {featured && (
        <p className="text-[var(--text-secondary)] leading-relaxed mt-3">
          {post.description}
        </p>
      )}
    </Link>
  );
}
