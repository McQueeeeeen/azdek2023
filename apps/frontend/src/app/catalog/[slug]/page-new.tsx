'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteHeaderNew from '@/components/layout/site-header-new';
import SiteFooter from '@/components/layout/site-footer';

interface ProductPageProps {
  params: { slug: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('500ml');

  // Mock product data - в реальном приложении это будет из API
  const product = {
    id: params.slug,
    name: 'Гель для посуды "Мята и Лайм"',
    price: 380,
    rating: 4.9,
    reviews: 42,
    inStock: true,
    description: 'Гипоаллергенный гель для посуды с натуральными компонентами',
    fullDescription: 'Мягкий, но эффективный гель для посуды, который справляется с жиром и грязью без агрессивных химических компонентов. 99.8% натуральных ингредиентов.',
    images: [
      'https://www.figma.com/api/mcp/asset/ee37d276-9582-474e-a031-6b45d8aa3bcb',
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde0e?w=600&q=80',
    ],
    sizes: ['500ml', '1000ml', '5L'],
    badges: ['ECOLABEL', 'VEGAN', 'CRUELTY-FREE'],
    features: [
      { icon: 'eco', title: 'Экологичный', description: '100% биоразлагаемый состав' },
      { icon: 'water', title: 'Безопасный', description: 'Протестирован дерматологами' },
      { icon: 'leaf', title: 'Натуральный', description: 'Без агрессивных ПАВ' },
    ],
  };

  const [mainImage, setMainImage] = useState(product.images[0]);

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeaderNew />

      <main className="pt-20 pb-24">
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto px-8 mb-12">
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/" className="hover:text-primary">Главная</Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-primary">Каталог</Link>
            <span>/</span>
            <span className="text-on-surface">{product.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {/* Product Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-3xl overflow-hidden aspect-square">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    mainImage === img ? 'border-primary' : 'border-outline-variant'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.badges.map((badge) => (
                <span
                  key={badge}
                  className="bg-green-400 text-green-800 px-3 py-1 rounded-full text-xs font-semibold uppercase"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Title */}
            <div>
              <h1 className="font-headline font-black text-4xl text-on-surface mb-2">
                {product.name}
              </h1>
              <p className="text-on-surface-variant">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex text-yellow-500">
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span className="text-on-surface-variant">
                {product.rating} ({product.reviews} отзывов)
              </span>
            </div>

            {/* Price */}
            <div className="text-4xl font-black text-on-surface">
              {product.price} ₽
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <label className="font-semibold text-on-surface block">Объем:</label>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl border-2 font-semibold transition-colors ${
                      selectedSize === size
                        ? 'bg-primary text-white border-primary'
                        : 'border-outline-variant text-on-surface hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex gap-4 items-center">
              <div className="flex items-center border border-outline-variant rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-surface-container-high"
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <span className="px-6 font-semibold min-w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-surface-container-high"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>

              <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">add_shopping_cart</span>
                Добавить в корзину
              </button>
            </div>

            {/* Stock Status */}
            {product.inStock ? (
              <div className="flex items-center gap-2 text-green-600">
                <span className="material-symbols-outlined">check_circle</span>
                Есть в наличии
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <span className="material-symbols-outlined">cancel</span>
                Нет в наличии
              </div>
            )}
          </div>
        </div>

        {/* Full Description */}
        <section className="max-w-7xl mx-auto px-8 mb-24">
          <div className="bg-white rounded-3xl p-12">
            <h2 className="font-headline font-bold text-2xl text-on-surface mb-6">
              Описание
            </h2>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-6">
              {product.fullDescription}
            </p>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              Рекомендуется для использования на кухне, в ванной комнате и для деликатной стирки деликатных тканей. Безопасен для детей и домашних животных.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-8 mb-24">
          <h2 className="font-headline font-bold text-2xl text-on-surface mb-8">
            Почему выбирают PureLab
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {product.features.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface">{feature.icon}</span>
                  </div>
                </div>
                <h3 className="font-headline font-bold text-lg text-on-surface mb-2">
                  {feature.title}
                </h3>
                <p className="text-on-surface-variant text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Products */}
        <section className="max-w-7xl mx-auto px-8 mb-24">
          <h2 className="font-headline font-bold text-2xl text-on-surface mb-8">
            Похожие товары
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <Link key={item} href={`/catalog/${item}`}>
                <div className="bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                  <div className="aspect-square bg-blue-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300">
                      shopping_bag
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-headline font-bold text-lg text-on-surface mb-2">
                      Товар {item}
                    </h3>
                    <p className="text-on-surface-variant text-sm mb-4">Описание товара</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-on-surface">350 ₽</span>
                      <button className="bg-gray-200 hover:bg-primary hover:text-white p-2 rounded-lg transition-colors">
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
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
