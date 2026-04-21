# E-Commerce Design Structure - PureLab
## Полная архитектура графического дизайна

---

## 📐 ДИЗАЙН-СИСТЕМА

### 1. ЦВЕТОВАЯ ПАЛИТРА (Material Design 3)

#### Основные цвета
- **Primary Blue**: `#0058BC` / `rgb(0, 88, 188)`
  - Используется: Кнопки, ссылки, активные элементы
  - Тёмный вариант: `#1d4ed8`
  - Светлый вариант: `#2563eb`

- **Secondary Green**: `#91f78e` / `rgb(145, 247, 142)`
  - Используется: Бейджи, иконки, достижения
  - Тёмный текст на зелёном: `#00731e`

- **Surface** (Фон): `#f7f9fb` / `rgb(247, 249, 251)`
- **Surface Container**: `#f2f4f6` / `rgb(242, 244, 246)`
- **Surface Container Low**: `#e6e8ea`
- **Surface Container Lowest**: `#ffffff`

#### Текстовые цвета
- **On Surface** (основной текст): `#191c1e`
- **On Surface Variant** (вторичный текст): `#414755` / `#475569`
- **On Secondary Container**: `#006e1c`

#### Граничные цвета
- **Outline Variant**: `#94a3b8` / `rgba(...)` с прозрачностью

#### Специальные цвета
- **Success**: `#06b6d4` / `#10b981` (зеленый)
- **Warning**: `#f59e0b` (оранжевый)
- **Error**: `#ef4444` (красный)

---

### 2. ТИПОГРАФИКА

#### Заголовки (Font: **Manrope**)
- **Display Large**: 96px, ExtraBold, Line-height: 96px, Letter-spacing: -4.8px
- **Display Medium**: 72px, Bold, Line-height: 72px, Letter-spacing: -3.6px
- **Headline 1**: 48px, Bold, Line-height: 56px, Letter-spacing: -2.4px
- **Headline 2**: 36px, Bold, Line-height: 40px, Letter-spacing: -0.9px
- **Headline 3**: 28px, Bold, Line-height: 32px, Letter-spacing: -0.5px
- **Headline 4**: 24px, Bold, Line-height: 28px

#### Основной текст (Font: **Inter**)
- **Body Large**: 18px, Regular, Line-height: 28px
- **Body Medium**: 16px, Regular, Line-height: 24px
- **Body Small**: 14px, Regular, Line-height: 20px
- **Label Large**: 16px, Semi Bold, Line-height: 24px
- **Label Medium**: 14px, Semi Bold, Line-height: 20px
- **Label Small**: 12px, Semi Bold, Line-height: 16px, Letter-spacing: 1.2px

---

### 3. ОТСТУПЫ И РАЗМЕРЫ

#### Основная сетка
- Горизонтальные отступы: `32px` (на десктопе), `16px` (на мобиле)
- Основной gap: `24px`, `32px`

#### Размеры кнопок
- **Large**: `py-4 px-8` (48px высота)
- **Medium**: `py-3 px-6` (44px высота)
- **Small**: `py-2 px-4` (36px высота)

#### Скругления (Border Radius)
- `rounded-lg`: 12px
- `rounded-xl`: 16px
- `rounded-2xl`: 24px
- `rounded-3xl`: 32px
- `rounded-full`: 9999px (для круглых элементов)

---

### 4. ТЕНИ И ЭФФЕКТЫ

#### Shadow System
- **Small**: `shadow-sm` - для карточек при hover
- **Medium**: `shadow-lg` - для всплывающих элементов
- **Large**: `shadow-[0px_20px_40px_rgba(0,88,188,0.1)]` - для блоков

#### Backdrop Blur
- `backdrop-blur-[6px]` - для навигации
- `backdrop-blur-[12px]` - для модальных окон

#### Opacity
- Normal text: 100%
- Secondary text: 80%
- Disabled: 50%

---

## 🏗️ АРХИТЕКТУРА СТРАНИЦ

### A. ПОЛЬЗОВАТЕЛЬСКИЕ СТРАНИЦЫ

