'use client';

import Link from 'next/link';
import SiteHeaderNew from '@/components/layout/site-header-new';
import SiteFooter from '@/components/layout/site-footer';

export default function HomeNew() {
  const products = [
    {
      id: '1',
      name: 'Гель для посуды "Мята и Лайм"',
      description: 'Гипоаллергенно, 500мл',
      price: 380,
      image: 'https://www.figma.com/api/mcp/asset/ee37d276-9582-474e-a031-6b45d8aa3bcb',
      badge: 'ECOLABEL',
    },
    {
      id: '2',
      name: 'Спрей для поверхностей',
      description: 'Масло чайного дерева, 450мл',
      price: 450,
      image: 'https://www.figma.com/api/mcp/asset/86c0f1b7-c630-4cd7-b820-00bfd17b1509',
      badge: 'ORGANIC',
    },
    {
      id: '3',
      name: 'Жидкое средство для стирки',
      description: 'Лаванда и Хлопок, 1000мл',
      price: 820,
      image: 'https://www.figma.com/api/mcp/asset/14b02abe-5244-4e87-8313-0d641b4eefc9',
      badge: 'ZERO WASTE',
    },
    {
      id: '4',
      name: 'Универсальное мыло-концентрат',
      description: 'Хвоя и Эвкалипт, 250г',
      price: 590,
      image: 'https://www.figma.com/api/mcp/asset/88857492-5cdd-4e75-928e-ce8fad4b2e45',
      badge: '100% BIO',
    },
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <SiteHeaderNew />

      <main>
        {/* Hero Section */}
        <section className="relative w-full pt-32 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/50 to-white opacity-80 z-10" />
          <img
            src="https://www.figma.com/api/mcp/asset/6033d72e-e958-4ad1-8786-7143e50923f9"
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="relative z-20 max-w-7xl mx-auto px-8">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-block bg-green-400 text-green-800 px-4 py-1 rounded-full mb-8 font-semibold text-sm">
                100% Биоразлагаемо
              </div>

              {/* Heading */}
              <h1 className="font-headline font-black text-6xl md:text-7xl text-on-surface text-authoritative leading-tight mb-6">
                Чистота от<br />природы
              </h1>

              {/* Description */}
              <p className="text-lg text-on-surface-variant max-w-xl mb-8 leading-relaxed">
                Создаем безупречную чистоту в вашем доме, используя только силу растений и минералов. Безопасно для семьи, бережно к планете.
              </p>

              {/* CTA Buttons */}
              <div className="flex gap-4 items-start">
                <Link href="/catalog">
                  <button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-3xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                    Смотреть каталог
                    <span className="material-symbols-outlined text-5 w-5 h-5">arrow_forward</span>
                  </button>
                </Link>
                <button className="bg-green-300 text-green-900 px-8 py-4 rounded-3xl font-semibold hover:bg-green-400 transition-all">
                  Эко-линейка
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="bg-blue-50 py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Feature 1 - Large Blue Card */}
              <div className="lg:col-span-1 bg-blue-700 text-white p-12 rounded-3xl flex flex-col">
                <span className="material-symbols-outlined text-5xl mb-6 text-white">verified_user</span>
                <h3 className="font-headline font-bold text-2xl mb-4">
                  Лабораторный<br />контроль
                </h3>
                <p className="text-blue-100 text-sm">
                  Протестировано дерматологами и экспертами по экологии.
                </p>
              </div>

              {/* Feature 2 - Large with Image */}
              <div className="lg:col-span-2 bg-white rounded-3xl overflow-hidden grid grid-cols-2">
                <div className="p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-green-600">eco</span>
                      <span className="text-green-600 font-semibold text-sm">Вторая жизнь пластика</span>
                    </div>
                    <h3 className="font-headline font-bold text-3xl mb-4">Мы зациклили производство</h3>
                    <p className="text-on-surface-variant mb-6">
                      Каждая упаковка PureLab на 100% состоит из переработанного океанического пластика. Принесите пустую тару в наши пункты приема и получите скидку 15%.
                    </p>
                  </div>
                  <button className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-3xl font-semibold hover:bg-blue-50 transition-colors w-fit">
                    Найти пункт приема
                  </button>
                </div>
                <div className="bg-blue-50 relative">
                  <img
                    src="https://www.figma.com/api/mcp/asset/8de2735d-750d-42cd-857e-66413498689c"
                    alt="Recycled bottles"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Feature 3 - Standards */}
              <div className="lg:col-span-2 bg-white p-12 rounded-3xl">
                <h3 className="font-headline font-bold text-3xl mb-4">Стандарт PureLab Green</h3>
                <p className="text-on-surface-variant mb-8">
                  Каждый наш продукт проходит строгую сертификацию. Мы исключили фосфаты, хлор и агрессивные ПАВ.
                </p>
                <div className="flex gap-8">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-white text-2xl">eco</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">VEGAN</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-white text-2xl">water</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">WATER SAFE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="bg-surface-container-lowest py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="font-headline font-black text-4xl text-on-surface mb-4">
                  Натуральные бестселлеры
                </h2>
                <p className="text-on-surface-variant">
                  Средства, которые выбирают осознанные потребители
                </p>
              </div>
              <Link href="/catalog" className="text-primary font-semibold flex items-center gap-2 hover:opacity-80">
                Весь каталог
                <span className="material-symbols-outlined text-5 w-5 h-5">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <Link key={product.id} href={`/catalog/${product.id}`}>
                  <div className="bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-square bg-blue-50 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                      {product.badge && (
                        <div className="absolute top-3 left-3 bg-green-400 text-green-800 px-2 py-1 rounded text-xs font-semibold uppercase">
                          {product.badge}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-headline font-bold text-lg text-on-surface mb-2">
                        {product.name}
                      </h3>
                      <p className="text-on-surface-variant text-sm mb-4 flex-grow">
                        {product.description}
                      </p>

                      {/* Price & Button */}
                      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/15">
                        <span className="text-2xl font-black text-on-surface">
                          {product.price} ₽
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                          className="bg-gray-200 hover:bg-primary hover:text-white text-on-surface p-3 rounded-xl transition-colors"
                        >
                          <span className="material-symbols-outlined text-5 w-5 h-5">
                            add_shopping_cart
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="relative py-24 overflow-hidden">
          <img
            src="https://www.figma.com/api/mcp/asset/c6ad0e43-a116-45af-9b51-29e5afdeb265"
            alt="Newsletter background"
            className="absolute inset-0 w-full h-full object-cover opacity-10"
          />
          <div className="relative max-w-2xl mx-auto px-8 text-center">
            <div className="backdrop-blur-lg bg-white/30 border border-white/40 rounded-3xl p-12">
              <h2 className="font-headline font-bold text-3xl text-on-surface mb-4">
                Станьте частью PureLab
              </h2>
              <p className="text-on-surface-variant mb-8 text-lg">
                Подпишитесь на наши советы по экологичной уборке и получайте персональные предложения.
              </p>

              <form className="flex gap-4">
                <input
                  type="email"
                  placeholder="Ваш e-mail"
                  className="flex-1 bg-white/60 border-0 rounded-full px-6 py-4 text-on-surface placeholder:text-gray-500 focus:ring-2 focus:ring-primary outline-none"
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-10 py-4 rounded-full font-semibold hover:shadow-lg transition-all"
                >
                  Подписаться
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
