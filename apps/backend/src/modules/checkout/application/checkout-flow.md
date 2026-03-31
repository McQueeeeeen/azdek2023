# Checkout flow (backend source of truth)

1. Validate cart and pricing snapshot
2. Create order (`draft` or `pending_payment`)
3. Create payment record (`pending`)
4. Create provider payment session
5. Return redirect URL to frontend
6. Process webhook idempotently
7. Update payment state
8. Transition order state
9. Publish async notifications/events

