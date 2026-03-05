const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://propsly.org";

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Propsly",
    url: BASE_URL,
    description:
      "Create beautiful interactive proposals as web pages. Interactive pricing, view tracking, e-signatures. Free and open-source.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Propsly",
    url: BASE_URL,
    logo: `${BASE_URL}/icon.svg`,
    sameAs: ["https://github.com/Old-G/propsly", "https://x.com/oldg9516"],
  };
}

export function blogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Propsly Blog",
    url: `${BASE_URL}/blog`,
    description:
      "Tips, strategies, and insights on proposals, pricing, and growing your freelance or agency business.",
    publisher: organizationSchema(),
  };
}

export function blogPostSchema(post: {
  title: string;
  description: string;
  slug: string;
  date: string;
  author: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: `${BASE_URL}/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: organizationSchema(),
    image: post.image ?? `${BASE_URL}/og?title=${encodeURIComponent(post.title)}`,
  };
}

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Propsly",
    url: BASE_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Open-source proposal platform. Create interactive proposals as web pages with tracking, e-signatures, and payments.",
    license: "https://www.gnu.org/licenses/agpl-3.0.html",
  };
}

export function productSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Propsly",
    description:
      "Open-source proposal platform with interactive pricing, view tracking, e-signatures, and PDF export.",
    url: `${BASE_URL}/pricing`,
    brand: {
      "@type": "Brand",
      name: "Propsly",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "USD",
        description: "Free plan with core features",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "19",
        priceCurrency: "USD",
        description: "Pro plan for growing teams",
      },
    ],
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
