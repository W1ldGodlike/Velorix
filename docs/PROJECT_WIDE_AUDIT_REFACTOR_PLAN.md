# Программа: полный аудит и рефакторинг репозитория

> **Статус:** активный временный трек (2026-05).  
> **Удалить этот файл** после фазы 9 (критерии «Готово») — канон процесса останется в `.cursor/rules/fluxalloy-project-audit.mdc` и скриптах `audit-*` / `check:field-registries`.

Владелец: запрос на **ВСЁ** — весь исполняемый код, все зоны репо, без сужения до §9/ffprobe/`src` только.  
Агент: **не додумывать scope** — если в плане «весь репозиторий», работать по таблице областей ниже.

### ⛔ PROGRAM GATE (владелец, 2026-05-16) — до фазы 9

**Пока в §9 есть хотя бы один чекбокс не ✅ — вся остальная работа по репозиторию на СТОПЕ** для любых агентов (Cursor, SDK, marathon, «продолжай»).

| Разрешено | Запрещено (без явной просьбы владельца в чате) |
|-----------|------------------------------------------------|
| Срезы по **§4–§8** этого плана (текущая фаза → первый ⬜) | `## Ближайший TODO спринта`, §6–§9 ТЗ, ffprobe/smoke/терминал «ещё одно поле» |
| `audit:*`, `check:field-registries`, fixtures/`it.each` в `tests/` | Новые product-фичи, расширение registry/smoke ради покрытия полей |
| Слой B при закрытии зоны (rules/CI) | Marathon-cadence коммит **только** off-program diff |
| Одна сводная `J-*` на срез программы | Микро-J на одно поле/тег/предикат |

**«Продолжай»** = следующий срез **программы** (сейчас: **фаза 4** — P1 `index.ts` / крупные модули по `audit:structural`), **не** спринт и не ffprobe.

**Приоритет над:** `IMPLEMENTATION_CHECKLIST.md` (спринт), `agent-contract.txt` (SDK sprint), marathon cadence по продукту.

**Off-program WIP:** в `git stash` (метка `off-program: ffprobe/smoke/terminal WIP`); не продолжать без явной просьбы владельца.

### Возобновление после off-program (не «с начала»)

**Запрещено:** сбрасывать чекбоксы §9 фаз 0–2; заново проходить фазы 0–2 «потому что агент ушёл в спринт»; откатывать уже закоммиченные срезы программы без явной просьбы владельца.

**Обязательно:** `npm run audit:copy-paste` → первый hotspot/⬜ **текущей** фазы (сейчас фаза 3: `tests/shared/ffprobe-container-format.test.ts`); `npm run check:quiet` перед срезом.

**Итог:** программа **продолжается** с фазы 3, а не перезапускается с фазы 0.

---

## 1. Что значит «ВСЁ» (явная граница)

| Входит в программу | Не входит (только по отдельной задаче) |
|--------------------|----------------------------------------|
| `src/**` — main, preload, renderer, shared | `Help/**` — пользовательская документация (содержание, не код) |
| `tests/**` — unit/integration | `Data/**` — JSON-данные, хеши движков (не рефакторить структуру без ТЗ) |
| `scripts/**` — CI, audit, automation | `resources/luts/*.cube` — бинарные ассеты |
| Корневые конфиги: `vitest.config.ts`, `electron.vite.config.ts`, `eslint.config.mjs`, `tsconfig*.json` | `bin/**` — бинарники движков |
| `.github/workflows/**` — если ломает `check` | `FLUXALLOY_TZ.md` — не редактировать без просьбы владельца |
| `docs/ARCHITECTURE.md`, `ipc-channels` — синхрон с кодом | Маркетинговые README — только факты при расхождении |

**Scope в коде:** `scripts/audit-scope.config.mjs` — единственное место, куда добавлять новые корни/исключения при росте проекта.  
**Счётчик файлов не хардкодится:** `npm run audit:inventory` → `docs/audit-manifest.json`.

---

## 2. Правила: два слоя (как вы описали)

Фраза «закрепить правила **до** рефакторинга» была неудачной. Имеется в виду **два разных момента**:

### A. До и во время рефакторинга — **ограждения**, чтобы не накосячить сильнее

Цель: пока код ещё «сырой», **не усугублять** (новая копипаста, микро-J, сужение scope, поломка без тестов).

