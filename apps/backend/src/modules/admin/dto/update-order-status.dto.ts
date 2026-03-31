import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  reason?: string;
}

export class UpdateOrderPaymentStatusDto {
  @IsEnum(PaymentStatus)
  status!: PaymentStatus;
}

export class AddTrackingDto {
  @IsString()
  @MaxLength(120)
  trackingNumber!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  carrier?: string;
}

