import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";

enum DiscountTypeDto {
  percentage = "percentage",
  fixed = "fixed",
}

export class CreatePromoDto {
  @IsString()
  @MaxLength(64)
  code!: string;

  @IsEnum(DiscountTypeDto)
  discountType!: "percentage" | "fixed";

  @Type(() => Number)
  @Min(0)
  amount!: number;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  usageLimit?: number;
}

