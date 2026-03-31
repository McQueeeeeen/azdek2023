# 03. Доменная модель и связи

## Ключевые сущности

- Product
- ProductVariant
- Category
- Brand
- InventoryItem
- Customer
- CustomerGroup
- Address
- Cart
- CartItem
- Order
- OrderItem
- Payment
- PaymentTransaction
- PaymentEvent
- Shipment
- ShipmentEvent
- PromoCode
- DiscountRule
- ReturnRequest
- Refund
- Notification
- LegalDocumentVersion
- B2BApplication
- Invoice
- MediaAsset

## Критичные связи

- `Order 1..* OrderItem`
- `Order 1..* Payment`
- `Payment 1..* PaymentTransaction`
- `Payment 1..* PaymentEvent`
- `Order 1..* Shipment`
- `Shipment 1..* ShipmentEvent`
- `Customer 1..* Address`
- `Customer 1..* Order`

## State Machines (разделены)

### OrderStatus

- draft
- pending_confirmation
- pending_payment
- paid
- processing
- ready_for_shipment
- shipped
- delivered
- completed
- cancelled
- refunded
- partially_refunded

### PaymentStatus

- initiated
- pending
- authorized
- paid
- failed
- cancelled
- refunded
- partially_refunded

### ShipmentStatus

- pending
- prepared
- handed_to_courier
- in_transit
- delivered
- failed
- returned

## Основная инвариантная мысль

Нельзя сливать жизненные циклы в один `order_status`: платеж и доставка живут отдельно и синхронизируются через доменные события.

