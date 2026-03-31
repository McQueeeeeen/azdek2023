# 12. Production Readiness

## Observability

- Request logging is enabled globally via middleware.
- Health endpoints:
  - `GET /v1/health`
  - `GET /v1/ready`
- Payment diagnostics endpoint:
  - `GET /v1/admin/orders/:orderId/payment-diagnostics`

## Error Tracking

- Domain errors are mapped through global exception filter.
- Recommended next integration: Sentry/OpenTelemetry exporter for NestJS.

## Payment/Webhook Diagnostics

- Payment events and transactions stored in dedicated tables:
  - `PaymentEvent`
  - `PaymentTransaction`
- Webhook signature validation is enforced before transitions.
- Idempotency is enforced before side effects.

## Secret Rotation

Rotate these in stage/prod and redeploy:

- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `PAYMENT_WEBHOOK_SECRET_MOCK_KZ`
- `SUPABASE_SERVICE_ROLE_KEY`
- database and redis credentials

## CI/CD Migrations

Recommended release sequence:

1. `pnpm --filter @azdek/backend build`
2. `pnpm --filter @azdek/backend prisma:status`
3. `pnpm --filter @azdek/backend prisma:deploy`
4. `pnpm --filter @azdek/backend seed` (only in controlled envs)
5. Deploy backend app
6. Smoke test `health/ready`, checkout and webhook flow

## Staging/Prod Readiness

- Separate env files and secrets per environment.
- Restrict admin routes behind auth + RBAC only.
- Keep webhook endpoints publicly reachable but signature-validated.
- Disable any debug/dev credentials before production launch.
