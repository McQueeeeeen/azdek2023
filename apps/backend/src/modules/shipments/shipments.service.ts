import { Injectable, NotFoundException } from "@nestjs/common";
import { ShipmentStatus } from "@prisma/client";
import { PrismaService } from "../../shared/infrastructure/prisma.service";
import { UpdateShipmentDto } from "./dto/update-shipment.dto";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable()
export class ShipmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getByOrder(orderId: string) {
    return this.prisma.shipment.findMany({
      where: { orderId },
      include: { events: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(shipmentId: string, dto: UpdateShipmentDto) {
    const shipment = await this.prisma.shipment.findUnique({ where: { id: shipmentId } });
    if (!shipment) {
      throw new NotFoundException("Shipment not found");
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.shipment.update({
        where: { id: shipmentId },
        data: {
          status: dto.status,
          trackingNumber: dto.trackingNumber ?? shipment.trackingNumber,
          carrier: dto.carrier ?? shipment.carrier,
        },
      });

      await tx.shipmentEvent.create({
        data: {
          shipmentId: shipment.id,
          fromStatus: shipment.status,
          toStatus: dto.status,
          notes: dto.notes,
        },
      });

      return updated;
    });

    if (dto.status === ShipmentStatus.handed_to_courier || dto.status === ShipmentStatus.in_transit) {
      const order = await this.prisma.order.findUnique({
        where: { id: shipment.orderId },
        select: { orderNumber: true, customerEmail: true },
      });
      if (order) {
        await this.notificationsService.enqueueEmail({
          type: "order_shipped",
          toEmail: order.customerEmail,
          subject: `Order ${order.orderNumber} shipped`,
          template: "order-shipped",
          data: {
            orderNumber: order.orderNumber,
            trackingNumber: updated.trackingNumber,
            carrier: updated.carrier,
          },
        });
      }
    }

    return updated;
  }
}
