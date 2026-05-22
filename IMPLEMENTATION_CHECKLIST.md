# FluxAlloy — рабочий чек-лист реализации

Источник требований: **[`FLUXALLOY_TZ.md`](FLUXALLOY_TZ.md)**. **Запрещено** правки ТЗ без **явной просьбы владельца** (глоссарий `fluxalloy-rules-explicit.mdc`). Состояние по §, спринту и TODO — **в этом файле**; **ручная проверка на железе (владелец)** — в **[`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md)**; хронологию решений и длинные заметки — в **[`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md)**.

**Канон формата спринта и меток — этот файл** (раздел «Ближайший TODO спринта» ниже). Исполняемая копия для Cursor: [`.cursor/rules/fluxalloy-checklist.mdc`](.cursor/rules/fluxalloy-checklist.mdc). Иерархия: [`docs/SOURCES_OF_TRUTH.md`](docs/SOURCES_OF_TRUTH.md). «продолжай» / `+`: [`.cursor/skills/fluxalloy-continue/SKILL.md`](.cursor/skills/fluxalloy-continue/SKILL.md).

**Нумерация:** как в [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md) — **N.M.K** по § ТЗ (`### §6.3` → **6.3.1**, **6.3.2**, …; `## §19` без подраздела → **19.1**, **19.2**, …). Исключения: **snap.*** — «Текущий снимок»; **sprint.*** — спринт; **0.E.*** — этапы §0. Ручная проверка на железе — только в manual-файле (**19.1.1** там ≠ **19.8** здесь).

## Готовность полного итога

