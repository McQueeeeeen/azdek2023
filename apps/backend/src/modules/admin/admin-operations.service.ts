import { Injectable, NotFoundException } from "@nestjs/common";
import { OrderStatus, PaymentStatus, Prisma, ShipmentStatus } from "@prisma/client";
import { PrismaService } from "../../shared/infrastructure/prisma.service";
import { canTransitionOrderStatus } from "../orders/domain/order-state-machine";
import { OrderTransitionNotAllowedError } from "../../common/errors/order-transition-not-allowed.error";
import { PaymentsService } from "../payments/payments.service";
import { B2BService } from "../b2b/b2b.service";
import { AnalyticsService } from "../analytics/analytics.service";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class AdminOperationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
    private readonly b2bService: B2BService,
    private readonly analyticsService: AnalyticsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  orderAnalytics(windowDays?: number) {
    return this.analyticsService.getFunnelSummary(windowDays);
  }

  listOrders() {
    return this.prisma.order.findMany({
      include: {
        items: true,
        payments: true,
        shipments: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  async updateOrderStatus(input: {
    orderId: string;
    status: OrderStatus;
    reason?: string;
    actorId: string;
  }) {
    const order = await this.prisma.order.findUnique({ where: { id: input.orderId } });
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (!canTransitionOrderStatus(order.status as never, input.status as never) && order.status !== input.status) {
      throw new OrderTransitionNotAllowedError(order.status, input.status);
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: order.id },
        data: { status: input.status },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          fromStatus: order.status,
          toStatus: input.status,
          reason: input.reason ?? "admin_manual_update",
          actorType: "admin",
          actorId: input.actorId,
        },
      });

      return updated;
    });
  }

  async addTracking(input: {
    orderId: string;
    trackingNumber: string;
    carrier?: string;
    actorId: string;
  }) {
    const order = await this.prisma.order.findUnique({ where: { id: input.orderId } });
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    const shipment = await this.prisma.shipment.findFirst({
      where: { orderId: input.orderId },
      orderBy: { createdAt: "desc" },
    });

    if (!shipment) {
      return this.prisma.$transaction(async (tx) => {
        const created = await tx.shipment.create({
          data: {
            orderId: input.orderId,
            status: ShipmentStatus.prepared,
            trackingNumber: input.trackingNumber,
            carrier: input.carrier,
          },
        });

        await tx.shipmentEvent.create({
          data: {
            shipmentId: created.id,
            fromStatus: null,
            toStatus: ShipmentStatus.prepared,
            notes: `created by admin ${input.actorId}`,
          },
        });

        return created;
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.shipment.update({
        where: { id: shipment.id },
        data: {
          trackingNumber: input.trackingNumber,
          carrier: input.carrier ?? shipment.carrier,
        },
      });

      await tx.shipmentEvent.create({
        data: {
          shipmentId: shipment.id,
          fromStatus: shipment.status,
          toStatus: shipment.status,
          notes: `tracking updated by admin ${input.actorId}`,
        },
      });

      return updated;
    });
  }

  async sendPaymentLink(orderId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { orderId },
      orderBy: { createdAt: "desc" },
    });
    if (!payment) {
      throw new NotFoundException("Payment not found for order");
    }

    return this.paymentsService.retryPayment(payment.id);
  }

  async updateInventory(variantId: string, input: { stock: number; isActive?: boolean }) {
    const existing = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!existing) {
      throw new NotFoundException("Variant not found");
    }

    return this.prisma.productVariant.update({
      where: { id: variantId },
      data: {
        stock: input.stock,
        isActive: input.isActive ?? existing.isActive,
      },
    });
  }

  listPromos() {
    return this.prisma.promoCode.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  createPromo(input: {
    code: string;
    discountType: "percentage" | "fixed";
    amount: number;
    startsAt?: Date;
    expiresAt?: Date;
    usageLimit?: number;
  }) {
    return this.prisma.promoCode.create({
      data: {
        code: input.code.toUpperCase(),
        discountType: input.discountType,
        amount: new Prisma.Decimal(input.amount),
        startsAt: input.startsAt,
        expiresAt: input.expiresAt,
        usageLimit: input.usageLimit,
      },
    });
  }

  updatePromo(
    promoId: string,
    input: {
      isActive?: boolean;
      startsAt?: Date | null;
      expiresAt?: Date | null;
      usageLimit?: number | null;
    },
  ) {
    return this.prisma.promoCode.update({
      where: { id: promoId },
      data: {
        isActive: input.isActive,
        startsAt: input.startsAt,
        expiresAt: input.expiresAt,
        usageLimit: input.usageLimit ?? undefined,
      },
    });
  }

  listB2BApplications() {
    return this.b2bService.listApplications();
  }

  reviewB2BApplication(
    applicationId: string,
    input: { status: "approved" | "rejected"; reviewNotes?: string },
    reviewerId: string,
  ) {
    return this.b2bService.reviewApplication(applicationId, input, reviewerId);
  }

  listCategories() {
    return this.prisma.category.findMany({
      include: { products: true },
      orderBy: { name: "asc" },
    });
  }

  createCategory(input: { name: string; slug: string }) {
    return this.prisma.category.create({
      data: {
        name: input.name,
        slug: input.slug,
      },
    });
  }

  updateCategory(categoryId: string, input: { name?: string; slug?: string }) {
    return this.prisma.category.update({
      where: { id: categoryId },
      data: {
        name: input.name,
        slug: input.slug,
      },
    });
  }

  createProduct(input: {
    categoryId: string;
    name: string;
    slug: string;
    description: string;
    isActive?: boolean;
  }) {
    return this.prisma.product.create({
      data: {
        categoryId: input.categoryId,
        name: input.name,
        slug: input.slug,
        description: input.description,
        isActive: input.isActive ?? true,
      },
    });
  }

  updateProduct(
    productId: string,
    input: {
      name?: string;
      slug?: string;
      description?: string;
      categoryId?: string;
      isActive?: boolean;
    },
  ) {
    return this.prisma.product.update({
      where: { id: productId },
      data: {
        categoryId: input.categoryId,
        name: input.name,
        slug: input.slug,
        description: input.description,
        isActive: input.isActive,
      },
    });
  }

  createVariant(
    productId: string,
    input: {
      sku: string;
      title: string;
      volumeLabel?: string;
      packagingType?: string;
      price: number;
      stock: number;
      isActive?: boolean;
    },
  ) {
    return this.prisma.productVariant.create({
      data: {
        productId,
        sku: input.sku,
        title: input.title,
        volumeLabel: input.volumeLabel,
        packagingType: input.packagingType,
        price: new Prisma.Decimal(input.price),
        stock: input.stock,
        isActive: input.isActive ?? true,
      },
    });
  }

  paymentDiagnostics(paymentId: string) {
    return this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        events: {
          orderBy: { createdAt: "desc" },
        },
        transactions: {
          orderBy: { createdAt: "desc" },
        },
        order: true,
      },
    });
  }

  async paymentDiagnosticsByOrder(orderId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { orderId },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });
    if (!payment) {
      throw new NotFoundException("Payment diagnostics not found");
    }
    return this.paymentDiagnostics(payment.id);
  }

  async markOrderPaymentStatus(orderId: string, status: PaymentStatus) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException("Order not found");
    }
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: status,
      },
    });
  }

  async runAbandonedCartRetention(hours = 4) {
    const cutoff = new Date(Date.now() - Math.max(hours, 1) * 60 * 60 * 1000);
    const carts = await this.prisma.cart.findMany({
      where: {
        updatedAt: { lte: cutoff },
        customerEmail: { not: null },
        totalAmount: { gt: 0 },
        items: { some: {} },
        reminders: { none: {} },
      },
      include: {
        items: true,
      },
      take: 300,
      orderBy: { updatedAt: "asc" },
    });

    let queued = 0;
    for (const cart of carts) {
      await this.notificationsService.enqueueEmail({
        type: "abandoned_cart_reminder",
        toEmail: cart.customerEmail as string,
        subject: "You left items in your cart",
        template: "abandoned-cart-reminder",
        data: {
          cartId: cart.id,
          totalAmount: Number(cart.totalAmount),
          itemsCount: cart.items.length,
          recoveryUrl: "/cart",
        },
      });

      await this.prisma.cartRetentionReminder.create({
        data: {
          cartId: cart.id,
        },
      });
      queued += 1;
    }

    return {
      scanned: carts.length,
      queued,
      cutoff,
    };
  }

  async refreshGrowthMarts() {
    await this.prisma.$executeRawUnsafe("SELECT analytics_mart.refresh_growth_marts();");
    return { ok: true, refreshedAt: new Date().toISOString() };
  }

  upsertChannelSpend(input: {
    day: Date;
    source: string;
    medium: string;
    campaign: string;
    channelGroup: "paid_social" | "paid_search" | "organic_search" | "direct" | "referral" | "retargeting" | "marketplace" | "offline" | "unknown";
    spendAmount: number;
  }) {
    return this.prisma.channelSpendDaily.upsert({
      where: {
        day_source_medium_campaign: {
          day: input.day,
          source: input.source,
          medium: input.medium,
          campaign: input.campaign,
        },
      },
      create: {
        day: input.day,
        source: input.source,
        medium: input.medium,
        campaign: input.campaign,
        channelGroup: input.channelGroup,
        spendAmount: input.spendAmount,
      },
      update: {
        channelGroup: input.channelGroup,
        spendAmount: input.spendAmount,
      },
    });
  }

  upsertOrderCost(orderId: string, input: {
    cogsAmount?: number;
    logisticsAmount?: number;
    feesAmount?: number;
    refundsAmount?: number;
    notes?: string;
  }) {
    return this.prisma.orderCost.upsert({
      where: { orderId },
      create: {
        orderId,
        cogsAmount: input.cogsAmount ?? 0,
        logisticsAmount: input.logisticsAmount ?? 0,
        feesAmount: input.feesAmount ?? 0,
        refundsAmount: input.refundsAmount ?? 0,
        notes: input.notes,
      },
      update: {
        cogsAmount: input.cogsAmount,
        logisticsAmount: input.logisticsAmount,
        feesAmount: input.feesAmount,
        refundsAmount: input.refundsAmount,
        notes: input.notes,
      },
    });
  }

  listExperiments() {
    return this.prisma.growthExperiment.findMany({
      orderBy: { startedAt: "desc" },
      take: 100,
    });
  }

  createExperiment(input: {
    hypothesis: string;
    changeDescription: string;
    targetMetric: string;
    owner: string;
  }) {
    return this.prisma.growthExperiment.create({
      data: input,
    });
  }

  decideExperiment(input: {
    experimentId: string;
    decision: "running" | "scale" | "fix" | "stop";
    baselineValue?: number;
    resultValue?: number;
    upliftPercent?: number;
    notes?: string;
  }) {
    return this.prisma.growthExperiment.update({
      where: { id: input.experimentId },
      data: {
        decision: input.decision,
        baselineValue: input.baselineValue,
        resultValue: input.resultValue,
        upliftPercent: input.upliftPercent,
        notes: input.notes,
        endedAt: input.decision === "running" ? null : new Date(),
      },
    });
  }

  listWeeklyReviews() {
    return this.prisma.weeklyReview.findMany({
      orderBy: { weekStart: "desc" },
      take: 52,
    });
  }

  upsertWeeklyReview(input: {
    weekStart: Date;
    facts: Prisma.InputJsonValue;
    wins: string;
    losses: string;
    decisions: string;
    nextActions: string;
    owner: string;
    deadline: Date;
    expectedImpact: string;
  }) {
    return this.prisma.weeklyReview.upsert({
      where: { weekStart: input.weekStart },
      create: input,
      update: input,
    });
  }
}
