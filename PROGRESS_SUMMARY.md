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