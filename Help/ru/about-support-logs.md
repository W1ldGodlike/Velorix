# «О программе», журналы и поддержка

## Версия

В диалоге «О программе» видно номер сборки приложения и версии встроенного движка страницы — это помогает при обращении в поддержку.

## Папка журналов

Там же есть переход к **папке журналов**. Файлы небольшие: при необходимости их можно приложить к письму.

## Архив для поддержки

Кнопка **архива** собирает несколько служебных файлов в один zip — удобно отправить целиком, не выбирая вручную.

В `diagnostics.txt` попадают:

- **`ownerManualSmoke:`** — единый пакет владельца (тема, HiDPI, HW, сценарий, спрайт §7.5, packaged для вашей ОС, планировщик, Windows shell); канон **ru**, см. [owner-manual-smoke.md](owner-manual-smoke.md) и копирование в **Настройки → ручной проверки** (при EN UI в буфере — EN-строки из locales).
- **`winPackagedSmoke:`** / **`linuxPackagedSmoke:`** / **`macosPackagedSmoke:`** — packaged-чеклисты (Windows всегда в ZIP; Linux/macOS — при сборке на соответствующей ОС); см. [packaged-windows-smoke.md](packaged-windows-smoke.md), [packaged-linux-smoke.md](packaged-linux-smoke.md), [packaged-macos-smoke.md](packaged-macos-smoke.md).
- **`terminalHints:`** — dev §8 (`terminal-contract-hints-meta`, 14 загрузки + 8 превью (22 файлов), 839+465 hints, `check:terminal-contract-hints-shards`, `check:help-terminal-hints-docs` (24 статей), `check:support-bundle-terminal-hints` и прочие guards в `check:quiet`); см. [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md) и [logging-and-diagnostics.md](logging-and-diagnostics.md).
- **`releaseSmoke:`** — CI packaged pipeline (`smoke:packaged-release`), `fix:esm-shim` для `electron-vite build` на Linux/CI, реестр §21 e2e и блок **§21 packaged e2e (CI vs owner)** (`appendPackagedManualSmokeE2ePlanLines` — те же строки, что UI **Скопировать** в packaged/owner), per-step `e2e <id>:`, `planned GUI e2e scope`, layout **present/missing** для `dist/win-unpacked/`, `dist/linux-unpacked/`, `Velorix.app`; dev: `check:packaged-e2e-scenarios-registry`, `check:help-workflow-smoke-crosslinks` (44 статьи; partition: tail 42 + ffmpeg + knowledge, FAQ вне 44). §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](../docs/RELEASE.md) §4/§4.1/§4.2 — `check:help-packaged-smoke-docs`; §19 build: `fix:esm-shim` / `electron-vite-build-meta.ts` (Linux/CI `npm run build`). §21 Playwright: `npm run test:e2e:gui` → `tests/e2e/gui/planned-gui-e2e.spec.ts` + `tests/e2e/gui/planned-gui-e2e-step-runners.ts` (skip без `VELORIX_E2E_APP`; `check:packaged-gui-e2e-playwright-deferred`). Playwright: `tests/e2e/gui/planned-gui-e2e-steps.ts` + `tests/e2e/gui/planned-gui-e2e-step-runners.ts` (`PLANNED_GUI_E2E_STEP_IDS`, `PLANNED_GUI_E2E_SCENARIOS`, `PLANNED_GUI_E2E_STEP_BY_ID`). Copy/releaseSmoke: `PLANNED_GUI_E2E_STEP_BY_ID` (registry `note` на шаг; `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`). Specs: `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet`. UiHintSuffix: `aboutSupportZipDiagnosticsSectionsHint` — `formatPackagedGuiE2ePlaywrightUiHintSuffix` (`check:support-bundle-terminal-hints`; settings — `check:owner-visual-smoke-locale`).