| Что | Где |
|-----|-----|
| Не сужать «весь проект» до ffprobe/§9 | `fluxalloy-project-audit.mdc`, `fluxalloy-iteration-batch.mdc` |
| Одна J на итерацию, пакетные срезы | `fluxalloy-journal.mdc`, `fluxalloy-iteration-batch.mdc` |
| Уже закрытые зоны не откатывать | `check:field-registries`, `audit:copy-paste` (регрессии = fail) |
| Новые поля — в реестр, не ctrl+c | таблица реестров в `fluxalloy-iteration-batch.mdc` |
| Тесты — fixtures, не inline `probeBase` | `check:field-registries` |

Это **не** «все будущие правила на веки» — только **страховка на период большого рефактора**.

### B. По результатам рефакторинга — **актуализировать**, чтобы не повторилось

Цель: всё, что нашли и **исправили**, перенести в постоянные правила и CI, иначе через месяц снова нарастёт копипаста.

**Когда:** в **том же коммите**, где зона фазы считается закрытой (не «когда-нибудь потом»).

| Нашли при рефакторе | Закрепить |
|---------------------|-----------|
| Паттерн копипасты (N похожих parse/export) | строка в реестре + проверка в `check:field-registries` |
| Дубли в тестах | fixture / `it.each` + запрет в audit |
| Новый модуль после split | `docs/ARCHITECTURE.md` + при IPC — `ipc-channels.ts` |
| Временный HACK убрали | правило «как правильно» в `fluxalloy-iteration-batch.mdc` или узкий `.mdc` |
| Hotspot исчез из audit | порог/ошибка в `audit-copy-paste` (warning → fail) |

**Итог:** сначала **ограждения** (A), по мере закрытия зон — **ужесточение** (B). В конце программы (фаза 9) план-файл удаляется; остаются rules + `npm run check:quiet`.

---

## 3. Цели рефакторинга (три слоя)

1. **Копипаста** — registries, `parseWhitelistEnum`, fixtures, `it.each`; запрет возврата через CI.  
2. **Крупные модули** — файлы с высокой связностью/размером; разбиение по слоям (shared ← main ← renderer).  
3. **Временное / «как нибудь»** — TODO/FIXME, дубли IPC, несогласованные контракты, обходы без тестов.

Каждый слой закрывается **фазами**; одна marathon-итерация = один срез фазы, одна `J-*`.

---

## 4. Инфраструктура (фаза 0 — частично сделано)

| Артефакт | Назначение |
|----------|------------|
| `scripts/audit-scope.config.mjs` | Scope обхода (растёт с проектом) |
| `npm run audit:inventory` | Manifest всех файлов scope |
| `npm run audit:copy-paste` | Hotspots + регрессии |
| `npm run check:field-registries` | Защита реестров |
| `.cursor/rules/fluxalloy-project-audit.mdc` | Поведение агента на время программы |
| `.cursor/rules/fluxalloy-iteration-batch.mdc` | Пакетные итерации, anti-micro |

**Сделать в фазе 0 (остаток):**

- [x] **0.1** Зафиксировать baseline: `npm run audit:inventory` → `docs/audit-manifest.json` (**362** files, 2026-05-17; было 277/279 на старте).  
- [x] **0.2** `npm run audit:structural` — размер файлов, `TODO|FIXME|HACK` (29 файлов ≥400 строк; крупнейшие: `terminal-contract.ts`, `App.tsx`, `index.ts`).  
- [x] **0.3** Таблица hotspots → колонка «фаза» в §6 Hotspot log.  
- [x] **0.4** Синхронизация: `docs/SOURCES_OF_TRUTH.md`, `AGENTS.md`, `agent-contract.txt`, rules (`9c825bd`).

---

## 5. Пошаговый план фаз

### Фаза 1 — Инвентаризация (карта, без массового рефактора)

**Цель:** полный список долгов, приоритеты, ноль «сюрпризов».

| Шаг | Действие | Выход |
|-----|----------|--------|
| 1.1 | `audit:inventory` + сохранить manifest | `docs/audit-manifest.json` |
| 1.2 | Прогон `audit:copy-paste`, выписать все hotspots в таблицу ниже | § «Hotspot log» |
| 1.3 | `rg "TODO|FIXME|HACK|temporary|временн" src tests scripts` | список файлов |
| 1.4 | Файлы >400 строк (скрипт structural) | кандидаты фазы 4 |
| 1.5 | Сверка `docs/ARCHITECTURE.md` ↔ `ipc-channels.ts` | список расхождений |

