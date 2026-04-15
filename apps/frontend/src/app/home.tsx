"use client";

import Link from "next/link";
import { useMemo } from "react";

export default function HomePage() {
  const features = useMemo(
    () => [
      { icon: "eco", title: "Vegan", description: "100% веган-дружественные ингредиенты" },
      { icon: "verified", title: "Сертифицировано", description: "Все продукты сертифицированы" },
      { icon: "leaf", title: "Эко", description: "Биоразлагаемая упаковка" },
    ],
    []
  );

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[800px] flex items-center overflow-hidden bg-gradient-to-r from-surface to-surface-container-low">
        <div className="absolute inset-0 z-0">
          <img
            alt="Натуральная чистота"
            className="w-full h-full object-cover opacity-40"
            src="https://images.unsplash.com/photo-1584622181473-0410f2969fba?w=1200&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-2xl">
            <span className="inline-block bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-sm font-semibold mb-6">
              100% Биоразлагаемо
            </span>
            <h1 className="text-6xl md:text-7xl font-extrabold text-on-surface tracking-tighter mb-6 leading-tight">
              Чистота от природы
            </h1>
            <p className="text-lg text-on-surface-variant mb-10 leading-relaxed max-w-xl">
              Создаём безупречную чистоту в вашем доме, используя только силу растений и минералов. Безопасно для семьи, бережно к планете.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
              >
                Смотреть каталог
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
              <button
                onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 bg-secondary-fixed text-on-surface px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform active:scale-95"
              >
                Узнать больше
                <span className="material-symbols-outlined text-base">expand_more</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-extrabold text-center mb-16 text-on-surface">Наши стандарты</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-surface-variant"
              >
                <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-on-surface">{feature.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-extrabold mb-6 text-on-surface">Стандарт Adzek Green</h2>
              <p className="text-lg text-on-surface-variant mb-6 leading-relaxed">
                Каждый наш продукт проходит строгую сертификацию. Мы исключили фосфаты, слои и агрессивные ПАВ. Каждая формула разработана с экспертами в области зеленой химии.
              </p>
              <ul className="space-y-3">
                {["Натуральные формулы", "Отсутствие микропластика", "Экологичная упаковка", "Эффективная формула"].map(
                  (item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-on-surface">
                      <span className="material-symbols-outlined text-success text-green-600">check_circle</span>
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden bg-surface-container-low">
              <img
                alt="Наша продукция"
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1584622181473-0410f2969fba?w=600&q=80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-primary-container">
        <div className="max-w-4xl mx-auto px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Готовы к переходу на экологичную чистоту?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Каждый заказ помогает сохранить нашу планету. Начните с любого продукта и почувствуйте разницу.
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all active:scale-95"
          >
            Перейти в каталог
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
