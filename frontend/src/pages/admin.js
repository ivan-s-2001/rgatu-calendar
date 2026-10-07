export function adminHome() {
  return `
    <div class="admin-page-head">
      <div><span class="eyebrow">управление учебным процессом</span><h1>Оперативная панель</h1><p>Административная среда университета.</p></div>
      <div class="rs-toolbar"><button class="rs-button rs-button--secondary">Отчёты</button><button class="rs-button rs-button--primary">Создать действие</button></div>
    </div>
    <div class="metric-grid metric-grid--admin">
      <article class="metric-card"><span>Студенты</span><strong>—</strong><small>активный контингент</small></article>
      <article class="metric-card"><span>Группы</span><strong>—</strong><small>текущий учебный год</small></article>
      <article class="metric-card"><span>Конфликты расписания</span><strong>—</strong><small>требуют решения</small></article>
      <article class="metric-card"><span>Открытые ведомости</span><strong>—</strong><small>ожидают завершения</small></article>
    </div>
    <section class="section admin-dashboard-grid">
      <div class="rs-panel">
        <div class="rs-panel__header"><div><span class="eyebrow">контроль</span><h2>Требует внимания</h2></div><span class="rs-status">backend не подключён</span></div>
        <div class="empty-workspace"><strong>Система будет собирать сюда исключения.</strong><p>Конфликты расписания, незакрытые ведомости, задолженности, ошибки контингента и истекающие сроки.</p></div>
      </div>
      <div class="rs-panel">
        <div class="rs-panel__header"><div><span class="eyebrow">учебный год</span><h2>Процессы</h2></div></div>
        <div class="process-list">
          <div><span>Контингент</span><b>—</b></div>
          <div><span>Расписание</span><b>—</b></div>
          <div><span>Промежуточная аттестация</span><b>—</b></div>
          <div><span>Задолженности</span><b>—</b></div>
        </div>
      </div>
    </section>`;
}

export function adminStudents() {
  return `
    <div class="admin-page-head">
      <div><span class="eyebrow">контингент</span><h1>Студенты</h1><p>Единый реестр с историей обучения и административными статусами.</p></div>
      <div class="rs-toolbar"><input class="admin-search" placeholder="ФИО, группа, зачётная книжка"><button class="rs-button rs-button--secondary">Фильтры</button></div>
    </div>
    <div class="rs-table-wrap">
      <table class="rs-table">
        <thead><tr><th>Студент</th><th>Группа</th><th>Программа</th><th>Курс</th><th>Форма</th><th>Статус</th><th>Долги</th></tr></thead>
        <tbody><tr><td colspan="7"><div class="table-empty">Контингент появится после подключения MariaDB.</div></td></tr></tbody>
      </table>
    </div>`;
}

export function adminGroups() {
  return `
    <div class="admin-page-head">
      <div><span class="eyebrow">структура обучения</span><h1>Группы</h1><p>Группа как административный объект: программа, курс, староста, контингент и учебный план.</p></div>
      <button class="rs-button rs-button--primary">Новая группа</button>
    </div>
    <div class="rs-table-wrap">
      <table class="rs-table">
        <thead><tr><th>Группа</th><th>Подразделение</th><th>Курс</th><th>Форма</th><th>Студентов</th><th>Староста</th><th>Статус</th></tr></thead>
        <tbody><tr><td colspan="7"><div class="table-empty">Нет загруженных групп.</div></td></tr></tbody>
      </table>
    </div>`;
}

export function adminSchedule() {
  return `
    <div class="admin-page-head">
      <div><span class="eyebrow">диспетчерская</span><h1>Расписание</h1><p>Назначения, аудитории, преподаватели, группы и конфликты.</p></div>
      <div class="rs-toolbar"><button class="rs-button rs-button--secondary">Импорт</button><button class="rs-button rs-button--primary">Добавить событие</button></div>
    </div>
    <div class="rs-panel"><div class="empty-workspace"><strong>Будет отдельный диспетчерский интерфейс.</strong><p>Не календарь для студента, а рабочая сетка для составления и проверки расписания всего университета.</p></div></div>`;
}

export function adminAcademic() {
  return `
    <div class="admin-page-head">
      <div><span class="eyebrow">академический процесс</span><h1>Учебный процесс</h1><p>Учебные планы, дисциплины, назначения преподавателей, аттестация и задолженности.</p></div>
    </div>
    <div class="workspace-cards workspace-cards--admin">
      <article class="rs-card workspace-card"><span class="eyebrow">основа</span><h3>Учебные планы</h3><p>Программы, семестры, дисциплины, часы и виды контроля.</p></article>
      <article class="rs-card workspace-card"><span class="eyebrow">нагрузка</span><h3>Назначения</h3><p>Кто, какой группе и какую дисциплину ведёт.</p></article>
      <article class="rs-card workspace-card"><span class="eyebrow">контроль</span><h3>Ведомости</h3><p>Создание, выдача, заполнение, закрытие и аудит изменений.</p></article>
      <article class="rs-card workspace-card"><span class="eyebrow">долги</span><h3>Задолженности</h3><p>Попытки, сроки ликвидации и комиссии.</p></article>
    </div>`;
}
