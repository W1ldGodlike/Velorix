# Логи и диагностика

## Где лежит журнал

Основной текстовый журнал главного процесса — файл **`main.log`** в подпапке `logs` внутри служебной папки приложения (рядом с настройками и очередями). Рядом может лежать небольшой резервный файл при ротации.

## Сессионный лог

На каждый запуск создаётся отдельный короткий файл **сессии** — удобно отправить вместе с описанием шагов.

## Как открыть

Меню **«Инструменты»** содержит пункты для открытия журнала в программе просмотра и для **архива поддержки** (один zip с несколькими полезными файлами).

В `diagnostics.txt` архива:

- **`ownerManualSmoke:`** — полный пакет ручной проверки (тема, HiDPI, HW, packaged, §21 e2e per-step `e2e <id>:`); см. [owner-manual-smoke.md](owner-manual-smoke.md).
- **`releaseSmoke:`** — CI packaged pipeline, `fix:esm-shim` для `electron-vite build` на Linux/CI, layout win/linux/macos и тот же §21 e2e-план; см. [about-support-logs.md](about-support-logs.md).
- **`terminalHints:`** — dev §8 (`terminal-contract-hints-meta`, 14 загрузки + 8 превью (22 файлов), 839+465 hints, `check:terminal-contract-hints-shards`, `check:support-bundle-terminal-hints` и прочие guards в `check:quiet`); см. [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md).

Dev: `npm run check:packaged-e2e-scenarios-registry`, `check:help-workflow-smoke-crosslinks` (44 статьи; partition: tail 42 + ffmpeg + knowledge, FAQ вне 44, в `check:quiet`); §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](../docs/RELEASE.md) §4/§4.1/§4.2 — `check:help-packaged-smoke-docs`; §19 build: `fix:esm-shim` / `electron-vite-build-meta.ts` (Linux/CI `npm run build`); §21 Playwright: `npm run test:e2e:gui` → `tests/e2e/gui/planned-gui-e2e.spec.ts` + `tests/e2e/gui/planned-gui-e2e-step-runners.ts` (skip без `VELORIX_E2E_APP`; `check:packaged-gui-e2e-playwright-deferred`). §8 terminal — `check:terminal-contract-hints-shards` (14 загрузки + 8 превью (22 файлов), 839+465 hints), `check:help-terminal-hints-docs` (24 статей), `check:support-bundle-terminal-hints`, `check:terminal-hints-locale` (Настройки → Зависимости). Support ZIP `ownerManualSmoke:` / `releaseSmoke:` дописывает **§21 packaged e2e (CI vs owner)**; в Support ZIP — **planned GUI e2e scope** (8 шагов: `tests/e2e/gui/planned-gui-e2e-step-runners.ts`; 2 manual-owner: sprite, mini-player). Playwright: `tests/e2e/gui/planned-gui-e2e-steps.ts` + `tests/e2e/gui/planned-gui-e2e-step-runners.ts` (`PLANNED_GUI_E2E_STEP_IDS`, `PLANNED_GUI_E2E_SCENARIOS`, `PLANNED_GUI_E2E_STEP_BY_ID`). Copy/releaseSmoke: `PLANNED_GUI_E2E_STEP_BY_ID` (registry `note` на шаг; `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`). Specs: `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet`. UiHintSuffix: `appSettingsTerminalHintsGuardHint` (`check:terminal-hints-locale`); Playwright — `formatPackagedGuiE2ePlaywrightUiHintSuffix` (settings + `aboutSupportZipDiagnosticsSectionsHint`; `check:owner-visual-smoke-locale`, `check:support-bundle-terminal-hints`).

## Подробнее про «О программе»

Кнопки очистки временных данных и размеры служебных каталогов — в статье [about-support-logs.md](about-support-logs.md).
