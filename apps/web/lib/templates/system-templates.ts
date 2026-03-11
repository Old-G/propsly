import type { JSONContent } from "@tiptap/core"

interface SystemTemplate {
  name: string
  description: string
  category: string
  content: JSONContent
}

function heading(level: number, text: string): JSONContent {
  return { type: "heading", attrs: { level }, content: [{ type: "text", text }] }
}

function paragraph(text: string): JSONContent {
  return { type: "paragraph", content: [{ type: "text", text }] }
}

function bold(text: string): JSONContent {
  return { type: "text", marks: [{ type: "bold" }], text }
}

function paragraphWithBold(before: string, boldText: string, after: string): JSONContent {
  return {
    type: "paragraph",
    content: [
      { type: "text", text: before },
      bold(boldText),
      { type: "text", text: after },
    ],
  }
}

function variable(id: string): JSONContent {
  return { type: "variable", attrs: { id } }
}

function variableParagraph(before: string, varId: string, after: string): JSONContent {
  return {
    type: "paragraph",
    content: [
      { type: "text", text: before },
      variable(varId),
      { type: "text", text: after },
    ],
  }
}

function bulletList(items: string[]): JSONContent {
  return {
    type: "bulletList",
    content: items.map((item) => ({
      type: "listItem",
      content: [{ type: "paragraph", content: [{ type: "text", text: item }] }],
    })),
  }
}

function divider(): JSONContent {
  return { type: "dividerBlock", attrs: { style: "solid", spacing: "md" } }
}

function pricingTable(rows: { description: string; quantity: number; unitPrice: number; optional: boolean }[], currency = "USD"): JSONContent {
  return {
    type: "pricingTable",
    attrs: {
      currency,
      discountType: "none",
      discountValue: 0,
      taxRate: 0,
      rows: rows.map((row) => ({
        id: crypto.randomUUID(),
        ...row,
      })),
    },
  }
}

function signatureBlock(): JSONContent {
  return { type: "signatureBlock" }
}

function tocBlock(): JSONContent {
  return { type: "tableOfContents" }
}

// ============================================================
// 10 SYSTEM TEMPLATES
// ============================================================

const webDesign: SystemTemplate = {
  name: "Web Design Proposal",
  description: "Complete website design and development proposal with discovery, design, and development phases.",
  category: "design",
  content: {
    type: "doc",
    content: [
      heading(1, "Web Design Proposal"),
      variableParagraph("Prepared for ", "clientName", ""),
      tocBlock(),
      divider(),
      heading(2, "Project Overview"),
      paragraph("We're excited to partner with you on redesigning your website. This proposal outlines our approach to creating a modern, high-converting website that reflects your brand and drives results."),
      paragraph("Our team will deliver a fully responsive, SEO-optimized website built with modern technologies and best practices."),
      divider(),
      heading(2, "Scope of Work"),
      heading(3, "Phase 1: Discovery & Strategy"),
      bulletList([
        "Stakeholder interviews and brand audit",
        "Competitor analysis and market research",
        "User persona development",
        "Information architecture and sitemap",
        "Content strategy recommendations",
      ]),
      heading(3, "Phase 2: Design"),
      bulletList([
        "Wireframes for key pages (Home, About, Services, Contact)",
        "2 design concepts with mood boards",
        "1 round of revisions on selected concept",
        "Responsive design for mobile, tablet, desktop",
        "Design system with reusable components",
      ]),
      heading(3, "Phase 3: Development"),
      bulletList([
        "Frontend development (React / Next.js)",
        "CMS integration for content management",
        "Contact forms and lead capture",
        "Performance optimization (Core Web Vitals)",
        "Cross-browser testing and QA",
      ]),
      heading(3, "Phase 4: Launch & Handoff"),
      bulletList([
        "Domain and hosting setup",
        "SSL certificate configuration",
        "Analytics and tracking setup (GA4, Search Console)",
        "Training session for content management",
        "30-day post-launch support",
      ]),
      divider(),
      heading(2, "Timeline"),
      paragraph("The project is estimated to take 6-8 weeks from kickoff to launch:"),
      bulletList([
        "Week 1-2: Discovery & Strategy",
        "Week 3-4: Design",
        "Week 5-7: Development",
        "Week 8: Testing, QA & Launch",
      ]),
      divider(),
      heading(2, "Investment"),
      pricingTable([
        { description: "Discovery & Strategy", quantity: 1, unitPrice: 2500, optional: false },
        { description: "UI/UX Design (up to 8 pages)", quantity: 1, unitPrice: 5000, optional: false },
        { description: "Frontend Development", quantity: 1, unitPrice: 6000, optional: false },
        { description: "CMS Integration", quantity: 1, unitPrice: 1500, optional: false },
        { description: "SEO Setup & Optimization", quantity: 1, unitPrice: 1000, optional: true },
        { description: "Copywriting (per page)", quantity: 8, unitPrice: 200, optional: true },
      ]),
      divider(),
      heading(2, "Terms & Conditions"),
      paragraph("Payment is split into three milestones: 40% upfront to begin work, 30% upon design approval, and 30% upon project completion."),
      paragraph("This proposal is valid for 30 days. All work not explicitly listed in the scope is considered out of scope and may be quoted separately."),
      paragraph("The client retains full ownership of all deliverables upon final payment. We retain the right to showcase the work in our portfolio."),
      divider(),
      heading(2, "Agreement"),
      paragraph("By signing below, you agree to the scope, timeline, and investment outlined in this proposal."),
      signatureBlock(),
    ],
  },
}

