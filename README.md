<p align="center">
  <h1 align="center">Propsly</h1>
  <p align="center">
    The open-source proposal builder.
    <br />
    Create beautiful proposals. Track engagement. Close deals.
    <br />
    <br />
    <a href="https://propsly.org">Website</a>
    ·
    <a href="https://github.com/Old-G/propsly/issues">Issues</a>
    ·
    <a href="https://propsly.org/blog">Blog</a>
  </p>
</p>

<p align="center">
  <a href="https://github.com/Old-G/propsly/stargazers"><img src="https://img.shields.io/github/stars/Old-G/propsly" alt="GitHub stars"></a>
  <a href="https://github.com/Old-G/propsly/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-AGPL--3.0-blue" alt="License"></a>
  <a href="https://propsly.org"><img src="https://img.shields.io/badge/website-propsly.org-brightgreen" alt="Website"></a>
</p>

---

## The Problem

Proposal software is broken:

- **PandaDoc** charges $49/user/mo and just removed pricing tables from their Starter plan
- **Proposify** charges $49/user/mo
- **Qwilr** charges $59/user/mo
- A team of 5 pays **$250+/month** for what's essentially a document editor with tracking

Meanwhile, open-source has solved e-signatures (Documenso, DocuSeal, OpenSign) — but **nobody has built the proposal creation tool itself**.

## What is Propsly?

Propsly is the **first open-source proposal platform** — a complete tool for creating, sending, tracking, and signing business proposals.

### Planned Features

- 🧱 **Block Editor** — Drag-and-drop proposal builder (powered by TipTap)
- 💰 **Interactive Pricing** — Clients toggle options, totals recalculate live
- 🌐 **Proposals as Web Pages** — Send a link, not a PDF. Responsive, branded, always up to date
- 📊 **View Tracking** — Know who opened, when, and how long on each section
- ✍️ **E-Signatures** — Sign directly on the proposal page
- 💳 **Payments** — Collect payment right after signature (Stripe)
- 🤖 **AI-Powered** — Generate proposals from a brief, rewrite sections, smart follow-ups
- 🏠 **Self-Hostable** — One-command Docker setup. Your data stays on your server

### Planned Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16+ (App Router, RSC, Server Actions) |
| Editor | TipTap (ProseMirror) |
| State | Zustand + TanStack Query |
| Validation | Zod |
| UI | Tailwind CSS v4 + shadcn/ui |
| ORM | Drizzle ORM |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth (Google, GitHub, email) |
| AI | Vercel AI SDK (OpenAI, Anthropic, Ollama) |
| Payments | Stripe Connect |
| Email | Resend + React Email |
| Deploy | Docker + Vercel |

## Status

🟡 **Pre-development** — We're validating demand before building.

The landing page is live at [propsly.org](https://propsly.org). If you'd use an open-source proposal builder, **[sign up](https://propsly.org/signup)** — it helps us decide to build this.

If we hit critical mass, development starts on the full platform.

## Why Open Source?

- **No vendor lock-in** — self-host on your own infrastructure
- **No artificial feature gating** — all core features available for free
- **GDPR-friendly** — your proposal data never leaves your server
- **Community-driven** — you decide what gets built next
- **Transparent** — see exactly how your data is handled

## Comparison

| Feature | Propsly (planned) | PandaDoc | Proposify | Qwilr |
|---------|-------------------|----------|-----------|-------|
| Open source | ✅ | ❌ | ❌ | ❌ |
| Self-hosted | ✅ | ❌ | ❌ | ❌ |
| Interactive pricing | ✅ Free | $49/user/mo | $49/user/mo | $59/user/mo |
| Block editor | ✅ | ✅ | ✅ | ✅ |
| View tracking | ✅ | ✅ | ✅ | ✅ |
| E-signatures | ✅ | ✅ | ✅ | ✅ |
| AI generation | ✅ | Partial | ❌ | ❌ |
| Custom domain | ✅ | Enterprise only | ❌ | Enterprise only |

## Get Involved

We're in the validation phase. Here's how to help:

- ⭐ **Star this repo** — it signals demand and motivates development
- 📝 **[Sign up](https://propsly.org/signup)** — create an account, tell us what features you need
- 💬 **[Open an issue](https://github.com/Old-G/propsly/issues)** — request features, report bugs, share ideas
- 🐦 **[Follow on X](https://x.com/oldg9516)** — build-in-public updates

## License

Propsly is licensed under [AGPL-3.0](LICENSE).

- ✅ Free for personal and commercial use
- ✅ Free to self-host with no limits
- ⚠️ Derivative works must also be open-source
- 💼 Commercial license available for proprietary modifications (coming soon)

---

<p align="center">
  <sub>Cooked with ☕ & late nights</sub>
</p>
