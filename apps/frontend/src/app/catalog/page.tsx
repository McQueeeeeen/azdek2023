'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const categories = ['Все', 'Для кухни', 'Для ванной', 'Для уборки', 'Для стирки'];
  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Товар ${i + 1}`,
    price: 280 + i * 50,
    rating: 4.5 + Math.random(),
    badge: ['Эко', 'Органик', 'Премиум'][i % 3],
  }));

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />

      <main className="pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-8">
          {/* Header */}
          <div className="mb-12">
            <nav className="flex gap-2 text-sm mb-6">
              <Link href="/" className="text-on-surface-variant hover:text-primary">
                Главная
              </Link>
              <span className="text-on-surface-variant">/</span>
              <span className="text-primary font-semibold">Каталог</span>
            </nav>
            <h1 className="font-headline font-black text-4xl text-on-surface mb-2">
              Каталог товаров
            </h1>
            <p className="text-on-surface-variant">
              Широкий выбор экологичных средств для вашего дома
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Categories */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-on-surface mb-3">Категории</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCategory(idx === 0 ? 'all' : cat.toLowerCase())}
                      className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                        (idx === 0 && selectedCategory === 'all') ||
                        (idx > 0 && selectedCategory === cat.toLowerCase())
                          ? 'bg-primary text-white'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-on-surface mb-3">Сортировка</p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="popular">По популярности</option>
                  <option value="price-asc">По цене: возрастание</option>
                  <option value="price-desc">По цене: убывание</option>
                  <option value="newest">Новинки</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link key={product.id} href={`/catalog/${product.id}`}>
                <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer h-full">
                  <div className="w-full h-56 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center relative">
                    <span className="material-symbols-outlined text-7xl text-blue-200">
                      water_bottle
                    </span>
                    <span className="absolute top-3 right-3 bg-secondary text-on-surface px-3 py-1 rounded-full text-xs font-bold">
                      {product.badge}
                    </span>
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
                        {product.rating.toFixed(1)}
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
      </main>

      <SiteFooter />
    </div>
  );
}
