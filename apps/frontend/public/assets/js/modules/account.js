import { api, currentPath, session, showToast } from './core.js';

function findProfileForm() {
  return document.querySelector('form[data-account-form], #accountForm') || document.querySelector('main form') || document;
}

function findInputs(scope) {
  const all = Array.from(scope.querySelectorAll('input[type="text"],input[type="email"],input[type="tel"],input[type="date"]'));
  const byHint = (hints) => all.find((i) => {
    const label = (i.getAttribute('name') || '') + ' ' + (i.getAttribute('id') || '') + ' ' + (i.placeholder || '') + ' ' + ((scope.querySelector(`label[for="${i.id}"]`)?.textContent) || '');
    const hay = label.toLowerCase();
    return hints.some((h) => hay.includes(h));
  }) || null;

  return {
    firstName: byHint(['имя', 'firstname', 'first_name']),
    lastName: byHint(['фам', 'lastname', 'last_name']),
    email: byHint(['email', 'почт']),
    phone: byHint(['тел', 'phone']),
    birthday: byHint(['дат', 'birthday', 'birth'])
  };
}

function localProfileKey() {
  return `adzekProfile:${session().userKey()}`;
}

function writeLocalProfile(payload) {
  localStorage.setItem(localProfileKey(), JSON.stringify(payload));
}

function collectPayload(mapped) {
  return {
    firstName: mapped.firstName?.value?.trim() || '',
    lastName: mapped.lastName?.value?.trim() || '',
    email: mapped.email?.value?.trim() || '',
    phone: mapped.phone?.value?.trim() || '',
    birthday: mapped.birthday?.value?.trim() || ''
  };
}

export async function hydrateAccountPage() {
  const path = currentPath();
  if (!(path === '/account' || path.startsWith('/account/'))) return;

  const scope = findProfileForm();
  const mapped = findInputs(scope);

  try {
    const profile = await api('/customers/me');
    if (!profile) return;

    if (mapped.firstName && profile.firstName) mapped.firstName.value = profile.firstName;
    if (mapped.lastName && profile.lastName) mapped.lastName.value = profile.lastName;
    if (mapped.email && profile.email) mapped.email.value = profile.email;
    if (mapped.phone && profile.phone) mapped.phone.value = profile.phone;
    if (mapped.birthday && profile.birthday) mapped.birthday.value = profile.birthday;

    const heroName = document.querySelector('h1');
    if (heroName && profile.firstName) heroName.textContent = `Добрый день, ${profile.firstName}!`;
  } catch (_) {
    // strict backend-first: no local fallback
  }
}

export async function saveAccountProfileFromPage() {
  const path = currentPath();
  if (!(path === '/account' || path.startsWith('/account/'))) return false;

  const scope = findProfileForm();
  const mapped = findInputs(scope);
  const payload = collectPayload(mapped);
  if (!payload.firstName && !payload.lastName && !payload.email) return false;

  try {
    await api('/customers/me', { method: 'PATCH', body: JSON.stringify(payload) });
    writeLocalProfile(payload);
    const user = session().user || {};
    localStorage.setItem('azdek_user', JSON.stringify({ ...user, ...payload }));
    showToast('Изменения сохранены', 'success');
    return true;
  } catch (err) {
    showToast(err.message || 'Не удалось сохранить профиль', 'error');
    return false;
  }
}

export function wireAccountSaveDelegation() {
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const text = (btn.textContent || '').toLowerCase();
    if (!text.includes('сохранить')) return;
    e.preventDefault();
    await saveAccountProfileFromPage();
  }, true);
}

export function hydrateNotificationSettings() {
  if (!(currentPath() === '/account/notifications' || currentPath() === '/notifications')) return;
  const toggles = Array.from(document.querySelectorAll('input[type="checkbox"], [role="switch"] input'));
  if (!toggles.length) return;

  const key = `adzekNotifications:${session().userKey()}`;
  let state = {};
  try { state = JSON.parse(localStorage.getItem(key) || '{}'); } catch (_) {}

  const decorate = (input) => {
    const id = input.id || input.name || `toggle-${Math.random().toString(36).slice(2, 7)}`;
    const checked = !!input.checked;
    const container = input.closest('label, .setting-row, .notification-item, .flex, .grid') || input.parentElement;
    if (!container) return;

    let badge = container.querySelector('[data-toggle-state]');
    if (!badge) {
      badge = document.createElement('span');
      badge.dataset.toggleState = '1';
      badge.className = 'ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider';
      container.appendChild(badge);
    }
    badge.textContent = checked ? 'Включено' : 'Отключено';
    badge.className = checked
      ? 'ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700'
      : 'ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500';
    state[id] = checked;
  };

  toggles.forEach((input, i) => {
    const id = input.id || input.name || `toggle-${i}`;
    if (Object.prototype.hasOwnProperty.call(state, id)) input.checked = !!state[id];
    decorate(input);
    input.addEventListener('change', () => {
      decorate(input);
      const fresh = {};
      toggles.forEach((t, idx) => {
        const k = t.id || t.name || `toggle-${idx}`;
        fresh[k] = !!t.checked;
      });
      localStorage.setItem(key, JSON.stringify(fresh));
    });
  });
}
