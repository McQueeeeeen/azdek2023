"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import EmptyState from "../ui/empty-state";
import { Input } from "../ui/input";
import Button from "../ui/button";
import ProductGrid from "./product-grid";
import { StorefrontProduct, getStorefrontCategories } from "@/lib/storefront";

type SortMode = "featured" | "price_asc" | "price_desc" | "name_asc";

const pageSize = 9;

export default function CatalogBrowser({
  products,
  hasError = false,
}: {
  products: StorefrontProduct[];
  hasError?: boolean;
}) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeBrand, setActiveBrand] = useState("all");
  const [activeUsage, setActiveUsage] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const categories = useMemo(() => getStorefrontCategories(products), [products]);
  const brands = useMemo(() => ["all", ...Array.from(new Set(products.map((p) => p.brand)))], [products]);
  const usageOptions = [
    { slug: "all", label: "All usage" },
    { slug: "laundry", label: "Laundry" },
    { slug: "kitchen", label: "Kitchen" },
    { slug: "bathroom", label: "Bathroom" },
    { slug: "universal", label: "Universal" },
  ];
  const highestPrice = useMemo(
    () => Math.max(0, ...products.map((product) => product.variants[0]?.price ?? 0)),
    [products],
  );

  const resolvedMaxPrice = maxPrice ?? highestPrice;

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let result = [...products];

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category.slug === activeCategory);
    }

    if (activeBrand !== "all") {
      result = result.filter((p) => p.brand === activeBrand);
    }

    if (activeUsage !== "all") {
      result = result.filter((p) => p.usage === activeUsage);
    }

    if (resolvedMaxPrice > 0) {
      result = result.filter((p) => (p.variants[0]?.price ?? 0) <= resolvedMaxPrice);
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
        result.sort((a, b) => (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0));
        break;
      case "price_desc":
        result.sort((a, b) => (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0));
        break;
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, activeCategory, activeBrand, activeUsage, resolvedMaxPrice, query, sortMode]);

  const visibleItems = filtered.slice(0, visibleCount);
  const canLoadMore = visibleCount < filtered.length;

  const resetAll = () => {
    setQuery("");
    setActiveCategory("all");
    setActiveBrand("all");
    setActiveUsage("all");
    setSortMode("featured");
    setMaxPrice(null);
    setVisibleCount(pageSize);
  };

  if (hasError) {
    return (
      <EmptyState
        title="Catalog is temporarily unavailable"
        description="Please refresh the page or try again later."
        action={<Button onClick={() => window.location.reload()}>Retry</Button>}
      />
    );
  }

  return (
    <div className="catalog-layout">
      <aside className="filters-panel">
        <h3 className="h4">Filters</h3>

        <details className="filter-block" open>
          <summary>Search</summary>
          <div className="filter-group">
            <Input
              id="catalog-search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisibleCount(pageSize);
              }}
              placeholder="Search by product"
            />
          </div>
        </details>

        <details className="filter-block" open>
          <summary>Price range</summary>
          <div className="filter-group">
            <input
              className="price-range"
              type="range"
              min={0}
              max={highestPrice || 1}
              value={resolvedMaxPrice}
              onChange={(event) => {
                setMaxPrice(Number(event.target.value));
                setVisibleCount(pageSize);
              }}
            />
            <div className="price-range-labels">
              <span>$0</span>
              <span>${resolvedMaxPrice}</span>
            </div>
          </div>
        </details>

        <details className="filter-block" open>
          <summary>Category</summary>
          <div className="filter-group">
            {categories.map((category) => (
              <label key={category.slug} className="filter-check">
                <input
                  type="radio"
                  name="category"
                  checked={activeCategory === category.slug}
                  onChange={() => {
                    setActiveCategory(category.slug);
                    setVisibleCount(pageSize);
                  }}
                />
                <span>{category.label}</span>
              </label>
            ))}
          </div>
        </details>

        <details className="filter-block" open>
          <summary>Brand</summary>
          <div className="filter-group">
            <select
              className="ui-input"
              value={activeBrand}
              onChange={(event) => {
                setActiveBrand(event.target.value);
                setVisibleCount(pageSize);
              }}
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand === "all" ? "All brands" : brand}
                </option>
              ))}
            </select>
          </div>
        </details>

        <details className="filter-block" open>
          <summary>Usage</summary>
          <div className="filter-group">
            <select
              className="ui-input"
              value={activeUsage}
              onChange={(event) => {
                setActiveUsage(event.target.value);
                setVisibleCount(pageSize);
              }}
            >
              {usageOptions.map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </details>

        <Button variant="secondary" onClick={resetAll}>
          Reset filters
        </Button>
      </aside>

      <section className="grid">
        <div className="catalog-toolbar">
          <div>
            <h1 className="h2">Catalog</h1>
            <p className="text-ink-2">{filtered.length} products found</p>
          </div>

          <select
            className="ui-input"
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            style={{ maxWidth: 220 }}
          >
            <option value="featured">Sort: Featured</option>
            <option value="name_asc">Sort: Name A-Z</option>
            <option value="price_asc">Sort: Price low-high</option>
            <option value="price_desc">Sort: Price high-low</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try changing category, usage or search query."
            action={<Button variant="secondary" onClick={resetAll}>Clear filters</Button>}
          />
        ) : (
          <>
            <ProductGrid products={visibleItems} />

            {canLoadMore ? (
              <div className="pagination-row">
                <Button onClick={() => setVisibleCount((count) => count + pageSize)}>
                  Load more
                </Button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
