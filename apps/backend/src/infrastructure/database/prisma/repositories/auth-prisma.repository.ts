import { Injectable } from "@nestjs/common";
import { AuthRepository, AuthUserRecord } from "../../../../application/auth/repositories/auth.repository";
import { PrismaService } from "../../../../shared/infrastructure/prisma.service";
import { CustomerType } from "@prisma/client";

@Injectable()
export class AuthPrismaRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveUserByEmail(email: string): Promise<AuthUserRecord | null> {
    return this.prisma.appUser.findFirst({
      where: {
        email: email.toLowerCase(),
        isActive: true,
      },
    });
  }

  async findActiveUserById(id: string): Promise<AuthUserRecord | null> {
    return this.prisma.appUser.findFirst({
      where: {
        id,
        isActive: true,
      },
    });
  }

  async createCustomerUser(input: {
    email: string;
    passwordHash: string;
    role: AuthUserRecord["role"];
    firstName?: string;
    lastName?: string;
    phone?: string;
    customerType: "b2c" | "b2b";
    isWholesaler: boolean;
  }): Promise<AuthUserRecord> {
    return this.prisma.$transaction(async (tx) => {
      const customer = await tx.customer.create({
        data: {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          type: input.customerType === "b2b" ? CustomerType.b2b : CustomerType.b2c,
          isWholesaler: input.isWholesaler,
        },
      });

      return tx.appUser.create({
        data: {
          email: input.email,
          passwordHash: input.passwordHash,
          role: input.role,
          customerId: customer.id,
          isActive: true,
        },
      });
    });
  }

  async updateRefreshToken(input: {
    userId: string;
    refreshTokenHash: string | null;
    refreshTokenExpiresAt: Date | null;
  }): Promise<void> {
    await this.prisma.appUser.update({
      where: { id: input.userId },
      data: {
        refreshTokenHash: input.refreshTokenHash,
        refreshTokenExpiresAt: input.refreshTokenExpiresAt,
      },
    });
  }
}
