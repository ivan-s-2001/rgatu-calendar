import { getProfile, saveStudentProfile, esc } from './core/state.js';
import { getPage, go } from './core/router.js';
import { icon } from './ui/icons.js';
import { SURFACE_META } from './core/surface.js';

const root = document.getElementById('app');
const toastNode = document.getElementById('toast');
const surface = window.rgatuConfig?.surface || 'student';
const meta = SURFACE_META[surface] || SURFACE_META.student;

let pageMap = {};
let toastTimer;

function toast(message) {
  toastNode.textContent = message;
  toastNode.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastNode.classList.remove('show'), 2600);
}

function headerContext() {
  if (surface === 'student') {
    const profile = getProfile();
    return profile.group
      ? `<b>${esc(profile.group)}</b><span>${esc(profile.course)} курс</span>`
      : '<span>Профиль не настроен</span>';
  }

  if (surface === 'teacher') {
    return '<b>Преподаватель</b><span>нагрузка из backend</span>';
  }

  return '<b>Администрация</b><span>область доступа из RBAC</span>';
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
          <div class="student-chip">${headerContext()}</div>
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

function render() {
  const requestedPage = getPage('home');
  const page = pageMap[requestedPage] ? requestedPage : 'home';
  root.innerHTML = shell(page, pageMap[page]());
}

root.addEventListener('click', (event) => {
  const goButton = event.target.closest('[data-go]');
  if (goButton) {
    go(String(goButton.dataset.go || 'home'));
  }
});

root.addEventListener('submit', (event) => {
  if (surface !== 'student' || event.target.id !== 'profile-form') return;
  event.preventDefault();
  saveStudentProfile(new FormData(event.target));
  toast('Профиль сохранён');
  render();
});

window.addEventListener('hashchange', render);

loadPages()
  .then((pages) => {
    pageMap = pages;
    render();
  })
  .catch(() => {
    root.innerHTML = '<main class="boot"><strong>Не удалось загрузить интерфейс.</strong><span>Обновите страницу.</span></main>';
  });

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
