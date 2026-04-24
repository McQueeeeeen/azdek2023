'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';

interface Address {
  id: string;
  type: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'Домашний',
      firstName: 'Алибек',
      lastName: 'Жаксыбеков',
      address: 'ул. Абая 150, кв. 45',
      city: 'Алматы',
      zip: '050000',
      phone: '+7 701 123 45 67',
      isDefault: true,
    },
    {
      id: '2',
      type: 'Рабочий',
      firstName: 'Алибек',
      lastName: 'Жаксыбеков',
      address: 'пр. Назарбаева 77, офис 301',
      city: 'Астана',
      zip: '010000',
      phone: '+7 702 234 56 78',
      isDefault: false,
    },
  ]);

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({ ...addr, isDefault: addr.id === id })));
  };

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />

      <main className="pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-8">
          <div className="mb-12 flex justify-between items-start">
            <div>
              <h1 className="font-headline font-black text-4xl text-ink mb-2">
                Управление адресами
              </h1>
              <p className="text-ink-variant">
                Добавьте и управляйте адресами доставки по Казахстану
              </p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-clay text-white font-semibold hover:shadow-lg transition-all">
              <span className="material-symbols-outlined">add</span>
              Новый адрес
            </button>
          </div>

          <div className="space-y-4">
            {addresses.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <span className="material-symbols-outlined text-8xl text-surface-variant mb-4 block">
                  location_on
                </span>
                <h2 className="font-headline text-2xl font-bold text-ink mb-3">
                  Нет сохранённых адресов
                </h2>
              </div>
            ) : (
              addresses.map(addr => (
                <div key={addr.id} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg text-ink">{addr.type}</h3>
                      {addr.isDefault && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                          По умолчанию
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="px-4 py-2 rounded-lg border-2 border-line text-ink font-semibold hover:border-clay hover:text-clay transition-all text-sm"
                        >
                          Установить по умолчанию
                        </button>
                      )}
                      <button className="p-2 hover:bg-blue-50 rounded-lg text-clay transition-colors">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(addr.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-line">
                    <p className="text-ink">{addr.firstName} {addr.lastName}</p>
                    <p className="text-ink">{addr.address}</p>
                    <p className="text-ink-variant">
                      {addr.city}, {addr.zip} · {addr.phone}
                    </p>
                  </div>
                </div>
              ))
            )}
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
