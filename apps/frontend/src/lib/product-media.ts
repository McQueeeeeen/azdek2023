export interface ProductMedia {
  card: string;
  hero: string;
  gallery: string[];
  tag?: string;
}

const fallback: ProductMedia = {
  card: "/media/laundry-gel-final.jpg",
  hero: "/media/laundry-gel-final.jpg",
  gallery: [
    "/media/laundry-gel-final.jpg",
    "/media/softener-fresh-final.jpg",
    "/media/dish-liquid-citrus-final.jpg",
  ],
  tag: "Хит",
};

const bySlug: Record<string, ProductMedia> = {
  "azdek-dish-liquid-citrus": {
    card: "/media/dish-liquid-citrus-final.jpg",
    hero: "/media/dish-liquid-citrus-final.jpg",
    gallery: [
      "/media/dish-liquid-citrus-final.jpg",
      "/media/softener-fresh-final.jpg",
      "/media/laundry-gel-final.jpg",
    ],
    tag: "Для кухни",
  },
  "azdek-softener-fresh": {
    card: "/media/softener-fresh-final.jpg",
    hero: "/media/softener-fresh-final.jpg",
    gallery: [
      "/media/softener-fresh-final.jpg",
      "/media/laundry-gel-final.jpg",
      "/media/dish-liquid-citrus-final.jpg",
    ],
    tag: "Свежесть",
  },
  "azdek-laundry-gel": {
    card: "/media/laundry-gel-final.jpg",
    hero: "/media/laundry-gel-final.jpg",
    gallery: [
      "/media/laundry-gel-final.jpg",
      "/media/softener-fresh-final.jpg",
      "/media/dish-liquid-citrus-final.jpg",
    ],
    tag: "Для стирки",
  },
};

export function getProductMedia(slug: string): ProductMedia {
  return bySlug[slug] ?? fallback;
}

