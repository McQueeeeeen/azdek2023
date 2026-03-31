import { Prisma } from "@prisma/client";

export type CatalogProductRecord = Prisma.ProductGetPayload<{
  include: {
    category: true;
    variants: true;
  };
}>;

export interface CatalogRepository {
  listActiveProducts(category?: string): Promise<CatalogProductRecord[]>;
  findActiveProductBySlug(slug: string): Promise<CatalogProductRecord | null>;
  listRecommendationsByProduct(productId: string, categoryId: string, limit: number): Promise<CatalogProductRecord[]>;
}

export const CATALOG_REPOSITORY = Symbol("CATALOG_REPOSITORY");
