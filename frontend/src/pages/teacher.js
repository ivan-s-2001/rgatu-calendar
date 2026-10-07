export function teacherHome() {
  return `
    <div class="screen-head"><span class="eyebrow">рабочее место преподавателя</span><h1>Моя работа</h1><p>Только назначенный учебный процесс: занятия, проверки, оценки и ведомости.</p></div>
    <div class="metric-grid">
      <article class="metric-card"><span>Сегодня занятий</span><strong>—</strong><small>после подключения нагрузки</small></article>
      <article class="metric-card"><span>Работ на проверку</span><strong>—</strong><small>ДКР и задания</small></article>
      <article class="metric-card"><span>Ведомостей</span><strong>—</strong><small>требуют заполнения</small></article>
    </div>
    <section class="section">
      <div class="rs-panel">
        <div class="rs-panel__header"><div><span class="eyebrow">сегодня</span><h2>Занятия</h2></div><span class="rs-status">нет данных</span></div>
        <div class="empty-workspace"><strong>Нагрузка ещё не синхронизирована.</strong><p>Здесь будут только занятия, назначенные администрацией преподавателю.</p></div>
      </div>
    </section>`;
}

export function teacherGroups() {
  return `
    <div class="screen-head"><span class="eyebrow">назначения</span><h1>Мои группы</h1><p>Группы и дисциплины, назначенные учебной частью.</p></div>
    <div class="rs-table-wrap">
      <table class="rs-table">
        <thead><tr><th>Группа</th><th>Дисциплина</th><th>Семестр</th><th>Контроль</th><th>Статус</th></tr></thead>
        <tbody><tr><td colspan="5"><div class="table-empty">Назначения появятся после подключения backend.</div></td></tr></tbody>
      </table>
    </div>`;
}

export function teacherAssessment() {
  return `
    <div class="screen-head"><span class="eyebrow">аттестация</span><h1>Оценки и ведомости</h1><p>Преподаватель вносит результаты только в открытые администрацией формы.</p></div>
    <div class="workspace-cards">
      <article class="rs-card workspace-card"><span class="eyebrow">текущая работа</span><h3>Проверка работ</h3><p>ДКР, лабораторные, контрольные и другие назначенные формы.</p></article>
      <article class="rs-card workspace-card"><span class="eyebrow">официально</span><h3>Ведомости</h3><p>Заполнение открытых ведомостей без права самостоятельно создавать их.</p></article>
    </div>`;
}

export function teacherProfile() {
  return `
    <div class="screen-head"><span class="eyebrow">профиль</span><h1>Преподаватель</h1><p>Данные сотрудника, кафедра и назначенная нагрузка будут приходить из backend.</p></div>
    <div class="rs-panel"><div class="empty-workspace"><strong>Профиль пока не связан с учётной записью РГАТУ.</strong><p>После SSO локального редактирования здесь не будет.</p></div></div>`;
}
