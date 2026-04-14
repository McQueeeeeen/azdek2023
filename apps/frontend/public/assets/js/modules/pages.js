import { currentPath, routePath, escapeHtml, api, showToast } from './core.js';

const PLACEHOLDER_IMG = '/icon.svg';

const formatPrice = (value) => `${Number(value || 0).toLocaleString('ru-KZ')} ₸`;

function productCardTemplate({ product, variant }) {
  const price = Number(variant.price || 0);
  const category = product.category?.name || 'Категория';
  const eco = (product.category?.slug || '').toLowerCase().includes('eco');
  const inStock = (variant.stock ?? 0) > 0;
  const categories = [product.category?.slug || 'general'].join(',');

  return `
    <div class="group flex flex-col product-card" data-product-card data-product-id="${escapeHtml(variant.id)}" data-product-slug="${escapeHtml(product.slug)}" data-price="${price}" data-categories="${escapeHtml(categories)}" data-in-stock="${inStock}" data-eco="${eco}">
      <div class="relative aspect-[4/5] rounded-xxl bg-surface-container-low overflow-hidden mb-4">
        <img alt="${escapeHtml(product.name)}" class="w-full h-full object-cover" src="${PLACEHOLDER_IMG}" />
        <div class="absolute top-4 left-4">
          <span class="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">${escapeHtml(category)}</span>
        </div>
      </div>
      <div class="space-y-1">
        <h3 class="text-on-surface font-bold leading-tight" data-product-title>${escapeHtml(product.name)}</h3>
        <p class="text-on-surface-variant text-sm" data-product-subtitle>${escapeHtml(variant.title || '')}</p>
        <div class="flex items-center justify-between pt-3 mt-auto">
          <span class="text-lg font-extrabold text-on-surface" data-product-price>${formatPrice(price)}</span>
          <button data-add-to-cart class="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-primary-container transition-all active:scale-95 shadow-md shadow-primary/20">
            <span class="material-symbols-outlined text-base">shopping_cart</span>
            В корзину
          </button>
        </div>
      </div>
    </div>`;
}

async function loadCatalogProducts() {
  return api('/catalog/products');
}

export async function hydrateCatalogFromBackend() {
  if (currentPath() !== '/catalog') return;
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  grid.innerHTML = '<div class="col-span-full text-on-surface-variant">Загрузка каталога...</div>';

  try {
    const products = await loadCatalogProducts();
    if (!products?.length) {
      grid.innerHTML = '<div class="col-span-full text-on-surface-variant">Товары не найдены.</div>';
      return;
    }
    const cards = products
      .map((product) => {
        const variant = product.variants?.[0];
        if (!variant) return '';
        return productCardTemplate({ product, variant });
      })
      .filter(Boolean)
      .join('');

    grid.innerHTML = cards || '<div class="col-span-full text-on-surface-variant">Товары не найдены.</div>';
  } catch (err) {
    grid.innerHTML = '<div class="col-span-full text-rose-600">Не удалось загрузить каталог.</div>';
    showToast(err.message || 'Не удалось загрузить каталог', 'error');
  }
}

export async function hydrateHomeFeatured() {
  if (currentPath() !== '/') return;
  const grid = document.getElementById('homeProductGrid');
  if (!grid) return;

  grid.innerHTML = '<div class="col-span-full text-on-surface-variant">Загрузка товаров...</div>';

  try {
    const products = await loadCatalogProducts();
    if (!products?.length) {
      grid.innerHTML = '<div class="col-span-full text-on-surface-variant">Товары не найдены.</div>';
      return;
    }
    const cards = products.slice(0, 4)
      .map((product) => {
        const variant = product.variants?.[0];
        if (!variant) return '';
        return productCardTemplate({ product, variant });
      })
      .filter(Boolean)
      .join('');

    grid.innerHTML = cards || '<div class="col-span-full text-on-surface-variant">Товары не найдены.</div>';
  } catch (err) {
    grid.innerHTML = '<div class="col-span-full text-rose-600">Не удалось загрузить товары.</div>';
    showToast(err.message || 'Не удалось загрузить товары', 'error');
  }
}

