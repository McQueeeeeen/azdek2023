import { IsBoolean, IsInt, IsOptional, Min } from "class-validator";

export class UpdateInventoryDto {
  @IsInt()
  @Min(0)
  stock!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

