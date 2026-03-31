# Azdek 2023 E-commerce (KZ)

Production-oriented modular monolith for a household chemistry online store in Kazakhstan.

## Chosen Stack

- Frontend: Next.js (App Router), TypeScript
- Backend: NestJS, TypeScript, REST API
- DB: Supabase Postgres (managed PostgreSQL)
- Storage: Supabase Storage (product media/assets)
- Cache/Queue: Redis (BullMQ or equivalent)
- Infra: Docker, separate `dev/stage/prod`

## Why NestJS (vs Laravel)

- Single language (TypeScript) across frontend/backend reduces delivery friction
- Strong modular boundaries and dependency injection for clean architecture
- Mature ecosystem for queues, webhooks, validation, RBAC, observability
- Easy API-first development and future extraction to services if needed

## Repository Layout

- `docs` - architecture, modules, DB model, API, roadmap
- `apps/frontend` - storefront and future customer/b2b cabinet
- `apps/backend` - modular monolith business core
- `infrastructure` - Docker and DB assets

## Quick Start (after implementation grows)

1. Configure `.env` from `.env.example` for both apps
2. Use Supabase project for Postgres/Storage
3. Start local Redis (or Redis in managed infra)
4. Start backend
5. Start frontend

See `docs/09-roadmap.md` for delivery phases.
Backend core contracts: `docs/10-backend-core-contracts.md`.
Local runtime: `docs/11-local-runtime.md`.
