const enc = new TextEncoder();
export const b64 = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
export const unb64 = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - s.length % 4) % 4)), c => c.charCodeAt(0));
const join = (...a) => { const out = new Uint8Array(a.reduce((n, x) => n + x.length, 0)); let p = 0; for (const x of a) { out.set(x, p); p += x.length; } return out; };
async function hmac(key, value) { return new Uint8Array(await crypto.subtle.sign('HMAC', await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']), value)); }
async function expand(key, info, length) { return (await hmac(key, join(enc.encode(info), new Uint8Array([1])))).slice(0, length); }
export async function encryptPush(subscription, payload) {
  const client = unb64(subscription.keys.p256dh), auth = unb64(subscription.keys.auth);
  if (client.length !== 65 || client[0] !== 4 || auth.length !== 16) throw new Error('Некорректные ключи push');
  const local = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const publicKey = new Uint8Array(await crypto.subtle.exportKey('raw', local.publicKey));
  const peer = await crypto.subtle.importKey('raw', client, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: peer }, local.privateKey, 256));
  const ikm = (await hmac(await hmac(auth, shared), join(enc.encode('WebPush: info\0'), client, publicKey, new Uint8Array([1])))).slice(0, 32);
  const salt = crypto.getRandomValues(new Uint8Array(16)), prk = await hmac(salt, ikm);
  const cek = await expand(prk, 'Content-Encoding: aes128gcm\0', 16), nonce = await expand(prk, 'Content-Encoding: nonce\0', 12);
  const plaintext = join(enc.encode(JSON.stringify(payload)), new Uint8Array([2]));
  if (plaintext.length > 3500) throw new Error('Слишком большой push');
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']), plaintext));
  return join(salt, new Uint8Array([0, 0, 16, 0, 65]), publicKey, encrypted);
}
export async function vapidAuthorization(endpoint, jwk, subject) {
  const header = b64(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const payload = b64(enc.encode(JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: subject })));
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(header + '.' + payload));
  const pub = b64(join(new Uint8Array([4]), unb64(jwk.x), unb64(jwk.y)));
  return 'vapid t=' + header + '.' + payload + '.' + b64(sig) + ', k=' + pub;
}
let googleToken;
async function accessToken(account) {
  if (googleToken?.expires > Date.now() + 60000) return googleToken.value;
  const header = b64(enc.encode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))), now = Math.floor(Date.now() / 1000);
  const body = b64(enc.encode(JSON.stringify({ iss: account.client_email, scope: 'https://www.googleapis.com/auth/firebase.messaging', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 })));
  const der = unb64(account.private_key.replace(/-----[^-]+-----|\s/g, ''));
  const key = await crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const signature = b64(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, enc.encode(header + '.' + body)));
  const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: header + '.' + body + '.' + signature }), signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error('FCM авторизация недоступна');
  const data = await response.json(); googleToken = { value: data.access_token, expires: Date.now() + data.expires_in * 1000 }; return googleToken.value;
}
export async function sendPush(env, subscription, payload) {
  if (subscription.transport === 'web') {
    const sub = JSON.parse(subscription.payload), key = JSON.parse(env.VAPID_PRIVATE);
    return fetch(sub.endpoint, { method: 'POST', headers: { Authorization: await vapidAuthorization(sub.endpoint, key, env.SELF_URL), TTL: '86400', Urgency: 'normal', 'Content-Encoding': 'aes128gcm', 'Content-Type': 'application/octet-stream' }, body: await encryptPush(sub, payload), signal: AbortSignal.timeout(15000) });
  }
  if (!env.FCM_SERVICE_ACCOUNT) throw new Error('FCM не настроен');
  const account = JSON.parse(env.FCM_SERVICE_ACCOUNT);
  return fetch('https://fcm.googleapis.com/v1/projects/' + account.project_id + '/messages:send', { method: 'POST', headers: { Authorization: 'Bearer ' + await accessToken(account), 'Content-Type': 'application/json' }, body: JSON.stringify({ message: { token: JSON.parse(subscription.payload).token, data: { revision: payload.revision, title: payload.title, body: payload.body }, android: { priority: 'HIGH', ttl: '86400s' } } }), signal: AbortSignal.timeout(15000) });
}
