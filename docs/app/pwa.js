'use strict';
(() => {
  if (typeof Android !== 'undefined') return;
  const API = 'https://rgatu-calendar-api.ivan-s-2001.workers.dev';
  const CACHE = 'rgatu-database-v1';
  let registration, installPrompt, checking = false;
  const owner = () => {
    let key = localStorage.getItem('rgatu-push-owner');
    if (!key) { key = [...crypto.getRandomValues(new Uint8Array(32))].map(x => x.toString(16).padStart(2, '0')).join(''); localStorage.setItem('rgatu-push-owner', key); }
    return key;
  };
  const decode = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - s.length % 4) % 4)), c => c.charCodeAt(0));
  async function request(path, input) {
    const response = await fetch(API + path, { ...(input ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) } : {}), signal: AbortSignal.timeout(15000), cache: 'no-store' });
    const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Сервер временно недоступен'); return data;
  }
  async function store(data) { const cache = await caches.open(CACHE); await cache.put(API + '/api/schedule', new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })); }
  async function saved() { try { const response = await (await caches.open(CACHE)).match(API + '/api/schedule'); return response ? await response.json() : null; } catch { return null; } }
  async function sync(silent = false) {
    if (checking) return; checking = true;
    try {
      const manifest = await request('/api/latest'), old = await saved();
      const changed = !old || old.revision !== manifest.revision;
      let data = old;
      if (changed) {
        const response = await fetch(API + '/api/schedule', { cache: 'no-store', signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error('Не удалось получить расписание');
        const text = await response.text();
        const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))].map(x => x.toString(16).padStart(2, '0')).join('');
        data = JSON.parse(text);
        if (digest !== manifest.sha256 || data.revision !== manifest.revision) throw new Error('База обновляется. Повторите проверку позже.');
        await store(data);
      }
      const result = { changed, data, message: changed ? 'Открыта новая версия официальной базы.' : 'База совпадает с последней опубликованной версией.' };
      if (silent) window.onAutoSync?.(result); else window.onSyncComplete?.(result);
    } catch (error) { if (!silent) window.onSyncComplete?.({ error: error.message + '. Сохранённое расписание доступно офлайн.' }); }
    finally { checking = false; }
  }
  window.PWA = {
    enabled: false,
    async data() {
      const cached = await saved();
      if (cached) { queueMicrotask(() => sync(true)); return cached; }
      try { const data = await request('/api/schedule'); await store(data); return data; }
      catch { const response = await fetch('schedule.json'); if (!response.ok) throw new Error('Нет сохранённого расписания'); const data = await response.json(); await store(data); return data; }
    },
    sync,
    async notifications(enabled) {
      try {
        if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) throw new Error('Этот браузер не поддерживает push. Откройте приложение в Chrome на Android.');
        registration = await navigator.serviceWorker.ready;
        const current = await registration.pushManager.getSubscription();
        if (!enabled) {
          const id = localStorage.getItem('rgatu-push-id');
          if (id) await request('/api/push/unsubscribe', { id, owner: owner() }).catch(() => {});
          if (current) await current.unsubscribe();
          localStorage.removeItem('rgatu-push-id'); this.enabled = false;
        } else {
          if (await Notification.requestPermission() !== 'granted') throw new Error('Разрешите уведомления в настройках браузера.');
          const config = await request('/api/config');
          const subscription = current || await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decode(config.vapidPublicKey) });
          const result = await request('/api/push/subscribe', { subscription: subscription.toJSON(), owner: owner() });
          localStorage.setItem('rgatu-push-id', result.id); this.enabled = true;
        }
        window.onNotificationPermission?.(); window.notify?.(enabled ? 'Уведомления подключены' : 'Уведомления отключены');
      } catch (error) { this.enabled = false; window.onNotificationPermission?.(); window.notify?.(error.message); }
    },
    async install() {
      if (installPrompt) { await installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; }
      else window.notify?.('В меню браузера выберите «Установить приложение» или «Добавить на главный экран».');
    },
  };
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installPrompt = event; });
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { scope: './' }).then(async reg => {
      registration = reg;
      const subscription = await reg.pushManager.getSubscription();
      PWA.enabled = !!subscription && Notification.permission === 'granted' && !!localStorage.getItem('rgatu-push-id');
      window.onNotificationPermission?.();
    }).catch(() => {});
    navigator.serviceWorker.addEventListener('message', async event => { if (event.data?.type === 'schedule-updated') { const data = await saved(); if (data) window.onAutoSync?.({ changed: true, data }); } });
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') sync(true); });
  window.addEventListener('online', () => sync(true));
  setInterval(() => { if (document.visibilityState === 'visible') sync(true); }, 60 * 60 * 1000);
})();
