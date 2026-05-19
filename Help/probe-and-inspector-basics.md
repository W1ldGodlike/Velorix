# Инспектор и данные о файле в редакторе

## Что видно прямо в редакторе

Под таймлайном, когда файл уже открыт, показывается **одна короткая строка**: кратко про основное видео (размер кадра и кодек) и про звук (кодек). Это подсказка «что за файл», а не полный отчёт.

Чтобы посмотреть **формат контейнера, длительность, все дорожки, главы** и выбрать пресет уверенно, откройте окно инспектора (см. ниже).

## Отдельное окно

Пункт меню **«Инструменты»** открывает окно **инспектора** с таблицами дорожек, главами и сырым текстом отчёта. Там же можно сохранить отчёт в файл.

## Связь с терминалом

Подсказки для вкладки «Терминал» и ссылки на встроенные сценарии — в [tools-terminal-inspector.md](tools-terminal-inspector.md) и [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md).

## Packaged smoke (§19 / §21)

Ручной чеклист **ffprobe** — [owner-manual-smoke.md](owner-manual-smoke.md). После `npm run pack:dir` — шаг **ffprobe** в [packaged-windows-smoke.md](packaged-windows-smoke.md); §21 e2e per-step `e2e <id>:` в Support ZIP `releaseSmoke:`; dev-блок `terminalHints:` (§8) — [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md); Help: `check:help-workflow-smoke-crosslinks` (44 статьи).
