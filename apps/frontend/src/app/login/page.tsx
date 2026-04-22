'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = 'Email или телефон обязателен';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailOrPhone) &&
      !/^\+?7\d{10}$/.test(formData.emailOrPhone.replace(/\D/g, ''))
    ) {
      newErrors.emailOrPhone = 'Введите корректный email или номер телефона';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Determine if email or phone was provided
      const isEmail = formData.emailOrPhone.includes('@');
      const loginData = isEmail
        ? { email: formData.emailOrPhone, password: formData.password }
        : { phone: formData.emailOrPhone.replace(/\D/g, ''), password: formData.password };

      const response = await fetch('/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();

        // Store JWT token
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
          // Store remember me preference
          if (formData.rememberMe) {
            localStorage.setItem('remember_me', 'true');
          }
        }

        // Redirect to profile/catalog
        window.location.href = '/profile';
      } else {
        const error = await response.json();
        setErrors({
          submit: error.message || 'Неверный email/телефон или пароль',
        });
      }
    } catch (error) {
      setErrors({
        submit: 'Ошибка подключения. Попробуйте позже.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Вход в аккаунт</h1>

          <form onSubmit={handleSubmit} className="login-form">
            {errors.submit && (
              <div className="form-error-banner">
                <span className="icon" style={{ fontSize: 18 }}>error</span>
                {errors.submit}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="emailOrPhone" className="form-label">
                Email или телефон
              </label>
              <input
                type="text"
                id="emailOrPhone"
                name="emailOrPhone"
                className={`input ${errors.emailOrPhone ? 'input-error' : ''}`}
                placeholder="you@example.com или +7 (XXX) XXX-XX-XX"
                value={formData.emailOrPhone}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="email"
              />
              {errors.emailOrPhone && (
                <span className="form-field-error">{errors.emailOrPhone}</span>
              )}
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="password" className="form-label">
                  Пароль
                </label>
                <Link href="#forgot-password" className="forgot-password-link">
                  Забыли пароль?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                className={`input ${errors.password ? 'input-error' : ''}`}
                placeholder="Введите пароль"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                autoComplete="current-password"
              />
              {errors.password && (
                <span className="form-field-error">{errors.password}</span>
              )}
            </div>

            <div className="form-checkbox">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={isLoading}
              />
              <label htmlFor="rememberMe">Запомнить меня</label>
            </div>

            <button
              type="submit"
              className="btn btn-clay btn-lg"
              style={{ width: '100%' }}
              disabled={isLoading}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>

            <div className="login-divider">
              <span>или</span>
            </div>

            <button
              type="button"
              className="btn btn-outline btn-lg"
              style={{ width: '100%' }}
              disabled={isLoading}
            >
              <span className="icon" style={{ fontSize: 18 }}>mail</span>
              Вход через email
            </button>
          </form>

          <p className="login-subtitle" style={{ marginTop: 20, textAlign: 'center' }}>
            Нет аккаунта?{' '}
            <Link href="/signup" className="login-link">
              Зарегистрироваться
            </Link>
          </p>

          <p className="login-footer" style={{ marginTop: 16 }}>
            Используя Adzek, вы согласны с нашими{' '}
            <a href="#" className="login-link">
              условиями использования
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
