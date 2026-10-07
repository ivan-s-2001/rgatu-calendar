# Yii3 API

Отдельный JSON backend для RGATU Student Hub.

## Требования

- PHP 8.2–8.5
- Composer
- MariaDB 11.6 или совместимая MySQL/MariaDB
- расширения `pdo_mysql`, `mbstring`

## Запуск

```bash
cp .env.example .env
docker compose up -d mariadb
composer install
php yii serve
```

По умолчанию API доступен на локальном адресе, который выведет Yii runner.

## API v1

- `GET /api/v1/meta`
- `GET /api/v1/health`
- `GET /api/v1/groups`

Схема БД находится в `database/schema.sql`.
