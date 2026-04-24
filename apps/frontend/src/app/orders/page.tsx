'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  itemCount: number;
}

export default function OrdersPage() {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const orders: Order[] = [
    { id: '#ORD-001234', date: '2026-04-15', total: 1781, status: 'delivered', itemCount: 2 },
    { id: '#ORD-001233', date: '2026-04-10', total: 2450, status: 'shipped', itemCount: 3 },
    { id: '#ORD-001232', date: '2026-03-28', total: 890, status: 'processing', itemCount: 1 },
    { id: '#ORD-001231', date: '2026-03-20', total: 1200, status: 'delivered', itemCount: 2 },
  ];

  const filteredOrders =
    filterStatus === 'all' ? orders : orders.filter(order => order.status === filterStatus);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'В ожидании', color: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Обработка', color: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Отправлено', color: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Доставлено', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Отменено', color: 'bg-red-100 text-red-800' },
    };
    return statusMap[status] || statusMap.pending;
  };

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />

      <main className="pt-20 pb-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="mb-12">
            <h1 className="font-headline font-black text-4xl text-ink mb-2">
              Мои заказы
            </h1>
            <p className="text-ink-variant">
              История всех ваших заказов и их статус
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 mb-8">
            <div className="flex flex-wrap gap-3">
              {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    filterStatus === status
                      ? 'bg-clay text-white'
                      : 'bg-bg-alt text-ink hover:bg-bg-alt-high'
                  }`}
                >
                  {status === 'all'
                    ? 'Все заказы'
                    : status === 'processing'
                    ? 'Обработка'
                    : status === 'shipped'
                    ? 'Отправлено'
                    : status === 'delivered'
                    ? 'Доставлено'
                    : 'Отменено'}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <span className="material-symbols-outlined text-8xl text-surface-variant mb-4 block">
                shopping_bag
              </span>
              <h2 className="font-headline text-2xl font-bold text-ink mb-3">
                Нет заказов
              </h2>
              <p className="text-ink-variant mb-8">
                У вас пока нет заказов с этим статусом
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => {
                const status = getStatusBadge(order.status);
                return (
                  <div key={order.id} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                      <div>
                        <p className="text-sm text-ink-variant mb-1">Номер заказа</p>
                        <p className="font-bold text-ink text-lg">{order.id}</p>
                        <p className="text-sm text-ink-variant mt-2">
                          {new Date(order.date).toLocaleDateString('ru-RU')}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-ink-variant mb-1">Товары</p>
                        <p className="font-bold text-ink text-lg">{order.itemCount}</p>
                      </div>

                      <div>
                        <p className="text-sm text-ink-variant mb-1">Статус</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm text-ink-variant mb-1">Сумма</p>
                        <p className="font-bold text-ink text-lg">
                          {order.total.toLocaleString('ru-KZ')} ₸
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 border-2 border-clay text-clay py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm">
                          Детали
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
