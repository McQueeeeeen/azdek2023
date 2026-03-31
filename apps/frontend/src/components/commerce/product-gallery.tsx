"use client";

import { useMemo, useState } from "react";
import { CatalogProduct } from "@/lib/api";
import { cn } from "@/lib/cn";

type GalleryItem = {
  id: string;
  label: string;
  tone: string;
};

function createGalleryItems(product: CatalogProduct): GalleryItem[] {
  const palette = ["#ececec", "#e8edf2", "#f2ece6", "#e9f0e9", "#eee8f2"];
  const base: GalleryItem[] = [
    {
      id: `${product.id}:main`,
      label: product.name,
      tone: palette[0],
    },
  ];

  product.variants.forEach((variant, index) => {
    base.push({
      id: variant.id,
      label: variant.title,
      tone: palette[(index + 1) % palette.length],
    });
  });

  return base;
}

export default function ProductGallery({ product }: { product: CatalogProduct }) {
  const items = useMemo(() => createGalleryItems(product), [product]);
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];

  return (
    <div className="product-gallery-block">
      <div className="product-image-large" style={{ background: current.tone }}>
        <div className="product-image-overlay">
          <p className="small">AZDEK</p>
          <p className="h3">{current.label}</p>
        </div>
      </div>
      <div className="product-thumbs">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={cn("product-thumb", active === index && "product-thumb-active")}
            style={{ background: item.tone }}
            onClick={() => setActive(index)}
            aria-label={`Изображение ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

