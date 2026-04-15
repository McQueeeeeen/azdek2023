"use client";

import Link from "next/link";

export default function CartPage() {
  return (
    <div className="pt-20 pb-10 min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Корзина пуста</h1>
        <p className="text-lg text-on-surface-variant mb-6">Перейдите в каталог и выберите нужные товары.</p>
        <Link href="/catalog" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-container transition-colors">
          Перейти в каталог
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}