#### 1. **ГЛАВНАЯ (Home)**
```
┌─────────────────────────────────┐
│     TopNavBar (Fixed)           │  ← Навигация + Search + Cart
├─────────────────────────────────┤
│                                 │
│      HERO SECTION               │  ← Фоновое изображение + Title + CTA
│   (870px height)                │
│                                 │
├─────────────────────────────────┤
│                                 │
│   BENTO GRID SECTION            │  ← Features (3 блока):
│   - Blue Feature Card           │     • Лабораторный контроль
│   - Large Feature Card w/ Image │     • Вторая жизнь пластика
│   - Standard Feature Card       │     • Стандарт PureLab Green
│                                 │
├─────────────────────────────────┤
│   PRODUCT GRID                  │  ← 4 товара в строку (grid-cols-4)
│   (4 columns, gap: 32px)        │     с бейджами (ECOLABEL, ORGANIC...)
│                                 │
├─────────────────────────────────┤
│                                 │
│   NEWSLETTER SECTION            │  ← Glassmorphism card с формой
│   (backdrop blur + border)      │
│                                 │
├─────────────────────────────────┤
│      FOOTER                     │  ← 4 колонки + соцсети
└─────────────────────────────────┘
```

**Компоненты:**
- `SiteHeaderNew` - топ навигация
- `HeroSection` - герой
- `FeatureCard` - карточка фичи
- `ProductCard` - карточка товара
- `NewsletterForm` - форма подписки
- `SiteFooter` - подвал

---

#### 2. **КАТАЛОГ (Catalog)**
```
┌─────────────────────────────────┐
│     TopNavBar (Fixed)           │
├─────────────────────────────────┤
│  Breadcrumbs                    │
│  Title + Description            │
├──────────────┬──────────────────┤
│   SIDEBAR    │   MAIN AREA      │
│              │                  │
│ Categories   │  Search Bar      │
│ (buttons)    │  Results Count   │
│              │  Product Grid    │
│ Sort Filter  │  (3-4 columns)   │
│ (select)     │                  │
│              │  Empty State     │
│              │  (if no results) │
├──────────────┴──────────────────┤
│      FOOTER                     │
└─────────────────────────────────┘
```

**Компоненты:**
- `SiteHeaderNew`
- `Breadcrumbs`
- `CategoriesFilter`
- `SortSelect`
- `SearchBar`
- `ProductCard` (с инфо о товаре)
- `EmptyState`

---

#### 3. **КАРТОЧКА ТОВАРА (Product Detail)**
```
┌─────────────────────────────────┐
│     TopNavBar (Fixed)           │
├─────────────────────────────────┤
│  Breadcrumbs                    │
├──────────────┬──────────────────┤
│ IMAGE        │  PRODUCT INFO    │
│ GALLERY      │                  │
│              │  Badges          │
│ - Main Img   │  Title           │
│ - Thumbs     │  Description     │
│ (4x4)        │  Rating          │
│              │  Price           │
│              │  Size Selection  │
│              │  Quantity        │
│              │  Add to Cart     │
│              │  Stock Status    │
├──────────────┴──────────────────┤
│  FULL DESCRIPTION               │
├─────────────────────────────────┤
│  FEATURES (3 cards)             │
│  - Eco                          │
│  - Safe                         │
│  - Natural                      │
├─────────────────────────────────┤
│  RELATED PRODUCTS (4)           │
├─────────────────────────────────┤
│      FOOTER                     │
└─────────────────────────────────┘
```

**Компоненты:**
- `ImageGallery` (main + thumbnails)
- `ProductInfo` (title, rating, price)
- `BadgeList` (ECOLABEL, VEGAN и т.д.)
- `SizeSelector`
- `QuantityControl`
- `AddToCartButton`
- `StockStatus`
- `FeatureCard` (3 фичи)
- `RelatedProducts` (grid 4 cols)

---

#### 4. **КОРЗИНА (Cart)**
```
┌─────────────────────────────────┐
│     TopNavBar (Fixed)           │
├─────────────────────────────────┤
│  Title "Корзина товаров"        │
├──────────────┬──────────────────┤
│              │ ORDER SUMMARY    │
│  CART ITEMS  │ (Sticky)         │
│  (column)    │                  │
│              │ Subtotal         │
│ [Item 1]     │ Shipping         │
│ [Item 2]     │ Tax              │
│ [Item 3]     │ ─────────        │
│              │ TOTAL            │
│              │ [Checkout BTN]   │
│              │ [Continue BTN]   │
│              │                  │
│              │ (или Empty State)│
├──────────────┴──────────────────┤
│      FOOTER                     │
└─────────────────────────────────┘
```

