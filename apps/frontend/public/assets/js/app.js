(function () {
  var API_BASE_URL = '/v1', PRODUCTS_PER_PAGE = 12, PRODUCTS_ON_HOMEPAGE = 6;
  var catalogState = { currentPage: 1, allProducts: [], filteredProducts: [] };

  function ready(fn) {
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();
  }

  function safeText(text) {
    return String(text || '').trim();
  }

  function showToast(message, type) {
    var existing = document.getElementById('adzekToast');
    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'adzekToast';
      existing.className = 'fixed top-6 right-6 z-[9999] max-w-xs rounded-xl px-4 py-3 text-sm font-semibold shadow-lg opacity-0 translate-y-[-6px] transition-all duration-200';
      document.body.appendChild(existing);
    }
    var color = type === 'error' ? 'bg-rose-100 text-rose-800' : type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-900 text-white';
    existing.className = 'fixed top-6 right-6 z-[9999] max-w-xs rounded-xl px-4 py-3 text-sm font-semibold shadow-lg opacity-0 translate-y-[-6px] transition-all duration-200 ' + color;
    existing.textContent = message;
    requestAnimationFrame(function () {
      existing.style.opacity = '1';
      existing.style.transform = 'translateY(0)';
    });
    setTimeout(function () {
      existing.style.opacity = '0';
      existing.style.transform = 'translateY(-6px)';
    }, 1800);
  }

  function formatPrice(num) {
    try {
      return Number(num).toLocaleString('ru-KZ') + ' ₸';
    } catch (e) {
      return num + ' ₸';
    }
  }

  function fetchProducts(callback) {
    if (window.ADZEK_PRODUCTS) {
      return callback(window.ADZEK_PRODUCTS);
    }
    fetch(API_BASE_URL + '/catalog/products')
      .then(function (r) { return r.ok ? r.json() : Promise.reject('API Error: ' + r.status); })
      .then(function (data) {
        window.ADZEK_PRODUCTS = Array.isArray(data) ? data : [];
        callback(window.ADZEK_PRODUCTS);
      })
      .catch(function (err) {
        console.error('Failed to load products:', err);
        showToast('Ошибка при загрузке товаров', 'error');
        callback([]);
      });
  }

  function normalizeProduct(product) {
    var price = product.variants && product.variants.length ? product.variants[0].price : 0;
    return {
      id: product.id || '', slug: product.slug || '', name: product.name || 'Товар',
      subtitle: product.description || '', image: product.image || '', price: price,
      rating: product.rating || 4.5, category: product.category ? product.category.slug : ''
    };
  }

  function renderProductCard(product, slim) {
    var imageHtml = product.image ?
      '<img alt="' + product.name + '" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="' + product.image + '" />' :
      '<div class="w-full h-full flex items-center justify-center bg-surface-container-low text-on-surface-variant">Изображение не доступно</div>';

    var card = document.createElement('div');
    card.className = slim ? 'group product-card h-full flex flex-col' : 'group flex flex-col product-card';
    card.setAttribute('data-product-id', product.id);

    var html = (slim ?
      '<div class="product-media bg-surface-container-lowest rounded-xl overflow-hidden mb-6 relative aspect-square flex items-center justify-center p-8 transition-transform duration-300 group-hover:scale-[1.02]">' + imageHtml + '</div>' :
      '<div class="relative aspect-[4/5] rounded-xxl bg-surface-container-low overflow-hidden mb-4">' + imageHtml + '<button class="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur rounded-full text-primary shadow-lg opacity-0 translate-y-4 transition-all group-hover:opacity-100 group-hover:translate-y-0" data-wishlist><span class="material-symbols-outlined">favorite</span></button></div>') +
      '<div' + (slim ? '' : ' class="space-y-1"') + '>' +
      (slim ? '' : '<div class="flex items-center gap-1 mb-1"><span class="material-symbols-outlined text-sm text-primary" style="font-variation-settings: \'FILL\' 1;">star</span><span class="text-xs font-bold text-on-surface">' + (product.rating || 4.5).toFixed(1) + '</span><span class="text-xs text-on-surface-variant ml-1">(42 отзыва)</span></div>') +
      '<h3 class="text-on-surface font-bold leading-tight group-hover:text-primary transition-colors' + (slim ? ' text-lg mb-1' : '') + '">' + product.name + '</h3>' +
      (slim ? '<p class="text-on-surface-variant text-sm mb-4">' + (product.subtitle || '') + '</p>' : '') +
      '<div class="flex items-center' + (slim ? ' justify-between mt-auto' : ' justify-between pt-3 mt-auto') + '">' +
      '<span class="text-lg font-extrabold text-on-surface">' + formatPrice(product.price) + '</span>' +
      '<button class="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-primary-container transition-all active:scale-95 shadow-md shadow-primary/20"><span class="material-symbols-outlined text-base">shopping_cart</span>' + (slim ? '' : 'В корзину') + '</button></div></div>';
    card.innerHTML = html;
    return card;
  }

  function renderCatalogProducts() {
    var grid = document.getElementById('productGrid');
    if (!grid) return;

    var start = (catalogState.currentPage - 1) * PRODUCTS_PER_PAGE;
    var end = start + PRODUCTS_PER_PAGE;
    var pageProducts = catalogState.filteredProducts.slice(start, end);

    grid.innerHTML = '';
    pageProducts.forEach(function(product) { grid.appendChild(renderProductCard(product, false)); });

    updateCatalogPagination();
    var countEl = document.getElementById('catalogCount');
    if (countEl) countEl.textContent = 'Найдено ' + catalogState.filteredProducts.length + ' товаров';
    var emptyEl = document.getElementById('catalogEmpty');
    if (emptyEl) emptyEl.classList.toggle('hidden', catalogState.filteredProducts.length > 0);
  }

  function updateCatalogPagination() {
    var container = document.querySelector('[data-pagination-container]') || document.querySelector('.mt-20.flex.justify-center.gap-2');
    if (!container) return;

    var totalPages = Math.max(1, Math.ceil(catalogState.filteredProducts.length / PRODUCTS_PER_PAGE));
    container.innerHTML = '';
    if (totalPages <= 1) return;

    var makeBtnListener = function(page) {
      return function() {
        catalogState.currentPage = page;
        renderCatalogProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    };

    var prevBtn = document.createElement('button');
    prevBtn.className = 'w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white transition-all disabled:opacity-50';
    prevBtn.innerHTML = '<span class="material-symbols-outlined">chevron_left</span>';
    prevBtn.disabled = catalogState.currentPage <= 1;
    prevBtn.addEventListener('click', makeBtnListener(Math.max(1, catalogState.currentPage - 1)));
    container.appendChild(prevBtn);

    var startPage = Math.max(1, catalogState.currentPage - 1);
    var endPage = Math.min(totalPages, startPage + 2);
    if (endPage - startPage < 2 && totalPages > 2) startPage = Math.max(1, endPage - 2);

    if (startPage > 1) {
      var btn1 = document.createElement('button');
      btn1.className = 'w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white transition-all';
      btn1.textContent = '1';
      btn1.addEventListener('click', makeBtnListener(1));
      container.appendChild(btn1);

      if (startPage > 2) {
        var dots = document.createElement('span');
        dots.className = 'flex items-center px-2 text-on-surface-variant';
        dots.textContent = '...';
        container.appendChild(dots);
      }
    }

    for (var i = startPage; i <= endPage; i++) {
      var btn = document.createElement('button');
      btn.className = i === catalogState.currentPage ?
        'w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold' :
        'w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white transition-all';
      btn.textContent = String(i);
      btn.addEventListener('click', makeBtnListener(i));
      container.appendChild(btn);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        var dots2 = document.createElement('span');
        dots2.className = 'flex items-center px-2 text-on-surface-variant';
        dots2.textContent = '...';
        container.appendChild(dots2);
      }
      var btnLast = document.createElement('button');
      btnLast.className = 'w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white transition-all';
      btnLast.textContent = String(totalPages);
      btnLast.addEventListener('click', makeBtnListener(totalPages));
      container.appendChild(btnLast);
    }

    var nextBtn = document.createElement('button');
    nextBtn.className = 'w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white transition-all disabled:opacity-50';
    nextBtn.innerHTML = '<span class="material-symbols-outlined">chevron_right</span>';
    nextBtn.disabled = catalogState.currentPage >= totalPages;
    nextBtn.addEventListener('click', makeBtnListener(Math.min(totalPages, catalogState.currentPage + 1)));
    container.appendChild(nextBtn);
  }

  function applyFilters() {
    var categories = Array.prototype.map.call(document.querySelectorAll('[data-filter-category]:checked'), function(i) {
      return i.getAttribute('data-filter-category');
    });

    var maxPrice = Number(document.getElementById('priceRange')?.value || 5000);
    var stockRequired = document.getElementById('inStockOnly')?.checked || false;

    catalogState.filteredProducts = catalogState.allProducts.filter(function(product) {
      return (!categories.length || categories.indexOf(product.category) !== -1) &&
             product.price <= maxPrice && !stockRequired;
    });

    catalogState.currentPage = 1;
    renderCatalogProducts();

    var priceMaxLabel = document.getElementById('priceMaxLabel');
    if (priceMaxLabel) priceMaxLabel.textContent = formatPrice(maxPrice);
  }

  function routeTo(target) {
    if (!target) return;
    if (target.startsWith('#')) {
      var node = document.querySelector(target);
      if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (target.startsWith('/#')) {
      var hash = target.slice(1);
      var current = window.location.pathname;
      if (current === '/' || current === '/index' || current === '/index.html') {
        var el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.location.href = target;
  }

  function getUserKey() {
    try {
      if (window.ADZEK_CART && typeof window.ADZEK_CART.getUserKey === 'function') {
        return window.ADZEK_CART.getUserKey();
      }
    } catch (e) {}
    var user = null;
    try { user = JSON.parse(localStorage.getItem('adzekUser') || 'null'); } catch (e) {}
    if (!user) {
      try { user = JSON.parse(sessionStorage.getItem('adzekUser') || 'null'); } catch (e) {}
    }
    if (!user || typeof user !== 'object') return 'anonymous';
    return String(user.id || user.userId || user.email || user.phone || user.username || 'anonymous').toLowerCase().trim();
  }

  function enforcePersistentHeader() {
    var nav = document.getElementById('topNav');
    if (!nav) return;
    nav.style.position = 'fixed';
    nav.style.top = '0';
    nav.style.left = '0';
    nav.style.right = '0';
    nav.style.zIndex = '9999';
    nav.style.display = 'block';
    nav.style.visibility = 'visible';
    nav.style.opacity = '1';

    var lockNav = function () {
      nav.style.transform = 'translateY(0)';
      nav.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    lockNav();
    window.addEventListener('scroll', lockNav, { passive: true });
  }

  function bindDataRoutes() {
    document.addEventListener('click', function (e) {
      var node = e.target.closest('[data-route]');
      if (!node) return;
      e.preventDefault();
      routeTo(node.getAttribute('data-route'));
    });
  }

  function bindWishlist() {
    var storageKey = 'adzekWishlist:' + getUserKey();
    var read = function() {
      try { var raw = localStorage.getItem(storageKey) || '[]'; var list = JSON.parse(raw); return Array.isArray(list) ? list : []; } catch (e) { return []; }
    };
    var write = function(list) {
      try { localStorage.setItem(storageKey, JSON.stringify(list)); } catch (e) {}
    };
    var toggle = function(id, label) {
      var list = read();
      var idx = list.findIndex(function (item) { return item.id === id; });
      if (idx >= 0) { list.splice(idx, 1); write(list); showToast('Удалено из избранного', 'info'); return false; }
      list.push({ id: id, label: label || '' }); write(list); showToast('Добавлено в избранное', 'success'); return true;
    };
    var setFill = function(icon, active) {
      if (!icon) return;
      icon.style.fontVariationSettings = active ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 400";
    };

    document.addEventListener('click', function (e) {
      var button = e.target.closest('[data-wishlist]');
      if (!button) return;
      e.preventDefault();
      var card = button.closest('[data-product-id], .product-card, .group');
      var titleEl = card ? card.querySelector('h3') : null;
      var label = titleEl ? safeText(titleEl.textContent) : '';
      var id = (card && card.getAttribute('data-product-id')) || label || String(Math.random());
      var active = toggle(id, label);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
      setFill(button.querySelector('.material-symbols-outlined'), active);
    });

    document.querySelectorAll('[data-wishlist]').forEach(function (button) {
      var card = button.closest('[data-product-id], .product-card, .group');
      var titleEl = card ? card.querySelector('h3') : null;
      var label = titleEl ? safeText(titleEl.textContent) : '';
      var id = (card && card.getAttribute('data-product-id')) || label || '';
      if (!id) return;
      var active = read().some(function (item) { return item.id === id; });
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
      setFill(button.querySelector('.material-symbols-outlined'), active);
    });
  }

  function bindCopyButtons() {
    document.addEventListener('click', function (e) {
      var button = e.target.closest('[data-copy]');
      if (!button) return;
      e.preventDefault();
      var text = button.getAttribute('data-copy') || '';
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          showToast('Промокод скопирован', 'success');
        }).catch(function () {
          showToast('Не удалось скопировать', 'error');
        });
      } else {
        showToast('Скопируйте вручную: ' + text, 'info');
      }
    });
  }

  function bindToastButtons() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-toast]');
      if (!btn) return;
      e.preventDefault();
      showToast(btn.getAttribute('data-toast') || 'Готово', 'info');
    });
  }

  function bindNewsletter() {
    document.addEventListener('submit', function (e) {
      var form = e.target.closest('[data-newsletter]');
      if (!form) return;
      e.preventDefault();
      showToast('Спасибо за подписку!', 'success');
      form.reset();
    });
  }

  function bindAddressActions() {
    document.addEventListener('click', function (e) {
      var addBtn = e.target.closest('[data-address-add]');
      if (addBtn) {
        e.preventDefault();
        var label = prompt('Введите адрес доставки:');
        if (!label) return;
        var list = document.querySelector('[data-address-list]');
        if (!list) return;
        var item = document.createElement('div');
        item.className = 'bg-white rounded-xl p-6 border border-outline-variant/20 shadow-sm';
        item.innerHTML = '<div class="text-sm font-bold mb-2">' + label + '</div><div class="text-xs text-on-surface-variant">Новый адрес</div><div class="flex gap-4 mt-5 text-xs font-bold uppercase tracking-wider"><button data-address-edit class="text-primary">Изменить</button><button data-address-delete class="text-slate-400">Удалить</button></div>';
        list.appendChild(item);
        showToast('Адрес добавлен', 'success');
        return;
      }

      var editBtn = e.target.closest('[data-address-edit]');
      if (editBtn) {
        e.preventDefault();
        var block = editBtn.closest('.bg-white, .address-card, [data-address-item]') || editBtn.closest('div');
        if (!block) return;
        var title = block.querySelector('.text-sm.font-bold') || block.querySelector('h4') || block.querySelector('div');
        var current = title ? safeText(title.textContent) : '';
        var next = prompt('Изменить адрес:', current);
        if (!next) return;
        if (title) title.textContent = next;
        showToast('Адрес обновлён', 'success');
        return;
      }

      var delBtn = e.target.closest('[data-address-delete]');
      if (delBtn) {
        e.preventDefault();
        var card = delBtn.closest('.bg-white, .address-card, [data-address-item]');
        if (card) { card.remove(); showToast('Адрес удалён', 'info'); }
      }
    });
  }

  function bindOrderActions() {
    document.addEventListener('click', function (e) {
      var details = e.target.closest('[data-order-details]');
      if (details) { e.preventDefault(); routeTo(details.getAttribute('data-order-details') || '/order-confirmed'); return; }
      var repeat = e.target.closest('[data-order-repeat]');
      if (repeat) { e.preventDefault(); showToast('Заказ добавлен в корзину', 'success'); routeTo('/catalog'); }
    });
  }

  function bindAdminActions() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-admin-action]');
      if (!btn) return;
      e.preventDefault();
      showToast((btn.getAttribute('data-admin-action') || 'Действие') + ' в работе', 'info');
    });
  }

  ready(function () {
    enforcePersistentHeader();
    bindDataRoutes();
    bindWishlist();
    bindCopyButtons();
    bindToastButtons();
    bindNewsletter();
    bindAddressActions();
    bindOrderActions();
    bindAdminActions();

    fetchProducts(function(products) {
      if (!products || !products.length) return;
      catalogState.allProducts = products.map(normalizeProduct);
      catalogState.filteredProducts = catalogState.allProducts.slice();

      var grid = document.getElementById('productGrid');
      if (!grid) return;

      var isHomepage = ['/', '/index.html', '/index'].indexOf(window.location.pathname) !== -1;
      if (isHomepage) {
        grid.innerHTML = '';
        catalogState.allProducts.slice(0, PRODUCTS_ON_HOMEPAGE).forEach(function(product) {
          grid.appendChild(renderProductCard(product, true));
        });
      } else {
        applyFilters();

        document.querySelectorAll('[data-filter-category]').forEach(function(checkbox) {
          checkbox.addEventListener('change', applyFilters);
        });

        var priceRange = document.getElementById('priceRange');
        if (priceRange) priceRange.addEventListener('input', applyFilters);

        var inStockOnly = document.getElementById('inStockOnly');
        if (inStockOnly) inStockOnly.addEventListener('change', applyFilters);

        var sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
          sortSelect.addEventListener('change', function() {
            var mode = sortSelect.value;
            catalogState.filteredProducts.sort(function(a, b) {
              if (mode === 'cheap') return a.price - b.price;
              if (mode === 'expensive') return b.price - a.price;
              return (b.rating || 0) - (a.rating || 0);
            });
            catalogState.currentPage = 1;
            renderCatalogProducts();
          });
        }
      }
    });
  });
})();
