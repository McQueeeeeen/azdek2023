import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { ShipmentsService } from "./shipments.service";
import { UpdateShipmentDto } from "./dto/update-shipment.dto";

@Controller("shipments")
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Get("order/:orderId")
  getByOrder(@Param("orderId") orderId: string): ReturnType<ShipmentsService["getByOrder"]> {
    return this.shipmentsService.getByOrder(orderId);
  }

  @Patch(":shipmentId")
  update(@Param("shipmentId") shipmentId: string, @Body() dto: UpdateShipmentDto): ReturnType<ShipmentsService["update"]> {
    return this.shipmentsService.update(shipmentId, dto);
  }
}

