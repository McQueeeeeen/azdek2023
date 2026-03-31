# 10. Backend Core Contracts (MVP)

## Domain model (фиксировано на текущем этапе)

- `Category -> Product -> ProductVariant`
- `Cart -> CartItem -> ProductVariant`
- `Order -> OrderItem -> ProductVariant`
- `Order -> Payment -> PaymentTransaction`
- `Payment -> PaymentEvent`
- `Customer -> Address`

## Statuses

### Order

- `draft`
- `pending_confirmation`
- `pending_payment`
- `paid`
- `processing`
- `ready_for_shipment`
- `shipped`
- `delivered`
- `completed`
- `cancelled`
- `refunded`
- `partially_refunded`

### Payment

- `initiated`
- `pending`
- `authorized`
- `paid`
- `failed`
- `cancelled`
- `refunded`
- `partially_refunded`

## State transitions (MVP enforcement)

- `draft -> pending_payment -> paid`
- невалидные переходы отклоняются (`order-state-machine`)
- каждое изменение заказа пишется в `order_status_history`

## Payment abstraction

`PaymentProvider` contract:

- `createPaymentSession(order)`
- `handleWebhook(headers, body)`
- `checkPaymentStatus(externalPaymentId)`
- `refundPayment(externalPaymentId, amount)`
- `generatePaymentLink(order)`

Интеграция провайдера изолируется в `modules/payments/providers/*`.

## Webhook strategy

- webhook принимается `POST /v1/payments/webhooks/:provider`
- событие нормализуется провайдер-адаптером
- источник истины по оплате: webhook (не frontend redirect)
- подпись вебхука валидируется по `rawBody` до любых side effects
- запись `payment_event` обязательна до завершения обработки
- `payment_transaction` upsert по `provider + externalTransactionId`

## Idempotency rules

- `payment_event`: unique `(provider, externalEventId)`
- повторное событие возвращает `idempotent: true`
- `payment.idempotencyKey` уникален для командных операций
- критичные переходы выполняются внутри transaction
- invalid signature отклоняется с `401`

## Stable API contracts for storefront start (после stabilization)

- `GET /v1/catalog/products`
- `GET /v1/catalog/products/:slug`
- `POST /v1/cart/items`
- `PATCH /v1/cart/items/:cartId/:itemId`
- `DELETE /v1/cart/items/:cartId/:itemId`
- `POST /v1/checkout/confirm`
- `GET /v1/orders/:orderNumber`
- `POST /v1/payments/:paymentId/retry`
- `POST /v1/payments/webhooks/:provider`
- `GET /v1/customers`
- `GET /v1/customers/:customerId`
- `GET /v1/shipments/order/:orderId`
- `PATCH /v1/shipments/:shipmentId`
- `POST /v1/admin/products/:productId/images`

## DTO/Response stability rules (current)

- Денежные поля в API возвращаются как `number` (тенге).
- `cart` всегда возвращает `productVariant` внутри каждой позиции.
- `checkout/confirm` возвращает только контракт:
  - `orderId`
  - `orderNumber`
  - `paymentId?`
  - `paymentUrl?`
- `orders/:orderNumber` возвращает агрегат `customer + pricing + items + payments`.
- Webhook endpoint возвращает только ack-объект с флагом идемпотентности.

## Infra additions

- BullMQ queue: `payments-events`, `notifications`
- Storage adapter: Supabase Storage через backend service (`SupabaseStorageService`)
- Structured HTTP logs через `pino-http`
