export type CatalogCategory = "kitchen" | "cleaning" | "laundry" | "bathroom";

export interface CatalogProductSummary {
  id: number;
  slug: string;
  name: string;
  category: CatalogCategory;
  price: number;
  badge: string;
  sub: string;
  rating: number;
  reviews: number;
  description: string;
}

export interface ProductReview {
  author: string;
  text: string;
  rating: number;
}

export interface ProductFaqItem {
  question: string;
  answer: string;
}

export interface CatalogProductDetail extends CatalogProductSummary {
  oldPrice?: number;
  volume: string[];
  certifications: string[];
  ingredients: string;
  howToUse: string;
  highlights: string[];
  deliveryNote: string;
  reviewsList: ProductReview[];
  faq: ProductFaqItem[];
}

export const CATALOG_CATEGORIES: Array<{ key: "all" | CatalogCategory; label: string }> = [
  { key: "all", label: "Все товары" },
  { key: "kitchen", label: "Для кухни" },
  { key: "bathroom", label: "Для ванной" },
  { key: "cleaning", label: "Для уборки" },
  { key: "laundry", label: "Для стирки" },
];

export const CATALOG_SORTS = [
  { key: "popular", label: "По популярности" },
  { key: "price-asc", label: "Цена: дешевле" },
  { key: "price-desc", label: "Цена: дороже" },
  { key: "rating", label: "По рейтингу" },
] as const;

export const CATALOG_PRODUCTS: CatalogProductSummary[] = [
  {
    id: 1,
    slug: "gel-dlya-posudy-myata-laym",
    name: "Гель для посуды «Мята и Лайм»",
    category: "kitchen",
    price: 890,
    badge: "ЭКО",
    sub: "Концентрат · 500 мл",
    rating: 4.9,
    reviews: 142,
    description: "Концентрированный гель для ежедневного мытья посуды с мягким освежающим ароматом.",
  },
  {
    id: 2,
    slug: "gel-dlya-posudy-apelsin",
    name: "Гель для посуды «Апельсин»",
    category: "kitchen",
    price: 890,
    badge: "ЭКО",
    sub: "Концентрат · 500 мл",
    rating: 4.8,
    reviews: 98,
    description: "Свежий цитрусовый формат для быстрой ручной мойки и стабильного результата без разводов.",
  },
  {
    id: 3,
    slug: "sprey-dlya-poverkhnostey-chainoe-derevo",
    name: "Спрей для поверхностей",
    category: "cleaning",
    price: 1290,
    badge: "ОРГАНИК",
    sub: "Чайное дерево · 750 мл",
    rating: 4.9,
    reviews: 207,
    description: "Универсальный спрей для кухни, столешниц и ежедневной быстрой уборки.",
  },
  {
    id: 4,
    slug: "sprey-dlya-poverkhnostey-lavanda",
    name: "Спрей «Лаванда»",
    category: "cleaning",
    price: 1290,
    badge: "ОРГАНИК",
    sub: "Для поверхностей · 750 мл",
    rating: 4.7,
    reviews: 134,
    description: "Мягкий аромат и чистый финиш для ежедневного ухода за домом.",
  },
  {
    id: 5,
    slug: "gel-dlya-stirki",
    name: "Гель для стирки",
    category: "laundry",
    price: 1490,
    badge: "ПРЕМИУМ",
    sub: "Универсальный · 1 л",
    rating: 4.8,
    reviews: 89,
    description: "Концентрированный гель для цветного и белого белья с экономичным расходом.",
  },
  {
    id: 6,
    slug: "gel-dlya-delikatnykh-tkaney",
    name: "Гель для деликатных тканей",
    category: "laundry",
    price: 1690,
    badge: "ПРЕМИУМ",
    sub: "Шёлк, шерсть · 1 л",
    rating: 4.9,
    reviews: 61,
    description: "Мягкий состав для бережной стирки деликатных материалов.",
  },
  {
    id: 7,
    slug: "mylo-kontsentrat",
    name: "Мыло-концентрат",
    category: "bathroom",
    price: 590,
    badge: "ЭКО",
    sub: "Кусковое · 120 г",
    rating: 4.7,
    reviews: 178,
    description: "Компактное концентрированное мыло для ежедневного домашнего использования.",
  },
  {
    id: 8,
    slug: "sredstvo-dlya-okon",
    name: "Средство для стёкол и окон",
    category: "cleaning",
    price: 890,
    badge: "ЭКО",
    sub: "Без разводов · 500 мл",
    rating: 4.6,
    reviews: 95,
    description: "Быстрое очищение стекла и зеркал без следов и лишнего блеска.",
  },
  {
    id: 9,
    slug: "dezinfektant",
    name: "Универсальный дезинфектант",
    category: "cleaning",
    price: 1190,
    badge: "ЗАЩИТА",
    sub: "Антибактериальный · 500 мл",
    rating: 4.8,
    reviews: 256,
    description: "Для регулярной гигиенической уборки в доме и рабочих зонах.",
  },
  {
    id: 10,
    slug: "sredstvo-dlya-vannoy",
    name: "Средство для ванной",
    category: "bathroom",
    price: 990,
    badge: "ОРГАНИК",
    sub: "Чайное дерево · 500 мл",
    rating: 4.7,
    reviews: 113,
    description: "Спрей для ванной комнаты, сантехники и плитки с аккуратным ароматом.",
  },
  {
    id: 11,
    slug: "otbelivatel-kislorodnyy",
    name: "Кислородный отбеливатель",
    category: "laundry",
    price: 790,
    badge: "ЭКО",
    sub: "Без хлора · 500 г",
    rating: 4.5,
    reviews: 72,
    description: "Мягкое отбеливание и дополнительная помощь при стирке светлых тканей.",
  },
  {
    id: 12,
    slug: "sredstvo-ot-nakipi",
    name: "Средство от накипи",
    category: "kitchen",
    price: 590,
    badge: "ЭКО",
    sub: "Чайники, машины · 300 г",
    rating: 4.6,
    reviews: 88,
    description: "Помогает убирать накипь с бытовой техники и сохранять её ресурс.",
  },
];

