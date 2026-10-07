const safeRead = (key, fallback = '') => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};

const safeWrite = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[char]));

export const getActorRole = () => {
  const role = safeRead('hub.actorRole');
  return ['student', 'teacher', 'admin'].includes(role) ? role : '';
};

export const setActorRole = (role) => safeWrite('hub.actorRole', role);

export const getProfile = () => ({
  name: safeRead('hub.name'),
  group: safeRead('rgatu.group'),
  course: safeRead('hub.course', '1'),
  form: safeRead('hub.form', 'unknown'),
  faculty: safeRead('hub.faculty'),
});

export const saveStudentProfile = (data) => {
  safeWrite('hub.name', String(data.get('name') || '').trim());
  safeWrite('rgatu.group', String(data.get('group') || '').trim().toUpperCase());
  safeWrite('hub.course', String(data.get('course') || '1'));
  safeWrite('hub.form', String(data.get('form') || 'unknown'));
  safeWrite('hub.faculty', String(data.get('faculty') || '').trim());
};

export const formLabel = (value) => ({
  full: 'очная',
  part: 'очно-заочная',
  distance: 'заочная',
  unknown: 'форма не выбрана',
}[value] || value);
