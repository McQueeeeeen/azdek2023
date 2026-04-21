'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([
    { id: '1', name: 'Гель для посуды "Мята и Лайм"', price: 380, quantity: 2 },
    { id: '2', name: 'Спрей для поверхностей', price: 450, quantity: 1 },
  ]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 299;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(items.filter(item => item.id !== id));
    } else {
      setItems(items.map(item => (item.id === id ? { ...item, quantity } : item)));
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />

      <main className="pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-8">
          <h1 className="font-headline font-black text-4xl text-on-surface mb-12">
            Корзина товаров
          </h1>

          {items.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <span className="material-symbols-outlined text-8xl text-surface-variant mb-4 block">
                shopping_cart
              </span>
              <h2 className="font-headline text-2xl font-bold text-on-surface mb-3">
                Ваша корзина пуста
              </h2>
              <p className="text-on-surface-variant mb-8">
                Откройте каталог и выберите интересующие вас товары
              </p>
              <Link href="/catalog">
                <button className="bg-primary text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2">
                  <span className="material-symbols-outlined">shopping_bag</span>
                  Вернуться в каталог
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl p-6 flex gap-6">
                    {/* Image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-blue-200">
                        water_bottle
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-headline font-bold text-lg text-on-surface mb-1">
                        {item.name}
                      </h3>
                      <p className="text-on-surface-variant text-sm mb-4">
                        {item.price} ₽ за единицу
                      </p>

                      {/* Quantity Control */}
                      <div className="flex items-center border border-outline-variant rounded-lg w-fit">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-surface-container"
                        >
                          <span className="material-symbols-outlined text-5 w-5 h-5">
                            remove
                          </span>
                        </button>
                        <span className="px-4 font-semibold min-w-10 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-surface-container"
                        >
                          <span className="material-symbols-outlined text-5 w-5 h-5">
                            add
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                      <div className="text-xl font-bold text-on-surface">
                        {item.price * item.quantity} ₽
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-8 sticky top-24 space-y-6">
                  <h2 className="font-headline font-bold text-xl text-on-surface">Итого</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Товары:</span>
                      <span>{subtotal} ₽</span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Доставка:</span>
                      <span>{shipping} ₽</span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Налог (18%):</span>
                      <span>{tax} ₽</span>
                    </div>
                  </div>

                  <div className="border-t border-outline-variant pt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-headline font-bold text-on-surface">Итого:</span>
                      <span className="text-2xl font-black text-primary">{total} ₽</span>
                    </div>

                    <Link href="/checkout">
                      <button className="w-full bg-primary text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">payments</span>
                        Оформить заказ
                      </button>
                    </Link>
                  </div>

                  <Link href="/catalog">
                    <button className="w-full border-2 border-primary text-primary py-3 rounded-2xl font-semibold hover:bg-blue-50 transition-colors">
                      Продолжить покупки
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