const mobileApp: SystemTemplate = {
  name: "Mobile App Development",
  description: "Native or cross-platform mobile app proposal with UX research, design, development, and app store submission.",
  category: "development",
  content: {
    type: "doc",
    content: [
      heading(1, "Mobile App Development Proposal"),
      variableParagraph("Prepared for ", "clientName", ""),
      tocBlock(),
      divider(),
      heading(2, "Executive Summary"),
      paragraph("This proposal outlines our plan to design and develop a mobile application that delivers exceptional user experience across iOS and Android platforms."),
      divider(),
      heading(2, "Scope of Work"),
      heading(3, "UX Research & Planning"),
      bulletList([
        "User research and persona development",
        "User flow mapping and journey design",
        "Feature prioritization (MoSCoW method)",
        "Technical architecture planning",
      ]),
      heading(3, "UI Design"),
      bulletList([
        "Wireframes for all screens",
        "High-fidelity mockups (iOS & Android)",
        "Interactive prototype for user testing",
        "Design system and component library",
      ]),
      heading(3, "Development"),
      bulletList([
        "Cross-platform development (React Native)",
        "API integration and backend connectivity",
        "Push notifications setup",
        "Offline mode support",
        "Unit and integration testing",
      ]),
      heading(3, "Launch"),
      bulletList([
        "App Store submission (iOS)",
        "Google Play submission (Android)",
        "Beta testing with TestFlight / Internal Testing",
        "Performance monitoring setup",
      ]),
      divider(),
      heading(2, "Timeline"),
      paragraph("Estimated 10-12 weeks:"),
      bulletList([
        "Week 1-2: Research & Planning",
        "Week 3-4: UI Design",
        "Week 5-10: Development",
        "Week 11-12: Testing & Launch",
      ]),
      divider(),
      heading(2, "Investment"),
      pricingTable([
        { description: "UX Research & Planning", quantity: 1, unitPrice: 3000, optional: false },
        { description: "UI Design (all screens)", quantity: 1, unitPrice: 6000, optional: false },
        { description: "App Development (React Native)", quantity: 1, unitPrice: 15000, optional: false },
        { description: "Backend API Development", quantity: 1, unitPrice: 5000, optional: false },
        { description: "App Store Submission", quantity: 2, unitPrice: 500, optional: false },
        { description: "Analytics & Monitoring Setup", quantity: 1, unitPrice: 1000, optional: true },
      ]),
      divider(),
      heading(2, "Terms"),
      paragraph("Payment: 30% upfront, 30% at design approval, 40% at launch. Valid for 30 days."),
      paragraph("Client owns all source code and assets upon final payment."),
      divider(),
      heading(2, "Agreement"),
      signatureBlock(),
    ],
  },
}

