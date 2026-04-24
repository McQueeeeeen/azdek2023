'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';
import { apiPost, AuthTokens } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

type AuthMode = 'login' | 'register';

const loginSchema = z.object({
  email: z.string().email('Некорректный email адрес'),
  password: z.string().min(6, 'Минимальная длина пароля 6 символов'),
});

const registerSchema = z.object({
  email: z.string().email('Некорректный email адрес'),
  password: z.string().min(6, 'Минимальная длина пароля 6 символов'),
  firstName: z.string().min(2, 'Имя слишком короткое'),
  lastName: z.string().min(2, 'Фамилия слишком короткая'),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', firstName: '', lastName: '' },
  });

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await apiPost<AuthTokens>('/auth/login', data);
      setAuth(response.user, response.accessToken);
      toast.success('Вы успешно вошли в систему!');
      router.push('/');
    } catch (err: any) {
      toast.error('Ошибка входа', { description: 'Неверный email или пароль' });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await apiPost<AuthTokens>('/auth/register', data);
      setAuth(response.user, response.accessToken);
      toast.success('Аккаунт успешно создан!');
      router.push('/');
    } catch (err: any) {
      toast.error('Ошибка регистрации', { description: 'Возможно, пользователь уже существует' });
    } finally {
      setIsLoading(false);
    }
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

          <div className="bg-white rounded-3xl p-8 space-y-6 shadow-sm border border-line">
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
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <h2 className="font-headline font-bold text-2xl text-ink mb-6">
                  Добро пожаловать!
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Email</label>
                  <input
                    type="email"
                    {...loginForm.register('email')}
                    className="w-full border border-line rounded-lg px-4 py-3 focus:border-clay focus:ring-1 outline-none"
                    placeholder="example@mail.com"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-error text-xs mt-1">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Пароль</label>
                  <input
                    type="password"
                    {...loginForm.register('password')}
                    className="w-full border border-line rounded-lg px-4 py-3 focus:border-clay focus:ring-1 outline-none"
                    placeholder="••••••••"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-error text-xs mt-1">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="text-right">
                  <button type="button" className="text-clay text-sm font-semibold hover:underline">
                    Забыли пароль?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-clay text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                  ) : (
                    <span className="material-symbols-outlined">login</span>
                  )}
                  {isLoading ? 'Вход...' : 'Войти'}
                </button>
              </form>
            )}

            {mode === 'register' && (
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <h2 className="font-headline font-bold text-2xl text-ink mb-6">
                  Создать аккаунт
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-2">Имя</label>
                    <input
                      type="text"
                      {...registerForm.register('firstName')}
                      className="w-full border border-line rounded-lg px-4 py-3 focus:border-clay focus:ring-1 outline-none"
                      placeholder="Алибек"
                    />
                    {registerForm.formState.errors.firstName && (
                      <p className="text-error text-xs mt-1">{registerForm.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-2">Фамилия</label>
                    <input
                      type="text"
                      {...registerForm.register('lastName')}
                      className="w-full border border-line rounded-lg px-4 py-3 focus:border-clay focus:ring-1 outline-none"
                      placeholder="Жаксыбеков"
                    />
                    {registerForm.formState.errors.lastName && (
                      <p className="text-error text-xs mt-1">{registerForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Email</label>
                  <input
                    type="email"
                    {...registerForm.register('email')}
                    className="w-full border border-line rounded-lg px-4 py-3 focus:border-clay focus:ring-1 outline-none"
                    placeholder="example@mail.com"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-error text-xs mt-1">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Пароль</label>
                  <input
                    type="password"
                    {...registerForm.register('password')}
                    className="w-full border border-line rounded-lg px-4 py-3 focus:border-clay focus:ring-1 outline-none"
                    placeholder="••••••••"
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-error text-xs mt-1">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-clay text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                  ) : (
                    <span className="material-symbols-outlined">person_add</span>
                  )}
                  {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
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