**Критерий готовности:** таблица hotspots заполнена; manifest в репо; одна сводная `J-*`.

**Результаты (2026-05-16, J-703):**

| Шаг | Статус | Выход |
|-----|--------|--------|
| 1.1 | ✅ | `docs/audit-manifest.json` — **362** файлов (2026-05-17; baseline 279) |
| 1.2 | ✅ | §6 Hotspot log (6 строк + structural list) |
| 1.3 | ✅ | См. таблицу TODO ниже |
| 1.4 | ✅ | 29 файлов ≥400 строк (`npm run audit:structural`) |
| 1.5 | ✅ | `npm run audit:ipc-architecture`; правка `ARCHITECTURE.md` (таблица handle) |

**TODO/FIXME/HACK в коде (не «TODO спринта» в чеклисте):**

| Файл | Тип | Суть |
|------|-----|------|
| `src/main/engine-service.ts` | `TODO(§3)` | progress/checking при длительной проверке хешей |
| `src/main/engine-download.ts` | комментарий | macOS/Linux загрузчики — заглушка, §3 |
| `scripts/cursor-automation/src/run-loop.ts` | текст промпта | не технический долг |

`audit:structural` считает **17** вхождений слова TODO в репо scope — большинство ложные (скрипты чеклиста, заголовки).

**IPC:** реестр **156**, `ipcMain.handle` **139** (index 102 + downloads 35 + inspector 2); расхождение — push-каналы без handle.

---

### Фаза 2 — Копипаста: парсеры и реестры (`src`)

**Цель:** любой whitelist/поле — таблица, не N функций.

| Зона | Статус | Реестр / файл |
|------|--------|----------------|
| ffprobe `format.tags.*` | ✅ | `ffprobe-format-tag-registry.ts` |
| ffprobe `format.*` | ✅ | `ffprobe-container-field-registry.ts` |
| ffmpeg export enum | ✅ | `ffmpeg-export-parse-registry.ts` |
| ffmpeg export resolve | ✅ | `ffmpeg-export-resolve-field-registry.ts` |
| settings.json stored | ✅ | `settings-stored-parse.ts` |
| `ytdlp-download-options.ts` | ✅ | `ytdlp-download-stored-parse.ts` + `check:field-registries` |
| `ffmpeg-export-service.ts` (остаток parse) | ✅ | `ffmpeg-export-stored-parse`, `user-preset-parse`, `progress-parse` |
| `ffprobe-side-data.ts` summarizers | ✅ | `FFPROBE_SIDE_DATA_RULES` + `check:field-registries` |
| `ffprobe-summary-export-locale.ts` | ✅ | `ffprobe-summary-container-template-specs` |

| Шаг | Действие |
|-----|----------|
| 2.1 | Закрыть hotspots `whitelist-if-chains` в `src/` |
| 2.2 | Расширить `check:field-registries` под каждый новый реестр |
| 2.3 | Пакетные тесты на реестры (`it.each`), не 1 поле = 1 файл |

**Критерий:** `audit:copy-paste` без hotspots в `src/` (кроме явно помеченных WIP в таблице).

---

### Фаза 3 — Копипаста: тесты (`tests`)

| Зона | Статус | Действие |
|------|--------|----------|
| `MediaProbeSuccess` base | ✅ | `tests/fixtures/media-probe-success-base.ts` |
| `AppSettings` base | ✅ | `tests/fixtures/app-settings-base.ts` |
| `terminal-contract-scenarios.test.ts` (4 it + 6×it.each) | [x] | batches 60/690; preview 35+182 predicates; meta smoke |
| `ytdlp-progress-parser.test.ts` (77 it) | ✅ | `ytdlp-progress-parse-cases` + `it.each` |
| `ffmpeg-export-argv.test.ts` (67 it) | ✅ | `ffmpeg-export-argv-cases` + `it.each` (filter/trim/encode) |
| `ffprobe-service.test.ts` (29 it + it.each) | ✅ | track-detail-cases |
| Остальные `many-standalone-it` | ⬜ | по убыванию count из audit |

| Шаг | Действие |
|-----|----------|
| 3.1 | Запрет inline probeBase (CI) — ✅ |
| 3.2 | Общие fixtures: export job options, ytdlp queue row, terminal line |
| 3.3 | Уплотнить top-3 файла по `many-standalone-it` |
| 3.4 | `check:field-registries` — запрет дубля `const probeBase` |