const branding: SystemTemplate = {
  name: "Brand Identity Package",
  description: "Complete branding proposal including logo design, visual identity, and brand guidelines.",
  category: "design",
  content: {
    type: "doc",
    content: [
      heading(1, "Brand Identity Proposal"),
      variableParagraph("Prepared for ", "clientName", ""),
      tocBlock(),
      divider(),
      heading(2, "About This Project"),
      paragraph("Your brand is more than a logo — it's the complete experience people have with your company. We'll create a cohesive brand identity that communicates your values and resonates with your audience."),
      divider(),
      heading(2, "Deliverables"),
      heading(3, "Brand Strategy"),
      bulletList([
        "Brand audit and competitive analysis",
        "Brand positioning statement",
        "Core values and personality definition",
        "Target audience profiles",
      ]),
      heading(3, "Visual Identity"),
      bulletList([
        "Primary and secondary logo designs (3 concepts)",
        "Color palette (primary, secondary, accent)",
        "Typography system (headings, body, accent)",
        "Icon set and graphic elements",
        "Photography and imagery direction",
      ]),
      heading(3, "Brand Guidelines"),
      bulletList([
        "Comprehensive brand book (40-60 pages)",
        "Logo usage rules and clear space",
        "Color specifications (HEX, RGB, CMYK, Pantone)",
        "Typography hierarchy and usage",
        "Do's and don'ts with examples",
      ]),
      heading(3, "Collateral Templates"),
      bulletList([
        "Business card design",
        "Email signature template",
        "Social media profile templates",
        "Letterhead and invoice template",
      ]),
      divider(),
      heading(2, "Timeline"),
      bulletList([
        "Week 1: Brand Strategy & Research",
        "Week 2-3: Logo & Visual Identity Design",
        "Week 4: Revisions & Refinement",
        "Week 5: Brand Guidelines & Collateral",
      ]),
      divider(),
      heading(2, "Investment"),
      pricingTable([
        { description: "Brand Strategy & Research", quantity: 1, unitPrice: 2000, optional: false },
        { description: "Logo Design (3 concepts + revisions)", quantity: 1, unitPrice: 3500, optional: false },
        { description: "Visual Identity System", quantity: 1, unitPrice: 2500, optional: false },
        { description: "Brand Guidelines Book", quantity: 1, unitPrice: 2000, optional: false },
        { description: "Collateral Templates", quantity: 4, unitPrice: 500, optional: true },
        { description: "Brand Animation / Motion Logo", quantity: 1, unitPrice: 1500, optional: true },
      ]),
      divider(),
      heading(2, "Terms"),
      paragraph("50% upfront, 50% upon delivery. Valid for 30 days. Client owns all final deliverables."),
      divider(),
      heading(2, "Agreement"),
      signatureBlock(),
    ],
  },
}

