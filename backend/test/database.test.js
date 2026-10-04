import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker from '../src/worker.js';
import { b64 } from '../src/push.js';

function environment() {
  const sqlite = new DatabaseSync(':memory:'); sqlite.exec(readFileSync(new URL('../schema.sql', import.meta.url), 'utf8'));
  const DB = {
    prepare(sql) {
      let params = [];
      return { bind(...values) { params = values; return this; }, async first() { return sqlite.prepare(sql).get(...params) || null; }, async all() { return { results: sqlite.prepare(sql).all(...params) }; }, async run() { const result = sqlite.prepare(sql).run(...params); return { meta: { changes: Number(result.changes) } }; } };
    },
    async batch(statements) { sqlite.exec('BEGIN'); try { const results = []; for (const statement of statements) results.push(await statement.run()); sqlite.exec('COMMIT'); return results; } catch (e) { sqlite.exec('ROLLBACK'); throw e; } },
  };
  return { DB, ADMIN_TOKEN: 'test-admin', SELF_URL: 'https://example.test', PWA_ORIGIN: 'https://pwa.example.test', sqlite };
}
const data = () => ({ schemaVersion: 1, source: { name: 'fixture.xlsx' }, sheets: [{ id: 's0', title: 'ФЗО', kind: 'groups', dates: ['2026-10-05'], entities: [{ id: 'test', name: 'ЗИС-24', entries: [{ date: '2026-10-05', pair: 1, text: 'Математика Экзамен', cell: 'C2' }] }] }] });
function call(env, path, input, auth = false, origin) {
  const request = new Request(env.SELF_URL + path, { method: input === undefined ? 'GET' : 'POST', headers: { ...(auth ? { Authorization: 'Bearer ' + env.ADMIN_TOKEN } : {}), ...(origin ? { Origin: origin } : {}), ...(input ? { 'Content-Type': 'application/json' } : {}) }, ...(input === undefined ? {} : { body: JSON.stringify(input) }) });
  return worker.fetch(request, env, { waitUntil() {} });
}
test('verified ingest is atomic; only changed data queues subscriber notifications', async () => {
  const env = environment(), original = data();
  assert.equal((await call(env, '/internal/ingest', { data: original }, true)).status, 200);
  const initial = await (await call(env, '/api/latest')).json();
  const keys = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const subscription = { endpoint: 'https://fcm.googleapis.com/fcm/send/test-not-a-real-subscription', keys: { p256dh: b64(await crypto.subtle.exportKey('raw', keys.publicKey)), auth: b64(crypto.getRandomValues(new Uint8Array(16))) } };
  assert.equal((await call(env, '/api/push/subscribe', { owner: 'a'.repeat(64), subscription }, false, env.PWA_ORIGIN)).status, 200);
  await call(env, '/internal/ingest', { data: original }, true);
  assert.equal(env.sqlite.prepare('SELECT count(*) AS n FROM outbox').get().n, 0);
  const next = structuredClone(original); next.sheets[0].entities[0].entries[0].text = 'Физика Экзамен';
  await call(env, '/internal/ingest', { data: next }, true);
  assert.equal(env.sqlite.prepare('SELECT count(*) AS n FROM outbox').get().n, 1);
  const latest = await (await call(env, '/api/latest')).json(); assert.notEqual(latest.revision, initial.revision); assert.equal(latest.changes.changed, 1);
  assert.equal((await call(env, '/internal/ingest', { data: { schemaVersion: 1, sheets: [] } }, true)).status, 500);
  assert.equal((await (await call(env, '/api/latest')).json()).revision, latest.revision);
  const body = await (await call(env, '/api/schedule')).text();
  const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body)))].map(x => x.toString(16).padStart(2, '0')).join('');
  assert.equal(hash, latest.sha256); env.sqlite.close();
});
test('admin auth, origin and push endpoint validation protect database writes', async () => {
  const env = environment();
  assert.equal((await call(env, '/internal/ingest', { data: data() })).status, 401);
  assert.equal((await call(env, '/api/push/subscribe', {}, false, 'https://elsewhere.test')).status, 403);
  assert.equal((await call(env, '/api/push/subscribe', { owner: 'a'.repeat(64), subscription: { endpoint: 'https://127.0.0.1/test', keys: {} } })).status, 400);
  assert.equal((await call(env, '/api/android/subscribe', { owner: 'a'.repeat(64), token: 'b'.repeat(100) })).status, 503);
  env.sqlite.close();
});
