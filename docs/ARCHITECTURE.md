# Архитектура Velorix

Краткий каркас проекта для онбординга и аудита: где что лежит и почему так устроены границы между процессами Electron.

## Что это за приложение

Десктопная оболочка вокруг **ffmpeg**, **ffprobe** и **yt-dlp** на **Electron + React + TypeScript**. **UI/UX канон** — [`VELORIX_NEON_THEME.md`](VELORIX_NEON_THEME.md). **Активный чеклист** — [`IMPLEMENTATION_NEON_CHECKLIST.md`](IMPLEMENTATION_NEON_CHECKLIST.md). Исторические ТЗ/матрица — [`archive/`](archive/) (не навигатор агента).

### Вспомогательный стек (вне Electron/React/TS/ffmpeg/yt-dlp)

**Обязательно:** для результата использовать всё необходимое (инструменты, фреймворки, плагины, CLI, сервисы); при **первом** внедрении — строка в таблице ниже и при необходимости одна строка в [`IMPLEMENTATION_NEON_CHECKLIST.md`](IMPLEMENTATION_NEON_CHECKLIST.md).

| Компонент | Назначение в Velorix | Примечание |
| --------- | -------------------- | ---------- |
| *(пусто — дополнять по мере внедрения)* | | |

Вспомогательный стек **не** попадает в renderer без IPC и безопасной границы.

## Каталоги на диске (single-root)

- **Установка / распаковка:** `Velorix.exe`, `resources/` (в т.ч. bundled `bin`, `Data`, `Help`).
- **Runtime-данные:** только `<installRoot>/app-data/` — настройки, логи, очереди, история, кэш превью, загрузки yt-dlp по умолчанию, `app-data/bin`, временные каталоги ffmpeg (`app-data/temp`). Задаётся в [`app-data-root.ts`](../src/main/core/app-data-root.ts) (`configurePortableAppDataPaths` до `app.whenReady`).
- **Код** по-прежнему обращается к полю `AppPaths.userData` — это путь к `app-data/`, не `%AppData%`.
- **Штатные JSON:** `Data/` в репо → `resources/Data` в сборке; с `app-data/` не смешиваются.

## Точки входа (что это и зачем)

**Точка входа** — файл или команда, с которой начинается выполнение кода для данного «слоя» приложения.

| Слой | Вход | Роль |
| --- | --- | --- |
| Сборка / runtime Electron | [`package.json`](../package.json) → `main`: `./out/main/index.js` | После `electron-vite build` загружается **main process**. Linux/CI: [`electron-vite-build-meta.ts`](../src/shared/electron-vite-build-meta.ts) + плагин `fix:esm-shim` в [`electron.vite.config.ts`](../electron.vite.config.ts) (false-positive `vite:esm-shim` на `renderer-state-approach.ts`). |
| Main | [`src/main/index.ts`](../src/main/index.ts) → [`main-application-bootstrap.ts`](../src/main/bootstrap/main-application-bootstrap.ts) | `app.whenReady` → окно, меню, backend; IPC bootstrap — shell/log/quit + протоколы (`main-application-bootstrap-ipc.ts`). |
| Preload (один бандл) | [`src/preload/index.ts`](../src/preload/index.ts) + [`preload-velorix-bridge.ts`](../src/preload/preload-velorix-bridge.ts) | `contextBridge` → `window.velorix` (shell, log, quit); без Node в renderer. |
| Renderer | [`src/renderer/src/main.tsx`](../src/renderer/src/main.tsx) | **UI ZERO:** пустой `#root` (без React/CSS). Rebuild — [`docs/reference/README.md`](reference/README.md). |
| SDK automation (вне IDE) | [`scripts/cursor-automation/src/run-loop.ts`](../scripts/cursor-automation/src/run-loop.ts) | [@cursor/sdk](https://cursor.com/docs/api/sdk/typescript); контракт — [`prompts/agent-contract.txt`](../scripts/cursor-automation/prompts/agent-contract.txt). |

### npm: lockfile и peer-deps

- В корне репозитория — [`.npmrc`](../.npmrc): **`legacy-peer-deps=true`** (Vite 8 vs peer `electron-vite` ^7). Канон baseline — `package.json` / `package-lock.json`; lock — `tests/shared/toolchain-baseline-package.test.ts` (журнал **J-1354**).
- GitHub Actions ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)): в job **`check`** (Windows) и **`linux-packaging`** (Ubuntu) шаг **Install** — **`npm ci`** (оба читают корневой `.npmrc`).
- **Dependabot (wave 5):** [x] на **`main`** — журнал **J-1558**; операционно — [`RELEASE.md`](RELEASE.md) §1.
- **Toolchain baseline:** `main` @ `ff89765`, journal **J-1353..1571** — [`toolchain-baseline-wip-handoff-meta.ts`](../src/shared/toolchain-baseline-wip-handoff-meta.ts); план удалён **J-1559**; **следующий commit по J** **J-1580**.
- **Packaging config:** [`electron-builder.yml`](../electron-builder.yml) — win **nsis** + **zip** (no `portable`); mac **dmg** + `notarize: false`; linux AppImage + deb; `publish: null`; **9** §19 yaml comments (`getReleaseCodeSigningElectronBuilderYmlComments`) — §19 в [`docs/RELEASE.md`](RELEASE.md) §4.
- **`npm run build`:** пишет `src/shared/app-build-info.json`. Перед `check` / commit после build — **`{"buildId":"dev","builtAtUtc":null}`** (**J-1386**); см. [`RELEASE.md`](RELEASE.md) §1.
- **LF в исходниках:** только LF; `npm run check:line-endings`; правки — `npm run format` / prettier, не `Set-Content` с CRLF.

