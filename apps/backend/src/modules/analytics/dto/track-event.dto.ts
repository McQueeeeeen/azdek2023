import { Type } from "class-transformer";
import { IsDate, IsEnum, IsObject, IsOptional, IsString, MaxLength } from "class-validator";
import { AnalyticsEventType, ChannelGroup } from "@prisma/client";

export class TrackEventDto {
  @IsString()
  @MaxLength(200)
  idempotencyKey!: string;

  @IsEnum(AnalyticsEventType)
  eventType!: AnalyticsEventType;

  @IsString()
  @MaxLength(120)
  sessionId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  customerId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  orderId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  cartId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  productId?: string;

  @IsString()
  @MaxLength(120)
  utmSource!: string;

  @IsString()
  @MaxLength(120)
  utmMedium!: string;

  @IsString()
  @MaxLength(120)
  utmCampaign!: string;

  @IsEnum(ChannelGroup)
  channelGroup!: ChannelGroup;

  @Type(() => Date)
  @IsDate()
  occurredAt!: Date;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
