"use client";

import { useMemo, useState } from "react";
import { CatalogProduct } from "@/lib/api";
import ProductGrid from "./product-grid";
import EmptyState from "../ui/empty-state";
import { Input } from "../ui/input";
import Button from "../ui/button";

type SortMode = "featured" | "price_asc" | "price_desc" | "name_asc";

function getMinPrice(product: CatalogProduct): number {
  return product.variants[0]?.price ?? 0;
}

export default function CatalogBrowser({ products }: { products: CatalogProduct[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("featured");

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of products) {
      if (!seen.has(p.category.slug)) {
        seen.set(p.category.slug, p.category.name);
      }
    }
    return [{ slug: "all", name: "Все" }, ...Array.from(seen.entries()).map(([slug, name]) => ({ slug, name }))];
  }, [products]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let result = [...products];

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category.slug === activeCategory);
    }
    if (normalizedQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(normalizedQuery) ||
          p.description.toLowerCase().includes(normalizedQuery) ||
          p.category.name.toLowerCase().includes(normalizedQuery),
      );
    }

    switch (sortMode) {
      case "price_asc":
        result.sort((a, b) => getMinPrice(a) - getMinPrice(b));
        break;
      case "price_desc":
        result.sort((a, b) => getMinPrice(b) - getMinPrice(a));
        break;
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name, "ru"));
        break;
      default:
        break;
    }

    return result;
  }, [products, activeCategory, query, sortMode]);

  return (
    <div className="grid">
      <div className="catalog-commerce-strip">
        <span>В каталоге: {products.length} товаров</span>
        <span>Доставка по Казахстану</span>
        <span>Безопасная онлайн-оплата</span>
      </div>

      <div className="catalog-filters">
        <div className="catalog-filter-row">
          <Input
            placeholder="Поиск по товарам"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Поиск по товарам"
          />
          <select
            className="ui-input"
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            aria-label="Сортировка"
          >
            <option value="featured">По умолчанию</option>
            <option value="price_asc">Сначала дешевле</option>
            <option value="price_desc">Сначала дороже</option>
            <option value="name_asc">По названию</option>
          </select>
        </div>
        <div className="category-tabs" role="tablist" aria-label="Категории">
          {categories.map((category) => (
            <Button
              key={category.slug}
              variant={activeCategory === category.slug ? "primary" : "secondary"}
              className="category-tab"
              onClick={() => setActiveCategory(category.slug)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <ProductGrid products={filtered} />
      ) : (
        <EmptyState
          title="Ничего не найдено"
          description="Попробуйте изменить фильтры или очистить поисковый запрос."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery("");
                setActiveCategory("all");
                setSortMode("featured");
              }}
            >
              Сбросить фильтры
            </Button>
          }
        />
      )}
    </div>
  );
}
