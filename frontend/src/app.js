import { api, ApiError } from './api.js';
import { getProfile, saveStudentProfile, esc } from './core/state.js';
import { getPage, go } from './core/router.js';
import { icon } from './ui/icons.js';
import { SURFACE_META } from './core/surface.js';

const root = document.getElementById('app');
const toastNode = document.getElementById('toast');
const surface = window.rgatuConfig?.surface || 'student';
const meta = SURFACE_META[surface] || SURFACE_META.student;

let pageMap = {};
let authState = null;
let toastTimer;

function toast(message) {
  toastNode.textContent = message;
  toastNode.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastNode.classList.remove('show'), 2600);
}

function loginGate(error = '') {
  return `
    <main class="auth-gate">
      <section class="auth-brand">
        <img src="./icon.svg" alt="">
        <span class="eyebrow">${esc(meta.eyebrow)}</span>
        <h1>РГАТУ · ${esc(meta.title)}</h1>
        <p>Войдите с университетской учётной записью. Сейчас используется временный password-provider; позже эта форма будет заменена SSO.</p>
      </section>
      <section class="auth-card">
        <form class="auth-form" id="auth-form">
          <label>
            <span>Логин</span>
            <input name="login" autocomplete="username" required autofocus>
          </label>
          <label>
            <span>Пароль</span>
            <input name="password" type="password" autocomplete="current-password" required>
          </label>
          <div class="auth-error ${error ? 'is-visible' : ''}" id="auth-error">${esc(error)}</div>
          <button class="auth-submit" type="submit">Войти</button>
        </form>
        <p class="auth-note">Сессионный токен хранится только в HttpOnly cookie на api.rsatu.ru. Пароль не сохраняется во frontend.</p>
      </section>
    </main>`;
}

function serviceUnavailable(message) {
  return `
    <main class="access-denied">
      <section class="rs-card">
        <span class="eyebrow">api.rsatu.ru</span>
        <h1>Сервис временно недоступен</h1>
        <p>${esc(message || 'Не удалось связаться с сервером авторизации.')}</p>
        <button class="rs-button rs-button--primary" data-retry-auth style="margin-top:18px">Повторить</button>
      </section>
    </main>`;
}

function accessDenied() {
  const surfaces = authState?.user?.access?.surfaces || [];
  const available = surfaces
    .map((id) => SURFACE_META[id])
    .filter(Boolean)
    .map((item) => `<a class="rs-button rs-button--secondary" href="https://${item.domain}">${esc(item.title)}</a>`)
    .join('');

  return `
    <main class="access-denied">
      <section class="rs-card">
        <span class="eyebrow">доступ ограничен</span>
        <h1>Нет доступа к ${esc(meta.title.toLowerCase())}</h1>
        <p>Учётная запись активна, но backend не выдал право на поверхность <b>${esc(surface)}</b>. Доступ определяется ролями и scope в Yii3.</p>
        <div class="rs-toolbar" style="margin-top:18px">
          ${available || '<span class="rs-status">нет доступных интерфейсов</span>'}
          <button class="rs-button rs-button--secondary" data-logout>Выйти</button>
        </div>
      </section>
    </main>`;
}

function headerContext() {
  const user = authState?.user;
  const fullName = user?.person?.fullName || user?.login || 'Пользователь';

  if (surface === 'student') {
    const profile = getProfile();
    const secondLine = profile.group
      ? `${esc(profile.group)} · ${esc(profile.course)} курс`
      : 'студент';

    return `<div class="topbar-user"><b>${esc(fullName)}</b><span>${secondLine}</span></div>`;
  }

  const assignments = user?.access?.assignments || [];
  const roleName = assignments[0]?.role?.name || meta.title;

  return `<div class="topbar-user"><b>${esc(fullName)}</b><span>${esc(roleName)}</span></div>`;
}

