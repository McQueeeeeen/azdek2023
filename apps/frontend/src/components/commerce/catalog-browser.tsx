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

const AURA_ITEMS = ["Лаванда", "Мята", "Бергамот", "Кедр"];

function getMinPrice(product: CatalogProduct): number {
  return product.variants[0]?.price ?? 0;
}

export default function CatalogBrowser({ products }: { products: CatalogProduct[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSolution, setActiveSolution] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const [activeAura, setActiveAura] = useState("Мята");

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

  const heroProduct = products[0];
  const heroMedia = heroProduct ? getProductMedia(heroProduct.slug) : null;

  return (
    <div className="catalog-v5-shell">
      <section className="catalog-v5-hero motion-in">
        {heroMedia ? (
          <SmartImage
            src={heroMedia.hero}
            fallbackSrc="/media/laundry-gel.svg"
            alt="Каталог Azdek"
            fill
            className="catalog-v5-hero-bg"
            priority
            sizes="100vw"
          />
        ) : null}
        <div className="catalog-v5-hero-overlay" />
        <div className="catalog-v5-hero-copy">
          <h1>Каталог Azdek</h1>
          <p>Сильные средства для дома. Выбирайте по задаче, а не наугад.</p>
        </div>
      </section>

      <section className="catalog-v5-tiles motion-in" aria-label="Категории каталога">
        {categories.slice(1, 5).map((category, index) => {
          const product = products[index % Math.max(products.length, 1)];
          const media = product ? getProductMedia(product.slug) : null;

          return (
            <button
              key={category.slug}
              type="button"
              className={"catalog-v5-tile" + (activeCategory === category.slug ? " is-active" : "")}
              onClick={() => setActiveCategory(category.slug)}
            >
              {media ? (
                <SmartImage
                  src={media.card}
                  fallbackSrc="/media/laundry-gel.svg"
                  alt={category.name}
                  fill
                  className="catalog-v5-tile-image"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              ) : null}
              <span>{category.name}</span>
            </button>
          );
        })}
      </section>

      <section className="catalog-v5-aura motion-in">
        <div className="catalog-v5-aura-head">
          <p>Профиль аромата</p>
          <h2>Discover your aura</h2>
        </div>
        <div className="catalog-v5-aura-list">
          {AURA_ITEMS.map((item) => (
            <button
              key={item}
              type="button"
              className={"catalog-v5-aura-pill" + (activeAura === item ? " is-active" : "")}
              onClick={() => setActiveAura(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="catalog-v5-toolbar motion-in">
        <div className="catalog-v5-search-sort">
          <Input
            className="catalog-v5-search"
            placeholder="Поиск по товарам"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Поиск по товарам"
          />
          <select
            className="ui-input catalog-v5-sort"
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

      <section className="catalog-v5-products motion-in">
        <div className="catalog-v5-products-head">
          <div>
            <h3>Выборка товаров</h3>
            <p>Подходящие позиции по фильтрам и поиску.</p>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="catalog-v5-grid" aria-label="Список товаров">
            {filtered.map((product) => {
              const variant = product.variants[0];
              const commercial = getProductCommercialContent(product.slug);
              const media = getProductMedia(product.slug);

              return (
                <article key={product.id} className="catalog-v5-card">
                  <Link href={`/catalog/${product.slug}`} className="catalog-v5-card-media" aria-label={product.name}>
                    <SmartImage
                      src={media.card}
                      fallbackSrc="/media/laundry-gel.svg"
                      alt={product.name}
                      fill
                      className="catalog-v5-card-image"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    {media.tag ? <span className="catalog-v5-card-tag">{media.tag}</span> : null}
                  </Link>

                  <div className="catalog-v5-card-body">
                    <h4>{commercial.cardTitle ?? product.name}</h4>
                    <p>{commercial.cardPitch}</p>
                    <div className="catalog-v5-card-foot">
                      <PriceBlock amount={variant?.price ?? 0} currency={variant?.currency ?? "KZT"} />
                      {variant ? (
                        <AddToCartButton
                          variantId={variant.id}
                          label="Добавить в корзину"
                          redirectToCart={false}
                          className="catalog-v5-buy"
                          pendingLabel="Добавляем"
                          doneLabel="Добавлено"
                          failedLabel="Ошибка"
                        />
                      ) : (
                        <Link href={`/catalog/${product.slug}`}>
                          <Button className="catalog-v5-buy">Купить</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
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
      </section>
    </div>
  );
}