**Критерий:** нет файлов tests с `many-standalone-it` выше порога (понизить порог в config после top-3).

---

### Фаза 4 — Крупные модули (разбиение)

Работать **по одному файлу за 1–2 итерации**, не смешивать с фазой 2 в одной J.

| Приоритет | Файл | Проблема | Направление |
|-----------|------|----------|-------------|
| P1 | `src/main/index.ts` | IPC god-module | handlers → `src/main/ipc/*.ts` |
| P1 | `src/renderer/src/App.tsx` | UI + логика | hooks, подкомпоненты |
| P2 | `src/main/ffmpeg-export-service.ts` | spawn + parse + presets | service / parse / spawn |
| P2 | `src/main/ffprobe-service.ts` | probe + tracks | probe core / track builder |
| P2 | `src/shared/ffmpeg-export-argv.ts` | argv builder | filters / hw / container |
| P3 | `src/shared/terminal-contract.ts` | сценарии | уже частично; не дублировать тесты |
| P3 | `src/main/settings-store.ts` | load whitelist | уже parse extract; split load sections |

| Шаг | Действие |
|-----|----------|
| 4.1 | Для файла: тесты зелёные до split |
| 4.2 | Выделить без изменения поведения |
| 4.3 | `docs/ARCHITECTURE.md` — новые модули |
| 4.4 | Не оставлять re-export «ради совместимости» >1 итерацию |

**Критерий:** ни один файл в `AUDIT_LARGE_MODULE_CANDIDATES` не >500 строк без обоснования в комментарии модуля.

---

### Фаза 5 — Временное и долги

| Шаг | Действие |
|-----|----------|
| 5.1 | Каждый `TODO/FIXME` — тикет в чеклист спринта или исправить |
| 5.2 | Удалить мёртвый код, неиспользуемые export |
| 5.3 | `journal-consolidate` — не трогать старые MERGE без владельца |

---

### Фаза 6 — `scripts/` и automation

| Шаг | Действие |
|-----|----------|
| 6.1 | Общий `scripts/lib/*.mjs` для повторяющихся readFile/spawn |
| 6.2 | cursor-automation: не дублировать промпты (single source) |
| 6.3 | smoke-* — общая lib (частично есть) |

---

### Фаза 7 — Контракты и ARCHITECTURE

| Шаг | Действие |
|-----|----------|
| 7.1 | Каждый IPC: `ipc-channels.ts` + preload + main + ARCHITECTURE |
| 7.2 | Shared contracts: один файл — один домен |
| 7.3 | `npm run check` полный перед релизом |

---

### Фаза 8 — Ужесточение CI (не допустить откат)

| Шаг | Действие |
|-----|----------|
| 8.1 | Hotspot → error (не warning) по мере закрытия фазы |
| 8.2 | Добавить `check:structural` в `check:quiet` |
| 8.3 | PR checklist: `audit:inventory` diff при добавлении корней в scope |

---

### Фаза 9 — Закрытие программы

| Шаг | Действие |
|-----|----------|
| 9.1 | Все фазы ✅ в таблице статуса |
| 9.2 | Удалить `docs/PROJECT_WIDE_AUDIT_REFACTOR_PLAN.md` |
| 9.3 | Оставить `fluxalloy-project-audit.mdc` в режиме «поддержка» (короткий) |
| 9.4 | Сводная `J-*`: программа закрыта |

---

## 6. Hotspot log (обновлять агенту каждую 5-ю итерацию)

_Заполняется из `npm run audit:copy-paste` + structural. Дата baseline: 2026-05-16._

| kind | count | file | Фаза | Срез (1 предложение, до кода) | Статус |
|------|-------|------|------|-------------------------------|--------|
| many-standalone-it | 4 | tests/shared/terminal-contract-scenarios.test.ts | 6 | predicates + substrings + batches | [x] J-714 |
| many-standalone-it | 77 | tests/main/ytdlp-progress-parser.test.ts | 3 | case matrix + it.each | ✅ J-706 |
| many-standalone-it | 67 | tests/shared/ffmpeg-export-argv.test.ts | 3 | argv-cases + it.each | ✅ J-707 |
| many-standalone-it | 46 | tests/main/ffprobe-service.test.ts | 3 | track-detail-cases + it.each | ✅ J-708 |
| many-standalone-it | 25 | tests/shared/ffprobe-container-format.test.ts | 3 | `ffprobe-container-format-cases` + `it.each` | ✅ J-785 |
| many-export-parse | 13 | src/main/ffmpeg-export-service.ts | 2 | stored/user-preset/progress parse modules | ✅ J-705 |
| whitelist-if-chains | 4 | src/main/ytdlp-download-options.ts | 2 | Реестр whitelist chains + тесты; убрать 4× if-chain | ✅ J-704 |