Зачем разделять: **безопасность** — процессы, пути и секреты ОС только в main; UI в renderer с **`contextIsolation: true`** и **`nodeIntegration: false`**.

### Main window (post PURGE v3)

- [`main-window.ts`](../src/main/windows/main-window.ts) — frameless shell; ─/✕ через [`register-main-shell-ipc.ts`](../src/main/ipc/register-main-shell-ipc.ts).
- Frameless main window; нативное меню отключено (`hide-application-menu-bar.ts`).
- При активном export/yt-dlp закрытие главного окна — диалог «Остаться / Закрыть и прервать».
- **Запрещено** возвращать `buildDownloadsHtml` / hash-bootstrap pop-out / вторичные `BrowserWindow` под UI.

### Variant A — UI ZERO REBUILD

**VA.5** (J-1651..1667) снял pop-out/dual-theme **до** PURGE v3. Renderer обнулён; весь UI по PNG — **с нуля** ([`VELORIX_NEON_THEME.md`](VELORIX_NEON_THEME.md), [`IMPLEMENTATION_NEON_CHECKLIST.md`](IMPLEMENTATION_NEON_CHECKLIST.md)). Приёмка на железе — после NEON rebuild (ручные сценарии владельца; Support ZIP `unpackedLayout:` + `terminalHints:`).

## Структура каталогов (логика, не полный список)

- **`src/main/`** — доменные сервисы (§21, J-1578):
  - `index.ts` — вход Electron;
  - `bootstrap/` — `app.whenReady`, hosts, IPC bootstrap;
  - `windows/` — `BrowserWindow` (main), `hide-application-menu-bar.ts`, HiDPI/title;
  - `menu/` — шаблон меню приложения;
  - `core/` — app-data, logger, protocols, export paths;
  - `ipc/` — post PURGE: [`register-main-shell-ipc.ts`](../src/main/ipc/register-main-shell-ipc.ts); прочие каналы — в [`ipc-channels.ts`](../src/shared/ipc-channels.ts) для backend, handlers подключать вертикальными срезами при rebuild;
  - `platform/` — фасад `nativeMain` (реэкспорт shared);
  - `services/{settings,presets,ytdlp,ffmpeg,ffprobe,terminal,engines,workflow,downloads,diagnostics,history,knowledge,platform,preview,about,media}/` — spawn, FS, persist;
  yt-dlp/очередь — `services/downloads` (persist + runner); renderer UI — **пока пусто** (см. § Состояние renderer).
