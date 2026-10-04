'use strict';
fetch('version.json', { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(release => {
  if (!Number.isInteger(release.versionCode) || !/^downloads\/[A-Za-z0-9._-]+\.apk$/.test(release.apk || '')) return;
  document.querySelector('#apk').href = release.apk;
  document.querySelector('#release').textContent = 'Версия ' + release.versionName + ' · ' + (release.bytes / 1024 / 1024).toFixed(1) + ' МБ · Android 8.0 и новее';
}).catch(() => {});
