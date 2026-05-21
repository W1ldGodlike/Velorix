# FluxAlloy — рабочий чек-лист реализации

Источник требований: **[`FLUXALLOY_TZ.md`](FLUXALLOY_TZ.md)**. **Запрещено** правки ТЗ без **явной просьбы владельца** (глоссарий `fluxalloy-rules-explicit.mdc`). Состояние по §, спринту и TODO — **в этом файле**; хронологию решений, проверок окружения и длинные заметки — в **[`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md)**.

**Канон формата спринта и меток — этот файл** (раздел «Ближайший TODO спринта» ниже). Исполняемая копия для Cursor: [`.cursor/rules/fluxalloy-checklist.mdc`](.cursor/rules/fluxalloy-checklist.mdc). Иерархия: [`docs/SOURCES_OF_TRUTH.md`](docs/SOURCES_OF_TRUTH.md). «продолжай» / `+`: [`.cursor/skills/fluxalloy-continue/SKILL.md`](.cursor/skills/fluxalloy-continue/SKILL.md).

## Готовность полного итога

- **Оценка: ~72%** (J-1354 toolchain; **J-1454** dev Win; §8 terminal **закрыт** J-1572–1574; §21 Help/guards). Ядро Electron/React/Zustand, yt-dlp §6, ffmpeg + **пакет §7.3**, терминал §8 [x], инспектор §9, workflow §10–11, истории §13, shell §14, Help §15 (`Help/ru` + `Help/en`), HW §16, утилиты §17, диагностика §18, CI/release + guards в `check:quiet`. **`npm run dev` (Win):** главное окно + превью/ffprobe — владелец 2026-05-20; pop-out — сверить. Впереди: owner/packaged smoke на железе, mac/linux артефакты, тела Playwright §21.

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
- [x] Есть базовая тёмная/светлая тема и режим **как в системе** (`theme: system` + `nativeTheme`), сохранение в `app-data/settings.json`, меню `Вид -> Тема`.
- [~] Главное окно 1920×1080 (FHD) по умолчанию; workspace `Редактор` / `Загрузки` / `Терминал` (Zustand); preview (`fluxmedia://`), DnD, транспорт, timeline/waveform, статусбар. Снимок тестов — **237 / 1780** (J-1576; синхрон с «Тестовый раннер»).
- [~] Есть `Data/`, `Help/`, `FLUXALLOY_TZ.md`, `IMPLEMENTATION_CHECKLIST.md`, [`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md), упаковка `Data/`, `Help/`, ТЗ через `extraResources` (журнал в установщик пока не включаем — только для разработки).
- [x] Windows: `electron-builder` с режимом sign по умолчанию; после перезагрузки проверены `build:unpack`/`winCodeSign`.
- [~] ffmpeg export MP4/MKV/MOV, trim, crop/rotate/flip/scale/FPS/CRF/bitrate, пользовательские пресеты, snapshot; **пакетный экспорт §7.3** и **HW auto/manual §16** (код); полировка HW-цепочек и редкие фильтры — дальше. Движки bundled-first + UI загрузки в `userData/bin`.
- [~] Автозагрузка движков **Windows x64** (yt-dlp GitHub + ffmpeg zip mirror/fallback), SHA256 опционально через `Data/trusted_hashes.json`; `npm run engines:prepare:win` / `engines:prepare:win:force` / `predev` наполняет локальный `bin/`, а установщик берёт `resources/bin` (`extraResources`) для заранее проверенных bundled `ffmpeg.exe`/`ffprobe.exe`/`yt-dlp.exe`; бинарники в Git не коммитятся.
- [x] Локализация: `ui-text` + `locales/**` (hot-reload ✅); единый словарь `AppUiLocale`; pop-out загрузок = React `#downloads` (J-978..984).
- [~] Основная вкладка `Загрузки` в React уже закрывает очередь, старт/stop/retry/pause, настройки yt-dlp, каталог/cookies/network, live log, историю; **компактная панель «История»** — в основном **«Повторить»** (URL в очередь; J-626), полные действия файла/папки/редактора — в таблице очереди и pop-out; open учитывает финальный файл после merge и Windows UTF-8 stdout; pop-out — вторичный режим для редких settings.
- [~] ffprobe-инспектор: в **главном редакторе** под таймлайном — только **короткая строка** видео/аудио (`VideoTimeline`); полная сводка, таблица дорожек, главы, JSON и экспорт — в **отдельном окне** инспектора; Dolby/HDR side_data summary, контекстные действия — там же.
- [x] Тестовый раннер: Vitest + `npm run test`/`test:watch`; снимок **`237 test files / 1780 tests`** (J-1576); `npm run check:quiet` (**35** шагов: lint, typecheck, Vitest, doc/guards, `check:scripts-wiring`, 3 audit). Домены: yt-dlp §6, ffmpeg §7, ffprobe §9, terminal §8, workflow §10–11, knowledge §15, diagnostics, renderer stores, toolchain baseline test.

## Журнал решений и проверок

Не дублируем здесь длинную хронику — смотри **[`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md)**. Новые записи добавляй туда (время до секунд: `YYYY-MM-DD HH:mm:ss`).

## Ближайший TODO спринта

Правило: короткий навигатор **кода/CI/guards** для агента («продолжай»), не архив. 3–7 пунктов, ≤220 символов. **Не брать:** «владелец» / «на железе» / «приёмка» — только в [**Финал — владелец**](#финал-проекта--только-владелец) в конце файла.

- [ ] §15: массовые статьи Help по фазе E5 (структура `Help/ru` + `Help/en` готова; корневые дубли убраны).
- [ ] §16/§19: owner-smoke HW + packaged win/linux/macos на железе (чеклисты в Help owner/packaged).
- [ ] §21: Playwright planned GUI — тела 8 шагов с `FLUXALLOY_E2E_APP` (spec/skip уже есть).

---

## §0. Стратегия выполнения для Cursor

- [x] `FLUXALLOY_TZ.md` существует в корне.
- [x] `IMPLEMENTATION_CHECKLIST.md` существует в корне и используется как рабочий TODO.
- [x] [`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md) — хроника решений и проверок (отдельно от чек‑листа); в `npm run check` входит `check:journal` (`scripts/gate/check-journal-numbering.mjs`): строгий порядок `J-001…` и явная ошибка при **дубликатах** `[J-NNN]`.
- [x] Стек проекта переведён в Electron + TypeScript + React.
- [x] Базовые темы и IPC настроек заведены.
- [x] Локальный Git-репозиторий создан.
- [x] Процесс обновления чеклиста и журнала — skill `fluxalloy-checklist-audit`, глоссарий (J при diff); **запрещено** правки `FLUXALLOY_TZ.md` без явной просьбы владельца.

### Этапы

1. [x] Инициализация: Electron + TS + React, Zustand, themes, workspace Редактор/Загрузки/Терминал, IPC.
2. [~] Движки: Windows prepare/doctor + bundled `resources/bin`; macOS/Linux авто-загрузка — дальше.
3. [~] Главное окно: preview/toolbar/statusbar/settings; Mini Player, `session.json`, политика закрытия очередей — дальше.
4. [~] Обработка ffmpeg: export + batch §7.3 + snapshot; полировка UI/HW — дальше.
5. [x] yt-dlp: вкладка + React pop-out `#downloads`; очередь, rail, log, history, pause/resume.
6. [x] Терминал §8: каталог 839+465, prune, RU summaries, inline-suggest v1 (J-1572–1574).
7. [~] Инспектор §9 [x]; планировщик §10 и конструктор §11 [x] в коде; owner-smoke OS/сценарии — владелец.
8. [~] Обслуживание §12 [x]; истории §13 [x]; утилиты §17 в основном [x].
9. [~] Логирование/диагностика §18 — каркас [x], ротация/библиотека — дальше.
10. [~] Дистрибуция §19: Win NSIS/ZIP + CI; macOS/Linux артефакты и подпись — дальше.

## §1. Общая концепция

- [x] Назначение продукта зафиксировано: графический комбайн yt-dlp + ffmpeg.
- [x] Целевые платформы зафиксированы: Windows приоритет, macOS, Linux.
- [x] Лицензия есть в `LICENSE`.
- [~] Рабочий editor/downloads/terminal workspace (v0 — ориентир); **смена языка без перезапуска** [x] (J-1018); длинные шарды UI → `locales/**` частично; owner visual/HiDPI/HW smoke; Mini Player; спрайты §7.5.
- [~] Держать основной UX как единый workspace с вкладками `Редактор` / `Загрузки`; логика очереди и обработки остаётся разделённой по сервисам, pop-out окна — вторичный режим.

### §1.1 UI и UX

- [~] Построить главное окно вокруг крупного предпросмотра: базовая зона preview есть, финальная компоновка панелей — дальше.
- [~] Таймлайн под превью (базовый range + синхрон с `<video>`); **масштаб окна scrub (×1…×8)**, **waveform** (≤~180 s и ≤96 MiB ответа) и **линейка времени** по видимому окну (`timeline-ruler`), клик/клавиатура → seek в окне zoom; **снап к кадру** по `probe.videoFpsApprox` (`resolveVideoFpsApprox`: avg/r-дробь, иначе `nb_frames`/duration) или по regex в `detail` дорожки; сводки §9 дополняются строкой FPS; transport strip и HiDPI `@120/144/168/192dpi` в `main.css` (J-627, J-991); **нативные `<video controls>` отключены** — воспроизведение только через `PreviewTransport`/таймлайн; дальше — редкие контейнеры без fps/`nb_frames`.
- [~] Панели кодирования справа: **сворачиваемые секции** + **целиком rail FFmpeg** (`ffmpegSettingsRailOpen` в `mainWindowUiPanels`); persist в `settings.json`; полировка и инспектор — дальше.
- [~] Сформировать вкладку `Загрузки` в едином workspace: React слой уже показывает URL-band + живую queue table через общий snapshot broadcast + summary cards + filter chips + progress bars + управление строками/очисткой + pause/resume + встроенный rail основных yt-dlp настроек/network/каталога/cookies + pop-out; **«История» и «Живой лог» под строкой таблицы**; при **узкой ширине** rail **не скрывается**, а уходит **под** журнал (`@media (max-width: 1100px)`), **`#downloads-ytdlp-settings-rail`** — сворачиваемая панель настроек (`downloadsEmbeddedSettingsOpen`, как история/журнал); таблица очереди — `<caption>`/`<th scope="col">`, сброс scroll при смене фильтра; ошибки действий показываются в статусе вместо тихого no-op; pop-out — редкие/длинные settings; дальше — ручная DPI-матрица.
- [~] Реализовать прогрессивное раскрытие сложных параметров: `details` для **быстрой yt-dlp-полосы** (**`app-url-summary`**, **`quickYtdlpUrlHint`**: поле URL + **«Скачать и добавить в редактор»** + короткие ссылки на справку; **`aria-describedby`**; отдельные кнопки «Из буфера» на вкладках **убраны** — вставка через меню/глобальный Ctrl+V и автодобавление из буфера при фокусе, J-624) + **rail FFmpeg** (секционные hints + **`aria-describedby`**, развёрнутые `title`/PillSwitch J-636) + **превью команды ffmpeg** (`exportCommandPreview`); общая система панелей — дальше.
- [~] Базовые токены темы есть; тёмная палитра главного окна приведена к компактному инженерному стилю, v0-референс больше не является центром спринта.
- [~] Бинарные настройки переводить в **pill switch** с русской подсказкой, а не в select из двух вариантов: общий React `PillSwitch` применён к `Без аудио`, `Весь плейлист`, `Только аудио`, `Открыть после успеха`; **2-pass libx264** во вкладке редактора (rail «Формат», только с видеобитрейтом) + двойной spawn/main + превью двух команд; дальше — HW encode и прочие бинарные настройки по тому же паттерну.
- [~] Довести палитру, типографику, отступы, радиусы и focus-состояния на всех экранах: главный renderer и downloads (токены `--fa-*`/`focus-ring`) сближены; **редактор: focus-ring на полосе быстрого yt-dlp — `app-url-summary`, `app-url-input`, `app-btn` в теле полосы**; **`<video>` предпросмотра — `aria-label` с basename пути**; **окно загрузок: кольцо фокуса на сворачиваемых `summary` (история, журнал, hints) + rail** + **контекстные `aria-describedby` у нижних панелей**; **редкие панели** (бенчмарк, About-утилиты, внешний скрипт) — `role="group"`/`toolbar`, `title`/`aria-label` (J-1023); второе окно загрузок — тема синхронна; инспектор: topbar-хром как редактор + `probe*` секции синхронны с главным через `mergeMainWindowUiPanels`.
- [~] Убрать все литералы интерфейса в единый слой: `src/renderer/src/locales/ui-text.ts` (`ru/en`) покрывает редактор, вкладку «Загрузки», терминал, статусбар, диалоги, истории, инспектор и HW-кодеки (J-528+, J-1015); дальше — вынести длинные шарды в `locales/**` JSON без дублирования по мере роста словаря.
- [x] Масштабирование 100/125/150/200%: `ui-hidpi-scale-tiers` + HiDPI для `AppSettingsDialog`/статусбара в `main.css` (J-1016); ручная сверка на мониторе — по желанию.

## §2. Среда, инструменты и проект

### §2.1 Целевые платформы

- [x] Windows dev-сборка и **`npm run dev`** (главное окно, превью; Vite 8 preload external + dev CSP — J-1454).
- [~] `electron-builder` содержит цели Win/macOS/Linux.
- [x] Проверить macOS targets на macOS-среде (`pack:mac:dir` + `verify:mac-unpacked`; CI job нет; guards J-1576).
- [x] Проверить Linux targets (`pack:linux:dir` + `verify:linux-unpacked` в CI; `build:linux` + `verify:linux-release` local-only guards J-1577).
- [x] Выделить слой `platform` / `nativeMain` для различий ОС (`native-main-platform`, `check:native-main-platform-guard`; J-1031).
- [x] Заложить дорожную карту подписи/notarization для macOS — [`docs/RELEASE.md`](docs/RELEASE.md) §4.2 (подпись/notarization roadmap); выполнение в пайплайне — позже (J-1496).
- [x] Заложить дорожную карту подписи Windows (Authenticode) — [`docs/RELEASE.md`](docs/RELEASE.md) §4 + `release-code-signing-roadmap.ts` (J-1498).
- [x] Заложить дорожную карту подписи Linux (GPG deb/AppImage) — [`docs/RELEASE.md`](docs/RELEASE.md) §4.1 + `release-code-signing-roadmap.ts` (J-1499).

### §2.2 Технологический стек

- [x] Electron + React + TypeScript.
- [x] Main process отвечает за окна и настройки.
- [x] Preload работает через `contextBridge`.
- [x] Renderer не получает Node API напрямую.
- [~] Доменные сервисы main: engines, ffprobe, ffmpeg export/snapshot/**batch**, yt-dlp, workflows, diagnostics, logger; Zustand в renderer; дальше — `session.json`, Mini Player, дальнейшее разбиение main.
- [x] Подход к состоянию renderer: **Zustand** (`renderer-state-approach.ts`, `src/renderer/src/stores/*`, `AppRoot` + `check:renderer-state-approach`).
- [x] Миграция Zustand закрыта (**J-1126**); временные gate/чеклист удалены (**J-1128**).
- [x] Локализация `locales/ru|en/*.json`: 20 шардов, `ui-text-strings-build` только JSON (legacy `ui-text-strings-{ru|en}-NN.ts` удалены J-1142); guards TS↔JSON + ban legacy parts (J-1143).
- [x] Смена языка без перезапуска (все окна renderer + меню, J-1018).
- [x] Governance/docs: `fluxalloy-agent.mdc` + skills; `check:docs-governance`; программа GOV закрыта (J-1137); канон — `docs/SOURCES_OF_TRUTH.md`.
- [x] Toolchain baseline: Electron 42 / Vite 8 / TS 6 / ESLint 9 (10 отложен); выполнен (**J-1354**); план удалён (**J-1559**); Vitest package+governance (**J-1397**/**J-1411**); docs ARCHITECTURE/README/RELEASE (**J-1416**); `fix:esm-shim` (**J-1413**); Vite 8 dev preload SSR + renderer CSP (**J-1454**); [`.npmrc`](.npmrc) `legacy-peer-deps=true`.
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
- [x] Настройки: кнопка «Проверить обновления» (J-1035).
- [x] Настройки: ручной override путей к движкам.
- [x] UI: версии движков в статусбаре (краткая сводка + строка `ffmpeg`/`ffprobe`/`yt-dlp` с токенами версий; J-1036).

### Ручной smoke владельца — packaged (§3, не CI)

Канон: `locales/*/win-packaged-manual-smoke.json` (и linux/macos) + блок в `ownerManualSmoke:` (J-1081); отдельные панели в Настройках.

- [ ] `dist/win-unpacked` / `linux-unpacked` / `.app`: запуск exe, движки, редактор, загрузки, экспорт, **спрайт §7.5** (J-1152), Support ZIP.
- [ ] Отдельные `winPackagedSmoke:` / `linuxPackagedSmoke:` / `macosPackagedSmoke:` в Support ZIP остаются (дубль OK).

### Ручной smoke владельца — тема и HiDPI (§5, не CI)

Канон: `ownerManualSmoke:` блок **Theme** (J-1107) + **Настройки → Общие → Тема** / **HiDPI**; Help [appearance-language-theme.md](Help/ru/appearance-language-theme.md).

**Тема (тёмная / светлая / как в системе)** — канон строк: `appSettingsThemeCheck*` в Настройках → Общие → Тема.

- [ ] Primary-кнопки и accent-ссылки читаемы (особенно тёмная тема).
- [ ] Focus Tab на полях, select и кнопках.
- [ ] Disabled приглушены, но различимы.
- [ ] Модалки «Настройки» и «О программе» — backdrop без грязного чёрного.
- [ ] Сервис → конструктор/планировщик — узлы и подписи на токенах.
- [ ] Pop-out «Загрузки» — та же тема, что главное окно.
- [ ] Окно инспектора — фон и topbar согласованы с редактором.
- [ ] Режим «как в системе»: смена темы ОС — приложение следует без перезапуска.

**HiDPI (масштаб Windows 100–200 %)** — канон: `appSettingsHidpiCheck*` в Настройках → Общие → HiDPI.

- [ ] Редактор — топбар, превью, таймлайн, rail FFmpeg.
- [ ] Вкладка «Загрузки» — URL, таблица, нижние панели.
- [ ] Модалки «Настройки» и «О программе».
- [ ] Строка состояния и индикатор активности.

**Критерий закрытия §5 visual:** отметить `[x]` у пунктов выше + строка в журнале с GPU/масштабом.

## §4. Главное окно и глобальные элементы

### §4.A Разделение ролей окон

- [~] Главное окно существует и сфокусировано на preview/ffmpeg обработке; верхний toolbar сокращён до основных действий, FFmpeg-настройки вынесены в правую сворачиваемую панель.
- [x] Единый workspace `Редактор` / `Загрузки` / `Терминал`; pop-out загрузок — вторичный режим (редкие длинные settings).
- [x] Меню «Менеджер загрузок (yt-dlp)…» + IPC; topbar переключает вкладку `Загрузки`.
- [x] Pop-out `BrowserWindow` — тот же React-бандл, hash `#downloads` (legacy HTML удалён, J-984); sync темы/локали/очереди.

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
- [x] Адаптивность и DPI 125–200 %: `window-hidpi` + `@120/144/168/192dpi` в `main.css` (редактор, загрузки, терминал, модалки, справка, probe, история; J-989–991); pop-out загрузок = React `#downloads`.
- [~] Верхнее меню есть частично.
- [~] Меню `Файл`: «Открыть…» и «Менеджер загрузок…» есть; при фокусе дочерних окон рекурсивное открытие отключается; финальные сценарии — позже.
- [~] Меню `Инструменты`: инспектор/подменю «Открыть папку…» (userData / logs / yt-dlp / bin / resources) через whitelist; при фокусе дочерних окон повторное открытие инспектора отключается; анализировать/терминал/очистка кэша — позже.
- [~] Меню `Сервис`: планировщик и конструктор (каркас J-1047); импорт/экспорт настроек JSON — J-1013.
- [~] Меню `Справка`: ТЗ + «О программе» (модалка, версия/Electron); база знаний в приложении и история — позже.
- [~] Статусбар есть частично.
- [x] Статусбар: строка версий ffmpeg/ffprobe/yt-dlp с токенами (`engine-statusbar-versions`; J-1036); tooltip GPU в строке кодека — J-1002 / §4.C sprint.
- [x] Статусбар: индикатор активности (точка + подпись; J-1011).
- [x] Статусбар: текущий язык RU/EN (J-1011).
- [x] Статусбар: текущий кодировщик CPU/NVENC/AMF/QSV (строка «Обработка: …»; J-1038).
- [x] Статусбар: tooltip GPU/драйвер/лимиты NVENC + цепочка HW-декода (J-1038).
- [~] UI через `ui-text` + `locales/**` (J-1017..1020); остаток литералов и массовый вынос длинных шардов — дальше.
- [~] Добавить единый набор иконок: топбар редактора (folder + **rotate-ccw/cw + scissors** + **снимок/экспорт/отмена/облако (`EDITOR_TOPBAR_ACTION_ICONS`)** + **sun/moon (`EDITOR_THEME_ICONS`)**, `circle-help`/загрузки из shared) + **окно загрузок** + **вкладки** + транспорт + очередь yt-dlp + **вкладка «Загрузки»**: `clipboard`/`popOutWindow`, **URL-band**, **нижние панели** (`refreshCw`/`save`/`x`/`trash`/`file`/`folder`/`outbound`) + **инспектор §9**: `folder-open`/`refreshCw`/`circle-help`/тема — **общий `IconCircleHelp` из shared**, **диалог «О программе» — общий компонент `AboutDialog`**; при необходимости дальнейшее выравнивание панелей.

### §4.1 Запоминание настроек

- [x] Политика **single-root**: весь runtime в `<installRoot>/app-data/` (`configurePortableAppDataPaths`); не `%AppData%` / системный `%TEMP%`; продуктовый `Data/` отдельно.
- [x] `settings.json` для темы.
- [~] Последний открытый локальный файл (`lastOpenedSourcePath`) + мягкий restore превью при старте + геометрия main/downloads в `settings.json`; без полного session.json.
- [x] Сохранять размеры/позиции окон.
- [~] Сохранять раскрытые панели: главное окно + окно §9 (**push** снимка `mainWindowUiPanels` после сохранения; IPC только main/inspector + preload whitelist) + yt-dlp (`downloadsWindowUiPanels`, **toggle-сохранение только от жеста пользователя** — не при программном открытии журнала; **встроенная вкладка «Загрузки»** пишет `history`/`log` тем же IPC `fluxalloy-downloads-merge-ui-panels`); FFmpeg-секции только в редакторе (`ffmpegSettingsRailOpen` + секции §7), `probe*` — shared с инспектором.
- [~] Сохранять выбранные папки (каталог yt-dlp, последняя папка ffmpeg export и snapshot; прочие диалоги — позже).
- [~] Сохранять состояние очередей: yt-dlp живой `queue.json` §6 (атомарная запись, гидратация при старте main, дедупликация id, `will-quit` flush); полный `session.json` и прочие очереди — позже.
- [~] Сохранять `session.json` (miniPlayer bounds/topmost, J-1153).
- [~] Восстанавливать состояние после перезапуска: очередь yt-dlp восстанавливается из `queue.json` без active-status и duplicate id; полное восстановление сессии редактор/preview/`session.json` — позже.

### §4.2 Подтверждение закрытия

- [~] Отслеживать активные процессы: экспорт ffmpeg в главном окне + занятость runner yt-dlp.
- [~] Диалог перед закрытием главного окна при активном экспорте или загрузке yt-dlp (прервать и закрыть).
- [ ] Политика очередей queued/cancelled по ТЗ и закрытие вторичных окон — позже.

### §4.3 Mini Player

- [x] §4.3 (J-1153–1157): mini-player + owner-smoke; snapshot %/speed; busy-close; ПКМ topmost.
- [~] Показать прогресс активной загрузки/обработки (push snapshot из main).
- [x] Topmost режим (toggle + persist `session.json`).
- [~] Контекстные действия (кнопки; ПКМ — дальше).

### §4.4 Производительность интерфейса

- [ ] Отложенная загрузка тяжёлых панелей.
- [ ] Отключение дорогих анимаций под нагрузкой.
- [x] Уважать системный reduced motion (`prefers-reduced-motion` в `main.css`; J-1034).

### §4.5 О программе и версия

- [~] Окно «О программе»: модальное окно в renderer по пункту меню.
- [x] Версия из `package.json` (`app.getVersion()`).
- [x] Build number / дата сборки (`app-build-info.json`, `write-app-build-info.mjs`, About + Support ZIP; J-1033).
- [x] Кнопка «Открыть папку логов».
- [x] Кнопка экспорта support ZIP.

### §4.6 Настройки

- [x] Окно настроек (модалка с навигацией, J-1014).
- [x] Раздел «Общие» (тема, язык, Ctrl+V URL).
- [x] Раздел «По умолчанию» (yt-dlp каталог, batch output).
- [x] Раздел «Зависимости» (пути движков).
- [x] Раздел «Горячие клавиши» (таблица ускорителей).
- [x] Раздел «Логи/диагностика» (журнал, Support ZIP, О программе).
- [x] Сброс настроек + экспорт/импорт JSON в разделе «Сброс».

## §5. Темизация

- [x] Две темы: тёмная/светлая.
- [x] Сохранение выбранной темы.
- [x] Меню переключения темы.
- [x] CSS-токены: полный набор имён в `base.css` (J-1091); WCAG-пары Vitest (J-1097); spacing/font-size/line-height guards (J-1106..1112).
- [x] Имена токенов §5: Background…Disabled + alias `--fa-bg-elevated` (J-1091).
- [x] Проверить контрасты: `theme-contrast-pairs` WCAG AA по hex (J-1097); визуальный прогон — owner theme checklist (J-1107).
- [x] Focus/hover/disabled: контролы (J-1092) + input/select/textarea (J-1097); бенчмарк/select rare panels (J-1113/1114).
- [x] Исключить стили вне токенов: hex/rgba/radius/spacing/font-size/line-height guards (J-1093..1112); редкие select/benchmark (J-1113/1114).
- [x] Единые радиусы/отступы: `--fa-radius-*` (J-1098), `--fa-space-*` + gap/padding guards (J-1104..1106).
- [x] Типографика: `--fa-font-size-*` + font-size rem/px guard (J-1108); `--fa-line-height-*` (J-1111).

## §6. Окно менеджера загрузок (yt-dlp)

### §6.1 Основная панель

- [x] Основной менеджер загрузок — вкладка `Загрузки` + pop-out `#downloads` (один React UI); таблица очереди, история→лог, settings rail; legacy HTML удалён (J-984).
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

- [x] Парсинг прогресса yt-dlp: процент + скорость + «Осталось» + фрагменты/плейлист/retry/HLS prep + редкие `[download]` + post-processing в колонке «Прогресс» (`parseYtdlpQueuePostProcessProgressLine`: merge, audio, remux, convert, embed, concat, fixup, SponsorBlock…; J-1043).
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
- [x] UX ошибок в очереди и отчёте: `resolveFfmpegExportBatchRow*` (progress/error, title, aria) — J-993.

### §7.4 Комбинированный режим

- [~] URL на обработке: настройка **Ctrl+V / DnD URL** (`editorUrlPasteBehavior`: менеджер загрузок или «скачать в редактор»); быстрая полоса yt-dlp + кнопки; дальше — единое окно «Настройки».
- [~] Скачанный файл можно вручную отправить как источник из очереди/истории yt-dlp; **добавление готовых загрузок и истории в пакетный экспорт**; **авто-постановка в пакет + опциональный авто-старт после успеха yt-dlp** (§7.4).
- [~] Сценарий «скачать и обработать» (авто-открытие в preview после загрузки; цепочка с ffmpeg без ручного шага — позже).

### §7.5 Изображения

- [~] Извлечение/конвертация изображений (одиночная конвертация JPEG/PNG/WebP в «О программе» — J-1012).
- [x] Спрайты: IPC `generateVideoSprite`, UI, PTS drawtext, packaged smoke guard (J-1145..1147).
- [~] Owner-smoke чеклист спрайта в `ownerManualSmoke:` (J-1151); прогон на железе — владелец.
- [ ] Слайды.
- [ ] Набор форматов JPG/PNG/WebP/etc.

### §7.6 Snapshot

- [x] Извлечение кадра из текущей позиции превью (`currentTime` → ffmpeg `-frames:v 1`).
- [x] Выбор формата: persisted PNG/JPEG в toolbar + диалог сохранения с нужным расширением по умолчанию.
- [x] Выбор пути сохранения через диалог (`fluxalloy:snapshot-frame`).

## §8. Терминал, CLI и IntelliSense — **[x] закрыт (спринт 2026-05-21, J-1572–1574)**

- [x] Окно терминала/CLI внутри Electron.
- [x] PATH на bundled `bin`.
- [x] Разрешить только безопасные инструментальные команды/префиксы.
- [x] Подсказки из `Data/ffmpeg_commands.json` (+ `examples`, `docUrl` в карточке и tooltip, J-1024).
- [x] Подсказки из `Data/ytdlp_commands.json` (+ `examples`, `docUrl`, J-1024).
- [x] Подсказки из `Data/ffprobe_commands.json` (J-995; поля JSON — J-1024).
- [x] Панель каталога: чипы ffmpeg/ffprobe/yt-dlp, до 240 при фильтре, счётчик «показано/всего» (J-995).
- [x] Подстановка текущего файла/превью.
- [x] История команд.
- [x] Логирование команд и результата.
- [x] IntelliSense в строке argv (v1): merge JSON+сценарии, клавиатура, фильтр до 240, `shared/terminal-inline-suggest` + Vitest.
- [x] Вкладка «Терминал»: `ui-text` ru/en, intro/aria/история через форматтеры `formatTerminal*`.
- [x] RU `summary` сценариев: `locales:terminal-summaries-ru` / `locales:terminal-flux-pole` (`scripts/maint/apply-terminal-summary-ru.mjs`, `inject-flux-summary-pole.mjs`); регрессия `terminal-contract-scenarios.test`.
- [x] Каталог сценариев: **839+465** hints, **22** shards (14+8); prune near-dup и «только цифра/дорожка» — `scripts/audit/audit-terminal-hints-prune.mjs`; guards `check:terminal-contract-hints-shards` в `check:quiet`.
- [x] **Фаза E (терминал):** guards data + scenario summaries (J-1025..1026); tooltips J-996.

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

- [x] Модель задач + реестр `userData/workflows/scheduled-tasks.json`; UI планировщик, in-app watch-folder runner, авто-ffmpeg при detect (J-1047..1050).
- [x] OS backends v1: Windows `schtasks`, macOS LaunchAgent, Linux systemd user timer + CLI `--workflow-watch-folder-tick` (J-1052..1055).
- [x] Watch folder in-app (poll, detect IPC, опция `executeScenarioOnDetect`, ffmpeg v1).
- [x] Привязка к `scenarioId` (JSON сценария в `scenarios.json`).
- [x] Интервал опроса 15–86400 с (in-app и OS timer).
- [x] Таблица задач + мастер «Добавить задачу».
- [x] Вкл/выкл, удаление, pick folder.
- [x] Валидация parse (`scheduled-task-parse`, Vitest).
- [x] Чеклист ручного smoke OS scheduler в планировщике + Support ZIP `workflowOsSchedulerSmoke:` (J-1057).
- [~] Ручной прогон OS scheduler на Win/macOS/Linux — владелец (`docs/RELEASE.md` §4.3, Help); deep-link owner-smoke в планировщике (J-1082).

## §11. Конструктор сценариев

- [x] JSON + блок-схема + ffmpeg v1 (watch-folder, редактор, URL yt-dlp→ffmpeg, J-1047..1053).
- [x] Запуск сценария из главного окна по открытому файлу и по URL (§11, J-1051/1053).
- [x] Шаблоны local/URL (`workflow-scenario-templates`, J-1053).
- [x] Load/save/delete в UI + `userData/workflows/scenarios.json`.
- [x] Валидация схемы (кнопка «Проверить», `workflow-scenario-parse`).
- [x] Deep-link Help из редактора и конструктора (J-1056).
- [x] Reorder/add/remove и drag-and-link (порты + `edges` JSON, J-1074/1076/1078).

### Ручной smoke владельца — конструктор (§11, не CI)

Канон: `locales/*/workflow-scenario-manual-smoke.json` → `ownerManualSmoke:` (блок «Scenario builder»).

- [x] Код: add/remove, drag-reorder, drag-and-link → `edges` в JSON (J-1076/1078).
- [ ] Прогон владельца: «Сохранить» / перезагрузка — те же nodes/edges.
- [ ] Прогон владельца: редактор → «Запустить сценарий» — `workflowScenario` в истории.
- [ ] (Опц.) URL-сценарий и watch-folder + OS scheduler (§10).

## §12. Очистка кэша и обслуживание

- [x] Категории кэша: `preview-cache`, частичные загрузки (`.part`, `.ytdl`, `.temp`, `.tmp`, `.frag`, `.crdownload`, `.aria2`) и старые orphan `fa-x264tw-*` в `diagnostics-maintenance`.
- [x] Подсчёт размеров: IPC/preload `diagnostics.maintenanceSnapshot()` + кнопка «Размер временных» в «О программе» показывает total и разбивку `preview-cache`/`.part`/ffmpeg temp.
- [x] Выборочная очистка: сервис принимает target ids; UI даёт отдельные двухшаговые кнопки для общего набора, `preview-cache`, частичных yt-dlp файлов и старых ffmpeg temp.
- [x] Подтверждение опасных действий: очистка временного в «О программе» требует второго клика («Подтвердить очистку») и показывает статус-предупреждение.
- [x] Очистка временных: `diagnostics.cleanMaintenance()` — preview-cache, partials, старые `fa-x264tw-*`; готовые медиа и свежие temp не трогает.

## §13. История и статистика

- [x] Журнал задач: `processing/history.json` пишет export/snapshot/auto-export/workflowScenario из main; панель + live-refresh (J-1063..1069).
- [x] Фильтры: kind/outcome/query (**в т.ч. `workflowScenario`**, `exportVideoCodecUsed`); загрузки — по outcome.
- [x] Повторить загрузку: история yt-dlp в pop-out и встроенной панели возвращает URL в очередь (J-1067/1068).
- [x] Повторить обработку: «Повторить» / «Повторить сценарий» (file + URL по `sourceUrl`, J-1059/1060).
- [x] Недельная сводка: 7 дней + chips-фильтры по клику (J-1069).
- [x] Экспорт истории: JSON schema 2 + `uiLocale` для processing и downloads (J-1066/1067).

## §14. Контекстное меню Windows

- [x] Регистрация HKCU пунктов (video `SystemFileAssociations`, J-1061).
- [x] «Открыть в FluxAlloy» (`--fluxalloy-shell-open`, J-1061).
- [x] Quick MP4 (`--fluxalloy-shell-quick-mp4`, ffmpeg export, J-1061).
- [x] Ограничение на видеофайлы (whitelist расширений + parse argv).
- [x] Удаление регистрации (настройки + IPC unregister).
- [x] macOS/Linux: отложено (UI скрыт, `supported: false`).
- [x] NSIS post-install register / uninstall unregister (`installer.nsh`, headless CLI, J-1062).
- [x] Single-instance: повторный shell-open в работающее окно (J-1062).
- [x] «Открыть с помощью»: HKCU OpenWithProgids + Applications SupportedTypes; настройки, NSIS, headless CLI (J-1073).
- [x] Приложение по умолчанию: кнопка «Приложения по умолчанию…» → `ms-settings:defaultapps` (J-1077); reg UserChoice — не делаем.

### Ручной smoke владельца — Windows shell (§14, не CI)

Канон: `locales/*/windows-shell-manual-smoke.json` → `ownerManualSmoke:` (блок «Windows shell» на Win).

- [x] Код: контекстное меню, OpenWith, default apps, NSIS (J-1061..1077).
- [ ] Прогон владельца: shell smoke в ownerManualSmoke (Win).

## §15. База знаний и подсказки

- [x] Файлы справки: `Help/ru/*.md` (RU) и `Help/en/*.md` (EN); общие `Help/assets/`.
- [~] Viewer внутри приложения (markdown body: blockquote/`>`, `---`/thematic break, списки `-`/`+`/нумерация + перенос пункта с отступом 4+, внутренние `.md` и внешние `https`, **картинки** `![alt](assets/…)` — при `readKnowledgeArticle` мелкие файлы из `Help/assets/**` (до ~512 KiB) **встраиваются** в markdown как `data:image/*;base64` (стабильно в dev и сборке); парсер допускает только whitelist `data:`; `fluxhelp:` + CSP `img-src` остаются как запасной путь.
- [x] Оглавление: 7 разделов `knowledge-toc-registry` + FAQ RU/EN (J-983).
- [x] Поиск.
- [x] Язык UI и база: `listArticles`/`readKnowledgeArticle` — RU из `Help/ru/{slug}.md`, EN из `Help/en/{slug}.md` (fallback EN→RU); при смене языка UI список/статья перезапрашиваются.
- [x] **Help:** 23 статьи RU+EN + FAQ; стабильные SVG в `Help/assets/` + `help-assets-references.test.ts`; deep-link: terminal, downloads/ffmpeg rail, batch, probe, **настройки HiDPI/HW** (J-983, J-990, J-1041).
- [~] **Tooltips / copy:** `check:ui-copy-quality`, humanize terminal summaries; хвост E4 icon-only.
- [x] Пары `Help/ru/*.md` / `Help/en/*.md` для основных slug’ов (без смешения языков в одном файле); дальше — **массовое** добавление статей по фазе E5.

## §16. Аппаратное ускорение

- [~] Диагностика GPU: `probeHwEncoders` — hwaccels + nvidia-smi name/driver; tooltip статусбара и кодека (J-1002).
- [~] Определение доступных кодировщиков: парсер `ffmpeg -encoders`, IPC `probeHwEncoders`, список кодеков в rail «Формат» по снимку; при отсутствии кодека в сборке — откат на libx264; **hw_auto** / **hw_auto_hevc** в UI и spawn.
- [~] Auto mode: `hw_auto` — H.264 NVENC → AMF → QSV → VideoToolbox → VAAPI, затем AV1 NVENC/AMF/QSV → libx264; `hw_auto_hevc` — HEVC NVENC → … → VAAPI, затем AV1 → libx265; резолв в `runFfmpegExportJob` и превью.
- [~] Manual mode: выбор HW из whitelist (NVENC/AMF/QSV/VideoToolbox/VAAPI + **av1_vaapi**), argv в `ffmpeg-export-argv`; подписи и подсказки по семействам + цепочка decode/upload (J-994).
- [x] NVENC: argv smoke h264/hevc/av1_nvenc + cuda decode; hwupload_cuda только с CPU vf (J-1001).
- [x] AMF: argv smoke h264/hevc/av1_amf + d3d11va decode/upload; hints (J-1000).
- [x] QSV: argv smoke h264/hevc/av1_qsv + qsv decode/upload; hints (J-1000).
- [x] VideoToolbox для macOS: argv smoke h264/hevc_videotoolbox + videotoolbox decode, `-q:v` (J-1001).
- [x] VAAPI/прочее для Linux: argv smoke `h264/hevc/av1_vaapi` + hwaccel (J-999); чеклист ручного smoke — `ffmpeg-hw-manual-smoke-checklist` (J-1030).
- [~] Индикатор `[АВТО]`: бейдж у выбора кодека при `hw_auto` / `hw_auto_hevc` + подсказка; в статусбаре — человекочитаемый кодек, `[АВТО]`, tooltip HW (J-996).
- [x] Режим экономии CPU/threads/priority (`-threads 1` + `belowNormal` при spawn; J-998).
- [x] Кнопка «Оценить» (семпл 15 с, таблица fps/ETA/размер, рекомендация, выбор кодека по клику; J-997).
- [x] Порог нагрузки CPU/GPU в бенчмарке: nvidia-smi, колонка GPU, max(cpu,gpu) для «Рекомендовано» (J-999).

### Ручной smoke владельца (железо, не CI)

Канон шагов: [`src/shared/ffmpeg-hw-manual-smoke-checklist.ts`](src/shared/ffmpeg-hw-manual-smoke-checklist.ts) (дублируется в Support ZIP как `hwManualSmoke:`). Автоматизированные argv-smoke: `tests/shared/ffmpeg-export-nvenc-vtb-argv-table.test.ts`, `ffmpeg-export-vaapi-linux-argv-table.test.ts`.

**Windows — NVENC**

- [ ] Probe: tooltip/статусбар показывает GPU NVIDIA.
- [ ] Ручной `h264_nvenc` / `hevc_nvenc`, экспорт 10 с — файл OK, в логе `-hwaccel cuda` + кодек NVENC.
- [ ] `hw_auto` без тихого отката на libx264.
- [ ] «Оценить» 15 с: строка NVENC, при наличии — колонка GPU.
- [ ] Экспорт с vf (hflip/crop): `hwupload_cuda` в цепочке.

**Linux — VAAPI**

- [ ] Probe: доступны `h264_vaapi` / `hevc_vaapi` (или подсказка VAAPI).
- [ ] Ручной `h264_vaapi`, экспорт 10 с — в логе `vaapi` + `hwupload` + кодер.
- [ ] `hw_auto` выбирает VAAPI до CPU fallback.
- [ ] `av1_vaapi` — по возможности GPU, иначе N/A в заметке.
- [ ] «Оценить» на Linux без падения ffmpeg.

**Критерий закрытия:** отметить `[x]` у пунктов выше в этом разделе + строка в `IMPLEMENTATION_JOURNAL.md` с датой и GPU/драйвером.

## §17. Дополнительные утилиты

- [x] Меню утилит: «Открыть папку…» — hint/toolTip на пунктах + панель в «О программе» (J-1003); enabled при фокусе — как раньше.
- [x] Извлечь кадры §7.6 (J-1004–1006): режимы, WebP, topbar, выбор файла, progress-bar.
- [x] Обслуживание файлов: remux repair + проверка целостности (J-1007).
- [x] Генератор шума/тишины WAV + хеши MD5/SHA256 (J-1008).
- [x] Извлечь обложку в очереди загрузок (J-1009).
- [x] Плагины AviSynth/VapourSynth: меню «Сервис», настройки, `-vf` экспорта (J-1010).
- [~] Открыть папки ресурсов/логов: полный список в «О программе» + быстрые кнопки logs/ZIP (J-1003); отдельное окно настроек — позже.
- [~] Диагностические команды/утилиты обслуживания: IPC/preload для `maintenanceSnapshot`/`cleanMaintenance`, тесты `diagnostics-maintenance`; дальше — отдельное окно настроек и расширение категорий.

## §18. Логирование и диагностика

- [~] Выбрать библиотеку: пока используется собственный `logger-service` (без зависимостей); решение про `electron-log`/`pino` — позже.
- [~] Логи main: `logInfo/logWarn/logError` пишут в `userData/logs/main.log` с timestamp/scope; уровни `info/warn/error`.
- [~] Логи renderer: `window.fluxalloy.log.send` через IPC `fluxalloy:log-renderer` + перехват `error`/`unhandledrejection` в `main.tsx`; канал закреплён за main window, ограничен token bucket и чистит control chars.
- [x] Логи внешних процессов stdout/stderr: yt-dlp, ffmpeg export/snapshot, ffprobe через общий sanitizer без полного argv.
- [~] Ротация по размеру: один backup `main.log.1` при превышении 1 MiB.
- [~] Prune старых диагностических файлов: на старте чистятся crash dumps старше 30 дней, последние 20 сохраняются; архивы `logs/sessions/session-*.log` — не старше ~90 суток и не более ~25 файлов; `diagnostics.txt` в Support ZIP включает usage ключевых каталогов, `maintenanceTargets` (`previewCache`, `ytdlpPartials`, `ffmpegTemp`) и dev-блок `terminalHints:` (§8 meta/guards; Help logging sync 24 статей — J-1256).
- [~] Crash handler: `process.on('uncaughtException'|'unhandledRejection')` регистрируется на старте main до `app.whenReady`; после ready показывает диалог ошибки с деталями.
- [x] Диалог ошибки: кратко + детали.
- [x] Копировать детали.
- [x] Открыть лог.
- [x] Support ZIP: `diagnostics.txt` (`ownerManualSmoke:`, `releaseSmoke:`, `terminalHints:` §8 dev guards), `main.log`, `main.log.1`, `session.log`, последние crash dumps, версия, ОС.

## §19. Система установки и дистрибуция

- [x] `electron-builder.yml` есть.
- [x] `npm run build:win` проходит (последняя проверка до добавления portable/zip целей; для новых целей нужен ручной smoke).
- [x] `npm run build:unpack` проходит.
- [~] `Data/`, `Help/`, `FLUXALLOY_TZ.md` добавлены в `extraResources`.
- [~] `bin/` в `extraResources`: bundled-first каталог с `README.md`; готовые бинарники подкладываются локально/CI через `npm run engines:prepare:win` перед сборкой (в Git не хранятся), скачивание в `userData/bin` остаётся fallback/update; release checklist и лицензии bundled engines — `docs/RELEASE.md` / `docs/BUNDLED_ENGINES_LICENSES.md`; GitHub Actions после `check` гоняет prepare + **`engines:doctor`** со строгой проверкой структуры `trusted_hashes` и логом версий; локально **`check:release`** / **`release:win*`** после prepare тоже через `engines:doctor` (`FLUXALLOY_ENGINES_STRICT=1` — ручной релизный gate для непустых exe-хешей).
- [x] Dependabot: `.github/dependabot.yml` (npm weekly, GitHub Actions monthly); разовые настройки Actions и расшифровка писем CI — `docs/RELEASE.md` §5.
- [ ] Настроить нормальную иконку приложения вместо placeholder/default.
- [ ] Windows NSIS: проверить installer вручную.
- [~] Windows NSIS + ZIP (без цели `portable` — single-root); `installer.nsh` / `Uninstall FluxAlloy.cmd` — опциональное удаление `app-data/` (по умолчанию нет); `verify:win-unpacked` после `pack:dir`; интерактивный smoke — позже.
- [ ] macOS dmg/zip.
- [ ] Linux AppImage/deb/tar.
- [x] Подпись Windows — roadmap [`docs/RELEASE.md`](docs/RELEASE.md) §4 + `release-code-signing-roadmap.ts` (J-1498); Authenticode/CSC в CI — позже.
- [x] Подпись/notarization macOS — roadmap [`docs/RELEASE.md`](docs/RELEASE.md) §4.2 + Help packaged-macos (J-1496..1497).
- [x] Подпись Linux (GPG deb/AppImage) — roadmap [`docs/RELEASE.md`](docs/RELEASE.md) §4.1 + Help packaged-linux (J-1499); CI — позже.
- [x] Временный `win.signAndEditExecutable: false` снят после перезагрузки; `build:unpack`/`winCodeSign` проходят с поведением electron-builder по умолчанию.

## §20. Пресеты

- [x] Формат пользовательских пресетов: `fluxalloy.export-preset.v1` / bundle `fluxalloy.export-presets-bundle.v1` (`presets-export-file-v1.ts`, `presets-export-disk-parse.ts`).
- [x] Папка `Presets/export/` рядом с install root (`resolveInstallRoot`); legacy из `settings.json` мигрирует при загрузке; в `settings.json` пресеты не пишутся.
- [x] Системные пресеты: **11** built-in в `builtin-ffmpeg-export-user-presets.ts`, merge при hydrate.
- [x] Клонировать встроенный → пользовательский: IPC `presetsExportCloneBuiltin` + кнопка в rail пресетов.
- [x] Импорт / экспорт пресетов: меню «Сервис» + IPC `presetsExportImport` / `presetsExportExport`.
- [x] Применение пресета к ffmpeg: §7.2 (`applyFfmpegExportSnapshot`, выпадающий список в rail).
- [~] Пресеты yt-dlp: не требуются по ТЗ §20 (отдельные format presets в settings §7).

## §21. Архитектура и качество

- [~] Есть структура main/preload/renderer.
- [x] Включить/проверить strict TypeScript политику: базовый `@electron-toolkit/tsconfig` уже с `strict`; дополнительно явно включены `noImplicitAny`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature` и `useUnknownInCatchVariables` в `tsconfig.node.json`, `tsconfig.web.json`, `tsconfig.tests.json`.
- [x] IPC contracts: `ipc-channels.ts`; перечисленные `src/shared/*-contract.ts` (в т.ч. ffprobe, save-text-dialog, settings, engine, about, preview-dialog, ffmpeg export, yt-dlp окно/лог/история, диагностика, engine-download, snapshot) — главный preload импортирует типы из `src/shared`, не из `main`; дальше — новые домены по мере IPC.
- [x] Вынести сервисы main: **202** модуля из корня `src/main/` → `bootstrap/`, `windows/`, `menu/`, `core/`, `ipc/downloads/`, `services/*` (J-1578); `platform/` без изменений.
- [~] Вынести модели shared: часть IPC/доменов уже в `src/shared/*-contract.ts`; остальное по мере выноса сервисов.
- [x] Unit tests: **`237` файлов / `1780` тестов** (Vitest; J-1576); домены — снимок «Тестовый раннер» и `tests/main|shared|scripts/`. Дальше — e2e packaged smoke.
- [x] Выбрать Vitest/Jest: Vitest подключён (`npm run test`/`test:watch`, `tsconfig.tests.json`).
- [x] E2e packaged smoke: реестр §21 + guards + partition + per-step/`ci.yml` в `check:quiet`.
- [~] GUI Playwright e2e (8 planned steps) — spec + `FLUXALLOY_E2E_APP` [x] (J-1578–1579); тела шагов — владелец.
- [~] Комментарии на русском для публичных API и сложной логики: базовые комментарии добавлены; дальше писать чуть развёрнутее, чтобы следующему проходу агента было понятно «зачем» и «где границы», не только «что делает строка».
- [~] Не использовать shell string для runtime внешних процессов: ffmpeg/ffprobe/yt-dlp через `spawn`/`execFile`; периодически аудировать новые сервисы/скрипты.

## §22. Ожидаемый результат

- [x] `npm run check` проходит.
- [x] `npm run build` проходит.
- [x] `npm run build:win` проходит.
- [x] `npm run dev` (Win): PATH; главное окно + превью/ffprobe после Vite 8 fix (**J-1454**); pop-out `#downloads`/`#inspector` — сверить владельцу.
- [ ] Рабочий Windows installer с реальными ресурсами.
- [~] Рабочий NSIS + ZIP рядом с `app-data/` (приёмка установщика — позже).
- [ ] macOS артефакты.
- [ ] Linux артефакты.
- [x] Версия в «О программе» (вместе с Electron/Chromium/Node).
- [~] Приёмочный сценарий: открыть файл -> preview -> экспорт/отмена -> открыть файл/показать в папке/вернуть в preview/скопировать путь; интерактивный e2e в packaged — позже; автоматическая проверка дерева `win-unpacked` после `pack:dir` — в CI и `check:release`.
- [~] Приёмочный сценарий: URL -> yt-dlp -> открыть/показать файл / авто-в обработчик (флаг) -> дальше экспорт ffmpeg; полный headless «скачал и перекодировал» — позже.

## Финал проекта — только владелец

Ручная приёмка **в самом конце**; агент **не** берёт в «продолжай» и не закрывает `[x]` без вашей проверки.

- [ ] §16/§19: owner-smoke на железе (visual + HiDPI + packaged win/linux/macos + спрайт + mini-player).
- [ ] §21: Playwright planned GUI e2e — тела 8 шагов после `FLUXALLOY_E2E_APP` + приёмка на железе.
- [ ] §4.3: Mini Player — visual/HiDPI на мониторе (код [x], J-1153–1157).
- [ ] §19: packaged smoke win/linux/macos на железе; dev pop-out `#downloads`/`#inspector`; installer/NSIS приёмка.
- [ ] §22: приёмочные сценарии editor + yt-dlp + packaged GUI (после Playwright wiring).
