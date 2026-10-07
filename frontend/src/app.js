import { getActorRole, getProfile, saveStudentProfile, setActorRole, esc } from './core/state.js';
import { getRoute, go } from './core/router.js';
import { icon } from './ui/icons.js';
import {
  studentHome,
  studentProfile,
  studentSchedule,
  studentServices,
  studentStudy,
} from './pages/student.js';
import {
  teacherAssessment,
  teacherGroups,
  teacherHome,
  teacherProfile,
} from './pages/teacher.js';
import {
  adminAcademic,
  adminGroups,
  adminHome,
  adminSchedule,
  adminStudents,
} from './pages/admin.js';

const root = document.getElementById('app');
const toastNode = document.getElementById('toast');

const ROLE_META = {
  student: {
    title: 'Студент',
    eyebrow: 'личный кабинет',
    nav: [
      ['home', 'home', 'Главная'],
      ['schedule', 'calendar', 'Расписание'],
      ['study', 'book', 'Учёба'],
      ['services', 'grid', 'Сервисы'],
      ['profile', 'user', 'Профиль'],
    ],
  },
  teacher: {
    title: 'Преподаватель',
    eyebrow: 'рабочее место',
    nav: [
      ['home', 'home', 'Главная'],
      ['groups', 'users', 'Мои группы'],
      ['assessment', 'check', 'Оценки'],
      ['profile', 'user', 'Профиль'],
    ],
  },
  admin: {
    title: 'Администрация',
    eyebrow: 'управление',
    nav: [
      ['home', 'chart', 'Панель'],
      ['students', 'users', 'Студенты'],
      ['groups', 'grid', 'Группы'],
      ['schedule', 'calendar', 'Расписание'],
      ['academic', 'book', 'Учебный процесс'],
    ],
  },
};

const PAGE_MAP = {
  student: {
    home: studentHome,
    schedule: studentSchedule,
    study: studentStudy,
    services: studentServices,
    profile: studentProfile,
  },
  teacher: {
    home: teacherHome,
    groups: teacherGroups,
    assessment: teacherAssessment,
    profile: teacherProfile,
  },
  admin: {
    home: adminHome,
    students: adminStudents,
    groups: adminGroups,
    schedule: adminSchedule,
    academic: adminAcademic,
  },
};

let toastTimer;

function toast(message) {
  toastNode.textContent = message;
  toastNode.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastNode.classList.remove('show'), 2600);
}

function roleChooser() {
  return `
    <main class="role-gate">
      <section class="role-gate__brand">
        <img src="./icon.svg" alt="">
        <span class="eyebrow">неофициальный прототип</span>
        <h1>РГАТУ</h1>
        <p>Выберите рабочую среду. После подключения университетской авторизации роль будет определяться автоматически.</p>
      </section>
      <section class="role-gate__grid" aria-label="Выбор рабочей среды">
        <button class="role-card" data-role-select="student">
          <span class="role-card__icon">${icon('user')}</span>
          <span><b>Студент</b><small>Расписание, учёба, сессия, ДКР, задолженности и сервисы.</small></span>
          ${icon('arrow')}
        </button>
        <button class="role-card" data-role-select="teacher">
          <span class="role-card__icon">${icon('book')}</span>
          <span><b>Преподаватель</b><small>Назначенные занятия, группы, проверки, оценки и ведомости.</small></span>
          ${icon('arrow')}
        </button>
        <button class="role-card" data-role-select="admin">
          <span class="role-card__icon">${icon('building')}</span>
          <span><b>Администрация</b><small>Контингент, группы, расписание и управление учебным процессом.</small></span>
          ${icon('arrow')}
        </button>
      </section>
      <p class="role-gate__note">Переключатель временный и нужен только для разработки интерфейсов до появления SSO/RBAC.</p>
    </main>`;
}

function headerContext(role) {
  if (role === 'student') {
    const profile = getProfile();
    return profile.group
      ? `<b>${esc(profile.group)}</b><span>${esc(profile.course)} курс</span>`
      : '<span>Профиль не настроен</span>';
  }

  if (role === 'teacher') {
    return '<b>Преподаватель</b><span>нагрузка из backend</span>';
  }

  return '<b>Администрация</b><span>область доступа из RBAC</span>';
}

function shell(role, page, content) {
  const meta = ROLE_META[role];
  const nav = meta.nav.map(([id, glyph, label]) => `
    <a href="#${role}/${id}" ${page === id ? 'aria-current="page"' : ''}>
      ${icon(glyph)}
      <span>${label}</span>
    </a>`).join('');

  return `
    <div class="shell shell--${role}">
      <header class="topbar">
        <div class="brand">
          <img src="./icon.svg" alt="">
          <div><span>${meta.eyebrow}</span><strong>РГАТУ · ${meta.title}</strong></div>
        </div>
        <div class="topbar-actions">
          <div class="student-chip">${headerContext(role)}</div>
          <button class="role-switch" data-switch-role title="Сменить временную роль разработки">
            ${icon('settings')}<span>Роль</span>
          </button>
        </div>
      </header>
      <main class="page">${content}</main>
      <nav class="nav nav--${role}" aria-label="Главное меню">${nav}</nav>
    </div>`;
}

function render() {
  const actor = getActorRole();

  if (!actor) {
    document.body.dataset.role = '';
    root.innerHTML = roleChooser();
    return;
  }

  const route = getRoute(actor);
  const role = route.role || actor;
  const pageMap = PAGE_MAP[role] || PAGE_MAP.student;
  const page = pageMap[route.page] ? route.page : 'home';

  if (role !== actor) {
    setActorRole(role);
  }

  document.body.dataset.role = role;
  root.innerHTML = shell(role, page, pageMap[page]());
}

root.addEventListener('click', (event) => {
  const roleButton = event.target.closest('[data-role-select]');
  if (roleButton) {
    const role = roleButton.dataset.roleSelect;
    setActorRole(role);
    go(role, 'home');
    render();
    return;
  }

  const switchButton = event.target.closest('[data-switch-role]');
  if (switchButton) {
    setActorRole('');
    history.replaceState(null, '', location.pathname + location.search);
    render();
    return;
  }

  const goButton = event.target.closest('[data-go]');
  if (goButton) {
    const [role, page] = String(goButton.dataset.go).split('/');
    go(role, page);
  }
});

root.addEventListener('submit', (event) => {
  if (event.target.id !== 'profile-form') return;
  event.preventDefault();
  saveStudentProfile(new FormData(event.target));
  toast('Профиль сохранён');
  render();
});

window.addEventListener('hashchange', render);
render();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
