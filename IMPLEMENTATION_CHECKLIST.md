# FluxAlloy — рабочий чек-лист реализации

Источник требований: **[`FLUXALLOY_TZ.md`](FLUXALLOY_TZ.md)**. **Запрещено** правки ТЗ без **явной просьбы владельца** (глоссарий `fluxalloy-rules-explicit.mdc`). Состояние по §, спринту и TODO — **в этом файле**; хронологию решений, проверок окружения и длинные заметки — в **[`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md)**.

**Канон формата спринта и меток — этот файл** (раздел «Ближайший TODO спринта» ниже). Исполняемая копия для Cursor: [`.cursor/rules/fluxalloy-checklist.mdc`](.cursor/rules/fluxalloy-checklist.mdc). Иерархия: [`docs/SOURCES_OF_TRUTH.md`](docs/SOURCES_OF_TRUTH.md). Marathon: [`docs/AGENT_MARATHON.md`](docs/AGENT_MARATHON.md).

## Готовность полного итога

- **Оценка: ~45%**. Рабочее ядро Electron/React, preview/ffmpeg, **пакетный экспорт §7.3** (каркас), расширенный yt-dlp, **терминал §8 (v1)**, ffprobe-инспектор, база знаний §15, **HW auto/manual §16** (частично), диагностика и CI/release guardrails; крупно не закрыты планировщик/конструктор сценариев, **плоские `locales/**` и смена языка без перезапуска**, полировка цепочек NVENC/AMF/QSV/VAAPI, утилиты §17.5, ручной packaged smoke и macOS/Linux packaging.

## Легенда

- `[x]` — сделано и проверено в текущей Electron/TypeScript-ветке.
- `[~]` — частично: есть каркас, заглушка или неполный сценарий.
- `[ ]` — не сделано.
- `[!]` — риск / блокер / требует решения перед релизом.

## Текущий снимок проекта

- [x] Удалён старый `.NET` / WinUI слой; текущий проект — Electron + React + TypeScript.
- [x] Инициализирован локальный Git-репозиторий, первый коммит: `4f14f86 Initialize FluxAlloy Electron project`.
- [x] Установлены Node.js `24.15.0`, npm `11.12.1`, Git `2.54.0`.
- [x] `npm install` выполнен; `npm run check` (lint/typecheck/tests/trusted-hashes/journal/secrets), `npm run build`, `npm run build:unpack`, `npm run build:win` проходят; для релиза добавлены `check:release` / `release:win*`.
- [x] Есть `package.json`, `electron-vite`, `electron-builder`, ESLint, Prettier, TypeScript-конфиги.
- [x] Есть `src/main`, `src/preload`, `src/renderer`.
- [x] Renderer изолирован: `contextIsolation: true`, `nodeIntegration: false`.
- [x] Есть базовая тёмная/светлая тема и режим **как в системе** (`theme: system` + `nativeTheme`), сохранение в `userData/settings.json`, меню `Вид -> Тема`.
- [~] Есть главное окно 1920x1080 (FHD) по умолчанию и единый workspace `Редактор` / `Загрузки`; редактор содержит toolbar, видеопредпросмотр (`fluxmedia://` allowlist + byte-range streaming для `<video>`), DnD/«Открыть», транспорт, timeline/waveform и статусбар.
- [~] Есть `Data/`, `Help/`, `FLUXALLOY_TZ.md`, `IMPLEMENTATION_CHECKLIST.md`, [`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md), упаковка `Data/`, `Help/`, ТЗ через `extraResources` (журнал в установщик пока не включаем — только для разработки).
- [x] Windows: `electron-builder` с режимом sign по умолчанию; после перезагрузки проверены `build:unpack`/`winCodeSign`.
- [~] Есть ffmpeg export MP4/MKV/MOV, trim In/Out, crop/rotate/flip/scale/FPS/CRF/bitrate, пользовательские пресеты и snapshot PNG/JPEG; batch, HW encode и расширенные фильтры ещё впереди. Политика движков — bundled-first (`resources/bin`) с кнопкой скачивания/обновления и очисткой скачанных копий в `userData/bin`, есть проверка `--version`.
- [~] Автозагрузка движков **Windows x64** (yt-dlp GitHub + ffmpeg zip mirror/fallback), SHA256 опционально через `Data/trusted_hashes.json`; `npm run engines:prepare:win` / `engines:prepare:win:force` / `predev` наполняет локальный `bin/`, а установщик берёт `resources/bin` (`extraResources`) для заранее проверенных bundled `ffmpeg.exe`/`ffprobe.exe`/`yt-dlp.exe`; бинарники в Git не коммитятся.
- [~] Локализация: основной слой RU/EN в `src/renderer/src/locales/ui-text.ts` (вкл. редактор, загрузки, терминал, статусбар, подсказки); плоские `locales/ru|en/*.json` и смена языка без перезапуска — позже (см. §2.2/§5).
- [~] Основная вкладка `Загрузки` в React уже закрывает очередь, старт/stop/retry/pause, настройки yt-dlp, каталог/cookies/network, live log, историю; **компактная панель «История»** — в основном **«Повторить»** (URL в очередь; J-626), полные действия файла/папки/редактора — в таблице очереди и pop-out; open учитывает финальный файл после merge и Windows UTF-8 stdout; pop-out — вторичный режим для редких settings.
- [~] ffprobe-инспектор: в **главном редакторе** под таймлайном — только **короткая строка** видео/аудио (`VideoTimeline`); полная сводка, таблица дорожек, главы, JSON и экспорт — в **отдельном окне** инспектора; Dolby/HDR side_data summary, контекстные действия — там же.
- [~] Тестовый раннер: Vitest + `npm run test`/`test:watch`; снимок **`68 test files / 705 tests`**; `npm run check` / `check:quiet` проходят (lint, typecheck, тесты, `trusted_hashes`, `check:journal`, `check:checklist`, secrets guard; J-1009). Покрыты парсеры/сервисы yt-dlp §6, ffmpeg export/batch §7 (`ffmpeg-export-batch-*`, `ffmpeg-export-hw-decode`, `ffmpeg-hw-encoder-probe`, `ffmpeg-export-vaapi-vf`), ffprobe §9, knowledge §15, terminal §8, diagnostics, UI helpers (`timeline-ruler`, `waveform-peaks`, `ui-text`-связанные контракты).

## Журнал решений и проверок

Не дублируем здесь длинную хронику — смотри **[`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md)**. Новые записи добавляй туда (время до секунд: `YYYY-MM-DD HH:mm:ss`).

## Ближайший TODO спринта

Правило: это короткий навигатор ближайших работ, а не архив прогресса. Держать 3-7 пунктов, не длиннее 220 символов каждый; подробности фиксировать ниже в тематических § и в `IMPLEMENTATION_JOURNAL.md`.

- [x] Рефактор ф.4 P1: invoke IPC вынесен из `index.ts` → `src/main/ipc/register-*` (102 handle); `index.ts` — lifecycle + `ipcMain.on`.
- [~] Ф.4 P2: `persist*` → [`settings-ipc-persist.ts`](src/main/settings-ipc-persist.ts) (✓); `App.tsx` split срезы 1–4 (хелперы, batch/terminal/downloads-url hooks, ~7.6k→~6.85k); далее JSX панели workspace.
- [~] §8: терминал — редкие сценарии/argv по факту; при правках `summary` — `npm run locales:terminal-summaries-ru` (дважды до 0/0).
- [~] §9/§18: packaged/ffprobe e2e smoke; редкие поля ffprobe; связка с Support ZIP.
- [~] §19/§3: `check:release`, `verify:win-unpacked`, SHA/JSON; packaged smoke; macOS/Linux engines и targets.
- [x] §15: knowledge — пакет закрыт (RU/EN Help, `data:` assets, fluxhelp, About→справка); далее tooltips/PNG по UI.
- [~] §2.2/§5: `locales/**` JSON + смена языка без перезапуска; DPI-матрица 100–200%; §1.1 — контраст/focus после `aria-busy` (J-977–J-1007).

---

## §0. Стратегия выполнения для Cursor

- [x] `FLUXALLOY_TZ.md` существует в корне.
- [x] `IMPLEMENTATION_CHECKLIST.md` существует в корне и используется как рабочий TODO.
- [x] [`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md) — хроника решений и проверок (отдельно от чек‑листа); в `npm run check` входит `check:journal` (`scripts/check-journal-numbering.mjs`): строгий порядок `J-001…` и явная ошибка при **дубликатах** `[J-NNN]`.
- [x] Стек проекта переведён в Electron + TypeScript + React.
- [x] Базовые темы и IPC настроек заведены.
- [x] Локальный Git-репозиторий создан.
- [ ] Перед каждым крупным этапом сверять этот файл и обновлять статусы.
- [ ] После каждого завершённого пункта обновлять чек-лист.
- [ ] Не менять `FLUXALLOY_TZ.md` без прямого запроса пользователя.

### Этапы

1. [x] Инициализация проекта: структура, `.cursor/rules`, Electron + TS + React, темы, рабочий главный workspace (редактор/загрузки), IPC.
2. [~] Управление зависимостями: Windows-загрузка и опциональный SHA256; bundled `bin`/macOS/Linux — дальше.
3. [~] Главное окно и глобальные элементы: меню/превью частично; сессии, закрытие, Mini Player — дальше.
4. [~] Главное окно обработки: файл/DnD, таймлайн (scrub + in/out), ffprobe-сводка, экспорт MP4/MKV/MOV и snapshot; пресеты/расширенный ffmpeg/batch — дальше.
5. [~] Менеджер yt-dlp: основная вкладка `Загрузки` + pop-out; очередь, каталог, cookies, network, настройки argv, live log, история, retry/error handling, pause/resume и авто-preview есть; полноценные сценарии/терминал — дальше.
6. [~] Терминал и CLI с IntelliSense: v1 в строке argv (выпадающий список, Tab/стрелки); полноценный список по JSON как в ТЗ — дальше.
7. [ ] Инспектор, планировщик, конструктор сценариев.
8. [ ] Очистка кэша, история, статистика, утилиты.
9. [~] Логирование и диагностика.
10. [~] Система дистрибуции: electron-builder настроен, но ресурсная/бинарная матрица не готова.

## §1. Общая концепция

- [x] Назначение продукта зафиксировано: графический комбайн yt-dlp + ffmpeg.
- [x] Целевые платформы зафиксированы: Windows приоритет, macOS, Linux.
- [x] Лицензия есть в `LICENSE`.
- [~] UI уже не каркас: есть рабочий editor/downloads workspace и инженерные rail/table/log/history паттерны (v0 используется только как ориентир для нужных UI-правок); до целевой глубины продукта не хватает **JSON-локализации/смены языка**, polish базы знаний (tooltips/скриншоты), терминала/сценариев, HW/batch и ручной DPI-полировки.
- [~] Держать основной UX как единый workspace с вкладками `Редактор` / `Загрузки`; логика очереди и обработки остаётся разделённой по сервисам, pop-out окна — вторичный режим.

### §1.1 UI и UX

- [~] Построить главное окно вокруг крупного предпросмотра: базовая зона preview есть, финальная компоновка панелей — дальше.
- [~] Таймлайн под превью (базовый range + синхрон с `<video>`); **масштаб окна scrub (×1…×8)**, **waveform** (≤~180 s и ≤96 MiB ответа) и **линейка времени** по видимому окну (`timeline-ruler`), клик/клавиатура → seek в окне zoom; **снап к кадру** по `probe.videoFpsApprox` (`resolveVideoFpsApprox`: avg/r-дробь, иначе `nb_frames`/duration) или по regex в `detail` дорожки; сводки §9 дополняются строкой FPS; transport strip и HiDPI в `main.css`; **нативные `<video controls>` отключены** — воспроизведение только через `PreviewTransport`/таймлайн (J-627); дальше — ручная матрица DPI и редкие контейнеры без fps/`nb_frames`.
- [~] Панели кодирования справа: **сворачиваемые секции** + **целиком rail FFmpeg** (`ffmpegSettingsRailOpen` в `mainWindowUiPanels`); persist в `settings.json`; полировка и инспектор — дальше.
- [~] Сформировать вкладку `Загрузки` в едином workspace: React слой уже показывает URL-band + живую queue table через общий snapshot broadcast + summary cards + filter chips + progress bars + управление строками/очисткой + pause/resume + встроенный rail основных yt-dlp настроек/network/каталога/cookies + pop-out; **«История» и «Живой лог» под строкой таблицы**; при **узкой ширине** rail **не скрывается**, а уходит **под** журнал (`@media (max-width: 1100px)`), якорь **`#downloads-ytdlp-settings-rail`** и кнопка **«К настройкам»**; ошибки действий показываются в статусе вместо тихого no-op; pop-out — редкие/длинные settings; дальше — ручная DPI-матрица.
- [~] Реализовать прогрессивное раскрытие сложных параметров: `details` для **быстрой yt-dlp-полосы** (**`app-url-summary`**, **`quickYtdlpUrlHint`**: поле URL + **«Скачать и добавить в редактор»** + короткие ссылки на справку; **`aria-describedby`**; отдельные кнопки «Из буфера» на вкладках **убраны** — вставка через меню/глобальный Ctrl+V и автодобавление из буфера при фокусе, J-624) + **rail FFmpeg** (секционные hints + **`aria-describedby`**, развёрнутые `title`/PillSwitch J-636) + **превью команды ffmpeg** (`exportCommandPreview`); общая система панелей — дальше.
- [~] Базовые токены темы есть; тёмная палитра главного окна приведена к компактному инженерному стилю, v0-референс больше не является центром спринта.
- [~] Бинарные настройки переводить в **pill switch** с русской подсказкой, а не в select из двух вариантов: общий React `PillSwitch` применён к `Без аудио`, `Весь плейлист`, `Только аудио`, `Открыть после успеха`; **2-pass libx264** во вкладке редактора (rail «Формат», только с видеобитрейтом) + двойной spawn/main + превью двух команд; дальше — HW encode и прочие бинарные настройки по тому же паттерну.
- [~] Довести палитру, типографику, отступы, радиусы и focus-состояния на всех экранах: главный renderer и downloads (токены `--fa-*`/`focus-ring`) сближены; **редактор: focus-ring на полосе быстрого yt-dlp — `app-url-summary`, `app-url-input`, `app-btn` в теле полосы**; **`<video>` предпросмотра — `aria-label` с basename пути**; **окно загрузок: кольцо фокуса на сворачиваемых `summary` (история, журнал, hints) + rail** + **контекстные `aria-describedby` у нижних панелей**; второе окно загрузок — тема синхронна; инспектор: topbar-хром как редактор + `probe*` секции синхронны с главным через `mergeMainWindowUiPanels`.
- [~] Убрать все литералы интерфейса в единый слой: `src/renderer/src/locales/ui-text.ts` (`ru/en`) покрывает редактор, вкладку «Загрузки», терминал, статусбар, диалоги, истории и др. (J-528+); дальше — добить редкие строки/inspector и при необходимости вынести в `locales/**` JSON без дублирования.
- [ ] Проверить масштабирование 100/125/150/200%.

## §2. Среда, инструменты и проект

### §2.1 Целевые платформы

- [x] Windows dev-сборка проверена.
- [~] `electron-builder` содержит цели Win/macOS/Linux.
- [ ] Проверить macOS targets на macOS-среде.
- [ ] Проверить Linux targets в Linux/CI-среде.
- [ ] Выделить слой `platform` / `nativeMain` для различий ОС.
- [ ] Заложить дорожную карту подписи/notarization для macOS.

### §2.2 Технологический стек

- [x] Electron + React + TypeScript.
- [x] Main process отвечает за окна и настройки.
- [x] Preload работает через `contextBridge`.
- [x] Renderer не получает Node API напрямую.
- [~] Добавить доменные сервисы: `engines`, `ffprobe-service`, `ffmpeg-export/snapshot`, `yt-dlp` очередь/опции/история и `logger-service` есть; впереди presets, sessions, batch и дальнейшее разбиение main.
- [ ] Выбрать подход к состоянию renderer: hooks/context/Zustand/Jotai и зафиксировать в коде.
- [ ] Добавить локализацию `locales/ru/*.json`, `locales/en/*.json`.
- [ ] Добавить смену языка без перезапуска.
- [~] `.cursor/rules/` обновлены под Electron/TS.
- [~] Вспомогательный пакет `scripts/cursor-automation`: цикл `@cursor/sdk` по промптам до `MAX_STEPS` (см. README там; не IDE-чат); единый комментированный конфиг `src/sdk-settings.ts`; long-loop режется на короткие `Agent.create` сессии через `SDK_SESSION_STEPS`/`--session-steps` (дефолт 1) для минимизации cache-read; `check:quiet` печатает короткий summary успешных проверок; локальный `STOP=0/1`; retry SDK/transport + быстрых transient error-run, полный повтор любого `status=error` только через `LOOP_RETRY_RUN_ERROR=1`; `continue.txt` работает как чат-команда `+`/compact handoff (не перечитывает весь контекст без причины), журнал требует `J-NNN` и проверяется `check:journal`.

### §2.3 Устаревший стек

- [x] Не использовать WinUI/.NET для нового UI.
- [x] Старый `.NET` слой удалён.

## §3. Управление зависимостями (КРИТИЧНО)

- [~] Структура `bin/` (bundled в установке через `extraResources` + `userData/bin`): `bin/README.md` фиксирует, что в релиз перед сборкой кладутся проверенные `ffmpeg.exe`/`ffprobe.exe`/`yt-dlp.exe`; установка через UI-загрузку на Win остаётся fallback/update; в репозитории бинарники не коммитятся.
- [x] Определить имена бинарников по платформам: `ffmpeg`, `ffprobe`, `yt-dlp`.
- [x] Реализовать поиск bundled бинарников в `process.resourcesPath`.
- [x] Реализовать fallback на пользовательские пути из настроек.
- [x] Реализовать проверку `--version` для каждого движка.
- [x] Реализовать статус движков в main: отсутствует / проверяется / готов / ошибка.
- [x] Реализовать IPC: получить статус движков.
- [x] Реализовать IPC: загрузка движков + прогресс (`fluxalloy:engines-download`, `fluxalloy:engines-progress`).
- [x] Реализовать IPC/UI: удалить скачанные движки из `userData/bin` без трогания bundled `resources/bin` и ручных путей.
- [x] Добавить dev/release bootstrap `npm run engines:prepare:win`: скачивает `yt-dlp.exe`, `ffmpeg.exe`, `ffprobe.exe` в проектный `bin/`; `npm run dev` запускает проверку автоматически через `predev`.
- [~] Первый запуск/отсутствующие движки: вместо отдельной ТЗ-модалки используется текущая политика bundled-first + статусбар/действия UI — при отсутствии бинарников предлагается скачать Windows-движки в `userData/bin`, а dev/release path наполняет `bin/` через `engines:prepare:win`; для macOS/Linux авто-загрузчика пока нет, но ручные override и bundled path остаются общей моделью.
- [x] Скачивание `yt-dlp` (GitHub `latest` для Win `.exe`).
- [~] Скачивание/обновление `ffmpeg`/`ffprobe` в `userData/bin`: Windows-загрузчик использует список зеркал (BtbN GitHub GPL build + fallback gyan.dev essentials); bundled `resources/bin` является основным релизным путём.
- [x] Прогресс загрузки в статусбар (проценты по `Content-Length` где есть).
- [~] SHA256: проверка при **непустых** полях в `trusted_hashes.json` (zip FFmpeg, `yt-dlp.exe`, опционально готовые `ffmpeg.exe`/`ffprobe.exe` в `windows-x64`); `npm run engines:verify-bundled` (входит в `engines:doctor`) + strict-режим для релиза; пустые поля = пропуск (dev).
- [x] `Data/trusted_hashes.json` с `schema` и веткой `windows-x64`.
- [x] Формат `trusted_hashes.json` для Win-x64 + совместимость с плоскими полями.
- [~] Редактирование доверенных хешей без перекомпиляции: через `extraResources`/копию `Data/trusted_hashes.json`; авто-обновление файла из сети не делалось.
- [ ] Настройки: кнопка «Проверить обновления».
- [x] Настройки: ручной override путей к движкам.
- [~] UI: показать версии движков в статусбаре — пока только краткая сводка (готовы / не найдены / ошибка).

## §4. Главное окно и глобальные элементы

### §4.A Разделение ролей окон

- [~] Главное окно существует и сфокусировано на preview/ffmpeg обработке; верхний toolbar сокращён до основных действий, FFmpeg-настройки вынесены в правую сворачиваемую панель.
- [~] Главное окно стало единым workspace: `Редактор` остаётся ffmpeg/preview центром, `Загрузки` — основная вкладка yt-dlp; pop-out окно загрузок остаётся вторичным режимом для редких настроек и расширенной HTML-панели.
- [~] Пункт меню «Менеджер загрузок (yt-dlp)…» + IPC открытия pop-out; главный topbar переключает встроенную вкладку `Загрузки`.
- [~] Отдельное BrowserWindow под менеджер: HTML + очередь/лог/история/settings yt-dlp §6; v0-компоновка: table + **под ней** вертикальный блок история→журнал + правый settings rail; persist раскрытия секций rail/log/history (**автораскрытие журнала при старте строки не перетирает** сохранённое «свёрнут» в `settings`); без React, вторичный pop-out.

### §4.B Единая зона источника

- [x] Меню/кнопка «Открыть файл» (диалог → `fluxmedia`).
- [x] Меню/кнопка **«Открыть папку с видео»** (первый файл после scan §7.3; горячая клавиша Ctrl+Shift+O).
- [x] Системные диалоги открытия (файл/папка превью, входы и папка выхода пакета) стартуют из **`lastOpenedSourcePath`** / **`ffmpegExportBatchOutputDirectory`** где возможно (`defaultPath`).
- [x] Drag-and-Drop локального файла (`getPathForFile` → IPC `grantPath`).
- [x] Drag-and-Drop **папки** в превью и в зону пакета: main резолвит первое видео (превью) / полный scan (очередь), как «добавить папку».
- [~] Поле URL + глобальный Ctrl/Cmd+V (вне текстовых полей) и меню вставки отправляют текст в очередь загрузок; отдельные кнопки «Из буфера» на вкладках редактора/загрузок убраны (J-624); дальше — сценарии без ручного окна.
- [x] Открытое второе окно принимает URL/текст, добавляет строки в очередь и запускает yt-dlp через main.
- [~] Опция: одиночная загрузка в рабочую папку и открыть в обработке (есть авто-open в preview после успеха из вкладки/pop-out; полноценная цепочка download→ffmpeg — позже).

### §4.C Прочее

- [~] Стартовый размер главного окна 1920×1080 (FHD) на подходящем дисплее; на меньших экранах fallback от размера дисплея и `min*` из `scaleFactor` (`src/main/window-hidpi.ts`); сохранённые bounds важнее.
- [~] Проверить адаптивность и DPI: окно yt-dlp + главное + инспектор — общий helper `window-hidpi` для `displayMatching`/`min*`; renderer — точечный @media для `app-topbar`/`app-toolbar`/`app-icon-btn` и **вкладки «Загрузки»** (`app-downloads-*`, в т.ч. **192dpi** для ~200%); полная ручная матрица 100–200% — позже.
- [~] Верхнее меню есть частично.
- [~] Меню `Файл`: «Открыть…» и «Менеджер загрузок…» есть; при фокусе дочерних окон рекурсивное открытие отключается; финальные сценарии — позже.
- [~] Меню `Инструменты`: инспектор/подменю «Открыть папку…» (userData / logs / yt-dlp / bin / resources) через whitelist; при фокусе дочерних окон повторное открытие инспектора отключается; анализировать/терминал/очистка кэша — позже.
- [ ] Меню `Сервис`: планировщик, конструктор, импорт/экспорт.
- [~] Меню `Справка`: ТЗ + «О программе» (модалка, версия/Electron); база знаний в приложении и история — позже.
- [~] Статусбар есть частично.
- [~] Статусбар: краткая строка `--version` ffmpeg/ffprobe/yt-dlp (обрезка); без tooltip GPU §4.C.
- [ ] Статусбар: индикатор активности.
- [ ] Статусбар: текущий язык.
- [ ] Статусбар: текущий кодировщик CPU/NVENC/AMF/QSV/etc.
- [ ] Статусбар: tooltip GPU/драйвер/лимиты.
- [ ] Все строки UI вынести в локализацию.
- [~] Добавить единый набор иконок: топбар редактора (folder + **rotate-ccw/cw + scissors** + **снимок/экспорт/отмена/облако (`EDITOR_TOPBAR_ACTION_ICONS`)** + **sun/moon (`EDITOR_THEME_ICONS`)**, `circle-help`/загрузки из shared) + **окно загрузок** + **вкладки** + транспорт + очередь yt-dlp + **вкладка «Загрузки»**: `clipboard`/`popOutWindow`, **URL-band**, **нижние панели** (`refreshCw`/`save`/`x`/`trash`/`file`/`folder`/`outbound`) + **инспектор §9**: `folder-open`/`refreshCw`/`circle-help`/тема — **общий `IconCircleHelp` из shared**, **диалог «О программе» — общий компонент `AboutDialog`**; при необходимости дальнейшее выравнивание панелей.

### §4.1 Запоминание настроек

- [x] `settings.json` для темы.
- [~] Последний открытый локальный файл (`lastOpenedSourcePath`) + мягкий restore превью при старте + геометрия main/downloads в `settings.json`; без полного session.json.
- [x] Сохранять размеры/позиции окон.
- [~] Сохранять раскрытые панели: главное окно + окно §9 (**push** снимка `mainWindowUiPanels` после сохранения; IPC только main/inspector + preload whitelist) + yt-dlp (`downloadsWindowUiPanels`, **toggle-сохранение только от жеста пользователя** — не при программном открытии журнала; **встроенная вкладка «Загрузки»** пишет `history`/`log` тем же IPC `fluxalloy-downloads-merge-ui-panels`); FFmpeg-секции только в редакторе (`ffmpegSettingsRailOpen` + секции §7), `probe*` — shared с инспектором.
- [~] Сохранять выбранные папки (каталог yt-dlp, последняя папка ffmpeg export и snapshot; прочие диалоги — позже).
- [~] Сохранять состояние очередей: yt-dlp живой `queue.json` §6 (атомарная запись, гидратация при старте main, дедупликация id, `will-quit` flush); полный `session.json` и прочие очереди — позже.
- [ ] Сохранять `session.json`.
- [~] Восстанавливать состояние после перезапуска: очередь yt-dlp восстанавливается из `queue.json` без active-status и duplicate id; полное восстановление сессии редактор/preview/`session.json` — позже.

### §4.2 Подтверждение закрытия

- [~] Отслеживать активные процессы: экспорт ffmpeg в главном окне + занятость runner yt-dlp.
- [~] Диалог перед закрытием главного окна при активном экспорте или загрузке yt-dlp (прервать и закрыть).
- [ ] Политика очередей queued/cancelled по ТЗ и закрытие вторичных окон — позже.

### §4.3 Mini Player

- [ ] Спроектировать Mini Player.
- [ ] Показать прогресс активной загрузки/обработки.
- [ ] Topmost режим.
- [ ] Контекстные действия.

### §4.4 Производительность интерфейса

- [ ] Отложенная загрузка тяжёлых панелей.
- [ ] Отключение дорогих анимаций под нагрузкой.
- [ ] Уважать системный reduced motion.

### §4.5 О программе и версия

- [~] Окно «О программе»: модальное окно в renderer по пункту меню.
- [x] Версия из `package.json` (`app.getVersion()`).
- [ ] Build number / дата сборки.
- [x] Кнопка «Открыть папку логов».
- [x] Кнопка экспорта support ZIP.

### §4.6 Настройки

- [ ] Окно настроек.
- [ ] Раздел «Общие».
- [ ] Раздел «По умолчанию».
- [ ] Раздел «Зависимости».
- [ ] Раздел «Горячие клавиши».
- [ ] Раздел «Логи/диагностика».
- [ ] Сброс настроек.

## §5. Темизация

- [x] Две темы: тёмная/светлая.
- [x] Сохранение выбранной темы.
- [x] Меню переключения темы.
- [~] CSS-токены есть.
- [ ] Довести полный набор токенов: Background, Surface, SurfaceElevated, Border, BorderSubtle, TextPrimary, TextSecondary, TextMuted, Accent, Danger, Success, Hover, Focus, Disabled.
- [ ] Проверить контрасты.
- [ ] Проверить focus state всех controls.
- [ ] Исключить стили вне токенов.
- [ ] Проверить единые радиусы/отступы на всех будущих экранах.

## §6. Окно менеджера загрузок (yt-dlp)

### §6.1 Основная панель

- [~] Основной менеджер загрузок — вкладка `Загрузки` в React workspace; отдельное окно (data HTML + свой preload IPC) оставлено вторичным pop-out режимом; встроенная вкладка: таблица очереди, под ней «История»→«Живой лог», справа/снизу настройки (rail).
- [x] Многострочное поле URL.
- [x] Добавление распознанных строк в простую очередь (таблица в том же документе).
- [x] Drag-and-Drop URL/текста на поле ввода и на свободную область окна загрузок (не перехватываем drop на `textarea`/`select`/текстовых `input`).
- [~] Вставка из главного окна (быстрая URL-полоса с **«Скачать и добавить в редактор»**, поле вкладки, меню/глобальный Ctrl+V, pop-out) → merge в очередь или цепочка «скачать → открыть в редакторе» (J-624).
- [~] Таблица: имя (хост+путь/ранний title/path basename), ссылка; колонки Формат/Размер/Прогресс/Скорость/**Осталось**; **Прогресс** — полоска + числовой %, зелёный 100% при «Готово»; `progress` суммарная строка; действия старт/retry/pause/delete/file/folder — **во встроенной React-вкладке icon-only** (`app-icon-btn` + те же пути SVG, что `RowIco` в data HTML); **дублирующая кнопка отмены в футере правого rail yt-dlp убрана** (осталась у поля URL; J-638); `queue.json` §4.1 с дедупликацией id при restore; format/size/title из `[info]`, progress и post-processing строк yt-dlp (`ExtractAudio`, remux, convert); дальше — редкие шаблоны логов.
- [~] Старт всей очереди (последовательно, только «Ожидание»).
- [x] Старт отдельной строки.
- [x] Отмена текущего yt-dlp (SIGKILL процессу spawn; на Windows при удалении строки — `taskkill` через **`execFileSync`**, J-623) из вкладки и pop-out.
- [~] Пауза/продолжение где возможно: SIGSTOP/SIGCONT на POSIX; Windows показывает недоступность; UI есть во вкладке и pop-out.
- [x] Удаление строки (ожидание остановки runner; очистка `.part`/`.ytdl` рекурсивно до глубины 2 и без эвристики «только YouTube», J-621–J-622).
- [x] Reorder (вверх/вниз).

### §6.2 Настройки скачивания

- [~] Выбор формата (белый список пресетов `-f`: по умолчанию yt-dlp / merge `bv*+ba/b` / `best`).
- [~] Выбор качества (только через те же пресеты; без произвольной строки `-f`).
- [~] Аудио-only (`-x --audio-format best`; ffmpeg должен быть доступен yt-dlp; без выбора кодека).
- [x] Субтитры (пресет §6.2: выкл. / `--write-subs` / `--write-auto-subs`; опционально `--sub-langs` без пробелов; persist в settings).
- [~] Плейлист/одиночный ролик (`--yes-playlist` / по умолчанию `--no-playlist`).
- [~] Cookies / профиль браузера: файл Netscape (`--cookies`) + whitelist `--cookies-from-browser` (Chrome/Edge/Firefox) во вкладке и pop-out; **профиль/контейнер** (`ytdlpCookiesBrowserProfile` → `chrome:…` / `edge:…` / `firefox:…` в argv, валидация длины/управляющих символов).
- [x] `--impersonate`: whitelist chrome / edge / firefox (`ytdlpImpersonate` в settings, без версионирования строкой из UI); дубль `--impersonate` в доп. argv запрещён.
- [x] Шаблон имени `-o` (относительно каталога загрузки, проверка выхода из каталога, `%(ext)s`; `ytdlpFilenameTemplate` в settings).
- [x] Каталог загрузки (выбор папки во вкладке/pop-out + `ytdlpDownloadDirectory` в `settings.json`; по умолчанию `userData/downloads/ytdlp`).
- [x] Открыть текущий каталог загрузки из вкладки/pop-out.
- [x] Ограничения скорости/ретраи (`--limit-rate`, `--retries`, `--fragment-retries`); профили **повтора строки очереди** при ненулевом exit (`off`/`light`/`normal`/`persistent`).
- [x] Дополнительные параметры в сворачиваемых секциях: экспертные argv/preview/справочник по категориям §6.3 (`optgroup`, карта токенов в main, опциональный `category` в JSON).

### §6.3 Экспертный режим

- [~] Live preview команды yt-dlp (`commandPreview`: реальный каталог `-o` из userData или override только для превью, первый URL очереди или `https://example.com/`; черновик формы до сохранения; во вкладке rail — поле argv + вставка токена + preview; pop-out — тот же функционал с длинным справочником; заглушки `<downloadDir>`/`<url>` только без контекста превью).
- [~] Поле дополнительных аргументов (`ytdlpExtraArgsLine` в settings).
- [x] Подсказки из `Data/ytdlp_commands.json` (группы в UI; при необходимости категория в JSON переопределяет встроенную карту в main); **справочник argv** — один сценарий (поиск + список, без второго `<select>`; J-637).
- [~] Безопасная сборка аргументов без shell (`parseExtraYtdlpArgsLine`, spawn-массив §21).

### §6.4 Прогресс, лог, комбинированный режим

- [~] Парсинг прогресса yt-dlp: процент + скорость + оставшееся время (в UI «Осталось»; в сыром логе yt-dlp по-прежнему токен `ETA`) + размер `of …`/`of ~ …` + `fragment X of Y` + `(frag N/M)` без процентов в строке + `Total progress:` + `Downloading video|item X of Y` + вариант `N of M videos` + `Sleeping … seconds` / `Waiting for reconnect` / прочие `[download] Waiting for …` / `Resuming download at byte …` / `Retrying (N/M)` и `Retrying fragment X (N/M)` + подготовка `Downloading m3u8 information` / player API JSON / `Downloading webpage`; прочие редкие строки — по мере заметок.
- [~] Лог stdout/stderr: IPC `fluxalloy-downloads-log` fan-out в главное окно и pop-out; вкладка `Загрузки` показывает live log, очистку и сохранение видимого текста; pop-out сохраняет compact-layout со счётчиком размера и обрезкой DOM.
- [x] «Скачать и открыть»: готовый файл можно открыть/показать в папке или отправить в обработчик FluxAlloy из очереди и истории.
- [x] «Скачать и сразу обработать» (настройка §6.4: после успеха yt-dlp авто-открытие в главном preview, если известен безопасный путь в каталоге загрузок; неуспех авто-открытия пишется в лог строки).
- [x] Опционально после успешного авто-открытия — авто-экспорт §7.2 в соседний файл (`name-export.ext` с суффиксом при коллизии), прогресс в главном окне, итог/ошибка в логе очереди.
- [~] Обработка ошибок: приоритет текста `ERROR:`; иначе последняя строка stderr; явное завершение по сигналу ОС; `--retries`/`--fragment-retries` yt-dlp + повторы очереди §6.4 (в т.ч. профиль `persistent`) + ручной retry строки; пропуск повторов очереди по тексту (`private video`, HTTP 403/404, DRM, «нет форматов»/unsupported URL, завершённый live/premiere, **нет места на диске / errno 28**, **ffmpeg/ffprobe not found**, пустой файл и т.п.) с приоритетом транзиентных сетевых маркеров (408/502/503/504/500/429/**521/522/523/520**, таймаут/broken pipe/premature close/**EOF/SSL handshake**, signature extraction/rate limit exceeded и т.д.); `classifyYtdlpQueueFailureKind` (+ коды **2** параметры, **100** перезапуск, **101** лимит загрузок, см. апстрим yt-dlp) и суффиксы в статусе строки; код **1** по-прежнему без отдельного кода — через текстовые маркеры.
- [x] Пауза/продолжить активный yt-dlp: POSIX SIGSTOP/SIGCONT + IPC + кнопка во вкладке/pop-out; Windows — явный отказ (без Job suspend).
- [x] История загрузок (файл `downloads/history.json`, атомарная запись temp+rename после yt-dlp, IPC, UI во вкладке/pop-out; **во встроенной панели** — фильтр по outcome + экспорт JSON + «Повторить»; в pop-out — фильтр по исходу и открытие файла/папки при наличии `outputPath`).

## §7. Главное окно: обработка (ffmpeg)

### §7.1 Основная панель

- [x] Открыть локальный файл (меню + кнопка + DnD).
- [x] Отобразить имя источника (подпись под превью; полный путь в tooltip).
- [~] Видеопредпросмотр: `<video playsInline>` **без нативных controls** — только кастомный chrome (`PreviewTransport`, таймлайн; J-627).
- [~] Play/pause/seek: через API `<video>` + **полоска транспорта** (skip/±5 с/play/fullscreen/volume) и таймлайн (единая стеклянная зона seek/trim/In–Out, J-628–J-631); отдельный дублирующий `input[type=range]` под линейкой убран (J-628).
- [~] Таймлайн: базовый scrub + маркеры in/out и экспорт сегмента в MP4/MKV/MOV (без полной панели §7.2).
- [x] Маркеры in/out.
- [x] Базовая кнопка «Экспорт».
- [~] Вывод прогресса ffmpeg (процент по `time=`, множитель `speed=`, **фактический `videoCodecUsed` в IPC после резолва auto** в статусбаре, фрагмент stderr со статистикой кадра; шум баннера/конфига в UI не дублируем — `isFfmpegExportProgressStatusLine`; лог main по-прежнему полный; без отдельного «итого 100%» на успехе).

### §7.2 Панель настроек

- [~] Пресеты обработки: в тулбаре — пресеты скорости/CRF для libx264/libx265 (`ffmpegExportEncodePreset`); список **пресетов экспорта** — **11 встроенных платформенных** из кода (`getBuiltinFfmpegExportUserPresets`, TikTok/YouTube/…; `hint` в данных) + до **8** пользовательских без префикса `flux-builtin-`, слияние при загрузке `mergeBuiltinFfmpegExportUserPresetsFromFile` (до **24** записей суммарно; J-633–J-635); старые три `flux-builtin-*` из файла настроек не подмешиваются.
- [~] Контейнер/формат: toolbar + settings MP4/MKV/MOV; VP9 и CPU AV1 (SVT, AOM, rav1e) и **FFV1** — только MKV; **ProRes (`prores_ks`) / DNxHR (`dnxhd`) — только MOV** (disabled MP4/MKV в UI, авто-переключение при смене кодека и при загрузке настроек).
- [~] Видео кодек: whitelist **libx264** / **libx265** / **libvpx-vp9** / **libsvtav1** / **libaom-av1** / **librav1e** / **ffv1** / **prores_ks** / **dnxhd** (MKV-only для VP9/AV1 CPU и FFV1; MOV-only для ProRes/DNx) / HW (`ffmpegExportVideoCodec`, settings/IPC, argv, UI rail «Видео»); 2-pass только для H.264; AV1 HW — в `hw_auto`/`hw_auto_hevc` (в т.ч. **av1_vaapi** в пробе и цепочке AV1); прочие mezzanine — позже.
- [~] Аудио кодек: AAC, **MP3 (libmp3lame)**, **AC-3**, **копировать дорожку (copy)**, **PCM s16le**, **Vorbis (libvorbis, MKV-only)**, **Opus (libopus, MKV-only)**, **FLAC (MKV-only)**, **ALAC** или без аудио; **громкость аудио** через `-filter:a volume=NdB` (`ffmpegExportAudioGainDb`, шаг 3 дБ, диапазон −24…+24); выбор другого кодека — позже.
- [~] Bitrate/CRF/quality: persisted CRF override, video bitrate mode и AAC bitrate в toolbar/settings; **опционально 2-pass при bitrate** (`ffmpegExportTwoPass`); расширенная quality-панель — позже.
- [~] FPS: persisted preset source/24/25/30/50/60 для экспорта.
- [~] Resolution/scale: persisted preset source/480p/720p/1080p с сохранением пропорций.
- [x] Crop: whitelist пресетов 1:1 / 16:9 / 4:3 после rotate/flip и до scale/fps; toolbar + settings + пользовательские пресеты §7.2.
- [x] Trim: маркеры In/Out из таймлайна подставляются в экспорт `-ss/-t`, preview команды совпадает со spawn, IPC payload валидируется.
- [x] Rotate/flip: whitelist −vf transpose/hflip/vflip до scale/fps; toolbar + settings + пользовательские пресеты §7.2.
- [~] Filters: §7.2 — `yadif` (деинтерлейс), `hqdn3d` (denoise), `deband`, `histeq`, `lut3d`, `unsharp` (sharpen), `eq`, `hue`, `noise` (зерно), `vignette`, `gblur` через белый список; порядок `-vf`: transform → crop → deinterlace → denoise → deband → histeq → lut3d → sharpen → eq → hue → grain → vignette → blur → scale → fps. Дальше — прочие фильтры / HW.
- [~] Audio filters: `-filter:a volume=NdB` + `loudnorm`/`dynaudnorm` через whitelist; фильтры склеиваются в один chain `volume,...normalize`; расширенные режимы и двухпроходный loudness-анализ — позже.
- [~] Subtitles: §7.2 — pill/select «Не сохранять» / «Сохранить»; `copy` добавляет `-map 0:v?/0:a?/0:s?` + `-c:s copy` (MKV) или `-c:s mov_text` (MP4/MOV). Burn-in/выбор языка/конкретной дорожки — позже.
- [~] Metadata: §7.2 — pill «Удалить метаданные» (`-map_metadata -1`) и «Удалить главы» (`-map_chapters -1`). Точечная правка тегов — позже.
- [~] Hardware acceleration: HW encode auto (`hw_auto`/`hw_auto_hevc`), probe UI, **декод `-hwaccel`**, **VAAPI `hwupload` перед кодером**; дальше — полировка цепочек QSV/CUDA.
- [~] Advanced args: `ffmpegExportExtraArgsLine` + parse/валидация + argv перед output; UI/presets/batch.
- [~] Live preview команды ffmpeg: pure helpers в `src/shared/ffmpeg-export-argv.ts` (`buildFfmpegExportPreviewCommand` + `shouldApplyFfmpegExportTrim`), сворачиваемый блок в App.tsx с копированием; маркеры In/Out + probeDurationSec + выбранный контейнер/crop/rotate/flip/filters §7.2 подмешиваются и совпадают со spawn (в т.ч. без `-movflags` для MKV); кнопка **перейти к экспорту** из таймлайна раскрывает rail и прокручивает к секции «Вывод» (J-632); пользовательские пресеты (persist, переименование/снимок/удаление, имя через app-modal); **встроенный сворачиваемый dock ffprobe под таймлайном снят** — краткая строка в `VideoTimeline` + окно инспектора (после J-633); дальше HW/advanced args и т.п.
- [~] Безопасная сборка аргументов без shell injection: ffmpeg-экспорт идёт через `buildFfmpegExportArgv` (массив токенов, без shell); валидация значений в main `parse*`-хелперах.

### §7.3 Пакетная обработка

- [~] Режим batch как отдельный режим, не основной экран (сворачиваемая панель §7.3).
- [~] Таблица файлов + добавить файлы (multi-select) + **папка (рекурсивный scan)** + DnD файлов **и папок**.
- [~] Параллелизм 1/2/4/auto.
- [~] Очередь статусов (waiting/running/done/error/cancelled); **persist `userData/ffmpeg-export-batch/queue.json`**.
- [~] Сводка ошибок после завершения; **drag-reorder**; economy/history/open; **retry failed** + **clear completed** + retry строки; **копировать пути (вход/выход)** и **по строке** / **сохранить отчёт** (TSV + колонка ошибки) / **убрать ожидающие**; открыть **готовый файл пакета в редакторе**; двойной щелчок по строке / по ячейке **«Выход»** — **исходник / результат в редакторе**; **шаблон имени выхода** (`ffmpegExportBatchOutputSuffix`); **общая папка выхода** (`ffmpegExportBatchOutputDirectory`, открыть в проводнике); авто-раскрытие панели при auto-enqueue §7.4.

### §7.4 Комбинированный режим

- [~] URL на обработке: настройка **Ctrl+V / DnD URL** (`editorUrlPasteBehavior`: менеджер загрузок или «скачать в редактор»); быстрая полоса yt-dlp + кнопки; дальше — единое окно «Настройки».
- [~] Скачанный файл можно вручную отправить как источник из очереди/истории yt-dlp; **добавление готовых загрузок и истории в пакетный экспорт**; **авто-постановка в пакет + опциональный авто-старт после успеха yt-dlp** (§7.4).
- [~] Сценарий «скачать и обработать» (авто-открытие в preview после загрузки; цепочка с ffmpeg без ручного шага — позже).

### §7.5 Изображения

- [ ] Извлечение/конвертация изображений.
- [ ] Спрайты.
- [ ] Слайды.
- [ ] Набор форматов JPG/PNG/WebP/etc.

### §7.6 Snapshot

- [x] Извлечение кадра из текущей позиции превью (`currentTime` → ffmpeg `-frames:v 1`).
- [x] Выбор формата: persisted PNG/JPEG в toolbar + диалог сохранения с нужным расширением по умолчанию.
- [x] Выбор пути сохранения через диалог (`fluxalloy:snapshot-frame`).

## §8. Терминал, CLI и IntelliSense

- [x] Окно терминала/CLI внутри Electron.
- [x] PATH на bundled `bin`.
- [x] Разрешить только безопасные инструментальные команды/префиксы.
- [x] Подсказки из `Data/ffmpeg_commands.json`.
- [x] Подсказки из `Data/ytdlp_commands.json`.
- [x] Подстановка текущего файла/превью.
- [x] История команд.
- [x] Логирование команд и результата.
- [~] IntelliSense в строке argv (v1): до 14 подсказок из merge JSON+сценариев, Tab/Enter/↑↓/Shift+Tab/Home/End/PgUp/PgDn (шаг 5), Escape, навигация при сужении списка (clamp stale-индекса), полный список до 240: фильтр + клавиатура (↑↓/Home/End/PgUp/PgDn/Enter, Escape — сброс фильтра) и подсветка активной строки, `shared/terminal-inline-suggest` + Vitest.
- [~] Вкладка «Терминал»: подписи, help-intro (lead + `<code>` токен + tail с числами), кнопки, плейсхолдеры, aria, история/копирование строк — через `ui-text` (ru/en по `navigator`) и форматтеры `formatTerminalIntroTail` / `formatTerminalExitLine` / `formatTerminalCopyLineAria`.
- [x] RU в полях `summary` сценариев `src/shared/terminal-contract.ts` (в т.ч. «ссылка» вместо «URL» и глосс `(поле …)` для `--print-to-file` → `flux-ytdlp-*.txt`): `npm run locales:terminal-summaries-ru` (`scripts/apply-terminal-summary-ru.mjs` + пост-глосс из `inject-flux-summary-pole.mjs`), при необходимости только глосс — `npm run locales:terminal-flux-pole`; после мерджа прогонять дважды, пока второй раз не даст **0** замен и **0** gloss; `fullLine` скриптами не меняется; регрессия в `terminal-contract-scenarios.test`. Журнал: **J-573**.

## §9. Инспектор видеофайлов

- [x] Запуск ffprobe: grant-пути (IPC); полная сводка + таблица дорожек в **отдельном окне** `#inspector` (`inspector-window.ts`, `windowBounds.inspector`); в главном редакторе — короткая строка видео/аудио под таймлайном (`VideoTimeline`); **в инспекторе** — кнопка «папка с видео» и DnD папки (как §4.B).
- [x] Сводка: контейнер, длительность, bitrate — **в окне инспектора**; в редакторе под превью — имя файла (полный путь в подсказке).
- [x] Таблица дорожек — **в окне инспектора** (`tags`, битрейт/`disposition`, видео `pix_fmt`/SAR/DAR + `color_*`, контекстное меню).
- [x] Детали дорожек расширены точечными ffprobe-полями: `codec_tag` hex fallback, `extradata_size`, `initial_padding`, `closed_captions`, `is_avc`, `ticks_per_frame`, `bits_per_coded_sample`, ReplayGain, аудио `language`/`title`/`handler_name`.
- [x] Главы (`-show_chapters`, таблица **в окне инспектора** + TXT/HTML сводка).
- [x] JSON ffprobe: сворачиваемый блок **в окне инспектора** (просмотр/копирование/файл; отдельная вкладка не требуется).
- [x] Копирование JSON (форматированный текст в буфер); сохранение в файл через IPC/main (`save-text-dialog-contract`).
- [x] Сохранение TXT/HTML (сводка инспектора через `saveTextWithDialog`, генераторы в `ffprobe-summary-export`).
- [x] Контекстные действия из таблиц (ПКМ по строке дорожки / главы → копирование в буфер через preload).
- [x] Vitest smoke для `probeMediaFile`: нет ffprobe в каталогах и override на исполняемый не-ffprobe → `ok: false` без падения (`tests/main/ffprobe-probe-media.integration.test.ts`); мок `child_process.execFile`: невалидный/пустой JSON stdout и ошибка с stderr (`ffprobe-probe-media-json-mock`).

## §10. Планировщик задач

- [ ] Спроектировать кроссплатформенную модель задач.
- [ ] Windows Task Scheduler backend.
- [ ] Watch folder сценарий.
- [ ] JSON сценарий обработки.
- [ ] Интервал/триггеры.
- [ ] Таблица зарегистрированных задач.
- [ ] Управление задачами.
- [ ] Валидация полей.

## §11. Конструктор сценариев

- [ ] Редактор JSON сценария.
- [ ] Шаблоны.
- [ ] Load/save/save as.
- [ ] Валидация схемы.
- [ ] Визуальная блок-схема Drag-and-Link.

## §12. Очистка кэша и обслуживание

- [~] Категории кэша: `preview-cache`, частичные файлы yt-dlp (`.part`, `.ytdl`, `.temp`, `.tmp`, `.frag`) и старые orphan `fa-x264tw-*` в `diagnostics-maintenance`.
- [x] Подсчёт размеров: IPC/preload `diagnostics.maintenanceSnapshot()` + кнопка «Размер временных» в «О программе» показывает total и разбивку `preview-cache`/`.part`/ffmpeg temp.
- [x] Выборочная очистка: сервис принимает target ids; UI даёт отдельные двухшаговые кнопки для общего набора, `preview-cache`, частичных yt-dlp файлов и старых ffmpeg temp.
- [x] Подтверждение опасных действий: очистка временного в «О программе» требует второго клика («Подтвердить очистку») и показывает статус-предупреждение.
- [~] Очистка временных файлов загрузки/обработки: `diagnostics.cleanMaintenance()` удаляет `preview-cache`, частичные yt-dlp файлы и старые `fa-x264tw-*`; готовые медиа и свежие temp не трогает.

## §13. История и статистика

- [~] Журнал задач: `processing/history.json` пишет export/snapshot/auto-export из main; правая FFmpeg-панель показывает последние записи.
- [~] Фильтры: история обработок фильтруется по kind/outcome/query (**в т.ч. по `exportVideoCodecUsed`**); встроенная история загрузок — по outcome.
- [~] Повторить загрузку: история yt-dlp в pop-out и встроенной панели умеет вернуть URL в очередь.
- [~] Повторить обработку: любая запись истории открывает исходник в редакторе кнопкой «Повторить».
- [~] Недельная сводка: main считает 7 дней для обработок и загрузок; UI показывает chips.
- [~] Экспорт истории: правая FFmpeg-панель и встроенная история загрузок сохраняют видимые записи в JSON.

## §14. Контекстное меню Windows

- [ ] Регистрация HKCU пунктов.
- [ ] «Открыть в FluxAlloy».
- [ ] Quick MP4.
- [ ] Ограничение на видеофайлы/ассоциации.
- [ ] Удаление регистрации.
- [ ] Эквиваленты/отсрочка для macOS/Linux зафиксировать в чек-листе.

## §15. База знаний и подсказки

- [x] Файлы `Help/*.md` есть.
- [~] Viewer внутри приложения (markdown body: blockquote/`>`, `---`/thematic break, списки `-`/`+`/нумерация + перенос пункта с отступом 4+, внутренние `.md` и внешние `https`, **картинки** `![alt](assets/…)` — при `readKnowledgeArticle` мелкие файлы из `Help/assets/**` (до ~512 KiB) **встраиваются** в markdown как `data:image/*;base64` (стабильно в dev и сборке); парсер допускает только whitelist `data:`; `fluxhelp:` + CSP `img-src` остаются как запасной путь.
- [x] Оглавление.
- [x] Поиск.
- [x] Язык UI и база: `listArticles`/`readKnowledgeArticle` с `preferredUiLocale` — при EN заголовки оглавления из `Help/en/*.md` при наличии; тела статей — `Help/en/{slug}.md` или fallback на `Help/{slug}.md`; сообщения об ошибках чтения статьи — по тому же языку; при смене языка интерфейса список/статья перезапрашиваются.
- [~] Открытие статей из подсказок (inline help вне Knowledge): deep-link в `KnowledgeDialog` (`initialSlug`); первая точка — вкладка «Терминал» → `ffmpeg-terminal-hints`; в `tools-terminal-inspector.md` (RU/EN) — отсылка к разделу встроенных сценариев (`terminal-contract.ts`, npm `locales:terminal-summaries-ru`).
- [~] Tooltips на ключевых контролах (база знаний: топбар, диалог поиск/закрыть/TOC, markdown внутр./внешние ссылки; deep-link из «Терминала»).
- [x] Пары `Help/*.md` / `Help/en/*.md` для основных slug’ов (без смешения RU/EN в одном файле); дальше — новые статьи и скриншоты в `Help/assets/` по мере стабилизации UI.

## §16. Аппаратное ускорение

- [~] Диагностика GPU: в ответе `probeHwEncoders` добавлен список `hwaccels` (`ffmpeg -hwaccels`), показ в tooltip у поля «Видеокодек».
- [~] Определение доступных кодировщиков: парсер `ffmpeg -encoders`, IPC `probeHwEncoders`, список кодеков в rail «Формат» по снимку; при отсутствии кодека в сборке — откат на libx264; **hw_auto** / **hw_auto_hevc** в UI и spawn.
- [~] Auto mode: `hw_auto` — H.264 NVENC → AMF → QSV → VideoToolbox → VAAPI, затем AV1 NVENC/AMF/QSV → libx264; `hw_auto_hevc` — HEVC NVENC → … → VAAPI, затем AV1 → libx265; резолв в `runFfmpegExportJob` и превью.
- [~] Manual mode: выбор HW из whitelist (NVENC/AMF/QSV/VideoToolbox/VAAPI + **av1_vaapi**), argv в `ffmpeg-export-argv`.
- [ ] NVENC.
- [ ] AMF.
- [ ] QSV.
- [~] VideoToolbox для macOS: `h264_videotoolbox` / `hevc_videotoolbox` в пробе и argv (`-q:v`).
- [ ] VAAPI/прочее для Linux по возможности.
- [~] Индикатор `[АВТО]`: бейдж у выбора кодека при `hw_auto` / `hw_auto_hevc` + подсказка.
- [ ] Режим экономии CPU/threads/priority.
- [ ] Кнопка «Оценить».

## §17. Дополнительные утилиты

- [~] Меню утилит: подменю «Инструменты → Открыть папку…» с whitelist каталогов (`diagnostics-paths`); `enabled` пересчитывается при фокусе окна и после изменения путей; внешние ссылки из renderer/data-окон проходят `openAllowedExternalUrl`/`installExternalNavigationGuard` (`http(s)` only, без `file:`/`javascript:`).
- [ ] Извлечь кадры.
- [ ] Конвертер/служебные операции по ТЗ.
- [~] Открыть папки ресурсов/логов: меню + IPC `fluxalloy:diagnostics-open-folder` (userData, logs, ytdlpDownloads, systemTemp, userBin, bundledBin, resources); в «О программе» — кнопки папки логов, main.log, Support ZIP, размер временных и двухшаговая очистка по категориям; отдельное окно настроек — позже.
- [~] Диагностические команды/утилиты обслуживания: IPC/preload для `maintenanceSnapshot`/`cleanMaintenance`, тесты `diagnostics-maintenance`; дальше — отдельное окно настроек и расширение категорий.

## §18. Логирование и диагностика

- [~] Выбрать библиотеку: пока используется собственный `logger-service` (без зависимостей); решение про `electron-log`/`pino` — позже.
- [~] Логи main: `logInfo/logWarn/logError` пишут в `userData/logs/main.log` с timestamp/scope; уровни `info/warn/error`.
- [~] Логи renderer: `window.fluxalloy.log.send` через IPC `fluxalloy:log-renderer` + перехват `error`/`unhandledrejection` в `main.tsx`; канал закреплён за main window, ограничен token bucket и чистит control chars.
- [x] Логи внешних процессов stdout/stderr: yt-dlp, ffmpeg export/snapshot, ffprobe через общий sanitizer без полного argv.
- [~] Ротация по размеру: один backup `main.log.1` при превышении 1 MiB.
- [~] Prune старых диагностических файлов: на старте чистятся crash dumps старше 30 дней, последние 20 сохраняются; архивы `logs/sessions/session-*.log` — не старше ~90 суток и не более ~25 файлов; `diagnostics.txt` в Support ZIP включает usage ключевых каталогов и `maintenanceTargets` (`previewCache`, `ytdlpPartials`, `ffmpegTemp`).
- [~] Crash handler: `process.on('uncaughtException'|'unhandledRejection')` регистрируется на старте main до `app.whenReady`; после ready показывает диалог ошибки с деталями.
- [x] Диалог ошибки: кратко + детали.
- [x] Копировать детали.
- [x] Открыть лог.
- [x] Support ZIP: `diagnostics.txt`, `main.log`, `main.log.1`, `session.log`, последние crash dumps, версия, ОС.

## §19. Система установки и дистрибуция

- [x] `electron-builder.yml` есть.
- [x] `npm run build:win` проходит (последняя проверка до добавления portable/zip целей; для новых целей нужен ручной smoke).
- [x] `npm run build:unpack` проходит.
- [~] `Data/`, `Help/`, `FLUXALLOY_TZ.md` добавлены в `extraResources`.
- [~] `bin/` в `extraResources`: bundled-first каталог с `README.md`; готовые бинарники подкладываются локально/CI через `npm run engines:prepare:win` перед сборкой (в Git не хранятся), скачивание в `userData/bin` остаётся fallback/update; release checklist и лицензии bundled engines — `docs/RELEASE.md` / `docs/BUNDLED_ENGINES_LICENSES.md`; GitHub Actions после `check` гоняет prepare + **`engines:doctor`** со строгой проверкой структуры `trusted_hashes` и логом версий; локально **`check:release`** / **`release:win*`** после prepare тоже через `engines:doctor` (`FLUXALLOY_ENGINES_STRICT=1` — ручной релизный gate для непустых exe-хешей).
- [x] Dependabot: `.github/dependabot.yml` (npm weekly, GitHub Actions monthly); разовые настройки Actions и расшифровка писем CI — `docs/RELEASE.md` §5.
- [ ] Настроить нормальную иконку приложения вместо placeholder/default.
- [ ] Windows NSIS: проверить installer вручную.
- [~] Windows portable/zip: в `electron-builder.yml` цели `portable` и `zip` рядом с NSIS; после `pack:dir`/`check:release` — автопроверка дерева `dist/win-unpacked` (`verify:win-unpacked`: exe + `resources/bin` + extraResources); полный интерактивный smoke — позже.
- [ ] macOS dmg/zip.
- [ ] Linux AppImage/deb/tar.
- [ ] Подпись Windows — отдельное решение.
- [ ] Подпись/notarization macOS — отдельное решение.
- [x] Временный `win.signAndEditExecutable: false` снят после перезагрузки; `build:unpack`/`winCodeSign` проходят с поведением electron-builder по умолчанию.

## §20. Пресеты

- [ ] Формат пользовательских пресетов.
- [ ] Папка `Presets`.
- [~] Системные пресеты экспорта: **11 платформенных** built-in в `shared/builtin-ffmpeg-export-user-presets.ts` (слияние при загрузке настроек); отдельный каталог файлов `Presets`/импорт/экспорт — позже.
- [ ] Клонировать системный в пользовательский.
- [ ] Импорт пресетов.
- [ ] Экспорт пресетов.
- [ ] Применение пресета к ffmpeg.
- [ ] Пресеты yt-dlp если нужны.

## §21. Архитектура и качество

- [~] Есть структура main/preload/renderer.
- [x] Включить/проверить strict TypeScript политику: базовый `@electron-toolkit/tsconfig` уже с `strict`; дополнительно явно включены `noImplicitAny`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature` и `useUnknownInCatchVariables` в `tsconfig.node.json`, `tsconfig.web.json`, `tsconfig.tests.json`.
- [x] IPC contracts: `ipc-channels.ts`; перечисленные `src/shared/*-contract.ts` (в т.ч. ffprobe, save-text-dialog, settings, engine, about, preview-dialog, ffmpeg export, yt-dlp окно/лог/история, диагностика, engine-download, snapshot) — главный preload импортирует типы из `src/shared`, не из `main`; дальше — новые домены по мере IPC.
- [ ] Вынести сервисы main (упорядочить без дублирования с текущими модулями).
- [~] Вынести модели shared: часть IPC/доменов уже в `src/shared/*-contract.ts`; остальное по мере выноса сервисов.
- [~] Unit tests для чистых модулей: каталог `tests/` — **68 файлов / 705 тестов** (Vitest); перечень доменов — в снимке «Тестовый раннер» выше и в `tests/main|shared/`. Дальше — e2e smoke и контракты под новые IPC.
- [x] Выбрать Vitest/Jest: Vitest подключён (`npm run test`/`test:watch`, `tsconfig.tests.json`).
- [ ] Добавить e2e smoke позже.
- [~] Комментарии на русском для публичных API и сложной логики: базовые комментарии добавлены; дальше писать чуть развёрнутее, чтобы следующему проходу агента было понятно «зачем» и «где границы», не только «что делает строка».
- [~] Не использовать shell string для runtime внешних процессов: ffmpeg/ffprobe/yt-dlp идут через `spawn`/`execFile` с argv-массивами; остаётся периодически аудировать новые сервисы/скрипты и терминальный §8.

## §22. Ожидаемый результат

- [x] `npm run check` проходит.
- [x] `npm run build` проходит.
- [x] `npm run build:win` проходит.
- [x] `npm run dev`: после перезагрузки PATH подхватывает Node/npm без ручной правки сессии (проверено вызовом `node`/`npm` из PowerShell).
- [ ] Рабочий Windows installer с реальными ресурсами.
- [~] Рабочий portable/zip (NSIS + portable + zip в конфиге; приёмка — позже).
- [ ] macOS артефакты.
- [ ] Linux артефакты.
- [x] Версия в «О программе» (вместе с Electron/Chromium/Node).
- [~] Приёмочный сценарий: открыть файл -> preview -> экспорт/отмена -> открыть файл/показать в папке/вернуть в preview/скопировать путь; интерактивный e2e в packaged — позже; автоматическая проверка дерева `win-unpacked` после `pack:dir` — в CI и `check:release`.
- [~] Приёмочный сценарий: URL -> yt-dlp -> открыть/показать файл / авто-в обработчик (флаг) -> дальше экспорт ffmpeg; полный headless «скачал и перекодировал» — позже.
