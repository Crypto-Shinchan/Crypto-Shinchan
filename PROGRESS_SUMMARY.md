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