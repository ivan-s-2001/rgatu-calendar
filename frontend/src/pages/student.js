import { esc, formLabel, getProfile } from '../core/state.js';
import { icon } from '../ui/icons.js';

const SERVICES = {
  lk1: { title: 'ЛК1', subtitle: 'Старый личный кабинет ФЗО', url: 'https://old.rsatu.ru/fzo/kod.php', tag: 'Личный кабинет' },
  lk2: { title: 'ЛК2', subtitle: 'Новый личный кабинет РГАТУ', url: 'https://lk.rsatu.ru/user/sign-in/login?_referrer=%2Fsite%2Findex', tag: 'Личный кабинет' },
  classes: { title: 'Расписание занятий', subtitle: 'Официальная страница университета', url: 'https://www.rsatu.ru/students/raspisanie-zanyatiy/', tag: 'РГАТУ' },
  sessions: { title: 'Расписание сессий', subtitle: 'Установочные и экзаменационные сессии', url: 'https://www.rsatu.ru/students/raspisanie-sessii/', tag: 'РГАТУ' },
  fzo: { title: 'Заочное обучение', subtitle: 'Информация факультета ФЗО', url: 'https://www.rsatu.ru/zaochnoe/', tag: 'РГАТУ' },
  site: { title: 'Сайт РГАТУ', subtitle: 'Официальный сайт университета', url: 'https://www.rsatu.ru/', tag: 'РГАТУ' },
};

function serviceCard(item) {
  return `<a class="service-card" href="${item.url}" target="_blank" rel="noopener">
    <div><span>${esc(item.tag)}</span><h3>${esc(item.title)}</h3><p>${esc(item.subtitle)}</p></div>
    ${icon('external')}
  </a>`;
}

export function studentHome() {
  const profile = getProfile();
  const ready = profile.group && profile.form !== 'unknown';

  return `
    <section class="hero">
      <div>
        <span class="eyebrow">личное пространство</span>
        <h1>${profile.name ? `Привет, ${esc(profile.name)}` : 'Учёба без поиска по десятку сервисов'}</h1>
        <p>Расписание, учебные задачи, сессия, задолженности и университетские сервисы в одном интерфейсе.</p>
      </div>
      <div class="hero-status">
        <span class="status-dot ${ready ? 'ok' : ''}"></span>
        <div>
          <strong>${ready ? 'Профиль настроен' : 'Нужно заполнить профиль'}</strong>
          <span>${ready ? `${esc(profile.group)} · ${esc(formLabel(profile.form))}` : 'Группа и форма обучения нужны для персонализации'}</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><span class="eyebrow">сегодня</span><h2>Главное</h2></div>
      <div class="dashboard-grid">
        <button class="feature primary-feature" data-go="student/schedule">
          <span class="feature-icon">${icon('calendar')}</span>
          <span><b>Расписание</b><small>${profile.group ? `Группа ${esc(profile.group)}` : 'Выбрать группу'}</small></span>
          ${icon('arrow')}
        </button>
        <button class="feature" data-go="student/study">
          <span class="feature-icon">${icon('book')}</span>
          <span><b>Учёба</b><small>ДКР, задания, сессия, задолженности</small></span>
          ${icon('arrow')}
        </button>
        <button class="feature" data-go="student/services">
          <span class="feature-icon">${icon('grid')}</span>
          <span><b>Сервисы</b><small>ЛК и официальные ресурсы</small></span>
          ${icon('arrow')}
        </button>
      </div>
    </section>

    <section class="section">
      <div class="rs-panel">
        <div class="rs-panel__header">
          <div><span class="eyebrow">следующие действия</span><h2>Что требует внимания</h2></div>
          <span class="rs-status">данные ещё не подключены</span>
        </div>
        <div class="empty-workspace">
          <strong>Здесь появятся реальные задачи студента.</strong>
          <p>После подключения Yii3 API — ближайшие занятия, ДКР, контрольные, сессия и задолженности.</p>
        </div>
      </div>
    </section>`;
}

