import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class AddCartItemDto {
  @IsOptional()
  @IsString()
  cartId?: string;

  @IsString()
  productVariantId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}
