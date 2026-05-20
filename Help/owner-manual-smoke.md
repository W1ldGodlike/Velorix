# Ручной smoke на вашем железе

Автоматические тесты в CI проверяют **argv** ffmpeg, но не реальную видеокарту и масштаб монитора. Для релиза на своей машине используйте единый пакет чеклистов.

## Где открыть

1. **Настройки → Зависимости** — блок **«Ручной smoke (владелец)»**: разверните превью секций (**Тема**, HiDPI, HW, сценарий, спрайт §7.5, мини-плеер §4.3, packaged, планировщик, shell), затем **«Скопировать весь пакет»** (тот же текст в Support ZIP `ownerManualSmoke:`; при **английском UI** — EN-строки из `locales/en/settings.json` и packaged shards). Кнопки **«К …»** переключают вкладку настроек и прокручивают к теме, HiDPI, HW, packaged или Проводнику. Подсказки в панели упоминают dev-guards: `check:owner-visual-smoke-locale`, `check:packaged-manual-smoke-parity`, `check:packaged-e2e-scenarios-registry`, `check:help-terminal-hints-docs` (§21: 12 packaged шагов ↔ CI headless или planned GUI e2e).
2. Ниже — отдельные панели (у каждой deep-link на эту статью): **NVENC/VAAPI**, **packaged smoke**; **HiDPI** и **Проводник Windows** — вкладка **«Общие»**. Из hub: **«Открыть планировщик»** / **«Открыть конструктор»** (то же, что меню **Сервис**).
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
| Packaged         | `dist/win-unpacked` / `linux-unpacked` / `.app` — отдельная панель packaged; **Скопировать** даёт `owner:`/`automated:`/`step [...]` + **§21 packaged e2e (CI vs owner)** (как в конце полного пакета) |
| OS scheduler     | Watch-folder + Task Scheduler / launchd / systemd user timer                                 |
| Windows shell    | Контекстное меню, «Открыть с помощью», «Приложения по умолчанию…» (только Win)               |

Подробности: [hardware-encoding.md](hardware-encoding.md), [appearance-language-theme.md](appearance-language-theme.md), [workflows-planner-scenarios.md](workflows-planner-scenarios.md), [windows-shell-integration.md](windows-shell-integration.md).

В конце **«Скопировать весь пакет»** и в Support ZIP `ownerManualSmoke:` добавляется блок **§21 packaged e2e (CI vs owner)** (`formatPackagedManualSmokeE2eAppendixLines`: группы ci-headless / planned-gui-e2e / manual-owner и **12 строк** `e2e <stepId>: <automation> script=…`, напр. `e2e launch: ci-headless script=smoke:packaged-app`); diagnostics в `releaseSmoke:` без отдельного heading.

**Planned GUI e2e** (8 шагов, Playwright позже, сейчас — ручной smoke): `open-file`, `ytdlp`, `editor-dl`, `snapshot`, `export`, `knowledge`, `support-zip`, `settings`. Зарезервировано `test:e2e:gui` (`check:packaged-gui-e2e-playwright-deferred`; пока нет в `package.json`). Playwright scaffold: `tests/e2e/gui/planned-gui-e2e-steps.ts` (`PLANNED_GUI_E2E_STEP_IDS`, `PLANNED_GUI_E2E_SCENARIOS`, `PLANNED_GUI_E2E_STEP_BY_ID`). Copy/releaseSmoke: `PLANNED_GUI_E2E_STEP_BY_ID` (registry `note` на шаг; `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`). Wiring: `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet` (после owner-smoke). UI в Настройках (4 ключа + about): `formatPackagedGuiE2ePlaywrightUiHintSuffix` — `check:owner-visual-smoke-locale`, `check:support-bundle-terminal-hints`. **manual-owner** без GUI-автоматизации: `video-sprite`, `mini-player` (§7.5 / §4.3) — при Support ZIP смотрите `terminalHints:` (§8, `check:help-terminal-hints-docs`, 24 статьи). Help по шагам — [packaged-windows-smoke.md](packaged-windows-smoke.md) и workflow-статьи (`check:help-workflow-smoke-crosslinks`, 44 статьи; partition: tail 42 + ffmpeg + knowledge, FAQ вне 44).

После прогона отметьте пункты в `IMPLEMENTATION_CHECKLIST.md` (раздел «Ручной smoke владельца») и приложите Support ZIP при обращении в поддержку.
