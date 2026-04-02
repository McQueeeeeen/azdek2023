"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CatalogProduct } from "@/lib/api";
import EmptyState from "../ui/empty-state";
import { Input } from "../ui/input";
import Button from "../ui/button";
import AddToCartButton from "../add-to-cart-button";
import PriceBlock from "./price-block";

type SortMode = "featured" | "price_asc" | "price_desc" | "name_asc";

const CATEGORY_LABEL_MAP: Record<string, string> = {
  laundry: "Стирка",
  kitchen: "Кухня",
  refills: "Пополнения",
  rituals: "Ритуалы",
};

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
        seen.set(p.category.slug, CATEGORY_LABEL_MAP[p.category.slug] ?? p.category.name);
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
      <div className="ui-card">
        <h1>Каталог</h1>
        <p className="text-secondary">Выберите товар и добавьте в корзину.</p>

        <div className="grid" style={{ gridTemplateColumns: "1fr 220px" }}>
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
            <option value="featured">Сначала популярные</option>
            <option value="name_asc">По названию</option>
            <option value="price_asc">Сначала дешевле</option>
            <option value="price_desc">Сначала дороже</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map((category) => (
            <Button
              key={category.slug}
              variant={activeCategory === category.slug ? "primary" : "secondary"}
              onClick={() => setActiveCategory(category.slug)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid">
          {filtered.map((product) => {
            const variant = product.variants[0];
            return (
              <article key={product.id} className="ui-card">
                <h3>{product.name}</h3>
                <p className="text-secondary">{product.description}</p>
                <p className="small">Категория: {CATEGORY_LABEL_MAP[product.category.slug] ?? product.category.name}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <PriceBlock amount={variant?.price ?? 0} currency={variant?.currency ?? "KZT"} />
                  <Link href={`/catalog/${product.slug}`}>
                    <Button variant="secondary">Открыть</Button>
                  </Link>
                  {variant ? (
                    <AddToCartButton
                      variantId={variant.id}
                      label="Добавить в корзину"
                      redirectToCart={false}
                      pendingLabel="Добавляем"
                      doneLabel="Добавлено"
                      failedLabel="Ошибка"
                    />
                  ) : (
                    <Button disabled>Нет в наличии</Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Ничего не найдено"
          description="Измените фильтр или поисковый запрос"
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery("");
                setActiveCategory("all");
                setSortMode("featured");
              }}
            >
              Сбросить
            </Button>
          }
        />
      )}
    </div>
  );
}