const marketing: SystemTemplate = {
  name: "Digital Marketing Campaign",
  description: "Comprehensive digital marketing proposal covering strategy, ad campaigns, content, and reporting.",
  category: "marketing",
  content: {
    type: "doc",
    content: [
      heading(1, "Digital Marketing Proposal"),
      variableParagraph("Prepared for ", "clientName", ""),
      tocBlock(),
      divider(),
      heading(2, "Objective"),
      paragraph("Drive qualified traffic, increase brand awareness, and generate measurable leads through a multi-channel digital marketing strategy."),
      divider(),
      heading(2, "Strategy"),
      heading(3, "Paid Advertising"),
      bulletList([
        "Google Ads (Search + Display) campaign setup and management",
        "Meta Ads (Facebook + Instagram) campaigns",
        "Retargeting campaigns across platforms",
        "A/B testing of ad creatives and copy",
        "Monthly budget optimization",
      ]),
      heading(3, "Content Marketing"),
      bulletList([
        "4 blog posts per month (SEO-optimized)",
        "Social media content calendar",
        "Email newsletter (2x per month)",
        "Lead magnet creation (ebook or guide)",
      ]),
      heading(3, "Analytics & Reporting"),
      bulletList([
        "Google Analytics 4 setup and configuration",
        "Conversion tracking implementation",
        "Monthly performance reports",
        "Quarterly strategy reviews",
      ]),
      divider(),
      heading(2, "Timeline"),
      paragraph("This is a 3-month engagement with monthly deliverables:"),
      bulletList([
        "Month 1: Setup, audit, strategy development, campaign launch",
        "Month 2: Optimization, content production, A/B testing",
        "Month 3: Scale winning campaigns, comprehensive reporting",
      ]),
      divider(),
      heading(2, "Investment"),
      pricingTable([
        { description: "Strategy & Setup (one-time)", quantity: 1, unitPrice: 3000, optional: false },
        { description: "Monthly Campaign Management", quantity: 3, unitPrice: 2500, optional: false },
        { description: "Content Production (per month)", quantity: 3, unitPrice: 2000, optional: false },
        { description: "Email Marketing Setup", quantity: 1, unitPrice: 1500, optional: true },
        { description: "Lead Magnet Design & Copy", quantity: 1, unitPrice: 2000, optional: true },
      ]),
      paragraph("Note: Ad spend budget is separate and billed directly by platforms."),
      divider(),
      heading(2, "Terms"),
      paragraph("Monthly retainer billed on the 1st. 30-day notice for cancellation. Reports delivered by the 5th of each month."),
      divider(),
      heading(2, "Agreement"),
      signatureBlock(),
    ],
  },
}

const consulting: SystemTemplate = {
  name: "Consulting Engagement",
  description: "Professional consulting proposal for strategy, advisory, or technical consulting projects.",
  category: "consulting",
  content: {
    type: "doc",
    content: [
      heading(1, "Consulting Proposal"),
      variableParagraph("Prepared for ", "clientName", ""),
      tocBlock(),
      divider(),
      heading(2, "Engagement Overview"),
      paragraph("This proposal outlines a consulting engagement to help your organization achieve its strategic objectives. Our approach combines deep expertise with actionable recommendations."),
      divider(),
      heading(2, "Objectives"),
      bulletList([
        "Assess current state and identify opportunities",
        "Develop actionable strategic recommendations",
        "Create an implementation roadmap with clear milestones",
        "Provide hands-on support during initial execution phase",
      ]),
      divider(),
      heading(2, "Approach"),
      heading(3, "Phase 1: Assessment (Week 1-2)"),
      bulletList([
        "Stakeholder interviews (up to 10 participants)",
        "Data collection and analysis",
        "Current process documentation",
        "Gap analysis and opportunity mapping",
      ]),
      heading(3, "Phase 2: Strategy Development (Week 3-4)"),
      bulletList([
        "Findings presentation to leadership",
        "Strategic options development",
        "Cost-benefit analysis for each option",
        "Final strategy recommendation",
      ]),
      heading(3, "Phase 3: Implementation Support (Week 5-8)"),
      bulletList([
        "Detailed implementation roadmap",
        "Weekly check-in calls",
        "Progress tracking and adjustment",
        "Knowledge transfer and documentation",
      ]),
      divider(),
      heading(2, "Investment"),
      pricingTable([
        { description: "Assessment Phase (2 weeks)", quantity: 1, unitPrice: 8000, optional: false },
        { description: "Strategy Development (2 weeks)", quantity: 1, unitPrice: 6000, optional: false },
        { description: "Implementation Support (4 weeks)", quantity: 1, unitPrice: 10000, optional: false },
        { description: "Additional consulting days", quantity: 5, unitPrice: 1500, optional: true },
      ]),
      divider(),
      heading(2, "Terms"),
      paragraph("Engagement fee billed in two installments: 50% at kickoff, 50% at strategy delivery. Travel expenses billed at cost."),
      divider(),
      heading(2, "Agreement"),
      signatureBlock(),
    ],
  },
}