**Структурные (≥400 строк, фаза 4):** `terminal-contract.ts` (13008), `downloads-window.ts` (4074), `ui-text.ts` (2848), `index.ts` (2141→срез: preview-proxy + ytdlp-cli-merge), `ffmpeg-export-argv.ts` (1055), `ffprobe-service.ts` (1017), `App.tsx` (820). Полный список: `npm run audit:structural`.

| structural | 2141 | src/main/index.ts | 4 | `preview-proxy-service.ts` + `ytdlp-download-cli-merge.ts` | ✅ J-786 |
| structural | ~1900 | src/main/index.ts | 4 | `main-application-menu.ts` (buildApplicationMenu + diagnostics submenu) | ✅ J-787 |
| structural | ~1650 | src/main/index.ts | 4 | `main-diagnostics-service.ts` (support ZIP, logs, process error dialog) | ✅ J-788 |
| structural | ~1400 | src/main/index.ts | 4 | `main-window.ts` (createMainWindow, close guard, preload load) | ✅ J-789 |
| structural | ~1200 | src/main/index.ts | 4 | `main-export-output-paths.ts` (grant set, open export output, dialog defaults) | ✅ J-790 |
| structural | ~1100 | src/main/index.ts | 4 | `main-ytdlp-settings-persist.ts` + `main-ffmpeg-export-batch-host.ts` | ✅ J-791 |
| structural | ~967 | src/main/index.ts | 4 | `main-ytdlp-download-main-handler.ts` (open in main + auto-export after yt-dlp) | ✅ J-792 |
| structural | ~785 | src/main/index.ts | 4 | `main-downloads-window-bounds-bootstrap.ts` (configureDownloadsWindowBoundsHooks deps) | ✅ J-793 |
| structural | ~678 | src/main/index.ts | 4 | `main-bootstrap-ipc-helpers.ts` (locale, IPC parsers, renderer log rate-limit) | ✅ J-794 |
| structural | ~552 | src/main/index.ts | 4 | `main-cached-settings-host.ts` (settings.json cache, bounds, dialog defaults, TZ path) | ✅ J-795 |
| structural | ~411 | src/main/index.ts | 4 | `main-window-runtime-state.ts` + `main-application-bootstrap.ts` (`whenReady` orchestration) | ✅ J-796 |
| structural | 819 | src/renderer/src/App.tsx | 4 | `use-app-composition.ts` (hooks + `useAppShellProps` assembly) | ✅ J-797 |
| structural | ~815 | src/renderer/src/use-app-composition.ts | 4 | split: `use-app-composition-state` + `use-app-shell-props-input` + orchestrator | ✅ J-798 |
| structural | 857 | src/main/ffmpeg-export-service.ts | 4 | `ffmpeg-export-app-settings-merge.ts` + `ffmpeg-export-spawn-once.ts` | ✅ J-800 |
| structural | 1017 | src/main/ffprobe-service.ts | 4 | `ffprobe-track-detail-builder.ts` + `ffprobe-probe-json.ts` | ✅ J-801 |
| structural | 1055 | src/shared/ffmpeg-export-argv.ts | 4 | `ffmpeg-export-argv-filters.ts` + `ffmpeg-export-argv-build.ts` | ✅ J-802 |
| structural | 610 | src/main/settings-store.ts | 4 | `settings-store-load-parse.ts` (whitelist parsers) + entry load/save | ✅ J-803 |
| structural | 896 | src/main/ytdlp-progress-parser.ts | 4 | `ytdlp-progress-parser-download.ts` + `ytdlp-progress-parser-queue.ts` | ✅ J-804 |
| structural | 775 | src/preload/index.ts | 4 | `preload-sanitize.ts` + `preload-fluxalloy-settings.ts` + `preload-fluxalloy-bridge.ts` | ✅ J-805 |
| structural | 727 | src/main/downloads-queue-runner.ts | 4 | `downloads-queue-runner-state.ts` + `downloads-queue-runner-ytdlp-row.ts` | ✅ J-806 |
| structural | 720 | src/main/ipc/register-export-batch-ipc.ts | 4 | `register-single-export-ipc.ts` + `register-batch-export-queue-ipc.ts` | ✅ J-807 |
| structural | 868 | src/main/ffprobe-track-detail-builder.ts | 4 | `ffprobe-json-types.ts` + `ffprobe-track-detail-helpers.ts` + `ffprobe-track-detail-build.ts` (entry re-export) | ✅ J-808 |
| structural | 505 | src/main/ffprobe-track-detail-build.ts | 4 | `ffprobe-track-detail-by-codec.ts` (video/audio/subtitle/other append*) + orchestrator | ✅ J-809 |
| structural | 569 | src/preload/preload-fluxalloy-bridge.ts | 4 | `preload-fluxalloy-downloads.ts` + `preload-fluxalloy-export.ts` (orchestrator) | ✅ J-810 |
| structural | 810 | src/renderer/src/use-app-shell-props-input.ts | 4 | `use-app-shell-props-input-hooks.ts` + `use-app-shell-props-input-workspace.ts` + `use-app-shell-props-input-layout.ts` | ✅ J-811 |
| structural | 814 | src/renderer/src/components/MediaProbePanel.tsx | 4 | `media-probe-panel-helpers.ts` (table IDs, menu, format/TSV); `PreviewProbeBody` in panel | ✅ J-811 |
| structural | 919 | src/renderer/src/use-editor-export-settings.ts | 4 | `editor-export-select-options.ts` + `editor-export-settings-hydrate.ts` + `editor-export-settings-constants.ts` | ✅ J-812 |
| structural | 1602 | src/renderer/src/components/editor/EditorFfmpegSettingsRail.tsx | 4 | `editor-ffmpeg-settings-rail-props.ts` + `EditorFfmpegSettingsRailVideoSection.tsx` + `editor-ffmpeg-settings-rail-constants.ts` | ✅ J-813 |
| structural | 934 | src/renderer/src/components/editor/EditorFfmpegSettingsRail.tsx | 4 | `EditorFfmpegSettingsRailFormat/Audio/Presets/OutputSection.tsx` (остальные `<details>`) | ✅ J-814 |
| structural | 907 | src/renderer/src/components/VideoTimeline.tsx | 4 | `video-timeline-helpers.ts` + `VideoTimelineToolbar.tsx` + `VideoTimelineUnifiedPane.tsx` | ✅ J-815 |
| structural | 4074 | src/main/downloads-window.ts | 4 | `downloads-window-html.ts` (`buildDownloadsHtml` pop-out static HTML) | ✅ J-816 |
| structural | 1282 | src/main/downloads-window.ts | 4 | `downloads-window-runtime.ts` + `register-downloads-window-ipc.ts` (IPC handlers) | ✅ J-817 |
| structural | 830 | src/renderer/src/components/downloads/DownloadsSettingsRail.tsx | 4 | `downloads-settings-rail-props.ts` + `DownloadsSettingsRail*Section.tsx` (format/metadata/saving/network/expert) | ✅ J-818 |
| structural | 769 | src/renderer/src/components/downloads/DownloadsWorkspaceMain.tsx | 4 | `downloads-workspace-main-props.ts` + Band/Overview/QueueTable/LowerStack sections | ✅ J-819 |
| structural | 919 | src/main/register-downloads-window-ipc.ts | 4 | `register-downloads-*-ipc.ts` (snapshot/options/queue+history/runner/bridge) + orchestrator | ✅ J-820 |
| structural | 704 | src/shared/downloads-window-ui-locale.ts | 4 | `downloads-window-ui-locale-types.ts` + `downloads-window-ui-strings-ru|en.ts` + entry re-export | ✅ J-821 |
| structural | 745 | src/renderer/src/components/editor/EditorBatchExportBar.tsx | 4 | `editor-batch-export-bar-props.ts` + `EditorBatchExportBarToolbar|QueueTable.tsx` | ✅ J-822 |
| structural | 830 | src/renderer/src/components/MediaProbePanel.tsx | 4 | `use-preview-probe-body.ts` + `PreviewProbeBodyOverview|Sections|ContextMenu.tsx` | ✅ J-823 |
| structural | 683 | src/main/settings-ipc-persist.ts | 4 | `settings-ipc-persist-core.ts` + `settings-ipc-persist-shell|ffmpeg.ts` + orchestrator | ✅ J-824 |
| structural | 743 | tests/main/ffprobe-service.test.ts | 4 | entry `it.each` + `ffprobe-service-track-rows-fields|color-meta|side-data.test.ts` | ✅ J-825 |
| structural | 595 | src/main/ytdlp-download-options.ts | 4 | `ytdlp-download-options-preview|validate|snapshot.ts` + entry re-export | ✅ J-826 |
| structural | 645 | tests/main/ffmpeg-export-service.test.ts | 4 | entry helpers + `ffmpeg-export-service-user-preset|snapshot-merge|presets-catalog.test.ts` | ✅ J-827 |
| structural | 632 | src/renderer/src/use-editor-export-settings.ts | 4 | `editor-export-settings-snapshot-build.ts` + `use-editor-export-user-preset-actions.ts` | ✅ J-828 |
| structural | 609 | tests/main/ytdlp-progress-parser.test.ts | 4 | `ytdlp-progress-parser-download|info-display|queue-failure|output-path.test.ts` | ✅ J-829 |

