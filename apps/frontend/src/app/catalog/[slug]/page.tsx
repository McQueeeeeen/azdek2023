'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('500ml');

  const product = {
    id: params.slug,
    name: 'Гель для посуды "Мята и Лайм"',
    price: 380,
    rating: 4.8,
    reviews: 142,
    badge: 'Эко',
    description: 'Экологичный гель для мытья посуды, безопасный для рук и окружающей среды. Эффективно очищает от жира и грязи, оставляя приятный запах мяты и лайма.',
    features: [
      'Натуральные ингредиенты',
      'Без фосфатов и SLS',
      'Биоразлагаемый состав',
    ],
    sizes: ['250ml', '500ml', '1L'],
  };

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />

      <main className="pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-8">
          {/* Breadcrumb */}
          <nav className="flex gap-2 text-sm mb-8">
            <Link href="/" className="text-on-surface-variant hover:text-primary">
              Главная
            </Link>
            <span className="text-on-surface-variant">/</span>
            <Link href="/catalog" className="text-on-surface-variant hover:text-primary">
              Каталог
            </Link>
            <span className="text-on-surface-variant">/</span>
            <span className="text-primary font-semibold">{product.name}</span>
          </nav>

          {/* Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div className="bg-white rounded-2xl p-8 sticky top-24 h-fit">
              <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl flex items-center justify-center mb-6 relative">
                <span className="material-symbols-outlined text-9xl text-blue-200">
                  water_bottle
                </span>
                <span className="absolute top-4 right-4 bg-secondary text-on-surface px-4 py-2 rounded-full font-bold">
                  {product.badge}
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <button
                    key={i}
                    className="w-16 h-16 bg-surface rounded-lg hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant">
                      image
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="font-headline font-black text-3xl text-on-surface mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined">
                      star
                    </span>
                  ))}
                </div>
                <span className="font-bold text-on-surface">{product.rating}</span>
                <span className="text-on-surface-variant">({product.reviews} отзывов)</span>
              </div>

              {/* Price */}
              <div className="mb-8 pb-8 border-b border-outline-variant">
                <p className="text-5xl font-black text-primary mb-2">{product.price} ₽</p>
                <p className="text-on-surface-variant">
                  Бесплатная доставка при заказе от 1000 ₽
                </p>
              </div>

              {/* Description */}
              <p className="text-on-surface-variant mb-8">{product.description}</p>

              {/* Size Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-on-surface mb-3">
                  Размер упаковки
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded-lg font-semibold transition-all ${
                        selectedSize === size
                          ? 'bg-primary text-white'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8 flex items-center gap-4">
                <label className="text-sm font-semibold text-on-surface">Количество:</label>
                <div className="flex items-center border border-outline-variant rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="px-6 font-bold text-on-surface">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all mb-4 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">add_shopping_cart</span>
                Добавить в корзину
              </button>

              <button className="w-full border-2 border-primary text-primary py-4 rounded-xl font-bold hover:bg-blue-50 transition-all">
                Добавить в избранное
              </button>

              {/* Features */}
              <div className="mt-8 p-6 bg-surface rounded-xl">
                <h3 className="font-bold text-on-surface mb-4">Особенности:</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-sm">check</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div>
            <h2 className="font-headline font-black text-3xl text-on-surface mb-8">
              Похожие товары
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Link key={idx} href={`/catalog/${idx + 2}`}>
                  <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                    <div className="w-full h-56 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-7xl text-blue-200">
                        water_bottle
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-on-surface mb-2">
                        Похожий товар {idx + 1}
                      </h3>
                      <p className="text-primary font-bold text-xl">
                        {350 + idx * 30} ₽
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
