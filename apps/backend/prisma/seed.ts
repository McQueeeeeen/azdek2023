import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Cleanup
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

  // Categories
  const laundry = await prisma.category.create({
    data: { slug: "laundry", name: "Стирка" },
  });
  const kitchen = await prisma.category.create({
    data: { slug: "kitchen", name: "Кухня" },
  });
  const home = await prisma.category.create({
    data: { slug: "home", name: "Для дома" },
  });

  // Products - Laundry
  await prisma.product.create({
    data: {
      slug: "azdek-universal-gel",
      name: "Гель для стирки Azdek Universal",
      description: "Универсальный гель для стирки всех видов тканей. Эффективен даже при низких температурах.",
      badge: "Новинка",
      categoryId: laundry.id,
      variants: {
        create: [
          { sku: "AZD-UG-1L", title: "1л", volumeLabel: "1л", packagingType: "bottle", price: 2490, stock: 150 },
          { sku: "AZD-UG-3L", title: "3л", volumeLabel: "3л", packagingType: "canister", price: 5990, stock: 80 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "azdek-black-gel",
      name: "Гель для черного белья Azdek Black",
      description: "Сохраняет насыщенность темных цветов и защищает структуру волокон.",
      categoryId: laundry.id,
      variants: {
        create: [
          { sku: "AZD-BG-1L", title: "1л", volumeLabel: "1л", packagingType: "bottle", price: 2690, stock: 100 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "azdek-baby-gel",
      name: "Детский гель для стирки Azdek Baby",
      description: "Гипоаллергенный состав, идеально подходит для чувствительной кожи малышей.",
      badge: "Новинка",
      categoryId: laundry.id,
      variants: {
        create: [
          { sku: "AZD-BABY-1L", title: "1л", volumeLabel: "1л", packagingType: "bottle", price: 2890, stock: 120 },
        ],
      },
    },
  });

  // Products - Kitchen
  await prisma.product.create({
    data: {
      slug: "azdek-dish-lemon",
      name: "Средство для посуды Azdek Лимон",
      description: "Концентрированное средство, легко удаляет жир даже в холодной воде.",
      badge: "Хит",
      categoryId: kitchen.id,
      variants: {
        create: [
          { sku: "AZD-DL-500", title: "500мл", volumeLabel: "500мл", packagingType: "bottle", price: 1290, stock: 300 },
          { sku: "AZD-DL-1L", title: "1л", volumeLabel: "1л", packagingType: "bottle", price: 1990, stock: 200 },
        ],
      },
    },
  });

  // Products - Home
  await prisma.product.create({
    data: {
      slug: "azdek-glass-cleaner",
      name: "Спрей для стекол Azdek Glass",
      description: "Очищает без разводов, придает блеск зеркалам и стеклянным поверхностям.",
      categoryId: home.id,
      variants: {
        create: [
          { sku: "AZD-GC-500", title: "500мл", volumeLabel: "500мл", packagingType: "spray", price: 1590, stock: 150 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "azdek-floor-cleaner",
      name: "Средство для мытья полов Azdek Floor",
      description: "Подходит для ламината, плитки и линолеума. Оставляет приятный аромат свежести.",
      badge: "Новинка",
      categoryId: home.id,
      variants: {
        create: [
          { sku: "AZD-FC-1L", title: "1л", volumeLabel: "1л", packagingType: "bottle", price: 2190, stock: 100 },
        ],
      },
    },
  });

  // Users & Customers
  await prisma.appUser.create({
    data: {
      email: "owner@azdek.kz",
      passwordHash: hashSync("Azdek2023!"),
      role: "owner",
      isActive: true,
    },
  });

  const demoCustomer = await prisma.customer.create({
    data: {
      email: "demo@azdek.kz",
      firstName: "Дархан",
      lastName: "Алиев",
      phone: "+77071234567",
      type: "b2c",
    },
  });

  await prisma.appUser.create({
    data: {
      email: demoCustomer.email,
      passwordHash: hashSync("Demo1234!"),
      role: "customer",
      customerId: demoCustomer.id,
      isActive: true,
    },
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
