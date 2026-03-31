# 06. Payment Abstraction

## Интерфейс провайдера

```ts
interface PaymentProvider {
  createPaymentSession(input: CreatePaymentSessionInput): Promise<CreatePaymentSessionResult>;
  handleWebhook(input: HandleWebhookInput): Promise<HandleWebhookResult>;
  checkPaymentStatus(input: CheckPaymentStatusInput): Promise<CheckPaymentStatusResult>;
  refundPayment(input: RefundPaymentInput): Promise<RefundPaymentResult>;
  generatePaymentLink(input: GeneratePaymentLinkInput): Promise<GeneratePaymentLinkResult>;
}
```

## Поток оплаты

1. Checkout создает Order + Payment (`pending`)
2. Payments вызывает адаптер провайдера и создает transaction
3. Клиент уходит в hosted payment page
4. Источник истины: webhook/callback на backend
5. По webhook:
   - валидируется подпись
   - пишется `payment_event`
   - выполняется идемпотентная обработка
   - обновляются `payment_status` и `order_status`
6. В очередь отправляются уведомления и post-payment задачи

## Надежность

- Retry webhook handling
- Reconciliation job (периодическая сверка статусов)
- Dead letter queue для неуспешных внешних операций

