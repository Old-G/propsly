import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://propsly.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/open-source`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const competitors = ["pandadoc", "proposify", "qwilr", "better-proposals"];
  const alternativePages: MetadataRoute.Sitemap = competitors.map((slug) => ({
    url: `${BASE_URL}/alternatives/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Blog posts - read from filesystem if available
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const fs = require("fs");
    const path = require("path");
    const blogDir = path.join(process.cwd(), "content/blog");
    if (fs.existsSync(blogDir)) {
      const files = fs
        .readdirSync(blogDir)
        .filter((f: string) => f.endsWith(".mdx"));
      blogPages = files.map((f: string) => ({
        url: `${BASE_URL}/blog/${f.replace(".mdx", "")}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch {
    // Blog directory may not exist yet
  }

  return [...staticPages, ...alternativePages, ...blogPages];
}
