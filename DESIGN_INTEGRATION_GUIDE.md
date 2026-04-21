# Интеграция дизайна Stitch в azdek2023

## ✅ Что сделано

### 1. Установка Tailwind CSS
- ✅ Добавлены зависимости в `package.json`:
  - `tailwindcss@^3.4.0`
  - `postcss@^8.4.0`
  - `autoprefixer@^10.4.0`
  - `@tailwindcss/forms@^0.5.7`

- ✅ Создан `tailwind.config.ts` с полной дизайн-системой:
  - Все Material Design 3 цвета (25+ основных цветов)
  - Правильные border radius (lg, xl, full)
  - Шрифты: Manrope (headlines), Inter (body/label)

- ✅ Создан `postcss.config.js` для обработки Tailwind

- ✅ Обновлен `globals.css`:
  - Добавлены директивы Tailwind (@tailwind base, components, utilities)
  - Сохранены существующие CSS переменные для обратной совместимости

### 2. Новые компоненты и страницы

#### Компоненты:
- ✅ `src/components/layout/site-header-new.tsx` - современный header с:
  - Навигацией по категориям
  - Поиском
  - Корзиной с индикатором количества
  - Профилем пользователя
  - Мобильным меню

#### Страницы:
- ✅ `src/app/home-new.tsx` - главная страница с:
  - Hero секцией с изображением и CTA
  - Сеткой избранных товаров
  - Полностью стилизована согласно дизайну

- ✅ `src/app/catalog/page-new.tsx` - каталог товаров с:
  - Боковой панелью (категории, сортировка)
  - Поиском в реальном времени
  - Фильтрацией и сортировкой
  - Сеткой товаров с рейтингом
  - Пустым состоянием при отсутствии результатов

### 3. Обновленные маршруты
- ✅ `src/app/page.tsx` → использует новый HomeNew
- ✅ `src/app/catalog/page.tsx` → использует новый CatalogNew

## 🚀 Что нужно сделать дальше

### Фаза 1: Основной e-commerce flow (ПРИОРИТЕТ)

1. **Страница товара (Product Detail)**
   - Файл: `src/app/catalog/[slug]/page-new.tsx`
   - Включить:
     - Галерею изображений
     - Информацию о товаре
     - Варианты (размер, объем)
     - Кнопку "Добавить в корзину"
     - Отзывы и рейтинги
   - Дизайны: `/c/Users/emeen/Downloads/stitch_/_3/code.html` (Purely - Product Details)

2. **Страница корзины (Shopping Cart)**
   - Файл: `src/app/cart/page-new.tsx`
   - Включить:
     - Список товаров в корзине
     - Редактирование количества
     - Удаление товаров
     - Сумма товаров
     - Кнопка оформления заказа
   - Дизайны: `/c/Users/emeen/Downloads/stitch_/_2/code.html` (Purely Shopping Cart)

3. **Оформление заказа (Checkout)**
   - Файл: `src/app/checkout/page-new.tsx`
   - Включить:
     - Доставка (адрес, город, метод)
     - Способ оплаты
     - Итоговая сумма
     - Кнопка подтверждения
   - Дизайны: `/c/Users/emeen/Downloads/stitch_/_4/code.html` (Checkout - Purely)

4. **Авторизация (Login & Register)**
   - Файл: `src/app/login/page-new.tsx`
   - Включить:
     - Форма входа
     - Ссылка на регистрацию
     - Восстановление пароля
   - Дизайны: `/c/Users/emeen/Downloads/stitch_/_1/code.html` (Вход: Чистый холст)

### Фаза 2: Интеграция с API

1. **Подключение к реальным данным:**
   - Заменить mock данные в компонентах на запросы к API
   - Использовать существующие API endpoints:
     - GET `/api/products` - список товаров
     - GET `/api/products/:id` - данные товара
     - POST `/api/cart/items` - добавление в корзину
     - GET `/api/cart` - получение корзины
     - POST `/api/orders` - создание заказа

2. **State Management:**
   - Использовать useContext или Zustand для управления корзиной
   - Синхронизировать с localStorage для сохранения корзины

### Фаза 3: Расширенный функционал

1. **Admin панель (PureLab)**
   - Использовать дизайны из `/stitch_/purelab_*` папок
   - Управление товарами, заказами, пользователями

2. **Профиль пользователя**
   - Мои заказы
   - Адреса доставки
   - Способы оплаты

## 📦 Установка зависимостей

```bash
cd apps/frontend
npm install
# или
pnpm install
```

## 🎨 Использование дизайн-системы

### Основные цвета (Material Design 3):
```tsx
<div className="text-primary">Primary blue</div>
<div className="bg-secondary-container">Secondary container</div>
<div className="text-on-surface">Text on surface</div>
<div className="border border-outline-variant">Border</div>
```

### Компоненты:
```tsx
// Button
<button className="bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90">
  Button
</button>

// Card
<div className="bg-surface-container-lowest p-6 rounded-2xl shadow-lg">
  Card content
</div>

// Input
<input className="border border-outline-variant rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary" />
```

### Шрифты:
```tsx
// Заголовок
<h1 className="font-headline font-black text-5xl text-authoritative">Заголовок</h1>

// Тело текста
<p className="font-body text-base">Обычный текст</p>
```

## 🔧 Следующие шаги

1. **Запустить dev сервер:**
   ```bash
   npm run dev
   ```

2. **Проверить новый дизайн:**
   - Главная страница: http://localhost:3000
   - Каталог: http://localhost:3000/catalog

3. **Установить недостающие зависимости при ошибках**

4. **Создать остальные страницы по образцу (home-new.tsx и page-new.tsx)**

## 📝 Структура файлов дизайна

Дизайны находятся в:
- Главная/каталог: `/stitch_/ru_3/` (PureLab — Эко-чистота в каждом доме)
- Товар: `/stitch_/1-3/` (Карточка товара варианты)
- Корзина: `/stitch_/_2/` (Purely Shopping Cart)
- Checkout: `/stitch_/_4/` (Checkout - Purely)
- Вход: `/stitch_/_1/` (Вход: Чистый холст)
- Admin: `/stitch_/purelab_*/` (Admin панель)

## 🚨 Потенциальные проблемы и решения

### Проблема: Tailwind стили не применяются
**Решение:** 
- Убедитесь, что запущен `npm install`
- Перезагрузите dev сервер (`npm run dev`)
- Проверьте, что `globals.css` имеет Tailwind директивы

### Проблема: Material Symbols icons не отображаются
**Решение:**
- Проверьте, что в `layout.tsx` подключена ссылка на Material Symbols
- Используйте правильные имена иконов: https://fonts.google.com/icons

### Проблема: Цвета не совпадают с дизайном
**Решение:**
- Проверьте tailwind.config.ts
- Убедитесь, что используете правильные имена цветов из конфига

## 📚 Полезные ссылки

- [Tailwind CSS документация](https://tailwindcss.com)
- [Material Design 3 цвета](https://m3.material.io/styles/color/the-color-system/color-roles)
- [Material Symbols иконы](https://fonts.google.com/icons)
- [Next.js 14 документация](https://nextjs.org/docs)

---

**Дата интеграции:** 2026-04-21  
**Версия:** 1.0.0  
**Статус:** В разработке 🚀
