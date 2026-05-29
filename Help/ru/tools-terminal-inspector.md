# Терминал и инспектор

## Терминал

Вкладка **«Терминал»** собирает команду из подсказок и проверяет её перед запуском. Разрешены только три типа команд — загрузчик ссылок, перекодировщик и анализатор медиа — чтобы случайно не запустить постороннюю программу.

Подсказки подгружаются из поставляемых списков и из **встроенных сценариев** для типовых задач (готовая строка команды и русский `summary`). В каталоге справа есть чип **«Сценарии»** — показывает только такие подсказки, без токенов из JSON.

Тексты сценариев правят в `src/shared/terminal-contract-hints-*.ts` (канон **`terminal-contract-hints-meta`**, 14 загрузки + 8 превью (22 файла)); после правок `summary` — **`npm run locales:terminal-summaries-ru`** (дважды до **0** замен) и при необходимости **`npm run locales:terminal-scenario-stream-gloss`**. Подробности — в [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md).

## Инспектор

Пункт меню **«Инструменты» → «Инспектор»** (или маршрут **«Инспектор»** в sidebar) открывает поверхность shell с таблицами дорожек и сырым отчётом анализатора. Оттуда же удобно **копировать JSON** в буфер обмена.

См. также [probe-and-inspector-basics.md](probe-and-inspector-basics.md).

Журналы и архив поддержки — [logging-and-diagnostics.md](logging-and-diagnostics.md).

## См. также

[about-support-logs.md](about-support-logs.md) · [logging-and-diagnostics.md](logging-and-diagnostics.md).
