# Ручная проверка macOS (pack:mac:dir)

Проверка **собранного** `Velorix.app` из `dist/mac-arm64/` (или `dist/mac/`, `dist/mac-x64/`), а не dev-сервера Vite. Автоматическая проверка дерева **`npm run verify:mac-unpacked`** **не заменяет** этот прогон.

## Подготовка

1. Положите `ffmpeg`, `ffprobe`, `yt-dlp` в `bin/` (см. [`bin/README.md`](../bin/README.md)), затем `npm run engines:doctor`.
2. Сборка и layout:

```bash
npm run build
npm run pack:mac:dir
npm run verify:mac-unpacked
```

В бандле должны быть `Contents/MacOS/Velorix` и `Contents/Resources/bin/`.

**Linux/CI сборка:** при `npm run build` на Linux/CI нужен плагин `fix:esm-shim` (канон `electron-vite-build-meta.ts`, [`electron.vite.config.ts`](../electron.vite.config.ts)); CI `linux-packaging` — только Linux. Локально на macOS: `build` → `pack:mac:dir`.

## Чеклист в приложении

**Настройки → Зависимости → Ручная проверка macOS (pack:mac:dir)** — шаги можно скопировать; они попадают в Support ZIP (`macosPackagedSmoke:`).

## Копирование и локали

**Скопировать** — формат Support ZIP (`owner:` / `step [id]:` + **§21 packaged e2e (CI vs owner)**). EN UI — `locales/en/macos-packaged-manual-smoke.json`. Полный пакет — [about-support-logs.md](about-support-logs.md). **Planned GUI e2e** (8 шагов, Playwright wired) — `open-file`, `ytdlp`, `editor-dl`, `snapshot`, `export`, `knowledge`, `support-zip`, `settings`. `npm run test:e2e:gui` → `tests/e2e/gui/planned-gui-e2e.spec.ts` + `tests/e2e/gui/planned-gui-e2e-step-runners.ts` (skip без `VELORIX_E2E_APP`; `check:packaged-gui-e2e-playwright-deferred`). Playwright: `tests/e2e/gui/planned-gui-e2e-steps.ts` + `tests/e2e/gui/planned-gui-e2e-step-runners.ts` (`PLANNED_GUI_E2E_STEP_IDS`, `PLANNED_GUI_E2E_SCENARIOS`, `PLANNED_GUI_E2E_STEP_BY_ID`). Copy/releaseSmoke: `PLANNED_GUI_E2E_STEP_BY_ID` (registry `note` на шаг; `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`). Specs: `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet`. Dev: `check:packaged-manual-smoke-parity`, `check:packaged-e2e-scenarios-registry` (§21; per-step `e2e <id>:` в `releaseSmoke:`, напр. `e2e launch:`), `check:help-workflow-smoke-crosslinks` (44 статьи; partition: tail 42 + ffmpeg + knowledge, FAQ вне 44) — в `check:quiet`. §21 Playwright: `npm run test:e2e:gui` → `tests/e2e/gui/planned-gui-e2e.spec.ts` + `tests/e2e/gui/planned-gui-e2e-step-runners.ts` (skip без `VELORIX_E2E_APP`; `check:packaged-gui-e2e-playwright-deferred`). UiHintSuffix: `formatPackagedGuiE2ePlaywrightUiHintSuffix` (0 settings + `aboutSupportZipDiagnosticsSectionsHint`; `check:owner-hardware-checklist-locale`, `check:support-bundle-terminal-hints`).

## Краткий порядок

1. Открыть `Velorix.app`.
2. Статусбар, редактор, загрузки, снимок, экспорт, спрайт §7.5, база знаний, Support ZIP.
3. Выйти и снова открыть бандл — без падения.

Подробности — [`docs/RELEASE.md`](../docs/RELEASE.md) §4.2.

**Публикация вне dev:** подпись Developer ID, hardened runtime, notarization (`notarytool`, `stapler staple`) — roadmap в [`docs/RELEASE.md`](../docs/RELEASE.md) §4.2; `pack:mac:dir` может обходиться без подписи до релиза.

Support ZIP `releaseSmoke:` на любой ОС перечисляет кандидаты `Velorix.app` и layout `Contents/Resources/*` (present/missing); dev-блок `terminalHints:` (§8) — удобно приложить к отчёту после `pack:mac:dir`.

См. также [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md) и [packaged-windows-smoke.md](packaged-windows-smoke.md). §21 planned GUI e2e (8 шагов) — [about-support-logs.md](about-support-logs.md); канон stepId: `PACKAGED_E2E_PLANNED_GUI_STEP_IDS`; `tests/e2e/gui/planned-gui-e2e-steps.ts` + `tests/e2e/gui/planned-gui-e2e-step-runners.ts` (`PLANNED_GUI_E2E_STEP_IDS`, `PLANNED_GUI_E2E_SCENARIOS`, `PLANNED_GUI_E2E_STEP_BY_ID`). Copy/releaseSmoke: `PLANNED_GUI_E2E_STEP_BY_ID` (registry `note` на шаг; `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`). Specs: `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet`.
