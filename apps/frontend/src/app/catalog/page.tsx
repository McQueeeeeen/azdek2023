import CatalogBrowser from '@/components/commerce/catalog-browser';
import { CATALOG_PRODUCTS, CatalogProductSummary } from '@/lib/catalog-data';
import Link from 'next/link';

import { z } from 'zod';

const backendProductSchema = z.array(z.object({
  id: z.union([z.string(), z.number()]).optional(),
  slug: z.string(),
  name: z.string(),
  category: z.object({ slug: z.string() }).optional().or(z.string().optional()),
  price: z.number().optional(),
  variants: z.array(z.object({ price: z.number() })).optional(),
  badge: z.string().nullable().optional(),
  description: z.string().optional(),
}).passthrough());

export const revalidate = 60; // Revalidate every 60 seconds

export default async function CatalogPage() {
  let products: CatalogProductSummary[] = [];
  let error = false;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:4000/v1';
    // Use timeout to prevent hanging if backend is down
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const res = await fetch(`${apiUrl}/catalog/products`, {
      signal: controller.signal,
      next: { revalidate: 60 }
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Failed to fetch catalog: ${res.status}`);
    }

    const rawData = await res.json();
    const validatedData = backendProductSchema.parse(rawData);
    
    // Map backend data to StorefrontProduct/CatalogProductSummary
    products = validatedData.map((item) => ({
      id: typeof item.id === 'number' ? item.id : Math.floor(Math.random() * 10000),
      slug: item.slug,
      name: item.name,
      category: (typeof item.category === 'object' ? item.category?.slug : item.category) as any || 'cleaning',
      price: item.variants?.[0]?.price || item.price || 0,
      badge: item.badge || '',
      sub: item.description || '',
      rating: 5.0,
      reviews: 0,
      description: item.description || ''
    }));
  } catch (err) {
    console.warn('Backend unavailable, falling back to local data or showing error', err);
    error = true;
    
    // Plan requested: "Реализовать graceful degradation: если бэкенд недоступен, отображать EmptyState с ошибкой (а не "падать" с белым экраном)."
    // So we don't fallback to CATALOG_PRODUCTS, we show EmptyState.
  }

  if (error || products.length === 0) {
    return (
      <div className="min-h-screen bg-bg pt-header flex flex-col items-center justify-center p-8">
        <div className="bg-surface border border-line rounded-3xl p-12 max-w-md w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-3xl">cloud_off</span>
          </div>
          <h2 className="font-headline font-bold text-2xl text-ink mb-2">
            Сервис временно недоступен
          </h2>
          <p className="text-ink-variant mb-8 text-sm">
            Мы не смогли загрузить каталог товаров. Возможно, проводятся технические работы. Пожалуйста, попробуйте позже.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/" className="btn bg-surface border border-line text-ink hover:border-clay transition-colors px-6 py-2 rounded-full font-semibold text-sm">
              На главную
            </Link>
            <Link href="/catalog" className="btn btn-clay px-6 py-2 rounded-full font-semibold text-sm">
              Перезагрузить
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <CatalogBrowser initialProducts={products} />;
}