const seo: SystemTemplate = {
  name: "SEO Optimization",
  description: "Technical SEO audit and optimization proposal with on-page, off-page, and content strategy.",
  category: "marketing",
  content: {
    type: "doc",
    content: [
      heading(1, "SEO Optimization Proposal"),
      variableParagraph("Prepared for ", "clientName", ""),
      tocBlock(),
      divider(),
      heading(2, "Goal"),
      paragraph("Improve your website's organic search visibility, increase qualified traffic, and establish long-term SEO foundations that drive sustainable growth."),
      divider(),
      heading(2, "Scope of Work"),
      heading(3, "Technical SEO Audit"),
      bulletList([
        "Site crawl analysis (indexability, errors, redirects)",
        "Core Web Vitals assessment and optimization",
        "Schema markup implementation",
        "XML sitemap and robots.txt optimization",
        "Mobile usability review",
      ]),
      heading(3, "On-Page SEO"),
      bulletList([
        "Keyword research (50-100 target keywords)",
        "Title tag and meta description optimization",
        "Header structure and content optimization",
        "Internal linking strategy",
        "Image optimization (alt tags, compression)",
      ]),
      heading(3, "Content Strategy"),
      bulletList([
        "Content gap analysis",
        "Editorial calendar (3 months)",
        "8 SEO-optimized blog posts",
        "Landing page optimization for key services",
      ]),
      divider(),
      heading(2, "Timeline"),
      bulletList([
        "Week 1-2: Technical audit and keyword research",
        "Week 3-4: On-page optimization implementation",
        "Week 5-8: Content production and link building",
        "Ongoing: Monthly reporting and adjustments",
      ]),
      divider(),
      heading(2, "Investment"),
      pricingTable([
        { description: "Technical SEO Audit", quantity: 1, unitPrice: 2500, optional: false },
        { description: "On-Page Optimization (up to 20 pages)", quantity: 1, unitPrice: 3000, optional: false },
        { description: "Keyword Research & Strategy", quantity: 1, unitPrice: 1500, optional: false },
        { description: "SEO Blog Posts", quantity: 8, unitPrice: 400, optional: false },
        { description: "Monthly Reporting (3 months)", quantity: 3, unitPrice: 500, optional: false },
        { description: "Link Building Campaign", quantity: 1, unitPrice: 2000, optional: true },
      ]),
      divider(),
      heading(2, "Terms"),
      paragraph("50% upfront, 50% at 30 days. Monthly reporting included for 3 months. Results typically visible within 3-6 months."),
      divider(),
      heading(2, "Agreement"),
      signatureBlock(),
    ],
  },
}

const contentStrategy: SystemTemplate = {
  name: "Content Strategy",
  description: "Content marketing strategy proposal with editorial planning, content creation, and distribution.",
  category: "marketing",
  content: {
    type: "doc",
    content: [
      heading(1, "Content Strategy Proposal"),
      variableParagraph("Prepared for ", "clientName", ""),
      tocBlock(),
      divider(),
      heading(2, "Overview"),
      paragraph("Content is the foundation of modern marketing. This proposal outlines a comprehensive content strategy designed to establish thought leadership, drive organic traffic, and nurture leads through the funnel."),
      divider(),
      heading(2, "Deliverables"),
      bulletList([
        "Content audit of existing materials",
        "Audience research and content persona mapping",
        "Content pillar strategy (3-5 core topics)",
        "3-month editorial calendar",
        "12 long-form blog posts (1,500-2,000 words each)",
        "4 lead magnets (guides, checklists, templates)",
        "Social media content repurposing plan",
        "Content performance dashboard",
      ]),
      divider(),
      heading(2, "Timeline"),
      bulletList([
        "Week 1: Audit & Research",
        "Week 2: Strategy & Calendar Development",
        "Week 3-12: Content Production & Distribution",
        "Monthly: Performance Review & Optimization",
      ]),
      divider(),
      heading(2, "Investment"),
      pricingTable([
        { description: "Content Audit & Strategy", quantity: 1, unitPrice: 3000, optional: false },
        { description: "Blog Posts (1,500-2,000 words)", quantity: 12, unitPrice: 500, optional: false },
        { description: "Lead Magnets (guides/templates)", quantity: 4, unitPrice: 1000, optional: false },
        { description: "Social Media Repurposing", quantity: 3, unitPrice: 800, optional: true },
      ]),
      divider(),
      heading(2, "Terms"),
      paragraph("Monthly billing. Content rights transfer to client upon payment. 30-day cancellation notice."),
      divider(),
      heading(2, "Agreement"),
      signatureBlock(),
    ],
  },
}

