# 02. Модули системы

## Catalog

- Product, ProductVariant, Category, Brand, MediaAsset
- Публичный каталог, фильтры, SEO-поля, наличие

## Cart

- Гостевая и авторизованная корзина
- Промежуточное сохранение, промокоды, пересчет

## Checkout

- Контакты -> доставка -> оплата -> подтверждение
- Создание заказа до оплаты

## Orders

- Order, OrderItem, история статусов, комментарии менеджера
- Возвраты/отмены/повторная оплата

## Payments

- Payment, PaymentTransaction, PaymentEvent
- Абстракция провайдера и webhook processing

## Shipments

- Delivery methods/zones, Shipment, ShipmentEvent, tracking

## Customers

- Профиль, адреса, сегменты, B2C/B2B тип

## B2B

- Заявки на сотрудничество, оптовые условия, ручное подтверждение
- Заказы без мгновенной оплаты, счет/ссылка

## Notifications

- Email/SMS/WhatsApp (поэтапно)
- Асинхронная отправка через очередь

## Content/CMS

- Главная, FAQ, юридические страницы, баннеры, статьи

## Admin Backoffice

- Управление товарами, заказами, клиентами, промокодами, доставкой и оплатой

