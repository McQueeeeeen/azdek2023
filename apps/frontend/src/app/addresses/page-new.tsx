'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteHeaderNew from '@/components/layout/site-header-new';
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
      firstName: 'Иван',
      lastName: 'Иванов',
      address: 'ул. Примерная, дом 1, кв. 1',
      city: 'Москва',
      zip: '123456',
      phone: '+7 (999) 123-45-67',
      isDefault: true,
    },
    {
      id: '2',
      type: 'Рабочий',
      firstName: 'Иван',
      lastName: 'Иванов',
      address: 'ул. Деловая, дом 2, офис 301',
      city: 'Москва',
      zip: '654321',
      phone: '+7 (999) 123-45-67',
      isDefault: false,
    },
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'Домашний',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
    isDefault: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddNew = () => {
    const newAddress: Address = {
      id: Date.now().toString(),
      ...formData,
    };
    setAddresses([...addresses, newAddress]);
    setFormData({
      type: 'Домашний',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      zip: '',
      phone: '',
      isDefault: false,
    });
    setIsAddingNew(false);
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
  };

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeaderNew />

      <main className="pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-8">
          {/* Header */}
          <div className="mb-12 flex justify-between items-start">
            <div>
              <h1 className="font-headline font-black text-4xl text-on-surface mb-2">
                Управление адресами
              </h1>
              <p className="text-on-surface-variant">
                Добавьте и управляйте адресами доставки
              </p>
            </div>
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:shadow-lg transition-all"
            >
              <span className="material-symbols-outlined">add</span>
              Новый адрес
            </button>
          </div>

          {/* Add New Address Form */}
          {isAddingNew && (
            <div className="bg-white rounded-2xl p-8 mb-8 space-y-6">
              <h2 className="font-headline font-bold text-2xl text-on-surface">
                Добавить новый адрес
              </h2>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">
                  Тип адреса
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border border-outline-variant rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="Домашний">Домашний</option>
                  <option value="Рабочий">Рабочий</option>
                  <option value="Другое">Другое</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">
                    Имя
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-outline-variant rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Иван"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">
                    Фамилия
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-outline-variant rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Иванов"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-outline-variant rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface mb-2">
                  Адрес
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-outline-variant rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="ул. Примерная, дом 1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">
                    Город
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border border-outline-variant rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Москва"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">
                    Почтовый индекс
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full border border-outline-variant rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="123456"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-outline-variant"
                />
                <span className="font-semibold text-on-surface">
                  Использовать как адрес по умолчанию
                </span>
              </label>

              <div className="border-t border-outline-variant pt-6 flex gap-4">
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1 border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Отменить
                </button>
                <button
                  onClick={handleAddNew}
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Добавить адрес
                </button>
              </div>
            </div>
          )}

          {/* Addresses List */}
          <div className="space-y-4">
            {addresses.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <span className="material-symbols-outlined text-8xl text-surface-variant mb-4 block">
                  location_on
                </span>
                <h2 className="font-headline text-2xl font-bold text-on-surface mb-3">
                  Нет сохраненных адресов
                </h2>
                <p className="text-on-surface-variant mb-8">
                  Добавьте адрес доставки для быстрого оформления заказа
                </p>
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="bg-primary text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">add</span>
                  Добавить адрес
                </button>
              </div>
            ) : (
              addresses.map(addr => (
                <div key={addr.id} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg text-on-surface">{addr.type}</h3>
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
                          className="px-4 py-2 rounded-lg border-2 border-outline-variant text-on-surface font-semibold hover:border-primary hover:text-primary transition-all text-sm"
                        >
                          Установить по умолчанию
                        </button>
                      )}
                      <button className="p-2 hover:bg-blue-50 rounded-lg text-primary transition-colors">
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

                  <div className="grid grid-cols-2 gap-6 text-on-surface-variant">
                    <div>
                      <p className="text-sm mb-1 text-on-surface-variant">Контактное лицо</p>
                      <p className="font-semibold text-on-surface">{addr.firstName} {addr.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm mb-1 text-on-surface-variant">Телефон</p>
                      <p className="font-semibold text-on-surface">{addr.phone}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-outline-variant">
                    <p className="text-on-surface">{addr.address}</p>
                    <p className="text-on-surface-variant">{addr.city}, {addr.zip}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Back Link */}
          <div className="mt-12">
            <Link href="/profile">
              <button className="text-primary font-semibold hover:underline inline-flex items-center gap-2">
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
