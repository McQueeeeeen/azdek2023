'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import SiteHeaderNew from '@/components/layout/site-header-new';
import SiteFooter from '@/components/layout/site-footer';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Гель для посуды «Мята»',
    description: '99.8% натуральных компонентов',
    price: 590,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTjY8wS3hCya3EC4v7PEY1ORdupHjr0-jz_bhduuXcdEZQo1d-q_eXk9YhMpuTFj2UG2Xdh_f5mua1id68CUzfOdyuRSAF89slMXoK65AXMEJeDEC-OQrjwkxrcTKx6pkVLlu-yb3uqNVo00gN95c0dCyXEV6twOsHsWuvhCLn5nOYCa3K3gtd2sgrfFFusc1Qv4gaf4oOoCcZnrcspA1hIFA15MvjRwWpbW87mcBxi-VNb2bi48hJis2IQSSBERyuLTpbRzFuqDJm',
    category: 'kitchen',
    inStock: true,
    rating: 4.9,
    reviews: 42,
  },
  {
    id: '2',
    name: 'Антижир Bio-Force',
    description: 'Без агрессивных ПАВ и хлора',
    price: 750,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEs7al3xa-MU8ObJfiyQKlGz5vyz4A0wuWod-VErwsGcp-MYgvKe7N8sMzMXfcS5xBKeRY20DrhdrBVB17TppudQrQJ5Fkf8q_Cq73uI6nU6KjfpbxpfpkoKJyQjpvbPZXGm8R-ZEhyDVrlvvAzWHOAB1J0ejymHOFMQutlZ34UQcJAvXFcvC8TJg73z2ep8pS8niMrRKJ-2yYM_dowcz8r_P7UrYkS--NVNYdP9FV1YGyebVJlFzZty4u0d6E2w5vyQixI-0sGmP7',
    category: 'kitchen',
    inStock: true,
    rating: 4.8,
    reviews: 35,
  },
  {
    id: '3',
    name: 'Набор Эко-губок',
    description: '100% биоразлагаемая целлюлоза',
    price: 320,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9es75yFtdrCT2I_Ng9igTy2GwDfbL1cQIWX8B-ovmR3Tt0uyZglWzFlYko0AGGk8JuNXV0AbnVirztktq1kZt8i9DVXCuwqy4JRfZhnc911J0UoS7bhvjG3u5I_U4sRozNAbYieOip5TjX_pPgKyIqGxyTgqaUk8OWw27h3Oarhb0sc9E_Paxh2aCEXNiB53qu24F5el-YO84tWdVn5a_L4sRFJuLUf1OQtB7PBpJ6R35cPBM49_g8P4v7V6zSq70tQZuctNaIdeH',
    category: 'kitchen',
    inStock: true,
    rating: 5.0,
    reviews: 28,
  },
  {
    id: '4',
    name: 'Стиральный гель',
    description: 'Концентрат для всех типов тканей',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde0e?w=400&q=80',
    category: 'laundry',
    inStock: true,
    rating: 4.9,
    reviews: 156,
  },
];

const CATEGORIES = ['Все товары', 'Кухня', 'Ванная', 'Стирка', 'Эко-товары'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'По популярности' },
  { value: 'price-asc', label: 'По цене: сначала дешевле' },
  { value: 'price-desc', label: 'По цене: сначала дороже' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'newest', label: 'Новые' },
];

export default function CatalogNew() {
  const [selectedCategory, setSelectedCategory] = useState('Все товары');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    let filtered = PRODUCTS;

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <SiteHeaderNew />

      <main className="pt-32 pb-20">
        <div className="px-8 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="font-headline text-5xl md:text-6xl font-black text-on-surface text-authoritative leading-tight mb-4">
              Каталог товаров
            </h1>
            <p className="text-on-surface-variant text-lg max-w-2xl">
              Откройте мир натуральной и безопасной чистоты. Все наши товары созданы с заботой о вашем
              здоровье и окружающей среде.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              {/* Categories */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl mb-6">
                <h3 className="font-headline font-bold text-lg text-on-surface mb-4">Категории</h3>
                <div className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                        selectedCategory === category
                          ? 'bg-primary text-white font-semibold'
                          : 'text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl">
                <h3 className="font-headline font-bold text-lg text-on-surface mb-4">Сортировка</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Search Bar */}
              <div className="mb-8 flex items-center bg-surface-container-lowest rounded-full px-6 py-3 border border-outline-variant/15">
                <span className="material-symbols-outlined text-primary text-5 w-5 h-5">search</span>
                <input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none ml-2"
                />
              </div>

              {/* Results Count */}
              <div className="mb-6 text-on-surface-variant">
                Найдено товаров: <span className="font-bold text-on-surface">{filteredProducts.length}</span>
              </div>

              {/* Products */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/catalog/${product.id}`}>
                    <div className="bg-surface-container-lowest p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0px_20px_40px_rgba(0,88,188,0.1)] group cursor-pointer h-full flex flex-col">
                      {/* Image */}
                      <div className="aspect-square bg-secondary-container rounded-xl mb-6 overflow-hidden relative">
                        <img
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          src={product.image}
                          loading="lazy"
                        />
                        {product.inStock && (
                          <div className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">
                            В наличии
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="font-headline font-bold text-lg text-on-surface mb-2">
                          {product.name}
                        </h3>
                        <p className="text-on-surface-variant text-sm mb-4">{product.description}</p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 text-sm mb-4">
                          <div className="flex text-yellow-500">
                            {'★'.repeat(Math.floor(product.rating))}
                            {'☆'.repeat(5 - Math.floor(product.rating))}
                          </div>
                          <span className="text-on-surface-variant">({product.reviews})</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center pt-4 border-t border-outline-variant/15">
                        <span className="text-2xl font-black text-on-surface">{product.price} ₽</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                          className="bg-surface-container-high p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors text-on-surface"
                        >
                          <span className="material-symbols-outlined text-5 w-5 h-5">
                            add_shopping_cart
                          </span>
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-8xl text-surface-variant mb-4 block">
                    search_off
                  </span>
                  <h3 className="font-headline text-xl font-bold text-on-surface mb-2">
                    Товары не найдены
                  </h3>
                  <p className="text-on-surface-variant">
                    Попробуйте изменить критерии поиска или выбрать другую категорию
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
