'use client';

import Link from 'next/link';
import { useState } from 'react';
import SiteHeader from '@/components/layout/site-header';
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
      <SiteHeader />

      <main className="pt-20 pb-24">
        <div className="max-w-md mx-auto px-8">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <h1 className="font-headline font-bold text-3xl text-ink">Adzek</h1>
            <p className="text-ink-variant mt-2">Чистота без лишнего</p>
          </div>

          <div className="bg-white rounded-3xl p-8 space-y-6">
            <div className="flex gap-4 border-b border-line">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-4 font-semibold transition-colors text-center border-b-2 -mb-4 ${
                  mode === 'login'
                    ? 'text-clay border-b-primary'
                    : 'text-ink-variant border-b-transparent'
                }`}
              >
                Вход
              </button>
              <button
                onClick={() => setMode('register')}
                className={`flex-1 py-4 font-semibold transition-colors text-center border-b-2 -mb-4 ${
                  mode === 'register'
                    ? 'text-clay border-b-primary'
                    : 'text-ink-variant border-b-transparent'
                }`}
              >
                Регистрация
              </button>
            </div>

            {mode === 'login' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-headline font-bold text-2xl text-ink mb-6">
                  Добро пожаловать!
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-line rounded-lg px-4 py-3 focus:border-clay focus:ring-1 focus:ring-primary outline-none"
                    placeholder="example@mail.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">
                    Пароль
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-line rounded-lg px-4 py-3 focus:border-clay focus:ring-1 focus:ring-primary outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="text-right">
                  <button type="button" className="text-clay text-sm font-semibold hover:underline">
                    Забыли пароль?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-clay text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">login</span>
                  Войти
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-line" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-ink-variant">или войдите через</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="border-2 border-line py-3 rounded-lg font-semibold hover:border-clay transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">account_box</span>
                    Google
                  </button>
                  <button
                    type="button"
                    className="border-2 border-line py-3 rounded-lg font-semibold hover:border-clay transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                    Яндекс
                  </button>
                </div>
              </form>
            )}

            {mode === 'register' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-headline font-bold text-2xl text-ink mb-6">
                  Создать аккаунт
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-2">
                      Имя
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full border border-line rounded-lg px-4 py-3 focus:border-clay focus:ring-1 focus:ring-primary outline-none"
                      placeholder="Алибек"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-2">
                      Фамилия
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full border border-line rounded-lg px-4 py-3 focus:border-clay focus:ring-1 focus:ring-primary outline-none"
                      placeholder="Жаксыбеков"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-line rounded-lg px-4 py-3 focus:border-clay focus:ring-1 focus:ring-primary outline-none"
                    placeholder="example@mail.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">
                    Пароль
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-line rounded-lg px-4 py-3 focus:border-clay focus:ring-1 focus:ring-primary outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-clay text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">person_add</span>
                  Зарегистрироваться
                </button>
              </form>
            )}

            <p className="text-center text-sm text-ink-variant">
              Используя Adzek, вы соглашаетесь с нашими{' '}
              <Link href="#" className="text-clay font-semibold hover:underline">
                условиями использования
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
