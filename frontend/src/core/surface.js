export const SURFACE_META = Object.freeze({
  student: {
    id: 'student',
    domain: 'student.rsatu.ru',
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
    id: 'teacher',
    domain: 'teacher.rsatu.ru',
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
    id: 'admin',
    domain: 'admin.rsatu.ru',
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
});

export function resolveSurface() {
  const fromBuild = String(import.meta.env.VITE_APP_SURFACE || '').toLowerCase();
  if (SURFACE_META[fromBuild]) return fromBuild;

  const host = location.hostname.toLowerCase();
  if (host.startsWith('teacher.')) return 'teacher';
  if (host.startsWith('admin.')) return 'admin';
  return 'student';
}
