# Analytics Funnel (MVP)

## Events
- `page_view`
- `product_view`
- `add_to_cart`
- `begin_checkout`
- `payment_initiated`
- `purchase_success`
- `purchase_failure`

## Ingestion
- Public endpoint: `POST /v1/analytics/events`
- Internal server-side tracking:
  - cart add flow => `add_to_cart`
  - checkout confirm => `begin_checkout`
  - payment session create => `payment_initiated`
  - webhook paid/failed => `purchase_success` / `purchase_failure`

## Attribution
- Frontend sends `sessionId` and UTM fields:
  - `utmSource`
  - `utmMedium`
  - `utmCampaign`
- Checkout forwards `sessionId + UTM` into backend event stream.

## Dashboard
- Admin funnel endpoint: `GET /v1/admin/orders/analytics/funnel?windowDays=30`
- Includes:
  - totals by event type
  - conversion rates between key stages
  - daily points by event type
