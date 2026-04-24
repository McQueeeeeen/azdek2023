import { CATALOG_PRODUCTS, type CatalogProductSummary } from "@/lib/catalog-data";

export interface CartLine {
  id: string;
  slug: string;
  name: string;
  sub: string;
  price: number;
  quantity: number;
}

const CART_STORAGE_KEY = "adzek_cart_items";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readStoredCart(): CartLine[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    // ── Cart Consistency Check (Task 5.2) ──
    // Validate that items exist in the catalog and have the correct up-to-date price.
    const validLines = parsed
      .map((line) => {
        if (
          typeof line?.id !== "string" ||
          typeof line?.slug !== "string" ||
          typeof line?.quantity !== "number" ||
          line.quantity <= 0
        ) {
          return null; // Invalid shape
        }

        const actualProduct = findProductForLine(line.slug);
        if (!actualProduct) {
          return null; // Product no longer exists in catalog
        }

        // Return updated line with actual catalog price and name to prevent tampering
        return {
          ...line,
          price: actualProduct.price,
          name: actualProduct.name,
          sub: actualProduct.sub,
        };
      })
      .filter((line): line is CartLine => line !== null);

    // If the cart was modified by the consistency check, update storage
    if (validLines.length !== parsed.length) {
      setTimeout(() => writeStoredCart(validLines), 0);
    }

    return validLines;
  } catch {
    return [];
  }
}

function writeStoredCart(lines: CartLine[]): void {
  if (!canUseStorage()) {
    return;
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
}

export function getInitialCartLines(): CartLine[] {
  return readStoredCart();
}

export function saveCartLines(lines: CartLine[]): void {
  writeStoredCart(lines);
}

export function clearCartLines(): void {
  if (!canUseStorage()) {
    return;
  }

  localStorage.removeItem(CART_STORAGE_KEY);
}

function buildLineFromProduct(product: CatalogProductSummary): CartLine {
  return {
    id: `${product.slug}:${product.id}`,
    slug: product.slug,
    name: product.name,
    sub: product.sub,
    price: product.price,
    quantity: 1,
  };
}

export function addProductToCart(product: CatalogProductSummary): CartLine[] {
  const current = readStoredCart();
  const index = current.findIndex((line) => line.slug === product.slug);
  let next: CartLine[];

  if (index >= 0) {
    next = current.map((line, lineIndex) =>
      lineIndex === index ? { ...line, quantity: line.quantity + 1 } : line
    );
  } else {
    next = [...current, buildLineFromProduct(product)];
  }

  writeStoredCart(next);
  return next;
}

export function updateCartLine(lineId: string, quantity: number): CartLine[] {
  const current = readStoredCart();
  const next = current
    .map((line) => (line.id === lineId ? { ...line, quantity: Math.max(0, quantity) } : line))
    .filter((line) => line.quantity > 0);

  writeStoredCart(next);
  return next;
}

export function removeCartLine(lineId: string): CartLine[] {
  const next = readStoredCart().filter((line) => line.id !== lineId);
  writeStoredCart(next);
  return next;
}

export function getCartLineTotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
}

export function getCartLineCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function findProductForLine(slug: string) {
  return CATALOG_PRODUCTS.find((product) => product.slug === slug) ?? null;
}
