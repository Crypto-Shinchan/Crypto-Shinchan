# Project Progress Summary - Crypto Shinchan Blog

**Date:** 2025年8月19日

## Current Status

**✅ Initial setup and Vercel deployment complete.**

The project is now successfully deployed on Vercel, and the CI/CD pipeline is active. All foundational work outlined in `GEMINI.md` is finished. The remaining tasks involve manual configuration by the user.

**Production URL:** [https://crypto-shinchan-bxwcwlnr8-crypto-shinchans-projects.vercel.app](https://crypto-shinchan-bxwcwlnr8-crypto-shinchans-projects.vercel.app)

---

## Deployment Troubleshooting Summary (2025年8月19日)

A series of issues were encountered and resolved to enable a successful deployment on Vercel for this pnpm-based monorepo.

### Core Problem
Vercel's build system initially failed to correctly interpret the monorepo structure, leading to several cascading errors:
1.  **Incorrect Install Command:** Vercel defaulted to `npm install` instead of the configured `pnpm install`, causing dependency conflicts.
2.  **Missing Lockfile:** When `pnpm install` was forced, the build failed because the `pnpm-lock.yaml` file (located at the repository root) was not found in the `web` directory.
3.  **Incorrect Output Path:** After configuring the build to run from the repository root, Vercel could not locate the build artifacts due to an incorrect output directory path (`/web/web/.next/` instead of `/web/.next/`).

### Resolution Path
The deployment was fixed through an iterative process of adjusting Vercel dashboard settings:

1.  **Forcing `pnpm`:** A `web/vercel.json` file was temporarily used to force the `installCommand`. This confirmed `pnpm` could be used but led to the missing lockfile issue.
2.  **Adopting Monorepo Settings:** The configuration was moved to the Vercel dashboard.
    -   `Root Directory` was set to `.` (repository root) to allow `pnpm` to find the lockfile.
    -   `Build Command` was set to `pnpm --filter web build` to build only the Next.js application.
    -   `Output Directory` was initially set to `web/.next`, which caused the path duplication error.
3.  **Final Adjustment:** The `Output Directory` was corrected to `.next` (or empty), allowing Vercel's Next.js preset to correctly locate the build output within the `web` sub-directory.

### Final Vercel Configuration

-   **Framework Preset:** `Next.js`
-   **Root Directory:** `.` (Repository Root)
-   **Install Command:** `pnpm install --frozen-lockfile`
-   **Build Command:** `pnpm --filter web build`
-   **Output Directory:** `.next` (or empty)

---

## Completed Manual Configurations

All manual configurations have been successfully completed by the user:

-   **Vercel Environment Variables:** Configured in Vercel project settings.
-   **GitHub Repository Secrets:** Configured in GitHub repository settings.
-   **Sanity Webhook for Revalidation:** Configured in Sanity project settings.

The project is now fully set up and ready for further development. I am awaiting your next instructions.

---

## Recent Development & Troubleshooting (2025年8月21日 - Continued)

### UI Display Issue & Further Fixes

After successful build, user reported UI still not displaying correctly (white background, "ALL POST" only).

**Further Fixes Applied:**
1.  **`globals.css` Contrast Adjustment:** Adjusted `--background` and `--foreground` variables for better visual comfort in both light and dark modes.
2.  **Tailwind CSS `safelist` & Animation Definition:**
    *   Moved `keyframes` and `animation` definitions from `globals.css` to `web/tailwind.config.ts`'s `theme.extend` section to ensure proper Tailwind CSS processing.
    *   Added `safelist` to `web/tailwind.config.ts` to explicitly include dynamic classes used in `AuroraBackground.tsx`, preventing purging issues.
    *   Modified `web/components/AuroraBackground.tsx` to use the newly defined Tailwind animation classes (e.g., `animate-aurora-slow`) instead of arbitrary values (`animate-[aurora_...]`).
    *   Adjusted `AuroraBackground.tsx`'s root element `className` (e.g., `fixed inset-0 z-[1]`) and moved `backgroundColor` to `style` attribute.
    *   Modified `web/app/layout.tsx` to simplify the layout structure, place `AuroraBackground` directly under `body`, and wrap `children` in a `main` tag with explicit `z-[2]` for correct layering.
    *   Corrected `web/app/layout.tsx`'s `AuroraBackground` import path (removed extra space).

**Troubleshooting Build Errors during Fixes:**
1.  **`Module not found: Can't resolve ' @/components/AuroraBackground'`:** Resolved by removing an extra space in the import path in `layout.tsx`.
2.  **`Type error: Object literal may only specify known properties, and 'safelist' does not exist in type 'UserConfig'.`:**
    *   Initially, `safelist` was incorrectly placed within `theme.extend`.
    *   Corrected by moving `safelist` to the top-level `Config` object in `web/tailwind.config.ts`.
    *   This error persisted, indicating a potential issue with `tailwindcss` v4's `safelist` support or type definitions.
    *   **Downgraded `tailwindcss` from `^4` to `^3.4.1` in `web/package.json`** to ensure compatibility with `safelist` and the provided patch.
    *   Executed `pnpm install` to update dependencies.
    *   Executed `pnpm store prune && pnpm install` to clean `pnpm` cache and reinstall dependencies, resolving a `Can't resolve 'tailwindcss'` error.

### Current Status

All code modifications related to UI display and build issues have been applied. The project now builds successfully. The next critical step is to successfully start the local development server using `pnpm dev` and verify the UI. User reported "white background, ALL POST only" after an attempt to run `pnpm dev`, but the exact output of `pnpm dev` is still pending.

---

## Progress Log — 2025年8月27日（Codex 移行・ビルド/デプロイ整備）

### What Changed (Docs/Config)
- Added: `CODEX.md`（Codex向け実行ガイド）
- Updated: `blogspec.txt`（“Gemini CLI”→“Codex CLI”）
- Renamed/Updated: `CODEX_HANDOVER.md`（旧 `COEDEX_HANDOVER.md`）
- Added: `OPERATING_RULES.md`（運用ルールの正本）
- Updated: `README.md`（CODEX/運用ルールへの導線）
- Added: `.env.example`（APIキーは空のプレースホルダ）
- Added: `web/vercel.json`（pnpmでのwebサブディレクトリビルド指示）
- Added: `vercel.json`（ルート、pnpmインストール＋webビルド、出力パス指定）

### What Changed (Web App)
- `web/src/lib/sanity.client.ts`: 環境変数駆動（未設定時は既存プロジェクトIDにフォールバック）
- `web/src/app/blog/page.tsx`: Sanityからの一覧取得＋`PostGrid`で描画、`Layout`でラップ

### Builds (Local / Prod-equivalent)
- `pnpm --filter web build`: 成功（Next 14.2.5）
- `vercel build`（web配下）: 成功（.vercel/output 生成）

### Deployments
- Preview: https://blog-lc75ehonl-crypto-shinchans-projects.vercel.app
- Production: https://blog-r6w6dth4h-crypto-shinchans-projects.vercel.app

### Notes
- APIキーは生成・使用せず。外部APIの自動消費なし。
- Vercelはpnpmでのモノレポ構成に合わせ、ルート/`web`双方の`vercel.json`を整備。

### Next Tasks (Approved, pending implementation)
- Theme: ダーク/ライト切替の本導入、背景と本文のコントラスト最適化
- SEO強化候補:
  - generateMetadataへ canonical/robots/twitter追加
  - レイアウトで `WebSite`/`Organization` JSON-LD 配信
  - `next-sitemap` の `siteUrl` を環境変数化、ドラフト除外、lastmod/priority設定
  - RSS配信 `/app/rss/route.ts`
  - 旧WP→新URLのredirects最終化

---

## Progress Log — 2025年8月27日（テーマ切替・SEO最小強化・再デプロイ）

### What Changed (Theme/UI)
- Tailwind: `darkMode: 'class'` を有効化（`web/tailwind.config.ts`）
- ルートレイアウト: `ThemeProvider` を適用し、ハードコードの `text-white` を撤去（`web/src/app/layout.tsx`）
- グローバルスタイル: CSS変数で `.dark` 切替、`body` に背景色/文字色を適用（`web/src/app/globals.css`）
- Aurora背景: ライトモードでは非表示に（`hidden dark:block`、`web/src/components/AuroraBackground.tsx`）
- レイアウト/ヘッダー: ライト/ダーク両対応でコントラスト最適化（`web/src/components/Layout.tsx`, `HeaderBasic.tsx`）

### What Changed (SEO Minimal)
- 記事ページmetadataに `canonical` / `robots` / `twitter` を追加（`web/src/app/blog/[slug]/page.tsx`）
- `next-sitemap` の `siteUrl` を `NEXT_PUBLIC_SITE_URL` 駆動へ（`web/next-sitemap.config.js`）

### Builds
- `pnpm --filter web build`: 成功（Next 14.2.5）

### Deployments
- Preview: https://blog-ubhkkds8t-crypto-shinchans-projects.vercel.app
- Production: https://blog-95mqkt3xl-crypto-shinchans-projects.vercel.app

### Notes
- APIキーは生成/使用せず。外部APIの自動消費なし。
- ルート/`web` それぞれの `vercel.json` により、pnpmモノレポのビルド/デプロイが安定。

### Next Tasks (Proposed)
- SEO強化（次回の着手候補）
  - レイアウトに `WebSite` / `Organization` JSON-LD を追加（`globalSettings` と `NEXT_PUBLIC_SITE_URL` を併用）
  - ルートで `metadataBase` と既定 `openGraph/twitter/robots` を共通化
  - `next-sitemap` を拡張（priority / changefreq / lastmod、カテゴリ/タグ索引）
  - RSS配信（`/app/rss/route.ts`）と `<link rel="alternate" type="application/rss+xml">`
  - /blog のページネーションと内部リンク（前後記事/関連記事強化）
  - 旧WP→新URLの301最終化（`web/next.config.mjs` の `redirects()`）

### Next Session – Kickoff Checklist
- 動作確認: `/blog` のライト/ダーク切替とコントラストを再チェック
- 環境変数: `NEXT_PUBLIC_SITE_URL` を本番URLへ設定
- 着手項目の選定: 上記SEO強化のどれから始めるか決定

---

## Progress Log — 2025年8月28日（CIによるビルド検証の明文化）

### What Changed (CI/Rules)
- 追加: `.github/workflows/web-build.yml`（Node 20 + pnpm で `pnpm --filter web build`）
- 運用: push/PR 時に自動ビルド。失敗時はActionsログを基に修正。main への反映はCIグリーンを条件に。
- ドキュメント更新: `OPERATING_RULES.md` にCI主体フローを明記、`README.md` にCI項目を追記。

### Notes
- ローカルの `vercel build` は任意（本番相当の検証が必要な場合のみ利用）。
- 生成物（`web/public/sitemap.xml` 等）はコミット対象外の方針を継続。

---

## Progress Log — 2025年8月28日（SEO/OGP/UI最適化・ページネーション導入）

### What Changed (SEO/Meta/Feeds)
- ルート共通SEO: `layout.tsx` に `metadataBase/title template/robots/openGraph/twitter` を実装。
- JSON-LD: `WebSite`/`Organization` を全ページ配信、記事ページは `Article`/Breadcrumb を既存強化。
- RSS: `/rss` を追加し `alternates.types` にリンク。
- next-sitemap: `priority/changefreq/lastmod` 付与、`/api/*` 等を除外、`siteUrl` をENV駆動。
- 301リダイレクト: `/feed→/rss`, `/category/:→/blog/category/:`, `/tag/:→/blog/tag/:`, 日付付き→`/blog/:slug`。

### What Changed (Routing/Pagination)
- 一覧ページ: `/blog` にページネーション導入、`/blog/page/[page]` を静的生成。
- カテゴリ・タグ: 1ページ目＋`/page/[page]` を追加、`generateStaticParams` で全ページを生成。
- UI: `Pagination` コンポーネントを共通利用、canonical/robots を各ページに追加。

### What Changed (Navigation/UI)
- パンくずUI: `Breadcrumbs` を記事/カテゴリ/タグに追加。
- 前後記事: `PostNav` を記事フッターに追加（公開日時ベース）。
- 関連記事: カテゴリ＋タグ一致でスコアリングして上位3件に改善。
- メタチップ: 記事ヘッダーにカテゴリ/タグの内部リンクを追加。

### Deploy Notes (crypto)
- Vercel Prebuilt を無効化し、Next.js 標準ビルド（Root=web）に統一。
- このコミットで再デプロイをトリガー（設定変更反映確認用）。

### What Changed (Images/OGP)
- PostCard: 16:9固定・`next/image` fill + sizes・LQIP対応・先頭3件を `priority` に。
- Sanity画像最適化: `coverImageUrl()` で `webp`/`q=80`/crop を付与。
- OGP: `/og` デザインをブランド準拠（ロゴ・グラデ・ドメイン表示）。
- アセット: `public/logo.svg` を追加し、JSON-LDのロゴ参照を統一。

### Infra/Docs
- CI: `.github/workflows/web-build.yml` を追加（Node 20 + pnpm、`pnpm --filter web build`）。
- Nodeバージョン: `.nvmrc` で 20 を明示。
- Vercel設定: ルート `vercel.json` を最小化、モノレポの `web` ビルドに統一。
- 環境変数: `.env.example` に `NEXT_PUBLIC_SITE_URL` を追加。README/運用ルールを更新。

### Validation
- ローカル: Node 20 で `pnpm --filter web build` 成功。`NEXT_PUBLIC_SITE_URL` 設定後、sitemap/RSSに本番ドメイン反映。
- CI: push/PR 時に自動ビルドで検証（失敗時はActionsログを根拠に修正）。

### Next (Optional)
- 画像さらに最適化（LCP改善・OGデザイン微調整）。
- 一覧/カードの内部リンク導線の微調整。
- 旧URLの最終リストに合わせたリダイレクトの追補。
