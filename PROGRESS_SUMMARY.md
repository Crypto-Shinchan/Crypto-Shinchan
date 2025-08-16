# Project Progress Summary - Crypto Shinchan Blog

**Date:** 2025年8月14日 (Summary generated on 2025-08-14)

## Current Status

Based on the `GEMINI.md` specification, all automated setup tasks have been completed.

### Completed Tasks

- **Initial Setup:** Workspace, Next.js, Sanity, and all basic configurations are complete.
- **Library Installation:** All required dependencies have been installed.
- **Script Integration:** `pnpm` scripts for development and building are configured.
- **UI & Routing:** Core UI components, blog pages (list, detail, category, tag), search, and dark mode are implemented.
- **Sanity Integration:** Sanity client, queries, and schemas are fully set up.
- **SEO:** Sitemap, metadata, JSON-LD, OG images, and redirects are implemented.
- **Performance/ISR:** On-demand revalidation API route is created.
- **Analytics:** Google Analytics (GA4) component has been created and integrated. Awaiting user-provided ID.
- **CI/CD:**
  - A GitHub Actions workflow (`.github/workflows/ci.yml`) is set up to build the project on push/pull_request.
  - A weekly Sanity content backup workflow (`.github/workflows/sanity-backup.yml`) is also in place.

---

## Manual Configuration Required

The core development work is complete. To make the project fully operational, you need to perform the following manual setup steps:

### 1. Environment Variables (`.env.local`)

You need to fill in the placeholder values in the `/web/.env.local` file. These are critical for connecting to services.

- `SANITY_READ_TOKEN`: Your Sanity API token with read permissions.
- `SANITY_REVALIDATE_SECRET`: A secret key of your choice to secure the revalidation endpoint.
- `NEXT_PUBLIC_GA_ID`: Your Google Analytics 4 Measurement ID (e.g., `G-XXXXXXXXXX`).

### 2. Vercel Environment Variables

When you deploy this project to Vercel, you must set the same environment variables in your Vercel project settings.

### 3. GitHub Repository Secrets

For the Sanity backup workflow to function correctly, you must add the `SANITY_READ_TOKEN` as a secret to your GitHub repository settings.

- **Name:** `SANITY_READ_TOKEN`
- **Value:** Your Sanity API token with read permissions.

### 4. Sanity Webhook for Revalidation

To enable instant content updates on your live site (ISR), you need to configure a webhook in your Sanity project.

- **URL:** `https://<your-vercel-production-url>/api/revalidate`
- **Secret:** The same value you set for `SANITY_REVALIDATE_SECRET`.
- **Trigger on:** Create, Update, Delete events for your content types.

---

This project is now ready for you to add content, set the required secrets, and deploy.
