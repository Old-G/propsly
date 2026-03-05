import { createClient } from "@/lib/supabase/server";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  readingTime: string;
  image?: string;
  status: "published" | "draft";
  content: string;
}

function calcReadingTime(content: string): string {
  const words = content.split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
}

export const POSTS_PER_PAGE = 6;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    date: row.published_at ?? row.created_at,
    author: row.author ?? "Propsly Team",
    readingTime: calcReadingTime(row.content),
    image: row.image,
    status: row.status as "published" | "draft",
    content: row.content,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapRow);
}

export async function getPaginatedPosts(
  offset: number,
  limit: number = POSTS_PER_PAGE
): Promise<{ posts: BlogPost[]; hasMore: boolean }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(offset, offset + limit);

  if (error || !data) return { posts: [], hasMore: false };
  return {
    posts: data.map(mapRow),
    hasMore: data.length > limit,
  };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return undefined;

  return {
    slug: data.slug,
    title: data.title,
    description: data.description,
    date: data.published_at ?? data.created_at,
    author: data.author ?? "Propsly Team",
    readingTime: calcReadingTime(data.content),
    image: data.image,
    status: data.status as "published" | "draft",
    content: data.content,
  };
}
