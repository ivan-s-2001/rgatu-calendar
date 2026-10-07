const baseUrl = String(import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

let csrfToken = '';

export class ApiError extends Error {
  constructor(message, status, payload = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

async function request(method, path, body = undefined, options = {}) {
  if (!baseUrl) {
    throw new ApiError('VITE_API_BASE_URL is not configured.', 0);
  }

  const headers = {
    Accept: 'application/json',
    ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...(csrfToken && !['GET', 'HEAD', 'OPTIONS'].includes(method)
      ? { 'X-CSRF-Token': csrfToken }
      : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    credentials: 'include',
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: options.signal,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      payload?.error_message || `API request failed: ${response.status}`,
      response.status,
      payload,
    );
  }

  const data = payload?.data ?? payload;

  if (data?.csrfToken) {
    csrfToken = data.csrfToken;
  }

  return data;
}

export const api = Object.freeze({
  baseUrl,

  meta: (options) => request('GET', '/api/v1/meta', undefined, options),
  health: (options) => request('GET', '/api/v1/health', undefined, options),
  groups: (options) => request('GET', '/api/v1/groups', undefined, options),

  login: (login, password, options) => request(
    'POST',
    '/api/v1/auth/login',
    { login, password },
    options,
  ),

  me: (options) => request('GET', '/api/v1/me', undefined, options),

  logout: async (options) => {
    const result = await request('POST', '/api/v1/auth/logout', {}, options);
    csrfToken = '';
    return result;
  },

  clearCsrf: () => {
    csrfToken = '';
  },
});
