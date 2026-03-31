import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsInt, IsOptional, Min } from "class-validator";

export class UpdatePromoDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  startsAt?: string | null;

  @IsOptional()
  @IsDateString()
  expiresAt?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  usageLimit?: number | null;
}

