# Терминал и инспектор

## Терминал

Вкладка **«Терминал»** собирает команду из подсказок и проверяет её перед запуском. Разрешены только три типа команд — загрузчик ссылок, перекодировщик и анализатор медиа — чтобы случайно не запустить постороннюю программу.

Подсказки подгружаются из поставляемых списков и из **встроенных сценариев** для типовых задач (готовая строка команды и русский `summary`). В каталоге справа есть чип **«Сценарии»** — показывает только такие подсказки, без токенов из JSON.

Тексты сценариев правят в `src/shared/terminal-contract-hints-*.ts`; после правок `summary` — **`npm run locales:terminal-summaries-ru`** (дважды до **0** замен) и при необходимости **`npm run locales:terminal-scenario-stream-gloss`**. Подробности — в [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md).

## Инспектор

Пункт меню **«Инструменты»** открывает отдельное окно с таблицами дорожек и сырым отчётом анализатора. Оттуда же удобно **копировать JSON** в буфер обмена.

См. также [probe-and-inspector-basics.md](probe-and-inspector-basics.md).

## Packaged smoke (§19 / §21)

После `npm run pack:dir` проверьте bundled ffprobe/ffmpeg в [packaged-windows-smoke.md](packaged-windows-smoke.md). Полный owner bundle и per-step `e2e <id>:` в Support ZIP `releaseSmoke:` — [owner-manual-smoke.md](owner-manual-smoke.md), [about-support-logs.md](about-support-logs.md).
