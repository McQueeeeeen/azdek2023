# 11. Local Runtime (MVP Backend)

## Infra

```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d postgres redis
```

Prod target:

- Supabase Postgres as primary DB
- Supabase Storage as media storage
- Redis as separate service

## Backend bootstrap

```bash
cd apps/backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run start:dev
```

## Operational endpoints

- `GET /v1/health` -> liveness
- `GET /v1/ready` -> readiness (`postgres + redis`)

## Notes

- Storefront трек не стартует до фиксации DTO/checkout/order/payment contracts.
- Для production окружений использовать `prisma migrate deploy` вместо `migrate dev`.
- `DATABASE_URL` должен указывать на Supabase Postgres в stage/prod.
- Для внешнего доступа в dev/stage обычно удобнее Supabase pooler URL (`sslmode=require`).
