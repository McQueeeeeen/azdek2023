# 🚀 Быстрый старт - Новый дизайн

## Что было сделано

✅ **Tailwind CSS интегрирован** с полной дизайн-системой Material Design 3  
✅ **3 новые страницы** созданы с дизайном:
  - Главная страница (home-new.tsx) - Hero + товары
  - Каталог (catalog/page-new.tsx) - Фильтры + сетка + поиск
  - Header (site-header-new.tsx) - Навигация + корзина + профиль

✅ **Все цвета, шрифты, иконки** из дизайна подключены

## Как запустить

### 1️⃣ Установить зависимости
```bash
cd apps/frontend
npm install
```

### 2️⃣ Запустить dev сервер
```bash
npm run dev
```

Откроется http://localhost:3000

### 3️⃣ Посмотреть новый дизайн
- **Главная:** http://localhost:3000 (Hero + товары)
- **Каталог:** http://localhost:3000/catalog (с фильтрами и поиском)

## 📋 Что дальше

**Приоритет:**
1. Страница товара (Product Details) - `/catalog/[slug]/page-new.tsx`
2. Корзина (Shopping Cart) - `/cart/page-new.tsx`
3. Оформление заказа (Checkout) - `/checkout/page-new.tsx`
4. Авторизация (Login) - `/login/page-new.tsx`

**Интеграция с API:**
- Заменить mock данные на реальные запросы к бэкенду
- Подключить управление корзиной

## 🎨 Дизайн-система

### Используемые цвета в Tailwind
```tsx
<div className="text-primary">Основной синий</div>
<div className="bg-surface">Фон</div>
<div className="text-on-surface">Текст</div>
<div className="border-outline-variant">Границы</div>
```

### Шрифты
- `font-headline` - для заголовков (Manrope)
- `font-body` - для текста (Inter)

### Icons
- Используются Material Symbols: https://fonts.google.com/icons
- Например: `<span className="material-symbols-outlined">shopping_cart</span>`

## 💾 Структура файлов

```
src/
├── app/
│   ├── page.tsx → использует home-new.tsx ✅
│   ├── home-new.tsx → новая главная ✅
│   ├── catalog/
│   │   ├── page.tsx → использует page-new.tsx ✅
│   │   ├── page-new.tsx → новый каталог ✅
│   │   ├── [slug]/
│   │   │   └── page-new.tsx → TODO: товар
│   ├── cart/
│   │   └── page-new.tsx → TODO: корзина
│   ├── checkout/
│   │   └── page-new.tsx → TODO: чекаут
│   └── login/
│       └── page-new.tsx → TODO: вход
└── components/
    └── layout/
        └── site-header-new.tsx → новый header ✅
```

## 🔧 Полезные команды

```bash
# Запустить dev сервер
npm run dev

# Собрать для production
npm run build

# Запустить production сервер
npm start

# Запустить e2e тесты
npm run test:e2e
```

## ⚠️ Если что-то не работает

### Стили не применяются
- Запустите `npm install` еще раз
- Перезагрузите dev сервер (Ctrl+C, затем `npm run dev`)

### Material Icons не показываются
- Проверьте, что в `layout.tsx` подключена ссылка на Material Symbols
- Используйте правильные имена иконок

### Цвета отличаются
- Проверьте `tailwind.config.ts`
- Очистите `.next` папку: `rm -rf .next && npm run dev`

## 📖 Дополнительно

- Полный гайд интеграции: `../../DESIGN_INTEGRATION_GUIDE.md`
- Дизайны находятся в: `/public/designs/stitch_/`
- Material Design 3: https://m3.material.io/

---

**Готово к разработке!** 🎉