**Структура CartItem:**
```
┌─────────────────────────┐
│ [Img] Title             │
│       Price/unit        │
│       Qty: [- 1 +]      │ Delete
│                    Price│
└─────────────────────────┘
```

---

#### 5. **ОФОРМЛЕНИЕ ЗАКАЗА (Checkout)**
```
┌─────────────────────────────────┐
│     TopNavBar (Fixed)           │
├─────────────────────────────────┤
│  Steps Indicator: [1] - [2] - [3]
├──────────────┬──────────────────┤
│              │ ORDER SUMMARY    │
│  STEP FORM   │ (Sticky)         │
│              │                  │
│ Step 1:      │ Subtotal         │
│ Delivery     │ Shipping         │
│ (address)    │ Tax              │
│              │ TOTAL            │
│ Step 2:      │                  │
│ Payment      │                  │
│ (method)     │                  │
│              │                  │
│ Step 3:      │                  │
│ Confirmation │                  │
│ (review)     │                  │
│              │                  │
│ [Back] [Next]│                  │
├──────────────┴──────────────────┤
│      FOOTER                     │
└─────────────────────────────────┘
```

**Step 1 Fields:**
- First Name, Last Name
- Email, Phone
- Address, City, ZIP

**Step 2 Options:**
- Credit Card
- Yandex Kassa
- SBP

**Step 3 Review:**
- Delivery Address
- Payment Method
- Contact Info

---

#### 6. **ВХОД / РЕГИСТРАЦИЯ (Auth)**
```
┌─────────────────────────────────┐
│     TopNavBar                   │
├─────────────────────────────────┤
│                                 │
│     ┌───────────────────┐       │
│     │   PureLab Logo    │       │
│     │                   │       │
│     │ [Login] [Register]│       │
│     │                   │       │
│     │ Login Form:       │       │
│     │ Email: [____]     │       │
│     │ Pass:  [____]     │       │
│     │ [Forgot Pass?]    │       │
│     │ [Login Button]    │       │
│     │                   │       │
│     │ ─ или через ─     │       │
│     │ [Google] [Yandex] │       │
│     │                   │       │
│     │ Нет аккаунта?     │       │
│     │ [Зарегистрируйтесь]
│     └───────────────────┘       │
│                                 │
│ [← Вернуться на главную]        │
│                                 │
├─────────────────────────────────┤
│      FOOTER                     │
└─────────────────────────────────┘
```

**Register Form Fields:**
- First Name, Last Name
- Email
- Password
- Confirm Password
- Checkbox: Agree Terms
- [Create Account]

---

### B. ADMIN СТРАНИЦЫ (PureLab Admin)

#### 1. **ADMIN DASHBOARD**
```
┌─────────────────────────────────┐
│  Admin Header (Logo + User)     │
├──────────┬──────────────────────┤
│          │                      │
│ SIDEBAR  │   DASHBOARD CONTENT  │
│          │                      │
│ Overview │  ┌──────────────────┐│
│ Products │  │ Stats Cards      ││
│ Orders   │  │ - Revenue        ││
│ Users    │  │ - Orders         ││
│ Settings │  │ - Customers      ││
│          │  │ - Growth         ││
│          │  └──────────────────┘│
│          │  ┌──────────────────┐│
│          │  │ Recent Orders    ││
│          │  │ (table)          ││
│          │  └──────────────────┘│
│          │  ┌──────────────────┐│
│          │  │ Charts/Analytics ││
│          │  └──────────────────┘│
│          │                      │
└──────────┴──────────────────────┘
```

---

#### 2. **ORDERS MANAGEMENT**
```
┌─────────────────────────────────┐
│  Admin Header                   │
├──────────┬──────────────────────┤
│          │  Filters + Search    │
│ SIDEBAR  │  Status | Date | User│
│          │                      │
│          │  ┌──────────────────┐│
│          │  │ Orders Table:    ││
│          │  │ ID | Date | User ││
│          │  │ Status | Total  ││
│          │  └──────────────────┘│
│          │  Pagination          │
└──────────┴──────────────────────┘
```

---

## 📋 КОМПОНЕНТЫ БИБЛИОТЕКИ

### Buttons
```
Primary:   bg-primary text-white (Blue #0058BC)
Secondary: border border-primary text-primary
Danger:    bg-red-600 text-white
Success:   bg-green-500 text-white
Disabled:  bg-gray-300 text-gray-600
```

