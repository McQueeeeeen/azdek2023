"use client";

import { useMemo, useState } from "react";
import { CatalogProduct } from "@/lib/api";
import { cn } from "@/lib/cn";
import { getProductMedia } from "@/lib/product-media";
import SmartImage from "../ui/smart-image";

type GalleryItem = {
  id: string;
  label: string;
  image: string;
};

function createGalleryItems(product: CatalogProduct): GalleryItem[] {
  const media = getProductMedia(product.slug);
  const labels = [product.name, ...product.variants.map((variant) => variant.title)];

  return media.gallery.map((image, index) => ({
    id: `${product.id}:${index}`,
    label: labels[index] ?? product.name,
    image,
  }));
}

export default function ProductGallery({ product }: { product: CatalogProduct }) {
  const items = useMemo(() => createGalleryItems(product), [product]);
  const [active, setActive] = useState(0);
  const current = items[active] ?? items[0];

  return (
    <div className="product-gallery-block">
      <div className="product-image-large">
        <SmartImage
          className="product-gallery-image"
          src={current.image}
          fallbackSrc="/media/laundry-gel.svg"
          alt={current.label}
          fill
          sizes="(max-width: 1024px) 100vw, 56vw"
          priority
        />
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
            onClick={() => setActive(index)}
            aria-label={`Изображение ${index + 1}`}
          >
            <SmartImage
              src={item.image}
              fallbackSrc="/media/laundry-gel.svg"
              alt={item.label}
              className="product-thumb-image"
              width={56}
              height={56}
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
