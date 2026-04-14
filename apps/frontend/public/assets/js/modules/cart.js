import { STRICT_BACKEND, currentPath, escapeHtml, routePath, session, showToast, api } from './core.js';

const EMPTY_CART = {
  id: null,
  currency: 'KZT',
  totals: { subtotal: 0, discount: 0, delivery: 0, total: 0 },
  items: []
};

let cartState = { ...EMPTY_CART };

function cartIdKey() {
  return `adzekCartId:${session().userKey()}`;
}

function readCartId() {
  try {
    return localStorage.getItem(cartIdKey()) || '';
  } catch (_) {
    return '';
  }
}

function writeCartId(id) {
  try {
    const key = cartIdKey();
    if (!id) localStorage.removeItem(key);
    else localStorage.setItem(key, String(id));
  } catch (_) {}
}

function emitCartUpdated() {
  window.dispatchEvent(new CustomEvent('adzek:cart-updated', { detail: cartState }));
}

function mapCartResponse(cart) {
  if (!cart || !cart.id) {
    cartState = { ...EMPTY_CART };
    emitCartUpdated();
    return cartState;
  }

  const items = (cart.items || []).map((item) => {
    const product = item.productVariant?.product || {};
    const variant = item.productVariant || {};
    return {
      id: String(item.id),
      variantId: String(variant.id || ''),
      name: String(product.name || variant.title || 'Товар'),
      subtitle: String(variant.title || ''),
      price: Number(item.unitPrice || 0),
      quantity: Math.max(1, Number(item.quantity || 1)),
      lineTotal: Number(item.lineTotal || 0),
      image: ''
    };
  });

  cartState = {
    id: String(cart.id),
    currency: cart.currency || 'KZT',
    totals: {
      subtotal: Number(cart.subtotalAmount || 0),
      discount: Number(cart.discountAmount || 0),
      delivery: Number(cart.deliveryAmount || 0),
      total: Number(cart.totalAmount || 0)
    },
    items
  };

  writeCartId(cartState.id);
  emitCartUpdated();
  return cartState;
}

async function fetchCartFromBackend() {
  if (!session().isAuthed()) {
    cartStore.clear();
    return cartState;
  }
  const cartId = readCartId();
  if (!cartId) {
    cartState = { ...EMPTY_CART };
    emitCartUpdated();
    return cartState;
  }
  try {
    const cart = await api(`/cart/${cartId}`);
    return mapCartResponse(cart);
  } catch (err) {
    if (err?.status === 404) writeCartId('');
    cartState = { ...EMPTY_CART };
    emitCartUpdated();
    return cartState;
  }
}

