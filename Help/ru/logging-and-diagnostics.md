# Логи и диагностика

## Где лежит журнал

Основной текстовый журнал главного процесса — файл **`main.log`** в подпапке `logs` внутри служебной папки приложения (рядом с настройками и очередями). Рядом может лежать небольшой резервный файл при ротации.

## Сессионный лог

На каждый запуск создаётся отдельный короткий файл **сессии** — удобно отправить вместе с описанием шагов.

## Как открыть

Меню **«Инструменты»** содержит пункты для открытия журнала в программе просмотра и для **архива поддержки** (один zip с несколькими полезными файлами).

В `diagnostics.txt` архива:

- **`ownerHardwareChecklist:`** — чеклист владельца на железе (тема, HiDPI, HW, packaged, §21 e2e); см. [about-support-logs.md](about-support-logs.md).
- **`releaseSmoke:`** — CI packaged pipeline и §21 e2e-план; см. [about-support-logs.md](about-support-logs.md).
- **`terminalHints:`** — подсказки терминала; см. [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md).

## Подробнее про «О программе»

Кнопки очистки временных данных и размеры служебных каталогов — в статье [about-support-logs.md](about-support-logs.md).

## См. также

[about-support-logs.md](about-support-logs.md) (Support ZIP `ownerHardwareChecklist:`) · [packaged-windows-smoke.md](packaged-windows-smoke.md) (после `pack:dir`).

Dev: `npm run check:packaged-e2e-scenarios-registry`, `check:help-workflow-smoke-crosslinks` (44 статьи; partition: tail 42 + ffmpeg + knowledge, FAQ вне 44, в `check:quiet`); §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](../docs/RELEASE.md) §4/§4.1/§4.2 — `check:help-packaged-smoke-docs`; §19 build: `fix:esm-shim` / `electron-vite-build-meta.ts` (Linux/CI `npm run build`); §21 Playwright: `npm run UI ZERO (Playwright removed)` (канон — `docs/VELORIX_NEON_THEME.md`). §8 terminal — `check:terminal-contract-hints-shards` (14 загрузки + 8 превью (22 файлов), 839+465 hints), `check:help-terminal-hints-docs` (22 статей), `check:support-bundle-terminal-hints`, `check:terminal-hints-locale` (Настройки → Зависимости). Support ZIP `ownerHardwareChecklist:` / `releaseSmoke:` дописывает **§21 packaged e2e (CI vs owner)**; в Support ZIP — **owner manual (9 шагов)** до восстановления GUI (Playwright 0; UI ZERO). UiHintSuffix: `appSettingsTerminalHintsGuardHint` (`check:terminal-hints-locale`); Playwright — `formatPackagedGuiE2ePlaywrightUiHintSuffix` (settings + `aboutSupportZipDiagnosticsSectionsHint`; `check:owner-hardware-checklist-locale`, `check:support-bundle-terminal-hints`).
