import { Controller, Get, Param, Query } from "@nestjs/common";
import { CatalogService } from "./catalog.service";

interface CatalogVariantResponse {
  id: string;
  sku: string;
  title: string;
  volumeLabel: string | null;
  packagingType: string | null;
  price: number;
  currency: string;
  stock: number;
}

interface CatalogProductResponse {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: {
    id: string;
    slug: string;
    name: string;
  };
  variants: CatalogVariantResponse[];
}

@Controller("catalog")
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get("products")
  async listProducts(@Query("category") category?: string): Promise<CatalogProductResponse[]> {
    const products = await this.catalogService.listProducts(category);
    return products.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      category: {
        id: product.category.id,
        slug: product.category.slug,
        name: product.category.name,
      },
      variants: product.variants.map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        title: variant.title,
        volumeLabel: variant.volumeLabel,
        packagingType: variant.packagingType,
        price: Number(variant.price),
        currency: variant.currency,
        stock: variant.stock,
      })),
    }));
  }

  @Get("products/:slug")
  async getBySlug(@Param("slug") slug: string): Promise<CatalogProductResponse> {
    const product = await this.catalogService.getProductBySlug(slug);
    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      category: {
        id: product.category.id,
        slug: product.category.slug,
        name: product.category.name,
      },
      variants: product.variants.map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        title: variant.title,
        volumeLabel: variant.volumeLabel,
        packagingType: variant.packagingType,
        price: Number(variant.price),
        currency: variant.currency,
        stock: variant.stock,
      })),
    };
  }

  @Get("products/:slug/recommendations")
  async recommendations(
    @Param("slug") slug: string,
    @Query("limit") limit?: string,
  ): Promise<CatalogProductResponse[]> {
    const products = await this.catalogService.getRecommendationsBySlug(slug, limit ? Number(limit) : 4);
    return products.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      category: {
        id: product.category.id,
        slug: product.category.slug,
        name: product.category.name,
      },
      variants: product.variants.map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        title: variant.title,
        volumeLabel: variant.volumeLabel,
        packagingType: variant.packagingType,
        price: Number(variant.price),
        currency: variant.currency,
        stock: variant.stock,
      })),
    }));
  }
}