const ecommerce: SystemTemplate = {
  name: "E-commerce Store Setup",
  description: "Complete e-commerce development proposal with store setup, payment integration, and launch strategy.",
  category: "development",
  content: {
    type: "doc",
    content: [
      heading(1, "E-commerce Development Proposal"),
      variableParagraph("Prepared for ", "clientName", ""),
      tocBlock(),
      divider(),
      heading(2, "Project Overview"),
      paragraph("We'll build a high-performing online store that provides a seamless shopping experience, handles payments securely, and gives you full control over your products and orders."),
      divider(),
      heading(2, "Scope of Work"),
      bulletList([
        "Store setup and configuration",
        "Custom theme design and development",
        "Product catalog setup (up to 100 products)",
        "Payment gateway integration (Stripe)",
        "Shipping configuration and tax rules",
        "Order management workflow",
        "Customer accounts and wishlists",
        "Inventory management system",
        "Email notifications (order confirmation, shipping, etc.)",
        "SEO setup for product pages",
      ]),
      divider(),
      heading(2, "Timeline"),
      bulletList([
        "Week 1-2: Design & Setup",
        "Week 3-4: Development & Product Upload",
        "Week 5: Testing & Payment Configuration",
        "Week 6: Launch & Training",
      ]),
      divider(),
      heading(2, "Investment"),
      pricingTable([
        { description: "Store Design & Theme Development", quantity: 1, unitPrice: 5000, optional: false },
        { description: "Product Catalog Setup (100 products)", quantity: 1, unitPrice: 2000, optional: false },
        { description: "Payment & Shipping Integration", quantity: 1, unitPrice: 1500, optional: false },
        { description: "Email Notification Templates", quantity: 1, unitPrice: 1000, optional: false },
        { description: "Product Photography (per product)", quantity: 50, unitPrice: 30, optional: true },
        { description: "Monthly Maintenance", quantity: 3, unitPrice: 500, optional: true },
      ]),
      divider(),
      heading(2, "Terms"),
      paragraph("40% upfront, 30% at design approval, 30% at launch. Hosting and platform fees are separate."),
      divider(),
      heading(2, "Agreement"),
      signatureBlock(),
    ],
  },
}