function shell(page, content) {
  const nav = meta.nav.map(([id, glyph, label]) => `
    <a href="#${id}" ${page === id ? 'aria-current="page"' : ''}>
      ${icon(glyph)}
      <span>${label}</span>
    </a>`).join('');

  return `
    <div class="shell shell--${surface}">
      <header class="topbar">
        <div class="brand">
          <img src="./icon.svg" alt="">
          <div><span>${meta.eyebrow}</span><strong>РГАТУ · ${meta.title}</strong></div>
        </div>
        <div class="topbar-actions">
          ${headerContext()}
          <button class="logout-button" data-logout title="Выйти">Выйти</button>
        </div>
      </header>
      <main class="page">${content}</main>
      <nav class="nav nav--${surface}" aria-label="Главное меню">${nav}</nav>
    </div>`;
}

async function loadPages() {
  if (surface === 'teacher') {
    const module = await import('./pages/teacher.js');
    return {
      home: module.teacherHome,
      groups: module.teacherGroups,
      assessment: module.teacherAssessment,
      profile: module.teacherProfile,
    };
  }

  if (surface === 'admin') {
    const module = await import('./pages/admin.js');
    return {
      home: module.adminHome,
      students: module.adminStudents,
      groups: module.adminGroups,
      schedule: module.adminSchedule,
      academic: module.adminAcademic,
    };
  }

  const module = await import('./pages/student.js');
  return {
    home: module.studentHome,
    schedule: module.studentSchedule,
    study: module.studentStudy,
    services: module.studentServices,
    profile: module.studentProfile,
  };
}

function renderAuthorized() {
  if (!authState?.user?.access?.surfaces?.includes(surface)) {
    root.innerHTML = accessDenied();
    return;
  }

  const requestedPage = getPage('home');
  const page = pageMap[requestedPage] ? requestedPage : 'home';
  root.innerHTML = shell(page, pageMap[page]());
}

async function bootstrapAuth() {
  root.innerHTML = '<main class="boot"><div class="mark">Р</div><strong>Проверяем вход</strong><span>api.rsatu.ru</span></main>';

  try {
    authState = await api.me();
    renderAuthorized();
  } catch (error) {
    authState = null;

    if (error instanceof ApiError && error.status === 401) {
      root.innerHTML = loginGate();
      return;
    }

    root.innerHTML = serviceUnavailable(error?.message);
  }
}

root.addEventListener('click', async (event) => {
  const goButton = event.target.closest('[data-go]');
  if (goButton) {
    go(String(goButton.dataset.go || 'home'));
    return;
  }

  if (event.target.closest('[data-retry-auth]')) {
    await bootstrapAuth();
    return;
  }

  if (event.target.closest('[data-logout]')) {
    try {
      await api.logout();
    } catch {
      api.clearCsrf();
    }

    authState = null;
    root.innerHTML = loginGate();
  }
});

root.addEventListener('submit', async (event) => {
  if (event.target.id === 'auth-form') {
    event.preventDefault();

    const form = event.target;
    const button = form.querySelector('button[type="submit"]');
    const errorNode = form.querySelector('#auth-error');
    const data = new FormData(form);

    button.disabled = true;
    errorNode.classList.remove('is-visible');

    try {
      authState = await api.login(
        String(data.get('login') || '').trim(),
        String(data.get('password') || ''),
      );

      if (!authState?.user?.access?.surfaces?.includes(surface)) {
        root.innerHTML = accessDenied();
        return;
      }

      renderAuthorized();
    } catch (error) {
      errorNode.textContent = error instanceof ApiError && error.status === 401
        ? 'Неверный логин или пароль.'
        : (error?.message || 'Не удалось выполнить вход.');
      errorNode.classList.add('is-visible');
    } finally {
      button.disabled = false;
    }

    return;
  }

  if (surface === 'student' && event.target.id === 'profile-form') {
    event.preventDefault();
    saveStudentProfile(new FormData(event.target));
    toast('Профиль сохранён');
    renderAuthorized();
  }
});

window.addEventListener('hashchange', () => {
  if (authState) renderAuthorized();
});

loadPages()
  .then((pages) => {
    pageMap = pages;
    return bootstrapAuth();
  })
  .catch((error) => {
    root.innerHTML = serviceUnavailable(error?.message);
  });

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
