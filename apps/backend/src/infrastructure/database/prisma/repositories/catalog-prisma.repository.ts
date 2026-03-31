import { Injectable } from "@nestjs/common";
import { CatalogRepository } from "../../../../application/catalog/repositories/catalog.repository";
import { PrismaService } from "../../../../shared/infrastructure/prisma.service";

@Injectable()
export class CatalogPrismaRepository implements CatalogRepository {
  constructor(private readonly prisma: PrismaService) {}

  listActiveProducts(category?: string) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        category: category ? { slug: category } : undefined,
      },
      include: {
        category: true,
        variants: {
          where: { isActive: true },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  findActiveProductBySlug(slug: string) {
    return this.prisma.product.findFirst({
      where: { slug, isActive: true },
      include: {
        category: true,
        variants: {
          where: { isActive: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  listRecommendationsByProduct(productId: string, categoryId: string, limit: number) {
    return this.prisma.product.findMany({
      where: {
        id: { not: productId },
        categoryId,
        isActive: true,
      },
      include: {
        category: true,
        variants: {
          where: { isActive: true },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
