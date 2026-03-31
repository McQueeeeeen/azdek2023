"use client";

import { apiPost } from "@/lib/api";

export type AnalyticsEventType =
  | "session_started"
  | "page_view"
  | "product_view"
  | "add_to_cart"
  | "begin_checkout"
  | "payment_initiated"
  | "purchase_success"
  | "purchase_failure";

interface TrackEventInput {
  eventType: AnalyticsEventType;
  idempotencyKey?: string;
  sessionId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  channelGroup?: string;
  occurredAt?: string;
  customerId?: string;
  orderId?: string;
  cartId?: string;
  productId?: string;
  metadata?: Record<string, unknown>;
}

const SESSION_KEY = "azdek_session_id";

function getSessionId(): string {
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) {
    return existing;
  }
  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(SESSION_KEY, generated);
  return generated;
}

function getUtm() {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
  };
}

function resolveChannelGroup(utmSource?: string, utmMedium?: string): string {
  const source = (utmSource ?? "").toLowerCase();
  const medium = (utmMedium ?? "").toLowerCase();
  if (["instagram", "facebook", "tiktok"].includes(source)) {
    return medium.includes("retarget") ? "retargeting" : "paid_social";
  }
  if (["google", "yandex"].includes(source)) {
    return medium.includes("organic") ? "organic_search" : "paid_search";
  }
  if (source.includes("kaspi") || source.includes("wildberries") || source.includes("ozon")) {
    return "marketplace";
  }
  if (medium.includes("offline")) {
    return "offline";
  }
  if (medium.includes("referral")) {
    return "referral";
  }
  if (source === "direct" || medium === "none" || source === "") {
    return "direct";
  }
  return "unknown";
}

export async function trackEvent(input: TrackEventInput): Promise<void> {
  const utm = input.utmSource || input.utmMedium || input.utmCampaign ? {
    utmSource: input.utmSource,
    utmMedium: input.utmMedium,
    utmCampaign: input.utmCampaign,
  } : getUtm();
  const sessionId = input.sessionId ?? getSessionId();
  const idempotencyKey =
    input.idempotencyKey ??
    `${input.eventType}:${sessionId}:${input.productId ?? input.cartId ?? input.orderId ?? "na"}:${Date.now()}`;
  try {
    await apiPost("/analytics/events", {
      eventType: input.eventType,
      idempotencyKey,
      sessionId,
      customerId: input.customerId,
      orderId: input.orderId,
      cartId: input.cartId,
      productId: input.productId,
      metadata: input.metadata,
      utmSource: utm.utmSource ?? "direct",
      utmMedium: utm.utmMedium ?? "none",
      utmCampaign: utm.utmCampaign ?? "unattributed",
      channelGroup: input.channelGroup ?? resolveChannelGroup(utm.utmSource, utm.utmMedium),
      occurredAt: input.occurredAt ?? new Date().toISOString(),
    });
  } catch {
    // Analytics must never break storefront UX.
  }
}

export function getSessionIdForCheckout(): string {
  return getSessionId();
}

export function getCurrentUtm(): { utmSource?: string; utmMedium?: string; utmCampaign?: string } {
  return getUtm();
}

export function getCurrentAttribution(): {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  channelGroup: string;
} {
  const utm = getUtm();
  return {
    ...utm,
    channelGroup: resolveChannelGroup(utm.utmSource, utm.utmMedium),
  };
}
