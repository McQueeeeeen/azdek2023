"use client";

import Link from "next/link";
import { useState, useMemo, useCallback } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  eco: boolean;
  inStock: boolean;
  popularity: number;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Универсальный эко-спрей для кухни PureBio",
    price: 890,
    rating: 4.9,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1584622181473-0410f2969fba?w=400&q=80",
    category: "kitchen",
    eco: true,
    inStock: true,
    popularity: 490,
  },
  {
    id: 2,
    name: 'Гель для мытья посуды "Лимон и Мята"',
    price: 450,
    rating: 4.7,
    reviews: 28,
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80",
    category: "kitchen",
    eco: false,
    inStock: true,
    popularity: 470,
  },
  {
    id: 3,
    name: 'Гель-концентрат для стирки "Снежный лотос"',
    price: 1200,
    rating: 5.0,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde0e?w=400&q=80",
    category: "laundry",
    eco: false,
    inStock: true,
    popularity: 500,
  },
  {
    id: 4,
    name: "Антижир для плит и дровок ExtraClean",
    price: 590,
    rating: 4.6,
    reviews: 12,
    image: "https://images.unsplash.com/photo-1563453392212-d0a3fb1ce2c2?w=400&q=80",
    category: "kitchen",
    eco: false,
    inStock: false,
    popularity: 460,
  },
];

export default function CatalogPage() {
  const [filters, setFilters] = useState({
    categories: ["kitchen"],
    maxPrice: 5000,
    inStockOnly: true,
  });

  const [sortBy, setSortBy] = useState("popular");

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter((p) => {
      const matchesCategory = filters.categories.includes(p.category);
      const matchesPrice = p.price <= filters.maxPrice;
      const matchesStock = !filters.inStockOnly || p.inStock;
      return matchesCategory && matchesPrice && matchesStock;
    });

    if (sortBy === "cheap") result.sort((a, b) => a.price - b.price);
    if (sortBy === "expensive") result.sort((a, b) => b.price - a.price);
    if (sortBy === "popular") result.sort((a, b) => b.popularity - a.popularity);

    return result;
  }, [filters, sortBy]);

  const toggleCategory = useCallback((cat: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat) ? prev.categories.filter((c) => c !== cat) : [...prev.categories, cat],
    }));
  }, []);

  return (
    <div className="pt-20 pb-10 min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-on-surface-variant text-sm mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            Главная
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-on-surface font-medium">Каталог</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-8 bg-white p-6 rounded-xl shadow-sm border border-surface-variant">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">tune</span> Фильтры
              </h3>

              {/* Categories */}
              <div>
                <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-4">Категории</h4>
                <div className="space-y-2">
                  {["kitchen", "bathroom", "laundry", "eco"].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm text-on-surface-variant group-hover:text-on-surface">
                        {cat === "kitchen" && "Кухня"}
                        {cat === "bathroom" && "Ванная"}
                        {cat === "laundry" && "Стирка"}
                        {cat === "eco" && "Эко"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-4">Цена (₽)</h4>
                <div className="px-2">
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="50"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                    className="w-full h-1.5 bg-surface-container-highest rounded-lg"
                  />
                  <div className="flex justify-between mt-3 text-xs font-medium text-on-surface-variant">
                    <span>100 ₽</span>
                    <span>{filters.maxPrice} ₽</span>
                  </div>
                </div>
              </div>

              {/* Stock Filter */}
              <div>
                <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-4">Наличие</h4>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStockOnly}
                      onChange={(e) => setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-container-highest peer-checked:bg-primary rounded-full transition-colors" />
                  </div>
                  <span className="text-sm text-on-surface-variant">В наличии</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-grow">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">Чистота без компромиссов</h1>
                <p className="text-on-surface-variant">Найдено {filteredProducts.length} товаров</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-on-surface-variant">Сортировка:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-surface-container-lowest border-none text-sm font-semibold rounded-lg py-2.5 pl-4 pr-10 cursor-pointer shadow-sm focus:ring-2 focus:ring-primary/20"
                >
                  <option value="popular">По популярности</option>
                  <option value="cheap">Сначала дешевле</option>
                  <option value="expensive">Сначала дороже</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/catalog/${product.id}`}
                    className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-surface-variant hover:border-primary overflow-hidden"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low">
                      <img
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={product.image}
                      />
                      {product.eco && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            Эко
                          </span>
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="bg-error text-white px-4 py-2 rounded-lg font-bold">Нет в наличии</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-2 flex flex-col flex-grow">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                        <span className="text-xs font-bold text-on-surface">{product.rating}</span>
                        <span className="text-xs text-on-surface-variant ml-1">({product.reviews})</span>
                      </div>
                      <h3 className="text-on-surface font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between pt-3 mt-auto">
                        <span className="text-lg font-extrabold text-on-surface">{product.price} ₽</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            alert("Товар добавлен в корзину!");
                          }}
                          disabled={!product.inStock}
                          className="flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-lg font-bold text-sm hover:bg-primary-container transition-all active:scale-95 shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined text-base">shopping_cart</span>
                          В корзину
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-on-surface mb-2">Товары не найдены</h2>
                <p className="text-on-surface-variant mb-6">Попробуйте изменить фильтры или сортировку</p>
                <button
                  onClick={() => setFilters({ categories: ["kitchen"], maxPrice: 5000, inStockOnly: true })}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-container transition-colors"
                >
                  Сбросить фильтры
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}