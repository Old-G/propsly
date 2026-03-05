import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

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

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      const words = content.split(/\s+/).length;
      const readingTime = `${Math.ceil(words / 200)} min read`;
      return {
        slug: file.replace(".mdx", ""),
        title: data.title,
        description: data.description,
        date: data.date,
        author: data.author ?? "Propsly Team",
        readingTime,
        image: data.image,
        status: data.status ?? "published",
        content,
      } as BlogPost;
    })
    .filter((p) => p.status === "published")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}
