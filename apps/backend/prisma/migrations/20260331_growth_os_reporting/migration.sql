-- === Enums ===
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ChannelGroup') THEN
    CREATE TYPE "ChannelGroup" AS ENUM (
      'paid_social',
      'paid_search',
      'organic_search',
      'direct',
      'referral',
      'retargeting',
      'marketplace',
      'offline',
      'unknown'
    );
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SalesChannel') THEN
    CREATE TYPE "SalesChannel" AS ENUM ('d2c', 'b2b', 'marketplace', 'offline');
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ExperimentDecision') THEN
    CREATE TYPE "ExperimentDecision" AS ENUM ('running', 'scale', 'fix', 'stop');
  END IF;
END
$$;

ALTER TYPE "AnalyticsEventType" ADD VALUE IF NOT EXISTS 'session_started';

-- === Customer attribution ===
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "firstTouchUtmSource" TEXT;
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "firstTouchUtmMedium" TEXT;
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "firstTouchUtmCampaign" TEXT;
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "firstTouchChannelGroup" "ChannelGroup" NOT NULL DEFAULT 'unknown';
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "firstTouchAt" TIMESTAMP(3);
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "lastTouchUtmSource" TEXT;
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "lastTouchUtmMedium" TEXT;
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "lastTouchUtmCampaign" TEXT;
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "lastTouchChannelGroup" "ChannelGroup" NOT NULL DEFAULT 'unknown';
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "lastTouchAt" TIMESTAMP(3);

-- === Order attribution ===
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "source" "SalesChannel" NOT NULL DEFAULT 'd2c';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "sessionId" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "utmSource" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "utmMedium" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "utmCampaign" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "channelGroup" "ChannelGroup" NOT NULL DEFAULT 'unknown';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "firstTouchUtmSource" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "firstTouchUtmMedium" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "firstTouchUtmCampaign" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "firstTouchChannelGroup" "ChannelGroup" NOT NULL DEFAULT 'unknown';

CREATE INDEX IF NOT EXISTS "Order_source_createdAt_idx" ON "Order" ("source", "createdAt");
CREATE INDEX IF NOT EXISTS "Order_channelGroup_createdAt_idx" ON "Order" ("channelGroup", "createdAt");

-- === AnalyticsEvent production ingestion fields ===
ALTER TABLE "AnalyticsEvent" ADD COLUMN IF NOT EXISTS "idempotencyKey" TEXT;
ALTER TABLE "AnalyticsEvent" ADD COLUMN IF NOT EXISTS "channelGroup" "ChannelGroup" NOT NULL DEFAULT 'unknown';
ALTER TABLE "AnalyticsEvent" ADD COLUMN IF NOT EXISTS "occurredAt" TIMESTAMP(3);

UPDATE "AnalyticsEvent"
SET
  "idempotencyKey" = COALESCE("idempotencyKey", 'legacy-' || "id"),
  "sessionId" = COALESCE("sessionId", 'legacy-session'),
  "utmSource" = COALESCE("utmSource", 'direct'),
  "utmMedium" = COALESCE("utmMedium", 'none'),
  "utmCampaign" = COALESCE("utmCampaign", 'unattributed'),
  "occurredAt" = COALESCE("occurredAt", "createdAt")
WHERE
  "idempotencyKey" IS NULL
  OR "sessionId" IS NULL
  OR "utmSource" IS NULL
  OR "utmMedium" IS NULL
  OR "utmCampaign" IS NULL
  OR "occurredAt" IS NULL;

ALTER TABLE "AnalyticsEvent" ALTER COLUMN "idempotencyKey" SET NOT NULL;
ALTER TABLE "AnalyticsEvent" ALTER COLUMN "sessionId" SET NOT NULL;
ALTER TABLE "AnalyticsEvent" ALTER COLUMN "utmSource" SET NOT NULL;
ALTER TABLE "AnalyticsEvent" ALTER COLUMN "utmMedium" SET NOT NULL;
ALTER TABLE "AnalyticsEvent" ALTER COLUMN "utmCampaign" SET NOT NULL;
ALTER TABLE "AnalyticsEvent" ALTER COLUMN "occurredAt" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "AnalyticsEvent_idempotencyKey_key" ON "AnalyticsEvent" ("idempotencyKey");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_channelGroup_occurredAt_idx" ON "AnalyticsEvent" ("channelGroup", "occurredAt");