- **Оценка: ~74%** (J-1354 toolchain; **J-1454** dev Win; §8 terminal **закрыт** J-1572–1574; §21 Playwright wired J-1594–1595). Ядро Electron/React/Zustand, yt-dlp §6, ffmpeg + **пакет §7.3**, терминал §8 [x], инспектор §9, workflow §10–11, истории §13, shell §14, Help §15 (`Help/ru` + `Help/en`), HW §16, утилиты §17, диагностика §18, CI/release + guards в `check:quiet`. Впереди: ручная проверка на железе ([`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md)), mac/linux артефакты.

## Легенда

- `[x]` — сделано и проверено в текущей Electron/TypeScript-ветке.
- `[~]` — частично: есть каркас, заглушка или неполный сценарий.
- `[ ]` — не сделано.
- `[!]` — риск / блокер / требует решения перед релизом.

## Текущий снимок проекта

- [x] **snap.1** Удалён старый `.NET` / WinUI слой; текущий проект — Electron + React + TypeScript.
- [x] **snap.2** Инициализирован локальный Git-репозиторий, первый коммит: `4f14f86 Initialize FluxAlloy Electron project`.
- [x] **snap.3** Установлены Node.js `24.15.0`, npm `11.12.1`, Git `2.54.0`.
- [x] **snap.4** `npm install` выполнен; `npm run check` (lint/typecheck/tests/trusted-hashes/journal/secrets), `npm run build`, `npm run build:unpack`, `npm run build:win` проходят; для релиза добавлены `check:release` / `release:win*`.
- [x] **snap.5** Есть `package.json`, `electron-vite`, `electron-builder`, ESLint, Prettier, TypeScript-конфиги.
- [x] **snap.6** Есть `src/main`, `src/preload`, `src/renderer`.
- [x] **snap.7** Renderer изолирован: `contextIsolation: true`, `nodeIntegration: false`.
- [x] **snap.8** Есть базовая тёмная/светлая тема и режим **как в системе** (`theme: system` + `nativeTheme`), сохранение в `app-data/settings.json`, меню `Вид -> Тема`.
- [~] **snap.9** Главное окно 1920×1080 (FHD) по умолчанию; workspace `Редактор` / `Загрузки` / `Терминал` (Zustand); preview (`fluxmedia://`), DnD, транспорт, timeline/waveform, статусбар. Снимок тестов — **263 / 1860** (J-1609; синхрон с «Тестовый раннер»).
- [~] **snap.10** Есть `Data/`, `Help/`, `FLUXALLOY_TZ.md`, `IMPLEMENTATION_CHECKLIST.md`, [`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md), упаковка `Data/`, `Help/`, ТЗ через `extraResources` (журнал в установщик пока не включаем — только для разработки).
- [x] **snap.11** Windows: `electron-builder` с режимом sign по умолчанию; после перезагрузки проверены `build:unpack`/`winCodeSign`.
- [~] **snap.12** ffmpeg export MP4/MKV/MOV, trim, crop/rotate/flip/scale/FPS/CRF/bitrate, пользовательские пресеты, snapshot; **пакетный экспорт §7.3** и **HW §16** (resolve + spawn CPU fallback); редкие фильтры — дальше.
- [~] **snap.13** Движки: Win `engines:prepare:win` (+ `predev`); mac/linux `engines:prepare:mac|linux` (`prepare-engines-unix.mjs`) + `engines:doctor`; SHA256 через `trusted_hashes.json`; `bin/` → `resources/bin` (`extraResources`); бинарники в Git не коммитятся (J-1601).
- [x] **snap.14** Локализация: `ui-text` + `locales/**` (hot-reload ✅); единый словарь `AppUiLocale`; pop-out загрузок = React `#downloads` (J-978..984).
- [~] **snap.15** Основная вкладка `Загрузки` в React уже закрывает очередь, старт/stop/retry/pause, настройки yt-dlp, каталог/cookies/network, live log, историю; **компактная панель «История»** — в основном **«Повторить»** (URL в очередь; J-626), полные действия файла/папки/редактора — в таблице очереди и pop-out; open учитывает финальный файл после merge и Windows UTF-8 stdout; pop-out — вторичный режим для редких settings.
- [~] **snap.16** ffprobe-инспектор: в **главном редакторе** под таймлайном — только **короткая строка** видео/аудио (`VideoTimeline`); полная сводка, таблица дорожек, главы, JSON и экспорт — в **отдельном окне** инспектора; Dolby/HDR side_data summary, контекстные действия — там же.
- [x] **snap.17** Тестовый раннер: Vitest + `npm run test`/`test:watch`; снимок **`263 test files / 1860 tests`** (J-1609); `npm run check:quiet` (**35** шагов: lint, typecheck, Vitest, doc/guards, `check:scripts-wiring`, 3 audit). Домены: yt-dlp §6, ffmpeg §7, ffprobe §9, terminal §8, workflow §10–11, knowledge §15, diagnostics, renderer stores, toolchain baseline test.

## Журнал решений и проверок

Не дублируем здесь длинную хронику — смотри **[`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md)**. Новые записи добавляй туда (время до секунд: `YYYY-MM-DD HH:mm:ss`).

## Ближайший TODO спринта

Правило: навигатор **осмысленного кода/CI** для агента («продолжай»), не архив. 3–7 пунктов, ≤220 символов. **Запрещено:** Vitest «на guard» без нового `scripts/gate/*.mjs`; пункты ради счётчика тестов. **sprint.7 — в конце**, когда ниже нечего делать агенту. Ручная приёмка на железе — только [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md).

- [x] **sprint.lock** `check:quiet` зелёный; снимок **263/1860** (J-1609); дубли guard-Vitest сняты.
- [x] **sprint.done** Код/CI: открытых `[ ]` в чеклисте нет (кроме **19.9/19.10** → manual); дальше — фича по запросу владельца.
- [ ] **sprint.7** **(последний)** Ручная приёмка — [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md) (**3.x**, **19.x**, **21.x**, **22.x**, **7.4.x**, **16.x**).

---

## §0. Стратегия выполнения для Cursor

- [x] **0.1** `FLUXALLOY_TZ.md` существует в корне.
- [x] **0.2** `IMPLEMENTATION_CHECKLIST.md` существует в корне и используется как рабочий TODO.
- [x] **0.3** [`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md) — хроника решений и проверок (отдельно от чек‑листа); в `npm run check` входит `check:journal` (`scripts/gate/check-journal-numbering.mjs`): строгий порядок `J-001…` и явная ошибка при **дубликатах** `[J-NNN]`.
- [x] **0.4** Стек проекта переведён в Electron + TypeScript + React.
- [x] **0.5** Базовые темы и IPC настроек заведены.
- [x] **0.6** Локальный Git-репозиторий создан.
- [x] **0.7** Процесс обновления чеклиста и журнала — skill `fluxalloy-checklist-audit`, глоссарий (J при diff); **запрещено** правки `FLUXALLOY_TZ.md` без явной просьбы владельца.

### Этапы

- [x] **0.E.1** Инициализация: Electron + TS + React, Zustand, themes, workspace Редактор/Загрузки/Терминал, IPC.
- [x] **0.E.2** Движки: Windows `prepare-engines-win`; macOS/Linux `prepare-engines-unix` + `engines:doctor`; bundled `resources/bin` (J-1596).
- [x] **0.E.3** Главное окно §4 [x]: preview/toolbar/statusbar/settings, Mini Player, `session.json`, закрытие/очередь/вторичные окна.
- [~] **0.E.4** Обработка ffmpeg: export + batch §7.3 + snapshot; полировка UI/HW — дальше.
- [x] **0.E.5** yt-dlp: вкладка + React pop-out `#downloads`; очередь, rail, log, history, pause/resume.
- [x] **0.E.6** Терминал §8: каталог 839+465, prune, RU summaries, inline-suggest v1 (J-1572–1574).
- [~] **0.E.7** Инспектор §9 [x]; планировщик §10 и конструктор §11 [x] в коде; ручная проверка OS/сценариев — [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md).
- [~] **0.E.8** Обслуживание §12 [x]; истории §13 [x]; утилиты §17 в основном [x].
- [x] **0.E.9** Логирование/диагностика §18 [x]: `logger-service`, rotate, Support ZIP, crash handler.
- [~] **0.E.10** Дистрибуция §19: Win NSIS/ZIP + CI; macOS/Linux артефакты и подпись — дальше.

## §1. Общая концепция

- [x] **1.1** Назначение продукта зафиксировано: графический комбайн yt-dlp + ffmpeg.
- [x] **1.2** Целевые платформы зафиксированы: Windows приоритет, macOS, Linux.
- [x] **1.3** Лицензия есть в `LICENSE`.
- [~] **1.4** Рабочий editor/downloads/terminal workspace (v0 — ориентир); **смена языка без перезапуска** [x] (J-1018); длинные шарды UI → `locales/**` частично; ручная проверка visual/HiDPI/HW — [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md); Mini Player; спрайты §7.5.
- [~] **1.5** Держать основной UX как единый workspace с вкладками `Редактор` / `Загрузки`; логика очереди и обработки остаётся разделённой по сервисам, pop-out окна — вторичный режим.

### §1.1 UI и UX

- [~] **1.1.1** Построить главное окно вокруг крупного предпросмотра: базовая зона preview есть, финальная компоновка панелей — дальше.
- [~] **1.1.2** Таймлайн под превью (базовый range + синхрон с `<video>`); **масштаб окна scrub (×1…×8)**, **waveform** (≤~180 s и ≤96 MiB ответа) и **линейка времени** по видимому окну (`timeline-ruler`), клик/клавиатура → seek в окне zoom; **снап к кадру** по `probe.videoFpsApprox` (`resolveVideoFpsApprox`: avg/r-дробь, иначе `nb_frames`/duration) или по regex в `detail` дорожки; сводки §9 дополняются строкой FPS; transport strip и HiDPI `@120/144/168/192dpi` в `main.css` (J-627, J-991); **нативные `<video controls>` отключены** — воспроизведение только через `PreviewTransport`/таймлайн; дальше — редкие контейнеры без fps/`nb_frames`.
- [~] **1.1.3** Панели кодирования справа: **сворачиваемые секции** + **целиком rail FFmpeg** (`ffmpegSettingsRailOpen` в `mainWindowUiPanels`); persist в `settings.json`; полировка и инспектор — дальше.
- [~] **1.1.4** Сформировать вкладку `Загрузки` в едином workspace: React слой уже показывает URL-band + живую queue table через общий snapshot broadcast + summary cards + filter chips + progress bars + управление строками/очисткой + pause/resume + встроенный rail основных yt-dlp настроек/network/каталога/cookies + pop-out; **«История» и «Живой лог» под строкой таблицы**; при **узкой ширине** rail **не скрывается**, а уходит **под** журнал (`@media (max-width: 1100px)`), **`#downloads-ytdlp-settings-rail`** — сворачиваемая панель настроек (`downloadsEmbeddedSettingsOpen`, как история/журнал); таблица очереди — `<caption>`/`<th scope="col">`, сброс scroll при смене фильтра; ошибки действий показываются в статусе вместо тихого no-op; pop-out — редкие/длинные settings; дальше — ручная DPI-матрица.
- [~] **1.1.5** Реализовать прогрессивное раскрытие сложных параметров: `details` для **быстрой yt-dlp-полосы** (**`app-url-summary`**, **`quickYtdlpUrlHint`**: поле URL + **«Скачать и добавить в редактор»** + короткие ссылки на справку; **`aria-describedby`**; отдельные кнопки «Из буфера» на вкладках **убраны** — вставка через меню/глобальный Ctrl+V и автодобавление из буфера при фокусе, J-624) + **rail FFmpeg** (секционные hints + **`aria-describedby`**, развёрнутые `title`/PillSwitch J-636) + **превью команды ffmpeg** (`exportCommandPreview`); общая система панелей — дальше.
- [~] **1.1.6** Базовые токены темы есть; тёмная палитра главного окна приведена к компактному инженерному стилю, v0-референс больше не является центром спринта.
- [~] **1.1.7** Бинарные настройки → **pill switch**: yt-dlp (плейлист/аудио/open/batch §7.4) + ffmpeg rail (2-pass, economy, HW-decode, strip metadata/chapters §7.2.13–14); дальше — редкие select с >2 вариантами.
- [~] **1.1.8** Довести палитру, типографику, отступы, радиусы и focus-состояния на всех экранах: главный renderer и downloads (токены `--fa-*`/`focus-ring`) сближены; **редактор: focus-ring на полосе быстрого yt-dlp — `app-url-summary`, `app-url-input`, `app-btn` в теле полосы**; **`<video>` предпросмотра — `aria-label` с basename пути**; **окно загрузок: кольцо фокуса на сворачиваемых `summary` (история, журнал, hints) + rail** + **контекстные `aria-describedby` у нижних панелей**; **редкие панели** (бенчмарк, About-утилиты, внешний скрипт) — `role="group"`/`toolbar`, `title`/`aria-label` (J-1023); второе окно загрузок — тема синхронна; инспектор: topbar-хром как редактор + `probe*` секции синхронны с главным через `mergeMainWindowUiPanels`.
- [~] **1.1.9** Убрать все литералы интерфейса в единый слой: `src/renderer/src/locales/ui-text.ts` (`ru/en`) покрывает редактор, вкладку «Загрузки», терминал, статусбар, диалоги, истории, инспектор и HW-кодеки (J-528+, J-1015); дальше — вынести длинные шарды в `locales/**` JSON без дублирования по мере роста словаря.
- [x] **1.1.10** Масштабирование 100/125/150/200%: `ui-hidpi-scale-tiers` + HiDPI для `AppSettingsDialog`/статусбара в `main.css` (J-1016); ручная сверка на мониторе — [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md).

## §2. Среда, инструменты и проект

### §2.1 Целевые платформы

- [x] **2.1.1** Windows dev-сборка и **`npm run dev`** (главное окно, превью; Vite 8 preload external + dev CSP — J-1454).
- [~] **2.1.2** `electron-builder` содержит цели Win/macOS/Linux.
- [x] **2.1.3** Проверить macOS targets на macOS-среде (`pack:mac:dir` + `verify:mac-unpacked`; CI job нет; guards J-1576).
- [x] **2.1.4** Проверить Linux targets (`pack:linux:dir` + `verify:linux-unpacked` в CI; `build:linux` + `verify:linux-release` local-only guards J-1577).
- [x] **2.1.5** Выделить слой `platform` / `nativeMain` для различий ОС (`native-main-platform`, `check:native-main-platform-guard`; J-1031).
- [x] **2.1.6** Заложить дорожную карту подписи/notarization для macOS — [`docs/RELEASE.md`](docs/RELEASE.md) §4.2 (подпись/notarization roadmap); выполнение в пайплайне — позже (J-1496).
- [x] **2.1.7** Заложить дорожную карту подписи Windows (Authenticode) — [`docs/RELEASE.md`](docs/RELEASE.md) §4 + `release-code-signing-roadmap.ts` (J-1498).
- [x] **2.1.8** Заложить дорожную карту подписи Linux (GPG deb/AppImage) — [`docs/RELEASE.md`](docs/RELEASE.md) §4.1 + `release-code-signing-roadmap.ts` (J-1499).

### §2.2 Технологический стек

- [x] **2.2.1** Electron + React + TypeScript.
- [x] **2.2.2** Main process отвечает за окна и настройки.
- [x] **2.2.3** Preload работает через `contextBridge`.
- [x] **2.2.4** Renderer не получает Node API напрямую.
- [~] **2.2.5** Доменные сервисы main: engines, ffprobe, ffmpeg export/snapshot/**batch**, yt-dlp, workflows, diagnostics, logger; Zustand в renderer; дальше — `session.json`, Mini Player, дальнейшее разбиение main.
- [x] **2.2.6** Подход к состоянию renderer: **Zustand** (`renderer-state-approach.ts`, `src/renderer/src/stores/*`, `AppRoot` + `check:renderer-state-approach`).
- [x] **2.2.7** Миграция Zustand закрыта (**J-1126**); временные gate/чеклист удалены (**J-1128**).
- [x] **2.2.8** Локализация `locales/ru|en/*.json`: 20 шардов, `ui-text-strings-build` только JSON (legacy `ui-text-strings-{ru|en}-NN.ts` удалены J-1142); guards TS↔JSON + ban legacy parts (J-1143).
- [x] **2.2.9** Смена языка без перезапуска (все окна renderer + меню, J-1018).
- [x] **2.2.10** Governance/docs: `fluxalloy-agent.mdc` + skills; `check:docs-governance`; программа GOV закрыта (J-1137); канон — `docs/SOURCES_OF_TRUTH.md`.
- [x] **2.2.11** Toolchain baseline: Electron 42 / Vite 8 / TS 6 / ESLint 9 (10 отложен); выполнен (**J-1354**); план удалён (**J-1559**); Vitest package+governance (**J-1397**/**J-1411**); docs ARCHITECTURE/README/RELEASE (**J-1416**); `fix:esm-shim` (**J-1413**); Vite 8 dev preload SSR + renderer CSP (**J-1454**); [`.npmrc`](.npmrc) `legacy-peer-deps=true`.
- [~] **2.2.12** Вспомогательный пакет `scripts/cursor-automation`: цикл `@cursor/sdk` по промптам до `MAX_STEPS` (см. README там; не IDE-чат); единый комментированный конфиг `src/sdk-settings.ts`; long-loop режется на короткие `Agent.create` сессии через `SDK_SESSION_STEPS`/`--session-steps` (дефолт 1) для минимизации cache-read; `check:quiet` печатает короткий summary успешных проверок; локальный `STOP=0/1`; retry SDK/transport + быстрых transient error-run, полный повтор любого `status=error` только через `LOOP_RETRY_RUN_ERROR=1`; `continue.txt` работает как чат-команда `+`/compact handoff (не перечитывает весь контекст без причины), журнал требует `J-NNN` и проверяется `check:journal`.

### §2.3 Устаревший стек

- [x] **2.3.1** Не использовать WinUI/.NET для нового UI.
- [x] **2.3.2** Старый `.NET` слой удалён.

## §3. Управление зависимостями (КРИТИЧНО)

- [~] **3.1** Структура `bin/` (bundled в установке через `extraResources` + `userData/bin`): `bin/README.md` фиксирует, что в релиз перед сборкой кладутся проверенные `ffmpeg.exe`/`ffprobe.exe`/`yt-dlp.exe`; установка через UI-загрузку на Win остаётся fallback/update; в репозитории бинарники не коммитятся.
- [x] **3.2** Определить имена бинарников по платформам: `ffmpeg`, `ffprobe`, `yt-dlp`.
- [x] **3.3** Реализовать поиск bundled бинарников в `process.resourcesPath`.
- [x] **3.4** Реализовать fallback на пользовательские пути из настроек.
- [x] **3.5** Реализовать проверку `--version` для каждого движка.
- [x] **3.6** Реализовать статус движков в main: отсутствует / проверяется / готов / ошибка.
- [x] **3.7** Реализовать IPC: получить статус движков.
- [x] **3.8** Реализовать IPC: загрузка движков + прогресс (`fluxalloy:engines-download`, `fluxalloy:engines-progress`).
- [x] **3.9** Реализовать IPC/UI: удалить скачанные движки из `userData/bin` без трогания bundled `resources/bin` и ручных путей.
- [x] **3.10** Добавить dev/release bootstrap `npm run engines:prepare:win`: скачивает `yt-dlp.exe`, `ffmpeg.exe`, `ffprobe.exe` в проектный `bin/`; `npm run dev` запускает проверку автоматически через `predev`.
- [x] **3.11** Первый запуск/отсутствующие движки: bundled-first + статусбар/действия UI; `predev` → Win `engines:prepare:win` или unix `prepare-engines-unix` + verify; UI-загрузка в `userData/bin` — fallback/update (J-1599).
- [x] **3.12** Скачивание `yt-dlp` (GitHub `latest` для Win `.exe`).
- [~] **3.13** Скачивание/обновление `ffmpeg`/`ffprobe` в `userData/bin`: Windows-загрузчик использует список зеркал (BtbN GitHub GPL build + fallback gyan.dev essentials); bundled `resources/bin` является основным релизным путём.
- [x] **3.14** Прогресс загрузки в статусбар (проценты по `Content-Length` где есть).
- [~] **3.15** SHA256: проверка при **непустых** полях в `trusted_hashes.json` (zip FFmpeg, `yt-dlp.exe`, опционально готовые `ffmpeg.exe`/`ffprobe.exe` в `windows-x64`); `npm run engines:verify-bundled` (входит в `engines:doctor`) + strict-режим для релиза; пустые поля = пропуск (dev).
- [x] **3.16** `Data/trusted_hashes.json` с `schema` и веткой `windows-x64`.
- [x] **3.17** Формат `trusted_hashes.json` для Win-x64 + совместимость с плоскими полями.
- [~] **3.18** Редактирование доверенных хешей без перекомпиляции: через `extraResources`/копию `Data/trusted_hashes.json`; авто-обновление файла из сети не делалось.
- [x] **3.19** Настройки: кнопка «Проверить обновления» (J-1035).
- [x] **3.20** Настройки: ручной override путей к движкам.
- [x] **3.21** UI: версии движков в статусбаре (краткая сводка + строка `ffmpeg`/`ffprobe`/`yt-dlp` с токенами версий; J-1036).

**Ручная проверка (§3 packaged, §5 тема/HiDPI):** [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md) — не CI.

## §4. Главное окно и глобальные элементы

### §4.A Разделение ролей окон

- [x] **4.1** Главное окно: preview/ffmpeg; toolbar + сворачиваемая правая панель FFmpeg (`EditorFfmpegSettingsRail`).
- [x] **4.2** Единый workspace `Редактор` / `Загрузки` / `Терминал`; pop-out загрузок — вторичный режим (редкие длинные settings).
- [x] **4.3** Меню «Менеджер загрузок (yt-dlp)…» + IPC; topbar переключает вкладку `Загрузки`.
- [x] **4.4** Pop-out `BrowserWindow` — тот же React-бандл, hash `#downloads` (legacy HTML удалён, J-984); sync темы/локали/очереди.

### §4.B Единая зона источника

- [x] **4.1** Меню/кнопка «Открыть файл» (диалог → `fluxmedia`).
- [x] **4.2** Меню/кнопка **«Открыть папку с видео»** (первый файл после scan §7.3; горячая клавиша Ctrl+Shift+O).
- [x] **4.3** Системные диалоги открытия (файл/папка превью, входы и папка выхода пакета) стартуют из **`lastOpenedSourcePath`** / **`ffmpegExportBatchOutputDirectory`** где возможно (`defaultPath`).
- [x] **4.4** Drag-and-Drop локального файла (`getPathForFile` → IPC `grantPath`).
- [x] **4.5** Drag-and-Drop **папки** в превью и в зону пакета: main резолвит первое видео (превью) / полный scan (очередь), как «добавить папку».
- [x] **4.6** Поле URL + глобальный Ctrl/Cmd+V (вне текстовых полей) + меню «Вставить URL…» → очередь/pop-out; поведение `editorUrlPasteBehavior` в настройках.
- [x] **4.7** Открытое второе окно принимает URL/текст, добавляет строки в очередь и запускает yt-dlp через main.
- [x] **4.8** Режим `download_open_editor`: `downloadFirstUrlOpenInMainEditor` + Ctrl+V; авто-open после успеха из очереди (`ytdlpOpenInHandlerOnComplete`).

### §4.C Прочее

- [x] **4.1** Стартовый размер main: FHD default + fallback `window-hidpi`; сохранённые bounds важнее.
- [x] **4.2** Адаптивность и DPI 125–200 %: `window-hidpi` + `@120/144/168/192dpi` в `main.css` (редактор, загрузки, терминал, модалки, справка, probe, история; J-989–991); pop-out загрузок = React `#downloads`.
- [x] **4.3** Верхнее меню: Файл / Настройки / Сервис / Инструменты / Вид / Справка (`main-application-menu-template.ts`).
- [x] **4.4** Меню `Файл`: открыть файл/папку, менеджер загрузок, вставить URL; при фокусе pop-out/инспектора/mini-player — `auxiliaryFocused`.
- [x] **4.5** Меню `Инструменты`: инспектор, mini-player, медиа-утилиты, диагностические папки (whitelist), логи, Support ZIP.
- [x] **4.6** Меню `Сервис`: планировщик, конструктор, импорт/экспорт настроек и пресетов JSON.
- [x] **4.7** Меню `Справка`: «О программе», открыть ТЗ; база знаний — topbar + `KnowledgeDialog`.
- [x] **4.8** Статусбар: версии, активность, язык, кодек, GPU tooltip (4.9–4.13).
- [x] **4.9** Статусбар: строка версий ffmpeg/ffprobe/yt-dlp с токенами (`engine-statusbar-versions`; J-1036); tooltip GPU в строке кодека — J-1002 / §4.C sprint.
- [x] **4.10** Статусбар: индикатор активности (точка + подпись; J-1011).
- [x] **4.11** Статусбар: текущий язык RU/EN (J-1011).
- [x] **4.12** Статусбар: текущий кодировщик CPU/NVENC/AMF/QSV (строка «Обработка: …»; J-1038).
- [x] **4.13** Статусбар: tooltip GPU/драйвер/лимиты NVENC + цепочка HW-декода (J-1038).
- [x] **4.14** UI через `ui-text` + `locales/**` (J-1017..1020); guards `check:locales-json`, `check:ui-copy-quality`.
- [x] **4.15** Единый набор lucide-mini иконок: `EDITOR_TOPBAR_ACTION_ICONS`, downloads/shared, инспектор, `AboutDialog`, topbar.

### §4.1 Запоминание настроек

- [x] **4.1.1** Политика **single-root**: весь runtime в `<installRoot>/app-data/` (`configurePortableAppDataPaths`); не `%AppData%` / системный `%TEMP%`; продуктовый `Data/` отдельно.
- [x] **4.1.2** `settings.json` для темы.
- [x] **4.1.3** `lastOpenedSourcePath` + `restoreLastSource` при старте + bounds main/downloads/inspector в `settings.json`.
- [x] **4.1.4** Сохранять размеры/позиции окон.
- [x] **4.1.5** Раскрытые панели: `mainWindowUiPanels`, `downloadsWindowUiPanels`, FFmpeg rail/секции §7, `probe*` shared.
- [x] **4.1.6** Папки: yt-dlp каталог, batch/export/snapshot директории в `settings.json` + диалоги «По умолчанию».
- [x] **4.1.7** Очередь yt-dlp: `queue.json` (атомарная запись, hydrate, dedup id, `will-quit` flush).
- [x] **4.1.8** `session.json`: miniPlayer bounds/topmost (J-1153).
- [x] **4.1.9** Restore: `queue.json` (waiting/cancelled/done, running→waiting), `restoreLastSource`, mini session; полный batch-session — §7.3.

### §4.2 Подтверждение закрытия

- [x] **4.2.1** Отслеживать активные процессы: `activeExportAbort` + `isDownloadsRunnerBusy()`.
- [x] **4.2.2** Диалог busy (остаться / mini-player / прервать) при активном экспорте или yt-dlp.
- [x] **4.2.3** §4.2: подтверждение закрытия (idle Да/Нет + busy guard + настройка `confirmCloseOnQuit`); очередь waiting/cancelled сохраняется в `queue.json`, текст idle при waiting; pop-out загрузок и инспектор закрываются с main.

### §4.3 Mini Player

- [x] **4.3.1** §4.3 (J-1153–1157): mini-player; snapshot %/speed; busy-close; ПКМ topmost. Ручная visual — [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md).
- [x] **4.3.2** Прогресс в mini-player: interval 500 ms + `pushMiniPlayerSnapshotIfOpen` на `exportProgress`.
- [x] **4.3.3** Topmost режим (toggle + persist `session.json`).
- [x] **4.3.4** Кнопки + `MiniPlayerContextMenu` (ПКМ topmost, focus main).

### §4.4 Производительность интерфейса

- [x] **4.4.1** Lazy `React.lazy` + `Suspense`: терминал, загрузки, FFmpeg rail, Knowledge/Settings/Workflow/… (`app-lazy-panels.tsx`).
- [x] **4.4.2** `.app-shell-busy` отключает transition/animation при `useAppChromeBusy()`.
- [x] **4.4.3** Уважать системный reduced motion (`prefers-reduced-motion` в `main.css`; J-1034).

### §4.5 О программе и версия

- [x] **4.5.1** «О программе»: `AboutDialog` по меню/настройкам.
- [x] **4.5.2** Версия из `package.json` (`app.getVersion()`).
- [x] **4.5.3** Build number / дата сборки (`app-build-info.json`, `write-app-build-info.mjs`, About + Support ZIP; J-1033).
- [x] **4.5.4** Кнопка «Открыть папку логов».
- [x] **4.5.5** Кнопка экспорта support ZIP.

### §4.6 Настройки

- [x] **4.6.1** Окно настроек (модалка с навигацией, J-1014).
- [x] **4.6.2** Раздел «Общие» (тема, язык, подтверждение закрытия, Ctrl+V URL).
- [x] **4.6.3** Раздел «По умолчанию» (yt-dlp каталог, batch output).
- [x] **4.6.4** Раздел «Зависимости» (пути движков).
- [x] **4.6.5** Раздел «Горячие клавиши» (таблица ускорителей).
- [x] **4.6.6** Раздел «Логи/диагностика» (журнал, Support ZIP, О программе).
- [x] **4.6.7** Сброс настроек + экспорт/импорт JSON в разделе «Сброс».

## §5. Темизация

- [x] **5.1** Две темы: тёмная/светлая.
- [x] **5.2** Сохранение выбранной темы.
- [x] **5.3** Меню переключения темы.
- [x] **5.4** CSS-токены: полный набор имён в `base.css` (J-1091); WCAG-пары Vitest (J-1097); spacing/font-size/line-height guards (J-1106..1112).
- [x] **5.5** Имена токенов §5: Background…Disabled + alias `--fa-bg-elevated` (J-1091).
- [x] **5.6** Проверить контрасты: `theme-contrast-pairs` WCAG AA по hex (J-1097); визуальный прогон — [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md) (J-1107).
- [x] **5.7** Focus/hover/disabled: контролы (J-1092) + input/select/textarea (J-1097); бенчмарк/select rare panels (J-1113/1114).
- [x] **5.8** Исключить стили вне токенов: hex/rgba/radius/spacing/font-size/line-height guards (J-1093..1112); редкие select/benchmark (J-1113/1114).
- [x] **5.9** Единые радиусы/отступы: `--fa-radius-*` (J-1098), `--fa-space-*` + gap/padding guards (J-1104..1106).
- [x] **5.10** Типографика: `--fa-font-size-*` + font-size rem/px guard (J-1108); `--fa-line-height-*` (J-1111).

## §6. Окно менеджера загрузок (yt-dlp)

### §6.1 Основная панель

- [x] **6.1.1** Основной менеджер загрузок — вкладка `Загрузки` + pop-out `#downloads` (один React UI); таблица очереди, история→лог, settings rail; legacy HTML удалён (J-984).
- [x] **6.1.2** Многострочное поле URL.
- [x] **6.1.3** Добавление распознанных строк в простую очередь (таблица в том же документе).
- [x] **6.1.4** Drag-and-Drop URL/текста на поле ввода и на свободную область окна загрузок (не перехватываем drop на `textarea`/`select`/текстовых `input`).
- [~] **6.1.5** Вставка из главного окна (быстрая URL-полоса с **«Скачать и добавить в редактор»**, поле вкладки, меню/глобальный Ctrl+V, pop-out) → merge в очередь или цепочка «скачать → открыть в редакторе» (J-624).
- [~] **6.1.6** Таблица: имя (хост+путь/ранний title/path basename), ссылка; колонки Формат/Размер/Прогресс/Скорость/**Осталось**; **Прогресс** — полоска + числовой %, зелёный 100% при «Готово»; `progress` суммарная строка; действия старт/retry/pause/delete/file/folder — **во встроенной React-вкладке icon-only** (`app-icon-btn` + те же пути SVG, что `RowIco` в data HTML); **дублирующая кнопка отмены в футере правого rail yt-dlp убрана** (осталась у поля URL; J-638); `queue.json` §4.1 с дедупликацией id при restore; format/size/title из `[info]`, progress и post-processing строк yt-dlp (`ExtractAudio`, remux, convert); дальше — редкие шаблоны логов.
- [~] **6.1.7** Старт всей очереди (последовательно, только «Ожидание»).
- [x] **6.1.8** Старт отдельной строки.
- [x] **6.1.9** Отмена текущего yt-dlp (SIGKILL процессу spawn; на Windows при удалении строки — `taskkill` через **`execFileSync`**, J-623) из вкладки и pop-out.
- [~] **6.1.10** Пауза/продолжение где возможно: SIGSTOP/SIGCONT на POSIX; Windows показывает недоступность; UI есть во вкладке и pop-out.
- [x] **6.1.11** Удаление строки (ожидание остановки runner; очистка `.part`/`.ytdl` рекурсивно до глубины 2 и без эвристики «только YouTube», J-621–J-622).
- [x] **6.1.12** Reorder (вверх/вниз).

### §6.2 Настройки скачивания

- [~] **6.2.1** Выбор формата (белый список пресетов `-f`: по умолчанию yt-dlp / merge `bv*+ba/b` / `best`).
- [~] **6.2.2** Выбор качества (только через те же пресеты; без произвольной строки `-f`).
- [~] **6.2.3** Аудио-only (`-x --audio-format best`; ffmpeg должен быть доступен yt-dlp; без выбора кодека).
- [x] **6.2.4** Субтитры (пресет §6.2: выкл. / `--write-subs` / `--write-auto-subs`; опционально `--sub-langs` без пробелов; persist в settings).
- [~] **6.2.5** Плейлист/одиночный ролик (`--yes-playlist` / по умолчанию `--no-playlist`).
- [~] **6.2.6** Cookies / профиль браузера: файл Netscape (`--cookies`) + whitelist `--cookies-from-browser` (Chrome/Edge/Firefox) во вкладке и pop-out; **профиль/контейнер** (`ytdlpCookiesBrowserProfile` → `chrome:…` / `edge:…` / `firefox:…` в argv, валидация длины/управляющих символов).
- [x] **6.2.7** `--impersonate`: whitelist chrome / edge / firefox (`ytdlpImpersonate` в settings, без версионирования строкой из UI); дубль `--impersonate` в доп. argv запрещён.
- [x] **6.2.8** Шаблон имени `-o` (относительно каталога загрузки, проверка выхода из каталога, `%(ext)s`; `ytdlpFilenameTemplate` в settings).
- [x] **6.2.9** Каталог загрузки (выбор папки во вкладке/pop-out + `ytdlpDownloadDirectory` в `settings.json`; по умолчанию `userData/downloads/ytdlp`).
- [x] **6.2.10** Открыть текущий каталог загрузки из вкладки/pop-out.
- [x] **6.2.11** Ограничения скорости/ретраи (`--limit-rate`, `--retries`, `--fragment-retries`); профили **повтора строки очереди** при ненулевом exit (`off`/`light`/`normal`/`persistent`).
- [x] **6.2.12** Дополнительные параметры в сворачиваемых секциях: экспертные argv/preview/справочник по категориям §6.3 (`optgroup`, карта токенов в main, опциональный `category` в JSON).

### §6.3 Экспертный режим

- [~] **6.3.1** Live preview команды yt-dlp (`commandPreview`: реальный каталог `-o` из userData или override только для превью, первый URL очереди или `https://example.com/`; черновик формы до сохранения; во вкладке rail — поле argv + вставка токена + preview; pop-out — тот же функционал с длинным справочником; заглушки `<downloadDir>`/`<url>` только без контекста превью).
- [~] **6.3.2** Поле дополнительных аргументов (`ytdlpExtraArgsLine` в settings).
- [x] **6.3.3** Подсказки из `Data/ytdlp_commands.json` (группы в UI; при необходимости категория в JSON переопределяет встроенную карту в main); **справочник argv** — один сценарий (поиск + список, без второго `<select>`; J-637).
- [~] **6.3.4** Безопасная сборка аргументов без shell (`parseExtraYtdlpArgsLine`, spawn-массив §21).

### §6.4 Прогресс, лог, комбинированный режим

- [x] **6.4.1** Парсинг прогресса yt-dlp: процент + скорость + «Осталось» + фрагменты/плейлист/retry/HLS prep + редкие `[download]` + post-processing в колонке «Прогресс» (`parseYtdlpQueuePostProcessProgressLine`: merge, audio, remux, convert, embed, concat, fixup, SponsorBlock…; J-1043).
- [~] **6.4.2** Лог stdout/stderr: IPC `fluxalloy-downloads-log` fan-out в главное окно и pop-out; вкладка `Загрузки` показывает live log, очистку и сохранение видимого текста; pop-out сохраняет compact-layout со счётчиком размера и обрезкой DOM.
- [x] **6.4.3** «Скачать и открыть»: готовый файл можно открыть/показать в папке или отправить в обработчик FluxAlloy из очереди и истории.
- [x] **6.4.4** «Скачать и сразу обработать» (настройка §6.4: после успеха yt-dlp авто-открытие в главном preview, если известен безопасный путь в каталоге загрузок; неуспех авто-открытия пишется в лог строки).
- [x] **6.4.5** Опционально после успешного авто-открытия — авто-экспорт §7.2 в соседний файл (`name-export.ext` с суффиксом при коллизии), прогресс в главном окне, итог/ошибка в логе очереди.
- [~] **6.4.6** Обработка ошибок: приоритет текста `ERROR:`; иначе последняя строка stderr; явное завершение по сигналу ОС; `--retries`/`--fragment-retries` yt-dlp + повторы очереди §6.4 (в т.ч. профиль `persistent`) + ручной retry строки; пропуск повторов очереди по тексту (`private video`, HTTP 403/404, DRM, «нет форматов»/unsupported URL, завершённый live/premiere, **нет места на диске / errno 28**, **ffmpeg/ffprobe not found**, пустой файл и т.п.) с приоритетом транзиентных сетевых маркеров (408/502/503/504/500/429/**521/522/523/520**, таймаут/broken pipe/premature close/**EOF/SSL handshake**, signature extraction/rate limit exceeded и т.д.); `classifyYtdlpQueueFailureKind` (+ коды **2** параметры, **100** перезапуск, **101** лимит загрузок, см. апстрим yt-dlp) и суффиксы в статусе строки; код **1** по-прежнему без отдельного кода — через текстовые маркеры.
- [x] **6.4.7** Пауза/продолжить активный yt-dlp: POSIX SIGSTOP/SIGCONT + IPC + кнопка во вкладке/pop-out; Windows — явный отказ (без Job suspend).
- [x] **6.4.8** История загрузок (файл `downloads/history.json`, атомарная запись temp+rename после yt-dlp, IPC, UI во вкладке/pop-out; **во встроенной панели** — фильтр по outcome + экспорт JSON + «Повторить»; в pop-out — фильтр по исходу и открытие файла/папки при наличии `outputPath`).

## §7. Главное окно: обработка (ffmpeg)

### §7.1 Основная панель

- [x] **7.1.1** Открыть локальный файл (меню + кнопка + DnD).
- [x] **7.1.2** Отобразить имя источника (подпись под превью; полный путь в tooltip).
- [~] **7.1.3** Видеопредпросмотр: `<video playsInline>` **без нативных controls** — только кастомный chrome (`PreviewTransport`, таймлайн; J-627).
- [~] **7.1.4** Play/pause/seek: через API `<video>` + **полоска транспорта** (skip/±5 с/play/fullscreen/volume) и таймлайн (единая стеклянная зона seek/trim/In–Out, J-628–J-631); отдельный дублирующий `input[type=range]` под линейкой убран (J-628).
- [~] **7.1.5** Таймлайн: базовый scrub + маркеры in/out и экспорт сегмента в MP4/MKV/MOV (без полной панели §7.2).
- [x] **7.1.6** Маркеры in/out.
- [x] **7.1.7** Базовая кнопка «Экспорт».
- [~] **7.1.8** Вывод прогресса ffmpeg (процент по `time=`, множитель `speed=`, **фактический `videoCodecUsed` в IPC после резолва auto** в статусбаре, фрагмент stderr со статистикой кадра; шум баннера/конфига в UI не дублируем — `isFfmpegExportProgressStatusLine`; лог main по-прежнему полный; без отдельного «итого 100%» на успехе).

### §7.2 Панель настроек

- [~] **7.2.1** Пресеты обработки: в тулбаре — пресеты скорости/CRF для libx264/libx265 (`ffmpegExportEncodePreset`); список **пресетов экспорта** — **11 встроенных платформенных** из кода (`getBuiltinFfmpegExportUserPresets`, TikTok/YouTube/…; `hint` в данных) + до **8** пользовательских без префикса `flux-builtin-`, слияние при загрузке `mergeBuiltinFfmpegExportUserPresetsFromFile` (до **24** записей суммарно; J-633–J-635); старые три `flux-builtin-*` из файла настроек не подмешиваются.
- [~] **7.2.2** Контейнер/формат: toolbar + settings MP4/MKV/MOV; VP9 и CPU AV1 (SVT, AOM, rav1e) и **FFV1** — только MKV; **ProRes (`prores_ks`) / DNxHR (`dnxhd`) — только MOV** (disabled MP4/MKV в UI, авто-переключение при смене кодека и при загрузке настроек).
- [~] **7.2.3** Видео кодек: whitelist **libx264** / **libx265** / **libvpx-vp9** / **libsvtav1** / **libaom-av1** / **librav1e** / **ffv1** / **prores_ks** / **dnxhd** (MKV-only для VP9/AV1 CPU и FFV1; MOV-only для ProRes/DNx) / HW (`ffmpegExportVideoCodec`, settings/IPC, argv, UI rail «Видео»); 2-pass только для H.264; AV1 HW — в `hw_auto`/`hw_auto_hevc` (в т.ч. **av1_vaapi** в пробе и цепочке AV1); прочие mezzanine — позже.
- [~] **7.2.4** Аудио кодек: AAC, **MP3 (libmp3lame)**, **AC-3**, **копировать дорожку (copy)**, **PCM s16le**, **Vorbis (libvorbis, MKV-only)**, **Opus (libopus, MKV-only)**, **FLAC (MKV-only)**, **ALAC** или без аудио; **громкость аудио** через `-filter:a volume=NdB` (`ffmpegExportAudioGainDb`, шаг 3 дБ, диапазон −24…+24); выбор другого кодека — позже.
- [~] **7.2.5** Bitrate/CRF/quality: persisted CRF override, video bitrate mode и AAC bitrate в toolbar/settings; **опционально 2-pass при bitrate** (`ffmpegExportTwoPass`); расширенная quality-панель — позже.
- [~] **7.2.6** FPS: persisted preset source/24/25/30/50/60 для экспорта.
- [~] **7.2.7** Resolution/scale: persisted preset source/480p/720p/1080p с сохранением пропорций.
- [x] **7.2.8** Crop: whitelist пресетов 1:1 / 16:9 / 4:3 после rotate/flip и до scale/fps; toolbar + settings + пользовательские пресеты §7.2.
- [x] **7.2.9** Trim: маркеры In/Out из таймлайна подставляются в экспорт `-ss/-t`, preview команды совпадает со spawn, IPC payload валидируется.
- [x] **7.2.10** Rotate/flip: whitelist −vf transpose/hflip/vflip до scale/fps; toolbar + settings + пользовательские пресеты §7.2.
- [~] **7.2.11** Filters: §7.2 — `yadif` (деинтерлейс), `hqdn3d` (denoise), `deband`, `histeq`, `lut3d`, `unsharp` (sharpen), `eq`, `hue`, `noise` (зерно), `vignette`, `gblur` через белый список; порядок `-vf`: transform → crop → deinterlace → denoise → deband → histeq → lut3d → sharpen → eq → hue → grain → vignette → blur → scale → fps. Дальше — прочие фильтры / HW.
- [~] **7.2.12** Audio filters: `-filter:a volume=NdB` + `loudnorm`/`dynaudnorm` через whitelist; фильтры склеиваются в один chain `volume,...normalize`; расширенные режимы и двухпроходный loudness-анализ — позже.
- [~] **7.2.13** Subtitles: §7.2 — pill/select «Не сохранять» / «Сохранить»; `copy` + argv; burn-in/язык дорожки — позже.
- [x] **7.2.14** Metadata: §7.2 — PillSwitch «Удалить метаданные» / «Удалить главы» (`ffmpegExportStripMetadata`/`StripChapters`, argv `-map_metadata -1`/`-map_chapters -1`; J-1600). Точечная правка тегов — позже.
- [~] **7.2.15** Hardware acceleration: HW encode auto (`hw_auto`/`hw_auto_hevc`), probe UI, **декод `-hwaccel`**, **VAAPI `hwupload` перед кодером**; дальше — полировка цепочек QSV/CUDA.
- [~] **7.2.16** Advanced args: `ffmpegExportExtraArgsLine` + parse/валидация + argv перед output; UI/presets/batch.
- [~] **7.2.17** Live preview команды ffmpeg: pure helpers в `src/shared/ffmpeg-export-argv.ts` (`buildFfmpegExportPreviewCommand` + `shouldApplyFfmpegExportTrim`), сворачиваемый блок в App.tsx с копированием; маркеры In/Out + probeDurationSec + выбранный контейнер/crop/rotate/flip/filters §7.2 подмешиваются и совпадают со spawn (в т.ч. без `-movflags` для MKV); кнопка **перейти к экспорту** из таймлайна раскрывает rail и прокручивает к секции «Вывод» (J-632); пользовательские пресеты (persist, переименование/снимок/удаление, имя через app-modal); **встроенный сворачиваемый dock ffprobe под таймлайном снят** — краткая строка в `VideoTimeline` + окно инспектора (после J-633); дальше HW/advanced args и т.п.
- [~] **7.2.18** Безопасная сборка аргументов без shell injection: ffmpeg-экспорт идёт через `buildFfmpegExportArgv` (массив токенов, без shell); валидация значений в main `parse*`-хелперах.

### §7.3 Пакетная обработка

- [~] **7.3.1** Режим batch как отдельный режим, не основной экран (сворачиваемая панель §7.3).
- [~] **7.3.2** Таблица файлов + добавить файлы (multi-select) + **папка (рекурсивный scan)** + DnD файлов **и папок**.
- [~] **7.3.3** Параллелизм 1/2/4/auto.
- [~] **7.3.4** Очередь статусов (waiting/running/done/error/cancelled); **persist `userData/ffmpeg-export-batch/queue.json`**.
- [~] **7.3.5** Сводка ошибок после завершения; **drag-reorder**; economy/history/open; **retry failed** + **clear completed** + retry строки; **копировать пути (вход/выход)** и **по строке** / **сохранить отчёт** (TSV + колонка ошибки) / **убрать ожидающие**; открыть **готовый файл пакета в редакторе**; двойной щелчок по строке / по ячейке **«Выход»** — **исходник / результат в редакторе**; **шаблон имени выхода** (`ffmpegExportBatchOutputSuffix`); **общая папка выхода** (`ffmpegExportBatchOutputDirectory`, открыть в проводнике); авто-раскрытие панели при auto-enqueue §7.4.
- [x] **7.3.6** UX ошибок в очереди и отчёте: `resolveFfmpegExportBatchRow*` (progress/error, title, aria) — J-993.

### §7.4 Комбинированный режим

- [x] **7.4.1** URL на обработке: `editorUrlPasteBehavior` + быстрая полоса yt-dlp + глобальный Ctrl+V.
- [x] **7.4.2** Очередь/история → пакет: `enqueueBatchOnDownloadComplete`, `autoStartBatchAfterEnqueue`, кнопка «В пакет» в таблице и истории.
- [x] **7.4.3** «Скачать и обработать»: `openInHandlerOnComplete` + `autoExportAfterOpenInHandler` + Vitest completion chain; headless на железе — [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md) **7.4.x**.

### §7.5 Изображения

- [x] **7.5.1** Конвертация изображений + слайд-шоу MP4 в «Обслуживание файлов» (J-1012, J-1590).
- [x] **7.5.2** Спрайты: IPC `generateVideoSprite`, UI, PTS drawtext, packaged smoke guard (J-1145..1147).
- [~] **7.5.3** Чеклист спрайта в `ownerManualSmoke:` (J-1151); прогон на железе — [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md).
- [x] **7.5.4** Слайд-шоу → MP4: xfade-переходы + HEIC при libheif (`ffmpeg-image-slideshow-*`, probe `-decoders`).
- [x] **7.5.5** Форматы выхода: JPG/PNG/WebP/BMP/TIFF (конвертация, snapshot, спрайт).

### §7.6 Snapshot

- [x] **7.6.1** Извлечение кадра из текущей позиции превью (`currentTime` → ffmpeg `-frames:v 1`).
- [x] **7.6.2** Выбор формата: persisted PNG/JPEG в toolbar + диалог сохранения с нужным расширением по умолчанию.
- [x] **7.6.3** Выбор пути сохранения через диалог (`fluxalloy:snapshot-frame`).

## §8. Терминал, CLI и IntelliSense — **[x] закрыт (спринт 2026-05-21, J-1572–1574)**

- [x] **8.1** Окно терминала/CLI внутри Electron.
- [x] **8.2** PATH на bundled `bin`.
- [x] **8.3** Разрешить только безопасные инструментальные команды/префиксы.
- [x] **8.4** Подсказки из `Data/ffmpeg_commands.json` (+ `examples`, `docUrl` в карточке и tooltip, J-1024).
- [x] **8.5** Подсказки из `Data/ytdlp_commands.json` (+ `examples`, `docUrl`, J-1024).
- [x] **8.6** Подсказки из `Data/ffprobe_commands.json` (J-995; поля JSON — J-1024).
- [x] **8.7** Панель каталога: чипы ffmpeg/ffprobe/yt-dlp, до 240 при фильтре, счётчик «показано/всего» (J-995).
- [x] **8.8** Подстановка текущего файла/превью.
- [x] **8.9** История команд.
- [x] **8.10** Логирование команд и результата.
- [x] **8.11** IntelliSense в строке argv (v1): merge JSON+сценарии, клавиатура, фильтр до 240, `shared/terminal-inline-suggest` + Vitest.
- [x] **8.12** Вкладка «Терминал»: `ui-text` ru/en, intro/aria/история через форматтеры `formatTerminal*`.
- [x] **8.13** RU `summary` сценариев: `locales:terminal-summaries-ru` / `locales:terminal-flux-pole` (`scripts/maint/apply-terminal-summary-ru.mjs`, `inject-flux-summary-pole.mjs`); регрессия `terminal-contract-scenarios.test`.
- [x] **8.14** Каталог сценариев: **839+465** hints, **22** shards (14+8); prune near-dup и «только цифра/дорожка» — `scripts/audit/audit-terminal-hints-prune.mjs`; guards `check:terminal-contract-hints-shards` в `check:quiet`.
- [x] **8.15** guards data + scenario summaries (J-1025..1026); tooltips J-996.

## §9. Инспектор видеофайлов

- [x] **9.1** Запуск ffprobe: grant-пути (IPC); полная сводка + таблица дорожек в **отдельном окне** `#inspector` (`inspector-window.ts`, `windowBounds.inspector`); в главном редакторе — короткая строка видео/аудио под таймлайном (`VideoTimeline`); **в инспекторе** — кнопка «папка с видео» и DnD папки (как §4.B).
- [x] **9.2** Сводка: контейнер, длительность, bitrate — **в окне инспектора**; в редакторе под превью — имя файла (полный путь в подсказке).
- [x] **9.3** Таблица дорожек — **в окне инспектора** (`tags`, битрейт/`disposition`, видео `pix_fmt`/SAR/DAR + `color_*`, контекстное меню).
- [x] **9.4** Детали дорожек расширены точечными ffprobe-полями: `codec_tag` hex fallback, `extradata_size`, `initial_padding`, `closed_captions`, `is_avc`, `ticks_per_frame`, `bits_per_coded_sample`, ReplayGain, аудио `language`/`title`/`handler_name`.
- [x] **9.5** Главы (`-show_chapters`, таблица **в окне инспектора** + TXT/HTML сводка).
- [x] **9.6** JSON ffprobe: сворачиваемый блок **в окне инспектора** (просмотр/копирование/файл; отдельная вкладка не требуется).
- [x] **9.7** Копирование JSON (форматированный текст в буфер); сохранение в файл через IPC/main (`save-text-dialog-contract`).
- [x] **9.8** Сохранение TXT/HTML (сводка инспектора через `saveTextWithDialog`, генераторы в `ffprobe-summary-export`).
- [x] **9.9** Контекстные действия из таблиц (ПКМ по строке дорожки / главы → копирование в буфер через preload).
- [x] **9.10** Vitest smoke для `probeMediaFile`: нет ffprobe в каталогах и override на исполняемый не-ffprobe → `ok: false` без падения (`tests/main/ffprobe-probe-media.integration.test.ts`); мок `child_process.execFile`: невалидный/пустой JSON stdout и ошибка с stderr (`ffprobe-probe-media-json-mock`).

## §10. Планировщик задач

- [x] **10.1** Модель задач + реестр `userData/workflows/scheduled-tasks.json`; UI планировщик, in-app watch-folder runner, авто-ffmpeg при detect (J-1047..1050).
- [x] **10.2** OS backends v1: Windows `schtasks`, macOS LaunchAgent, Linux systemd user timer + CLI `--workflow-watch-folder-tick` (J-1052..1055).
- [x] **10.3** Watch folder in-app (poll, detect IPC, опция `executeScenarioOnDetect`, ffmpeg v1).
- [x] **10.4** Привязка к `scenarioId` (JSON сценария в `scenarios.json`).
- [x] **10.5** Интервал опроса 15–86400 с (in-app и OS timer).
- [x] **10.6** Таблица задач + мастер «Добавить задачу».
- [x] **10.7** Вкл/выкл, удаление, pick folder.
- [x] **10.8** Валидация parse (`scheduled-task-parse`, Vitest).
- [x] **10.9** Чеклист ручной проверки OS scheduler в планировщике + Support ZIP `workflowOsSchedulerSmoke:` (J-1057).
- [~] **10.10** Ручная проверка OS scheduler на Win/macOS/Linux — [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md) (`docs/RELEASE.md` §4.3, Help; J-1082).

## §11. Конструктор сценариев

- [x] **11.1** JSON + блок-схема + ffmpeg v1 (watch-folder, редактор, URL yt-dlp→ffmpeg, J-1047..1053).
- [x] **11.2** Запуск сценария из главного окна по открытому файлу и по URL (§11, J-1051/1053).
- [x] **11.3** Шаблоны local/URL (`workflow-scenario-templates`, J-1053).
- [x] **11.4** Load/save/delete в UI + `userData/workflows/scenarios.json`.
- [x] **11.5** Валидация схемы (кнопка «Проверить», `workflow-scenario-parse`).
- [x] **11.6** Deep-link Help из редактора и конструктора (J-1056).
- [x] **11.7** Reorder/add/remove и drag-and-link (порты + `edges` JSON, J-1074/1076/1078).

**Ручная проверка §11 (конструктор):** [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md).

## §12. Очистка кэша и обслуживание

- [x] **12.1** Категории кэша: `preview-cache`, частичные загрузки (`.part`, `.ytdl`, `.temp`, `.tmp`, `.frag`, `.crdownload`, `.aria2`) и старые orphan `fa-x264tw-*` в `diagnostics-maintenance`.
- [x] **12.2** Подсчёт размеров: IPC/preload `diagnostics.maintenanceSnapshot()` + кнопка «Размер временных» в «О программе» показывает total и разбивку `preview-cache`/`.part`/ffmpeg temp.
- [x] **12.3** Выборочная очистка: сервис принимает target ids; UI даёт отдельные двухшаговые кнопки для общего набора, `preview-cache`, частичных yt-dlp файлов и старых ffmpeg temp.
- [x] **12.4** Подтверждение опасных действий: очистка временного в «О программе» требует второго клика («Подтвердить очистку») и показывает статус-предупреждение.
- [x] **12.5** Очистка временных: `diagnostics.cleanMaintenance()` — preview-cache, partials, старые `fa-x264tw-*`; готовые медиа и свежие temp не трогает.

## §13. История и статистика

- [x] **13.1** Журнал задач: `processing/history.json` пишет export/snapshot/auto-export/workflowScenario из main; панель + live-refresh (J-1063..1069).
- [x] **13.2** Фильтры: kind/outcome/query (**в т.ч. `workflowScenario`**, `exportVideoCodecUsed`); загрузки — по outcome.
- [x] **13.3** Повторить загрузку: история yt-dlp в pop-out и встроенной панели возвращает URL в очередь (J-1067/1068).
- [x] **13.4** Повторить обработку: «Повторить» / «Повторить сценарий» (file + URL по `sourceUrl`, J-1059/1060).
- [x] **13.5** Недельная сводка: 7 дней + chips-фильтры по клику (J-1069).
- [x] **13.6** Экспорт истории: JSON schema 2 + `uiLocale` для processing и downloads (J-1066/1067).

## §14. Контекстное меню Windows

- [x] **14.1** Регистрация HKCU пунктов (video `SystemFileAssociations`, J-1061).
- [x] **14.2** «Открыть в FluxAlloy» (`--fluxalloy-shell-open`, J-1061).
- [x] **14.3** Quick MP4 (`--fluxalloy-shell-quick-mp4`, ffmpeg export, J-1061).
- [x] **14.4** Ограничение на видеофайлы (whitelist расширений + parse argv).
- [x] **14.5** Удаление регистрации (настройки + IPC unregister).
- [x] **14.6** macOS/Linux: отложено (UI скрыт, `supported: false`).
- [x] **14.7** NSIS post-install register / uninstall unregister (`installer.nsh`, headless CLI, J-1062).
- [x] **14.8** Single-instance: повторный shell-open в работающее окно (J-1062).
- [x] **14.9** «Открыть с помощью»: HKCU OpenWithProgids + Applications SupportedTypes; настройки, NSIS, headless CLI (J-1073).
- [x] **14.10** Приложение по умолчанию: кнопка «Приложения по умолчанию…» → `ms-settings:defaultapps` (J-1077); reg UserChoice — не делаем.

**Ручная проверка §14 (Windows shell):** [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md) (код [x], прогон владельца — там же).

## §15. База знаний и подсказки

- [x] **15.1** Файлы справки: `Help/ru/*.md` (RU) и `Help/en/*.md` (EN); общие `Help/assets/`.
- [~] **15.2** Viewer внутри приложения (markdown body: blockquote/`>`, `---`/thematic break, списки `-`/`+`/нумерация + перенос пункта с отступом 4+, внутренние `.md` и внешние `https`, **картинки** `![alt](assets/…)` — при `readKnowledgeArticle` мелкие файлы из `Help/assets/**` (до ~512 KiB) **встраиваются** в markdown как `data:image/*;base64` (стабильно в dev и сборке); парсер допускает только whitelist `data:`; `fluxhelp:` + CSP `img-src` остаются как запасной путь.
- [x] **15.3** Оглавление: 7 разделов `knowledge-toc-registry` + FAQ RU/EN (J-983).
- [x] **15.4** Поиск.
- [x] **15.5** Язык UI и база: `listArticles`/`readKnowledgeArticle` — RU из `Help/ru/{slug}.md`, EN из `Help/en/{slug}.md` (fallback EN→RU); при смене языка UI список/статья перезапрашиваются.
- [x] **15.6** 23 статьи RU+EN + FAQ; стабильные SVG в `Help/assets/` + `help-assets-references.test.ts`; deep-link: terminal, downloads/ffmpeg rail, batch, probe, **настройки HiDPI/HW** (J-983, J-990, J-1041).
- [x] **15.7** `check:ui-copy-quality` + terminal hint guard (E1); E4 icon-only — по мере правок UI.
- [x] **15.8** Пары `Help/ru/*.md` / `Help/en/*.md` для основных slug’ов (без смешения языков в одном файле); все slug E5 в `knowledge-toc-registry` (Vitest = `Help/ru/*.md`).

## §16. Аппаратное ускорение

- [~] **16.1** Диагностика GPU: `probeHwEncoders` — hwaccels + nvidia-smi name/driver; tooltip статусбара и кодека (J-1002).
- [~] **16.2** Определение доступных кодировщиков: парсер `ffmpeg -encoders`, IPC `probeHwEncoders`, список кодеков в rail «Формат» по снимку; при отсутствии кодека в сборке — откат на libx264; **hw_auto** / **hw_auto_hevc** в UI и spawn.
- [~] **16.3** Auto mode: `hw_auto` — H.264 NVENC → AMF → QSV → VideoToolbox → VAAPI, затем AV1 NVENC/AMF/QSV → libx264; `hw_auto_hevc` — HEVC NVENC → … → VAAPI, затем AV1 → libx265; резолв в `runFfmpegExportJob` и превью.
- [~] **16.4** Manual mode: выбор HW из whitelist (NVENC/AMF/QSV/VideoToolbox/VAAPI + **av1_vaapi**), argv в `ffmpeg-export-argv`; подписи и подсказки по семействам + цепочка decode/upload (J-994).
- [x] **16.5** NVENC: argv smoke h264/hevc/av1_nvenc + cuda decode; hwupload_cuda только с CPU vf (J-1001).
- [x] **16.6** AMF: argv smoke h264/hevc/av1_amf + d3d11va decode/upload; hints (J-1000).
- [x] **16.7** QSV: argv smoke h264/hevc/av1_qsv + qsv decode/upload; hints (J-1000).
- [x] **16.8** VideoToolbox для macOS: argv smoke h264/hevc_videotoolbox + videotoolbox decode, `-q:v` (J-1001).
- [x] **16.9** VAAPI/прочее для Linux: argv smoke `h264/hevc/av1_vaapi` + hwaccel (J-999); чеклист ручной проверки — `ffmpeg-hw-manual-smoke-checklist` (J-1030).
- [~] **16.10** Индикатор `[АВТО]`: бейдж у выбора кодека при `hw_auto` / `hw_auto_hevc` + подсказка; в статусбаре — человекочитаемый кодек, `[АВТО]`, tooltip HW (J-996).
- [x] **16.11** Режим экономии CPU/threads/priority (`-threads 1` + `belowNormal` при spawn; J-998).
- [x] **16.12** Кнопка «Оценить» (семпл 15 с, таблица fps/ETA/размер, рекомендация, выбор кодека по клику; J-997).
- [x] **16.13** Порог нагрузки CPU/GPU в бенчмарке: nvidia-smi, колонка GPU, max(cpu,gpu) для «Рекомендовано» (J-999).

**Ручная проверка §16 (HW на железе):** [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md). Argv-таблицы в CI: `ffmpeg-export-nvenc-vtb-argv-table.test.ts`, `ffmpeg-export-vaapi-linux-argv-table.test.ts`.

## §17. Дополнительные утилиты

- [x] **17.1** Меню утилит: «Открыть папку…» — hint/toolTip на пунктах + панель в «О программе» (J-1003); enabled при фокусе — как раньше.
- [x] **17.2** Извлечь кадры §7.6 (J-1004–1006): режимы, WebP, topbar, выбор файла, progress-bar.
- [x] **17.3** Обслуживание файлов: remux repair + проверка целостности (J-1007).
- [x] **17.4** Генератор шума/тишины WAV + хеши MD5/SHA256 (J-1008).
- [x] **17.5** Извлечь обложку в очереди загрузок (J-1009).
- [x] **17.6** Плагины AviSynth/VapourSynth: меню «Сервис», настройки, `-vf` экспорта (J-1010).
- [~] **17.7** Открыть папки ресурсов/логов: полный список в «О программе» + быстрые кнопки logs/ZIP (J-1003); отдельное окно настроек — позже.
- [~] **17.8** Диагностические команды/утилиты обслуживания: IPC/preload для `maintenanceSnapshot`/`cleanMaintenance`, тесты `diagnostics-maintenance`; дальше — отдельное окно настроек и расширение категорий.

## §18. Логирование и диагностика

- [x] **18.1** Библиотека: `logger-service` (без `electron-log`/`pino`; J-1589).
- [x] **18.2** Логи main: `logInfo/logWarn/logError` → `userData/logs/main.log` с timestamp/scope.
- [x] **18.3** Логи renderer: IPC `fluxalloy:log-renderer` + перехват `error`/`unhandledrejection`; token bucket + sanitize.
- [x] **18.4** Логи внешних процессов stdout/stderr: yt-dlp, ffmpeg export/snapshot, ffprobe через общий sanitizer без полного argv.
- [x] **18.5** Ротация: `rotateLogFileIfTooLarge` → `main.log.1` при >1 MiB (`logger-rotate-file.test.ts`).
- [x] **18.6** Prune crash dumps / session archives / diagnostics в Support ZIP (см. `logger-service`, `support-bundle`).
- [x] **18.7** Crash handler: `uncaughtException`/`unhandledRejection` до `app.whenReady` + диалог после ready.
- [x] **18.8** Диалог ошибки: кратко + детали.
- [x] **18.9** Копировать детали.
- [x] **18.10** Открыть лог.
- [x] **18.11** Support ZIP: `diagnostics.txt` (`ownerManualSmoke:`, `releaseSmoke:`, `terminalHints:` §8 dev guards), `main.log`, `main.log.1`, `session.log`, последние crash dumps, версия, ОС.

## §19. Система установки и дистрибуция

- [x] **19.1** `electron-builder.yml` есть.
- [x] **19.2** `npm run build:win` проходит (ручная приёмка packaged/installer — [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md)).
- [x] **19.3** `npm run build:unpack` проходит.
- [~] **19.4** `Data/`, `Help/`, `FLUXALLOY_TZ.md` добавлены в `extraResources`.
- [~] **19.5** `bin/` в `extraResources`: bundled-first каталог с `README.md`; готовые бинарники подкладываются локально/CI через `npm run engines:prepare:win` перед сборкой (в Git не хранятся), скачивание в `userData/bin` остаётся fallback/update; release checklist и лицензии bundled engines — `docs/RELEASE.md` / `docs/BUNDLED_ENGINES_LICENSES.md`; GitHub Actions после `check` гоняет prepare + **`engines:doctor`** со строгой проверкой структуры `trusted_hashes` и логом версий; локально **`check:release`** / **`release:win*`** после prepare тоже через `engines:doctor` (`FLUXALLOY_ENGINES_STRICT=1` — ручной релизный gate для непустых exe-хешей).
- [x] **19.6** Dependabot: `.github/dependabot.yml` (npm weekly, GitHub Actions monthly); разовые настройки Actions и расшифровка писем CI — `docs/RELEASE.md` §5.
- [x] **19.7** Иконка: `resources/icon.png` + `electron-builder.yml` `icon:` + main window (приёмка в установщике — manual **19.3.1**).
- [~] **19.8** Windows NSIS + ZIP (без цели `portable` — single-root); `installer.nsh` / `Uninstall FluxAlloy.cmd` — опциональное удаление `app-data/` (по умолчанию нет); `verify:win-unpacked` после `pack:dir`; интерактивная проверка installer/packaged — [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md) §19.
- [ ] **19.9** macOS dmg/zip (targets в builder [x]; прогон — [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md)).
- [ ] **19.10** Linux AppImage/deb/tar (targets [x]; прогон — [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md)).
- [x] **19.11** Подпись Windows — roadmap [`docs/RELEASE.md`](docs/RELEASE.md) §4 + `release-code-signing-roadmap.ts` (J-1498); Authenticode/CSC в CI — позже.
- [x] **19.12** Подпись/notarization macOS — roadmap [`docs/RELEASE.md`](docs/RELEASE.md) §4.2 + Help packaged-macos (J-1496..1497).
- [x] **19.13** Подпись Linux (GPG deb/AppImage) — roadmap [`docs/RELEASE.md`](docs/RELEASE.md) §4.1 + Help packaged-linux (J-1499); CI — позже.
- [x] **19.14** Временный `win.signAndEditExecutable: false` снят после перезагрузки; `build:unpack`/`winCodeSign` проходят с поведением electron-builder по умолчанию.

## §20. Пресеты

- [x] **20.1** Формат пользовательских пресетов: `fluxalloy.export-preset.v1` / bundle `fluxalloy.export-presets-bundle.v1` (`presets-export-file-v1.ts`, `presets-export-disk-parse.ts`).
- [x] **20.2** Папка `Presets/export/` рядом с install root (`resolveInstallRoot`); legacy из `settings.json` мигрирует при загрузке; в `settings.json` пресеты не пишутся.
- [x] **20.3** Системные пресеты: **11** built-in в `builtin-ffmpeg-export-user-presets.ts`, merge при hydrate.
- [x] **20.4** Клонировать встроенный → пользовательский: IPC `presetsExportCloneBuiltin` + кнопка в rail пресетов.
- [x] **20.5** Импорт / экспорт пресетов: меню «Сервис» + IPC `presetsExportImport` / `presetsExportExport`.
- [x] **20.6** Применение пресета к ffmpeg: §7.2 (`applyFfmpegExportSnapshot`, выпадающий список в rail).
- [~] **20.7** Пресеты yt-dlp: не требуются по ТЗ §20 (отдельные format presets в settings §7).

## §21. Архитектура и качество

- [~] **21.1** Есть структура main/preload/renderer.
- [x] **21.2** Включить/проверить strict TypeScript политику: базовый `@electron-toolkit/tsconfig` уже с `strict`; дополнительно явно включены `noImplicitAny`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature` и `useUnknownInCatchVariables` в `tsconfig.node.json`, `tsconfig.web.json`, `tsconfig.tests.json`.
- [x] **21.3** IPC contracts: `ipc-channels.ts`; перечисленные `src/shared/*-contract.ts` (в т.ч. ffprobe, save-text-dialog, settings, engine, about, preview-dialog, ffmpeg export, yt-dlp окно/лог/история, диагностика, engine-download, snapshot) — главный preload импортирует типы из `src/shared`, не из `main`; дальше — новые домены по мере IPC.
- [x] **21.4** Вынести сервисы main: **202** модуля из корня `src/main/` → `bootstrap/`, `windows/`, `menu/`, `core/`, `ipc/downloads/`, `services/*` (J-1578); `platform/` без изменений.
- [~] **21.5** Вынести модели shared: часть IPC/доменов уже в `src/shared/*-contract.ts`; остальное по мере выноса сервисов.
- [x] **21.6** Unit tests: **`247` файлов / `1804` тестов** (Vitest; J-1595); домены — снимок «Тестовый раннер» и `tests/main|shared|scripts/`. E2e packaged — Playwright §21.9.
- [x] **21.7** Выбрать Vitest/Jest: Vitest подключён (`npm run test`/`test:watch`, `tsconfig.tests.json`).
- [x] **21.8** E2e packaged: реестр §21 + guards + partition + per-step/`ci.yml` в `check:quiet`.
- [x] **21.9** GUI Playwright e2e: 8 шагов в `planned-gui-e2e.spec.ts` + `planned-gui-e2e-step-runners.ts` (skip без app); `npm run test:e2e:gui` после `pack:dir`.
- [~] **21.10** Комментарии на русском для публичных API и сложной логики: базовые комментарии добавлены; дальше писать чуть развёрнутее, чтобы следующему проходу агента было понятно «зачем» и «где границы», не только «что делает строка».
- [~] **21.11** Не использовать shell string для runtime внешних процессов: ffmpeg/ffprobe/yt-dlp через `spawn`/`execFile`; периодически аудировать новые сервисы/скрипты.

## §22. Ожидаемый результат

- [x] **22.1** `npm run check` проходит.
- [x] **22.2** `npm run build` проходит.
- [x] **22.3** `npm run build:win` проходит.
- [x] **22.4** `npm run dev` (Win): PATH; главное окно + превью/ffprobe после Vite 8 fix (**J-1454**); pop-out `#downloads`/`#inspector` — [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md).
- [~] **22.5** Windows installer с реальными ресурсами: сборка [x]; приёмка — [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md).
- [~] **22.6** macOS / Linux артефакты: сборка/guards [x]; прогон — [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md).
- [x] **22.7** Версия в «О программе» (вместе с Electron/Chromium/Node).
- [~] **22.8** Приёмочный сценарий: открыть файл → preview → экспорт/отмена → открыть файл/показать в папке/вернуть в preview/скопировать путь; интерактивно — [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md); дерево `win-unpacked` после `pack:dir` — CI и `check:release`.
- [~] **22.9** Приёмочный сценарий: URL → yt-dlp → открыть/показать файл / авто-в обработчик (флаг) → дальше экспорт ffmpeg; полный headless «скачал и перекодировал» — [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](IMPLEMENTATION_MANUAL_VERIFICATION.md).

**Финал проекта (только владелец):** [`IMPLEMENTATION_MANUAL_VERIFICATION.md` — §0](IMPLEMENTATION_MANUAL_VERIFICATION.md#0-финал-проекта).
