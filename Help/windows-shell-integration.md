# Windows: меню Проводника и «Открыть с помощью»

Интеграция работает только на **Windows** (реестр HKCU, текущий пользователь).

## Контекстное меню

В **Настройки → Общие** включите **«Добавить в контекстное меню»** или нажмите **«Зарегистрировать»**:

- **Открыть в FluxAlloy** — открывает файл в редакторе (`--fluxalloy-shell-open`).
- **Быстро конвертировать в MP4** — экспорт через ffmpeg (`--fluxalloy-shell-quick-mp4`).

Поддерживаются распространённые расширения видео (`.mp4`, `.mkv`, `.webm`, …). Установщик `Setup.exe` регистрирует меню после установки; portable — вручную.

## «Открыть с помощью»

Отдельная галочка **«Показывать в Открыть с помощью»** добавляет FluxAlloy в список приложений для видео. Это **не** делает FluxAlloy приложением по умолчанию.

Чтобы назначить плеер или редактор по умолчанию: кнопка **«Приложения по умолчанию…»** в настройках (или **Параметры Windows → Приложения → Приложения по умолчанию**).

## Повторный запуск

Если FluxAlloy уже запущен, второй вызов из Проводника передаёт путь в работающее окно (single-instance).

См. также [workflows-planner-scenarios.md](workflows-planner-scenarios.md), [getting-started.md](getting-started.md). Ручной smoke блока **Windows shell** в Support ZIP — [owner-manual-smoke.md](owner-manual-smoke.md) (`ownerManualSmoke:`; §21 e2e per-step `e2e <id>:` в `releaseSmoke:`); dev-блок `terminalHints:` (§8, 24 статьи) — [logging-and-diagnostics.md](logging-and-diagnostics.md); packaged open-file — [packaged-windows-smoke.md](packaged-windows-smoke.md); Help: `check:help-workflow-smoke-crosslinks` (44 статьи).
