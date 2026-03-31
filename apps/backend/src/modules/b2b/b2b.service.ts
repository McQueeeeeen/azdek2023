import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../shared/infrastructure/prisma.service";
import { CreateB2BApplicationDto } from "./dto/create-b2b-application.dto";
import { ReviewB2BApplicationDto } from "./dto/review-b2b-application.dto";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class B2BService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createApplication(dto: CreateB2BApplicationDto) {
    const application = await this.prisma.b2BApplication.create({
      data: {
        companyName: dto.companyName,
        contactName: dto.contactName,
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        message: dto.message,
      },
    });

    await this.notificationsService.enqueueEmail({
      type: "b2b_application_received",
      toEmail: dto.email.toLowerCase(),
      subject: `B2B application received`,
      template: "b2b-application-received",
      data: {
        applicationId: application.id,
        companyName: application.companyName,
      },
    });

    return application;
  }

  listApplications() {
    return this.prisma.b2BApplication.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async reviewApplication(applicationId: string, dto: ReviewB2BApplicationDto, reviewerId: string) {
    const existing = await this.prisma.b2BApplication.findUnique({
      where: { id: applicationId },
    });
    if (!existing) {
      throw new NotFoundException("B2B application not found");
    }

    const updated = await this.prisma.b2BApplication.update({
      where: { id: applicationId },
      data: {
        status: dto.status,
        reviewNotes: dto.reviewNotes,
        reviewedById: reviewerId,
        reviewedAt: new Date(),
      },
    });

    await this.notificationsService.enqueueEmail({
      type: "b2b_reviewed",
      toEmail: updated.email,
      subject: `B2B application ${updated.status}`,
      template: "b2b-application-reviewed",
      data: {
        applicationId: updated.id,
        status: updated.status,
        reviewNotes: updated.reviewNotes,
      },
    });

    return updated;
  }

  async getAccount(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 20,
          include: { items: true, payments: true },
        },
      },
    });
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    const latestApplication = await this.prisma.b2BApplication.findFirst({
      where: { email: customer.email },
      orderBy: { createdAt: "desc" },
    });

    return {
      customer,
      b2b: {
        isWholesaler: customer.isWholesaler,
        status: latestApplication?.status ?? "not_requested",
        latestApplicationId: latestApplication?.id ?? null,
        conditions: {
          minimumOrderAmount: 50000,
          paymentTerms: customer.isWholesaler ? "invoice_or_link" : "prepayment",
        },
      },
    };
  }
}
