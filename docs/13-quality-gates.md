# 13. Quality Gates

## Backend Integration Tests

Command:

- `npm run test:integration` (in `apps/backend`)

Coverage focus:

- auth
- catalog
- cart
- checkout
- orders
- payments + webhooks
- protected admin route checks

## Storefront E2E Smoke

Command:

- `npm run test:e2e` (in `apps/frontend`)

Scenarios:

- catalog -> product -> cart -> checkout pages render
- login + account flow smoke

## Pipeline Validation

GitHub Actions workflow:

- `.github/workflows/quality-gates.yml`

Gates include:

1. backend dependency install
2. `prisma migrate deploy`
3. `seed`
4. backend build
5. integration tests
6. frontend build
7. playwright browser install
8. storefront e2e smoke

## Required Environment in CI

- PostgreSQL 15+
- Redis 7+
- backend env vars for auth/payment/storage placeholders
- `QUEUE_WORKERS_ENABLED=false` for smoke/integration path
