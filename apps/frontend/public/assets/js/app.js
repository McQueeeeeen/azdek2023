(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
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
    window.setTimeout(function () {
      existing.style.opacity = '0';
      existing.style.transform = 'translateY(-6px)';
    }, 1800);
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

    // Ensure header always stays attached to viewport while scrolling.
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
      if (window.scrollY > 12) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    };

    lockNav();
    window.addEventListener('scroll', lockNav, { passive: true });
  }
  function bindDataRoutes() {
    document.addEventListener('click', function (e) {
      var node = e.target.closest('[data-route]');
      if (!node) return;
      var target = node.getAttribute('data-route');
      if (!target) return;
      e.preventDefault();
      routeTo(target);
    });
  }

  function bindWishlist() {
    var storageKey = 'adzekWishlist:' + getUserKey();
    function read() {
      try {
        var raw = localStorage.getItem(storageKey) || '[]';
        var list = JSON.parse(raw);
        return Array.isArray(list) ? list : [];
      } catch (e) { return []; }
    }
    function write(list) {
      try { localStorage.setItem(storageKey, JSON.stringify(list)); } catch (e) {}
    }
    function toggle(id, label) {
      var list = read();
      var idx = list.findIndex(function (item) { return item.id === id; });
      if (idx >= 0) {
        list.splice(idx, 1);
        write(list);
        showToast('Óäàëåíî èç èçáðàííîãî', 'info');
        return false;
      }
      list.push({ id: id, label: label || '' });
      write(list);
      showToast('Äîáàâëåíî â èçáðàííîå', 'success');
      return true;
    }
    function setFill(icon, active) {
      if (!icon) return;
      icon.style.fontVariationSettings = active ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
    }

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
      var icon = button.querySelector('.material-symbols-outlined');
      setFill(icon, active);
    });

    document.querySelectorAll('[data-wishlist]').forEach(function (button) {
      var card = button.closest('[data-product-id], .product-card, .group');
      var titleEl = card ? card.querySelector('h3') : null;
      var label = titleEl ? safeText(titleEl.textContent) : '';
      var id = (card && card.getAttribute('data-product-id')) || label || '';
      if (!id) return;
      var list = read();
      var active = list.some(function (item) { return item.id === id; });
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
      var icon = button.querySelector('.material-symbols-outlined');
      setFill(icon, active);
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
          showToast('Ïðîìîêîä ñêîïèðîâàí', 'success');
        }).catch(function () {
          showToast('Íå óäàëîñü ñêîïèðîâàòü', 'error');
        });
      } else {
        showToast('Ñêîïèðóéòå âðó÷íóþ: ' + text, 'info');
      }
    });
  }

  function bindToastButtons() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-toast]');
      if (!btn) return;
      e.preventDefault();
      var msg = btn.getAttribute('data-toast') || 'Ãîòîâî';
      showToast(msg, 'info');
    });
  }

  function bindNewsletter() {
    document.addEventListener('submit', function (e) {
      var form = e.target.closest('[data-newsletter]');
      if (!form) return;
      e.preventDefault();
      showToast('Ñïàñèáî çà ïîäïèñêó!', 'success');
      form.reset();
    });
  }

  function bindAddressActions() {
    document.addEventListener('click', function (e) {
      var addBtn = e.target.closest('[data-address-add]');
      if (addBtn) {
        e.preventDefault();
        var label = prompt('Ââåäèòå àäðåñ äîñòàâêè:');
        if (!label) return;
        var list = document.querySelector('[data-address-list]');
        if (!list) return;
        var item = document.createElement('div');
        item.className = 'bg-white rounded-xl p-6 border border-outline-variant/20 shadow-sm';
        item.innerHTML = '<div class="text-sm font-bold mb-2">' + label + '</div>' +
          '<div class="text-xs text-on-surface-variant">Íîâûé àäðåñ</div>' +
          '<div class="flex gap-4 mt-5 text-xs font-bold uppercase tracking-wider">' +
          '<button data-address-edit class="text-primary">Èçìåíèòü</button>' +
          '<button data-address-delete class="text-slate-400">Óäàëèòü</button>' +
          '</div>';
        list.appendChild(item);
        showToast('Àäðåñ äîáàâëåí', 'success');
        return;
      }

      var editBtn = e.target.closest('[data-address-edit]');
      if (editBtn) {
        e.preventDefault();
        var block = editBtn.closest('.bg-white, .address-card, [data-address-item]') || editBtn.closest('div');
        if (!block) return;
        var title = block.querySelector('.text-sm.font-bold') || block.querySelector('h4') || block.querySelector('div');
        var current = title ? safeText(title.textContent) : '';
        var next = prompt('Èçìåíèòü àäðåñ:', current);
        if (!next) return;
        if (title) title.textContent = next;
        showToast('Àäðåñ îáíîâë¸í', 'success');
        return;
      }

      var delBtn = e.target.closest('[data-address-delete]');
      if (delBtn) {
        e.preventDefault();
        var card = delBtn.closest('.bg-white, .address-card, [data-address-item]');
        if (card) {
          card.remove();
          showToast('Àäðåñ óäàë¸í', 'info');
        }
      }
    });
  }

  function bindOrderActions() {
    document.addEventListener('click', function (e) {
      var details = e.target.closest('[data-order-details]');
      if (details) {
        e.preventDefault();
        routeTo(details.getAttribute('data-order-details') || '/order-confirmed');
        return;
      }
      var repeat = e.target.closest('[data-order-repeat]');
      if (repeat) {
        e.preventDefault();
        showToast('Çàêàç äîáàâëåí â êîðçèíó', 'success');
        routeTo('/catalog');
      }
    });
  }

  function bindAdminActions() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-admin-action]');
      if (!btn) return;
      e.preventDefault();
      var label = btn.getAttribute('data-admin-action') || 'Äåéñòâèå';
      showToast(label + ' â ðàáîòå', 'info');
    });
  }

  function bindPagination() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-page]');
      if (!btn) return;
      e.preventDefault();
      var page = btn.getAttribute('data-page');
      if (!page) return;
      showToast('Ñòðàíèöà ' + page, 'info');
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    bindPagination();
  });
})();

