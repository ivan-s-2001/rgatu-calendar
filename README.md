# Расписание заочников РГАТУ

Неофициальный Android и PWA просмотрщик расписания Рыбинского государственного авиационного технического университета имени П. А. Соловьёва.

Встроен официальный Excel весенней сессии ФЗО 2025–2026, редакция 23.06.2026: 70 групп, четыре листа, 3 089 исходных записей. Это архивная сессия. Время начала занятий не придумано: исходный файл содержит номера пар.

Рабочая PWA: https://rgatu-calendar-api.ivan-s-2001.workers.dev/app/

## Возможности

- Группы, преподаватели и аудитории; поиск, фильтры, день, месяц и вся сессия.
- Избранное, темы, офлайн база, исходный текст и ячейки каждой записи.
- Android: импорт собственного XLSX в отдельную локальную базу.
- PWA: установка на главный экран, Service Worker, офлайн данные и Web Push с VAPID.
- Сервер: Cloudflare Worker + D1, проверка раз в час, семантическое сравнение, атомарное обновление и очередь уведомлений.
- [ЛК1](https://old.rsatu.ru/fzo/kod.php), [ЛК2](https://lk.rsatu.ru/user/sign-in/login?_referrer=%2Fsite%2Findex) и полезные официальные разделы.

## Источники и обновления

1. https://www.rsatu.ru/students/raspisanie-sessii/
2. https://www.rsatu.ru/students/raspisanie-zanyatiy/

Cron: `0 * * * *` (UTC). Один раз в час сервер загружает каждую страницу и не более одного найденного XLSX ФЗО на страницу. Телефоны обращаются к нашей базе. Неизменённая база не создаёт уведомлений. При ошибке сохраняется предыдущий корректный снимок каждого источника. Объявления ФЗО тоже входят в сравнение. Старые записи при первом запуске не вызывают рассылку.

Парсер поддерживает матрицу «Дата / Группа, преподаватель или помещение» и строки «1 пара», «2 пара», включая объединённые ячейки. Незнакомый формат не заменяет базу. Состояние источников: `/api/status`.

## GitHub Pages

Страница скачивания, PWA, APK и `version.json` находятся в `docs/`. Включите Settings → Pages → Source → GitHub Actions. Для приватного репозитория требуется тариф GitHub с поддержкой Pages; бесплатная публикация доступна для публичных репозиториев. Код самостоятельно не меняет видимость репозитория.

## Android push: подключение Firebase

FCM SDK и серверный адаптер включены. Без конфигурации Firebase push в APK не активируется. PWA использует отдельный Web Push и Firebase не требует.

В Firebase зарегистрируйте Android приложение `ru.rgatu.parttime`. Установите Worker secrets:

- `FCM_PUBLIC_CONFIG`: JSON с `apiKey`, `appId` (mobilesdk_app_id), `projectId`, `messagingSenderId` из `google-services.json`.
- `FCM_SERVICE_ACCOUNT`: JSON служебной учётной записи с правом отправки FCM HTTP v1 и включённым API Cloud Messaging.

APK загружает публичные настройки из `/api/config`; после подключения FCM пересборка не требуется. Закрытые ключи не находятся в приложении или git.

## Сборка

Требуются JDK 17, Android SDK 35, Node.js 22+ и Gradle 8.9 (wrapper включён).

```sh
python3 tools/prepare_web.py
cd backend
npm ci && npm test && npm run build
cd ..
bash gradlew :app:assembleDebug
```

Подписанный APK:

```sh
export RGATU_KEYSTORE=/absolute/path/rgatu-release.jks
export RGATU_KEY_PASSWORD='your-private-password'
python3 tools/build_apk.py
```

Для следующих обновлений сохраните исходный ключ подписи. Увеличьте `VERSION_CODE` и `VERSION_NAME` в `MainActivity.java`, соберите APK и отправьте изменения `docs/`. Обновление поверх приложения требует того же package name и сертификата. Загруженное приложение «Мои пары» (`ru.ivan.myclasses`, debug подпись) является отдельным приложением; эту сборку можно установить рядом с ним.

## Backend

```sh
python3 tools/prepare_web.py
cd backend
npm ci && npm test && npm run build
npx wrangler d1 execute rgatu-calendar --remote --file schema.sql
npx wrangler secret put VAPID_PRIVATE
npx wrangler secret put ADMIN_TOKEN
npx wrangler deploy
```

В `wrangler.toml` задайте D1, `SELF_URL`, `PWA_ORIGIN` и `VAPID_PUBLIC`. При обновлении сервера сохраняйте ту же пару VAPID ключей. Платный тариф автоматически не включается.

API: `GET /api/config`, `/api/latest`, `/api/schedule`, `/api/status`, `/api/changes`; `POST /api/push/subscribe`, `/api/push/unsubscribe`, `/api/android/subscribe`. Служебные `/internal/ingest`, `/internal/poll`, `/internal/deliver` требуют `Authorization: Bearer ADMIN_TOKEN`. Push живёт 24 часа; истёкшие подписки удаляются. Сервер отправляет короткое уведомление с версией, после которого клиент загружает новую базу.

## Проверки

На исходном Excel Java и серверный парсер дали одинаковые листы, сущности, даты, пары, тексты, ячейки и все 3 089 записей. Тесты проверяют объединённые ячейки, смысловые изменения, отказ от пустой базы, допустимые источники, подпись VAPID и независимую расшифровку Web Push по RFC 8291.

Tabler Icons — MIT, лицензия в `app/src/main/assets/icons/LICENSE.txt`.
