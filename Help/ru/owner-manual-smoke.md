# Ручная проверка на вашем железе

Автоматические тесты в CI проверяют **argv** ffmpeg, но не реальную видеокарту и масштаб монитора. Для релиза на своей машине используйте единый пакет чеклистов.

## Где открыть

1. **Ручная проверка владельца** — канон в корне репозитория: [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](../../IMPLEMENTATION_MANUAL_VERIFICATION.md) (в UI приложения этих чеклистов нет). Тот же текст попадает в Support ZIP как `ownerManualSmoke:` (О программе → архив поддержки).
2. Подробности по Support ZIP и dev-guards — [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md) (`check:packaged-e2e-scenarios-registry`, `releaseSmoke:`).
3. **Архив поддержки** — `ownerManualSmoke:` в `diagnostics.txt` (дублирует те же шаги); `releaseSmoke:` — CI packaged pipeline, `fix:esm-shim` (`electron-vite-build-meta.ts`) для `electron-vite build` на Linux/CI, и план §21 e2e; §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](../docs/RELEASE.md) §4/§4.1/§4.2 — `check:help-packaged-smoke-docs`; dev-блок `terminalHints:` (§8 guards) — [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md).

## Что проверить

| Блок             | Смысл                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------- |
| Theme            | Тёмная / светлая / системная тема: контраст, focus, modals, pop-out загрузок, инспектор      |
| HiDPI            | Масштаб Windows 100–200 %: редактор, загрузки, модалки, статусбар                            |
| HW encode        | NVENC (Win) или VAAPI (Linux): probe, ручной кодек, hw_auto, «Оценить»                       |
| Scenario builder | Конструктор, JSON edges, запуск из редактора / URL                                           |
| Video sprite §7.5 | FFmpeg rail → спрайт превью: сетка, PTS, сохранение PNG/JPEG; offline guard в тестах          |
| Mini Player §4.3 | Сервис → мини-плеер при busy-задачах: %/speed, ПКМ topmost, restore main, `session.json`       |
| Packaged         | `dist/win-unpacked` / `linux-unpacked` / `.app` — шаги в [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](../../IMPLEMENTATION_MANUAL_VERIFICATION.md); в Support ZIP — **§21 packaged e2e (CI vs owner)** |
| OS scheduler     | Watch-folder + Task Scheduler / launchd / systemd user timer                                 |
| Windows shell    | Контекстное меню, «Открыть с помощью», «Приложения по умолчанию…» (только Win)               |

Подробности: [hardware-encoding.md](hardware-encoding.md), [appearance-language-theme.md](appearance-language-theme.md), [workflows-planner-scenarios.md](workflows-planner-scenarios.md), [windows-shell-integration.md](windows-shell-integration.md).

В Support ZIP `ownerManualSmoke:` добавляется блок **§21 packaged e2e (CI vs owner)** (`formatPackagedManualSmokeE2eAppendixLines`: группы ci-headless / planned-gui-e2e / manual-owner и **12 строк** `e2e <stepId>: <automation> script=…`, напр. `e2e launch: ci-headless script=smoke:packaged-app`); diagnostics в `releaseSmoke:` без отдельного heading.

**Planned GUI e2e** (8 шагов; код — Playwright, приёмка — ручная): `open-file`, `ytdlp`, `editor-dl`, `snapshot`, `export`, `knowledge`, `support-zip`, `settings`. `npm run test:e2e:gui` → `tests/e2e/gui/planned-gui-e2e.spec.ts` + `tests/e2e/gui/planned-gui-e2e-step-runners.ts` (skip без `VELORIX_E2E_APP`; `check:packaged-gui-e2e-playwright-deferred`). Playwright: `tests/e2e/gui/planned-gui-e2e-steps.ts` + `tests/e2e/gui/planned-gui-e2e-step-runners.ts` (`PLANNED_GUI_E2E_STEP_IDS`, `PLANNED_GUI_E2E_SCENARIOS`, `PLANNED_GUI_E2E_STEP_BY_ID`). Copy/releaseSmoke: `PLANNED_GUI_E2E_STEP_BY_ID` (registry `note` на шаг; `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`). Specs: `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet`. Ручные чеклисты — `IMPLEMENTATION_MANUAL_VERIFICATION.md` (не в UI); about Support ZIP — `formatPackagedGuiE2ePlaywrightUiHintSuffix` (`check:support-bundle-terminal-hints`). **manual-owner** без GUI-автоматизации: `video-sprite`, `mini-player` (§7.5 / §4.3) — при Support ZIP смотрите `terminalHints:` (§8, `check:help-terminal-hints-docs`, 24 статьи). Help по шагам — [packaged-windows-smoke.md](packaged-windows-smoke.md) и workflow-статьи (`check:help-workflow-smoke-crosslinks`, 44 статьи; partition: tail 42 + ffmpeg + knowledge, FAQ вне 44).

После прогона отметьте пункты в [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](../../IMPLEMENTATION_MANUAL_VERIFICATION.md) и приложите Support ZIP при обращении в поддержку.