- **`src/renderer/src/`** — **UI ZERO:** только [`main.tsx`](../src/renderer/src/main.tsx). `locales/**` и `ui-text` — при rebuild с PNG.
- **`src/shared/`** — типы и константы IPC/домена, общие для main и preload/renderer (без импорта Electron в «чистых» модулях); main UI strings — [`main-application-locale.ts`](../src/shared/main-application-locale.ts); ffmpeg argv — [`ffmpeg-export-argv.ts`](../src/shared/ffmpeg-export-argv.ts) + [`ffmpeg-export-argv-build.ts`](../src/shared/ffmpeg-export-argv-build.ts).
- **`src/preload/`** — [`preload-velorix-bridge.ts`](../src/preload/preload-velorix-bridge.ts) + [`index.d.ts`](../src/preload/index.d.ts); при новом IPC — vertical slice + `audit:ipc-architecture`.
- **`Data/`** — конфиги и доверенные хеши §3 ТЗ (`trusted_hashes.json`); в проде копируются как `extraResources` (см. [`electron-builder.yml`](../electron-builder.yml)).
- **`Help/`** — тексты подсказок для UI.
- **[`src/shared/terminal-contract.ts`](../src/shared/terminal-contract.ts)** — контракт сценарных подсказок терминала (вкладка загрузок и превью медиа): поля `summary` / `token` / `fullLine`. После правок русских `summary` — **`npm run locales:terminal-summaries-ru`** дважды до **0** замен и **0** gloss; в **`npm run check:quiet`** входит **`npm run check:terminal-summaries-ru`** (см. [`Help/ru/ffmpeg-terminal-hints.md`](../Help/ru/ffmpeg-terminal-hints.md)).
- **`scripts/cursor-automation/`** — изолированный пакет с `@cursor/sdk`; не является частью приложения в runtime.

## IPC и контракты

- Реестр имён каналов: [`src/shared/ipc-channels.ts`](../src/shared/ipc-channels.ts) (`mainWindowIpc`, `downloadsIpc`) — invoke + push + `logRenderer` через `ipcMain.on` (см. `npm run audit:ipc-architecture`).
- Проверка связности: `npm run audit:ipc-architecture` — каждый invoke-канал имеет `ipcMain.handle` (или loop `FFMPEG_EXPORT_SETTING_CHANNELS`) в `src/main/` и `ipcRenderer.invoke` / `send` в `src/preload/`; push-каналы — в `PUSH_KEYS` скрипта.
- Регистрация `ipcMain.handle` — post PURGE: [`register-main-shell-ipc.ts`](../src/main/ipc/register-main-shell-ipc.ts); остальные каналы подключать вертикальными срезами при rebuild; рассинхрон preload/main — **`npm run audit:ipc-architecture`** (POST_PURGE mode).
- Push-каналы (`webContents.send`, `ipcMain.on`): прогресс экспорта/очереди, снимки yt-dlp, `uiLocaleChanged`, `processingHistoryChanged`, `logRenderer` и т.д. — см. `PUSH_KEYS` в скрипте audit (legacy UI-panel push сняты).

## Shared contracts (один домен — явные файлы)