export function studentSchedule() {
  const p = getProfile();
  const notice = p.form !== 'distance' && p.form !== 'unknown'
    ? `<div class="coverage"><strong>Общий интерфейс уже готов.</strong><span>Текущий встроенный набор расписания пока содержит ФЗО. Источник будет заменён API без смены экрана.</span></div>`
    : '';

  return `
    <div class="screen-head"><span class="eyebrow">учебный процесс</span><h1>Расписание</h1><p>${p.group ? `Группа ${esc(p.group)}` : 'Группа пока не выбрана'}</p></div>
    ${notice}
    <section class="schedule-frame-wrap"><iframe class="schedule-frame" title="Расписание РГАТУ" src="./modules/schedule/index.html?embed=1#day" loading="eager"></iframe></section>`;
}

export function studentStudy() {
  return `
    <div class="screen-head"><span class="eyebrow">учёба</span><h1>Учебный процесс</h1><p>Официальные и личные задачи студента.</p></div>
    <div class="workspace-cards">
      <article class="rs-card workspace-card"><span class="eyebrow">обязательно</span><h3>ДКР и контрольные</h3><p>Назначенные работы, сроки, статус проверки.</p><span class="rs-status">ожидает API</span></article>
      <article class="rs-card workspace-card"><span class="eyebrow">аттестация</span><h3>Сессия</h3><p>Экзамены, зачёты, консультации и результаты.</p><span class="rs-status">ожидает API</span></article>
      <article class="rs-card workspace-card"><span class="eyebrow">контроль</span><h3>Задолженности</h3><p>Предмет, основание, попытки и сроки ликвидации.</p><span class="rs-status">ожидает API</span></article>
    </div>`;
}

export function studentServices() {
  return `
    <div class="screen-head"><span class="eyebrow">университет</span><h1>Сервисы</h1><p>Официальные ресурсы РГАТУ в одном месте.</p></div>
    <section class="service-section"><h2>Личные кабинеты</h2><div class="service-grid">${serviceCard(SERVICES.lk2)}${serviceCard(SERVICES.lk1)}</div></section>
    <section class="service-section"><h2>Учёба</h2><div class="service-grid">${serviceCard(SERVICES.classes)}${serviceCard(SERVICES.sessions)}${serviceCard(SERVICES.fzo)}</div></section>
    <section class="service-section"><h2>Университет</h2><div class="service-grid">${serviceCard(SERVICES.site)}</div></section>
    <div class="privacy-note"><b>Университетские пароли здесь не сохраняются.</b><span>До появления официального SSO авторизация остаётся на доменах РГАТУ.</span></div>`;
}

export function studentProfile() {
  const p = getProfile();
  return `
    <div class="screen-head"><span class="eyebrow">профиль</span><h1>Студент</h1><p>Временный локальный профиль до подключения университетской авторизации.</p></div>
    <form class="profile-form" id="profile-form">
      <label><span>Имя</span><input name="name" autocomplete="name" placeholder="Как к тебе обращаться" value="${esc(p.name)}"></label>
      <div class="form-row">
        <label><span>Группа</span><input name="group" autocapitalize="characters" placeholder="Например, ЗВС-26" value="${esc(p.group)}"></label>
        <label><span>Курс</span><select name="course">${[1,2,3,4,5,6].map(n => `<option value="${n}"${String(n) === p.course ? ' selected' : ''}>${n} курс</option>`).join('')}</select></label>
      </div>
      <label><span>Форма обучения</span><select name="form">${[['unknown','Выбрать позже'],['full','Очная'],['part','Очно-заочная'],['distance','Заочная']].map(([v,t]) => `<option value="${v}"${v === p.form ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
      <label><span>Факультет / институт</span><input name="faculty" placeholder="Можно оставить пустым" value="${esc(p.faculty)}"></label>
      <button class="save" type="submit">Сохранить профиль ${icon('arrow')}</button>
    </form>`;
}
