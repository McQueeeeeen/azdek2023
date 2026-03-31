# Backend MVP (NestJS)

## Run

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run build
npm run start:dev
```

Server: `http://localhost:4000/v1`

Storage target: Supabase Storage (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`).

## Implemented MVP Endpoints

### Catalog

- `GET /v1/catalog/products`
- `GET /v1/catalog/products?category=laundry`
- `GET /v1/catalog/products/:slug`

### Cart

- `GET /v1/cart/:cartId`
- `POST /v1/cart/items`
- `PATCH /v1/cart/items/:cartId/:itemId`
- `DELETE /v1/cart/items/:cartId/:itemId`

`POST /v1/cart/items` body:

```json
{
  "productVariantId": "variant-uuid",
  "quantity": 2
}
```

Or with existing cart:

```json
{
  "cartId": "existing-cart-id",
  "productVariantId": "variant-uuid",
  "quantity": 1
}
```

### Checkout / Orders / Payments

- `POST /v1/checkout/confirm`
- `GET /v1/orders/:orderNumber`
- `POST /v1/payments/:paymentId/retry`
- `POST /v1/payments/webhooks/mock_kz`

### Customers / Shipments / Admin

- `GET /v1/customers`
- `GET /v1/customers/:customerId`
- `GET /v1/shipments/order/:orderId`
- `PATCH /v1/shipments/:shipmentId`
- `POST /v1/admin/products/:productId/images` (multipart field: `file`)

`POST /v1/checkout/confirm` body:

```json
{
  "cartId": "cart-id",
  "customerName": "Aliya Omar",
  "customerEmail": "aliya@example.kz",
  "customerPhone": "+77011234567",
  "deliveryCity": "Almaty",
  "deliveryAddress": "Abylai Khan 77",
  "deliveryMethod": "city",
  "paymentMethod": "card_online",
  "comment": "Please call before delivery"
}
```

Webhook example:

```json
{
  "eventId": "evt-001",
  "eventType": "payment.succeeded",
  "externalPaymentId": "mockpay_<order-id>",
  "externalTransactionId": "tx-7788",
  "status": "paid"
}
```

Header for idempotency:

- `x-event-id: evt-001`

Webhook signature headers (mock_kz provider):

- `x-webhook-timestamp: <unix_seconds>`
- `x-webhook-signature: sha256=<hex_hmac>`

Signing format:

- HMAC SHA-256 over `${timestamp}.${rawBody}` with `PAYMENT_WEBHOOK_SECRET_MOCK_KZ`

## Health / Ready

- `GET /v1/health`
- `GET /v1/ready`
