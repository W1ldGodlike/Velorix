---
description: FluxAlloy coding standards (соответствие FLUXALLOY_TZ.md)
alwaysApply: true
---

Все изменения трактуйте только в связке с [`FLUXALLOY_TZ.md`](../../FLUXALLOY_TZ.md) и отмечайте прогресс в [`IMPLEMENTATION_CHECKLIST.md`](../../IMPLEMENTATION_CHECKLIST.md).

- **Автономность:** не спрашивать пользователя подтверждение на `run`, установки, перезапуски; выполнять самостоятельно. Неясности по ТЗ — короткий уточняющий вопрос, работа по остальным пунктам не стопорится.

- **Стек приложения:** **Electron + React + TypeScript** (§2 ТЗ). **Не** добавлять WinUI / `Microsoft.WindowsAppSDK` без явного запроса. Тяжёлые задачи (**ffmpeg**, **yt-dlp**, FS) только в **main process** через **whitelist IPC**; preload с `contextBridge`.

- Если файл слишком велик для одной генерации — разбивать на части и продолжать в следующих шагах.

- Не ослаблять проверки безопасности бинарников (`Data/trusted_hashes.json`, обновления хешей — §3 ТЗ).
