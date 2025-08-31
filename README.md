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
- Logo asset: place your logo at `web/public/logo.svg` (JSON-LD refers to it)

## Vercel Project Setup

- Use a single Vercel project (e.g., `crypto`) linked to this GitHub repo.
- Root Directory: `.`
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm --filter web build`
- Output Directory: leave empty (Next.js preset)

Environment variables (Vercel → Project Settings → Environment Variables):
- `NEXT_PUBLIC_SITE_URL` → e.g. `https://crypto-shinchan.vercel.app`（末尾スラッシュ・改行なし）
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_REVALIDATE_SECRET`（Webhook用）

Notes:
- Avoid separate Vercel projects for `web/` unless intentionally hosting a different app.
- If `web/.vercel` exists locally, remove it to prevent accidental linking; root `.vercel` is sufficient.

## CI (Web Build)
- This repo runs a GitHub Actions workflow at `.github/workflows/web-build.yml`.
- Environment: Node 20 + pnpm.
- Steps: `pnpm install --frozen-lockfile` → `pnpm --filter web build`.
- Trigger: push/PR to `main`. Fix failures based on Actions logs; merge only when green.

## Verification Checklist
- Open `/api/health` → JSONで `siteUrl` と環境が返る（秘密は出さない）
- Open `/blog` → 投稿が無くてもUIが崩れない（空状態表示）
- Open `/rss` → RSS XMLを返す（200）
- View source/meta → canonical/robots/OGが本番で正しいオリジン

## Notes on URL Normalization
`web/src/lib/site.ts` の `getSiteUrl()` が `NEXT_PUBLIC_SITE_URL` を正規化（`https://` 補完・余分な空白除去）します。コード上で `process.env.NEXT_PUBLIC_SITE_URL` を直接参照せず、`getSiteUrl()` を利用してください。
