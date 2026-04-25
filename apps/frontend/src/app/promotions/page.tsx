import CatalogBrowser from '@/components/commerce/catalog-browser';
import { CatalogProductSummary } from '@/lib/catalog-data';
import { z } from 'zod';

const backendProductSchema = z.array(z.object({
  id: z.union([z.string(), z.number()]).optional(),
  slug: z.string(),
  name: z.string(),
  badge: z.string().nullable().optional(),
  category: z.object({ slug: z.string() }).optional().or(z.string().optional()),
  price: z.number().optional(),
  variants: z.array(z.object({ price: z.number() })).optional(),
  description: z.string().optional(),
}).passthrough());

export const revalidate = 60;

export default async function PromotionsPage() {
  let products: CatalogProductSummary[] = [];
  let error = false;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:4000/v1';
    const res = await fetch(`${apiUrl}/catalog/products`, { cache: 'no-store' });
    
    if (res.ok) {
      const rawData = await res.json();
      const validatedData = backendProductSchema.parse(rawData);
      
      products = validatedData.map((item) => {
        const firstVariantPrice = item.variants?.[0]?.price || 0;
        return {
          id: typeof item.id === 'string' ? Math.abs(item.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) : item.id || 0,
          slug: item.slug,
          name: item.name,
          category: (typeof item.category === 'object' ? item.category?.slug : item.category) as any || 'laundry',
          price: item.price || firstVariantPrice,
          badge: item.badge || '',
          sub: item.description?.slice(0, 50) || '',
          rating: 5,
          reviews: 0,
          description: item.description || '',
        };
      });

      // Filter for new arrivals
      products = products.filter(p => p.badge === 'Новинка' || p.badge === 'New');
    } else {
      error = true;
    }
  } catch (err) {
    console.error('Failed to fetch promotions:', err);
    error = true;
  }

  if (error || products.length === 0) {
    return (
      <div className="pt-32 pb-20 text-center bg-surface min-h-screen">
        <h1 className="text-3xl font-bold text-ink mb-4">Новинки Azdek</h1>
        <p className="text-ink-2 max-w-md mx-auto">
          {error ? 'Ошибка загрузки данных. Пожалуйста, попробуйте позже.' : 'Сейчас нет активных новинок. Загляните в основной каталог!'}
        </p>
        <div className="mt-8">
          <a href="/catalog" className="btn btn-clay">Перейти в каталог</a>
        </div>
      </div>
    );
  }

  return (
    <CatalogBrowser 
      initialProducts={products} 
      title="Новинки Azdek"
      description="Самые свежие поступления нашего производства"
      breadcrumbCurrent="Новинки"
    />
  );
}