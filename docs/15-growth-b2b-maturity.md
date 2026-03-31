# Growth + B2B + Maturity (Current Increment)

## Retention/Growth APIs
- `POST /v1/orders/:orderNumber/reorder` (customer/b2b_customer)
- `GET /v1/catalog/products/:slug/recommendations?limit=3`
- `POST /v1/admin/orders/retention/abandoned-carts/run?hours=4`

## B2B Cabinet API
- `GET /v1/b2b/account/me` (role: `b2b_customer`)
- Returns:
  - customer profile
  - recent orders
  - latest B2B application status
  - basic conditions block for wholesale workflow

## Production Maturity Baseline
- Funnel analytics dashboard endpoint for admin:
  - `GET /v1/admin/orders/analytics/funnel?windowDays=30`
- Health/readiness checks are available:
  - `GET /v1/health`
  - `GET /v1/ready`
- Migration + seed + integration/e2e gates are active in CI.
