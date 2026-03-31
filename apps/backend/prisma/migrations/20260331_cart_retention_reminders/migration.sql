-- CreateTable
CREATE TABLE "CartRetentionReminder" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'email',
    "template" TEXT NOT NULL DEFAULT 'abandoned-cart-reminder',
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartRetentionReminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CartRetentionReminder_cartId_key" ON "CartRetentionReminder"("cartId");

-- AddForeignKey
ALTER TABLE "CartRetentionReminder" ADD CONSTRAINT "CartRetentionReminder_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
