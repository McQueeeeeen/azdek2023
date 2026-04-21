'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteHeaderNew from '@/components/layout/site-header-new';
import SiteFooter from '@/components/layout/site-footer';

type AuthMode = 'login' | 'register';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    agreeTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeaderNew />

      <main className="pt-20 pb-24">
        <div className="max-w-md mx-auto px-8">
          {/* Logo */}
          <div className="text-center mb-12">
            <h1 className="font-headline font-bold text-3xl text-on-surface">
              PureLab
            </h1>
            <p className="text-on-surface-variant mt-2">
              Чистота от природы
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-white rounded-3xl p-8 space-y-6">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-outline-variant">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-4 font-semibold transition-colors text-center border-b-2 -mb-4 ${
                  mode === 'login'
                    ? 'text-primary border-b-primary'
                    : 'text-on-surface-variant border-b-transparent'
                }`}
              >
                Вход
              </button>
              <button
                onClick={() => setMode('register')}
                className={`flex-1 py-4 font-semibold transition-colors text-center border-b-2 -mb-4 ${
                  mode === 'register'
                    ? 'text-primary border-b-primary'
                    : 'text-on-surface-variant border-b-transparent'
                }`}
              >
                Регистрация
              </button>
            </div>

            {/* Login Form */}
            {mode === 'login' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-headline font-bold text-2xl text-on-surface mb-6">
                  Добро пожаловать!
                </h2>

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
                    placeholder="example@mail.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">
                    Пароль
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-outline-variant rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="text-right">
                  <link rel="preload" href="#" />
                  <button className="text-primary text-sm font-semibold hover:underline">
                    Забыли пароль?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">login</span>
                  Войти
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-outline-variant" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-on-surface-variant">
                      или войдите через
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="border-2 border-outline-variant py-3 rounded-lg font-semibold hover:border-primary transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">account_box</span>
                    Google
                  </button>
                  <button className="border-2 border-outline-variant py-3 rounded-lg font-semibold hover:border-primary transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                    Яндекс
                  </button>
                </div>
              </form>
            )}

            {/* Register Form */}
            {mode === 'register' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-headline font-bold text-2xl text-on-surface mb-6">
                  Создать аккаунт
                </h2>

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
                      required
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
                      required
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
                    placeholder="example@mail.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">
                    Пароль
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-outline-variant rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2">
                    Подтвердить пароль
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full border border-outline-variant rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-5 h-5 mt-1 rounded border-outline-variant"
                    required
                  />
                  <span className="text-sm text-on-surface-variant">
                    Я согласен с{' '}
                    <button className="text-primary font-semibold hover:underline">
                      условиями использования
                    </button>{' '}
                    и{' '}
                    <button className="text-primary font-semibold hover:underline">
                      политикой конфиденциальности
                    </button>
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">person_add</span>
                  Создать аккаунт
                </button>
              </form>
            )}

            {/* Footer */}
            <div className="text-center text-sm text-on-surface-variant">
              {mode === 'login' ? (
                <>
                  Нет аккаунта?{' '}
                  <button
                    onClick={() => setMode('register')}
                    className="text-primary font-semibold hover:underline"
                  >
                    Зарегистрируйтесь
                  </button>
                </>
              ) : (
                <>
                  Уже есть аккаунт?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-primary font-semibold hover:underline"
                  >
                    Войдите
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link href="/" className="text-primary font-semibold hover:underline inline-flex items-center gap-2">
              <span className="material-symbols-outlined text-5 w-5 h-5">arrow_back</span>
              Вернуться на главную
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
