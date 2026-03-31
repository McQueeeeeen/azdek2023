# Local QA Checklist (End-to-End)

## 1. Local startup order

1. First-time init (migrations + seed):

```bash
npm run dev:init
```

2. Daily start (full localhost):

```bash
npm run dev
```

This starts:
- Redis (`docker compose ... up -d redis`)
- NestJS backend
- Next.js frontend

## 2. Health checks

Backend:

- `GET http://127.0.0.1:4000/v1/health` -> `200`
- `GET http://127.0.0.1:4000/v1/ready` -> `200`, postgres + redis ready

Frontend:

- `GET http://127.0.0.1:3000` -> `200`

## 3. Automated local QA (Playwright)

Run smoke:

```bash
cd apps/frontend
npm run test:e2e
```

Run extended local QA:

```bash
cd apps/frontend
npm run test:e2e -- tests/local-qa.spec.ts
```

Coverage in `local-qa.spec.ts`:

- mobile rendering (catalog + product detail)
- cart empty state
- checkout loading state
- checkout API failure state
- unknown route (404)

## 4. Manual end-to-end visual flow

1. Home: `http://127.0.0.1:3000`
2. Catalog: open products and verify card rendering.
3. Product detail: verify CTA and navigation.
4. Cart: add item and verify totals.
5. Checkout: submit valid form.
6. Order confirmation: verify order number page opens.

Expected dev behavior:

- payment URL opens in a new tab (mock provider URL in local mode)

## 5. Dev-quality manual checks

- Loading states:
  - checkout button switches to `Creating order...`
- Empty states:
  - cart shows `Your cart is empty.`
- Error states:
  - checkout shows backend error text when API fails
- Responsive:
  - verify layout on 390x844 and desktop width
- Routes:
  - `/not-existing-route` returns 404 page

## 6. Notes

- Backend remains source of truth; frontend only consumes API contracts.
- Analytics event ingestion is idempotent and race-safe (duplicate key concurrent posts do not return 500).
- Keep `DATABASE_URL`, `REDIS_URL`, and `NEXT_PUBLIC_API_URL` aligned before demos.
