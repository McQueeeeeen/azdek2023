# Growth Operating System (Production Layer)

## 1. Event Tracking Contract
`POST /v1/analytics/events`

Required fields:
- `idempotencyKey`
- `eventType`
- `sessionId`
- `utmSource`
- `utmMedium`
- `utmCampaign`
- `channelGroup`
- `occurredAt`

Implemented funnel coverage:
- `session_started`
- `page_view`
- `product_view`
- `add_to_cart`
- `begin_checkout`
- `payment_initiated`
- `purchase_success`
- `purchase_failure`

## 2. Attribution
- Customer-level:
  - `firstTouch*` and `lastTouch*` are stored on `Customer`.
- Order-level:
  - `source`, `sessionId`, `utm*`, `channelGroup`, `firstTouch*` are stored on `Order`.
- Checkout applies touch attribution and snapshots it into order.

## 3. Reporting Layer
Schema: `analytics_mart`

Materialized views:
- `fact_funnel_daily`
- `fact_orders`
- `fact_order_unit_economics`
- `fact_retention_cohorts`
- `fact_sku_daily`
- `fact_b2b_daily`
- `fact_operations_daily`

Refresh function:
- `SELECT analytics_mart.refresh_growth_marts();`

Auto refresh:
- hourly via `pg_cron` job `refresh_growth_marts_hourly` (best effort on Supabase).

## 4. Growth Admin APIs
All endpoints are under `admin/growth` with owner/manager protection.

- `POST /v1/admin/growth/marts/refresh`
- `POST /v1/admin/growth/channels/spend`
- `POST /v1/admin/growth/orders/:orderId/costs`
- `GET /v1/admin/growth/experiments`
- `POST /v1/admin/growth/experiments`
- `PATCH /v1/admin/growth/experiments/:experimentId`
- `GET /v1/admin/growth/weekly-reviews`
- `POST /v1/admin/growth/weekly-reviews`

## 5. BI Layer (Metabase Local)
Docker service: `metabase`

Run:
```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
```

Open:
- http://localhost:3001

Connect Metabase to Postgres/Supabase and build dashboard blocks:
- Executive
- Funnel
- Channels
- Unit Economics
- SKU
- Retention
- B2B
- Operations

## 6. First Growth OS Cycle
Seed creates:
- one `WeeklyReview`
- three `GrowthExperiment` records

Use those as the first weekly ritual baseline (`scale / fix / stop`).
