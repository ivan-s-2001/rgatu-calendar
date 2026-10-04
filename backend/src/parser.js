import { unzipSync, strFromU8 } from 'fflate';
import { sha256, SOURCE } from './model.js';
const MAX = 64 * 1024 * 1024;
function decode(s = '') {
  return s.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (m, e) => {
    if (e[0] === '#') { const n = parseInt(e.slice(e[1].toLowerCase() === 'x' ? 2 : 1), e[1].toLowerCase() === 'x' ? 16 : 10); return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : ''; }
    return ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" })[e] ?? m;
  });
}
function attr(tag, key) { const m = tag.match(new RegExp('(?:^|\\s)' + key + '\\s*=\\s*(["\x27])(.*?)\\1', 's')); return decode(m?.[2] || ''); }
function texts(xml) { return [...xml.matchAll(/<(?:\w+:)?t\b[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/g)].map(m => decode(m[1])).join(''); }
function col(ref) { let n = 0; for (const c of ref.match(/^[A-Z]+/)?.[0] || '') n = n * 26 + c.charCodeAt(0) - 64; return n; }
function colName(n) { let s = ''; while (n) { n--; s = String.fromCharCode(65 + n % 26) + s; n = Math.floor(n / 26); } return s; }
function date(value, mode1904) {
  const m = value.trim().match(/^(\d{1,2})[./](\d{1,2})[./](\d{2,4})$/);
  if (m) {
    const y = +m[3] < 100 ? +m[3] + 2000 : +m[3], month = +m[2], day = +m[1];
    const d = new Date(Date.UTC(y, month - 1, day));
    return d.getUTCFullYear() === y && d.getUTCMonth() === month - 1 && d.getUTCDate() === day ? d.toISOString().slice(0, 10) : null;
  }
  const serial = Number(value);
  if (!value.trim() || !Number.isFinite(serial) || serial < 1 || serial > 90000) return null;
  return new Date((mode1904 ? Date.UTC(1904, 0, 1) : Date.UTC(1899, 11, 30)) + Math.floor(serial) * 86400000).toISOString().slice(0, 10);
}
export async function parseXlsx(bytes, name) {
  let size = 0, count = 0;
  const files = unzipSync(new Uint8Array(bytes), { filter: file => {
    if (++count > 2048 || (size += file.originalSize) > MAX) throw new Error('Слишком большой Excel');
    return file.name.startsWith('xl/') && /\.(xml|rels)$/.test(file.name);
  } });
  function xml(path) {
    if (!files[path]) throw new Error('В XLSX отсутствует ' + path);
    const s = strFromU8(files[path]);
    if (/<!DOCTYPE|<!ENTITY/i.test(s)) throw new Error('XML с DTD запрещён');
    return s;
  }
  const workbook = xml('xl/workbook.xml'), rels = {};
  for (const m of xml('xl/_rels/workbook.xml.rels').matchAll(/<(?:\w+:)?Relationship\b[^>]*>/g)) rels[attr(m[0], 'Id')] = attr(m[0], 'Target');
  const shared = files['xl/sharedStrings.xml'] ? [...xml('xl/sharedStrings.xml').matchAll(/<(?:\w+:)?si\b[^>]*>([\s\S]*?)<\/(?:\w+:)?si>/g)].map(m => texts(m[1])) : [];
  const mode1904 = /date1904\s*=\s*["'](?:1|true)["']/.test(workbook);
  const sheets = [], pendingIds = [];
  let recordCount = 0;
  for (const match of workbook.matchAll(/<(?:\w+:)?sheet\b[^>]*>/g)) {
    const target = rels[attr(match[0], 'r:id')]; if (!target) continue;
    const path = target.startsWith('/') ? target.slice(1) : 'xl/' + target;
    if (path.includes('..')) throw new Error('Некорректный путь листа');
    const sheetXml = xml(path), rows = new Map();
    for (const r of sheetXml.matchAll(/<(?:\w+:)?row\b([^>]*)(?<!\/)>([\s\S]*?)<\/(?:\w+:)?row>/g)) {
      const rn = +attr(r[1], 'r'); if (!rn || rn > 20000) throw new Error('Слишком много строк');
      const cells = new Map();
      for (const c of r[2].matchAll(/<(?:\w+:)?c\b([^>]*)(?<!\/)>([\s\S]*?)<\/(?:\w+:)?c>/g)) {
        const cn = col(attr(c[1], 'r')); if (!cn || cn > 2000) throw new Error('Слишком много столбцов');
        const type = attr(c[1], 't'), raw = c[2].match(/<(?:\w+:)?v\b[^>]*>([\s\S]*?)<\/(?:\w+:)?v>/)?.[1] || '';
        const value = type === 's' ? shared[+raw] : type === 'inlineStr' ? texts(c[2]) : decode(raw);
        if (value === undefined) throw new Error('Повреждён список строк');
        if (value.trim()) cells.set(cn, value);
      }
      rows.set(rn, cells);
    }
    for (const m of sheetXml.matchAll(/<(?:\w+:)?mergeCell\b[^>]*>/g)) {
      const [a, b] = attr(m[0], 'ref').split(':'); if (!b) continue;
      const c1 = col(a), c2 = col(b), r1 = +a.replace(/\D/g, ''), r2 = +b.replace(/\D/g, '');
      if (r2 > 20000 || c2 > 2000 || (r2 - r1 + 1) * (c2 - c1 + 1) > 50000) throw new Error('Слишком большая объединённая область');
      const value = rows.get(r1)?.get(c1); if (!value) continue;
      for (let r = r1; r <= r2; r++) { if (!rows.has(r)) rows.set(r, new Map()); for (let c = c1; c <= c2; c++) if (!rows.get(r).has(c)) rows.get(r).set(c, value); }
    }
    const ordered = [...rows].sort((a, b) => a[0] - b[0]);
    const header = ordered.find(([r, c]) => r <= 80 && /дат/i.test(c.get(1) || '') && /групп|преподавател|помещен|аудитор/i.test(c.get(2) || ''));
    if (!header) continue;
    const kind = /групп/i.test(header[1].get(2)) ? 'groups' : /преподавател/i.test(header[1].get(2)) ? 'teachers' : 'rooms';
    const entities = [...header[1]].filter(([c]) => c > 2).sort((a, b) => a[0] - b[0]).map(([column, name]) => ({ column, id: '', name: name.trim(), entries: [] }));
    for (const e of entities) pendingIds.push(sha256(kind + '|' + e.name).then(hash => { e.id = kind + '-' + hash.slice(0, 24); }));
    const dates = new Set(); let currentDate;
    for (const [r, cells] of ordered) {
      if (r <= header[0]) continue;
      if (cells.has(1)) currentDate = date(cells.get(1), mode1904);
      if (!currentDate) continue;
      dates.add(currentDate);
      const p = (cells.get(2) || '').trim().match(/^(\d{1,2})\s*(?:пара|пары|п\.?)(?:\s.*)?$/i);
      if (!p || +p[1] < 1 || +p[1] > 20) continue;
      for (const e of entities) { const text = cells.get(e.column); if (text?.trim()) { e.entries.push({ date: currentDate, pair: +p[1], text, cell: colName(e.column) + r }); recordCount++; } }
    }
    for (const e of entities) delete e.column;
    sheets.push({ id: 's' + sheets.length, title: attr(match[0], 'name'), kind, dates: [...dates].sort(), entities });
  }
  await Promise.all(pendingIds);
  if (!sheets.length || !recordCount) throw new Error('Не найдено расписание с датами и парами');
  return { schemaVersion: 1, source: { name, pageUrl: SOURCE }, sheets };
}
function plain(html) { return decode(html.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim(); }
export function parsePage(html, pageUrl = SOURCE) {
  const links = [];
  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = attr(m[1], 'href'); let url; try { url = new URL(href, pageUrl); } catch { continue; }
    if (!['www.rsatu.ru', 'rsatu.ru'].includes(url.hostname) || !['http:', 'https:'].includes(url.protocol) || !/\.xlsx$/i.test(url.pathname)) continue;
    const name = plain(m[2]) || decodeURIComponent(url.pathname.split('/').pop()), file = decodeURIComponent(url.pathname);
    const context = plain(html.slice(Math.max(0, m.index - 400), m.index));
    if (!/ФЗО|FZO|заочн/i.test(file + ' ' + name + ' ' + context)) continue;
    const years = (file + name).match(/20\d{2}/g) || ['2000'];
    const modified = (file + name).match(/(\d{2})[._-](\d{2})[._-](20\d{2})/);
    const score = Math.max(...years.map(Number)) * 10000 + (modified ? +modified[2] * 100 + +modified[1] : 0) + (/FZO|ФЗО|заочн/i.test(file) ? 1000 : 0);
    links.push({ url: url.href, name, score });
  }
  const notices = [...new Set(html.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi, '').split(/<[^>]+>/).map(plain).filter(t => t.length > 20 && /ФЗО|заочн|расписание звонков|\d\s*пара|экзамены.*начина/i.test(t)))].sort().slice(0, 60);
  return { links: links.sort((a, b) => b.score - a.score), notices };
}
