# Авторизация

Целевая схема:

```
student.rsatu.ru ─┐
teacher.rsatu.ru ─┼── HTTPS + credentials ──> api.rsatu.ru
admin.rsatu.ru ───┘
```

## Сессия

Backend выдаёт opaque случайный токен в cookie:

- HttpOnly;
- Secure;
- SameSite=Lax;
- host-only для `api.rsatu.ru`;
- в MariaDB хранится только SHA-256 хэш токена.

Frontend не хранит access token в localStorage.

## CSRF

`GET /api/v1/me` выдаёт одноразово ротируемый `csrfToken` для текущей сессии. Frontend хранит его только в памяти и передаёт в `X-CSRF-Token` для изменяющих запросов.

При перезагрузке приложения frontend снова вызывает `/api/v1/me` и получает новый CSRF token.

## Временный password provider

До появления университетского SSO предусмотрен:

`POST /api/v1/auth/login`

с полями `login` и `password`.

Пароль проверяется через `password_verify()` против `user_account.password_hash`.

Это не архитектурная привязка к паролям. Позже login action заменяется или дополняется SSO/OIDC/SAML provider, а всё остальное — session, `/me`, RBAC, scope и фронтенды — остаётся прежним.

## /me

`GET /api/v1/me` возвращает:

- пользователя;
- ФИО;
- активные назначения ролей;
- scope каждого назначения;
- объединённые permissions;
- допустимые поверхности: `student`, `teacher`, `admin`;
- CSRF token.

Frontend не назначает себе роли самостоятельно.
