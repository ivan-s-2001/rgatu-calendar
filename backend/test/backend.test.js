import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { zipSync, strToU8 } from 'fflate';
import { parseXlsx, parsePage } from '../src/parser.js';
import { revisionOf, difference, sha256, canonical } from '../src/model.js';
import { encryptPush, vapidAuthorization, b64, unb64 } from '../src/push.js';

function fixture() {
  const files = {
    'xl/workbook.xml': '<workbook><sheets><sheet name="ФЗО" r:id="rId1"/></sheets></workbook>',
    'xl/_rels/workbook.xml.rels': '<Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/></Relationships>',
    'xl/worksheets/sheet1.xml': '<worksheet><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>Дата</t></is></c><c r="B1" t="inlineStr"><is><t>Группа</t></is></c><c r="C1" t="inlineStr"><is><t>ИСТ-25</t></is></c></row><row r="2"><c r="A2"><v>46190</v></c><c r="B2" t="inlineStr"><is><t>1 пара</t></is></c><c r="C2" t="inlineStr"><is><t>Математика &amp; физика Экзамен</t></is></c></row><row r="3"><c r="B3" t="inlineStr"><is><t>2 пара</t></is></c></row></sheetData><mergeCells><mergeCell ref="A2:A3"/><mergeCell ref="C2:C3"/></mergeCells></worksheet>',
  };
  return zipSync(Object.fromEntries(Object.entries(files).map(([k, v]) => [k, strToU8(v)])));
}
test('merged date and lesson cells preserve both pairs and XML text', async () => {
  const data = await parseXlsx(fixture(), 'fixture.xlsx');
  assert.equal(data.sheets.length, 1);
  const entries = data.sheets[0].entities[0].entries;
  assert.deepEqual(entries.map(x => x.pair), [1, 2]);
  assert.equal(entries[0].date, '2026-06-17');
  assert.equal(entries[0].text, 'Математика & физика Экзамен');
  assert.equal(entries[1].cell, 'C3');
});
test('empty or malformed workbooks cannot replace a valid database', async () => {
  await assert.rejects(() => parseXlsx(new Uint8Array([80, 75, 0]), 'bad.xlsx'));
  await assert.rejects(() => revisionOf({ schemaVersion: 1, sheets: [] }));
});
test('semantic revisions ignore formatting and detect actual changes', async () => {
  const data = await parseXlsx(fixture(), 'a.xlsx'), reformatted = structuredClone(data);
  reformatted.source.name = 'b.xlsx'; reformatted.sheets[0].entities[0].entries[0].text = 'Математика   & физика Экзамен';
  assert.equal(await revisionOf(data), await revisionOf(reformatted));
  reformatted.sheets[0].entities[0].entries[0].text = 'Другой экзамен';
  reformatted.sheets[0].entities[0].entries.pop();
  assert.deepEqual(difference(data, reformatted).changes, { added: 0, changed: 1, removed: 1 });
  assert.notEqual(await revisionOf(data), await revisionOf(reformatted));
  assert.notEqual(await revisionOf(data), await revisionOf(data, ['Сессия перенесена']));
});
test('source discovery only permits university XLSX URLs', () => {
  const page = parsePage('<h2>ФЗО</h2><a href="/file/Raspisanie_FZO_2026_23.06.2026.xlsx">Весенняя сессия ФЗО</a><a href="https://evil.example/FZO.xlsx">ФЗО</a><a href="/doc.pdf">Расписание ФЗО</a>');
  assert.equal(page.links.length, 1); assert.match(page.links[0].url, /^https:\/\/www\.rsatu\.ru\//);
});
test('Web Push encryption decrypts with the subscriber key using RFC 8291 HKDF', async () => {
  const keys = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const clientPublic = new Uint8Array(await crypto.subtle.exportKey('raw', keys.publicKey)), auth = crypto.getRandomValues(new Uint8Array(16));
  const message = { revision: 'a'.repeat(64), title: 'Обновление', body: 'Изменено: 1' };
  const encrypted = await encryptPush({ keys: { p256dh: b64(clientPublic), auth: b64(auth) } }, message);
  assert.equal(new DataView(encrypted.buffer).getUint32(16), 4096); assert.equal(encrypted[20], 65);
  const serverPublic = encrypted.slice(21, 86), salt = encrypted.slice(0, 16);
  const peer = await crypto.subtle.importKey('raw', serverPublic, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const shared = await crypto.subtle.deriveBits({ name: 'ECDH', public: peer }, keys.privateKey, 256);
  const info = new Uint8Array(14 + 65 + 65); info.set(new TextEncoder().encode('WebPush: info\0')); info.set(clientPublic, 14); info.set(serverPublic, 79);
  const ikm = await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt: auth, info }, await crypto.subtle.importKey('raw', shared, 'HKDF', false, ['deriveBits']), 256);
  const material = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  const derive = (s, length) => crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info: new TextEncoder().encode(s) }, material, length * 8);
  const cek = await derive('Content-Encoding: aes128gcm\0', 16), nonce = await derive('Content-Encoding: nonce\0', 12);
  const plain = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: nonce }, await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['decrypt']), encrypted.slice(86)));
  assert.equal(plain.at(-1), 2); assert.deepEqual(JSON.parse(new TextDecoder().decode(plain.slice(0, -1))), message);
});
test('VAPID JWT signature and audience are valid', async () => {
  const keys = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']), jwk = await crypto.subtle.exportKey('jwk', keys.privateKey);
  const value = await vapidAuthorization('https://fcm.googleapis.com/push/test', jwk, 'https://example.org');
  const token = value.match(/t=([^,]+)/)[1], [header, payload, signature] = token.split('.');
  assert.equal(JSON.parse(new TextDecoder().decode(unb64(payload))).aud, 'https://fcm.googleapis.com');
  assert.ok(await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, keys.publicKey, unb64(signature), new TextEncoder().encode(header + '.' + payload)));
});
if (process.env.RGATU_WORKBOOK) test('the real workbook matches the independent Java parser cell for cell', async () => {
  const data = await parseXlsx(readFileSync(process.env.RGATU_WORKBOOK), 'source.xlsx');
  const expected = JSON.parse(readFileSync('../app/src/main/assets/schedule.json', 'utf8'));
  assert.equal(await sha256(canonical(data.sheets)), await sha256(canonical(expected.sheets)));
  assert.equal(await revisionOf(data, expected.notices), expected.revision);
  assert.equal(data.sheets.flatMap(x => x.entities).reduce((n, x) => n + x.entries.length, 0), 3089);
});
