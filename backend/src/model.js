export const SOURCE = 'https://www.rsatu.ru/students/raspisanie-sessii/';
export const SOURCES = [
  { id: 'session', title: 'Расписание сессии', url: SOURCE },
  { id: 'classes', title: 'Расписание занятий', url: 'https://www.rsatu.ru/students/raspisanie-zanyatiy/' },
];
const encoder = new TextEncoder();
export async function sha256(value) {
  const bytes = typeof value === 'string' ? encoder.encode(value) : value;
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(x => x.toString(16).padStart(2, '0')).join('');
}
export function canonical(value) {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonical(value[k])).join(',') + '}';
  return JSON.stringify(value);
}
export function records(data, groupsOnly = false) {
  const result = {};
  if (data?.schemaVersion !== 1 || !Array.isArray(data.sheets) || data.sheets.length > 30) throw new Error('Некорректное расписание');
  for (const sheet of data.sheets) {
    if (!['groups', 'teachers', 'rooms'].includes(sheet.kind)) throw new Error('Неизвестный вид расписания');
    for (const entity of sheet.entities) for (const entry of entity.entries) {
      if (!/^20\d\d-\d\d-\d\d$/.test(entry.date) || !Number.isInteger(entry.pair) || entry.pair < 1 || entry.pair > 20 || typeof entry.text !== 'string') throw new Error('Некорректная запись');
      if (groupsOnly && sheet.kind !== 'groups') continue;
      const key = [sheet.kind, entity.name, entry.date, entry.pair, ...(sheet.sourceId ? [sheet.sourceId] : [])].join('|');
      const text = entry.text.replace(/\s+/g, ' ').trim();
      if (key in result && result[key] !== text) throw new Error('Противоречащие записи');
      result[key] = text;
    }
  }
  if (!Object.keys(result).length) throw new Error('Пустое расписание не заменяет базу');
  return result;
}
export async function revisionOf(data, notices = []) { return sha256(canonical({ records: records(data), notices })); }
export function difference(before, after) {
  const old = before ? records(before, true) : {}, fresh = records(after, true);
  const changes = { added: 0, changed: 0, removed: 0 };
  const details = [];
  for (const [key, value] of Object.entries(fresh)) {
    if (!(key in old)) { changes.added++; details.push({ kind: 'added', key, after: value }); }
    else if (old[key] !== value) { changes.changed++; details.push({ kind: 'changed', key, before: old[key], after: value }); }
  }
  for (const [key, value] of Object.entries(old)) if (!(key in fresh)) { changes.removed++; details.push({ kind: 'removed', key, before: value }); }
  return { changes, details };
}
