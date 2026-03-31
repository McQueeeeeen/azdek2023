import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";

enum CustomerKind {
  b2c = "b2c",
  b2b = "b2b",
}

export class RegisterCustomerDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(CustomerKind)
  customerType!: "b2c" | "b2b";
}

