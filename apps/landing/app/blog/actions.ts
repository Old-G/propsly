"use server";

import { getPaginatedPosts, POSTS_PER_PAGE } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";

export async function loadMorePosts(
  offset: number
): Promise<{ posts: BlogPost[]; hasMore: boolean }> {
  return getPaginatedPosts(offset, POSTS_PER_PAGE);
}
