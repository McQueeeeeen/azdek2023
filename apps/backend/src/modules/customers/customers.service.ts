import { Injectable, NotFoundException } from "@nestjs/common";
import { ChannelGroup, Customer } from "@prisma/client";
import { PrismaService } from "../../shared/infrastructure/prisma.service";

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
}
