# 18. Vercel + Supabase Deployment

## Goal

Keep the storefront on Vercel and the data layer on Supabase, with the backend using Supabase Postgres and Supabase Storage.

## Required Environment

### Frontend

- `NEXT_PUBLIC_SITE_URL=https://adzek.vercel.app`
- `NEXT_PUBLIC_API_URL=<backend-public-url>/v1`

### Backend

- `DATABASE_URL=<Supabase Postgres pooler URL>`
- `SUPABASE_URL=<project-url>`
- `SUPABASE_ANON_KEY=<anon-key>`
- `SUPABASE_SERVICE_ROLE_KEY=<service-role-key>`
- `SUPABASE_STORAGE_BUCKET=product-media`
- `FRONTEND_ORIGIN=https://adzek.vercel.app`

## Operational Notes

- Vercel should host the Next.js app only.
- The backend remains the source of truth for catalog, cart, checkout, orders, auth, and admin operations.
- Supabase Storage is used for product media uploads and public URLs.
- After changing database schema, run Prisma migrations against the Supabase database before deploying the backend.

## Minimum Deployment Sequence

1. Apply Prisma migrations to Supabase Postgres.
2. Seed or synchronize catalog data if needed.
3. Deploy backend with production env vars.
4. Set frontend env vars in Vercel.
5. Verify `/catalog`, `/login`, `/checkout`, and `/admin` flows against the deployed API.
