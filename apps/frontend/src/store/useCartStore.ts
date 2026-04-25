import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiGet, apiPost, apiPatch } from "@/lib/api";

export interface CartLine {
  id: string;
  slug: string;
  name: string;
  sub: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartLine[];
  isLoading: boolean;
  addItem: (product: Omit<CartLine, "id" | "quantity">) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  getTotal: () => number;
  getCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: async (product) => {
        set({ isLoading: true });
        // Optimistic UI update or simple state update (depending on API)
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.slug === product.slug);
        
        let newItems;
        if (existingItem) {
          newItems = currentItems.map((item) =>
            item.slug === product.slug ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          newItems = [...currentItems, { ...product, id: `${product.slug}:${Date.now()}`, quantity: 1 }];
        }
        
        set({ items: newItems, isLoading: false });
        
        // TODO: In Phase 2, integrate with API `apiPost('/cart/items', { slug: product.slug, quantity: 1 })` if authenticated.
      },

      removeItem: async (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: async (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      syncCart: async () => {
        try {
          const items = get().items;
          const payload = {
            items: items.map(item => ({ slug: item.slug, quantity: item.quantity }))
          };
          
          const response = await apiPost('/cart/sync', payload);
          // Optional: update local cart with server response if needed
        } catch (error) {
          console.warn('Failed to sync cart with server', error);
        }
      },

      getTotal: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
      getCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    {
      name: "azdek_zustand_cart",
    }
  )
);