| Домен                  | Файлы `src/shared/`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Примечание                                                                                                                                                                                                                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IPC                    | `ipc-channels.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | единственный реестр строк каналов                                                                                                                                                                                                                                                                                     |
| Settings               | `settings-contract.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | view/persist типы                                                                                                                                                                                                                                                                                                     |
| ffmpeg export          | `ffmpeg-export-contract.ts`, `ffmpeg-export-resolve-contract.ts`, `ffmpeg-export-batch-contract.ts`, `ffmpeg-export-benchmark-contract.ts`, `ffmpeg-frames-extract-contract.ts`, `ffmpeg-video-sprite-contract.ts`                                                                                                                                                                                                                                                                                                                                                                               | типы UI/spawn, resolve job, batch queue, бенчмарк §7.2.1, пакетное извлечение кадров §7.6, спрайт §7.5 — не сливать в один файл                                                                                                                                                                                                    |
| media utilities        | `media-utilities-contract.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | §17 remux/integrity, генератор WAV (lavfi), хеши MD5/SHA256 — отдельно от export/extract                                                                                                                                                                                                                              |
| cover extract          | `ffmpeg-cover-extract-contract.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | §17 обложка из очереди загрузок (`downloadsIpc.extractQueueCover`)                                                                                                                                                                                                                                                    |
| external filter script | `external-filter-script-contract.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | §17 AviSynth/VapourSynth в `-vf` экспорта + меню «Сервис»                                                                                                                                                                                                                                                             |
| ffprobe                | `ffprobe-contract.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | probe JSON / UI                                                                                                                                                                                                                                                                                                       |
| yt-dlp                 | `ytdlp-download-contract.ts`, `ytdlp-history-contract.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | download + history                                                                                                                                                                                                                                                                                                    |
| Workflows §10/§11      | `workflow-scenario-contract.ts`, `workflow-scenario-templates.ts`, `workflow-scenario-url.ts`, `scheduled-task-contract.ts`, `workflow-cli-args.ts`, `workflow-watch-folder-contract.ts`, `workflow-scenario-run-plan.ts`, `workflow-run-scenario-on-file.ts`, `workflow-run-scenario-on-url.ts`, `workflow-scenario-ytdlp-complete.ts`, `watch-folder-scan.ts`, `workflow-watch-folder-runner.ts`, `workflow-scenario-runner.ts`, `windows-task-scheduler-sync.ts`, `macos-launchd-sync.ts`, `linux-systemd-user-timer-sync.ts`, `scheduled-task-os-sync.ts` | JSON в `userData/workflows/`; шаблоны local/URL; in-app runner; Win `schtasks` / macOS LaunchAgent / Linux systemd user timer + CLI `--workflow-watch-folder-tick`; ffmpeg → `workflowWatchFolderRunFinished`; редактор: `workflowRunScenarioOnFile` / `workflowRunScenarioOnUrl`; Help `workflows-planner-scenarios` |
| Terminal               | `terminal-contract.ts` (barrel), `terminal-contract-types.ts`, `terminal-contract-hints-meta.ts`, `terminal-contract-hints-*` (22 shards)                                                                                                                                                                                                                                                                                                                                                                                                                       | `check:terminal-contract-hints-shards`                                                                                                                                                                                                                                                                                |
| Engines                | `engine-contract.ts`, `engine-download-contract.ts`, `engine-update-check-contract.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | paths, download, check updates                                                                                                                                                                                                                                                                                        |
| Diagnostics / about    | `diagnostics-contract.ts`, `about-contract.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | support bundle UI                                                                                                                                                                                                                                                                                                     |
| Windows shell §14      | `windows-explorer-context-menu.ts`, `windows-file-association.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | HKCU context menu + OpenWithProgids; CLI `--velorix-shell-*`, `--velorix-install-register-open-with`; main: `windows-explorer-context-menu-sync`, `windows-file-association-sync`, `windows-explorer-shell-fulfill` (IPC handlers — при rebuild)                                                                  |
| Downloads log          | `downloads-log-contract.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | лог очереди загрузок; push в shell route `downloads`                                                                                                                                                                                                                                                                                         |

Проверка списка: `npm run audit:shared-contracts` (неизвестный `*-contract.ts` в `src/shared/` → fail).

- Настройки экспорта ffmpeg идут отдельными `settings-set-ffmpeg-export-*` каналами; значения проходят whitelist-парсеры main перед записью и spawn.
- Пакетный экспорт и очередь yt-dlp — отдельные IPC/сервисы с persist в `app-data/` (`queue.json` и аналоги для batch).
- Каталог вывода yt-dlp и CLI/options: push `downloadsOutputDirectoryChanged` / `downloadsCliOptionsChanged` из main в shell-route `downloads` (после rebuild renderer).
- Терминал: allowlist команд и подсказки из `Data/*_commands.json` + [`terminal-contract.ts`](../src/shared/terminal-contract.ts); не произвольный shell.
- Принцип: **узкий whitelist** — нет произвольного «выполни команду» или чтения произвольных путей без проверок.

## Медиа и доступ к файлам

- **CSP:** [`src/renderer/index.html`](../src/renderer/index.html) — `media-src` / `connect-src`; при падении `<video>` / `fetch` — CSP и способ отдачи файла в main.
- Кастомная схема **`velorixmedia://`** и множество **`allowedMediaPaths`** (реальный путь после `realpath`): см. [`src/main/core/media-protocol.ts`](../src/main/core/media-protocol.ts). Renderer не может открыть произвольный `file://` без регистрации пути через main.
- **ffprobe** и экспорт допускаются только для путей, прошедших **`isGrantedMediaPath`** (открытие через диалог / явная выдача доступа из main).
- **§7.5 спрайт:** после rebuild renderer → preload → IPC `velorix:generate-video-sprite`; main argv — [`ffmpeg-video-sprite-contract.ts`](../src/shared/ffmpeg-video-sprite-contract.ts) + сервисы в `src/main/services/ffmpeg/`.

## Локализация UI (§2.2)

- **Post UI PURGE v3:** корневые `locales/**` удалены; `LOCALE_JSON_SHARDS = []` ([`locale-json-catalog.ts`](../src/shared/locale-json-catalog.ts)). Ручные smoke-строки — `src/shared/post-purge-manual-smoke/{ru,en}/*.json` (не продуктовый ui-text).
- **После NEON rebuild:** новые `locales/{ru,en}/*.json` и renderer ui-text только с подписей PNG; guards `check:locales-json` вернуть в `check:quiet` вместе с ui-text.
- **Main/preload UI** (меню, диалоги ОС): отдельные таблицы [`main-application-locale-strings-*`](../src/shared/main-application-locale.ts), не `locales/**`.
- **Guards:** `check:locales-ts-overlap`; §8 terminal — meta + locales `about.json` / `settings.json`. UI-only guards (`check:ui-*`, `check:renderer-state-approach`, `check:export-preview-hints-locale`) **удалены** на UI ZERO. Support ZIP §18: [`main-diagnostics-service.ts`](../src/main/services/diagnostics/main-diagnostics-service.ts) → `diagnostics.txt`.

## Состояние renderer (§2.2)

**UI ZERO:** в `src/renderer/src/` нет React/CSS/stores — только пустой [`main.tsx`](../src/renderer/src/main.tsx). Канон rebuild: [`docs/reference/README.md`](reference/README.md), [`VELORIX_NEON_THEME.md`](VELORIX_NEON_THEME.md) (**UI-first: бэкенд под refs, legacy удалять**). Зафиксировано в [`renderer-state-approach.ts`](../src/shared/renderer-state-approach.ts) (`RENDERER_STATE_APPROACH = 'none'`).

**Main/preload/IPC** переписываются **под refs**, не наоборот. Новый renderer подключается к `window.velorix` после vertical slice; устаревшие каналы и persist-поля под старый UI — **удалять**, не адаптировать вёрстку.

## nativeMain / platform (§2.1)

Различия ОС для main и smoke — единый модуль [`src/shared/native-main-platform.ts`](../src/shared/native-main-platform.ts); в main импорт через [`src/main/platform/index.ts`](../src/main/platform/index.ts).

| API                                                                              | Назначение                           |
| -------------------------------------------------------------------------------- | ------------------------------------ |
| `isNativeMainWindows` / `Macos` / `Linux`                                        | Ветвление по `process.platform`      |
| `nativeMainEngineExecutableSuffix` / `nativeMainEngineBinaryName`                | Имена ffmpeg/ffprobe/yt-dlp в `bin/` |
| `nativeMainPathEnvSeparator`, `nativeMainDevNullPath`, `nativeMainPathSeparator` | PATH, null sink, help URL            |
| `isNativeMainYtdlpOsPauseSupported`, `isNativeMainYtdlpKillProcessTreeSupported` | §6.4 yt-dlp                          |
| `isNativeMainEngineAutoDownloadSupported`                                        | §3 загрузчик Windows                 |
| `isNativeMainQuitOnLastWindowClosed`, `isNativeMainBrowserWindowNeedsIcon`       | Electron shell                       |

**Allowlist** сырого `process.platform` в `src/main/`: `app-data-root-paths.ts`, `app-data-root.ts`, `logger-service.ts`, `main-diagnostics-service.ts`. Регрессия: `npm run check:native-main-platform-guard`.

## Bundled engines и CI (§3 / §19)

| Платформа   | `engines:prepare:*`                                      | CI (`.github/workflows/ci.yml`)                                                                | Упаковка                                                                                     |
| ----------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Windows x64 | `npm run engines:prepare:win` (`predev`, `prebuild:win`) | **Да** — `windows-latest`, prepare + `engines:doctor` + packaged smokes                        | `release:win*`, `check:release`                                                              |
| macOS       | `engines:prepare:mac` (`prepare-engines-unix.mjs`); `predev` — verify `bin/` если ffmpeg/ffprobe/yt-dlp уже есть | **Нет** job                                                                                    | `pack:mac:dir` + `verify:mac-unpacked` (skip на non-darwin); релиз `build:mac` (dmg) — бинарники в `bin/` вручную |
| Linux       | `engines:prepare:linux` (`prepare-engines-unix.mjs`); `predev` — verify `bin/` если бинарники есть           | **Да** — `ubuntu-latest`: `check:quiet` + `build` + `pack:linux:dir` + `verify:linux-unpacked` | `build:linux` + `verify:linux-release` (AppImage/deb) локально; verify-скрипты skip на non-linux |

**Verify layout (без installer smoke):** [`verify-macos-unpacked-layout.mjs`](../scripts/release/verify-macos-unpacked-layout.mjs) (`verify:mac-unpacked`, exit 0 на non-darwin); [`verify-linux-unpacked-layout.mjs`](../scripts/release/verify-linux-unpacked-layout.mjs) (`verify:linux-unpacked`, CI + local Linux); [`verify-linux-release-artifacts.mjs`](../scripts/release/verify-linux-release-artifacts.mjs) (`verify:linux-release`, local Linux only). Guards: `check:platform-packaging-scripts` сверяет `package.json` ↔ реестр, `electron-builder --mac|--linux`, skip-хосты verify-скриптов, [`electron-builder.yml`](../electron-builder.yml) mac/linux/dmg/AppImage/deb.

Диагностика: [`platform-packaging-scripts.ts`](../src/shared/platform-packaging-scripts.ts) → `check:platform-packaging-scripts`; §19 signing — [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](RELEASE.md). CI packaged: `pack:dir` + `verify:win-unpacked`. Support ZIP: `unpackedLayout:` / `terminalHints:`. `check:help-terminal-hints-docs`, `check:support-bundle-terminal-hints` in `check:quiet`.

## Внешние процессы

- yt-dlp: **`spawn`** с массивом аргументов, без shell (см. [`src/main/services/ytdlp/ytdlp-download-service.ts`](../src/main/services/ytdlp/ytdlp-download-service.ts)).
- ffmpeg/ffprobe: разрешённые пути к бинарникам через `engine-service`; автозагрузка Windows с проверкой SHA256 опционально по [`Data/trusted_hashes.json`](../Data/trusted_hashes.json).

## Связка с процессом разработки документации

Чтобы архитектурное описание не расходилось с кодом:

1. При добавлении **нового IPC** — обновить `src/shared/ipc-channels.ts`, preload API и этот файл (раздел IPC / точки входа при необходимости).
2. Sprint TODO — [`IMPLEMENTATION_NEON_CHECKLIST.md`](IMPLEMENTATION_NEON_CHECKLIST.md); решения и даты — [`IMPLEMENTATION_JOURNAL.md`](../IMPLEMENTATION_JOURNAL.md).
3. Пользовательские подсказки в приложении по-прежнему в **`Help/`**; сборочные ресурсы — **`electron-builder.yml`**.
