'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteHeaderNew from '@/components/layout/site-header-new';
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
    {
      id: '#ORD-001234',
      date: '2026-04-15',
      total: 1781,
      status: 'delivered',
      itemCount: 2,
    },
    {
      id: '#ORD-001233',
      date: '2026-04-10',
      total: 2450,
      status: 'shipped',
      itemCount: 3,
    },
    {
      id: '#ORD-001232',
      date: '2026-03-28',
      total: 890,
      status: 'processing',
      itemCount: 1,
    },
    {
      id: '#ORD-001231',
      date: '2026-03-20',
      total: 1200,
      status: 'delivered',
      itemCount: 2,
    },
  ];

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'В ожидании', color: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Обработка', color: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Отправлено', color: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Доставлено', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Отменено', color: 'bg-red-100 text-red-800' },
    };
    const config = statusMap[status as keyof typeof statusMap];
    return config;
  };

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeaderNew />

      <main className="pt-20 pb-24">
        <div className="max-w-6xl mx-auto px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-headline font-black text-4xl text-on-surface mb-2">
              Мои заказы
            </h1>
            <p className="text-on-surface-variant">
              История всех ваших заказов и их статус
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 mb-8">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  filterStatus === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                Все заказы
              </button>
              <button
                onClick={() => setFilterStatus('processing')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  filterStatus === 'processing'
                    ? 'bg-primary text-white'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                Обработка
              </button>
              <button
                onClick={() => setFilterStatus('shipped')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  filterStatus === 'shipped'
                    ? 'bg-primary text-white'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                Отправлено
              </button>
              <button
                onClick={() => setFilterStatus('delivered')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  filterStatus === 'delivered'
                    ? 'bg-primary text-white'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                Доставлено
              </button>
              <button
                onClick={() => setFilterStatus('cancelled')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  filterStatus === 'cancelled'
                    ? 'bg-primary text-white'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                Отменено
              </button>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <span className="material-symbols-outlined text-8xl text-surface-variant mb-4 block">
                shopping_bag
              </span>
              <h2 className="font-headline text-2xl font-bold text-on-surface mb-3">
                Нет заказов
              </h2>
              <p className="text-on-surface-variant mb-8">
                У вас пока нет заказов с этим статусом
              </p>
              <Link href="/catalog">
                <button className="bg-primary text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2">
                  <span className="material-symbols-outlined">shopping_cart</span>
                  Начать покупки
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => {
                const status = getStatusBadge(order.status);
                return (
                  <div key={order.id} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                      {/* Order ID and Date */}
                      <div>
                        <p className="text-sm text-on-surface-variant mb-1">Номер заказа</p>
                        <p className="font-bold text-on-surface text-lg">{order.id}</p>
                        <p className="text-sm text-on-surface-variant mt-2">
                          {new Date(order.date).toLocaleDateString('ru-RU')}
                        </p>
                      </div>

                      {/* Items Count */}
                      <div>
                        <p className="text-sm text-on-surface-variant mb-1">Товары</p>
                        <p className="font-bold text-on-surface text-lg">
                          {order.itemCount} {
                            order.itemCount === 1 ? 'товар' :
                            order.itemCount < 5 ? 'товара' : 'товаров'
                          }
                        </p>
                      </div>

                      {/* Status */}
                      <div>
                        <p className="text-sm text-on-surface-variant mb-1">Статус</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                          {status.label}
                        </span>
                      </div>

                      {/* Total */}
                      <div>
                        <p className="text-sm text-on-surface-variant mb-1">Сумма</p>
                        <p className="font-bold text-on-surface text-lg">{order.total} ₽</p>
                      </div>

                      {/* Action */}
                      <div className="flex gap-2">
                        <button className="flex-1 border-2 border-primary text-primary py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm">
                          Детали
                        </button>
                        {order.status === 'shipped' && (
                          <button className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all text-sm flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-5 w-5 h-5">
                              local_shipping
                            </span>
                            Отслеживание
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Continue Shopping */}
          <div className="mt-12 text-center">
            <Link href="/catalog">
              <button className="text-primary font-semibold hover:underline inline-flex items-center gap-2">
                <span className="material-symbols-outlined">arrow_back</span>
                Продолжить покупки
              </button>
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