const saas: SystemTemplate = {
  name: "SaaS Product Development",
  description: "MVP development proposal for SaaS products with architecture, development sprints, and deployment.",
  category: "development",
  content: {
    type: "doc",
    content: [
      heading(1, "SaaS MVP Development Proposal"),
      variableParagraph("Prepared for ", "clientName", ""),
      tocBlock(),
      divider(),
      heading(2, "Vision"),
      paragraph("This proposal covers the design and development of your SaaS product MVP. Our goal is to validate your core value proposition with real users as quickly as possible, while building a foundation that scales."),
      divider(),
      heading(2, "Technical Architecture"),
      bulletList([
        "Frontend: Next.js (React) with TypeScript",
        "Backend: API routes + PostgreSQL database",
        "Auth: Email/password + OAuth (Google)",
        "Hosting: Vercel (frontend) + managed database",
        "Payments: Stripe Billing (subscriptions)",
        "Email: Transactional emails (Resend)",
      ]),
      divider(),
      heading(2, "Scope — MVP Features"),
      bulletList([
        "User authentication and onboarding",
        "Core product workflow (main feature)",
        "Dashboard with key metrics",
        "Settings and account management",
        "Stripe subscription integration (2 tiers)",
        "Admin panel for user management",
        "Responsive design (desktop + mobile)",
      ]),
      divider(),
      heading(2, "Timeline (8-week sprints)"),
      bulletList([
        "Sprint 1 (Week 1-2): Setup, auth, database schema, design system",
        "Sprint 2 (Week 3-4): Core feature development",
        "Sprint 3 (Week 5-6): Dashboard, settings, payments",
        "Sprint 4 (Week 7-8): Testing, polish, deployment",
      ]),
      divider(),
      heading(2, "Investment"),
      pricingTable([
        { description: "Architecture & Design System", quantity: 1, unitPrice: 5000, optional: false },
        { description: "Core Feature Development", quantity: 1, unitPrice: 12000, optional: false },
        { description: "Auth, Dashboard, Settings", quantity: 1, unitPrice: 6000, optional: false },
        { description: "Stripe Integration", quantity: 1, unitPrice: 3000, optional: false },
        { description: "Testing & QA", quantity: 1, unitPrice: 2000, optional: false },
        { description: "DevOps & Deployment", quantity: 1, unitPrice: 2000, optional: false },
        { description: "Post-launch Support (per month)", quantity: 2, unitPrice: 3000, optional: true },
      ]),
      divider(),
      heading(2, "Terms"),
      paragraph("Bi-weekly billing per sprint. Client owns all source code and IP. Includes 2 weeks post-launch bug fixes."),
      divider(),
      heading(2, "Agreement"),
      signatureBlock(),
    ],
  },
}

const freelance: SystemTemplate = {
  name: "Freelance Services Agreement",
  description: "Simple, clean freelance proposal for hourly or project-based engagements.",
  category: "consulting",
  content: {
    type: "doc",
    content: [
      heading(1, "Freelance Proposal"),
      variableParagraph("Prepared for ", "clientName", ""),
      divider(),
      heading(2, "About Me"),
      paragraph("I'm a freelance professional specializing in [your specialty]. With [X] years of experience, I help businesses like yours achieve [key outcome]. I'm excited about the opportunity to work together."),
      divider(),
      heading(2, "What I'll Do"),
      paragraph("Based on our conversation, here's what I'll deliver:"),
      bulletList([
        "[Deliverable 1 — describe what you'll create or do]",
        "[Deliverable 2 — describe another key output]",
        "[Deliverable 3 — any additional work included]",
      ]),
      heading(3, "What's Not Included"),
      bulletList([
        "[Out-of-scope item 1]",
        "[Out-of-scope item 2]",
      ]),
      divider(),
      heading(2, "Timeline"),
      paragraph("I estimate this project will take [X] weeks:"),
      bulletList([
        "Week 1: [Phase 1 description]",
        "Week 2: [Phase 2 description]",
        "Week 3: [Final delivery and revisions]",
      ]),
      divider(),
      heading(2, "Pricing"),
      pricingTable([
        { description: "[Main deliverable]", quantity: 1, unitPrice: 0, optional: false },
        { description: "[Secondary deliverable]", quantity: 1, unitPrice: 0, optional: false },
        { description: "[Optional add-on]", quantity: 1, unitPrice: 0, optional: true },
      ]),
      divider(),
      heading(2, "Terms"),
      paragraph("50% deposit to start, 50% upon completion. Includes up to 2 rounds of revisions. Additional revisions billed at my hourly rate."),
      paragraph("This proposal is valid for 14 days."),
      divider(),
      heading(2, "Let's Go!"),
      paragraph("Sign below to get started. I'll send an invoice for the deposit and we'll kick off within 48 hours."),
      signatureBlock(),
    ],
  },
}

export const SYSTEM_TEMPLATES: SystemTemplate[] = [
  webDesign,
  mobileApp,
  branding,
  marketing,
  consulting,
  seo,
  contentStrategy,
  ecommerce,
  saas,
  freelance,
]
