export interface ProductMedia {
  card: string;
  hero: string;
  gallery: string[];
  tag?: string;
}

const fallback: ProductMedia = {
  card: "/media/laundry-gel.jpg",
  hero: "/media/laundry-gel.jpg",
  gallery: ["/media/laundry-gel.jpg", "/media/softener-fresh.jpg", "/media/dish-liquid-citrus.jpg"],
  tag: "Хит",
};

const bySlug: Record<string, ProductMedia> = {
  "azdek-dish-liquid-citrus": {
    card: "/media/dish-liquid-citrus.jpg",
    hero: "/media/dish-liquid-citrus.jpg",
    gallery: ["/media/dish-liquid-citrus.jpg", "/media/softener-fresh.jpg", "/media/laundry-gel.jpg"],
    tag: "Для кухни",
  },
  "azdek-softener-fresh": {
    card: "/media/softener-fresh.jpg",
    hero: "/media/softener-fresh.jpg",
    gallery: ["/media/softener-fresh.jpg", "/media/laundry-gel.jpg", "/media/dish-liquid-citrus.jpg"],
    tag: "Свежесть",
  },
  "azdek-laundry-gel": {
    card: "/media/laundry-gel.jpg",
    hero: "/media/laundry-gel.jpg",
    gallery: ["/media/laundry-gel.jpg", "/media/softener-fresh.jpg", "/media/dish-liquid-citrus.jpg"],
    tag: "Для стирки",
  },
};

export function getProductMedia(slug: string): ProductMedia {
  return bySlug[slug] ?? fallback;
}

