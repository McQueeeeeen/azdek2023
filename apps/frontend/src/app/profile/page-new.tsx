'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteHeaderNew from '@/components/layout/site-header-new';
import SiteFooter from '@/components/layout/site-footer';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'account' | 'addresses' | 'preferences'>('account');
  const [formData, setFormData] = useState({
    firstName: 'Иван',
    lastName: 'Иванов',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    birthDate: '1990-01-15',
    gender: 'male',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Profile updated:', formData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeaderNew />

      <main className="pt-20 pb-24">
        <div className="max-w-6xl mx-auto px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-headline font-black text-4xl text-on-surface mb-2">
              Мой профиль
            </h1>
            <p className="text-on-surface-variant">
              Управление информацией о вашем аккаунте
            </p>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 space-y-2">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === 'account'
                      ? 'bg-primary text-white'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined align-middle mr-2 text-5 w-5 h-5">
                    person
                  </span>
                  Аккаунт
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === 'addresses'
                      ? 'bg-primary text-white'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined align-middle mr-2 text-5 w-5 h-5">
                    location_on
                  </span>
                  Адреса
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === 'preferences'
                      ? 'bg-primary text-white'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined align-middle mr-2 text-5 w-5 h-5">
                    settings
                  </span>
                  Предпочтения
                </button>
                <div className="border-t border-outline-variant pt-4 mt-4">
                  <Link href="/">
                    <button className="w-full text-left px-4 py-3 rounded-lg font-semibold text-red-600 hover:bg-red-50 transition-all">
                      <span className="material-symbols-outlined align-middle mr-2 text-5 w-5 h-5">
                        logout
                      </span>
                      Выход
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="bg-white rounded-2xl p-8 space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-headline font-bold text-2xl text-on-surface">
                      Информация об аккаунте
                    </h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-blue-50 transition-all"
                    >
                      <span className="material-symbols-outlined text-5 w-5 h-5">
                        {isEditing ? 'close' : 'edit'}
                      </span>
                      {isEditing ? 'Отменить' : 'Редактировать'}
                    </button>
                  </div>

                  {isEditing ? (
                    <form className="space-y-4">
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
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-on-surface mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full border border-outline-variant rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
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
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-on-surface mb-2">
                            Дата рождения
                          </label>
                          <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            className="w-full border border-outline-variant rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-on-surface mb-2">
                            Пол
                          </label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full border border-outline-variant rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                          >
                            <option value="male">Мужской</option>
                            <option value="female">Женский</option>
                            <option value="other">Другое</option>
                          </select>
                        </div>
                      </div>

                      <div className="border-t border-outline-variant pt-6 flex gap-4">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="flex-1 border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                        >
                          Отменить
                        </button>
                        <button
                          type="button"
                          onClick={handleSave}
                          className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                          Сохранить изменения
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-on-surface-variant mb-1">Имя</p>
                          <p className="text-lg font-semibold text-on-surface">{formData.firstName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-on-surface-variant mb-1">Фамилия</p>
                          <p className="text-lg font-semibold text-on-surface">{formData.lastName}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-on-surface-variant mb-1">Email</p>
                        <p className="text-lg font-semibold text-on-surface">{formData.email}</p>
                      </div>

                      <div>
                        <p className="text-sm text-on-surface-variant mb-1">Телефон</p>
                        <p className="text-lg font-semibold text-on-surface">{formData.phone}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-on-surface-variant mb-1">Дата рождения</p>
                          <p className="text-lg font-semibold text-on-surface">
                            {new Date(formData.birthDate).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-on-surface-variant mb-1">Пол</p>
                          <p className="text-lg font-semibold text-on-surface">
                            {formData.gender === 'male' ? 'Мужской' : formData.gender === 'female' ? 'Женский' : 'Другое'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-outline-variant pt-6 mt-6">
                    <h3 className="font-bold text-on-surface mb-4">Безопасность</h3>
                    <button className="w-full border-2 border-orange-300 text-orange-600 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined">lock</span>
                      Изменить пароль
                    </button>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="bg-white rounded-2xl p-8 space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-headline font-bold text-2xl text-on-surface">
                      Мои адреса
                    </h2>
                    <Link href="/addresses/new">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:shadow-lg transition-all">
                        <span className="material-symbols-outlined text-5 w-5 h-5">
                          add
                        </span>
                        Добавить адрес
                      </button>
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        id: 1,
                        type: 'Домашний',
                        address: 'ул. Примерная, дом 1, кв. 1',
                        city: 'Москва',
                        zip: '123456',
                        isDefault: true,
                      },
                      {
                        id: 2,
                        type: 'Рабочий',
                        address: 'ул. Деловая, дом 2, офис 301',
                        city: 'Москва',
                        zip: '654321',
                        isDefault: false,
                      },
                    ].map(addr => (
                      <div key={addr.id} className="border border-outline-variant rounded-lg p-4 flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-on-surface">{addr.type}</h3>
                            {addr.isDefault && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                                По умолчанию
                              </span>
                            )}
                          </div>
                          <p className="text-on-surface-variant">{addr.address}</p>
                          <p className="text-on-surface-variant text-sm">
                            {addr.city}, {addr.zip}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-blue-50 rounded-lg text-primary transition-colors">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors">
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="bg-white rounded-2xl p-8 space-y-6">
                  <h2 className="font-headline font-bold text-2xl text-on-surface mb-6">
                    Предпочтения
                  </h2>

                  <div className="space-y-6">
                    <div className="border border-outline-variant rounded-lg p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 mt-1 rounded border-outline-variant"
                        />
                        <div>
                          <p className="font-semibold text-on-surface">
                            Уведомления по email
                          </p>
                          <p className="text-sm text-on-surface-variant">
                            Получайте обновления о новых товарах и специальных предложениях
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="border border-outline-variant rounded-lg p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 mt-1 rounded border-outline-variant"
                        />
                        <div>
                          <p className="font-semibold text-on-surface">
                            SMS-уведомления
                          </p>
                          <p className="text-sm text-on-surface-variant">
                            Статус заказа и важные информационные сообщения
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="border border-outline-variant rounded-lg p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-5 h-5 mt-1 rounded border-outline-variant"
                        />
                        <div>
                          <p className="font-semibold text-on-surface">
                            Маркетинговые сообщения
                          </p>
                          <p className="text-sm text-on-surface-variant">
                            Информация о скидках и промоакциях
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="border-t border-outline-variant pt-6 mt-6">
                      <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                        Сохранить предпочтения
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
