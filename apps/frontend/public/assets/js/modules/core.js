export const IS_LOCAL_DEV = ['localhost', '127.0.0.1'].includes(window.location.hostname);
export const STRICT_BACKEND = true;

export const ROUTE_MAP = {
  '/': '/index.html',
  '/index': '/index.html',
  '/catalog': '/catalog.html',
  '/product': '/product.html',
  '/cart': '/cart.html',
  '/checkout': '/checkout.html',
  '/order-confirmed': '/order-confirmed.html',
  '/account': '/account.html',
  '/account/orders': '/orders.html',
  '/account/addresses': '/addresses.html',
  '/account/loyalty': '/loyalty.html',
  '/account/notifications': '/notifications.html',
  '/orders': '/orders.html',
  '/addresses': '/addresses.html',
  '/loyalty': '/loyalty.html',
  '/notifications': '/notifications.html',
  '/login': '/login.html',
  '/register': '/register.html',
  '/admin': '/admin.html',
  '/terms': '/terms.html',
  '/privacy': '/privacy.html',
  '/404': '/404.html'
};

export const PROTECTED_ROUTES = [
  '/account', '/account/orders', '/account/addresses', '/account/loyalty', '/account/notifications',
  '/admin'
];

export const API_BASE = (() => {
  try {
    const override = localStorage.getItem('adzekApiBase');
    if (override && override.trim()) return override.trim().replace(/\/$/, '');
  } catch (_) {}
  const meta = document.querySelector('meta[name="adzek-api-base"]')?.getAttribute('content');
  if (meta && meta.trim()) return meta.trim().replace(/\/$/, '');
  const global = window.__ADZEK_API_BASE__;
  if (global && typeof global === 'string' && global.trim()) return global.trim().replace(/\/$/, '');
  return '/v1';
})();

export function ready(cb) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cb, { once: true });
    return;
  }
  cb();
}

export function toPrettyPath(pathname) {
  if (!pathname) return '/';
  let p = pathname.toLowerCase();
  if (p.endsWith('.html')) p = p.replace(/\.html$/, '');
  if (p === '/index' || p === '') p = '/';
  return p;
}

export function currentPath() {
  return toPrettyPath(window.location.pathname);
}

export function routePath(prettyPath) {
  const clean = toPrettyPath(prettyPath);
  if (IS_LOCAL_DEV) return ROUTE_MAP[clean] || `${clean}.html`;
  return clean;
}

export function normalizeHref(href) {
  if (!href) return href;
  if (/^(mailto:|tel:|javascript:|#)/i.test(href)) return href;
  try {
    const url = new URL(href, window.location.origin + window.location.pathname);
    if (url.origin !== window.location.origin) return href;
    const pretty = toPrettyPath(url.pathname);
    const target = routePath(pretty);
    return `${target}${url.search}${url.hash}`;
  } catch (_) {
    return href;
  }
}

export function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getOrCreateGuestId() {
  try {
    let guestId = localStorage.getItem('adzek_guest_id');
    if (!guestId) {
      guestId = generateUUID();
      localStorage.setItem('adzek_guest_id', guestId);
    }
    return guestId;
  } catch (_) {
    return generateUUID();
  }
}

export function showToast(message, type = 'info') {
  const id = 'adzek-toast-root';
  let root = document.getElementById(id);
  if (!root) {
    root = document.createElement('div');
    root.id = id;
    root.className = 'fixed top-24 right-6 z-[120] flex flex-col gap-3';
    document.body.appendChild(root);
  }
  const item = document.createElement('div');
  const style = {
    info: 'bg-slate-900 text-white',
    success: 'bg-emerald-600 text-white',
    error: 'bg-rose-600 text-white'
  }[type] || 'bg-slate-900 text-white';
  item.className = `${style} px-4 py-3 rounded-lg shadow-xl text-sm font-medium translate-x-2 opacity-0 transition-all duration-200`;
  item.textContent = message;
  root.appendChild(item);
  requestAnimationFrame(() => {
    item.classList.remove('translate-x-2', 'opacity-0');
  });
  setTimeout(() => {
    item.classList.add('translate-x-2', 'opacity-0');
    setTimeout(() => item.remove(), 220);
  }, 2600);
}

export function session() {
  const readUser = () => {
    try {
      return JSON.parse(localStorage.getItem('azdek_user') || 'null');
    } catch (_) {
      return null;
    }
  };

  return {
    accessToken: (() => {
      try { return localStorage.getItem('azdek_access_token') || null; } catch (_) { return null; }
    })(),
    refreshToken: (() => {
      try { return localStorage.getItem('azdek_refresh_token') || null; } catch (_) { return null; }
    })(),
    user: readUser(),
    isAuthed() {
      try {
        return !!localStorage.getItem('azdek_access_token');
      } catch (_) {
        return false;
      }
    },
    role() {
      try {
        return (localStorage.getItem('azdek_user_role') || (readUser()?.role ?? 'customer')).toLowerCase();
      } catch (_) {
        return 'customer';
      }
    },
    userKey() {
      const user = readUser();
      if (user?.id) return `id:${user.id}`;
      if (user?.email) return `email:${user.email.toLowerCase()}`;
      return `guest:${getOrCreateGuestId()}`;
    },
    setFromAuthPayload(payload) {
      const user = payload?.user || null;
      localStorage.setItem('azdek_access_token', payload?.accessToken || '');
      localStorage.setItem('azdek_refresh_token', payload?.refreshToken || '');
      localStorage.setItem('azdek_user', JSON.stringify(user));
      localStorage.setItem('azdek_user_role', (user?.role || 'customer').toLowerCase());
    },
    clear() {
      const keys = ['azdek_access_token', 'azdek_refresh_token', 'azdek_user', 'azdek_user_role'];
      keys.forEach((k) => localStorage.removeItem(k));
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('adzekCartId:') || k.startsWith('adzekCart:') || k.startsWith('adzekProfile:') || k.startsWith('adzekNotifications:')) {
          localStorage.removeItem(k);
        }
      });
    }
  };
}

export async function api(path, opts = {}) {
  const s = session();
  const headers = { ...(opts.headers || {}) };
  if (s.accessToken) {
    headers.Authorization = `Bearer ${s.accessToken}`;
  } else {
    const guestId = getOrCreateGuestId();
    headers['X-Guest-ID'] = guestId;
  }
  if (!headers['Content-Type'] && opts.method && opts.method !== 'GET') headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (!res.ok) {
    let details = '';
    try {
      const body = await res.json();
      details = body?.message || body?.error || '';
    } catch (_) {}
    const err = new Error(details || `${res.status} ${res.statusText}`);
    err.status = res.status;
    throw err;
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
}

export function ensureNoBodyTransformForSticky() {
  const body = document.body;
  if (!body) return;
  body.style.removeProperty('transform');
  body.style.removeProperty('will-change');
}

