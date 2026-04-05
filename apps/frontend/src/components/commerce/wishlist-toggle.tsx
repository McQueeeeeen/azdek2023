"use client";

import { useEffect, useState } from "react";

const KEY = "azdek_wishlist_slugs";

function readWishlist(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeWishlist(slugs: string[]) {
  localStorage.setItem(KEY, JSON.stringify(slugs));
  window.dispatchEvent(new Event("azdek-wishlist-updated"));
}

export default function WishlistToggle({ slug }: { slug: string }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(readWishlist().includes(slug));
  }, [slug]);

  const toggle = () => {
    const current = new Set(readWishlist());
    if (current.has(slug)) {
      current.delete(slug);
      setActive(false);
    } else {
      current.add(slug);
      setActive(true);
    }
    writeWishlist(Array.from(current));
  };

  return (
    <button
      type="button"
      className={`wishlist-toggle ${active ? "is-active" : ""}`}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      onClick={toggle}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}
