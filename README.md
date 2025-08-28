# Crypto Shinchan Blog

This is a monorepo for the Crypto Shinchan blog, built with Next.js and Sanity.

For specs and agent workflow, see `CODEX.md`. Operational rules are documented in `OPERATING_RULES.md`.

## Local Development

To start the development servers for both the Next.js app and the Sanity Studio, run the following command:

```bash
pnpm dev
```

This will start:
- The Next.js app on `http://localhost:3000`
- The Sanity Studio on `http://localhost:3333`

## Features
- RSS feed: available at `/rss` (linked via `<link rel="alternate" type="application/rss+xml">`)

## Vercel Project Setup

- Use a single Vercel project (e.g., `crypto`) linked to this GitHub repo.
- Root Directory: `.`
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm --filter web build`
- Output Directory: leave empty (Next.js preset)

Notes:
- Avoid separate Vercel projects for `web/` unless intentionally hosting a different app.
- If `web/.vercel` exists locally, remove it to prevent accidental linking; root `.vercel` is sufficient.
