# 01. Финальная архитектура

## Подход

Система строится как **модульный монолит** с четкими доменными границами и API-контрактами между модулями.

## Технологическое решение

- Frontend: Next.js + TypeScript
- Backend: NestJS + TypeScript
- Database: Supabase Postgres
- Media storage: Supabase Storage
- Cache/Queues: Redis

## Принципы

- Заказ, платеж и доставка отделены как самостоятельные домены
- Критичные операции идемпотентны
- Внешние провайдеры изолируются адаптерами
- SQL-модель проектируется под PostgreSQL/Supabase
- Вебхуки валидируются подписью и пишутся в журнал событий
- Бизнес-логика находится на backend, не в UI

## Layered + Modular

- `Domain`: сущности, value objects, state transitions, инварианты
- `Application`: use cases, orchestration, transactions
- `Infrastructure`: DB, payment gateways, queues, email/sms adapters
- `Interface`: REST controllers, DTO, validation, auth guards

## Контекстные границы

- Catalog
- Cart
- Checkout
- Orders
- Payments
- Shipments
- Customers
- Promotions
- Notifications
- B2B
- Content/CMS
- Admin Backoffice

## Целевой результат MVP

- Каталог, карточки, корзина, checkout
- Заказ + онлайн-оплата + webhook
- Базовая доставка
- Уведомления
- Базовая админка товаров/заказов
- Юридические страницы
