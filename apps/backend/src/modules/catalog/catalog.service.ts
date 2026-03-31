import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CATALOG_REPOSITORY, CatalogRepository } from "../../application/catalog/repositories/catalog.repository";

@Injectable()
export class CatalogService {
  constructor(
    @Inject(CATALOG_REPOSITORY) private readonly repository: CatalogRepository,
  ) {}

  listProducts(category?: string) {
    return this.repository.listActiveProducts(category);
  }

  async getProductBySlug(slug: string) {
    const product = await this.repository.findActiveProductBySlug(slug);
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return product;
  }

  async getRecommendationsBySlug(slug: string, limit = 4) {
    const product = await this.repository.findActiveProductBySlug(slug);
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return this.repository.listRecommendationsByProduct(product.id, product.categoryId, Math.min(Math.max(limit, 1), 12));
  }
}
