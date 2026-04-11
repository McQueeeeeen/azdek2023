import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ChannelGroup, Customer } from "@prisma/client";
import { PrismaService } from "../../shared/infrastructure/prisma.service";
import { UpdateCustomerProfileDto } from "./dto/update-customer-profile.dto";

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.customer.findMany({
      include: { addresses: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: { addresses: true },
    });
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }
    return customer;
  }

  findByEmail(email: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async applyAttributionTouch(input: {
    email: string;
    channelGroup: ChannelGroup;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  }): Promise<Customer> {
    const existing = await this.findByEmail(input.email);
    const normalizedEmail = input.email.toLowerCase();
    if (!existing) {
      const now = new Date();
      return this.prisma.customer.create({
        data: {
          email: normalizedEmail,
          firstTouchAt: now,
          firstTouchUtmSource: input.utmSource,
          firstTouchUtmMedium: input.utmMedium,
          firstTouchUtmCampaign: input.utmCampaign,
          firstTouchChannelGroup: input.channelGroup,
          lastTouchAt: now,
          lastTouchUtmSource: input.utmSource,
          lastTouchUtmMedium: input.utmMedium,
          lastTouchUtmCampaign: input.utmCampaign,
          lastTouchChannelGroup: input.channelGroup,
        },
      });
    }
    const now = new Date();
    const shouldSetFirstTouch = !existing.firstTouchAt;

    return this.prisma.customer.update({
      where: { id: existing.id },
      data: {
        ...(shouldSetFirstTouch
          ? {
              firstTouchAt: now,
              firstTouchUtmSource: input.utmSource,
              firstTouchUtmMedium: input.utmMedium,
              firstTouchUtmCampaign: input.utmCampaign,
              firstTouchChannelGroup: input.channelGroup,
            }
          : {}),
        lastTouchAt: now,
        lastTouchUtmSource: input.utmSource,
        lastTouchUtmMedium: input.utmMedium,
        lastTouchUtmCampaign: input.utmCampaign,
        lastTouchChannelGroup: input.channelGroup,
      },
    });
  }

  async upsertProfileByUser(userId: string, dto: UpdateCustomerProfileDto): Promise<Customer> {
    const appUser = await this.prisma.appUser.findUnique({
      where: { id: userId },
      include: { customer: true },
    });
    if (!appUser) {
      throw new NotFoundException("User not found");
    }

    const normalizedEmail = dto.email ? dto.email.toLowerCase() : undefined;

    if (normalizedEmail && normalizedEmail !== appUser.email) {
      const emailOwner = await this.prisma.appUser.findUnique({
        where: { email: normalizedEmail },
        select: { id: true },
      });
      if (emailOwner && emailOwner.id !== appUser.id) {
        throw new ConflictException("Email is already in use");
      }
    }

    const updatePayload = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      ...(normalizedEmail ? { email: normalizedEmail } : {}),
    };

    if (appUser.customerId) {
      const customer = await this.prisma.customer.update({
        where: { id: appUser.customerId },
        data: updatePayload,
      });

      if (normalizedEmail && normalizedEmail !== appUser.email) {
        await this.prisma.appUser.update({
          where: { id: appUser.id },
          data: { email: normalizedEmail },
        });
      }
      return customer;
    }

    const customer = await this.prisma.customer.create({
      data: {
        email: normalizedEmail ?? appUser.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        type: appUser.role === "b2b" || appUser.role === "b2b_customer" ? "b2b" : "b2c",
        isWholesaler: appUser.role === "b2b" || appUser.role === "b2b_customer",
      },
    });

    await this.prisma.appUser.update({
      where: { id: appUser.id },
      data: {
        customerId: customer.id,
        ...(normalizedEmail && normalizedEmail !== appUser.email ? { email: normalizedEmail } : {}),
      },
    });

    return customer;
  }
}
