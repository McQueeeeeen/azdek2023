import { Module } from "@nestjs/common";
import { CatalogController } from "./catalog.controller";
import { CatalogService } from "./catalog.service";
import { CATALOG_REPOSITORY } from "../../application/catalog/repositories/catalog.repository";
import { CatalogPrismaRepository } from "../../infrastructure/database/prisma/repositories/catalog-prisma.repository";

@Module({
  controllers: [CatalogController],
  providers: [
    CatalogService,
    {
      provide: CATALOG_REPOSITORY,
      useClass: CatalogPrismaRepository,
    },
  ],
})
export class CatalogModule {}