-- === Growth OS data tables ===
CREATE TABLE IF NOT EXISTS "ChannelSpendDaily" (
  "id" TEXT NOT NULL,
  "day" TIMESTAMP(3) NOT NULL,
  "source" TEXT NOT NULL,
  "medium" TEXT NOT NULL,
  "campaign" TEXT NOT NULL,
  "channelGroup" "ChannelGroup" NOT NULL DEFAULT 'unknown',
  "spendAmount" DECIMAL(12,2) NOT NULL,
  "currency" "CurrencyCode" NOT NULL DEFAULT 'KZT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChannelSpendDaily_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ChannelSpendDaily_day_source_medium_campaign_key"
  ON "ChannelSpendDaily" ("day", "source", "medium", "campaign");
CREATE INDEX IF NOT EXISTS "ChannelSpendDaily_day_channelGroup_idx"
  ON "ChannelSpendDaily" ("day", "channelGroup");

CREATE TABLE IF NOT EXISTS "OrderCost" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "cogsAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "logisticsAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "feesAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "refundsAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OrderCost_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OrderCost_orderId_key" UNIQUE ("orderId")
);

ALTER TABLE "OrderCost"
  ADD CONSTRAINT "OrderCost_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order" ("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "GrowthExperiment" (
  "id" TEXT NOT NULL,
  "hypothesis" TEXT NOT NULL,
  "changeDescription" TEXT NOT NULL,
  "targetMetric" TEXT NOT NULL,
  "decision" "ExperimentDecision" NOT NULL DEFAULT 'running',
  "baselineValue" DECIMAL(12,4),
  "resultValue" DECIMAL(12,4),
  "upliftPercent" DECIMAL(8,2),
  "owner" TEXT NOT NULL,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endedAt" TIMESTAMP(3),
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GrowthExperiment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "WeeklyReview" (
  "id" TEXT NOT NULL,
  "weekStart" TIMESTAMP(3) NOT NULL,
  "facts" JSONB NOT NULL,
  "wins" TEXT NOT NULL,
  "losses" TEXT NOT NULL,
  "decisions" TEXT NOT NULL,
  "nextActions" TEXT NOT NULL,
  "owner" TEXT NOT NULL,
  "deadline" TIMESTAMP(3) NOT NULL,
  "expectedImpact" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WeeklyReview_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "WeeklyReview_weekStart_key" ON "WeeklyReview" ("weekStart");

-- === Reporting layer (materialized views) ===
CREATE SCHEMA IF NOT EXISTS analytics_mart;

DROP MATERIALIZED VIEW IF EXISTS analytics_mart.fact_funnel_daily;
CREATE MATERIALIZED VIEW analytics_mart.fact_funnel_daily AS
SELECT
  date_trunc('day', "occurredAt")::date AS day,
  "channelGroup" AS channel_group,
  COUNT(DISTINCT "sessionId") FILTER (WHERE "eventType"::text = 'session_started') AS sessions,
  COUNT(*) FILTER (WHERE "eventType"::text = 'product_view') AS product_views,
  COUNT(*) FILTER (WHERE "eventType"::text = 'add_to_cart') AS add_to_cart,
  COUNT(*) FILTER (WHERE "eventType"::text = 'begin_checkout') AS begin_checkout,
  COUNT(*) FILTER (WHERE "eventType"::text = 'payment_initiated') AS payment_initiated,
  COUNT(*) FILTER (WHERE "eventType"::text = 'purchase_success') AS purchase_success,
  COUNT(*) FILTER (WHERE "eventType"::text = 'purchase_failure') AS purchase_failure
FROM "AnalyticsEvent"
GROUP BY 1, 2;

CREATE UNIQUE INDEX IF NOT EXISTS fact_funnel_daily_day_channel_group_idx
  ON analytics_mart.fact_funnel_daily (day, channel_group);

DROP MATERIALIZED VIEW IF EXISTS analytics_mart.fact_orders;
CREATE MATERIALIZED VIEW analytics_mart.fact_orders AS
SELECT
  date_trunc('day', o."createdAt")::date AS day,
  o."source" AS sales_channel,
  o."channelGroup" AS channel_group,
  COUNT(*) AS orders_count,
  SUM(o."totalAmount")::numeric(14,2) AS revenue,
  CASE WHEN COUNT(*) = 0 THEN 0 ELSE (SUM(o."totalAmount") / COUNT(*))::numeric(14,2) END AS aov,
  SUM(CASE WHEN o."status" = 'cancelled' THEN 1 ELSE 0 END)::numeric AS cancelled_orders,
  SUM(CASE WHEN o."status" IN ('refunded', 'partially_refunded') THEN 1 ELSE 0 END)::numeric AS returned_orders
FROM "Order" o
GROUP BY 1, 2, 3;

CREATE UNIQUE INDEX IF NOT EXISTS fact_orders_day_sales_channel_channel_group_idx
  ON analytics_mart.fact_orders (day, sales_channel, channel_group);

DROP MATERIALIZED VIEW IF EXISTS analytics_mart.fact_order_unit_economics;
CREATE MATERIALIZED VIEW analytics_mart.fact_order_unit_economics AS
SELECT
  o."id" AS order_id,
  o."orderNumber" AS order_number,
  date_trunc('day', o."createdAt")::date AS day,
  o."source" AS sales_channel,
  o."channelGroup" AS channel_group,
  o."totalAmount"::numeric(14,2) AS revenue,
  COALESCE(oc."cogsAmount", 0)::numeric(14,2) AS cogs,
  COALESCE(oc."logisticsAmount", 0)::numeric(14,2) AS logistics,
  COALESCE(oc."feesAmount", 0)::numeric(14,2) AS fees,
  COALESCE(oc."refundsAmount", 0)::numeric(14,2) AS refunds,
  (o."totalAmount" - COALESCE(oc."cogsAmount", 0))::numeric(14,2) AS gross_margin,
  (o."totalAmount" - COALESCE(oc."cogsAmount", 0) - COALESCE(oc."logisticsAmount", 0) - COALESCE(oc."feesAmount", 0) - COALESCE(oc."refundsAmount", 0))::numeric(14,2) AS contribution_margin
FROM "Order" o
LEFT JOIN "OrderCost" oc ON oc."orderId" = o."id";

CREATE UNIQUE INDEX IF NOT EXISTS fact_order_unit_economics_order_id_idx
  ON analytics_mart.fact_order_unit_economics (order_id);

DROP MATERIALIZED VIEW IF EXISTS analytics_mart.fact_retention_cohorts;
CREATE MATERIALIZED VIEW analytics_mart.fact_retention_cohorts AS
WITH first_orders AS (
  SELECT
    o."customerId" AS customer_id,
    MIN(o."createdAt") AS first_order_at
  FROM "Order" o
  WHERE o."customerId" IS NOT NULL
  GROUP BY 1
),
orders_after AS (
  SELECT
    fo.customer_id,
    fo.first_order_at,
    o."createdAt" AS order_at
  FROM first_orders fo
  JOIN "Order" o ON o."customerId" = fo.customer_id
)
SELECT
  date_trunc('month', fo.first_order_at)::date AS cohort_month,
  COUNT(DISTINCT fo.customer_id) AS cohort_size,
  COUNT(DISTINCT CASE WHEN oa.order_at > fo.first_order_at AND oa.order_at <= fo.first_order_at + INTERVAL '30 day' THEN fo.customer_id END) AS repeat_30_customers,
  COUNT(DISTINCT CASE WHEN oa.order_at > fo.first_order_at AND oa.order_at <= fo.first_order_at + INTERVAL '60 day' THEN fo.customer_id END) AS repeat_60_customers,
  COUNT(DISTINCT CASE WHEN oa.order_at > fo.first_order_at AND oa.order_at <= fo.first_order_at + INTERVAL '90 day' THEN fo.customer_id END) AS repeat_90_customers
FROM first_orders fo
LEFT JOIN orders_after oa ON oa.customer_id = fo.customer_id
GROUP BY 1;

CREATE UNIQUE INDEX IF NOT EXISTS fact_retention_cohorts_cohort_month_idx
  ON analytics_mart.fact_retention_cohorts (cohort_month);

DROP MATERIALIZED VIEW IF EXISTS analytics_mart.fact_sku_daily;
CREATE MATERIALIZED VIEW analytics_mart.fact_sku_daily AS
SELECT
  date_trunc('day', o."createdAt")::date AS day,
  oi."productVariantId" AS product_variant_id,
  MAX(oi."name") AS item_name,
  SUM(oi."quantity")::numeric AS units_sold,
  SUM(oi."lineTotal")::numeric(14,2) AS sku_revenue,
  o."source" AS sales_channel
FROM "OrderItem" oi
JOIN "Order" o ON o."id" = oi."orderId"
GROUP BY 1, 2, 6;

CREATE UNIQUE INDEX IF NOT EXISTS fact_sku_daily_day_product_variant_sales_channel_idx
  ON analytics_mart.fact_sku_daily (day, product_variant_id, sales_channel);

DROP MATERIALIZED VIEW IF EXISTS analytics_mart.fact_b2b_daily;
CREATE MATERIALIZED VIEW analytics_mart.fact_b2b_daily AS
SELECT
  date_trunc('day', o."createdAt")::date AS day,
  COUNT(*) FILTER (WHERE o."source" = 'b2b') AS b2b_orders,
  SUM(o."totalAmount") FILTER (WHERE o."source" = 'b2b')::numeric(14,2) AS b2b_revenue,
  COUNT(DISTINCT o."customerId") FILTER (WHERE o."source" = 'b2b') AS b2b_customers
FROM "Order" o
GROUP BY 1;

CREATE UNIQUE INDEX IF NOT EXISTS fact_b2b_daily_day_idx
  ON analytics_mart.fact_b2b_daily (day);

DROP MATERIALIZED VIEW IF EXISTS analytics_mart.fact_operations_daily;
CREATE MATERIALIZED VIEW analytics_mart.fact_operations_daily AS
SELECT
  date_trunc('day', o."createdAt")::date AS day,
  COUNT(*) AS total_orders,
  SUM(CASE WHEN o."status" = 'cancelled' THEN 1 ELSE 0 END)::numeric AS cancelled_orders,
  SUM(CASE WHEN o."status" IN ('refunded', 'partially_refunded') THEN 1 ELSE 0 END)::numeric AS returned_orders,
  COUNT(s."id") FILTER (WHERE s."status" = 'delivered')::numeric AS delivered_shipments,
  COUNT(s."id") FILTER (
    WHERE s."status" = 'delivered'
    AND s."updatedAt" <= o."createdAt" + INTERVAL '72 hour'
  )::numeric AS on_time_shipments
FROM "Order" o
LEFT JOIN "Shipment" s ON s."orderId" = o."id"
GROUP BY 1;

CREATE UNIQUE INDEX IF NOT EXISTS fact_operations_daily_day_idx
  ON analytics_mart.fact_operations_daily (day);

-- === Refresh helper ===
CREATE OR REPLACE FUNCTION analytics_mart.refresh_growth_marts()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW analytics_mart.fact_funnel_daily;
  REFRESH MATERIALIZED VIEW analytics_mart.fact_orders;
  REFRESH MATERIALIZED VIEW analytics_mart.fact_order_unit_economics;
  REFRESH MATERIALIZED VIEW analytics_mart.fact_retention_cohorts;
  REFRESH MATERIALIZED VIEW analytics_mart.fact_sku_daily;
  REFRESH MATERIALIZED VIEW analytics_mart.fact_b2b_daily;
  REFRESH MATERIALIZED VIEW analytics_mart.fact_operations_daily;
END;
$$;

SELECT analytics_mart.refresh_growth_marts();

-- === Refresh cron (best effort on Supabase) ===
DO $$
BEGIN
  BEGIN
    CREATE EXTENSION IF NOT EXISTS pg_cron;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    IF NOT EXISTS (
      SELECT 1
      FROM cron.job
      WHERE jobname = 'refresh_growth_marts_hourly'
    ) THEN
      PERFORM cron.schedule(
        'refresh_growth_marts_hourly',
        '15 * * * *',
        'SELECT analytics_mart.refresh_growth_marts();'
      );
    END IF;
  END IF;
END
$$;
