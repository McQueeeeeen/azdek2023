import { CatalogProduct } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/v1";

export type ProductCategory = "laundry" | "kitchen" | "bathroom" | "universal";

export interface StorefrontProduct extends CatalogProduct {
  brand: string;
  usage: ProductCategory;
  image: string;
  short: string;
  specs: string[];
  isDiscount?: boolean;
}

const fallbackProducts: StorefrontProduct[] = [
  {
    id: "p-laundry-gel",
    slug: "azdek-laundry-gel",
    name: "Oxygenated Laundry Liquid",
    description: "High-efficiency laundry concentrate for daily loads and tough stains.",
    category: { id: "c-laundry", slug: "laundry", name: "Laundry" },
    brand: "Adzek",
    usage: "laundry",
    image: "/media/laundry-gel-final.jpg",
    short: "1.5L • High Efficiency Formula",
    specs: ["For white and colored fabric", "Low-foam formula", "40+ washes"],
    variants: [
      {
        id: "v-laundry-gel-15",
        sku: "AZ-LAUNDRY-1500",
        title: "1.5L",
        price: 12000,
        currency: "KZT",
        stock: 24,
      },
    ],
  },
  {
    id: "p-dish-citrus",
    slug: "azdek-dish-liquid-citrus",
    name: "Citrus Surface Elixir",
    description: "Multi-surface cleaner for kitchen grease and everyday marks.",
    category: { id: "c-kitchen", slug: "kitchen", name: "Kitchen" },
    brand: "Adzek",
    usage: "kitchen",
    image: "/media/dish-liquid-citrus-final.jpg",
    short: "500ml • Multi-Surface Shine",
    specs: ["Fast degreasing", "No harsh smell", "Kitchen-safe"],
    variants: [
      {
        id: "v-dish-citrus-500",
        sku: "AZ-CITRUS-500",
        title: "500ml",
        price: 9000,
        currency: "KZT",
        stock: 16,
      },
    ],
    isDiscount: true,
  },
  {
    id: "p-softener-fresh",
    slug: "azdek-softener-fresh",
    name: "Ceramic Polish Concentrate",
    description: "Bathroom anti-scale concentrate for ceramic and steel surfaces.",
    category: { id: "c-bathroom", slug: "bathroom", name: "Bathroom" },
    brand: "Adzek",
    usage: "bathroom",
    image: "/media/softener-fresh-final.jpg",
    short: "750ml • Professional Grade",
    specs: ["Removes mineral traces", "Streak-free finish", "Daily-safe"],
    variants: [
      {
        id: "v-softener-fresh-750",
        sku: "AZ-POLISH-750",
        title: "750ml",
        price: 16000,
        currency: "KZT",
        stock: 8,
      },
    ],
  },
];

function mapCatalogProduct(product: CatalogProduct): StorefrontProduct {
  const byCategory: Record<string, ProductCategory> = {
    laundry: "laundry",
    kitchen: "kitchen",
    bathroom: "bathroom",
    refills: "universal",
    rituals: "universal",
  };

  const slug = product.slug.toLowerCase();
  const fallbackImage =
    slug.includes("dish") || slug.includes("kitchen")
      ? "/media/dish-liquid-citrus-final.jpg"
      : slug.includes("soft") || slug.includes("bath")
      ? "/media/softener-fresh-final.jpg"
      : "/media/laundry-gel-final.jpg";

  return {
    ...product,
    brand: "Adzek",
    usage: byCategory[product.category.slug] ?? "universal",
    image: fallbackImage,
    short: `${product.variants[0]?.title ?? "500ml"} • ${product.category.name}`,
    specs: ["Concentrated", "Home-safe", "Fast action"],
    isDiscount: false,
  };
}

export async function getStorefrontProducts(): Promise<StorefrontProduct[]> {
  try {
    const response = await fetch(`${API_BASE}/catalog/products`, { cache: "no-store" });
    if (!response.ok) return fallbackProducts;
    const products = (await response.json()) as CatalogProduct[];
    if (!Array.isArray(products) || products.length === 0) return fallbackProducts;
    return products.map(mapCatalogProduct);
  } catch {
    return fallbackProducts;
  }
}

export async function getStorefrontProductBySlug(slug: string): Promise<StorefrontProduct | null> {
  try {
    const response = await fetch(`${API_BASE}/catalog/products/${slug}`, { cache: "no-store" });
    if (!response.ok) {
      return fallbackProducts.find((p) => p.slug === slug) ?? null;
    }
    const product = (await response.json()) as CatalogProduct;
    return mapCatalogProduct(product);
  } catch {
    return fallbackProducts.find((p) => p.slug === slug) ?? null;
  }
}

export async function getRelatedProducts(slug: string): Promise<StorefrontProduct[]> {
  const products = await getStorefrontProducts();
  return products.filter((product) => product.slug !== slug).slice(0, 4);
}

export function getStorefrontCategories(products: StorefrontProduct[]): Array<{ slug: string; label: string }> {
  const set = new Map<string, string>();
  for (const product of products) {
    set.set(product.category.slug, product.category.name);
  }
  return [{ slug: "all", label: "All" }, ...Array.from(set.entries()).map(([slug, label]) => ({ slug, label }))];
}
