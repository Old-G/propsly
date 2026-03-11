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

## What is Propsly?

Propsly is the **first open-source proposal platform** — create, send, track, and sign business proposals as interactive web pages.

### Features

- **Block Editor** — TipTap-powered editor with slash commands, images, videos, testimonials, dividers
- **Interactive Pricing** — Clients toggle optional rows, totals recalculate live
- **Content Variables** — `{{clientName}}`, `{{totalAmount}}` auto-resolved in viewer
- **E-Signatures** — Type or draw, auto-lock after signing
- **View Tracking** — Who opened, when, how long, which sections
- **Analytics** — Engagement score, section heatmap, views over time
- **Templates** — 10 built-in templates (web design, SaaS, consulting, etc.)
- **Contacts** — Client management with autocomplete in editor
- **PDF Export** — Print-to-PDF from browser, Gotenberg for Docker
- **Notifications** — Real-time proposal view notifications
- **Self-Hosted** — Docker setup, your data stays on your server

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, RSC, Server Actions) |
| Editor | TipTap (ProseMirror) with custom extensions |
| UI | Tailwind CSS v4 + shadcn/ui |
| Database | PostgreSQL (Supabase with RLS) |
| Auth | Supabase Auth (Google, GitHub OAuth) |
| Email | Resend |
| Charts | Recharts |
| Animations | Framer Motion |
| PDF | Browser print / Gotenberg (Docker) |

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 9+
- Supabase account (or local Supabase via CLI)

### Setup

```bash
git clone https://github.com/Old-G/propsly.git
cd propsly/propsly-apps
pnpm install

# Copy and fill environment variables
cp .env.example .env.local

# Run database migrations
npx supabase db push

# Start development
pnpm dev
```

The app runs at `http://localhost:3002`, landing at `http://localhost:3000`.

### Docker (Self-Hosted)

```bash
cd docker
cp ../.env.example ../.env
# Edit .env with your Supabase credentials
docker compose up -d
```

This starts the app on port 3002 and Gotenberg (PDF service) on port 3003.

## Project Structure

```
propsly-apps/
├── apps/
│   ├── web/          # Main app (dashboard, editor, viewer)
│   └── landing/      # Marketing site (propsly.org)
├── packages/
│   ├── db/           # Drizzle ORM, Zod schemas
│   ├── editor/       # TipTap extensions & components
│   ├── config/       # Shared TypeScript config
│   └── ui/           # Shared UI components
├── docker/           # Dockerfile + docker-compose
└── supabase/         # Migrations & config
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `RESEND_API_KEY` | No | Email notifications |
| `GOTENBERG_URL` | No | PDF service (Docker only) |

## Comparison

| Feature | Propsly | PandaDoc | Proposify | Qwilr |
|---------|---------|----------|-----------|-------|
| Open source | ✅ | ❌ | ❌ | ❌ |
| Self-hosted | ✅ | ❌ | ❌ | ❌ |
| Interactive pricing | ✅ Free | $49/user/mo | $49/user/mo | $59/user/mo |
| Block editor | ✅ | ✅ | ✅ | ✅ |
| View tracking | ✅ | ✅ | ✅ | ✅ |
| E-signatures | ✅ | ✅ | ✅ | ✅ |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Propsly is licensed under [AGPL-3.0](LICENSE).

- ✅ Free for personal and commercial use
- ✅ Free to self-host with no limits
- ⚠️ Derivative works must also be open-source

---

<p align="center">
  <sub>Cooked with ☕ & late nights</sub>
</p>
