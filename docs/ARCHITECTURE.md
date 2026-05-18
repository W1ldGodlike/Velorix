# Архитектура FluxAlloy

Краткий каркас проекта для онбординга и аудита: где что лежит и почему так устроены границы между процессами Electron.

## Что это за приложение

Десктопная оболочка вокруг **ffmpeg**, **ffprobe** и **yt-dlp** на **Electron + React + TypeScript**. Нормативные требования зафиксированы в корневом [`FLUXALLOY_TZ.md`](../FLUXALLOY_TZ.md).

## Каталоги на диске (single-root)

- **Установка / распаковка:** `FluxAlloy.exe`, `resources/` (в т.ч. bundled `bin`, `Data`, `Help`).
- **Runtime-данные:** только `<installRoot>/app-data/` — настройки, логи, очереди, история, кэш превью, загрузки yt-dlp по умолчанию, `app-data/bin`, временные каталоги ffmpeg (`app-data/temp`). Задаётся в [`app-data-root.ts`](../src/main/app-data-root.ts) (`configurePortableAppDataPaths` до `app.whenReady`).
- **Код** по-прежнему обращается к полю `AppPaths.userData` — это путь к `app-data/`, не `%AppData%`.
- **Штатные JSON:** `Data/` в репо → `resources/Data` в сборке; с `app-data/` не смешиваются.

## Точки входа (что это и зачем)

**Точка входа** — файл или команда, с которой начинается выполнение кода для данного «слоя» приложения. По ним видно, как живёт процесс от запуска до UI.