const DETAILS: Record<string, Omit<CatalogProductDetail, keyof CatalogProductSummary>> = {
  "gel-dlya-posudy-myata-laym": {
    oldPrice: 1090,
    volume: ["250 мл", "500 мл", "1 л"],
    certifications: ["EcoLabel", "Vegan", "Cruelty-Free"],
    ingredients: "Вода, ПАВ на растительной основе, экстракт мяты, лимонная кислота, ароматическая композиция лайма.",
    howToUse: "Нанесите 1–2 мл на губку или в воду, вспеньте и тщательно смойте посуду чистой водой.",
    highlights: [
      "Мягкая формула для ежедневного применения",
      "Экономичный расход",
      "Свежий аромат без резкости",
      "Подходит для ручного мытья",
    ],
    deliveryNote: "Алматы и Астана — 1–2 дня · Остальные города — 3–5 дней",
    reviewsList: [
      { author: "Нурия, Алматы", text: "Хорошо пенится, посуда чистая без разводов.", rating: 5 },
      { author: "Салтанат, Шымкент", text: "Приятный аромат и экономный расход.", rating: 5 },
    ],
    faq: [
      { question: "Можно ли использовать в холодной воде?", answer: "Да, средство сохраняет эффективность и в прохладной воде." },
      { question: "Подходит ли для детской посуды?", answer: "После мытья рекомендуется тщательно смыть средство водой." },
    ],
  },
  "sprey-dlya-poverkhnostey-chainoe-derevo": {
    volume: ["500 мл", "750 мл"],
    certifications: ["Organic", "EcoLabel"],
    ingredients: "Вода, цитрат натрия, эфирное масло чайного дерева, алкилполиглюкозид, экстракт тимьяна.",
    howToUse: "Распылите на поверхность, оставьте на 20–30 секунд и протрите мягкой салфеткой.",
    highlights: [
      "Подходит для столешниц и твёрдых поверхностей",
      "Быстрое действие",
      "Мягкий органический профиль",
      "Без заметных разводов",
    ],
    deliveryNote: "Алматы и Астана — 1–2 дня · Остальные города — 3–5 дней",
    reviewsList: [
      { author: "Айдана, Астана", text: "Удобный спрей для ежедневной уборки кухни.", rating: 5 },
      { author: "Ерлан, Караганда", text: "Хорошо убирает следы и не пахнет резко.", rating: 5 },
    ],
    faq: [
      { question: "Подходит ли для кухни?", answer: "Да, спрей рассчитан на кухонные и бытовые поверхности." },
      { question: "Можно ли использовать ежедневно?", answer: "Да, средство рассчитано на регулярную уборку." },
    ],
  },
  "gel-dlya-stirki": {
    oldPrice: 1690,
    volume: ["500 мл", "1 л", "2 л"],
    certifications: ["EcoLabel", "Hypoallergenic"],
    ingredients: "Вода, анионные и неионогенные ПАВ, энзимы, цитрат натрия, функциональные добавки, отдушка.",
    howToUse: "Добавьте 40–60 мл в отсек стиральной машины или 30 мл для предварительного замачивания.",
    highlights: [
      "Для белого и цветного белья",
      "Экономичный концентрат",
      "Бережный уход за тканью",
      "Подходит для машинной и ручной стирки",
    ],
    deliveryNote: "Алматы и Астана — 1–2 дня · Остальные города — 3–5 дней",
    reviewsList: [
      { author: "Мадина, Тараз", text: "Отстирывает хорошо, цвет вещей сохраняется.", rating: 5 },
      { author: "Ильяс, Астана", text: "Понравился результат даже на быстрой стирке.", rating: 4 },
    ],
    faq: [
      { question: "Подходит ли для белого белья?", answer: "Да, при соблюдении дозировки средство подходит и для белых, и для цветных вещей." },
      { question: "Можно ли стирать вручную?", answer: "Да, средство подходит и для ручной стирки." },
    ],
  },
};

export function getCatalogProductDetails(slug: string): CatalogProductDetail | null {
  const product = CATALOG_PRODUCTS.find((item) => item.slug === slug);
  if (!product) {
    return null;
  }

  const fallbackDetail = DETAILS[product.slug] ?? DETAILS["gel-dlya-stirki"];

  return {
    ...product,
    ...fallbackDetail,
  };
}

export function getCatalogRelatedProducts(slug: string, limit = 4): CatalogProductSummary[] {
  return CATALOG_PRODUCTS.filter((item) => item.slug !== slug).slice(0, limit);
}

