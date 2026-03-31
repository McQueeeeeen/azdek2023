# 04. База данных (Supabase Postgres)

## Подход

- Нормализованная схема + audit/event tables для критичных процессов
- UUID в качестве primary key
- Индексы на статусы, внешние ключи и поисковые поля
- Prisma как ORM-слой поверх Supabase Postgres

## Основные таблицы

- `products`, `product_variants`, `categories`, `brands`, `media_assets`
- `inventory_items`
- `customers`, `customer_groups`, `addresses`
- `carts`, `cart_items`
- `orders`, `order_items`, `order_status_history`
- `payments`, `payment_transactions`, `payment_events`
- `shipments`, `shipment_events`
- `promo_codes`, `discount_rules`
- `return_requests`, `refunds`
- `notifications`
- `legal_document_versions`
- `b2b_applications`, `invoices`

## Ключевые технические требования

- `idempotency_key` для webhook/payment операций
- Уникальность `external_transaction_id` в рамках провайдера
- Soft-delete для контентных и каталожных сущностей при необходимости
- Отдельные audit trails для финансовых операций
- Медиа хранится в Supabase Storage, в БД сохраняются ссылки/metadata
