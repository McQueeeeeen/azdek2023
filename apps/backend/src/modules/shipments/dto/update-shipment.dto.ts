import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { ShipmentStatus } from "@prisma/client";

export class UpdateShipmentDto {
  @IsEnum(ShipmentStatus)
  status!: ShipmentStatus;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  trackingNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  carrier?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  notes?: string;
}

