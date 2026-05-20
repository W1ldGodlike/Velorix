# Подсказки терминала по ffmpeg / yt‑dlp

Обычному пользователю достаточно знать: вкладка **«Терминал»** подсказывает безопасные куски команд, показывает пример и по желанию ведёт на официальную справку в браузере. Ниже — техническая часть для тех, кто правит файлы данных или код сценариев.

Окно **Терминал** загружает `Data/ytdlp_commands.json` и `Data/ffmpeg_commands.json`. Каждый объект описывает токен, краткий текст на русском, пример строки и `docUrl` на официальную документацию. В каталоге подсказок чип **«Сценарии»** показывает только встроенные строки с `fullLine` (без токенов JSON).

Расширяйте JSON без перекомпиляции: файл копируется рядом с `FluxAlloy.exe` как `Data\*.json`.

## Полезное

Частые теги ffmpeg: `-i`, `-map`, `-c:v copy`, `-ss`, `-t`, аппаратные кодеки `*_nvenc`/`*_amf`/`*_qsv`. yt‑dlp — `-F`, `-f`, сеть через `--proxy` и авторизацию `--cookies`/из браузера.

Packaged smoke bundled ffprobe/ffmpeg/ytdlp — [tools-terminal-inspector.md](tools-terminal-inspector.md), [packaged-windows-smoke.md](packaged-windows-smoke.md); §21 e2e per-step `e2e <id>:` в `releaseSmoke:` — [owner-manual-smoke.md](owner-manual-smoke.md); §21 workflow: `npm run check:help-workflow-smoke-crosslinks` (44 статьи; partition: tail 42 + ffmpeg + knowledge, FAQ вне 44; §8 — `npm run check:help-terminal-hints-docs`). §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](../docs/RELEASE.md) §4/§4.1/§4.2 — `check:help-packaged-smoke-docs`; Playwright scaffold: `tests/e2e/gui/planned-gui-e2e-steps.ts` (`PLANNED_GUI_E2E_STEP_IDS`, `PLANNED_GUI_E2E_SCENARIOS`, `PLANNED_GUI_E2E_STEP_BY_ID`). Copy/releaseSmoke: `PLANNED_GUI_E2E_STEP_BY_ID` (registry `note` на шаг; `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`). Wiring: `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet` (после owner-smoke). UiHintSuffix: `appSettingsTerminalHintsGuardHint` (`check:terminal-hints-locale`); Playwright — `formatPackagedGuiE2ePlaywrightUiHintSuffix` (settings + `aboutSupportZipDiagnosticsSectionsHint`; `check:owner-visual-smoke-locale`, `check:support-bundle-terminal-hints`).

## Встроенные сценарии (для разработчиков)

Подсказки вкладки **Загрузки** и превью задаются в шардах `src/shared/terminal-contract-hints-*.ts` (канон **`terminal-contract-hints-meta`**: 20 загрузки + 15 превью (35 файлов), 1056+833 подсказок; `npm run check:terminal-contract-hints-shards`). Barrel — `src/shared/terminal-contract.ts` (`summary` / `token` / `fullLine`). После правок в `summary` используйте **допишите ссылку**, а не устаревшую **допишите URL**, и пометку `(поле …)` для строк с `--print-to-file` и `flux-ytdlp-*.txt`; затем выполните **`npm run locales:terminal-summaries-ru`** **дважды**, пока второй прогон не выведет **0** замен и **0** gloss; при необходимости только глосс полей — **`npm run locales:terminal-flux-pole`**. Скрипты **не** меняют `fullLine`. Регрессия — `tests/shared/terminal-contract-scenarios.test.ts`.

Support ZIP **`terminalHints:`** в `diagnostics.txt` (dev guards, не runtime) — `npm run check:support-bundle-terminal-hints`, `check:help-terminal-hints-docs` (24 статей); см. [logging-and-diagnostics.md](logging-and-diagnostics.md), [about-support-logs.md](about-support-logs.md).
