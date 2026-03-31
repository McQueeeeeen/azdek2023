# 05. API Design (REST, API-first)

## Public API

- `GET /catalog/products`
- `GET /catalog/products/:slug`
- `GET /catalog/categories`
- `POST /cart/items`
- `PATCH /cart/items/:id`
- `DELETE /cart/items/:id`
- `POST /checkout/preview`
- `POST /checkout/confirm`
- `GET /orders/:orderNumber`
- `POST /payments/:paymentId/retry`

## Payment/Webhook API

- `POST /payments/webhooks/:provider`
- `POST /payments/:paymentId/refund`
- `POST /payments/:paymentId/link`

## B2B API

- `POST /b2b/applications`
- `GET /b2b/prices` (auth)
- `POST /b2b/orders`

## Admin API

- `GET /admin/orders`
- `PATCH /admin/orders/:id/status`
- `PATCH /admin/orders/:id/payment-status`
- `PATCH /admin/orders/:id/shipment`
- `CRUD /admin/products`
- `CRUD /admin/customers`
- `CRUD /admin/promocodes`
- `CRUD /admin/content/pages`

## API Правила

- Версионирование: `/v1`
- OpenAPI/Swagger как источник контракта
- Идемпотентность: заголовок `Idempotency-Key` для критичных POST
- Correlation ID в логах и ответах

