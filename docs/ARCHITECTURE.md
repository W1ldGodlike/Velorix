# Архитектура FluxAlloy

Краткий каркас проекта для онбординга и аудита: где что лежит и почему так устроены границы между процессами Electron.

## Что это за приложение

Десктопная оболочка вокруг **ffmpeg**, **ffprobe** и **yt-dlp** на **Electron + React + TypeScript**. Нормативные требования зафиксированы в корневом [`FLUXALLOY_TZ.md`](../FLUXALLOY_TZ.md).

## Точки входа (что это и зачем)

**Точка входа** — файл или команда, с которой начинается выполнение кода для данного «слоя» приложения. По ним видно, как живёт процесс от запуска до UI.

| Слой                            | Вход                                                                                                                                                                                                | Роль                                                                                                                                                                                                                                                                                    |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Сборка / runtime Electron       | [`package.json`](../package.json) поле `main`: `./out/main/index.js`                                                                                                                                | После `electron-vite build` Node загружает собранный **main process**.                                                                                                                                                                                                                  |
| Main (исходник)                 | [`src/main/index.ts`](../src/main/index.ts) + [`src/main/ipc/`](../src/main/ipc/) + [`preview-proxy-service.ts`](../src/main/preview-proxy-service.ts) + [`ytdlp-download-cli-merge.ts`](../src/main/ytdlp-download-cli-merge.ts) + [`main-application-menu.ts`](../src/main/main-application-menu.ts) + [`main-diagnostics-service.ts`](../src/main/main-diagnostics-service.ts) + [`settings-ipc-persist.ts`](../src/main/settings-ipc-persist.ts) | Жизненный цикл `app`, окна; invoke IPC — `ipc/register-*`; меню, preview proxy, diagnostics/support ZIP, merge CLI yt-dlp — отдельные модули; в `index.ts` — `ipcMain.on` и оркестрация export/batch. |
| Preload (два бандла)            | [`src/preload/index.ts`](../src/preload/index.ts), [`src/preload/downloads-window.ts`](../src/preload/downloads-window.ts); конфиг входов в [`electron.vite.config.ts`](../electron.vite.config.ts) | Узкий мост `contextBridge`: только явные методы, без произвольного доступа к Node из renderer.                                                                                                                                                                                          |
| Renderer (UI)                   | [`src/renderer/src/main.tsx`](../src/renderer/src/main.tsx)                                                                                                                                         | React: по `location.hash` выбирается **`App`** или **`InspectorStandaloneApp`** (инспектор в отдельном окне).                                                                                                                                                                           |
| Автоматизация агентом (вне IDE) | [`scripts/cursor-automation/src/run-loop.ts`](../scripts/cursor-automation/src/run-loop.ts)                                                                                                         | Локальный [**Cursor Agent TS SDK**](https://cursor.com/docs/api/sdk/typescript): создаёт агента с `cwd` = корень репозитория, шлёт промпты из `prompts/`, читает чеклист/журнал по контракту в [`prompts/agent-contract.txt`](../scripts/cursor-automation/prompts/agent-contract.txt). |

Зачем разделять: **безопасность и предсказуемость** — тяжёлое и опасное (процессы, пути, секреты ОС) остаётся в main; UI остаётся в изолированном renderer с **`contextIsolation: true`** и **`nodeIntegration: false`** (см. создание окна в `index.ts`).

## Структура каталогов (логика, не полный список)

- **`src/main/`** — сервисы: движки, очередь yt-dlp, ffprobe, одиночный и **пакетный** экспорт ffmpeg (`ffmpeg-export-batch-*`), терминал (`terminal-service`), медиа-протокол, настройки, логи, support bundle, база знаний (`knowledge-service`).
- **`src/renderer/src/`** — React: единый workspace с вкладками **Редактор / Загрузки / Терминал** (`App.tsx` — state + доменные хуки, сборка пропсов → [`use-app-shell-props.ts`](../src/renderer/src/use-app-shell-props.ts) → [`components/shell/AppShellLayout.tsx`](../src/renderer/src/components/shell/AppShellLayout.tsx)), отдельное окно инспектора (`InspectorStandaloneApp`); панели workspace — [`components/TerminalWorkspacePanel.tsx`](../src/renderer/src/components/TerminalWorkspacePanel.tsx), [`components/downloads/DownloadsSettingsRail.tsx`](../src/renderer/src/components/downloads/DownloadsSettingsRail.tsx), [`components/downloads/DownloadsWorkspaceMain.tsx`](../src/renderer/src/components/downloads/DownloadsWorkspaceMain.tsx), [`components/editor/EditorBatchExportBar.tsx`](../src/renderer/src/components/editor/EditorBatchExportBar.tsx), [`EditorQuickYtdlpBar.tsx`](../src/renderer/src/components/editor/EditorQuickYtdlpBar.tsx), [`EditorPreviewSection.tsx`](../src/renderer/src/components/editor/EditorPreviewSection.tsx), [`EditorFfmpegSettingsRail.tsx`](../src/renderer/src/components/editor/EditorFfmpegSettingsRail.tsx); shell — [`AppShellLayout.tsx`](../src/renderer/src/components/shell/AppShellLayout.tsx) (оболочка: topbar + workspace + statusbar + модалки), [`AppWorkspaceMain.tsx`](../src/renderer/src/components/shell/AppWorkspaceMain.tsx), [`AppWorkspaceTopbar.tsx`](../src/renderer/src/components/shell/AppWorkspaceTopbar.tsx), [`AppStatusbar.tsx`](../src/renderer/src/components/shell/AppStatusbar.tsx), [`AppOverlayDialogs.tsx`](../src/renderer/src/components/shell/AppOverlayDialogs.tsx), [`EnginePathsDialog.tsx`](../src/renderer/src/components/shell/EnginePathsDialog.tsx), [`ExportPresetNameDialog.tsx`](../src/renderer/src/components/shell/ExportPresetNameDialog.tsx); хелперы — `downloads-queue-view.ts`, `app-engines-ui.ts`, `app-shell-ui-helpers.ts`, `app-terminal-hint-ui.ts`, `components/PillSwitch.tsx`; хуки — [`use-ffmpeg-export-batch.ts`](../src/renderer/src/use-ffmpeg-export-batch.ts), [`use-terminal-workspace.ts`](../src/renderer/src/use-terminal-workspace.ts), [`use-downloads-workspace.ts`](../src/renderer/src/use-downloads-workspace.ts), [`use-downloads-url-actions.ts`](../src/renderer/src/use-downloads-url-actions.ts), [`use-editor-export-settings.ts`](../src/renderer/src/use-editor-export-settings.ts), [`use-editor-export-pipeline.ts`](../src/renderer/src/use-editor-export-pipeline.ts), [`use-app-workspace-main-props.ts`](../src/renderer/src/use-app-workspace-main-props.ts), [`use-app-shell-layout-props.ts`](../src/renderer/src/use-app-shell-layout-props.ts), [`use-app-processing-history.ts`](../src/renderer/src/use-app-processing-history.ts), [`use-app-main-window-effects.ts`](../src/renderer/src/use-app-main-window-effects.ts), [`use-app-preview-workspace.ts`](../src/renderer/src/use-app-preview-workspace.ts), [`use-app-toolbar-engine-actions.ts`](../src/renderer/src/use-app-toolbar-engine-actions.ts); строки UI — [`locales/ui-text.ts`](../src/renderer/src/locales/ui-text.ts) (RU/EN); только через `window.fluxalloy` из preload.
- **`src/shared/`** — типы и константы IPC/домена, общие для main и preload/renderer (без импорта Electron в «чистых» модулях).
- **`src/preload/`** — мост и типы [`index.d.ts`](../src/preload/index.d.ts) для `window.fluxalloy`.
- **`Data/`** — конфиги и доверенные хеши §3 ТЗ (`trusted_hashes.json`); в проде копируются как `extraResources` (см. [`electron-builder.yml`](../electron-builder.yml)).
- **`Help/`** — тексты подсказок для UI.
- **[`src/shared/terminal-contract.ts`](../src/shared/terminal-contract.ts)** — контракт сценарных подсказок терминала (вкладка загрузок и превью медиа): поля `summary` / `token` / `fullLine`. После правок русских `summary` нужно дважды выполнить **`npm run locales:terminal-summaries-ru`**, пока второй прогон не покажет **0** замен и **0** gloss (см. [`Help/ffmpeg-terminal-hints.md`](../Help/ffmpeg-terminal-hints.md)).
- **`scripts/cursor-automation/`** — изолированный пакет с `@cursor/sdk`; не является частью приложения в runtime.

## IPC и контракты

- Реестр имён каналов: [`src/shared/ipc-channels.ts`](../src/shared/ipc-channels.ts) (`mainWindowIpc`, `downloadsIpc`) — **156** строковых каналов (invoke + push-события).
- Регистрация `ipcMain.handle` (инвентаризация фазы 1, `npm run audit:ipc-architecture`):

| Файл | `ipcMain.handle` |
|------|------------------|
| [`src/main/index.ts`](../src/main/index.ts) | 0 |
| [`src/main/downloads-window.ts`](../src/main/downloads-window.ts) | 35 |
| [`src/main/ipc/register-export-batch-ipc.ts`](../src/main/ipc/register-export-batch-ipc.ts) | 29 |
| [`src/main/ipc/register-settings-ipc.ts`](../src/main/ipc/register-settings-ipc.ts) | 42 |
| [`src/main/ipc/register-engines-preview-ipc.ts`](../src/main/ipc/register-engines-preview-ipc.ts) | 12 |
| [`src/main/ipc/register-main-utilities-ipc.ts`](../src/main/ipc/register-main-utilities-ipc.ts) | 11 |
| [`src/main/ipc/register-knowledge-diagnostics-ipc.ts`](../src/main/ipc/register-knowledge-diagnostics-ipc.ts) | 8 |
| [`src/main/inspector-window.ts`](../src/main/inspector-window.ts) | 2 |

**Итого invoke-handle:** 139. `npm run audit:ipc-architecture` считает вхождения `ipcMain.handle(` в тексте (в `register-settings-ipc` — 6 строк + 37 через `FFMPEG_EXPORT_SETTING_CHANNELS`).

Остальные каналы реестра — `webContents.send` / broadcast (прогресс, снимки очереди, тема, UI panels).
- Настройки экспорта ffmpeg идут отдельными `settings-set-ffmpeg-export-*` каналами; значения проходят whitelist-парсеры main перед записью и spawn.
- Пакетный экспорт и очередь yt-dlp — отдельные IPC/сервисы с persist в `userData` (`queue.json` и аналоги для batch).
- Каталог вывода yt-dlp, CLI/options и раскрытие панелей загрузок: push `downloadsOutputDirectoryChanged` / `downloadsCliOptionsChanged` / `downloadsWindowUiPanelsChanged` из main во вкладку «Загрузки» и pop-out.
- Терминал: allowlist команд и подсказки из `Data/*_commands.json` + [`terminal-contract.ts`](../src/shared/terminal-contract.ts); не произвольный shell.
- Принцип: **узкий whitelist** — нет произвольного «выполни команду» или чтения произвольных путей без проверок.

## Медиа и доступ к файлам

- Кастомная схема **`fluxmedia://`** и множество **`allowedMediaPaths`** (реальный путь после `realpath`): см. [`src/main/media-protocol.ts`](../src/main/media-protocol.ts). Renderer не может открыть произвольный `file://` без регистрации пути через main.
- **ffprobe** и экспорт допускаются только для путей, прошедших **`isGrantedMediaPath`** (открытие через диалог / явная выдача доступа из main).

## Внешние процессы

- yt-dlp: **`spawn`** с массивом аргументов, без shell (см. [`src/main/ytdlp-download-service.ts`](../src/main/ytdlp-download-service.ts)).
- ffmpeg/ffprobe: разрешённые пути к бинарникам через `engine-service`; автозагрузка Windows с проверкой SHA256 опционально по [`Data/trusted_hashes.json`](../Data/trusted_hashes.json).

## Связка с процессом разработки документации

Чтобы архитектурное описание не расходилось с кодом:

1. При добавлении **нового IPC** — обновить `src/shared/ipc-channels.ts`, preload API и этот файл (раздел IPC / точки входа при необходимости).
2. Прогресс по ТЗ — [`IMPLEMENTATION_CHECKLIST.md`](../IMPLEMENTATION_CHECKLIST.md); решения и даты — [`IMPLEMENTATION_JOURNAL.md`](../IMPLEMENTATION_JOURNAL.md).
3. Пользовательские подсказки в приложении по-прежнему в **`Help/`**; сборочные ресурсы — **`electron-builder.yml`**.
