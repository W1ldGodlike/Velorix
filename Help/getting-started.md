# Быстрый старт

Добро пожаловать в **FluxAlloy**. Это окно для двух главных задач: **скачать ссылку** и **подготовить уже скачанное видео** под соцсети или архив.

![Схема вкладок «Редактор», «Загрузки», «Терминал»](assets/workspace-tabs-diagram.svg)

## С чего начать

1. Вверху выберите вкладку **«Загрузки»**, если нужен интернет-адрес.
2. Вставьте адреса в поле (по одному на строку) и добавьте их в очередь.
3. Нажмите действие запуска для строки или для всей очереди — программа сама вызовет загрузчик.

Для файла на диске откройте вкладку **«Редактор»**, перетащите файл в зону превью или воспользуйтесь кнопкой «Открыть».

## Куда смотреть дальше

- Как устроены вкладки — [workspace-tabs.md](workspace-tabs.md)
- Очередь и быстрые действия — [downloads-workflow.md](downloads-workflow.md)
- Превью, таймлайн и вывод — [editor-workflow.md](editor-workflow.md) и [ffmpeg-rail-presets.md](ffmpeg-rail-presets.md)
- Справка внутри программы — [knowledge-base-howto.md](knowledge-base-howto.md)
- Тема, язык и масштаб Windows — [appearance-language-theme.md](appearance-language-theme.md); полный ручной smoke — [owner-manual-smoke.md](owner-manual-smoke.md)
- Packaged smoke после сборки — [packaged-windows-smoke.md](packaged-windows-smoke.md) (Linux/macOS — соседние статьи); §21 e2e **§21 packaged e2e (CI vs owner)** (`appendPackagedManualSmokeE2ePlanLines`, per-step `e2e <id>:`) в `releaseSmoke:`; Support ZIP также включает `terminalHints:` (§8) — [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md); §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](../docs/RELEASE.md) §4/§4.1/§4.2 — `check:help-packaged-smoke-docs`; Playwright scaffold: `tests/e2e/gui/planned-gui-e2e-steps.ts` (`PLANNED_GUI_E2E_STEP_IDS`, `PLANNED_GUI_E2E_SCENARIOS`, `PLANNED_GUI_E2E_STEP_BY_ID`). Copy/releaseSmoke: `PLANNED_GUI_E2E_STEP_BY_ID` (registry `note` на шаг; `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`). Wiring: `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet` (после owner-smoke); Help: `check:help-workflow-smoke-crosslinks` (44 статьи; partition: tail 42 + ffmpeg + knowledge, FAQ вне 44).
- Частые проблемы — [faq-troubleshooting.md](faq-troubleshooting.md)
