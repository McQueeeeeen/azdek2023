# AZDEK E-COMMERCE - ПОЛНАЯ СПЕЦИФИКАЦИЯ ДИЗАЙНА

**Figma файл:** https://www.figma.com/design/O3zOkRltQTNBQoB8Kxnpxd

---

## 1. ЦВЕТОВАЯ ПАЛИТРА

### Первичные цвета
- **Primary Blue**: `#0058BC` - для кнопок, ссылок, основной CTA
- **Secondary Green**: `#91f78e` - для акцентов, бэйджей "эко"

### Нейтральные цвета  
- **White**: `#FFFFFF` - фон карточек, основной фон
- **Light Gray**: `#F5F5F5` - вторичный фон, hover состояния
- **Medium Gray**: `#CCCCCC` - borders, dividers
- **Dark Gray**: `#666666` - вспомогательный текст
- **Black**: `#1A1A1A` - основной текст

### Статусные цвета
- **Success Green**: `#27AE60` - статус успеха, доставлено
- **Warning Orange**: `#F39C12` - внимание, ограниченное количество
- **Error Red**: `#E74C3C` - ошибки, отмены
- **Info Blue**: `#3498DB` - информационные сообщения

---

## 2. ТИПОГРАФИЯ

### Шрифты
- **Headings**: Manrope (700, 600 weight)
- **Body**: Inter (400, 500, 600 weight)
- **Icons**: Material Symbols Outlined

### Размеры текста
```
H1: 48px / 600 weight / line-height 1.2
H2: 36px / 600 weight / line-height 1.2
H3: 28px / 600 weight / line-height 1.3
H4: 24px / 600 weight / line-height 1.3

Body Large: 18px / 400 weight / line-height 1.6
Body: 16px / 400 weight / line-height 1.6
Body Small: 14px / 400 weight / line-height 1.5
Caption: 12px / 400 weight / line-height 1.4
```

---

## 3. КОМПОНЕНТЫ

### 3.1 Кнопки

