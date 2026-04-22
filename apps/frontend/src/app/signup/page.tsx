'use client';
import Link from 'next/link';
import { useState } from 'react';

const KZ_CITIES = [
  'Алматы',
  'Астана',
  'Караганда',
  'Актау',
  'Атырау',
  'Өскемен',
  'Кокшетау',
  'Костанай',
  'Павлодар',
  'Петропавл',
  'Тараз',
  'Туркестан',
  'Орал',
  'Щучинск',
  'Жаңаөзен',
  'Кызылорда',
  'Семей',
];

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    city: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Номер телефона обязателен';
    } else if (!/^77\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Формат: +7 (7XX) XXX-XX-XX';
    }

    // Name validation
    if (!formData.firstName) {
      newErrors.firstName = 'Имя обязательно';
    }
    if (!formData.lastName) {
      newErrors.lastName = 'Фамилия обязательна';
    }

    // City validation
    if (!formData.city) {
      newErrors.city = 'Выберите город';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Минимум 8 символов';
    } else if (!/[a-zA-Zа-яА-ЯёЁ]/.test(formData.password)) {
      newErrors.password = 'Должны быть буквы';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Должны быть цифры';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Согласитесь с условиями';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;

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

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');

    // Ensure it starts with 7
    if (value.length === 0) {
      setFormData(prev => ({ ...prev, phone: '' }));
      return;
    }

    if (!value.startsWith('7')) {
      value = '7' + value;
    }

    // Format as +7 (XXX) XXX-XX-XX
    if (value.length >= 1) {
      let formatted = '+' + value[0];
      if (value.length > 1) formatted += ' (' + value.substring(1, 4);
      if (value.length > 4) formatted += ') ' + value.substring(4, 7);
      if (value.length > 7) formatted += '-' + value.substring(7, 9);
      if (value.length > 9) formatted += '-' + value.substring(9, 11);

      setFormData(prev => ({ ...prev, phone: formatted }));
    }

    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/v1/auth/register/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone.replace(/\D/g, ''),
          firstName: formData.firstName,
          lastName: formData.lastName,
          city: formData.city,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        const error = await response.json();
        setErrors({
          submit: error.message || 'Ошибка при регистрации',
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

  if (success) {
    return (
      <div className="signup-page">
        <div className="signup-container">
          <div className="success-message">
            <div className="success-icon">
              <span className="icon icon-fill" style={{ fontSize: 48 }}>check_circle</span>
            </div>
            <h2>Регистрация успешна!</h2>
            <p>Сейчас вы будете перенаправлены на страницу входа...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <h1 className="signup-title">Создать аккаунт</h1>

          <form onSubmit={handleSubmit} className="signup-form">
            {errors.submit && (
              <div className="form-error-banner">
                <span className="icon" style={{ fontSize: 18 }}>error</span>
                {errors.submit}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`input ${errors.email ? 'input-error' : ''}`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.email && <span className="form-field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Номер телефона
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`input ${errors.phone ? 'input-error' : ''}`}
                  placeholder="+7 (XXX) XXX-XX-XX"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  disabled={isLoading}
                />
                {errors.phone && <span className="form-field-error">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  Имя
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={`input ${errors.firstName ? 'input-error' : ''}`}
                  placeholder="Иван"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.firstName && <span className="form-field-error">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Фамилия
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={`input ${errors.lastName ? 'input-error' : ''}`}
                  placeholder="Петров"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.lastName && <span className="form-field-error">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="city" className="form-label">
                Город
              </label>
              <select
                id="city"
                name="city"
                className={`input ${errors.city ? 'input-error' : ''}`}
                value={formData.city}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">Выберите город...</option>
                {KZ_CITIES.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && <span className="form-field-error">{errors.city}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Пароль
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`input ${errors.password ? 'input-error' : ''}`}
                  placeholder="Минимум 8 символов"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.password && <span className="form-field-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Подтверждение пароля
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Повторите пароль"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {errors.confirmPassword && <span className="form-field-error">{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className="form-checkbox">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                disabled={isLoading}
              />
              <label htmlFor="agreeTerms">
                Я согласен с{' '}
                <a href="#" className="signup-link">
                  условиями использования
                </a>
                {' '}и{' '}
                <a href="#" className="signup-link">
                  политикой конфиденциальности
                </a>
              </label>
            </div>
            {errors.agreeTerms && <span className="form-field-error">{errors.agreeTerms}</span>}

            <button
              type="submit"
              className="btn btn-clay btn-lg"
              style={{ width: '100%' }}
              disabled={isLoading}
            >
              {isLoading ? 'Регистрация...' : 'Создать аккаунт'}
            </button>
          </form>

          <p className="signup-subtitle" style={{ marginTop: 24, textAlign: 'center' }}>
            Уже есть аккаунт?{' '}
            <Link href="/login" className="signup-link">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