export async function hydrateProductPage() {
  if (currentPath() !== '/product') return;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  if (!slug) return;

  try {
    const product = await api(`/catalog/products/${encodeURIComponent(slug)}`);
    const variant = product?.variants?.[0];
    if (!product || !variant) return;

    const titleEl = document.querySelector('[data-product-title]');
    const subtitleEl = document.querySelector('[data-product-subtitle]');
    const priceEl = document.querySelector('[data-product-price]');
    const card = document.querySelector('[data-product-card]');

    if (titleEl) titleEl.textContent = product.name;
    if (subtitleEl) subtitleEl.textContent = variant.title || product.description || '';
    if (priceEl) priceEl.textContent = formatPrice(variant.price);
    if (card) card.setAttribute('data-product-id', variant.id);

    const crumbs = document.querySelector('[data-product-crumb]');
    if (crumbs) crumbs.textContent = product.name;

    document.querySelectorAll('[data-product-image] img, .product-image, .product-gallery img').forEach((img) => {
      img.src = PLACEHOLDER_IMG;
    });
  } catch (err) {
    showToast(err.message || 'Не удалось загрузить товар', 'error');
  }
}

export function wireCatalogFilters() {
  if (currentPath() !== '/catalog') return;
  const cards = Array.from(document.querySelectorAll('.product-card'));
  if (!cards.length) return;

  const categoryInputs = Array.from(document.querySelectorAll('[data-filter-category]'));
  const productGrid = document.getElementById('productGrid');
  const sortSelect = document.getElementById('sortSelect');
  const priceRange = document.getElementById('priceRange');
  const priceMaxLabel = document.getElementById('priceMaxLabel');
  const inStockOnly = document.getElementById('inStockOnly');
  const countEl = document.getElementById('catalogCount');
  const emptyEl = document.getElementById('catalogEmpty');

  const plural = (n) => {
    if (n % 10 === 1 && n % 100 !== 11) return 'товар';
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'товара';
    return 'товаров';
  };

  const apply = () => {
    const active = categoryInputs.filter((x) => x.checked).map((x) => x.getAttribute('data-filter-category'));
    const maxPrice = Number(priceRange?.value || 5000);
    const stockOnly = !!inStockOnly?.checked;
    let visible = 0;

    if (priceMaxLabel) priceMaxLabel.textContent = formatPrice(maxPrice);

    const sortMode = sortSelect?.value || 'popular';
    const ordered = cards.slice().sort((a, b) => {
      const pa = Number(a.getAttribute('data-price') || 0);
      const pb = Number(b.getAttribute('data-price') || 0);
      if (sortMode === 'cheap') return pa - pb;
      if (sortMode === 'expensive') return pb - pa;
      return 0;
    });

    if (productGrid) ordered.forEach((c) => productGrid.appendChild(c));

    ordered.forEach((card) => {
      const price = Number(card.getAttribute('data-price') || 0);
      const inStock = card.getAttribute('data-in-stock') === 'true';
      const isEco = card.getAttribute('data-eco') === 'true';
      const cats = (card.getAttribute('data-categories') || '').split(',').map((x) => x.trim()).filter(Boolean);
      const categoryPass = !active.length || active.some((cat) => (cat === 'eco' ? isEco : cats.includes(cat)));
      const pass = categoryPass && price <= maxPrice && (!stockOnly || inStock);
      card.style.display = pass ? '' : 'none';
      if (pass) visible += 1;
    });

    if (countEl) countEl.textContent = `Найдено ${visible} ${plural(visible)}`;
    if (emptyEl) emptyEl.classList.toggle('hidden', visible > 0);
  };

  categoryInputs.forEach((x) => x.addEventListener('change', apply));
  priceRange?.addEventListener('input', apply);
  inStockOnly?.addEventListener('change', apply);
  sortSelect?.addEventListener('change', apply);
  apply();
}

export function wireCatalogRouting() {
  if (currentPath() !== '/catalog') return;
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  grid.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    const card = e.target.closest('.product-card');
    if (!card) return;
    if (!e.target.closest('img,h3,[data-open-product]')) return;
    const slug = card.getAttribute('data-product-slug');
    if (!slug) return;
    window.location.href = `${routePath('/product')}?slug=${encodeURIComponent(slug)}`;
  });
}

export function wireOrderConfirmedInteractions() {
  if (currentPath() !== '/order-confirmed') return;
  const toggleBtn = document.getElementById('toggleItems');
  const panel = document.getElementById('itemsPanel');
  const chevron = document.getElementById('itemsChevron');
  if (!toggleBtn || !panel || !chevron) return;

  toggleBtn.addEventListener('click', () => {
    const hidden = panel.classList.toggle('hidden');
    chevron.style.transform = hidden ? 'rotate(-180deg)' : 'rotate(0deg)';
  });
}