function parsePrice(text) {
  const n = Number(String(text || '').replace(/[^\d.,-]/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

export const cartStore = {
  read() {
    return cartState;
  },
  set(next) {
    cartState = next;
    emitCartUpdated();
  },
  clear() {
    cartState = { ...EMPTY_CART };
    writeCartId('');
    emitCartUpdated();
  },
  totals(state = cartState) {
    return state.totals || { ...EMPTY_CART.totals };
  }
};

function extractCardPayload(trigger) {
  const card = trigger.closest('[data-product-card], .product-card, article') || document;
  const titleEl = card.querySelector('[data-product-title], h3, .product-title');
  const subtitleEl = card.querySelector('[data-product-subtitle], .product-subtitle, p');
  const priceEl = card.querySelector('[data-product-price], .product-price, [class*="price"]');
  const imgEl = card.querySelector('img');

  const name = (titleEl?.textContent || trigger.getAttribute('data-product-name') || 'Товар').trim();
  const subtitle = (subtitleEl?.textContent || trigger.getAttribute('data-product-subtitle') || '').trim();
  const price = parsePrice(priceEl?.textContent || trigger.getAttribute('data-product-price') || '0');
  const image = imgEl?.getAttribute('src') || trigger.getAttribute('data-product-image') || '';
  const id = String(
    trigger.getAttribute('data-product-id') ||
    card.getAttribute('data-product-id') ||
    ''
  ).trim();

  return { id, name, subtitle, price, image, quantity: 1 };
}

async function addToBackend(payload) {
  const cartId = readCartId() || undefined;
  const body = { cartId, productVariantId: payload.id, quantity: 1 };
  const cart = await api('/cart/items', { method: 'POST', body: JSON.stringify(body) });
  return mapCartResponse(cart);
}

async function updateBackendItem(itemId, quantity) {
  const cartId = cartState.id || readCartId();
  if (!cartId) return cartState;
  const cart = await api(`/cart/items/${cartId}/${itemId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) });
  return mapCartResponse(cart);
}

async function removeBackendItem(itemId) {
  const cartId = cartState.id || readCartId();
  if (!cartId) return cartState;
  const cart = await api(`/cart/items/${cartId}/${itemId}`, { method: 'DELETE' });
  return mapCartResponse(cart);
}

export function wireAddToCart() {
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('button,[data-add-to-cart],.add-to-cart');
    if (!btn) return;

    const isExplicitAdd = btn.hasAttribute('data-add-to-cart') || btn.classList.contains('add-to-cart');
    const isAddText = (btn.textContent || '').toLowerCase().includes('в корзину') || (btn.textContent || '').toLowerCase().includes('добав');
    const inProductCard = !!btn.closest('[data-product-card], .product-card, article');
    if (!inProductCard || !(isExplicitAdd || isAddText)) return;

    e.preventDefault();

    const payload = extractCardPayload(btn);
    try {
      await addToBackend(payload);
      showToast('Товар добавлен в корзину', 'success');
    } catch (err) {
      showToast(err.message || 'Ошибка при добавлении товара', 'error');
    }
  });
}

export function renderCartPage() {
  if (currentPath() !== '/cart') return;
  const list = document.querySelector('[data-cart-items], #cartItems');
  const summary = document.querySelector('[data-cart-summary], #cartSummary');
  if (!list || !summary) return;

  const draw = () => {
    const state = cartStore.read();
    const totals = cartStore.totals(state);

    if (!state.items.length) {
      list.innerHTML = `<div class="bg-white rounded-xl p-10 text-center"><h3 class="text-2xl font-headline font-bold mb-3">Корзина пуста</h3><p class="text-on-surface-variant mb-6">Добавьте товары из каталога, чтобы оформить заказ</p><a href="${routePath('/catalog')}" class="inline-flex px-6 py-3 bg-primary text-white rounded-xl font-semibold">Перейти в каталог</a></div>`;
    } else {
      list.innerHTML = state.items.map(cartItemTemplate).join('');
    }
    summary.innerHTML = renderSummary(totals);
  };

  list.addEventListener('click', async (e) => {
    const inc = e.target.closest('[data-cart-inc]');
    const dec = e.target.closest('[data-cart-dec]');
    const rem = e.target.closest('[data-cart-remove]');
    if (!inc && !dec && !rem) return;
    const id = (inc || dec || rem).dataset.cartInc || (inc || dec || rem).dataset.cartDec || (inc || dec || rem).dataset.cartRemove;
    const item = cartStore.read().items.find((x) => x.id === id);
    if (!item) return;

    try {
      if (inc) await updateBackendItem(id, item.quantity + 1);
      if (dec) await updateBackendItem(id, item.quantity - 1);
      if (rem) await removeBackendItem(id);
      draw();
    } catch (err) {
      showToast(err.message || 'Не удалось обновить корзину', 'error');
    }
  });

  (async () => {
    if (STRICT_BACKEND) await fetchCartFromBackend();
    draw();
  })();
}

function readCheckoutPayload() {
  const pick = (selector) => document.querySelector(selector)?.value?.trim() || '';
  const firstName = pick('[name="firstName"]');
  const lastName = pick('[name="lastName"]');
  const email = pick('[name="email"]');
  const phone = pick('[name="phone"]');
  const city = pick('[name="city"]');
  const address = pick('[name="address"]');
  const deliveryMethod = pick('[name="deliveryMethod"]') || 'city';
  const paymentMethod = pick('[name="paymentMethod"]') || 'card_online';
  const comment = pick('[name="comment"]');

  return {
    customerName: `${firstName} ${lastName}`.trim() || firstName || lastName,
    customerEmail: email,
    customerPhone: phone,
    deliveryCity: city,
    deliveryAddress: address,
    deliveryMethod,
    paymentMethod,
    comment
  };
}

export function wireCheckout() {
  if (currentPath() !== '/checkout') return;
  const btn = document.querySelector('[data-checkout-submit], #checkoutSubmit, button[type="submit"]');
  if (!btn) return;

  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    const state = cartStore.read();
    if (!state.id || !state.items.length) {
      showToast('Корзина пуста', 'error');
      return;
    }

    const payload = readCheckoutPayload();
    if (!payload.customerName || !payload.customerEmail || !payload.customerPhone || !payload.deliveryAddress) {
      showToast('Заполните контактные данные и адрес', 'error');
      return;
    }

    try {
      await api('/checkout/confirm', { method: 'POST', body: JSON.stringify({ cartId: state.id, ...payload }) });
      cartStore.clear();
      window.location.href = routePath('/order-confirmed');
    } catch (err) {
      showToast(err.message || 'Не удалось оформить заказ', 'error');
    }
  });
}

export async function ensureCartLoaded() {
  if (!STRICT_BACKEND) return cartStore.read();
  if (!session().isAuthed()) {
    cartStore.clear();
    return cartStore.read();
  }
  return fetchCartFromBackend();
}

