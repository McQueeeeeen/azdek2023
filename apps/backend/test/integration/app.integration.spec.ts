import { INestApplication } from "@nestjs/common";
import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import * as request from "supertest";
import { createHmac } from "crypto";
import { createApp } from "../../src/app.factory";

describe("Integration: auth/catalog/cart/checkout/orders/payments/webhooks", () => {
  jest.setTimeout(120000);

  let app: INestApplication;
  let accessToken = "";
  let orderNumber = "";
  let orderId = "";

  beforeAll(async () => {
    const created = await createApp();
    app = created.app;
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("auth login returns access+refresh", async () => {
    const res = await request(app.getHttpServer()).post("/v1/auth/login").send({
      email: "owner@azdek.local",
      password: "Owner123!",
    });

    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
    accessToken = res.body.accessToken;
  });

  it("catalog returns products", async () => {
    const res = await request(app.getHttpServer()).get("/v1/catalog/products");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("accepts page_view analytics event", async () => {
    const sessionId = `sess_${Date.now()}`;
    const res = await request(app.getHttpServer()).post("/v1/analytics/events").send({
      idempotencyKey: `it-page-view-${sessionId}`,
      eventType: "page_view",
      sessionId,
      utmSource: "integration_test",
      utmMedium: "cpc",
      utmCampaign: "it_campaign",
      channelGroup: "paid_search",
      occurredAt: new Date().toISOString(),
      metadata: { path: "/catalog" },
    });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();
  });

  it("cart -> checkout -> webhook paid flow", async () => {
    const products = await request(app.getHttpServer()).get("/v1/catalog/products");
    const variantId = products.body[0].variants[0].id;

    const cart = await request(app.getHttpServer()).post("/v1/cart/items").send({
      productVariantId: variantId,
      quantity: 1,
    });

    expect(cart.status).toBe(201);

    const checkout = await request(app.getHttpServer()).post("/v1/checkout/confirm").send({
      cartId: cart.body.id,
      customerName: "Integration Test",
      customerEmail: "integration@test.kz",
      customerPhone: "+77019990000",
      deliveryCity: "Almaty",
      deliveryAddress: "Street 1",
      deliveryMethod: "city",
      paymentMethod: "card_online",
    });

    expect(checkout.status).toBe(201);
    expect(checkout.body.orderNumber).toBeTruthy();
    orderNumber = checkout.body.orderNumber;
    orderId = checkout.body.orderId;

    const eventId = `evt_${Date.now()}`;
    const payload = {
      eventId,
      eventType: "payment.paid",
      externalPaymentId: `mockpay_${orderId}`,
      externalTransactionId: `txn_${Date.now()}`,
      status: "paid",
    };

    const rawBody = JSON.stringify(payload);
    const ts = Math.floor(Date.now() / 1000);
    const secret = process.env.PAYMENT_WEBHOOK_SECRET_MOCK_KZ as string;
    const signature = createHmac("sha256", secret).update(`${ts}.${rawBody}`).digest("hex");

    const webhook = await request(app.getHttpServer())
      .post("/v1/payments/webhooks/mock_kz")
      .set("x-webhook-timestamp", String(ts))
      .set("x-webhook-signature", `sha256=${signature}`)
      .set("x-event-id", eventId)
      .send(payload);

    expect(webhook.status).toBe(201);
    expect(webhook.body.ok).toBe(true);

    const order = await request(app.getHttpServer()).get(`/v1/orders/${orderNumber}`);
    expect(order.status).toBe(200);
    expect(order.body.paymentStatus).toBe("paid");
  });

  it("invalid webhook signature is rejected", async () => {
    const payload = {
      eventId: `evt_invalid_${Date.now()}`,
      eventType: "payment.paid",
      externalPaymentId: `mockpay_${orderId}`,
      externalTransactionId: `txn_invalid_${Date.now()}`,
      status: "paid",
    };

    const res = await request(app.getHttpServer())
      .post("/v1/payments/webhooks/mock_kz")
      .set("x-webhook-timestamp", String(Math.floor(Date.now() / 1000)))
      .set("x-webhook-signature", "sha256=deadbeef")
      .set("x-event-id", payload.eventId)
      .send(payload);

    expect(res.status).toBe(401);
    expect(res.body.code).toBe("INVALID_WEBHOOK_SIGNATURE");
  });

  it("protected admin route requires auth", async () => {
    const unauthorized = await request(app.getHttpServer()).get("/v1/admin/promos");
    expect(unauthorized.status).toBe(401);

    const authorized = await request(app.getHttpServer())
      .get("/v1/admin/promos")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(authorized.status).toBe(200);
  });

  it("admin can view order funnel analytics", async () => {
    const res = await request(app.getHttpServer())
      .get("/v1/admin/orders/analytics/funnel?windowDays=30")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(typeof res.body?.totals?.payment_initiated).toBe("number");
    expect(typeof res.body?.totals?.purchase_success).toBe("number");
  });
});
