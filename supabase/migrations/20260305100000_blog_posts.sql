-- Blog posts table
create table public.blog_posts (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  description text not null,
  content text not null,
  author text default 'Propsly Team',
  image text,
  status text default 'draft' check (status in ('published', 'draft')),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.blog_posts enable row level security;

-- Public read for published posts (no auth needed)
create policy "Anyone can read published posts"
  on public.blog_posts for select
  using (status = 'published');

-- Index for slug lookups
create index blog_posts_slug_idx on public.blog_posts (slug);
create index blog_posts_published_at_idx on public.blog_posts (published_at desc);

-- Seed 3 starter posts
insert into public.blog_posts (slug, title, description, content, author, status, published_at) values
(
  'why-open-source-pandadoc-alternative',
  'Why I''m Building an Open-Source PandaDoc Alternative',
  'The proposal software market is broken. Here''s why we''re building Propsly — free, open-source, and self-hostable.',
  E'## The Problem with Proposal Software Today\n\nIf you''ve ever tried to find affordable proposal software, you know the pain. Most tools start at $19-49 per user per month, lock essential features behind expensive tiers, and give you zero control over your data.\n\nPandaDoc removed pricing tables from their Starter plan. Proposify charges $49/user/month with no free tier. Qwilr locks custom branding behind their Business plan at $59/user/month.\n\n> For freelancers and small agencies, these prices are hard to justify when you''re sending 5-10 proposals a month.\n\n## Why Open Source?\n\nWe believe proposal software should be:\n\n- **Free to use** — The core features should cost nothing\n- **Self-hostable** — Your data, your servers, your rules\n- **Transparent** — See exactly how your tool works\n- **Community-driven** — Built by people who actually use it\n\n## What We''re Building\n\nPropsly is a full-featured proposal platform with:\n\n- **Interactive pricing tables** — Clients can select options, see totals update live\n- **View tracking** — Know when clients open your proposal and what they focus on\n- **E-signatures** — Get proposals signed without leaving the page\n- **Beautiful templates** — Start fast with professionally designed layouts\n- **Self-hosting** — Docker image for complete data control\n\n## The Business Model\n\nPropsly is licensed under AGPL-3.0. The core product is free forever. We''ll offer a managed cloud version with team features, AI copilot, and premium support for those who prefer not to self-host.\n\n## Join Us\n\nWe''re building in public and would love your input. Star us on GitHub, join our Discord, or just sign up to be notified when we launch.',
  'Propsly Team',
  'published',
  '2026-03-05'
),
(
  'proposal-pricing-strategies',
  '5 Pricing Strategies That Close More Proposals',
  'Your pricing table can make or break a deal. Here are five proven strategies to present pricing that wins.',
  E'## Why Pricing Presentation Matters\n\nYou can write the perfect proposal, but if your pricing section creates friction, you''ll lose the deal. Research shows that pricing is the most-viewed section of any proposal — clients spend 2-3x more time on pricing than any other part.\n\nHere are five strategies that consistently improve close rates.\n\n## 1. Offer Three Tiers\n\nThe classic good-better-best approach works because it anchors expectations. Your middle tier should be the one you actually want clients to choose. The premium tier makes it look reasonable by comparison.\n\n- **Basic** — Core deliverables only\n- **Standard** — Your recommended package (mark it as "Most Popular")\n- **Premium** — Everything plus extras\n\n## 2. Use Optional Line Items\n\nInstead of one fixed price, let clients customize. Add optional add-ons they can check or uncheck. This gives them a sense of control and often increases the total deal value.\n\n## 3. Show Value Before Price\n\nNever lead with the number. Structure your proposal so that by the time clients reach pricing, they fully understand the value. Use a summary of deliverables, expected outcomes, and ROI estimates above the pricing table.\n\n## 4. Break Down Large Numbers\n\nA $12,000 project feels expensive. "$4,000/month for 3 months" feels manageable. Break large totals into phases, milestones, or monthly payments to reduce sticker shock.\n\n## 5. Include a Deadline\n\nCreate urgency with an expiration date. "This proposal is valid for 14 days" gives clients a reason to decide now rather than later. Propsly lets you set automatic expiration dates on every proposal.\n\n## The Bottom Line\n\nYour pricing strategy is just as important as your actual prices. Present them well, and you''ll close more deals at higher values.',
  'Propsly Team',
  'published',
  '2026-03-03'
),
(
  'how-to-write-winning-proposal',
  'How to Write a Winning Proposal in 2026',
  'A step-by-step guide to creating proposals that stand out, build trust, and close deals faster.',
  E'## Start with the Client, Not Yourself\n\nThe biggest mistake in proposals is leading with "About Us." Your client doesn''t care about your company history — they care about their problem. Start by demonstrating you understand their situation.\n\n- Reference their specific challenges from your discovery call\n- Quote something they said back to them\n- Show you''ve done your research on their industry\n\n## Structure That Wins\n\nAfter analyzing thousands of successful proposals, here''s the structure that consistently performs best:\n\n## 1. Executive Summary\n\nTwo to three paragraphs maximum. Summarize the problem, your approach, and the expected outcome. Many decision-makers only read this section, so make it count.\n\n## 2. Understanding & Approach\n\nThis is where you prove you understand their needs. Outline the problem in detail, then explain your methodology. Be specific about what you''ll do and why.\n\n## 3. Scope & Deliverables\n\nList every deliverable clearly. Use bullet points. Include timelines for each phase. Ambiguity here leads to scope creep and unhappy clients later.\n\n## 4. Pricing\n\nPresent pricing clearly with line items. Consider offering tiers or optional add-ons. Make it easy for clients to understand exactly what they''re paying for.\n\n## 5. Social Proof\n\nInclude relevant case studies, testimonials, or logos. One great testimonial from a similar client is worth more than ten generic ones.\n\n## 6. Next Steps\n\nMake it crystal clear what happens after they say yes. Include a signature block and a timeline for getting started.\n\n## Design Matters\n\nA well-designed proposal signals professionalism. Use your brand colors, include your logo, and make sure it looks great on mobile — over 40% of proposals are first opened on a phone.\n\n## Follow Up\n\nDon''t just send and pray. Use view tracking to know when clients open your proposal, then follow up at the right moment. A well-timed follow-up can be the difference between winning and losing.',
  'Propsly Team',
  'published',
  '2026-03-01'
);
