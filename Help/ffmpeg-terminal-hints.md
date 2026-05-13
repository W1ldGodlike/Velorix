# Подсказки терминала по ffmpeg / yt‑dlp

Окно **Терминал** загружает `Data/ytdlp_commands.json` и `Data/ffmpeg_commands.json`. Каждый объект описывает токен, краткий текст на русском, пример строки и `docUrl` на официальную документацию.

Расширяйте JSON без перекомпиляции: файл копируется рядом с `FluxAlloy.exe` как `Data\*.json`.

## Полезное
Частые теги ffmpeg: `-i`, `-map`, `-c:v copy`, `-ss`, `-t`, аппаратные кодеки `*_nvenc`/`*_amf`/`*_qsv`. yt‑dlp — `-F`, `-f`, сеть через `--proxy` и авторизацию `--cookies`/из браузера.

## Встроенные сценарии (для разработчиков)

Подсказки вкладки **Загрузки** и превью частично задаются в коде: `src/shared/terminal-contract.ts` (поля `summary` / `token` / `fullLine`). После правок русских формулировок в `summary` (в т.ч. «допишите **ссылку**» вместо «URL» и пометка `(поле …)` для строк с `--print-to-file` и `flux-ytdlp-*.txt`) выполните **`npm run locales:terminal-summaries-ru`** **дважды**, пока второй прогон не выведет **0** замен и **0** gloss; при необходимости только глосс полей — **`npm run locales:terminal-flux-pole`**. Скрипты **не** меняют `fullLine`. Регрессия покрыта в `tests/shared/terminal-contract-scenarios.test.ts`.
