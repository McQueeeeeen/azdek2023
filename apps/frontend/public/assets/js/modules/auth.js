import { PROTECTED_ROUTES, currentPath, normalizeHref, routePath, session, showToast, api } from './core.js';

function isProtected(path) {
  return PROTECTED_ROUTES.includes(path) || path.startsWith('/account/');
}

export function applyAuthGuards() {
  const path = currentPath();
  const s = session();

  if (path === '/login' || path === '/register') {
    if (s.isAuthed()) window.location.href = routePath('/account');
    return;
  }

  if (path === '/admin') {
    if (!s.isAuthed()) {
      sessionStorage.setItem('adzekReturnTo', window.location.pathname + window.location.search + window.location.hash);
      window.location.href = routePath('/login');
      return;
    }
    if (s.role() !== 'admin') {
      showToast('Недостаточно прав для доступа к админке', 'error');
      window.location.href = routePath('/account');
      return;
    }
  }

  if (isProtected(path) && !s.isAuthed()) {
    sessionStorage.setItem('adzekReturnTo', window.location.pathname + window.location.search + window.location.hash);
    window.location.href = routePath('/login');
  }
}

export function wireLogout({ clearCart } = {}) {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-logout],a[href*="logout"],button[data-action="logout"]');
    if (!btn) return;
    e.preventDefault();
    session().clear();
    if (typeof clearCart === 'function') clearCart();
    showToast('Вы вышли из аккаунта', 'info');
    window.location.href = routePath('/');
  });
}

export function wireLoginRegister() {
  const loginForm = document.querySelector('form[data-login-form], #loginForm');
  const registerForm = document.querySelector('form[data-register-form], #registerForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(loginForm);
      const payload = {
        email: String(fd.get('email') || '').trim(),
        password: String(fd.get('password') || '')
      };
      try {
        const auth = await api('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
        session().setFromAuthPayload(auth);
        const target = normalizeHref(sessionStorage.getItem('adzekReturnTo') || routePath('/account'));
        sessionStorage.removeItem('adzekReturnTo');
        window.location.href = target;
      } catch (err) {
        showToast(err.message || 'Ошибка входа', 'error');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(registerForm);
      const fullName = String(fd.get('fullName') || fd.get('firstName') || '').trim();
      let firstName = String(fd.get('firstName') || '').trim();
      let lastName = String(fd.get('lastName') || '').trim();
      if (!firstName && fullName) firstName = fullName.split(/\s+/)[0] || '';
      if (!lastName && fullName) lastName = fullName.split(/\s+/).slice(1).join(' ');
      const payload = {
        firstName,
        lastName,
        email: String(fd.get('email') || '').trim(),
        phone: String(fd.get('phone') || '').trim(),
        password: String(fd.get('password') || ''),
        customerType: 'b2c'
      };
      try {
        const auth = await api('/auth/register/customer', { method: 'POST', body: JSON.stringify(payload) });
        session().setFromAuthPayload(auth);
        window.location.href = routePath('/account');
      } catch (err) {
        showToast(err.message || 'Ошибка регистрации', 'error');
      }
    });
  }
}

