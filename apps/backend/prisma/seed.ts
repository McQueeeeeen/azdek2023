import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.weeklyReview.deleteMany();
  await prisma.growthExperiment.deleteMany();
  await prisma.orderCost.deleteMany();
  await prisma.channelSpendDaily.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.cartRetentionReminder.deleteMany();
  await prisma.b2BApplication.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.paymentEvent.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.appUser.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.address.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const laundry = await prisma.category.create({
    data: { slug: "laundry", name: "Laundry" },
  });
  const kitchen = await prisma.category.create({
    data: { slug: "kitchen", name: "Kitchen" },
  });

  const p1 = await prisma.product.create({
    data: {
      slug: "azdek-laundry-gel",
      name: "Azdek Laundry Gel",
      description: "Гель для стирки цветного и белого белья.",
      categoryId: laundry.id,
      variants: {
        create: [
          { sku: "AZD-LG-2L", title: "2L", volumeLabel: "2L", packagingType: "bottle", price: 3990, stock: 180 },
          { sku: "AZD-LG-5L", title: "5L", volumeLabel: "5L", packagingType: "canister", price: 8990, stock: 90 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "azdek-softener-fresh",
      name: "Azdek Softener Fresh",
      description: "Кондиционер для белья, свежий аромат.",
      categoryId: laundry.id,
      variants: {
        create: [{ sku: "AZD-SF-1L", title: "1L", volumeLabel: "1L", packagingType: "bottle", price: 2290, stock: 120 }],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "azdek-dish-liquid-citrus",
      name: "Azdek Dish Liquid Citrus",
      description: "Средство для мытья посуды, цитрус.",
      categoryId: kitchen.id,
      variants: {
        create: [
          { sku: "AZD-DL-750", title: "750ml", volumeLabel: "750ml", packagingType: "bottle", price: 1490, stock: 300 },
        ],
      },
    },
  });

  await prisma.appUser.create({
    data: {
      email: "owner@azdek.local",
      passwordHash: hashSync("Owner123!"),
      role: "owner",
      isActive: true,
    },
  });

  const retailCustomer = await prisma.customer.create({
    data: {
      email: "customer@azdek.local",
      firstName: "Retail",
      lastName: "Customer",
      phone: "+77011111111",
      type: "b2c",
      isWholesaler: false,
    },
  });

  await prisma.appUser.create({
    data: {
      email: retailCustomer.email,
      passwordHash: hashSync("Customer123!"),
      role: "customer",
      customerId: retailCustomer.id,
      isActive: true,
    },
  });

  const b2bCustomer = await prisma.customer.create({
    data: {
      email: "b2b@azdek.local",
      firstName: "B2B",
      lastName: "Customer",
      phone: "+77012222222",
      type: "b2b",
      isWholesaler: true,
    },
  });

  await prisma.appUser.create({
    data: {
      email: b2bCustomer.email,
      passwordHash: hashSync("B2B12345!"),
      role: "b2b_customer",
      customerId: b2bCustomer.id,
      isActive: true,
    },
  });

  await prisma.promoCode.create({
    data: {
      code: "WELCOME10",
      discountType: "percentage",
      amount: 10,
      isActive: true,
      usageLimit: 1000,
    },
  });

  const weekStart = new Date();
  weekStart.setUTCHours(0, 0, 0, 0);
  weekStart.setUTCDate(weekStart.getUTCDate() - ((weekStart.getUTCDay() + 6) % 7));

  await prisma.weeklyReview.upsert({
    where: { weekStart },
    update: {},
    create: {
      weekStart,
      facts: {
        revenue: 420000,
        orders: 48,
        aov: 8750,
        roas: 2.4,
      },
      wins: "Checkout conversion improved after payment flow stabilization.",
      losses: "Return rate increased on one SKU family.",
      decisions: "scale paid_search, fix SKU messaging, stop low-ROAS retargeting set.",
      nextActions: "Launch 3 experiments and tighten fulfillment SLA controls.",
      owner: "growth_owner",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      expectedImpact: "Increase purchase_success by +12% and AOV by +8%.",
    },
  });

  await prisma.growthExperiment.createMany({
    data: [
      {
        hypothesis: "Bundle offer on laundry variants will increase AOV.",
        changeDescription: "Show 2+1 bundle block on product and cart.",
        targetMetric: "AOV",
        owner: "growth_owner",
      },
      {
        hypothesis: "Payment reassurance copy will reduce payment drop-off.",
        changeDescription: "Add trust/secure-payment block on checkout.",
        targetMetric: "payment_initiated_to_purchase_success",
        owner: "growth_owner",
      },
      {
        hypothesis: "B2B reorder shortcut will increase repeat bulk orders.",
        changeDescription: "Expose one-click reorder in B2B account.",
        targetMetric: "b2b_repeat_bulk_orders",
        owner: "growth_owner",
      },
    ],
  });

  console.log("Seed completed. Featured product:", p1.slug);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
