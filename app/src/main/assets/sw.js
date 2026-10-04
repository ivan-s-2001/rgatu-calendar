'use strict';
const UI = 'rgatu-ui-bc111403774fbdee', DATA = 'rgatu-database-v1';
const API = 'https://rgatu-calendar-api.ivan-s-2001.workers.dev';
const FILES = ['./', 'index.html', 'app.css', 'app.js', 'pwa.js', 'manifest.webmanifest', 'app-icon.svg', 'app-icon-192.png', 'app-icon-512.png'];
const ICONS = ['calendar','calendar-month','list','search','chevron-down','chevron-left','chevron-right','star','x','moon','sun','settings','download','file-spreadsheet','school','external-link','share','map-pin','user','check','refresh','info-circle','arrow-right','users'];
self.addEventListener('install', event => { event.waitUntil(caches.open(UI).then(cache => cache.addAll([...FILES, ...ICONS.map(x => 'icons/' + x + '.svg')]))); self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil((async () => { for (const key of await caches.keys()) if (key.startsWith('rgatu-ui-') && key !== UI) await caches.delete(key); await self.clients.claim(); })()); });
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.includes('/api/') || url.pathname.endsWith('schedule.json')) return;
  event.respondWith((async () => { const cache = await caches.open(UI), saved = await cache.match(event.request); if (saved) return saved; try { const response = await fetch(event.request); if (response.ok) await cache.put(event.request, response.clone()); return response; } catch { if (event.request.mode === 'navigate') return cache.match('index.html'); throw new Error('Нет подключения'); } })());
});
self.addEventListener('push', event => {
  event.waitUntil((async () => {
    let message; try { message = event.data.json(); } catch { return; }
    if (!/^[a-f0-9]{64}$/.test(message.revision || '')) return;
    const cache = await caches.open(DATA), marker = new URL('_last-notified', self.registration.scope).href;
    const last = await cache.match(marker);
    if (last && await last.text() === message.revision) return;
    await self.registration.showNotification(message.title || 'Расписание РГАТУ обновлено', { body: message.body || 'Опубликовано новое расписание.', icon: new URL('app-icon-192.png', self.registration.scope).href, badge: new URL('app-icon-192.png', self.registration.scope).href, tag: 'rgatu-schedule', data: { url: self.registration.scope, revision: message.revision } });
    await cache.put(marker, new Response(message.revision));
    try {
      const response = await fetch(API + '/api/schedule', { cache: 'no-store', signal: AbortSignal.timeout(15000) });
      if (response.ok) { const data = await response.clone().json(); if (/^[a-f0-9]{64}$/.test(data.revision || '')) { await cache.put(API + '/api/schedule', response); for (const client of await self.clients.matchAll({ type: 'window', includeUncontrolled: true })) client.postMessage({ type: 'schedule-updated' }); } }
    } catch { /* The notification remains visible; the app will refresh after reconnecting. */ }
  })());
});
self.addEventListener('notificationclick', event => { event.notification.close(); event.waitUntil((async () => { const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true }); for (const client of windows) if (client.url.startsWith(self.registration.scope)) { await client.focus(); client.postMessage({ type: 'schedule-updated' }); return; } await self.clients.openWindow(self.registration.scope); })()); });
