# Project Progress Summary - Crypto Shinchan Blog

**Date:** 2025年8月18日

## Current Status

Vercelへのデプロイ中に問題が発生しており、現在その解決に取り組んでいます。

### Completed Tasks (Previous)

-   **Initial Setup:** Workspace, Next.js, Sanity, and all basic configurations are complete.
-   **Library Installation:** All required dependencies have been installed.
-   **Script Integration:** `pnpm` scripts for development and building are configured.
-   **UI & Routing:** Core UI components, blog pages (list, detail, category, tag), search, and dark mode are implemented.
-   **Sanity Integration:** Sanity client, queries, and schemas are fully set up.
-   **SEO:** Sitemap, metadata, JSON-LD, OG images, and redirects are implemented.
-   **Performance/ISR:** On-demand revalidation API route is created.
-   **Analytics:** Google Analytics (GA4) component has been created and integrated. Awaiting user-provided ID.
-   **CI/CD:**
    -   A GitHub Actions workflow (`.github/workflows/ci.yml`) is set up to build the project on push/pull_request.
    -   A weekly Sanity content backup workflow (`.github/workflows/sanity-backup.yml`) is also in place.

### Manual Configuration Required (Previous)

-   Environment Variables (`.env.local`)
-   Vercel Environment Variables
-   GitHub Repository Secrets
-   Sanity Webhook for Revalidation

---

## Today's Work Summary (2025年8月18日)

### Issues Encountered

1.  **Vercel Deployment Error (404 NOT_FOUND)**: Initial deployments resulted in a 404 error, indicating that the application was not correctly built or served.
2.  **Git Submodule Issue**: `web` and `studio` directories were treated as Git submodules, preventing proper tracking of changes by the main repository.
    -   **Resolution**: Removed `.git` directories from `web` and `studio`, and updated the Git index to treat them as regular directories within the monorepo.
3.  **Vercel Build Command Issue (`npm install` instead of `pnpm install`)**: Despite setting `Install Command` to `pnpm install --frozen-lockfile` in Vercel, the build process continued to execute `npm install`, leading to dependency resolution errors (e.g., `next@14.2.5` vs. `next-sanity` requiring `next@^15.1`).
    -   This suggests Vercel might not be correctly detecting the `pnpm` package manager or the `Next.js` framework preset.

### Actions Taken

-   Attempted multiple Vercel deployments.
-   Removed `web/vercel.json` to rely on Vercel's auto-detection.
-   Removed `.git` directories from `web` and `studio` and committed the changes.
-   Executed `vercel link` and `vercel env pull .env.local` within the `web` directory.
-   Requested user to confirm/set Vercel dashboard settings:
    -   `Root Directory`: `web`
    -   `Build Command`: `pnpm build`
    -   `Install Command`: `pnpm install --frozen-lockfile`
    -   `Output Directory`: Empty or `.next`
    -   `Framework Preset`: `Next.js`

## Next Steps / ToDo

-   **Verify Vercel Dashboard Settings**: Await user confirmation that all Vercel dashboard settings (especially `Framework Preset` as `Next.js` and `Install Command` as `pnpm install --frozen-lockfile`) are correctly applied.
-   **Re-attempt Deployment**: Once settings are confirmed, re-attempt deployment.
-   **Address Dependency Conflict (if `pnpm` issue resolved)**: If Vercel successfully uses `pnpm`, address the `next` version conflict (`next@14.2.5` vs. `next-sanity` requiring `next@^15.1`). This may involve:
    -   Upgrading `next` to `^15.1` (if compatible with other dependencies).
    -   Using `pnpm`'s `overrides` feature in `package.json` to force a specific `next` version.
-   **Apply "確定パッチ" (if 404 persists)**: If the 404 error persists after resolving the build issues, apply the "確定パッチ" provided by the user (e.g., redirecting `/` to `/blog` in `web/app/page.tsx`, simplifying `next.config.mjs`).
-   **Consider Vercel Support**: If Vercel continues to ignore `pnpm` or fails to detect Next.js correctly despite all settings, consider contacting Vercel support for assistance with monorepo deployment.