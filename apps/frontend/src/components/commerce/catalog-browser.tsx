"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CatalogProduct } from "@/lib/api";
import EmptyState from "../ui/empty-state";
import { Input } from "../ui/input";
import Button from "../ui/button";
import { getProductCommercialContent } from "@/lib/product-commercial-content";
import { getProductMedia } from "@/lib/product-media";
import SmartImage from "../ui/smart-image";
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
  const [activeSolution, setActiveSolution] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("featured");

  const solutions = useMemo(
    () => ["all", "Убрать жир", "Убрать налет", "Убрать запах", "Универсальная уборка"] as const,
    [],
  );

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of products) {
      if (!seen.has(p.category.slug)) {
        const mapped = CATEGORY_LABEL_MAP[p.category.slug] ?? p.category.name;
        seen.set(p.category.slug, mapped);
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

    if (activeSolution !== "all") {
      result = result.filter((p) => getProductCommercialContent(p.slug).solution === activeSolution);
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
  }, [products, activeCategory, activeSolution, query, sortMode]);

  return (
    <div className="catalog-v4-shell">
      <section className="catalog-v4-header motion-in">
        <h1 className="catalog-v4-title">Каталог решений</h1>
        <p className="catalog-v4-subtitle">Выберите средство под задачу. Без лишнего.</p>
      </section>

      <section className="catalog-v4-toolbar motion-in">
        <div className="catalog-v4-search-sort">
          <Input
            className="catalog-v4-search"
            placeholder="Поиск по товарам"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Поиск по товарам"
          />
          <select
            className="ui-input catalog-v4-sort"
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

        <div className="category-tabs" role="tablist" aria-label="Решения по задачам">
          {solutions.map((solution) => (
            <Button
              key={solution}
              variant={activeSolution === solution ? "primary" : "secondary"}
              className="category-tab"
              onClick={() => setActiveSolution(solution)}
            >
              {solution === "all" ? "Все решения" : solution}
            </Button>
          ))}
        </div>
      </section>

      {filtered.length > 0 ? (
        <section className="catalog-v4-list" aria-label="Список товаров">
          {filtered.map((product, index) => {
            const variant = product.variants[0];
            const commercial = getProductCommercialContent(product.slug);
            const media = getProductMedia(product.slug);
            const reviewCount = commercial.reviews.length;
            const rating =
              reviewCount > 0
                ? (commercial.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount).toFixed(1)
                : "4.9";
            const isInStock = (variant?.stock ?? 0) > 0;

            return (
              <article key={product.id} className="catalog-v4-item motion-in" style={{ animationDelay: `${index * 40}ms` }}>
                <div className="catalog-v4-item-main">
                  <Link href={`/catalog/${product.slug}`} className="catalog-v4-thumb" aria-label={product.name}>
                    <SmartImage
                      src={media.card}
                      fallbackSrc="/media/laundry-gel.svg"
                      alt={product.name}
                      width={120}
                      height={120}
                      className="catalog-v4-thumb-image"
                      sizes="120px"
                      loading="lazy"
                    />
                  </Link>

                  <div className="catalog-v4-copy">
                    <span className="catalog-v4-kicker">{commercial.solution}</span>
                    <Link href={`/catalog/${product.slug}`} className="catalog-v4-name-link">
                      <h3 className="catalog-v4-name">{commercial.cardTitle ?? product.name}</h3>
                    </Link>
                    <p className="catalog-v4-desc">{commercial.cardPitch}</p>
                    <p className="catalog-v4-scent">{product.category.name}</p>
                  </div>
                </div>

                <div className="catalog-v4-item-side">
                  <div className="catalog-v4-price-wrap">
                    <PriceBlock amount={variant?.price ?? 0} currency={variant?.currency ?? "KZT"} />
                    <span className={isInStock ? "product-stock ok" : "product-stock warn"}>
                      {isInStock ? "В наличии" : "Под заказ"}
                    </span>
                  </div>

                  <div className="catalog-v4-meta">★ {rating} · {reviewCount}+ отзывов</div>

                  {variant ? (
                    <AddToCartButton
                      variantId={variant.id}
                      label="Добавить в корзину"
                      redirectToCart={false}
                      className="catalog-v4-buy-btn"
                      pendingLabel="Добавляем"
                      doneLabel="Добавлено"
                      failedLabel="Ошибка"
                    />
                  ) : (
                    <Link href={`/catalog/${product.slug}`}>
                      <Button className="catalog-v4-buy-btn">Купить</Button>
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <EmptyState
          title="Ничего не найдено"
          description="Измените фильтры или очистите поисковый запрос"
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery("");
                setActiveCategory("all");
                setActiveSolution("all");
                setSortMode("featured");
              }}
            >
              Сбросить фильтры
            </Button>
          }
        />
      )}

      <div className="catalog-v4-footer motion-in">
        <Button variant="primary" className="catalog-v4-load-btn">
          Показать еще
        </Button>
        <p>Показано {filtered.length} из {products.length} товаров</p>
      </div>
    </div>
  );
}


