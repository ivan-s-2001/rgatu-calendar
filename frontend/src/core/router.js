export function getPage(defaultPage = 'home') {
  const raw = location.hash.replace(/^#\/?/, '');
  if (!raw) return defaultPage;

  // Backward compatibility with the former #student/home style routes.
  const parts = raw.split('/').filter(Boolean);
  return parts.at(-1) || defaultPage;
}

export function go(page = 'home') {
  location.hash = page;
}
