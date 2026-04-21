'use client';

import Link from 'next/link';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';

export default function HomePage() {
  const features = [
    {
      title: 'Лабораторный контроль',
      description: 'Все товары проходят строгую проверку качества в собственной лаборатории',
      icon: 'science',
    },
    {
      title: 'Вторая жизнь пластика',
      description: 'Экологичная переработка и минимум отходов в производстве',
      icon: 'recycling',
    },
    {
      title: 'Стандарт PureLab Green',
      description: 'Соответствие международным экостандартам и сертификатам',
      icon: 'eco',
    },
  ];

  const products = [
    { name: 'Гель для посуды "Мята и Лайм"', price: 380, rating: 4.8, badge: 'Эко' },
    { name: 'Спрей для поверхностей', price: 450, rating: 4.9, badge: 'Органик' },
    { name: 'Универсальное средство', price: 520, rating: 4.7, badge: 'Премиум' },
    { name: 'Мыло для рук', price: 280, rating: 4.6, badge: 'Натураль' },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-32">
          <div className="max-w-7xl mx-auto px-8">
            <div className="max-w-3xl">
              <h1 className="font-headline font-black text-5xl md:text-6xl mb-6">
                Чистота от природы
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Экологичные средства для вашего дома, которые безопасны для всей семьи и окружающей среды
              </p>
              <Link href="/catalog">
                <button className="bg-white text-primary px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all inline-flex items-center gap-2">
                  <span className="material-symbols-outlined">shopping_bag</span>
                  Открыть каталог
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="font-headline font-black text-4xl text-on-surface text-center mb-16">
              Почему выбирают PureLab?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-surface rounded-3xl p-8 hover:shadow-lg transition-all"
                >
                  <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-4xl">{feature.icon}</span>
                  </div>
                  <h3 className="font-headline font-bold text-xl text-on-surface mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-on-surface-variant">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="font-headline font-black text-4xl text-on-surface mb-4">
              Лучшие товары
            </h2>
            <p className="text-on-surface-variant mb-12">
              Наиболее популярные товары среди наших покупателей
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product, idx) => (
                <Link key={idx} href={`/catalog/${idx + 1}`}>
                  <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer h-full">
                    <div className="w-full h-56 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center relative">
                      <span className="material-symbols-outlined text-7xl text-blue-200">
                        water_bottle
                      </span>
                      {product.badge && (
                        <span className="absolute top-3 right-3 bg-secondary text-on-surface px-3 py-1 rounded-full text-xs font-bold">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-on-surface mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="material-symbols-outlined text-sm">
                              star
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-on-surface-variant">
                          {product.rating}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-headline font-bold text-2xl text-primary">
                          {product.price} ₽
                        </span>
                        <button className="p-3 bg-primary text-white rounded-full hover:shadow-lg transition-all">
                          <span className="material-symbols-outlined">add_shopping_cart</span>
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
        <section className="py-24 bg-white">
          <div className="max-w-2xl mx-auto px-8 text-center">
            <h2 className="font-headline font-black text-4xl text-on-surface mb-4">
              Подпишитесь на новости
            </h2>
            <p className="text-on-surface-variant mb-8 text-lg">
              Получайте эксклюзивные предложения и информацию о новых товарах прямо в ваш почтовый ящик
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Ваш email"
                className="flex-1 border border-outline-variant rounded-xl px-6 py-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
              <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2">
                <span className="material-symbols-outlined">send</span>
                <span className="hidden sm:inline">Подписать</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}