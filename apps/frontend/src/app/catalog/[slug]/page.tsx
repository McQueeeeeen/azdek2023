import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/add-to-cart-button";
import ProductGrid from "@/components/commerce/product-grid";
import { getRelatedProducts, getStorefrontProductBySlug } from "@/lib/storefront";
import { getProductCommercialContent } from "@/lib/product-commercial-content";
import { formatMoney } from "@/lib/money";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getStorefrontProductBySlug(params.slug);
  return {
    title: product ? `${product.name} | Adzek` : "Товар | Adzek",
    description: product?.description ?? "Карточка товара",
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getStorefrontProductBySlug(params.slug);
  if (!product) notFound();

  const variant = product.variants[0];
  const commercial = getProductCommercialContent(product.slug);
  const related = await getRelatedProducts(product.slug);

  return (
    <>
      <main className="pb-24 px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-8 text-sm text-on-surface-variant font-label">
          <Link href="/">Главная</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link href="/catalog">Коллекции</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-32">
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <div className="col-span-2 aspect-[4/3] rounded-xl overflow-hidden bg-secondary-container">
              <img alt={product.name} className="w-full h-full object-cover" src={product.image} />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden bg-surface-container-low">
              <img
                alt="Ингредиенты продукта"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGOUax9NWBAt1Pff4cSOgLU-YnToA7MrtDoeGFVrKgDIfwFYmz9RZ4KQ_D_9bowAg4d_pKUlUGm_05w3wOy-Yzv7dzxPZJjcH9Cjsmg-qw6JCVMh_e2vLqBOBOCxdHF2xxsNjPgPRn61Fzm2au8h37lw1BFt2sNXHqOT3BegKYJGrs_0RCdJoX83smkqjhrvLTOX257CcexTp4xqRI-lLmwSVG1D02yjBV3INCCwVA_8QxkTt_XxSyUnK_b-qhQ10dm4sYGjaeoMk4"
              />
            </div>
            <div className="aspect-square rounded-xl overflow-hidden bg-surface-container-low">
              <img
                alt="Текстура средства"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxPzksyH5ggksLjIxYbHtCjgRBG6-snrWI-GYqMq_giAkjuTm9Ewr2fozVwpEl4PX8DatkvLHXDheB4WFUZJri7crEFdXhd-nYsjhKdEx-e71FNl2MJO7k3nZjucZw6VDvmUkwP4AandLrr9QIwasnnZzr8FU6jvuC3-h5Jl6LMH_3wZ5a7tqBz3lX90ahOWnYxLP--8XXu9-SzuxJLF9JfMm1VJkxj7KHxH9Tvvl7e3PYSrK5_g_d7IpbpkqMkFRuc9kHvfOwyAwW"
              />
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-8 sticky top-32">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold mb-4 font-label">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  eco
                </span>
                100% БИОРАЗЛАГАЕМО
              </div>
              <h1 className="text-5xl font-extrabold font-headline tracking-tighter text-on-surface mb-2">{product.name}</h1>
              <p className="text-lg text-on-surface-variant font-body">{commercial.shortDescription}</p>
            </div>

            <div className="p-6 rounded-xl bg-surface-container-lowest shadow-2xl shadow-primary/5">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-sm text-on-surface-variant block font-label uppercase tracking-widest mb-1">Стоимость</span>
                  <span className="text-3xl font-bold font-headline text-on-surface">
                    {formatMoney(variant?.price ?? 0, variant?.currency ?? "KZT")}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-secondary font-semibold font-label">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span>4.9 (124 отзыва)</span>
                </div>
              </div>

              {variant ? (
                <AddToCartButton
                  className="w-full py-4 rounded-xl font-bold font-headline mb-3"
                  variantId={variant.id}
                  label="Добавить в корзину"
                  redirectToCart={false}
                  pendingLabel="Добавляем..."
                  doneLabel="Добавлено"
                  failedLabel="Повторить"
                />
              ) : (
                <button className="w-full py-4 bg-slate-300 text-slate-600 rounded-xl font-bold font-headline mb-3" disabled>
                  Нет в наличии
                </button>
              )}

              <button className="w-full py-4 bg-secondary-fixed text-on-secondary-fixed rounded-xl font-bold font-headline transition-colors hover:bg-secondary-fixed-dim">
                Подписаться на пополнение ( -15% )
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 rounded-xl bg-surface-container-low text-center">
                <span className="material-symbols-outlined text-primary mb-2 text-3xl">water_drop</span>
                <span className="text-[10px] font-bold font-label uppercase tracking-tighter">Разбавьте водой</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-surface-container-low text-center">
                <span className="material-symbols-outlined text-primary mb-2 text-3xl">auto_awesome</span>
                <span className="text-[10px] font-bold font-label uppercase tracking-tighter">Распылите</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-surface-container-low text-center">
                <span className="material-symbols-outlined text-primary mb-2 text-3xl">sweep</span>
                <span className="text-[10px] font-bold font-label uppercase tracking-tighter">Протрите</span>
              </div>
            </div>
          </div>
        </div>

        <section className="py-24 rounded-xl bg-surface-container-low relative overflow-hidden mb-24">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <span className="material-symbols-outlined text-[30rem] text-primary">eco</span>
          </div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 px-12 items-center">
            <div>
              <h2 className="text-4xl font-black font-headline text-on-surface mb-8 leading-tight">
                Наша философия: <br />
                <span className="text-secondary">Чистота без вреда</span>
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary">package_2</span>
                  </div>
                  <div>
                    <h4 className="font-bold font-headline">Zero Waste упаковка</h4>
                    <p className="text-on-surface-variant text-sm">Стеклянный флакон рассчитан на 10 лет использования.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary">biotech</span>
                  </div>
                  <div>
                    <h4 className="font-bold font-headline">Растительная формула</h4>
                    <p className="text-on-surface-variant text-sm">Без фосфатов, хлора и парабенов.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary">local_shipping</span>
                  </div>
                  <div>
                    <h4 className="font-bold font-headline">Углеродный след</h4>
                    <p className="text-on-surface-variant text-sm">Концентраты снижают выбросы CO2 на доставке.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
              <img
                alt="Adzek Production"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfAKHfYaHpTen-u-hz4BKb8N34vpM8WO1oSRNYkqULC2m-RkWc9037958-iJxD1o0t1B1Y2oZLEAQI2cIy7bn8Q84qdeJlDYoo8wfbHYT0JMwlHlv8UsCzhHrhB5sVtCnDYJLFQSxj8GXUKKWSREswkSwmQ9qI6-PQ8AgBIadIho1ftyJKSQVsSbc974j7F3bcASjwSzSFr5Xycpzl55ciF1sRAeWlG-BFce0tKE9U4pGrs2m8hCkeqtGSsah5t7o49J09mpH0n17R"
              />
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-3xl font-black font-headline text-on-surface tracking-tight">Честный состав</h2>
            <div className="h-1 w-24 bg-primary mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="md:col-span-2 p-8 rounded-xl bg-surface-container-lowest flex flex-col justify-between aspect-video md:aspect-auto">
              <div>
                <h3 className="text-2xl font-bold font-headline mb-2 text-primary">Эфирное масло мяты</h3>
                <p className="text-on-surface-variant">Природный антисептик с освежающим ароматом.</p>
              </div>
              <div className="flex justify-between items-center mt-8">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Происхождение: Италия</span>
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  nature
                </span>
              </div>
            </div>
            <div className="p-8 rounded-xl bg-secondary-container flex flex-col justify-between">
              <h3 className="text-xl font-bold font-headline text-on-secondary-container">Лимонная кислота</h3>
              <p className="text-on-secondary-container/80 text-sm mt-4">Удаляет известковый налет без резкого запаха.</p>
            </div>
            <div className="p-8 rounded-xl bg-surface-container-high flex flex-col justify-between">
              <h3 className="text-xl font-bold font-headline">Эвкалипт</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white/50 rounded-full text-[10px] font-bold">АНТИБАКТЕРИАЛЬНО</span>
                <span className="px-2 py-1 bg-white/50 rounded-full text-[10px] font-bold">СВЕЖЕСТЬ</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid" style={{ gap: 14 }}>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-black font-headline text-on-surface">Похожие продукты</h2>
            <Link href="/catalog" className="text-primary font-bold hover:underline">
              Весь каталог
            </Link>
          </div>
          <ProductGrid products={related} />
        </section>
      </main>
    </>
  );
}
