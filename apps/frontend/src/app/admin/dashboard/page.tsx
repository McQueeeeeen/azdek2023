'use client';

import Link from 'next/link';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

interface RecentOrder {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  items: number;
}

export default function AdminDashboardPage() {
  const stats: StatCard[] = [
    {
      title: 'Всего заказов',
      value: '1,234',
      change: '+12% от прошлого месяца',
      icon: 'shopping_bag',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Доход',
      value: '285 400 ₸',
      change: '+8% от прошлого месяца',
      icon: 'trending_up',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Активные пользователи',
      value: '3,821',
      change: '+15% от прошлого месяца',
      icon: 'people',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Средний чек',
      value: '231 ₸',
      change: '-3% от прошлого месяца',
      icon: 'monetization_on',
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  const recentOrders: RecentOrder[] = [
    {
      id: '#ORD-001234',
      customer: 'Алибек Жаксыбеков',
      date: '2026-04-22',
      total: 1781,
      status: 'delivered',
      items: 2,
    },
    {
      id: '#ORD-001233',
      customer: 'Айдана Сатыбалдина',
      date: '2026-04-21',
      total: 2450,
      status: 'shipped',
      items: 3,
    },
    {
      id: '#ORD-001232',
      customer: 'Данияр Сейдахмет',
      date: '2026-04-20',
      total: 890,
      status: 'processing',
      items: 1,
    },
    {
      id: '#ORD-001231',
      customer: 'Мадина Касымова',
      date: '2026-04-19',
      total: 1200,
      status: 'delivered',
      items: 2,
    },
    {
      id: '#ORD-001230',
      customer: 'Дмитрий Волков',
      date: '2026-04-18',
      total: 3450,
      status: 'processing',
      items: 5,
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'В ожидании', color: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Обработка', color: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Отправлено', color: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Доставлено', color: 'bg-green-100 text-green-800' },
    };
    return statusMap[status] || statusMap.pending;
  };

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />

      <main className="pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-12">
            <h1 className="font-headline font-black text-4xl text-ink mb-2">
              Панель администратора
            </h1>
            <p className="text-ink-variant">
              Общая статистика и управление заказами
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-ink-variant mb-1">{stat.title}</p>
                    <h3 className="text-3xl font-black text-ink">{stat.value}</h3>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <span className="material-symbols-outlined text-5 w-6 h-6">
                      {stat.icon}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-green-600 font-semibold">{stat.change}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-headline font-bold text-2xl text-ink">
                Последние заказы
              </h2>
              <Link href="/admin/orders">
                <button className="text-clay font-semibold hover:underline flex items-center gap-2">
                  Все заказы
                  <span className="material-symbols-outlined text-5 w-5 h-5">arrow_forward</span>
                </button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left py-3 px-4 font-semibold text-ink text-sm">
                      Номер заказа
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-ink text-sm">
                      Клиент
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-ink text-sm">
                      Дата
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-ink text-sm">
                      Товары
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-ink text-sm">
                      Статус
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-ink text-sm">
                      Сумма
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-ink text-sm">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => {
                    const status = getStatusBadge(order.status);
                    return (
                      <tr key={order.id} className="border-b border-line hover:bg-surface transition-colors">
                        <td className="py-4 px-4">
                          <p className="font-semibold text-ink">{order.id}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-ink">{order.customer}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-ink-variant text-sm">
                            {new Date(order.date).toLocaleDateString('ru-RU')}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-ink">{order.items}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <p className="font-semibold text-ink">{order.total.toLocaleString('ru-KZ')} ₸</p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button className="text-clay hover:text-clay/80 transition-colors">
                            <span className="material-symbols-outlined text-5 w-5 h-5">edit</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12">
            <Link href="/profile">
              <button className="text-clay font-semibold hover:underline inline-flex items-center gap-2">
                <span className="material-symbols-outlined">arrow_back</span>
                Вернуться в профиль
              </button>
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
