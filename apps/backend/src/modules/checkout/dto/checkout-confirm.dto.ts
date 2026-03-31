import { IsEmail, IsEnum, IsOptional, IsString, Length } from "class-validator";
import { ChannelGroup } from "@prisma/client";

enum DeliveryMethod {
  CITY = "city",
  COUNTRY = "country",
  PICKUP = "pickup",
}

enum PaymentMethod {
  CARD_ONLINE = "card_online",
  PAYMENT_LINK = "payment_link",
  B2B_MANUAL = "b2b_manual",
}

export class CheckoutConfirmDto {
  @IsString()
  cartId!: string;

  @IsString()
  @Length(2, 120)
  customerName!: string;

  @IsEmail()
  customerEmail!: string;

  @IsString()
  @Length(5, 30)
  customerPhone!: string;

  @IsString()
  @Length(2, 120)
  deliveryCity!: string;

  @IsString()
  @Length(5, 255)
  deliveryAddress!: string;

  @IsEnum(DeliveryMethod)
  deliveryMethod!: "city" | "country" | "pickup";

  @IsEnum(PaymentMethod)
  paymentMethod!: "card_online" | "payment_link" | "b2b_manual";

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsString()
  utmSource?: string;

  @IsOptional()
  @IsString()
  utmMedium?: string;

  @IsOptional()
  @IsString()
  utmCampaign?: string;

  @IsOptional()
  @IsEnum(ChannelGroup)
  channelGroup?: ChannelGroup;
}
