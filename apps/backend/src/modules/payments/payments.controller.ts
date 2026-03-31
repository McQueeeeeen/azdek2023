import { Body, Controller, Headers, Param, Post, Req } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { Request } from "express";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("webhooks/:provider")
  handleWebhook(
    @Param("provider") provider: string,
    @Headers() headers: Record<string, string | string[] | undefined>,
    @Body() body: unknown,
    @Req() req: Request & { rawBody?: Buffer },
  ): ReturnType<PaymentsService["handleWebhook"]> {
    return this.paymentsService.handleWebhook(provider, headers, body, req.rawBody?.toString("utf8") ?? "");
  }

  @Post(":paymentId/retry")
  async retryPayment(
    @Param("paymentId") paymentId: string,
  ): Promise<{ paymentId: string; status: string; paymentUrl: string | null }> {
    const payment = await this.paymentsService.retryPayment(paymentId);
    return {
      paymentId: payment.id,
      status: payment.status,
      paymentUrl: payment.paymentUrl,
    };
  }
}