#### Primary Button
- **Background**: Primary Blue (#0058BC)
- **Text Color**: White (#FFFFFF)
- **Padding**: 12px 24px
- **Border Radius**: 8px
- **Font**: 16px / 600 weight
- **States**:
  - Normal: Blue background
  - Hover: Darker blue, subtle shadow
  - Active: Even darker, pressed effect
  - Disabled: Opacity 50%

#### Secondary Button
- **Background**: Light Gray (#F5F5F5)
- **Text Color**: Dark Gray (#1A1A1A)
- **Padding**: 12px 24px
- **Border Radius**: 8px
- **Border**: 1px solid Medium Gray

#### Ghost Button
- **Background**: Transparent
- **Text Color**: Primary Blue
- **Border**: 2px solid Primary Blue
- **Hover**: Light background

### 3.2 Input Fields

- **Height**: 44px
- **Padding**: 12px 16px
- **Border**: 1px solid Medium Gray
- **Border Radius**: 8px
- **Font Size**: 16px
- **Focus State**: Blue border, subtle blue glow
- **Error State**: Red border, red text

### 3.3 Карточки

#### Product Card
- **Width**: 280px (responsive)
- **Background**: White
- **Border**: 1px solid Medium Gray
- **Border Radius**: 12px
- **Padding**: 16px
- **Spacing**: 12px between elements
- **Structure**:
  - Image area: 248×200px
  - Product name: 16px / 600 weight
  - Price: 18px / 700 weight / Blue color
  - Badge (optional): "В наличии", "Акция", "Эко"
  - Add to cart button

#### Info Card
- **Padding**: 20px
- **Border Radius**: 12px
- **Background**: Light Gray or with colored left border (4px)
- **Used for**: Features, benefits, notifications

### 3.4 Badges / Tags

- **Padding**: 6px 12px
- **Border Radius**: 16px
- **Font Size**: 12px / 600 weight
- **Types**:
  - Green ("В наличии"): Green background, dark text
  - Orange ("Акция"): Orange background, white text
  - Blue ("Новинка"): Blue background, white text
  - Gray ("Эко"): Green background, dark text

### 3.5 Навигация

#### Header
- **Height**: 72px
- **Background**: White with backdrop blur
- **Position**: Fixed/Sticky
- **Spacing**: 24px horizontal padding
- **Elements**:
  - Logo: 32px height
  - Nav links: 14px text, centered vertically
  - Search bar: 40px height, 300px width
  - Cart icon with badge
  - Profile icon

#### Footer
- **Background**: Dark Gray (#2C3E50) or Light Gray
- **Padding**: 40px horizontal, 60px vertical
- **Layout**: 4-column grid
- **Font Size**: 14px
- **Link color**: Medium Gray (hover: Primary Blue)

### 3.6 Модальные окна & Диалоги

- **Overlay**: Black with 40% opacity
- **Modal background**: White
- **Padding**: 32px
- **Border Radius**: 16px
- **Shadow**: Deep shadow effect
- **Close button**: Minimal, top-right corner

---

## 4. LAYOUT & SPACING

### Grid System
- **Max Width**: 1440px
- **Columns**: 12-column grid
- **Gutter**: 24px
- **Padding**: 40px sides (desktop), 20px (tablet), 16px (mobile)

### Spacing Scale
```
4px   - xs
8px   - sm
12px  - md
16px  - lg
24px  - xl
32px  - 2xl
48px  - 3xl
64px  - 4xl
```

### Common Spacing
- **Between sections**: 80px
- **Between card rows**: 24px
- **Between card columns**: 16px
- **Inside cards**: 16px

---

## 5. СТРАНИЦЫ И МАКЕТЫ

### 5.1 HOME PAGE
```
1. Hero Section (60vh)
   - Background: Gradient or pattern
   - Headline: H1 (max 2 lines)
   - Subheadline: Body Large
   - 2 CTAs: Primary + Secondary buttons
   - Hero Image: Right side (50% width)

2. Features Section (3 columns)
   - Icon + Title + Description
   - Each card: 240×200px area

3. Product Showcase (4 columns)
   - Product cards grid
   - "View Catalog" button

4. Newsletter Section
   - Input field + Subscribe button
   - Background: Light gradient
```

### 5.2 CATALOG PAGE
```
Layout: Sidebar + Grid

Left Sidebar:
- Filters panel (sticky, 280px width)
- Filter blocks with checkboxes
- Price range slider

Main Content:
- Toolbar: Sort dropdown + View toggle
- Product grid: 3 columns (desktop), 2 (tablet), 1 (mobile)
- Pagination at bottom
```

### 5.3 PRODUCT DETAIL PAGE
```
Layout: 2 columns

Left (55%):
- Main product image (large)
- Thumbnail gallery below
- Image zoom on hover

Right (45%):
- Product name: H2
- Rating + reviews count
- Price: Large text, primary blue
- Description: Body text
- Size selector: Button group
- Quantity: Input with +/- buttons
- Add to cart: Primary button (full width)
- Add to wishlist: Secondary button (full width)
- Specs: List with checkmarks
- Related products: Carousel at bottom
```

### 5.4 CART PAGE
```
Layout: 2 columns + sidebar

Main (70%):
- Cart items list
- Each item: Image + Name + Price + Qty control + Delete

Right Sidebar (30%, sticky):
- Order summary
- Subtotal
- Shipping cost
- Tax
- Total: Large, primary blue
- Checkout button
- Continue shopping link
```

### 5.5 CHECKOUT PAGE
```
Multi-step form:

Step 1: Delivery Address
- Form fields in 2-column grid
- Countries: Dropdown
- Address type: Radio buttons

Step 2: Payment Method
- Radio buttons for payment options
- Card details (if applicable)

Step 3: Order Review
- Summary of all info
- Confirm button (green/success color)
- Back button

Progress indicator: 3 numbered circles with connecting line
```

### 5.6 USER PROFILE PAGE
```
Layout: Sidebar navigation + Main content

Left Sidebar (20%):
- Account menu items
- Logout button (red)

Main Content (80%):
- Tabs or accordion
- Account info section
- Edit button
- Change password button
- Preferences: Checkboxes
- Save button
```

### 5.7 ORDERS PAGE
```
Layout: Full width

Top: Filter buttons
- All orders
- Processing
- Shipped
- Delivered
- Cancelled

Content: Card-based list
- Each order: Order ID + Date + Status badge + Total + Details button
```

### 5.8 ADDRESSES PAGE
```
Layout: Full width

Header: "New Address" button (primary)

Address Cards Grid:
- Address type badge
- "Default" badge (if applicable)
- Full address text
- Action buttons: Edit, Set as Default, Delete
```

---

## 6. ОСОБЕННОСТИ И СТИЛИ

### Анимации & Переходы
- **Button hover**: 150ms ease
- **Card hover**: Slight scale (1.02) + shadow
- **Page transition**: 300ms fade
- **Dropdown**: Smooth expand/collapse (200ms)

### Hover & Active States
- **Links**: Color change + underline (optional)
- **Buttons**: Darker color + shadow
- **Cards**: Scale up + shadow
- **Form inputs**: Blue border + glow

### Loading States
- **Skeleton loaders**: Light gray animated gradient
- **Loading button**: Text → Spinner animation

### Empty States
- **Icon**: Large, light gray (64px)
- **Heading**: H3
- **Description**: Body Small
- **CTA Button**: Primary or Secondary

### Error States
- **Border**: Red (#E74C3C)
- **Text**: Red below field
- **Icon**: Error icon or indicator
- **Toast**: Red background, white text

---

## 7. MOBILE OPTIMIZATION

### Breakpoints
```
Mobile: 320px - 640px
Tablet: 641px - 1024px  
Desktop: 1025px+
```

### Mobile-specific:
- **Font sizes**: Slightly smaller (16px body → 14px on mobile)
- **Spacing**: Reduced (24px → 16px)
- **Buttons**: Full width on mobile
- **Grid**: 1 column on mobile, 2 on tablet
- **Bottom nav**: Fixed navigation bar (56px height)
- **Hero**: Full width, centered text
- **Modals**: Full screen on mobile

---

## 8. DARK MODE (OPTIONAL FUTURE)

If implementing dark mode:
- **Background**: #1A1A1A
- **Card background**: #2C3E50
- **Text**: #F5F5F5
- **Borders**: #444444
- **Primary blue**: Slightly lighter (#0072E6)

---

## 9. ACCESSIBILITY

### Requirements
- **Color contrast**: Minimum WCAG AA (4.5:1 for text)
- **Button minimum size**: 44×44px
- **Focus states**: Clear, visible indicators
- **ARIA labels**: For icons and interactive elements
- **Keyboard navigation**: Fully supported
- **Alt text**: For all images

---

## 10. DESIGN TOKENS (CSS VARIABLES)

```css
--primary-blue: #0058BC;
--secondary-green: #91f78e;
--white: #FFFFFF;
--light-gray: #F5F5F5;
--medium-gray: #CCCCCC;
--dark-gray: #666666;
--black: #1A1A1A;

--success: #27AE60;
--warning: #F39C12;
--error: #E74C3C;
--info: #3498DB;

--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;

--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;
--spacing-2xl: 32px;

--shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
--shadow-md: 0 4px 12px rgba(0,0,0,0.12);
--shadow-lg: 0 8px 24px rgba(0,0,0,0.16);

--font-body: "Inter", sans-serif;
--font-heading: "Manrope", sans-serif;
```

---

## 11. ВНЕДРЕНИЕ В КОД

### Структура компонентов
```
components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   └── Modal.tsx
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
└── features/
    ├── ProductCard.tsx
    ├── OrderCard.tsx
    └── AddressCard.tsx
```

### Пример использования:
```jsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Add to Cart
</Button>

<Card>
  <ProductImage src={image} />
  <ProductName>{name}</ProductName>
  <Price>${price}</Price>
  <Badge type="eco">Эко-товар</Badge>
</Card>

<Input 
  type="email" 
  placeholder="Enter email"
  state="default|focus|error"
/>
```

---

**СТАТУС**: Спецификация готова к реализации в Figma и коде
**ДАТА**: 2026-04-22
**ВЕРСИЯ**: 1.0

