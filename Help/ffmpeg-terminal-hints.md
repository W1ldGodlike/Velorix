# Подсказки терминала по ffmpeg / yt‑dlp

Обычному пользователю достаточно знать: вкладка **«Терминал»** подсказывает безопасные куски команд, показывает пример и по желанию ведёт на официальную справку в браузере. Ниже — техническая часть для тех, кто правит файлы данных или код сценариев.

Окно **Терминал** загружает `Data/ytdlp_commands.json` и `Data/ffmpeg_commands.json`. Каждый объект описывает токен, краткий текст на русском, пример строки и `docUrl` на официальную документацию. В каталоге подсказок чип **«Сценарии»** показывает только встроенные строки с `fullLine` (без токенов JSON).

Расширяйте JSON без перекомпиляции: файл копируется рядом с `FluxAlloy.exe` как `Data\*.json`.

## Полезное

Частые теги ffmpeg: `-i`, `-map`, `-c:v copy`, `-ss`, `-t`, аппаратные кодеки `*_nvenc`/`*_amf`/`*_qsv`. yt‑dlp — `-F`, `-f`, сеть через `--proxy` и авторизацию `--cookies`/из браузера.


## Встроенные сценарии (для разработчиков)

Подсказки вкладки **Загрузки** и превью задаются в шардах `src/shared/terminal-contract-hints-*.ts` (канон **`terminal-contract-hints-meta`**: 20 загрузки + 15 превью (35 файлов), 1056+833 подсказок; `npm run check:terminal-contract-hints-shards`). Barrel — `src/shared/terminal-contract.ts` (`summary` / `token` / `fullLine`). После правок в `summary` используйте **допишите ссылку**, а не устаревшую **допишите URL**, и пометку `(поле …)` для строк с `--print-to-file` и `flux-ytdlp-*.txt`; затем выполните **`npm run locales:terminal-summaries-ru`** **дважды**, пока второй прогон не выведет **0** замен и **0** gloss; при необходимости только глосс полей — **`npm run locales:terminal-flux-pole`**. Скрипты **не** меняют `fullLine`. Регрессия — `tests/shared/terminal-contract-scenarios.test.ts`.

Диагностика Support ZIP — [logging-and-diagnostics.md](logging-and-diagnostics.md).

## См. также

[owner-manual-smoke.md](owner-manual-smoke.md) (ручная проверка на железе) · [packaged-windows-smoke.md](packaged-windows-smoke.md) (smoke после `pack:dir`).
