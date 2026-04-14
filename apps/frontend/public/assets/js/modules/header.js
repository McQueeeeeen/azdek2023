import { currentPath, normalizeHref, routePath } from './core.js';

const AUTH_PATHS = new Set(['/login', '/register']);
const STYLE_ID = 'adzek-header-style';

function ensureHeaderStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .top-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 50; transition: background-color 250ms ease, box-shadow 250ms ease, height 250ms ease; }
    .top-nav.is-scrolled { background-color: rgba(255,255,255,.92); box-shadow: 0 12px 30px rgba(0,88,188,.12); height: 4.25rem; }
  `;
  document.head.appendChild(style);
}

export function buildHeader() {
  const active = currentPath();
  const isActive = (path) => (active === path ? 'text-blue-700 border-b-2 border-blue-600 pb-1' : 'text-slate-600 hover:text-blue-500');

  const nav = document.createElement('nav');
  nav.id = 'topNav';
  nav.className = 'top-nav bg-white/70 backdrop-blur-md shadow-[0_20px_40px_rgba(0,88,188,0.06)] h-20';
  nav.innerHTML = `
    <div class="flex justify-between items-center px-8 h-full max-w-7xl mx-auto">
      <a href="${routePath('/')}" class="text-2xl font-black text-blue-700 tracking-tighter">Adzek</a>
      <div class="hidden md:flex gap-8 items-center">
        <a class="font-manrope tracking-tight font-semibold ${isActive('/catalog')}" href="${routePath('/catalog')}">Каталог</a>
        <a class="font-manrope tracking-tight font-semibold text-slate-600 hover:text-blue-500" href="${routePath('/')}#eco">Эко-линейка</a>
        <a class="font-manrope tracking-tight font-semibold text-slate-600 hover:text-blue-500" href="${routePath('/')}#about">О бренде</a>
        <a class="font-manrope tracking-tight font-semibold text-slate-600 hover:text-blue-500" href="${routePath('/')}#delivery">Доставка</a>
      </div>
      <div class="flex items-center gap-5">
        <a class="inline-flex text-blue-700 hover:scale-110 transition-transform" href="${routePath('/cart')}" aria-label="Корзина">
          <span class="material-symbols-outlined">shopping_cart</span>
        </a>
        <a class="inline-flex text-blue-700 hover:scale-110 transition-transform" href="${routePath('/account')}" aria-label="Аккаунт">
          <span class="material-symbols-outlined">person</span>
        </a>
      </div>
    </div>`;
  return nav;
}

export function ensureGlobalHeader() {
  if (AUTH_PATHS.has(currentPath())) return;
  ensureHeaderStyles();

  const existing = document.getElementById('topNav');
  if (!existing) {
    document.body.insertBefore(buildHeader(), document.body.firstChild);
    return;
  }

  existing.classList.add('top-nav');

  const here = currentPath();
  existing.querySelectorAll('a[href]').forEach((a) => {
    const href = normalizeHref(a.getAttribute('href'));
    if (href) a.setAttribute('href', href);
    const p = new URL(a.href, window.location.origin).pathname.toLowerCase();
    const isCatalog = p.endsWith('/catalog') || p.endsWith('/catalog.html');
    if (isCatalog) {
      a.classList.remove('text-slate-600');
      if (here === '/catalog') {
        a.classList.add('text-blue-700', 'border-b-2', 'border-blue-600', 'pb-1');
      } else {
        a.classList.remove('text-blue-700', 'border-b-2', 'border-blue-600', 'pb-1');
        a.classList.add('text-slate-600');
      }
    }
  });
}

export function decorateHeader({ getCartCount } = {}) {
  const nav = document.getElementById('topNav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const cartLink = nav.querySelector('a[aria-label="Корзина"]');
  if (cartLink && typeof getCartCount === 'function') {
    let badge = cartLink.querySelector('[data-cart-badge]');
    if (!badge) {
      badge = document.createElement('span');
      badge.dataset.cartBadge = '1';
      badge.className = 'absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-primary text-white text-[10px] leading-4 text-center hidden';
      cartLink.classList.add('relative');
      cartLink.appendChild(badge);
    }

    const refresh = () => {
      const count = Number(getCartCount() || 0);
      badge.textContent = String(count);
      badge.classList.toggle('hidden', count <= 0);
    };

    refresh();
    window.addEventListener('adzek:cart-updated', refresh);
  }
}

export function wireRoutes() {
  document.querySelectorAll('a[href]').forEach((a) => {
    a.setAttribute('href', normalizeHref(a.getAttribute('href')));
  });

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    a.setAttribute('href', normalizeHref(a.getAttribute('href')));
  }, true);
}

