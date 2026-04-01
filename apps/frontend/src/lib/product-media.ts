export interface ProductMedia {
  cover: string;
  gallery: string[];
  tag?: string;
}

const fallback: ProductMedia = {
  cover: "/media/laundry-gel.svg",
  gallery: ["/media/laundry-gel.svg", "/media/softener-fresh.svg", "/media/dish-liquid-citrus.svg"],
  tag: "Хит",
};

const bySlug: Record<string, ProductMedia> = {
  "azdek-dish-liquid-citrus": {
    cover: "/media/dish-liquid-citrus.svg",
    gallery: ["/media/dish-liquid-citrus.svg", "/media/softener-fresh.svg", "/media/laundry-gel.svg"],
    tag: "Для кухни",
  },
  "azdek-softener-fresh": {
    cover: "/media/softener-fresh.svg",
    gallery: ["/media/softener-fresh.svg", "/media/laundry-gel.svg", "/media/dish-liquid-citrus.svg"],
    tag: "Свежесть",
  },
  "azdek-laundry-gel": {
    cover: "/media/laundry-gel.svg",
    gallery: ["/media/laundry-gel.svg", "/media/softener-fresh.svg", "/media/dish-liquid-citrus.svg"],
    tag: "Для стирки",
  },
};

export function getProductMedia(slug: string): ProductMedia {
  return bySlug[slug] ?? fallback;
}
