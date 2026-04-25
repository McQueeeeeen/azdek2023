import { z } from "zod";
import { CatalogProductSummary } from "./catalog-data";

export const CatalogVariantSchema = z.object({
  id: z.string(),
  sku: z.string(),
  title: z.string(),
  volumeLabel: z.string().nullable(),
  packagingType: z.string().nullable(),
  price: z.number(),
  currency: z.string(),
  stock: z.number(),
});

export const CatalogCategorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
});

export const CatalogProductResponseSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  category: CatalogCategorySchema,
  variants: z.array(CatalogVariantSchema),
});

export type CatalogProductResponse = z.infer<typeof CatalogProductResponseSchema>;

export async function fetchProducts(): Promise<CatalogProductSummary[]> {
  try {
    const res = await fetch("http://localhost:4000/catalog/products", {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    const parsed = z.array(CatalogProductResponseSchema).parse(data);

    return parsed.map((p, index) => ({
      id: index + 100, // fake numeric ID for compatibility with existing frontend state
      slug: p.slug,
      name: p.name,
      category: p.category.slug as any,
      price: p.variants[0]?.price ?? 0,
      badge: "NEW",
      sub: p.variants[0]?.volumeLabel ? `${p.variants[0].volumeLabel}` : "",
      rating: 4.8,
      reviews: Math.floor(Math.random() * 100) + 10,
      description: p.description,
    }));
  } catch (error) {
    console.error("API Fetch Error:", error);
    return []; // Return empty array to indicate failure/empty state
  }
}
