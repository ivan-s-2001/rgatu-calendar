const baseUrl = String(import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function get(path, options = {}) {
  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL is not configured.');
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(options.headers || {}),
    },
    signal: options.signal,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.error_message || `API request failed: ${response.status}`;
    throw new Error(message);
  }

  return payload?.data ?? payload;
}

export const api = Object.freeze({
  baseUrl,
  meta: (options) => get('/api/v1/meta', options),
  health: (options) => get('/api/v1/health', options),
  groups: (options) => get('/api/v1/groups', options),
});
