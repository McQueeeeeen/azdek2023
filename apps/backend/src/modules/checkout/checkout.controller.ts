import { Body, Controller, Post } from "@nestjs/common";
import { CheckoutService } from "./checkout.service";
import { CheckoutConfirmDto } from "./dto/checkout-confirm.dto";

@Controller("checkout")
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post("confirm")
  confirm(@Body() dto: CheckoutConfirmDto): Promise<Awaited<ReturnType<CheckoutService["confirm"]>>> {
    return this.checkoutService.confirm(dto);
  }
}
