export interface Competitor {
  slug: string;
  name: string;
  tagline: string;
  price: string;
  problems: string[];
  features: { name: string; competitor: string; propsly: string }[];
}

export const competitors: Record<string, Competitor> = {
  pandadoc: {
    slug: "pandadoc",
    name: "PandaDoc",
    tagline: "Open-Source PandaDoc Alternative",
    price: "$19\u201365/user/mo",
    problems: [
      "Pricing tables removed from Starter plan in Oct 2025",
      "Custom branding locked behind Business tier ($49/user/mo)",
      "No self-hosting option \u2014 your data stays on their servers",
      "Vendor lock-in with proprietary document format",
    ],
    features: [
      { name: "Interactive pricing tables", competitor: "Business+ only", propsly: "Free" },
      { name: "E-signatures", competitor: "All plans", propsly: "Free" },
      { name: "Custom branding", competitor: "$49/user/mo", propsly: "Free" },
      { name: "View tracking & analytics", competitor: "All plans", propsly: "Free" },
      { name: "Self-hosting", competitor: "No", propsly: "Yes" },
      { name: "Open source", competitor: "No", propsly: "AGPL-3.0" },
      { name: "API access", competitor: "Enterprise", propsly: "Free" },
      { name: "Template library", competitor: "Limited free", propsly: "Unlimited" },
    ],
  },
  proposify: {
    slug: "proposify",
    name: "Proposify",
    tagline: "Open-Source Proposify Alternative",
    price: "$49/user/mo",
    problems: [
      "Only one pricing plan at $49/user/month \u2014 expensive for small teams",
      "No free tier or affordable starter option",
      "Limited customization without developer help",
      "No self-hosting or data sovereignty options",
    ],
    features: [
      { name: "Interactive pricing tables", competitor: "Yes", propsly: "Free" },
      { name: "E-signatures", competitor: "Yes", propsly: "Free" },
      { name: "Custom branding", competitor: "Yes", propsly: "Free" },
      { name: "View tracking & analytics", competitor: "Yes", propsly: "Free" },
      { name: "Self-hosting", competitor: "No", propsly: "Yes" },
      { name: "Open source", competitor: "No", propsly: "AGPL-3.0" },
      { name: "Starting price", competitor: "$49/user/mo", propsly: "Free" },
      { name: "Template library", competitor: "Yes", propsly: "Unlimited" },
    ],
  },
  qwilr: {
    slug: "qwilr",
    name: "Qwilr",
    tagline: "Open-Source Qwilr Alternative",
    price: "$35\u201359/user/mo",
    problems: [
      "Beautiful but limited \u2014 rigid template system",
      "No interactive pricing tables on lower tiers",
      "Expensive for teams ($59/user/mo for Business)",
      "No self-hosting or open-source option",
    ],
    features: [
      { name: "Web-based proposals", competitor: "Yes", propsly: "Free" },
      { name: "Interactive pricing", competitor: "Business only", propsly: "Free" },
      { name: "E-signatures", competitor: "Yes", propsly: "Free" },
      { name: "Custom branding", competitor: "Business only", propsly: "Free" },
      { name: "View tracking", competitor: "Yes", propsly: "Free" },
      { name: "Self-hosting", competitor: "No", propsly: "Yes" },
      { name: "Open source", competitor: "No", propsly: "AGPL-3.0" },
      { name: "Block-based editor", competitor: "Limited", propsly: "Full TipTap" },
    ],
  },
  "better-proposals": {
    slug: "better-proposals",
    name: "Better Proposals",
    tagline: "Open-Source Better Proposals Alternative",
    price: "$19\u201349/user/mo",
    problems: [
      "Limited integrations on Starter plan",
      "Custom domain requires Premium ($29/user/mo)",
      "No self-hosting or data export options",
      "Template library quality varies significantly",
    ],
    features: [
      { name: "Interactive pricing", competitor: "All plans", propsly: "Free" },
      { name: "E-signatures", competitor: "All plans", propsly: "Free" },
      { name: "Custom domain", competitor: "$29/user/mo", propsly: "Free" },
      { name: "View tracking", competitor: "All plans", propsly: "Free" },
      { name: "Self-hosting", competitor: "No", propsly: "Yes" },
      { name: "Open source", competitor: "No", propsly: "AGPL-3.0" },
      { name: "AI writing assist", competitor: "Premium", propsly: "Free" },
      { name: "PDF export", competitor: "All plans", propsly: "Free" },
    ],
  },
};

export function getCompetitor(slug: string): Competitor | undefined {
  return competitors[slug];
}

export function getAllCompetitorSlugs(): string[] {
  return Object.keys(competitors);
}