### Cards
```
Surface Card:        bg-white rounded-2xl/3xl p-6/8 shadow
Container Card:      bg-surface-container rounded-2xl
Elevated Card:       shadow-lg (for hover state)
Feature Card:        Large card with content sections
Product Card:        Image + Badge + Title + Price + Button
```

### Forms
```
Input:      border border-outline-variant rounded-lg px-4 py-3
            focus:border-primary focus:ring-1 focus:ring-primary
Select:     Same as input
Checkbox:   w-5 h-5 rounded border-outline-variant
Radio:      w-5 h-5 rounded-full
```

### Navigation
```
TopNavBar:       Fixed, backdrop-blur, shadow
Breadcrumbs:     Flex gap-2, text-sm
Sidebar:         Vertical nav with active state
Footer:          4 columns + social links
```

### Badges
```
Status Badge:    bg-green-400 text-green-800 px-3 py-1 rounded-full text-xs font-semibold
Error Badge:     bg-red-100 text-red-800
Success Badge:   bg-green-100 text-green-800
```

---

## 🎨 ВЗАИМОДЕЙСТВИЯ И СОСТОЯНИЯ

### Hover Effects
- Buttons: `hover:shadow-lg`, `hover:opacity-90`
- Cards: `hover:scale-105`, `hover:shadow-xl`
- Links: `hover:underline`, `hover:opacity-80`

### Active States
- Selected Filter: `bg-primary text-white`
- Active Nav: `border-b-2 border-primary text-primary`

### Loading States
- Skeleton loaders (gray animated boxes)
- Spinner icon
- Disabled state: opacity 50%

### Empty States
- Icon: `material-symbols-outlined text-8xl`
- Title: Large font
- Description: Secondary text
- CTA Button

---

## 📱 RESPONSIVE DESIGN

### Breakpoints
- Mobile: < 768px (md)
  - Single column layouts
  - 16px horizontal padding
  - Sidebar becomes drawer

- Tablet: 768px - 1024px (lg)
  - 2 column layouts
  - 24px padding

- Desktop: > 1024px
  - Full layouts
  - 32px padding
  - Multi-column grids

### Grid Configurations
```
Mobile:   grid-cols-1
Tablet:   grid-cols-2
Desktop:  grid-cols-3 / grid-cols-4
```

---

## 🎯 ИКОНОГРАФИЯ

### Icons (Material Symbols)
- `shopping_cart` - Корзина
- `add_shopping_cart` - Добавить в корзину
- `payment` - Оплата
- `local_shipping` - Доставка
- `check_circle` - Готово
- `delete` - Удалить
- `edit` - Редактировать
- `settings` - Параметры
- `person` - Профиль
- `eco` - Экология
- `water` - Вода
- `leaf` - Природа
- `arrow_forward` - Вперёд
- `arrow_back` - Назад
- `search` - Поиск
- `menu` - Меню
- `close` - Закрыть

---

## ✨ ОСОБЕННОСТИ ДИЗАЙНА

1. **Glassmorphism** - Для модальных окон и overlays
   - `backdrop-blur-[12px]`
   - `bg-white/30 border border-white/40`

2. **Gradient Overlays** - На hero sections
   - `bg-gradient-to-r from-surface via-surface/50 to-white`

3. **Mix Blend Mode** - Для изображений товаров
   - `mix-blend-multiply`

4. **Smooth Transitions** - На все интерактивные элементы
   - `transition-all duration-300`

5. **Green Accent** - Для эко-элементов
   - `bg-green-400 text-green-800`

---

## 📐 МАКЕТЫ СТРАНИЦ

### Max Width Container
- `max-w-7xl mx-auto px-8`
- Desktop: 1280px
- Tablet: 80% ширины
- Mobile: 100% - 16px padding

### Typography Hierarchy
1. Display Large (96px) - Page hero titles
2. Headline (48-36px) - Section titles
3. Body Large (18px) - Main content
4. Body Small (14px) - Secondary content
5. Label (12-14px) - Badges, captions

---

## 🎬 ANIMATIONS

- **Fade In**: `opacity-0 → opacity-100`
- **Slide In**: `translate-y-4 → translate-y-0`
- **Scale**: `scale-105` on hover
- **Color Change**: `transition-colors duration-300`
- **Duration**: 300ms default

---

**Готово к реализации! ✅**
