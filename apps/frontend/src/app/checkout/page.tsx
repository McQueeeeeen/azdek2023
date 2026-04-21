'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'card',
  });

  const subtotal = 1210;
  const shipping = 299;
  const tax = 272;
  const total = subtotal + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />

      <main className="pt-20 pb-24">
        <div className="max-w-6xl mx-auto px-8">
          {/* Steps Indicator */}
          <div className="mb-12 flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  s <= step
                    ? 'bg-primary text-white'
                    : 'bg-surface-container text-on-surface-variant'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-3 transition-all ${
                    s < step ? 'bg-primary' : 'bg-surface-container'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <h1 className="font-headline font-black text-4xl text-on-surface mb-12">
            {step === 1 && 'Доставка'}
            {step === 2 && 'Способ оплаты'}
            {step === 3 && 'Подтверждение заказа'}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              {/* Step 1: Delivery */}
              {step === 1 && (
                <div className="bg-white rounded-2xl p-8 space-y-6">
                  <h2 className="font-headline font-bold text-2xl text-on-surface mb-6">
                    Адрес доставки
                  </h2>

                  <div className="grid grid-cols-2 gap-6">
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
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-outline-variant rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      placeholder="ivan@example.com"
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

                  <div className="grid grid-cols-2 gap-6">
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

                  <div className="border-t border-outline-variant pt-6 flex gap-4">
                    <Link href="/cart">
                      <button className="flex-1 border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                        Назад
                      </button>
                    </Link>
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Продолжить
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className="bg-white rounded-2xl p-8 space-y-6">
                  <h2 className="font-headline font-bold text-2xl text-on-surface mb-6">
                    Способ оплаты
                  </h2>

                  <div className="space-y-3">
                    {[
                      { value: 'card', label: 'Кредитная карта', icon: 'credit_card' },
                      { value: 'yandex', label: 'Яндекс Касса', icon: 'wallet' },
                      { value: 'sbp', label: 'СБП (Система быстрых платежей)', icon: 'phone_android' },
                    ].map(method => (
                      <label key={method.value} className="flex items-center p-4 border-2 border-outline-variant rounded-lg cursor-pointer hover:border-primary transition-colors"
                        style={formData.paymentMethod === method.value ? { borderColor: 'var(--primary)' } : {}}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={formData.paymentMethod === method.value}
                          onChange={handleChange}
                          className="w-5 h-5"
                        />
                        <span className="material-symbols-outlined ml-3 mr-3">{method.icon}</span>
                        <span className="font-semibold text-on-surface">{method.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="border-t border-outline-variant pt-6 flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                    >
                      Назад
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Продолжить
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="bg-white rounded-2xl p-8 space-y-6">
                  <h2 className="font-headline font-bold text-2xl text-on-surface mb-6">
                    Подтверждение заказа
                  </h2>

                  <div className="space-y-4">
                    <div className="pb-4 border-b border-outline-variant">
                      <h3 className="font-bold text-on-surface mb-2">Доставка:</h3>
                      <p className="text-on-surface-variant">
                        {formData.address}, {formData.city} {formData.zip}
                      </p>
                    </div>

                    <div className="pb-4 border-b border-outline-variant">
                      <h3 className="font-bold text-on-surface mb-2">Способ оплаты:</h3>
                      <p className="text-on-surface-variant">
                        {formData.paymentMethod === 'card' && 'Кредитная карта'}
                        {formData.paymentMethod === 'yandex' && 'Яндекс Касса'}
                        {formData.paymentMethod === 'sbp' && 'СБП'}
                      </p>
                    </div>

                    <div className="pb-4 border-b border-outline-variant">
                      <h3 className="font-bold text-on-surface mb-2">Контакты:</h3>
                      <p className="text-on-surface-variant">{formData.email}</p>
                      <p className="text-on-surface-variant">{formData.phone}</p>
                    </div>
                  </div>

                  <div className="border-t border-outline-variant pt-6 flex gap-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                    >
                      Назад
                    </button>
                    <Link href="/order-confirmation" className="flex-1">
                      <button className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined">check_circle</span>
                        Подтвердить заказ
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-8 sticky top-24 space-y-6">
                <h2 className="font-headline font-bold text-xl text-on-surface">
                  Ваш заказ
                </h2>

                <div className="space-y-3 text-sm border-b border-outline-variant pb-6">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Товары:</span>
                    <span>{subtotal} ₽</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Доставка:</span>
                    <span>{shipping} ₽</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Налог:</span>
                    <span>{tax} ₽</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-headline font-bold text-on-surface">Итого:</span>
                  <span className="text-2xl font-black text-primary">{total} ₽</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
