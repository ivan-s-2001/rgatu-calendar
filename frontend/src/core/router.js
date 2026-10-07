const LEGACY = {
  home: 'student/home',
  schedule: 'student/schedule',
  services: 'student/services',
  profile: 'student/profile',
};

export function getRoute(role = 'student') {
  const raw = location.hash.replace(/^#\/?/, '');
  const migrated = LEGACY[raw] || raw;
  if (!migrated) return { role, page: 'home' };

  const [routeRole, page = 'home'] = migrated.split('/');
  if (!['student', 'teacher', 'admin'].includes(routeRole)) {
    return { role, page: 'home' };
  }
  return { role: routeRole, page };
}

export function go(role, page = 'home') {
  location.hash = `${role}/${page}`;
}
