import { SOURCE, SOURCES, sha256, revisionOf, difference } from './model.js';
import { parseXlsx, parsePage } from './parser.js';
import { sendPush, unb64 } from './push.js';
import { assets } from './assets.generated.js';

const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
const stamp = () => new Date().toISOString();
async function body(request, limit = 16384) {
  const bytes = await bounded(request.body, limit); return JSON.parse(new TextDecoder().decode(bytes));
}
async function bounded(stream, limit) {
  if (!stream) throw new Error('Пустой ответ');
  const reader = stream.getReader(), chunks = []; let size = 0;
  try { for (;;) { const { value, done } = await reader.read(); if (done) break; size += value.length; if (size > limit) throw new Error('Превышен размер данных'); chunks.push(value); } }
  finally { await reader.cancel().catch(() => {}); }
  const out = new Uint8Array(size); let offset = 0; for (const part of chunks) { out.set(part, offset); offset += part.length; } return out;
}
async function officialFetch(url, limit) {
  for (let redirects = 0; redirects < 4; redirects++) {
    const target = new URL(url);
    if (!['www.rsatu.ru', 'rsatu.ru'].includes(target.hostname) || !['http:', 'https:'].includes(target.protocol) || target.username || target.password) throw new Error('Недопустимый источник');
    const response = await fetch(target.href, { redirect: 'manual', headers: { 'User-Agent': 'RGATU-Calendar/1.0 (schedule check every hour)', Accept: 'text/html,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }, signal: AbortSignal.timeout(25000) });
    if ([301, 302, 303, 307, 308].includes(response.status)) { const location = response.headers.get('Location'); await response.body?.cancel(); if (!location) throw new Error('Ошибка перенаправления'); url = new URL(location, target).href; continue; }
    if (!response.ok) { await response.body?.cancel(); throw new Error('Сайт РГАТУ вернул HTTP ' + response.status); }
    return { bytes: await bounded(response.body, limit), url: target.href, contentType: response.headers.get('Content-Type') || '' };
  }
  throw new Error('Слишком много перенаправлений');
}
async function state(env) { return env.DB.prepare('SELECT * FROM state WHERE id=1').first(); }
async function ingest(env, data, notices = [], sourceHash = '', notify = true) {
  const current = await state(env), old = current.json ? JSON.parse(current.json) : null;
  const revision = await revisionOf(data, notices), now = stamp();
  if (revision === current.revision) {
    const manifest = JSON.parse(current.manifest); manifest.checkedAt = now;
    await env.DB.prepare('UPDATE state SET manifest=?,source_hash=? WHERE id=1').bind(JSON.stringify(manifest), sourceHash || current.source_hash || '').run();
    return { changed: false, revision };
  }
  const diff = difference(old, data); if (!old) { diff.changes = { added: 0, changed: 0, removed: 0 }; diff.details = []; }
  const infoChanged = JSON.stringify(old?.notices || []) !== JSON.stringify(notices);
  data = { ...data, revision, notices, source: { ...data.source, pageUrl: SOURCE } };
  const text = JSON.stringify(data);
  const manifest = { revision, data: 'api/schedule', sha256: await sha256(text), checkedAt: now, publishedAt: now, sourceUrl: SOURCE, fileUrl: data.source.fileUrl || '', changes: diff.changes, infoChanged, checkFrequency: '60 minutes' };
  const { added, changed, removed } = diff.changes;
  const payload = JSON.stringify({ revision, title: 'Расписание РГАТУ обновлено', body: `Добавлено: ${added}. Изменено: ${changed}. Удалено: ${removed}.${infoChanged ? ' Обновлена информация на сайте.' : ''}`, url: '/app/' });
  const statements = [
    env.DB.prepare('UPDATE state SET revision=?,json=?,manifest=?,source_hash=? WHERE id=1').bind(revision, text, JSON.stringify(manifest), sourceHash),
    env.DB.prepare('INSERT OR IGNORE INTO revisions(revision,published_at,changes) VALUES(?,?,?)').bind(revision, now, JSON.stringify({ revision, publishedAt: now, changes: diff.changes, infoChanged, details: diff.details })),
  ];
  if (notify && old) statements.push(env.DB.prepare('INSERT OR IGNORE INTO outbox(revision,subscription_id,payload) SELECT ?,id,? FROM subscriptions').bind(revision, payload));
  await env.DB.batch(statements);
  return { changed: true, revision, changes: diff.changes, infoChanged };
}
async function poll(env) {
  const now = Date.now();
  const claim = await env.DB.prepare('UPDATE state SET lease_until=? WHERE id=1 AND lease_until<?').bind(now + 10 * 60000, now).run();
  if (!claim.meta.changes) return { skipped: true };
  const previousStatus = JSON.parse((await state(env)).status || '{}');
  const status = { lastAttempt: stamp(), intervalMinutes: 60, sources: [], lastSuccess: previousStatus.lastSuccess || null, lastChange: previousStatus.lastChange || null };
  await env.DB.prepare('UPDATE state SET status=? WHERE id=1').bind(JSON.stringify(status)).run();
  try {
    const current = await state(env), previous = previousStatus;
    const snapshots = await env.DB.prepare('SELECT * FROM source_snapshots').all();
    const saved = new Map(snapshots.results.map(s => [s.source, s]));
    if (!saved.has('session') && current.json) saved.set('session', { source: 'session', json: current.json, notices: JSON.stringify(JSON.parse(current.json).notices || []), source_hash: current.source_hash });
    let anySuccess = false;
    for (const source of SOURCES) {
      try {
        const page = await officialFetch(source.url, 4 * 1024 * 1024);
        const html = new TextDecoder(/windows-1251|cp1251/i.test(page.contentType) ? 'windows-1251' : 'utf-8').decode(page.bytes);
        const { links, notices } = parsePage(html, source.url), previousSource = saved.get(source.id);
        if (!links.length) {
          // Text announcements can change even before an XLSX is published.
          const snapshot = { source: source.id, json: previousSource?.json || null, notices: JSON.stringify(notices), source_hash: await sha256(JSON.stringify(notices)), checked_at: stamp() };
          saved.set(source.id, snapshot);
          await env.DB.prepare('INSERT INTO source_snapshots(source,json,notices,source_hash,checked_at) VALUES(?,?,?,?,?) ON CONFLICT(source) DO UPDATE SET notices=excluded.notices,source_hash=excluded.source_hash,checked_at=excluded.checked_at').bind(snapshot.source, snapshot.json, snapshot.notices, snapshot.source_hash, snapshot.checked_at).run();
          status.sources.push({ ...source, checkedAt: stamp(), fileFound: false, error: null }); anySuccess = true; continue;
        }
        const link = links[0], file = await officialFetch(link.url, 25 * 1024 * 1024);
        if (file.bytes[0] !== 80 || file.bytes[1] !== 75) throw new Error('Источник вернул не XLSX');
        const prefix = new TextEncoder().encode(JSON.stringify(notices)); const combined = new Uint8Array(prefix.length + file.bytes.length); combined.set(prefix); combined.set(file.bytes, prefix.length);
        const sourceHash = await sha256(combined);
        if (sourceHash !== previousSource?.source_hash || !previousSource?.json) {
          const data = await parseXlsx(file.bytes, link.name); data.source = { ...data.source, pageUrl: source.url, fileUrl: file.url };
          const snapshot = { source: source.id, json: JSON.stringify(data), notices: JSON.stringify(notices), source_hash: sourceHash, checked_at: stamp() };
          await env.DB.prepare('INSERT INTO source_snapshots(source,json,notices,source_hash,checked_at) VALUES(?,?,?,?,?) ON CONFLICT(source) DO UPDATE SET json=excluded.json,notices=excluded.notices,source_hash=excluded.source_hash,checked_at=excluded.checked_at').bind(snapshot.source, snapshot.json, snapshot.notices, snapshot.source_hash, snapshot.checked_at).run(); saved.set(source.id, snapshot);
        }
        status.sources.push({ ...source, checkedAt: stamp(), fileFound: true, error: null }); anySuccess = true;
      } catch (error) { status.sources.push({ ...source, checkedAt: stamp(), error: String(error.message).slice(0, 200) }); }
    }
    if (!anySuccess) throw new Error('Официальные страницы временно недоступны');
    const available = SOURCES.filter(s => saved.get(s.id)?.json);
    const primary = JSON.parse(saved.get('session')?.json || saved.get(available[0]?.id)?.json || current.json);
    const sheets = [], notices = [];
    for (const source of SOURCES) {
      const snapshot = saved.get(source.id); if (!snapshot) continue;
      notices.push(...JSON.parse(snapshot.notices).map(text => source.id === 'session' ? text : source.title + ': ' + text));
      if (!snapshot.json) continue;
      const data = JSON.parse(snapshot.json);
      for (const sheet of data.sheets) sheets.push(source.id === 'session' ? sheet : { ...sheet, id: source.id + '-' + sheet.id, sourceId: source.id, title: source.title + ' · ' + sheet.title, entities: sheet.entities.map(e => ({ ...e, id: source.id + '-' + e.id })) });
    }
    const data = { schemaVersion: 1, source: { ...primary.source, name: available.length > 1 ? 'Расписание сессии и занятий ФЗО' : primary.source.name, pages: SOURCES.map(s => s.url) }, sheets };
    const result = await ingest(env, data, [...new Set(notices)].sort());
    Object.assign(status, { lastSuccess: stamp(), sourceError: status.sources.some(s => s.error) ? 'Часть источников недоступна; сохранены последние данные' : null, lastChange: result.changed ? stamp() : previous.lastChange || null });
    return result;
  } catch (error) {
    const current = await state(env), previous = previousStatus;
    Object.assign(status, { lastSuccess: previous.lastSuccess || null, lastChange: previous.lastChange || null, sourceError: String(error.message).slice(0, 250) });
    return { error: status.sourceError };
  } finally {
    await env.DB.prepare('UPDATE state SET status=?,lease_until=0 WHERE id=1').bind(JSON.stringify(status)).run();
    await env.DB.batch([env.DB.prepare('DELETE FROM limits WHERE expires<?').bind(Date.now()), env.DB.prepare('DELETE FROM outbox WHERE delivered_at<?').bind(Date.now() - 30 * 86400000), env.DB.prepare('DELETE FROM revisions WHERE revision NOT IN (SELECT revision FROM revisions ORDER BY published_at DESC LIMIT 30)')]);
  }
}
async function deliver(env, continueWork = true) {
  const rows = await env.DB.prepare('SELECT o.*,s.transport,s.payload AS subscription FROM outbox o LEFT JOIN subscriptions s ON s.id=o.subscription_id WHERE o.delivered_at IS NULL AND o.next_attempt<=? AND o.attempts<8 LIMIT 10').bind(Date.now()).all();
  // Claim each delivery before the network call; concurrent cron and continuation cannot send it twice.
  for (const item of rows.results) {
    const claim = await env.DB.prepare('UPDATE outbox SET next_attempt=? WHERE revision=? AND subscription_id=? AND delivered_at IS NULL AND next_attempt<=?').bind(Date.now() + 120000, item.revision, item.subscription_id, Date.now()).run();
    if (!claim.meta.changes) continue;
    let expired = !item.transport, ok = expired;
    try {
      if (!expired) {
        const response = await sendPush(env, { transport: item.transport, payload: item.subscription }, JSON.parse(item.payload));
        ok = response.ok; expired = response.status === 410 || (item.transport === 'web' && response.status === 404);
        if (item.transport === 'android' && response.status === 404) { const text = await response.text(); expired = text.includes('UNREGISTERED'); }
        else await response.body?.cancel();
      }
    } catch { /* Retry transient transport failures without changing the schedule. */ }
    if (ok || expired) {
      const statements = [env.DB.prepare('UPDATE outbox SET delivered_at=? WHERE revision=? AND subscription_id=?').bind(Date.now(), item.revision, item.subscription_id)];
      if (expired) statements.push(env.DB.prepare('DELETE FROM subscriptions WHERE id=?').bind(item.subscription_id));
      await env.DB.batch(statements);
    } else await env.DB.prepare('UPDATE outbox SET attempts=attempts+1,next_attempt=? WHERE revision=? AND subscription_id=?').bind(Date.now() + Math.min(86400000, 60000 * 2 ** item.attempts), item.revision, item.subscription_id).run();
  }
  if (continueWork && rows.results.length === 10) {
    // The continuation is another Worker invocation with its own subrequest budget.
    const response = await fetch(env.SELF_URL + '/internal/deliver', { method: 'POST', headers: { Authorization: 'Bearer ' + env.ADMIN_TOKEN }, signal: AbortSignal.timeout(20000) });
    await response.body?.cancel();
  }
  return { processed: rows.results.length };
}
function cors(request, env, response) {
  const origin = request.headers.get('Origin');
  if (origin && [env.PWA_ORIGIN, env.SELF_URL].includes(origin)) { response.headers.set('Access-Control-Allow-Origin', origin); response.headers.set('Vary', 'Origin'); }
  response.headers.set('X-Content-Type-Options', 'nosniff'); response.headers.set('Referrer-Policy', 'no-referrer'); return response;
}
async function rateLimit(request, env) {
  const bucket = await sha256((request.headers.get('CF-Connecting-IP') || 'unknown') + '|' + Math.floor(Date.now() / 60000));
  const row = await env.DB.prepare('INSERT INTO limits(bucket,count,expires) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1 RETURNING count').bind(bucket, Date.now() + 120000).first();
  return row.count <= 10;
}
async function api(request, env, ctx) {
  const url = new URL(request.url), path = url.pathname;
  if (path.startsWith('/internal/')) {
    if (request.method !== 'POST' || !env.ADMIN_TOKEN || request.headers.get('Authorization') !== 'Bearer ' + env.ADMIN_TOKEN) return json({ error: 'Недоступно' }, 401);
    if (path === '/internal/ingest') { const input = await body(request, 16 * 1024 * 1024); return json(await ingest(env, input.data, input.notices || [], input.sourceHash || '', input.notify !== false)); }
    if (path === '/internal/poll') { const result = await poll(env); ctx.waitUntil(deliver(env)); return json(result); }
    if (path === '/internal/deliver') { ctx.waitUntil(deliver(env)); return json({ queued: true }); }
    return json({ error: 'Не найдено' }, 404);
  }
  const origin = request.headers.get('Origin');
  if (origin && ![env.PWA_ORIGIN, env.SELF_URL].includes(origin)) return json({ error: 'Недопустимый источник запроса' }, 403);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400' } });
  if (request.method === 'GET') {
    if (path === '/api/config') return json({ intervalMinutes: 60, vapidPublicKey: env.VAPID_PUBLIC, android: env.FCM_PUBLIC_CONFIG ? JSON.parse(env.FCM_PUBLIC_CONFIG) : null, fcmConfigured: !!env.FCM_SERVICE_ACCOUNT });
    if (path === '/api/status') { const current = await state(env); const status = JSON.parse(current.status || '{}'); if (!status.lastAttempt && current.json) { await poll(env); return json({ ...JSON.parse((await state(env)).status || '{}'), revision: current.revision, databaseReady: true, intervalMinutes: 60, fcmConfigured: !!env.FCM_SERVICE_ACCOUNT }); } return json({ ...status, revision: current.revision, databaseReady: !!current.json, intervalMinutes: 60, fcmConfigured: !!env.FCM_SERVICE_ACCOUNT }); }
    if (path === '/api/latest') { const current = await state(env); return current.manifest ? new Response(current.manifest, { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } }) : json({ error: 'База ещё не загружена' }, 503); }
    if (path === '/api/schedule' || path === '/app/schedule.json') {
      const current = await state(env); if (!current.json) return json({ error: 'База ещё не загружена' }, 503);
      const headers = { 'Content-Type': 'application/json; charset=utf-8', ETag: '"' + current.revision + '"', 'Cache-Control': 'no-cache' };
      return new Response(request.headers.get('If-None-Match') === headers.ETag ? null : current.json, { status: request.headers.get('If-None-Match') === headers.ETag ? 304 : 200, headers });
    }
    if (path === '/api/changes') { const row = await env.DB.prepare('SELECT changes FROM revisions ORDER BY published_at DESC LIMIT 1').first(); return row ? new Response(row.changes, { headers: { 'Content-Type': 'application/json; charset=utf-8' } }) : json({ changes: { added: 0, changed: 0, removed: 0 } }); }
  }
  if (path === '/api/push/subscribe' || path === '/api/android/subscribe') {
    if (request.method !== 'POST') return json({ error: 'Метод не поддерживается' }, 405);
    if (!await rateLimit(request, env)) return json({ error: 'Слишком много запросов' }, 429);
    const input = await body(request), android = path.includes('/android/');
    if (!/^[a-f0-9]{64}$/.test(input.owner || '')) return json({ error: 'Нет ключа подписки' }, 400);
    let identifier, payload;
    if (android) {
      if (!env.FCM_SERVICE_ACCOUNT || !env.FCM_PUBLIC_CONFIG) return json({ error: 'Push Android ещё не настроен' }, 503);
      if (typeof input.token !== 'string' || !/^[A-Za-z0-9_:.-]{50,4096}$/.test(input.token)) return json({ error: 'Некорректный токен' }, 400);
      identifier = input.token; payload = JSON.stringify({ token: input.token });
    } else {
      const sub = input.subscription; let endpoint; try { endpoint = new URL(sub.endpoint); } catch { return json({ error: 'Некорректная подписка' }, 400); }
      const allowed = endpoint.hostname === 'fcm.googleapis.com' || endpoint.hostname === 'updates.push.services.mozilla.com' || endpoint.hostname.endsWith('.push.services.mozilla.com') || endpoint.hostname === 'web.push.apple.com' || endpoint.hostname.endsWith('.notify.windows.com');
      if (!allowed || endpoint.protocol !== 'https:' || endpoint.port || endpoint.username || endpoint.password || endpoint.href.length > 4096 || !sub.keys || !/^[A-Za-z0-9_-]{87}$/.test(sub.keys.p256dh || '') || !/^[A-Za-z0-9_-]{22}$/.test(sub.keys.auth || '') || unb64(sub.keys.p256dh)[0] !== 4) return json({ error: 'Некорректная подписка' }, 400);
      identifier = endpoint.href; payload = JSON.stringify({ endpoint: identifier, keys: sub.keys });
    }
    const id = await sha256(identifier), existing = await env.DB.prepare('SELECT owner FROM subscriptions WHERE id=?').bind(id).first();
    if (existing && existing.owner !== input.owner) return json({ error: 'Ключ подписки не совпал' }, 409);
    await env.DB.prepare('INSERT INTO subscriptions(id,transport,payload,owner,created_at) VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload').bind(id, android ? 'android' : 'web', payload, input.owner, Date.now()).run();
    return json({ id, subscribed: true });
  }
  if (path === '/api/push/unsubscribe' && request.method === 'POST') {
    if (!await rateLimit(request, env)) return json({ error: 'Слишком много запросов' }, 429);
    const input = await body(request); await env.DB.prepare('DELETE FROM subscriptions WHERE id=? AND owner=?').bind(input.id || '', input.owner || '').run(); return json({ subscribed: false });
  }
  if (request.method === 'GET' && assets[path]) { const asset = assets[path]; return new Response(asset.base64 ? Uint8Array.from(atob(asset.content), c => c.charCodeAt(0)) : asset.content, { headers: { 'Content-Type': asset.type, 'Cache-Control': path.endsWith('sw.js') ? 'no-cache' : 'public,max-age=300', ...(path.endsWith('sw.js') ? { 'Service-Worker-Allowed': '/app/' } : {}) } }); }
  if (path === '/') return Response.redirect(env.SELF_URL + '/app/', 302);
  return json({ error: 'Не найдено' }, 404);
}
export default {
  async fetch(request, env, ctx) { let response; try { response = await api(request, env, ctx); } catch { response = json({ error: 'Запрос не удалось обработать' }, 500); } return cors(request, env, response); },
  async scheduled(event, env, ctx) { await poll(env); ctx.waitUntil(deliver(env)); },
};
