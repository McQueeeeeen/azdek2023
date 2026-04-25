'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteFooter from '@/components/layout/site-footer';

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  address: string;
}

export default function AdminOrdersPage() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const orders: Order[] = [
    {
      id: '#ORD-001234',
      customer: 'Алибек Жаксыбеков',
      email: 'alibek@example.com',
      phone: '+7 701 123 45 67',
      date: '2026-04-22',
      total: 1781,
      status: 'delivered',
      items: 2,
      address: 'ул. Абая 150, Алматы',
    },
    {
      id: '#ORD-001233',
      customer: 'Айдана Сатыбалдина',
      email: 'aidana@example.com',
      phone: '+7 702 234 56 78',
      date: '2026-04-21',
      total: 2450,
      status: 'shipped',
      items: 3,
      address: 'пр. Назарбаева 77, Астана',
    },
    {
      id: '#ORD-001232',
      customer: 'Данияр Сейдахмет',
      email: 'daniyar@example.com',
      phone: '+7 703 345 67 89',
      date: '2026-04-20',
      total: 890,
      status: 'processing',
      items: 1,
      address: 'ул. Достык 12, Шымкент',
    },
    {
      id: '#ORD-001231',
      customer: 'Мадина Касымова',
      email: 'madina@example.com',
      phone: '+7 704 456 78 90',
      date: '2026-04-19',
      total: 1200,
      status: 'delivered',
      items: 2,
      address: 'ул. Сатпаева 10, Караганда',
    },
    {
      id: '#ORD-001230',
      customer: 'Дмитрий Волков',
      email: 'dmitri@example.com',
      phone: '+7 705 567 89 01',
      date: '2026-04-18',
      total: 3450,
      status: 'processing',
      items: 5,
      address: 'пр. Жибек Жолы 55, Ақтау',
    },
    {
      id: '#ORD-001229',
      customer: 'Ольга Соколова',
      email: 'olga@example.com',
      phone: '+7 706 678 90 12',
      date: '2026-04-17',
      total: 567,
      status: 'cancelled',
      items: 1,
      address: 'ул. Северная 6, Павлодар',
    },
    {
      id: '#ORD-001228',
      customer: 'Сергей Морозов',
      email: 'sergey@example.com',
      phone: '+7 707 789 01 23',
      date: '2026-04-16',
      total: 4200,
      status: 'shipped',
      items: 4,
      address: 'ул. Южная 7, Тараз',
    },
    {
      id: '#ORD-001227',
      customer: 'Виктория Романова',
      email: 'victoria@example.com',
      phone: '+7 708 890 12 34',
      date: '2026-04-15',
      total: 2100,
      status: 'delivered',
      items: 3,
      address: 'ул. Красная 8, Өскемен',
    },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch =
      searchTerm === '' ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
      
      <main className="pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-12">
            <h1 className="font-headline font-black text-4xl text-ink mb-2">
              Управление заказами
            </h1>
            <p className="text-ink-variant">
              Просмотр и управление всеми заказами
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 mb-8 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">
                Поиск по номеру, имени или email
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Введите поисковый запрос..."
                className="w-full border border-line rounded-lg px-4 py-3 focus:border-clay focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-2">
                Фильтр по статусу
              </label>
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
          </div>

          <div className="bg-white rounded-2xl overflow-hidden">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-8xl text-surface-variant mb-4 block">
                  shopping_bag
                </span>
                <h2 className="font-headline text-2xl font-bold text-ink mb-3">
                  Заказы не найдены
                </h2>
                <p className="text-ink-variant">
                  Нет заказов, соответствующих вашему поиску и фильтрам
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-line bg-bg-alt">
                      <th className="text-left py-4 px-6 font-semibold text-ink text-sm">
                        № заказа
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-ink text-sm">
                        Клиент
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-ink text-sm">
                        Контакты
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-ink text-sm">
                        Адрес
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-ink text-sm">
                        Дата
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-ink text-sm">
                        Товаров
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-ink text-sm">
                        Статус
                      </th>
                      <th className="text-right py-4 px-6 font-semibold text-ink text-sm">
                        Сумма
                      </th>
                      <th className="text-center py-4 px-6 font-semibold text-ink text-sm">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => {
                      const status = getStatusBadge(order.status);
                      return (
                        <tr
                          key={order.id}
                          className="border-b border-line hover:bg-surface transition-colors"
                        >
                          <td className="py-4 px-6">
                            <p className="font-semibold text-ink">{order.id}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-medium text-ink">{order.customer}</p>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm">
                              <p className="text-ink-variant">{order.email}</p>
                              <p className="text-ink-variant text-xs">{order.phone}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-sm text-ink-variant max-w-xs truncate">
                              {order.address}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-sm text-ink-variant">
                              {new Date(order.date).toLocaleDateString('ru-RU')}
                            </p>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <p className="text-ink font-medium">{order.items}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}
                            >
                              {status.label}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <p className="font-semibold text-ink">
                              {order.total.toLocaleString('ru-KZ')} ₸
                            </p>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex gap-2 justify-center">
                              <button className="text-clay hover:text-clay/80 transition-colors p-1">
                                <span className="material-symbols-outlined text-5 w-5 h-5">
                                  edit
                                </span>
                              </button>
                              <button className="text-red-600 hover:text-red-800 transition-colors p-1">
                                <span className="material-symbols-outlined text-5 w-5 h-5">
                                  delete
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-12">
            <Link href="/admin/dashboard">
              <button className="text-clay font-semibold hover:underline inline-flex items-center gap-2">
                <span className="material-symbols-outlined">arrow_back</span>
                Вернуться на панель администратора
              </button>
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