---

## 7. Синхронизация правил (чеклист на закрытие зоны)

**Канон однозначности:** [`.cursor/rules/fluxalloy-rules-explicit.mdc`](../.cursor/rules/fluxalloy-rules-explicit.mdc) + `npm run check:rules-explicit`.

При **каждом** «зона закрыта» — один коммит, в нём:

1. Код рефактора + тесты зелёные (`check:quiet`).
2. Обновить §6 hotspot log (статус ✅).
3. **Слой B:** дописать/ужесточить rule или `check:*` под найденный антипаттерн.
4. Если менялась договорённость — `docs/SOURCES_OF_TRUTH.md` (таблица синхронизации).

| Постоянный артефакт | Роль |
|---------------------|------|
| `fluxalloy-project-audit.mdc` | ограждения (A) на время программы |
| `fluxalloy-iteration-batch.mdc` | реестры, anti-micro |
| `check:field-registries.mjs` | слой B для копипасты |
| `audit-copy-paste-patterns.mjs` | слой B для hotspots |

---

## 8. Workflow одной marathon-итерации

1. Прочитать **текущую фазу** (первый блок с ⬜ в §4).  
2. `npm run audit:inventory` если менялся scope или много новых файлов.  
3. `npm run audit:copy-paste` — взять **верхний** hotspot текущей фазы.  
4. Заполнить колонку **«срез»** в §6 для выбранного hotspot; пакет правок + тесты; слой B при закрытии зоны.  
5. Обновить §6 (статус ✅) и чекбоксы §9.  
6. Одна `J-*`, `npm run check:quiet`, `agent:session -- bump`.

