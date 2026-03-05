"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BlogPost } from "@/lib/blog";
import { BlogCard } from "./blog-card";
import { loadMorePosts } from "@/app/blog/actions";

interface BlogListProps {
  initialPosts: BlogPost[];
  initialHasMore: boolean;
}

export function BlogList({ initialPosts, initialHasMore }: BlogListProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const { posts: newPosts, hasMore: more } = await loadMorePosts(posts.length);
    setPosts((prev) => [...prev, ...newPosts]);
    setHasMore(more);
    setLoading(false);
  }, [loading, hasMore, posts.length]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  if (posts.length === 0) {
    return <p className="text-[var(--text-tertiary)]">No posts yet. Check back soon.</p>;
  }

  return (
    <div className="space-y-6">
      <BlogCard post={posts[0]} featured />

      {posts.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.slice(1).map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {hasMore && (
        <div ref={loaderRef} className="flex justify-center py-8">
          {loading && (
            <span className="size-6 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          )}
        </div>
      )}
    </div>
  );
}
