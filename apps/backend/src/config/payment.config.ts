import { registerAs } from "@nestjs/config";

export const paymentConfig = registerAs("payment", () => ({
  defaultProvider: process.env.PAYMENT_PROVIDER_DEFAULT ?? "mock_kz",
}));