| Слой                            | Вход                                                                                                                                                                                                | Роль                                                                                                                                                                                                                                                                                    |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Сборка / runtime Electron       | [`package.json`](../package.json) поле `main`: `./out/main/index.js`                                                                                                                                | После `electron-vite build` Node загружает собранный **main process**.                                                                                                                                                                                                                  |
| Main (исходник)                 | [`src/main/index.ts`](../src/main/index.ts) (entry) + [`main-application-bootstrap.ts`](../src/main/main-application-bootstrap.ts) (`main-application-bootstrap-state|hosts|ipc.ts` + entry `runMainApplicationBootstrap`) + [`main-window-runtime-state.ts`](../src/main/main-window-runtime-state.ts) + [`src/main/ipc/`](../src/main/ipc/) (`register-export-batch-ipc` → `register-single-export-ipc` + `register-batch-export-queue-ipc-mutate|ingest|run.ts`) + [`main-cached-settings-host.ts`](../src/main/main-cached-settings-host.ts) + [`settings-store.ts`](../src/main/settings-store.ts) (`settings-store-hydrate|load.ts`) + [`settings-store-load-parse.ts`](../src/main/settings-store-load-parse.ts) (`settings-store-load-parse-layout|ytdlp-registry|ffmpeg-registry.ts` + entry re-export) + [`main-window.ts`](../src/main/main-window.ts) + [`main-bootstrap-ipc-helpers.ts`](../src/main/main-bootstrap-ipc-helpers.ts) + [`main-inspector-window-bootstrap.ts`](../src/main/main-inspector-window-bootstrap.ts) + [`main-export-output-paths.ts`](../src/main/main-export-output-paths.ts) + [`main-downloads-window-bounds-bootstrap.ts`](../src/main/main-downloads-window-bounds-bootstrap.ts) + [`main-ytdlp-download-main-handler.ts`](../src/main/main-ytdlp-download-main-handler.ts) + [`main-ytdlp-settings-persist.ts`](../src/main/main-ytdlp-settings-persist.ts) + [`main-ffmpeg-export-batch-host.ts`](../src/main/main-ffmpeg-export-batch-host.ts) + [`preview-proxy-service.ts`](../src/main/preview-proxy-service.ts) + [`ytdlp-download-cli-merge.ts`](../src/main/ytdlp-download-cli-merge.ts) + [`main-application-menu.ts`](../src/main/main-application-menu.ts) (`main-application-menu-types|deps|template.ts` + entry `buildApplicationMenu`) + [`main-diagnostics-service.ts`](../src/main/main-diagnostics-service.ts) + [`support-bundle.ts`](../src/main/support-bundle.ts) (`support-bundle-types|zip|collect.ts`) + [`settings-ipc-persist.ts`](../src/main/settings-ipc-persist.ts) (`settings-ipc-persist-core|shell|ffmpeg.ts`) + [`ytdlp-download-options.ts`](../src/main/ytdlp-download-options.ts) (`ytdlp-download-options-preview|validate|snapshot.ts`) | Entry `index.ts`; `runMainApplicationBootstrap` в `whenReady`; IPC — `ipc/register-*`. |
| Preload (два бандла)            | [`src/preload/index.ts`](../src/preload/index.ts) (entry) + [`preload-fluxalloy-bridge.ts`](../src/preload/preload-fluxalloy-bridge.ts) + [`preload-fluxalloy-downloads.ts`](../src/preload/preload-fluxalloy-downloads.ts) + [`preload-fluxalloy-export.ts`](../src/preload/preload-fluxalloy-export.ts) + [`preload-fluxalloy-settings.ts`](../src/preload/preload-fluxalloy-settings.ts) + [`preload-sanitize.ts`](../src/preload/preload-sanitize.ts), [`downloads-window.ts`](../src/preload/downloads-window.ts); [`electron.vite.config.ts`](../electron.vite.config.ts) | Узкий мост `contextBridge`: только явные методы, без произвольного доступа к Node из renderer.                                                                                                                                                                                          |
| Renderer (UI)                   | [`src/renderer/src/main.tsx`](../src/renderer/src/main.tsx)                                                                                                                                         | React: по `location.hash` выбирается **`App`** или **`InspectorStandaloneApp`** (инспектор в отдельном окне). `use-app-composition-state.ts` → [`use-editor-export-settings.ts`](../src/renderer/src/use-editor-export-settings.ts) + [`use-editor-export-settings-state.ts`](../src/renderer/src/use-editor-export-settings-state.ts) (`editor-export-settings-field-state.ts` + `use-editor-export-settings-derived.ts`) + [`editor-export-settings-snapshot-build.ts`](../src/renderer/src/editor-export-settings-snapshot-build.ts) + [`use-editor-export-user-preset-actions.ts`](../src/renderer/src/use-editor-export-user-preset-actions.ts) + [`editor-export-select-options.ts`](../src/renderer/src/editor-export-select-options.ts) + [`editor-export-settings-hydrate.ts`](../src/renderer/src/editor-export-settings-hydrate.ts); shell — `use-app-shell-props-input*`; [`EditorFfmpegSettingsRail.tsx`](../src/renderer/src/components/editor/EditorFfmpegSettingsRail.tsx) (orchestrator) + `EditorFfmpegSettingsRail*Section.tsx` (video/format/audio/presets/output); [`VideoTimeline.tsx`](../src/renderer/src/components/VideoTimeline.tsx) + `video-timeline-helpers.ts` + `VideoTimelineToolbar` / `VideoTimelineUnifiedPane`; `MediaProbePanel.tsx` + `media-probe-panel-helpers.ts`.                                                                                                                                                                           |
| Автоматизация агентом (вне IDE) | [`scripts/cursor-automation/src/run-loop.ts`](../scripts/cursor-automation/src/run-loop.ts)                                                                                                         | Локальный [**Cursor Agent TS SDK**](https://cursor.com/docs/api/sdk/typescript): создаёт агента с `cwd` = корень репозитория, шлёт промпты из `prompts/`, читает чеклист/журнал по контракту в [`prompts/agent-contract.txt`](../scripts/cursor-automation/prompts/agent-contract.txt). |

Зачем разделять: **безопасность и предсказуемость** — тяжёлое и опасное (процессы, пути, секреты ОС) остаётся в main; UI остаётся в изолированном renderer с **`contextIsolation: true`** и **`nodeIntegration: false`** (см. создание окна в `index.ts`).

## Структура каталогов (логика, не полный список)

- **`src/main/`** — сервисы: движки, настройки IPC persist [`settings-ipc-persist.ts`](../src/main/settings-ipc-persist.ts) + `settings-ipc-persist-core|shell|ffmpeg.ts` (`settings-ipc-persist-ffmpeg-core|output|presets`), yt-dlp options [`ytdlp-download-options.ts`](../src/main/ytdlp-download-options.ts) + `ytdlp-download-options-preview|validate|snapshot.ts` (`ytdlp-download-options-snapshot-types|build|payload.ts` + entry re-export), pop-out загрузок [`downloads-window.ts`](../src/main/downloads-window.ts) + [`downloads-window-runtime.ts`](../src/main/downloads-window-runtime.ts) (`downloads-window-runtime-hooks|actions|broadcast.ts` + entry re-export) + [`register-downloads-window-ipc.ts`](../src/main/register-downloads-window-ipc.ts) + `register-downloads-*-ipc.ts` (`register-downloads-options-ipc-output|cli|cookies.ts`, `ytdlp-download-options-ipc-patch.ts`) + [`downloads-window-html.ts`](../src/main/downloads-window-html.ts) (`downloads-window-html-styles-{theme,dpi,layout-*,narrow}.ts`; `downloads-window-html-body.ts`; script fragments + entries) + [`downloads-window-ui-locale.ts`](../src/shared/downloads-window-ui-locale.ts) (`*-types` + `*-strings-ru|en`), очередь yt-dlp (`downloads-queue-runner.ts` + `downloads-queue-runner-ytdlp-row.ts` + `downloads-queue-runner-state.ts`, `ytdlp-progress-parser.ts` + `ytdlp-progress-parser-download.ts` + `ytdlp-progress-parser-queue.ts` (`ytdlp-progress-parser-queue-info|failure|path`)), ffprobe (`ffprobe-service.ts` + `ffprobe-track-detail-builder.ts` + `ffprobe-json-types.ts` + `ffprobe-track-detail-helpers.ts` + `ffprobe-track-detail-build.ts` + `ffprobe-track-detail-by-codec.ts` (`ffprobe-track-detail-by-codec-video|audio|subtitle|other.ts`) + `ffprobe-probe-json.ts`), одиночный и **пакетный** экспорт ffmpeg ([`ffmpeg-export-service.ts`](../src/main/ffmpeg-export-service.ts) + `ffmpeg-export-service-public|job-resolve|job.ts` (`ffmpeg-export-service-job-resolve-types|video|argv.ts` + entry `resolveFfmpegExportJobPlan`) + `ffmpeg-export-app-settings-merge.ts` + `ffmpeg-export-spawn-once.ts`, `ffmpeg-export-batch-*`), терминал ([`terminal-service.ts`](../src/main/terminal-service.ts) (`terminal-service-log|parse|hints|run.ts`)), медиа-протокол, настройки, логи, support bundle, база знаний (`knowledge-service`).
- **`src/renderer/src/`** — React: единый workspace с вкладками **Редактор / Загрузки / Терминал** ([`App.tsx`](../src/renderer/src/App.tsx) entry → [`use-app-composition.ts`](../src/renderer/src/use-app-composition.ts) → [`use-app-composition-state.ts`](../src/renderer/src/use-app-composition-state.ts) (`use-app-composition-local-state|integrations.ts`) + [`use-app-shell-props-input.ts`](../src/renderer/src/use-app-shell-props-input.ts) orchestrator + [`use-app-shell-props-input-hooks.ts`](../src/renderer/src/use-app-shell-props-input-hooks.ts) + [`use-app-shell-props-input-workspace.ts`](../src/renderer/src/use-app-shell-props-input-workspace.ts) (`use-app-shell-props-input-workspace-types|shell|editor|terminal-downloads.ts`) + [`use-app-shell-props-input-layout.ts`](../src/renderer/src/use-app-shell-props-input-layout.ts) → [`use-app-shell-props.ts`](../src/renderer/src/use-app-shell-props.ts) → [`AppShellLayout.tsx`](../src/renderer/src/components/shell/AppShellLayout.tsx)); инспектор медиа — [`MediaProbePanel.tsx`](../src/renderer/src/components/MediaProbePanel.tsx) (`PreviewProbeBody` + `use-preview-probe-body.ts` + `PreviewProbeBodyOverview|ContextMenu.tsx` + `PreviewProbeBodySections.tsx` (`PreviewProbeBodyExportSummary|Tracks|Chapters|RawJsonSection.tsx`) + [`media-probe-panel-helpers.ts`](../src/renderer/src/components/media-probe-panel-helpers.ts), [`LucideMiniIcons.tsx`](../src/renderer/src/components/LucideMiniIcons.tsx) (`lucide-mini-icons-core|downloads|editor.tsx`), отдельное окно инспектора ([`InspectorStandaloneApp.tsx`](../src/renderer/src/InspectorStandaloneApp.tsx) + `use-inspector-standalone-app.ts` + `InspectorStandaloneAppTopbar|Main.tsx`); панели workspace — [`components/TerminalWorkspacePanel.tsx`](../src/renderer/src/components/TerminalWorkspacePanel.tsx) (`terminal-workspace-panel-props.ts` + `TerminalWorkspacePanelIntroBand|CommandStack|History|Hints.tsx`), [`components/downloads/DownloadsSettingsRail.tsx`](../src/renderer/src/components/downloads/DownloadsSettingsRail.tsx) + `DownloadsSettingsRail*Section.tsx`, [`components/downloads/DownloadsWorkspaceMain.tsx`](../src/renderer/src/components/downloads/DownloadsWorkspaceMain.tsx) + `DownloadsWorkspaceMainBand|Overview|QueueTable|LowerStack.tsx`, [`components/editor/EditorBatchExportBar.tsx`](../src/renderer/src/components/editor/EditorBatchExportBar.tsx) + `EditorBatchExportBarToolbar|QueueTable.tsx`, [`EditorQuickYtdlpBar.tsx`](../src/renderer/src/components/editor/EditorQuickYtdlpBar.tsx), [`EditorPreviewSection.tsx`](../src/renderer/src/components/editor/EditorPreviewSection.tsx), [`EditorFfmpegSettingsRail.tsx`](../src/renderer/src/components/editor/EditorFfmpegSettingsRail.tsx); shell — [`AppShellLayout.tsx`](../src/renderer/src/components/shell/AppShellLayout.tsx) (оболочка: topbar + workspace + statusbar + модалки), [`AppWorkspaceMain.tsx`](../src/renderer/src/components/shell/AppWorkspaceMain.tsx), [`AppWorkspaceTopbar.tsx`](../src/renderer/src/components/shell/AppWorkspaceTopbar.tsx), [`AppStatusbar.tsx`](../src/renderer/src/components/shell/AppStatusbar.tsx), [`AppOverlayDialogs.tsx`](../src/renderer/src/components/shell/AppOverlayDialogs.tsx), [`EnginePathsDialog.tsx`](../src/renderer/src/components/shell/EnginePathsDialog.tsx), [`ExportPresetNameDialog.tsx`](../src/renderer/src/components/shell/ExportPresetNameDialog.tsx); хелперы — `downloads-queue-view.ts`, `app-engines-ui.ts`, `app-shell-ui-helpers.ts`, `app-terminal-hint-ui.ts`, `components/PillSwitch.tsx`; хуки — [`use-ffmpeg-export-batch.ts`](../src/renderer/src/use-ffmpeg-export-batch.ts) (`use-ffmpeg-export-batch-deps|snapshot|handlers-ingest|handlers-run.ts`), [`use-terminal-workspace.ts`](../src/renderer/src/use-terminal-workspace.ts), [`use-downloads-workspace.ts`](../src/renderer/src/use-downloads-workspace.ts), [`use-downloads-url-actions.ts`](../src/renderer/src/use-downloads-url-actions.ts), [`use-editor-export-settings.ts`](../src/renderer/src/use-editor-export-settings.ts), [`use-editor-export-pipeline.ts`](../src/renderer/src/use-editor-export-pipeline.ts) (`use-editor-export-pipeline-deps|preview|handlers.ts`), [`use-app-workspace-main-props.ts`](../src/renderer/src/use-app-workspace-main-props.ts), [`use-app-shell-layout-props.ts`](../src/renderer/src/use-app-shell-layout-props.ts), [`use-app-processing-history.ts`](../src/renderer/src/use-app-processing-history.ts), [`use-app-main-window-effects.ts`](../src/renderer/src/use-app-main-window-effects.ts) (`use-app-main-window-effects-deps|bootstrap|runtime.ts` + `use-app-main-window-engine-actions.ts`), [`use-app-preview-workspace.ts`](../src/renderer/src/use-app-preview-workspace.ts), [`use-app-toolbar-engine-actions.ts`](../src/renderer/src/use-app-toolbar-engine-actions.ts); строки UI — [`locales/ui-text.ts`](../src/renderer/src/locales/ui-text.ts) (RU/EN); только через `window.fluxalloy` из preload.
- **`src/shared/`** — типы и константы IPC/домена, общие для main и preload/renderer (без импорта Electron в «чистых» модулях); main UI strings — [`main-application-locale.ts`](../src/shared/main-application-locale.ts) (`main-application-locale-types` + `main-application-locale-strings-ru|en`); ffmpeg argv — [`ffmpeg-export-argv.ts`](../src/shared/ffmpeg-export-argv.ts) + [`ffmpeg-export-argv-build.ts`](../src/shared/ffmpeg-export-argv-build.ts) (`ffmpeg-export-argv-build-types|encode|vf-chain|codec-audio`); lucide stroke data — [`lucide-downloads-icons.ts`](../src/shared/lucide-downloads-icons.ts) (`lucide-downloads-icons-types|queue|clusters|editor|emit.ts`).
- **`src/preload/`** — мост и типы [`index.d.ts`](../src/preload/index.d.ts) для `window.fluxalloy`.
- **`Data/`** — конфиги и доверенные хеши §3 ТЗ (`trusted_hashes.json`); в проде копируются как `extraResources` (см. [`electron-builder.yml`](../electron-builder.yml)).
- **`Help/`** — тексты подсказок для UI.
- **[`src/shared/terminal-contract.ts`](../src/shared/terminal-contract.ts)** — контракт сценарных подсказок терминала (вкладка загрузок и превью медиа): поля `summary` / `token` / `fullLine`. После правок русских `summary` — **`npm run locales:terminal-summaries-ru`** дважды до **0** замен и **0** gloss; в **`npm run check:quiet`** входит **`npm run check:terminal-summaries-ru`** (см. [`Help/ffmpeg-terminal-hints.md`](../Help/ffmpeg-terminal-hints.md)).
- **`scripts/cursor-automation/`** — изолированный пакет с `@cursor/sdk`; не является частью приложения в runtime.

## IPC и контракты

- Реестр имён каналов: [`src/shared/ipc-channels.ts`](../src/shared/ipc-channels.ts) (`mainWindowIpc`, `downloadsIpc`) — invoke + push + `logRenderer` через `ipcMain.on` (см. `npm run audit:ipc-architecture`).
- Проверка связности: `npm run audit:ipc-architecture` — каждый invoke-канал имеет `ipcMain.handle` (или loop `FFMPEG_EXPORT_SETTING_CHANNELS`) в `src/main/` и `ipcRenderer.invoke` / `send` в `src/preload/`; push-каналы — в `PUSH_KEYS` скрипта.
- Регистрация `ipcMain.handle` (строки `ipcMain.handle(`; эффективных handle **139** с учётом loop ffmpeg settings):

| Файл | строк `ipcMain.handle(` |
|------|---------------------------|
| [`src/main/ipc/register-batch-export-queue-ipc-mutate.ts`](../src/main/ipc/register-batch-export-queue-ipc-mutate.ts) | 12 |
| [`src/main/ipc/register-engines-preview-ipc.ts`](../src/main/ipc/register-engines-preview-ipc.ts) | 12 |
| [`src/main/register-downloads-queue-ipc.ts`](../src/main/register-downloads-queue-ipc.ts) | 12 |
| [`src/main/ipc/register-main-utilities-ipc.ts`](../src/main/ipc/register-main-utilities-ipc.ts) | 11 |
| [`src/main/ipc/register-workflow-ipc.ts`](../src/main/ipc/register-workflow-ipc.ts) | 5 |
| [`src/main/ipc/register-knowledge-diagnostics-ipc.ts`](../src/main/ipc/register-knowledge-diagnostics-ipc.ts) | 8 |
| [`src/main/ipc/register-batch-export-queue-ipc-ingest.ts`](../src/main/ipc/register-batch-export-queue-ipc-ingest.ts) | 7 |
| [`src/main/register-downloads-runner-ipc.ts`](../src/main/register-downloads-runner-ipc.ts) | 7 |
| [`src/main/ipc/register-settings-ipc.ts`](../src/main/ipc/register-settings-ipc.ts) | 6 (+37 в `FFMPEG_EXPORT_SETTING_CHANNELS`) |
| [`src/main/ipc/register-single-export-ipc.ts`](../src/main/ipc/register-single-export-ipc.ts) | 5 |
| [`src/main/register-downloads-bridge-ipc.ts`](../src/main/register-downloads-bridge-ipc.ts) | 5 |
| [`src/main/ipc/register-batch-export-queue-ipc-run.ts`](../src/main/ipc/register-batch-export-queue-ipc-run.ts) | 4 |
| [`src/main/ipc/register-windows-shell-context-menu-ipc.ts`](../src/main/ipc/register-windows-shell-context-menu-ipc.ts) | 4 |
| [`src/main/register-downloads-options-ipc-output.ts`](../src/main/register-downloads-options-ipc-output.ts) | 4 |
| [`src/main/register-downloads-snapshot-ipc.ts`](../src/main/register-downloads-snapshot-ipc.ts) | 3 |
| [`src/main/inspector-window.ts`](../src/main/inspector-window.ts) | 2 |
| [`src/main/register-downloads-options-ipc-cli.ts`](../src/main/register-downloads-options-ipc-cli.ts) | 2 |
| [`src/main/register-downloads-options-ipc-cookies.ts`](../src/main/register-downloads-options-ipc-cookies.ts) | 2 |
| [`src/main/ipc/register-export-batch-ipc.ts`](../src/main/ipc/register-export-batch-ipc.ts) | 1 |

Остальные каналы реестра — `webContents.send` / `ipcMain.on` (прогресс, снимки очереди, тема, UI panels, `processingHistoryChanged`, `logRenderer`).

## Shared contracts (один домен — явные файлы)

| Домен | Файлы `src/shared/` | Примечание |
|-------|---------------------|------------|
| IPC | `ipc-channels.ts` | единственный реестр строк каналов |
| Settings | `settings-contract.ts` | view/persist типы |
| ffmpeg export | `ffmpeg-export-contract.ts`, `ffmpeg-export-resolve-contract.ts`, `ffmpeg-export-batch-contract.ts`, `ffmpeg-export-benchmark-contract.ts`, `ffmpeg-frames-extract-contract.ts` | типы UI/spawn, resolve job, batch queue, бенчмарк §7.2.1, пакетное извлечение кадров §7.6 — не сливать в один файл |
| media utilities | `media-utilities-contract.ts` | §17 remux/integrity, генератор WAV (lavfi), хеши MD5/SHA256 — отдельно от export/extract |
| cover extract | `ffmpeg-cover-extract-contract.ts` | §17 обложка из очереди загрузок (`downloadsIpc.extractQueueCover`) |
| external filter script | `external-filter-script-contract.ts` | §17 AviSynth/VapourSynth в `-vf` экспорта + меню «Сервис» |
| ffprobe | `ffprobe-contract.ts` | probe JSON / UI |
| yt-dlp | `ytdlp-download-contract.ts`, `ytdlp-history-contract.ts` | download + history |
| Workflows §10/§11 | `workflow-scenario-contract.ts`, `workflow-scenario-templates.ts`, `workflow-scenario-url.ts`, `scheduled-task-contract.ts`, `workflow-cli-args.ts`, `workflow-watch-folder-contract.ts`, `workflow-scenario-run-plan.ts`, `workflow-run-scenario-on-file.ts`, `workflow-run-scenario-on-url.ts`, `workflow-scenario-ytdlp-complete.ts`, `watch-folder-scan.ts`, `workflow-watch-folder-runner.ts`, `workflow-scenario-runner.ts`, `windows-task-scheduler-sync.ts`, `macos-launchd-sync.ts`, `linux-systemd-user-timer-sync.ts`, `scheduled-task-os-sync.ts` | JSON в `userData/workflows/`; шаблоны local/URL; in-app runner; Win `schtasks` / macOS LaunchAgent / Linux systemd user timer + CLI `--workflow-watch-folder-tick`; ffmpeg → `workflowWatchFolderRunFinished`; редактор: `workflowRunScenarioOnFile` / `workflowRunScenarioOnUrl`; Help `workflows-planner-scenarios` |
| Terminal | `terminal-contract.ts` (barrel), `terminal-contract-types.ts`, `terminal-contract-hints-*` | hints после split ф.4 |
| Engines | `engine-contract.ts`, `engine-download-contract.ts`, `engine-update-check-contract.ts` | paths, download, check updates |
| Diagnostics / about | `diagnostics-contract.ts`, `about-contract.ts` | support bundle UI |
| Windows shell §14 | `windows-explorer-context-menu.ts` | HKCU context menu, CLI `--fluxalloy-shell-*`, headless install register; main: `windows-explorer-context-menu-sync`, `windows-explorer-shell-fulfill`, `processing-history` entries on quick MP4 |
| Downloads log | `downloads-log-contract.ts` | pop-out log lines |

Проверка списка: `npm run audit:shared-contracts` (неизвестный `*-contract.ts` в `src/shared/` → fail).
- Настройки экспорта ffmpeg идут отдельными `settings-set-ffmpeg-export-*` каналами; значения проходят whitelist-парсеры main перед записью и spawn.
- Пакетный экспорт и очередь yt-dlp — отдельные IPC/сервисы с persist в `app-data/` (`queue.json` и аналоги для batch).
- Каталог вывода yt-dlp, CLI/options и раскрытие панелей загрузок: push `downloadsOutputDirectoryChanged` / `downloadsCliOptionsChanged` / `downloadsWindowUiPanelsChanged` из main во вкладку «Загрузки» и pop-out.
- Терминал: allowlist команд и подсказки из `Data/*_commands.json` + [`terminal-contract.ts`](../src/shared/terminal-contract.ts); не произвольный shell.
- Принцип: **узкий whitelist** — нет произвольного «выполни команду» или чтения произвольных путей без проверок.

## Медиа и доступ к файлам

- Кастомная схема **`fluxmedia://`** и множество **`allowedMediaPaths`** (реальный путь после `realpath`): см. [`src/main/media-protocol.ts`](../src/main/media-protocol.ts). Renderer не может открыть произвольный `file://` без регистрации пути через main.
- **ffprobe** и экспорт допускаются только для путей, прошедших **`isGrantedMediaPath`** (открытие через диалог / явная выдача доступа из main).

## Локализация UI (§2.2)

- **Канон строк:** `locales/ru/*.json` и `locales/en/*.json` — плоские объекты `ключ → строка` (без вложенности). Список имён шардов — [`LOCALE_JSON_SHARDS`](../src/shared/locale-json-catalog.ts) (20 файлов на локаль: `common`, `about`, `maintenance`, `formatting`, `knowledge`, `terminal`, `processing`, `downloads`, `workspace`, `editor`, `video`, `mini`, `downloads-settings`, `shell`, `editor-ffmpeg`, `status`, `batch-export`, `settings`, `inspector`, `inspector-probe`). Паритет ru/en: `npm run check:locales-json`.
- **Сборка в renderer:** [`ui-text-strings-build.ts`](../src/renderer/src/locales/ui-text-strings-build.ts) — `buildUiTextTables()`: сначала пустые legacy-части `ui-text-strings-{ru|en}-NN.ts`, затем JSON-шарды **в порядке импорта** (поздний spread перекрывает ранний при коллизии ключей). Тип ключей `UiTextKey` — `keyof` таблицы `ru`.
- **Чтение в UI:** [`ui-text-api.ts`](../src/renderer/src/locales/ui-text-api.ts) — `uiText(key)` → `getUiTextTables()[getUiLocale()][key]`; сессия локали — [`ui-text-session.ts`](../src/renderer/src/locales/ui-text-session.ts) (`settings.json` / `navigator`).
- **Смена языка без reload:** main `settings.setUiLocale` → `uiLocaleChanged` на все окна → `setUiLocaleForSession` + `uiLocaleRenderTick` (см. [`ui-locale-runtime.ts`](../src/shared/ui-locale-runtime.ts)); заголовки окон — `syncBrowserWindowTitlesToLocale`.
- **Dev hot-reload JSON:** Vite alias `@locales` → корень `locales/` ([`electron.vite.config.ts`](../electron.vite.config.ts)). Правка любого `locales/**/*.json` инвалидирует [`ui-text-strings.ts`](../src/renderer/src/locales/ui-text-strings.ts): `import.meta.hot.accept` → `reloadUiTextTablesFromModules()` → `notifyUiTextShardsUpdated()` → хук [`use-ui-text-hot-reload-bump.ts`](../src/renderer/src/locales/use-ui-text-hot-reload-bump.ts) увеличивает `uiLocaleRenderTick` (главное окно, `#downloads`, `#inspector`). Перезапуск Electron не нужен.
- **Main/preload UI** (меню, диалоги ОС): отдельные таблицы [`main-application-locale-strings-*`](../src/shared/main-application-locale.ts), не `locales/**`.
- **Guards:** `check:locales-ts-overlap` (запрет дублей TS+JSON), миграции `scripts/migrate-locales-*.mjs`.

## Состояние renderer (§2.2)

**Решение:** **`hooks-composition`** — без Zustand, Jotai, Redux и без React Context для глобального store. Канон в [`renderer-state-approach.ts`](../src/shared/renderer-state-approach.ts).

| Слой | Назначение | Примеры |
|------|------------|---------|
| Composition root | Один вход в shell | [`useAppComposition`](../src/renderer/src/use-app-composition.ts) → `useAppCompositionState` → `useAppShellPropsInput` → `useAppShellProps` → [`AppShellLayout`](../src/renderer/src/components/shell/AppShellLayout.tsx) |
| Локальный UI-state | Вкладки, модалки, ticks | [`useAppCompositionLocalState`](../src/renderer/src/use-app-composition-local-state.ts) (`uiLocaleRenderTick`, theme, workspace tab) |
| Domain hooks | Фича + IPC | `useEditorExportSettings`, `useFfmpegExportBatch`, `useDownloadsWorkspace`, `useTerminalWorkspace`, `useMainWindowUiPanels`, `useAppPreviewWorkspace` |
| Standalone окна | Свой мини-корень | [`useDownloadsStandaloneApp`](../src/renderer/src/use-downloads-standalone-app.ts), [`useInspectorStandaloneApp`](../src/renderer/src/use-inspector-standalone-app.ts) |

**Persist и события main:** настройки и снимки панелей — через `window.fluxalloy.settings.*` и push-каналы (`onThemeChanged`, `onUiLocaleChanged`, …); renderer держит копию в `useState`, не в глобальном store.

**i18n / dev:** `getUiLocale()` + `uiText()`; смена языка и HMR JSON — `uiLocaleRenderTick` + [`useUiTextHotReloadBump`](../src/renderer/src/locales/use-ui-text-hot-reload-bump.ts).

**Когда добавлять библиотеку store:** только по явной просьбе владельца и с обновлением `renderer-state-approach.ts` + этого раздела.

## nativeMain / platform (§2.1)

Различия ОС для main и smoke — единый модуль [`src/shared/native-main-platform.ts`](../src/shared/native-main-platform.ts); в main импорт через [`src/main/platform/index.ts`](../src/main/platform/index.ts).

| API | Назначение |
|-----|------------|
| `isNativeMainWindows` / `Macos` / `Linux` | Ветвление по `process.platform` |
| `nativeMainEngineExecutableSuffix` / `nativeMainEngineBinaryName` | Имена ffmpeg/ffprobe/yt-dlp в `bin/` |
| `nativeMainPathEnvSeparator`, `nativeMainDevNullPath`, `nativeMainPathSeparator` | PATH, null sink, help URL |
| `isNativeMainYtdlpOsPauseSupported`, `isNativeMainYtdlpKillProcessTreeSupported` | §6.4 yt-dlp |
| `isNativeMainEngineAutoDownloadSupported` | §3 загрузчик Windows |
| `isNativeMainQuitOnLastWindowClosed`, `isNativeMainBrowserWindowNeedsIcon` | Electron shell |

**Allowlist** сырого `process.platform` в `src/main/`: `app-data-root-paths.ts`, `app-data-root.ts`, `logger-service.ts`, `main-diagnostics-service.ts`. Регрессия: `npm run check:native-main-platform-guard`.

## Bundled engines и CI (§3 / §19)

| Платформа | `engines:prepare:*` | CI (`.github/workflows/ci.yml`) | Упаковка |
|-----------|---------------------|----------------------------------|----------|
| Windows x64 | `npm run engines:prepare:win` (`predev`, `prebuild:win`) | **Да** — `windows-latest`, prepare + `engines:doctor` + packaged smokes | `release:win*`, `check:release` |
| macOS | **Нет** авто-prepare | **Нет** job | `pack:mac:dir` + `verify:mac-unpacked`; релиз `build:mac` (dmg) — бинарники в `bin/` вручную |
| Linux | **Нет** авто-prepare | **Да** — `ubuntu-latest`: `check:quiet` + `build` + `pack:linux:dir` + `verify:linux-unpacked` | `build:linux` + `verify:linux-release` (AppImage/deb) локально; бинарники в `bin/` вручную |

Диагностика: [`platform-packaging-scripts.ts`](../src/shared/platform-packaging-scripts.ts) (`formatPlatformPackagingDiagnosticLines`). Локально: [`bin/README.md`](../bin/README.md), релиз: [`docs/RELEASE.md`](../docs/RELEASE.md).

## Внешние процессы

- yt-dlp: **`spawn`** с массивом аргументов, без shell (см. [`src/main/ytdlp-download-service.ts`](../src/main/ytdlp-download-service.ts)).
- ffmpeg/ffprobe: разрешённые пути к бинарникам через `engine-service`; автозагрузка Windows с проверкой SHA256 опционально по [`Data/trusted_hashes.json`](../Data/trusted_hashes.json).

## Связка с процессом разработки документации

Чтобы архитектурное описание не расходилось с кодом:

1. При добавлении **нового IPC** — обновить `src/shared/ipc-channels.ts`, preload API и этот файл (раздел IPC / точки входа при необходимости).
2. Прогресс по ТЗ — [`IMPLEMENTATION_CHECKLIST.md`](../IMPLEMENTATION_CHECKLIST.md); решения и даты — [`IMPLEMENTATION_JOURNAL.md`](../IMPLEMENTATION_JOURNAL.md).
3. Пользовательские подсказки в приложении по-прежнему в **`Help/`**; сборочные ресурсы — **`electron-builder.yml`**.