**Запрещено:** «продолжай» только для одного тега/поля; сужение scope без явной просьбы.

---

## 9. Статус фаз (чеклист)

- [x] Фаза 0 — audit scripts, registries, fixtures, inventory manifest, structural script, правила  
- [x] Фаза 1 — инвентаризация (таблицы долгов, ARCHITECTURE↔IPC, `audit:ipc-architecture`)  
- [x] Фаза 2 — src registries + side-data/summary locale + §6/§7 batch/hw/ytdlp filename (J-704–718; `audit:copy-paste` src без hotspots)  
- [x] Фаза 3 — tests: `it.each`/fixtures; `audit:copy-paste` без hotspots (J-706–708, J-785; верификация 0–2 2026-05-17)  
- [ ] Фаза 4 — крупные модули (след.: P1 `index.ts` IPC split — частично J-739; structural ≥400 строк)  
- [ ] Фаза 5 — TODO/временное  
- [ ] Фаза 6 — scripts  
- [ ] Фаза 7 — ARCHITECTURE/contracts  
- [ ] Фаза 8 — CI hardening  
- [ ] Фаза 9 — закрытие  

---

## 10. Оценка объёма (честно)

Полная программа — **десятки marathon-итераций**, не одна сессия.  
Порядок выбран так, чтобы **сначала** CI/правила (не откатить), **потом** src, **потом** tests, **потом** splits — иначе снова ctrl+c в тестах после рефактора src.

Владелец может сказать «фаза N только» — тогда агент **всё равно** не сужает внутри фазы до подпункта без согласования.
