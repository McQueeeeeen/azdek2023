import Link from "next/link";
import AddToCartButton from "@/components/add-to-cart-button";
import { getStorefrontProducts } from "@/lib/storefront";
import { formatMoney } from "@/lib/money";

export default async function HomePage() {
  const products = await getStorefrontProducts();
  const featured = products.slice(0, 4);

  const categoryTiles = [
    { title: "Кухня", subtitle: "Эффективное удаление жира", icon: "restaurant", href: "/catalog?usage=kitchen" },
    { title: "Ванная", subtitle: "Антимикробный блеск", icon: "bathtub", href: "/catalog?usage=bathroom" },
    { title: "Стирка", subtitle: "Бережный уход за тканями", icon: "local_laundry_service", href: "/catalog?usage=laundry" },
    { title: "Универсальное", subtitle: "Ежедневная чистота поверхностей", icon: "weekend", href: "/catalog?usage=universal" },
  ];

  return (
    <div className="grid" style={{ gap: 0 }}>
      <section className="px-6 md:px-12">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-surface-2 min-h-[560px] flex items-center border border-[var(--border)] shadow-[var(--shadow-card)]">
          <div className="absolute inset-0 z-0">
            <img
              alt="Современная прачечная"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcEirWlTTDlo_6jFI4HAkY08ijPR162GMpG36q3creDsGdD3wO7zCD5Owx6OBZCzdYp9QU0mpknExw0MsBD8kGetAeyKpT59lY1WmGU-z1YauBq3HdKUqPusrD5dThqsxkyVMeNqeFTwGkzWXegU9nat8NDVUePFcY5O_Gs4yLiHiHKhmcW4vjpHsGNoZm4S7LjYx-2C5t2afSVhfcFibxwrGaN2S2vRDvCLvKI5YO-p9EoT69hUPGXVUkPmrAZU_uZQYED0Op1UHV"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent" />
          </div>
          <div className="relative z-10 max-w-2xl px-10 md:px-20 py-10">
            <span className="inline-block py-1 px-3 bg-[#d8f5d7] text-[#0b5f1a] text-[10px] font-semibold tracking-widest uppercase rounded-full mb-6">
              Премиальный уход за домом
            </span>
            <h1 className="h1 tracking-[-0.04em] mb-6">
              Чистота, которой можно <span style={{ color: "var(--primary)" }}>доверять.</span>
            </h1>
            <p className="body text-secondary mb-10 max-w-md">
              Премиальные моющие средства и лабораторно протестированные составы для безопасности вашего дома.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="px-8 py-4 rounded-xl text-white font-semibold shadow-lg transition-all hover:translate-y-[-2px]"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-hover))" }}
              >
                В магазин
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 bg-white rounded-xl font-semibold border border-[var(--border)] hover:bg-slate-50 transition-colors"
              >
                О лаборатории
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-12">
        <div className="mb-10">
          <h2 className="h2">Категории</h2>
          <p className="text-secondary mt-1">Специализированные формулы для каждого уголка дома</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categoryTiles.map((tile) => (
            <Link
              key={tile.title}
              href={tile.href}
              className="bg-white p-8 rounded-xl flex flex-col items-center justify-center text-center border border-[var(--border)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] hover:translate-y-[-2px] transition-all"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl" style={{ color: "var(--primary)" }}>
                  {tile.icon}
                </span>
              </div>
              <h3 className="h4">{tile.title}</h3>
              <p className="small mt-2">{tile.subtitle}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-12">
        <div className="flex items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="h2">Хиты продаж</h2>
            <p className="text-secondary mt-1">Самые востребованные решения</p>
          </div>
          <Link href="/catalog" className="text-sm font-semibold hover:underline" style={{ color: "var(--primary)" }}>
            Смотреть все
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((product) => {
            const variant = product.variants[0];
            if (!variant) return null;
            return (
              <article
                key={product.id}
                className="bg-white rounded-xl overflow-hidden border border-[var(--border)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] hover:translate-y-[-2px] transition-all"
              >
                <Link href={`/catalog/${product.slug}`} className="block h-64 bg-slate-100 relative">
                  <img alt={product.name} className="w-full h-full object-cover" src={product.image} />
                  <span className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-[10px] font-bold uppercase" style={{ color: "var(--primary)" }}>
                    {product.category.name}
                  </span>
                </Link>
                <div className="p-6 grid gap-4">
                  <div className="grid gap-2">
                    <h3 className="h4">{product.name}</h3>
                    <p className="small">{product.short}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xl font-semibold">{formatMoney(variant.price, variant.currency)}</span>
                    <div style={{ width: 160 }}>
                      <AddToCartButton
                        className="h-11"
                        variantId={variant.id}
                        label="В корзину"
                        redirectToCart={false}
                        pendingLabel="Добавляем..."
                        doneLabel="Добавлено"
                        failedLabel="Повторить"
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-6 md:px-12 py-12">
        <div className="rounded-[2.5rem] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative text-white" style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-hover))" }}>
          <div className="absolute right-0 top-0 w-1/3 h-full bg-white/10 skew-x-12 translate-x-20" />
          <div className="flex-1 z-10">
            <h2 className="h2 mb-6" style={{ color: "#fff" }}>
              Покупайте больше — платите меньше
            </h2>
            <p className="body mb-8 max-w-lg text-blue-50">
              Акция 2+1 на выбранные товары. Меньше пластика, больше эффективности и стабильный результат.
            </p>
            <Link href="/promotions" className="inline-flex px-10 py-5 bg-white rounded-xl font-bold hover:translate-y-[-2px] transition-transform" style={{ color: "var(--primary)" }}>
              Смотреть акции
            </Link>
          </div>
          <div className="flex-1 flex justify-center z-10">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
              <img
                alt="Рефилы PureLab"
                className="w-full h-full object-contain drop-shadow-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4NsjAqW5X2BszGl_22PqLfjSoE1IKj2N0APmPOpp2U-3sv3QK-W4QBHWXP1uJI-xnKX20V_BgEdKzp_iVdx8wdKRw_GbYVDoL_f1bJeqdc2qLY6foftpkLYWvjvoNH2ekX1StArp8U_PIipGRTYttIt3zCRIFo1l3yp7mTsdCQ85-V8nGTZqJ9APLMKvoSZ_Yu3NuAiLxIWEV9XlUYHPTC-laCkza2ZnsPxA5pO7ns8llANm3SDCi2QCELo79QiQgrssT97DhqDg2"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
