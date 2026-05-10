# FluxAlloy — рабочий чек‑лист реализации

Источник требований: **[`FLUXALLOY_TZ.md`](FLUXALLOY_TZ.md)**. ТЗ не редактировать без явного согласования. Состояние по §, спринту и TODO — **в этом файле**; хронологию решений, проверок окружения и длинные заметки — в **[`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md)**.

## Легенда

- `[x]` — сделано и проверено в текущей Electron/TypeScript-ветке.
- `[~]` — частично: есть каркас, заглушка или неполный сценарий.
- `[ ]` — не сделано.
- `[!]` — риск / блокер / требует решения перед релизом.

## Текущий снимок проекта

- [x] Удалён старый `.NET` / WinUI слой; текущий проект — Electron + React + TypeScript.
- [x] Инициализирован локальный Git-репозиторий, первый коммит: `4f14f86 Initialize FluxAlloy Electron project`.
- [x] Установлены Node.js `24.15.0`, npm `11.12.1`, Git `2.54.0`.
- [x] `npm install` выполнен; `npm run check`, `npm run build`, `npm run build:unpack`, `npm run build:win` проходят.
- [x] Есть `package.json`, `electron-vite`, `electron-builder`, ESLint, Prettier, TypeScript-конфиги.
- [x] Есть `src/main`, `src/preload`, `src/renderer`.
- [x] Renderer изолирован: `contextIsolation: true`, `nodeIntegration: false`.
- [x] Есть базовая тёмная/светлая тема и режим **как в системе** (`theme: system` + `nativeTheme`), сохранение в `userData/settings.json`, меню `Вид -> Тема`.
- [~] Есть главное окно 1920x1080 (FHD) по умолчанию, тулбар, **базовый** видеопредпросмотр (`fluxmedia://` allowlist), DnD/«Открыть», статусбар.
- [~] Есть `Data/`, `Help/`, `FLUXALLOY_TZ.md`, `IMPLEMENTATION_CHECKLIST.md`, [`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md), упаковка `Data/`, `Help/`, ТЗ через `extraResources` (журнал в установщик пока не включаем — только для разработки).
- [x] Windows: `electron-builder` с режимом sign по умолчанию; после перезагрузки проверены `build:unpack`/`winCodeSign`.
- [~] Есть запуск `ffmpeg` для экспорта и снимка кадра; полноценный пайплайн обработки/пресетов/очередей ещё впереди. Движки можно **скачать кнопкой** в UI (Windows) в `userData/bin`, есть проверка `--version` после загрузки.
- [~] Автозагрузка движков **Windows x64** (yt-dlp GitHub + ffmpeg zip gyan.dev), SHA256 опционально через `Data/trusted_hashes.json`; в установщике есть пустой `resources/bin` (`extraResources`), бинарники — подкладка/`userData/bin`.
- [ ] Нет локализации `locales/**`.
- [~] Тестовый раннер: подключён Vitest + `npm run test`/`test:watch`; есть покрытие чистых парсеров и сервисов (`ytdlp-extra-args`, `ytdlp-progress-parser` + постпроцессоры yt-dlp §6.4, `ytdlp-queue-retry`, `ytdlp-download-history`, `ytdlp-download-options` + превью каталога §6.3, `ytdlp-download-output`, `ytdlp-download-queue-persist`, `ytdlp-commands-hints`, `ytdlp-os-pause-support`, `downloads-queue`, `settings-store`, `ffmpeg-export-service`, `ffmpeg-frame-snapshot-service`, `external-process-log`, `support-bundle`, `ipc-channels`, `engine-contract`, `ffmpeg-export-argv`, `ffprobe-summary-export`, `ffprobe-chapters`, `ffprobe-timecode`, `ffprobe-disposition`, `ffprobe-video-fps`, `ffprobe-side-data`, `timeline-ruler`, `waveform-peaks`, `video-frame-snap`).

## Журнал решений и проверок

Не дублируем здесь длинную хронику — смотри **[`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md)**. Новые записи добавляй туда (время до секунд: `YYYY-MM-DD HH:mm:ss`).

## Ближайший TODO спринта

Правило для агента: этот блок — рабочий навигатор ближайшего спринта. После каждой крупной итерации обновлять его: отмечать сделанное, переводить частичное в `[~]`, убирать устаревшее только если оно отражено ниже по §, и добавлять 3–7 следующих конкретных пунктов. Не оставлять блок полностью закрытым. Для UI/UX-сверки по v0 использовать [`docs/UX_REFERENCE_V0.md`](docs/UX_REFERENCE_V0.md).

- [~] §6.1/§6.4: yt-dlp — очередь/лог/история/retry/пауза; `queue.json` без duplicate id; журнал out/err + truncate; retry-счётчики, размеры `of ~ …` и post-processing формат (`ExtractAudio`/remux/convert) попадают в таблицу; дальше — редкие шаблоны логов по полю.
- [~] §6.3: argv whitelist + справочник + превью draft/override `-o`; при необходимости редкие поля.
- [~] §6.1/§4.A: вкладка `Загрузки` — React workspace подключён к живой очереди; добавлены URL-band, queue table, summary cards, status filter chips, progress bars, file/folder actions, удаление строк/очистка готовых/очистка очереди, pause/resume активной yt-dlp строки, встроенный rail основных настроек yt-dlp, live log, история с действиями и pop-out; дальше — перенос редких settings во вкладку и ручная матрица Win 125–200 %.
- [~] §1.1/§4.A/§9: редактор + **инспектор** — HiDPR/topbar/SVG/focus; **`AboutDialog`** / **`IconCircleHelp`**; **`video` `aria-label`**; **`PreviewProbeBody`** + превью ffmpeg; **rail FFmpeg** + **быстрая yt-dlp** (`quickYtdlpUrlHint` → кнопки); seek/снап; waveform ограничен по длительности и размеру файла; **Dolby/HDR side_data** попадает в сведения видеодорожки; дальше — multi-monitor DPI и редкие ffprobe-поля.
- [~] §7.2: trim/crop/rotate/flip; trim IPC валидируется и экспортный `-ss/-t` совпадает с preview; пользовательские пресеты FFmpeg именуются через app-modal без `prompt()`; дальше расширенные фильтры и HW encode.
- [~] §9/§21: расширенные ffprobe (**Dolby Vision/HDR `side_data_list` summary** в деталях видеодорожки); новые IPC через `ipc-channels`, при необходимости логи по окнам; точечные Vitest.

---

## §0. Стратегия выполнения для Cursor

- [x] `FLUXALLOY_TZ.md` существует в корне.
- [x] `IMPLEMENTATION_CHECKLIST.md` существует в корне и используется как рабочий TODO.
- [x] [`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md) — хроника решений и проверок (отдельно от чек‑листа).
- [x] Стек проекта переведён в Electron + TypeScript + React.
- [x] Базовые темы и IPC настроек заведены.
- [x] Локальный Git-репозиторий создан.
- [ ] Перед каждым крупным этапом сверять этот файл и обновлять статусы.
- [ ] После каждого завершённого пункта обновлять чек-лист.
- [ ] Не менять `FLUXALLOY_TZ.md` без прямого запроса пользователя.

### Этапы

1. [~] Инициализация проекта: структура, `.cursor/rules`, Electron + TS + React, темы, пустое главное окно, IPC.
2. [~] Управление зависимостями: Windows-загрузка и опциональный SHA256; bundled `bin`/macOS/Linux — дальше.
3. [~] Главное окно и глобальные элементы: меню/превью частично; сессии, закрытие, Mini Player — дальше.
4. [~] Главное окно обработки: файл/DnD, таймлайн (scrub + in/out), ffprobe-сводка, экспорт MP4/MKV/MOV и snapshot; пресеты/расширенный ffmpeg/batch — дальше.
5. [~] Окно менеджера yt-dlp: очередь, каталог, настройки argv, лог, история, retry/error handling и авто-preview; полноценные сценарии/терминал — дальше.
6. [ ] Терминал и CLI с IntelliSense.
7. [ ] Инспектор, планировщик, конструктор сценариев.
8. [ ] Очистка кэша, история, статистика, утилиты.
9. [~] Логирование и диагностика.
10. [~] Система дистрибуции: electron-builder настроен, но ресурсная/бинарная матрица не готова.

## §1. Общая концепция

- [x] Назначение продукта зафиксировано: графический комбайн yt-dlp + ffmpeg.
- [x] Целевые платформы зафиксированы: Windows приоритет, macOS, Linux.
- [x] Лицензия есть в `LICENSE`.
- [ ] UI ещё не соответствует целевой глубине продукта; есть только каркас.
- [~] Держать основной UX как единый workspace с вкладками `Редактор` / `Загрузки`; логика очереди и обработки остаётся разделённой по сервисам, pop-out окна — вторичный режим.

### §1.1 UI и UX

- [~] Построить главное окно вокруг крупного предпросмотра: базовая зона preview есть, финальная компоновка панелей — дальше.
- [~] Таймлайн под превью (базовый range + синхрон с `<video>`); **масштаб окна scrub (×1…×8)**, **waveform** (≤~180 s и ≤96 MiB ответа) и **линейка времени** по видимому окну (`timeline-ruler`), клик/клавиатура → seek в окне zoom; **снап к кадру** по `probe.videoFpsApprox` (`resolveVideoFpsApprox`: avg/r-дробь, иначе `nb_frames`/duration) или по regex в `detail` дорожки; сводки §9 дополняются строкой FPS; транспорт v0; HiDPI в `main.css`; §7.1 controls сохранены; дальше — ручная матрица DPI и редкие контейнеры без fps/`nb_frames`.
- [~] Панели кодирования справа: **сворачиваемые секции** + **целиком rail FFmpeg** (`ffmpegSettingsRailOpen` в `mainWindowUiPanels`); persist в `settings.json`; полировка и инспектор — дальше.
- [~] Сформировать вкладку `Загрузки` в едином workspace: React слой уже показывает URL-band + живую queue table + summary cards + filter chips + progress bars + управление строками/очисткой + pause/resume + встроенный rail основных yt-dlp настроек + live log + историю + pop-out; старое data HTML окно остаётся pop-out с редкими settings; дальше — ручная DPI-матрица.
- [~] Реализовать прогрессивное раскрытие сложных параметров: `details` для **быстрой yt-dlp-полосы** (**`app-url-summary`**, **`quickYtdlpUrlHint`**: поле URL + **кнопки «Во вкладку» / «Из буфера»** через **`aria-describedby`**) + **rail FFmpeg** (секционные hints + **`aria-describedby`** на компактные кнопки) + **превью команды ffmpeg** (`exportCommandPreview`); общая система панелей — дальше.
- [~] Базовые токены темы есть; тёмная палитра главного окна приближена к v0-референсу.
- [~] Бинарные настройки переводить в **pill switch** с русской подсказкой, а не в select из двух вариантов: первый React-pass сделан для `Без аудио`; дальше — `audio-only`, playlist, auto-open, 2-pass/HW encode по мере появления.
- [~] Довести палитру, типографику, отступы, радиусы и focus-состояния на всех экранах: главный renderer и downloads (токены `--fa-*`/`focus-ring`) сближены; **редактор: focus-ring на полосе быстрого yt-dlp — `app-url-summary`, `app-url-input`, `app-btn` в теле полосы**; **`<video>` предпросмотра — `aria-label` с basename пути**; **окно загрузок: кольцо фокуса на сворачиваемых `summary` (история, журнал, hints) + rail** + **контекстные `aria-describedby` у нижних панелей**; второе окно загрузок — тема синхронна; инспектор: topbar-хром как редактор + `probe*` секции синхронны с главным через `mergeMainWindowUiPanels`.
- [ ] Убрать все литералы интерфейса в локализацию.
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
- [~] Вспомогательный пакет `scripts/cursor-automation`: цикл `@cursor/sdk` по промптам до `MAX_STEPS` (см. README там; не IDE-чат); единый комментированный конфиг `src/sdk-settings.ts`; локальный `STOP=0/1`; retry SDK/transport + быстрых transient error-run, полный повтор любого `status=error` только через `LOOP_RETRY_RUN_ERROR=1`.

### §2.3 Устаревший стек

- [x] Не использовать WinUI/.NET для нового UI.
- [x] Старый `.NET` слой удалён.

## §3. Управление зависимостями (КРИТИЧНО)

- [~] Структура `bin/` (bundled в установке через `extraResources` + `userData/bin`); установка через UI-загрузку на Win; в репозитории бинарники не коммитятся.
- [x] Определить имена бинарников по платформам: `ffmpeg`, `ffprobe`, `yt-dlp`.
- [x] Реализовать поиск bundled бинарников в `process.resourcesPath`.
- [x] Реализовать fallback на пользовательские пути из настроек.
- [x] Реализовать проверку `--version` для каждого движка.
- [x] Реализовать статус движков в main: отсутствует / проверяется / готов / ошибка.
- [x] Реализовать IPC: получить статус движков.
- [x] Реализовать IPC: загрузка движков + прогресс (`fluxalloy:engines-download`, `fluxalloy:engines-progress`).
- [~] Первый запуск: кнопка «Скачать движки» при отсутствии бинарников; отдельное модальное окно ТЗ — не сделано.
- [x] Скачивание `yt-dlp` (GitHub `latest` для Win `.exe`).
- [x] Скачивание `ffmpeg`/`ffprobe` из zip gyan.dev essentials в `userData/bin`.
- [x] Прогресс загрузки в статусбар (проценты по `Content-Length` где есть).
- [~] SHA256: проверка при **непустых** полях в `trusted_hashes.json`; пустые поля = пропуск (dev).
- [x] `Data/trusted_hashes.json` с `schema` и веткой `windows-x64`.
- [x] Формат `trusted_hashes.json` для Win-x64 + совместимость с плоскими полями.
- [~] Редактирование доверенных хешей без перекомпиляции: через `extraResources`/копию `Data/trusted_hashes.json`; авто-обновление файла из сети не делалось.
- [ ] Настройки: кнопка «Проверить обновления».
- [x] Настройки: ручной override путей к движкам.
- [~] UI: показать версии движков в статусбаре — пока только краткая сводка (готовы / не найдены / ошибка).

## §4. Главное окно и глобальные элементы

### §4.A Разделение ролей окон

- [~] Главное окно существует и сфокусировано на preview/ffmpeg обработке; верхний toolbar сокращён до основных действий, FFmpeg-настройки вынесены в правую сворачиваемую панель.
- [~] Главное окно стало единым workspace: `Редактор` остаётся ffmpeg/preview центром, `Загрузки` — основная вкладка yt-dlp; pop-out окно загрузок пока сохраняет полный log/history/settings rail.
- [~] Пункт меню «Менеджер загрузок (yt-dlp)…» + IPC открытия pop-out; главный topbar переключает встроенную вкладку `Загрузки`.
- [~] Отдельное BrowserWindow под менеджер: HTML + очередь/лог/история/settings yt-dlp §6; v0-компоновка: table + **под ней** вертикальный блок история→журнал + правый settings rail; persist раскрытия секций rail/log/history (**автораскрытие журнала при старте строки не перетирает** сохранённое «свёрнут» в `settings`); без React.

### §4.B Единая зона источника

- [x] Меню/кнопка «Открыть файл» (диалог → `fluxmedia`).
- [x] Drag-and-Drop локального файла (`getPathForFile` → IPC `grantPath`).
- [ ] Drag-and-Drop папки, если применимо.
- [~] Поле URL + «Из буфера» + глобальный Ctrl/Cmd+V (вне текстовых полей) отправляет текст в окно загрузок; дальше — сценарии без ручного окна.
- [x] Открытое второе окно принимает URL/текст, добавляет строки в очередь и запускает yt-dlp через main.
- [~] Опция: одиночная загрузка в рабочую папку и открыть в обработке (есть авто-open в preview после успеха; полноценная цепочка download→ffmpeg — позже).

### §4.C Прочее

- [~] Стартовый размер главного окна 1920×1080 (FHD) на подходящем дисплее; на меньших экранах fallback от размера дисплея и `min*` из `scaleFactor` (`src/main/window-hidpi.ts`); сохранённые bounds важнее.
- [~] Проверить адаптивность и DPI: окно yt-dlp + главное + инспектор — общий helper `window-hidpi` для `displayMatching`/`min*`; renderer — точечный @media для `app-topbar`/`app-toolbar`/`app-icon-btn`; полная ручная матрица 100–200% — позже.
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
- [~] Добавить единый набор иконок: топбар редактора (folder + **rotate-ccw/cw + scissors v0** + **снимок/экспорт/отмена/облако (`EDITOR_TOPBAR_ACTION_ICONS`)** + **sun/moon (`EDITOR_THEME_ICONS`)**, `circle-help`/загрузки из shared) + **окно загрузок** + **вкладки** + транспорт + очередь yt-dlp + **инспектор §9**: `folder-open`/`refreshCw`/`circle-help`/тема — **общий `IconCircleHelp` из shared**, **диалог «О программе» — общий компонент `AboutDialog`**; при необходимости дальнейшее выравнивание панелей.

### §4.1 Запоминание настроек

- [x] `settings.json` для темы.
- [~] Последний открытый локальный файл (`lastOpenedSourcePath`) + мягкий restore превью при старте + геометрия main/downloads в `settings.json`; без полного session.json.
- [x] Сохранять размеры/позиции окон.
- [~] Сохранять раскрытые панели: главное окно + окно §9 (**push** снимка `mainWindowUiPanels` после сохранения; IPC только main/inspector + preload whitelist) + yt-dlp (`downloadsWindowUiPanels`, **toggle-сохранение только от жеста пользователя** — не при программном открытии журнала); FFmpeg-секции только в редакторе (`ffmpegSettingsRailOpen` + секции §7), `probe*` — shared с инспектором.
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

- [~] Отдельное окно загрузок (data HTML + свой preload IPC).
- [x] Многострочное поле URL.
- [x] Добавление распознанных строк в простую очередь (таблица в том же документе).
- [x] Drag-and-Drop URL/текста на поле ввода и на свободную область окна загрузок (не перехватываем drop на `textarea`/`select`/текстовых `input`).
- [~] Вставка из главного окна (меню, поле URL, Ctrl+V) → merge в очередь.
- [~] Таблица: имя (хост+путь), ссылка; колонки Формат/Размер/Прогресс/Скорость/ETA; **Прогресс** — полоска + числовой % (v0), зелёный 100% при «Готово»; `progress` суммарная строка; icon-only действия (shared lucide); `queue.json` §4.1 с дедупликацией id при restore; format/size из `[info]` и post-processing строк yt-dlp (`ExtractAudio`, remux, convert); дальше — редкие шаблоны логов.
- [~] Старт всей очереди (последовательно, только «Ожидание»).
- [x] Старт отдельной строки.
- [~] Отмена текущего yt-dlp (SIGKILL процессу spawn).
- [~] Пауза/продолжение где возможно: SIGSTOP/SIGCONT на POSIX; Windows показывает недоступность.
- [x] Удаление строки.
- [x] Reorder (вверх/вниз).

### §6.2 Настройки скачивания

- [~] Выбор формата (белый список пресетов `-f`: по умолчанию yt-dlp / merge `bv*+ba/b` / `best`).
- [~] Выбор качества (только через те же пресеты; без произвольной строки `-f`).
- [~] Аудио-only (`-x --audio-format best`; ffmpeg должен быть доступен yt-dlp; без выбора кодека).
- [x] Субтитры (пресет §6.2: выкл. / `--write-subs` / `--write-auto-subs`; опционально `--sub-langs` без пробелов; persist в settings).
- [~] Плейлист/одиночный ролик (`--yes-playlist` / по умолчанию `--no-playlist`).
- [~] Cookies / профиль браузера: файл Netscape (--cookies) + whitelist `--cookies-from-browser` (Chrome/Edge/Firefox); строка профиля/контейнера yt-dlp в UI — позже.
- [x] `--impersonate`: whitelist chrome / edge / firefox (`ytdlpImpersonate` в settings, без версионирования строкой из UI); дубль `--impersonate` в доп. argv запрещён.
- [x] Шаблон имени `-o` (относительно каталога загрузки, проверка выхода из каталога, `%(ext)s`; `ytdlpFilenameTemplate` в settings).
- [x] Каталог загрузки (выбор папки в окне yt-dlp + `ytdlpDownloadDirectory` в `settings.json`; по умолчанию `userData/downloads/ytdlp`).
- [x] Открыть текущий каталог загрузки из окна yt-dlp.
- [x] Ограничения скорости/ретраи (`--limit-rate`, `--retries`, `--fragment-retries`); профили **повтора строки очереди** при ненулевом exit (`off`/`light`/`normal`/`persistent`).
- [x] Дополнительные параметры в сворачиваемых секциях: экспертные argv/preview/справочник по категориям §6.3 (`optgroup`, карта токенов в main, опциональный `category` в JSON).

### §6.3 Экспертный режим

- [~] Live preview команды yt-dlp (`commandPreview`: реальный каталог `-o` из userData или override только для превью, первый URL очереди или `https://example.com/`; черновик формы до «Сохранить параметры»; пересчёт превью при смене каталога загрузки через диалог, вставке токена из справочника и сбросе шаблона; заглушки `<downloadDir>`/`<url>` только без контекста превью).
- [~] Поле дополнительных аргументов (`ytdlpExtraArgsLine` в settings).
- [x] Подсказки из `Data/ytdlp_commands.json` (группы в UI; при необходимости категория в JSON переопределяет встроенную карту в main).
- [~] Безопасная сборка аргументов без shell (`parseExtraYtdlpArgsLine`, spawn-массив §21).

### §6.4 Прогресс, лог, комбинированный режим

- [~] Парсинг прогресса yt-dlp: процент + скорость + ETA + размер `of …`/`of ~ …` + `fragment X of Y` + `(frag N/M)` без процентов в строке + `Total progress:` + `Downloading video|item X of Y` + вариант `N of M videos` + `Sleeping … seconds` / `Waiting for reconnect` / прочие `[download] Waiting for …` / `Resuming download at byte …` / `Retrying (N/M)` и `Retrying fragment X (N/M)`; прочие редкие строки — по мере заметок.
- [~] Лог stdout/stderr: IPC `fluxalloy-downloads-log` + нижняя панель v0-layout (строки **out/err**, счётчик размера, «Очистить вид», обрезка ~240 KiB через DOM) + сохранение видимого текста через save dialog.
- [x] «Скачать и открыть»: готовый файл можно открыть/показать в папке или отправить в обработчик FluxAlloy из очереди и истории.
- [x] «Скачать и сразу обработать» (настройка §6.4: после успеха yt-dlp авто-открытие в главном preview, если известен безопасный путь в каталоге загрузок; неуспех авто-открытия пишется в лог строки).
- [~] Обработка ошибок: приоритет текста `ERROR:`; иначе последняя строка stderr; явное завершение по сигналу ОС; `--retries`/`--fragment-retries` yt-dlp + повторы очереди §6.4 (в т.ч. профиль `persistent`) + ручной retry строки; пропуск повторов очереди по тексту (`private video`, HTTP 403/404, DRM, «нет форматов»/unsupported URL, завершённый live/premiere и т.п.) с приоритетом транзиентных сетевых маркеров (408/502/503/504/500/429/таймаут/broken pipe/premature close/signature extraction/rate limit exceeded и т.д.); `classifyYtdlpQueueFailureKind` (+ коды **2** параметры, **100** перезапуск, **101** лимит загрузок, см. апстрим yt-dlp) и суффиксы в статусе строки; код **1** пока только общая ошибка — без отдельной эвристики.
- [x] Пауза/продолжить активный yt-dlp: POSIX SIGSTOP/SIGCONT + IPC + кнопка в окне загрузок; Windows — явный отказ (без Job suspend).
- [x] История загрузок (файл `downloads/history.json`, атомарная запись temp+rename после yt-dlp, IPC, UI, фильтр по исходу, повтор URL в очередь, открытие файла/папки при наличии `outputPath`).

## §7. Главное окно: обработка (ffmpeg)

### §7.1 Основная панель

- [x] Открыть локальный файл (меню + кнопка + DnD).
- [x] Отобразить имя источника (подпись под превью; полный путь в tooltip).
- [~] Видеопредпросмотр: нативные `<video controls>`, без пользовательских skin.
- [~] Play/pause/seek: через `<video>` + синхронизированная полоска позиции (range) под превью + отдельная компактная **полоска транспорта** (skip/±5 с/play/fullscreen/volume) сразу под видео.
- [~] Таймлайн: базовый scrub + маркеры in/out и экспорт сегмента в MP4/MKV/MOV (без полной панели §7.2).
- [x] Маркеры in/out.
- [x] Базовая кнопка «Экспорт».
- [~] Вывод прогресса ffmpeg (процент по `time=`, множитель `speed=`, фрагмент stderr со статистикой кадра; шум баннера/конфига в UI не дублируем — `isFfmpegExportProgressStatusLine`; лог main по-прежнему полный; без отдельного «итого 100%» на успехе).

### §7.2 Панель настроек

- [~] Пресеты обработки (три встроенных пресета libx264 в тулбаре + `ffmpegExportEncodePreset` в settings).
- [~] Контейнер/формат: toolbar + settings поддерживают MP4/MKV/MOV, save dialog добавляет расширение по умолчанию; расширенная панель — позже.
- [ ] Видео кодек.
- [~] Аудио кодек: AAC или без аудио; выбор другого кодека — позже.
- [~] Bitrate/CRF/quality: persisted CRF override, video bitrate mode и AAC bitrate в toolbar/settings; расширенная quality-панель — позже.
- [~] FPS: persisted preset source/24/25/30/50/60 для экспорта.
- [~] Resolution/scale: persisted preset source/480p/720p/1080p с сохранением пропорций.
- [x] Crop: whitelist пресетов 1:1 / 16:9 / 4:3 после rotate/flip и до scale/fps; toolbar + settings + пользовательские пресеты §7.2.
- [x] Trim: маркеры In/Out из таймлайна подставляются в экспорт `-ss/-t`, preview команды совпадает со spawn, IPC payload валидируется.
- [x] Rotate/flip: whitelist −vf transpose/hflip/vflip до scale/fps; toolbar + settings + пользовательские пресеты §7.2.
- [ ] Filters.
- [ ] Audio filters.
- [ ] Subtitles.
- [ ] Metadata.
- [ ] Hardware acceleration.
- [ ] Advanced args.
- [~] Live preview команды ffmpeg: pure helpers в `src/shared/ffmpeg-export-argv.ts` (`buildFfmpegExportPreviewCommand` + `shouldApplyFfmpegExportTrim`), сворачиваемый блок в App.tsx с копированием; маркеры In/Out + probeDurationSec + выбранный контейнер/crop/rotate/flip §7.2 подмешиваются и совпадают с spawn (в т.ч. без `-movflags` для MKV); пользовательские пресеты (persist в settings, переименование/обновление снимка/удаление в тулбаре, имя через app-modal без браузерного `prompt()`); дальше сложные фильтры/HW и т.п.
- [~] Безопасная сборка аргументов без shell injection: ffmpeg-экспорт идёт через `buildFfmpegExportArgv` (массив токенов, без shell); валидация значений в main `parse*`-хелперах.

### §7.3 Пакетная обработка

- [ ] Режим batch как отдельный режим, не основной экран.
- [ ] Таблица файлов.
- [ ] Добавить файлы/папки.
- [ ] Параллелизм.
- [ ] Очередь статусов.
- [ ] Сводка ошибок.

### §7.4 Комбинированный режим

- [ ] URL на обработке отправляется в yt-dlp или разовый сценарий по настройке.
- [~] Скачанный файл можно вручную отправить как источник из очереди/истории yt-dlp; автоцепочка — позже.
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

- [ ] Окно терминала/CLI внутри Electron.
- [ ] PATH на bundled `bin`.
- [ ] Разрешить только безопасные инструментальные команды/префиксы.
- [ ] Подсказки из `Data/ffmpeg_commands.json`.
- [ ] Подсказки из `Data/ytdlp_commands.json`.
- [ ] Подстановка текущего файла/превью.
- [ ] История команд.
- [ ] Логирование команд и результата.

## §9. Инспектор видеофайлов

- [x] Запуск ffprobe: grant-пути (IPC); сводка + таблица дорожек под превью и в отдельном окне `#inspector` §363 (`inspector-window.ts`, `windowBounds.inspector`).
- [x] Сводка: контейнер, длительность, bitrate (строка под превью + tooltip длинного имени формата).
- [x] Таблица дорожек под превью и в отдельном окне (`tags`, битрейт/`disposition`, видео `pix_fmt`/SAR/DAR + `color_*`, контекстное меню).
- [x] Главы (`-show_chapters`, таблица под превью + TXT/HTML сводка).
- [x] JSON ffprobe: сворачиваемый блок под превью (просмотр/копирование/файл; отдельная вкладка не требуется).
- [x] Копирование JSON (форматированный текст в буфер); сохранение в файл через IPC/main (`save-text-dialog-contract`).
- [x] Сохранение TXT/HTML (сводка инспектора через `saveTextWithDialog`, генераторы в `ffprobe-summary-export`).
- [x] Контекстные действия из таблиц (ПКМ по строке дорожки / главы → копирование в буфер через preload).

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

- [ ] Категории кэша.
- [ ] Подсчёт размеров.
- [ ] Выборочная очистка.
- [ ] Подтверждение опасных действий.
- [ ] Очистка временных файлов загрузки/обработки.

## §13. История и статистика

- [ ] Журнал задач.
- [ ] Фильтры.
- [ ] Повторить загрузку.
- [ ] Повторить обработку.
- [ ] Недельная сводка.
- [ ] Экспорт истории.

## §14. Контекстное меню Windows

- [ ] Регистрация HKCU пунктов.
- [ ] «Открыть в FluxAlloy».
- [ ] Quick MP4.
- [ ] Ограничение на видеофайлы/ассоциации.
- [ ] Удаление регистрации.
- [ ] Эквиваленты/отсрочка для macOS/Linux зафиксировать в чек-листе.

## §15. База знаний и подсказки

- [~] Файлы `Help/*.md` есть.
- [ ] Viewer внутри приложения.
- [ ] Оглавление.
- [ ] Поиск.
- [ ] Открытие статей из подсказок.
- [ ] Tooltips на ключевых контролах.
- [ ] EN-локализация статей или политика fallback.

## §16. Аппаратное ускорение

- [ ] Диагностика GPU.
- [ ] Определение доступных кодировщиков.
- [ ] Auto mode.
- [ ] Manual mode.
- [ ] NVENC.
- [ ] AMF.
- [ ] QSV.
- [ ] VideoToolbox для macOS.
- [ ] VAAPI/прочее для Linux по возможности.
- [ ] Индикатор `[АВТО]`.
- [ ] Режим экономии CPU/threads/priority.
- [ ] Кнопка «Оценить».

## §17. Дополнительные утилиты

- [~] Меню утилит: подменю «Инструменты → Открыть папку…» с whitelist каталогов (`diagnostics-paths`); `enabled` пересчитывается при фокусе окна и после изменения путей.
- [ ] Извлечь кадры.
- [ ] Конвертер/служебные операции по ТЗ.
- [~] Открыть папки ресурсов/логов: меню + IPC `fluxalloy:diagnostics-open-folder` (userData, logs, ytdlpDownloads, userBin, bundledBin, resources); в «О программе» — кнопки папки логов, main.log и Support ZIP (`fluxalloy:diagnostics-open-main-log`, `fluxalloy:diagnostics-create-support-zip`); отдельное окно настроек — позже.
- [ ] Диагностические команды.

## §18. Логирование и диагностика

- [~] Выбрать библиотеку: пока используется собственный `logger-service` (без зависимостей); решение про `electron-log`/`pino` — позже.
- [~] Логи main: `logInfo/logWarn/logError` пишут в `userData/logs/main.log` с timestamp/scope; уровни `info/warn/error`.
- [~] Логи renderer: `window.fluxalloy.log.send` через IPC `fluxalloy:log-renderer` + перехват `error`/`unhandledrejection` в `main.tsx`; канал закреплён за main window, ограничен token bucket и чистит control chars.
- [x] Логи внешних процессов stdout/stderr: yt-dlp, ffmpeg export/snapshot, ffprobe через общий sanitizer без полного argv.
- [~] Ротация по размеру: один backup `main.log.1` при превышении 1 MiB.
- [~] Prune старых диагностических файлов: на старте чистятся crash dumps старше 30 дней, последние 20 сохраняются; архивы `logs/sessions/session-*.log` — не старше ~90 суток и не более ~25 файлов.
- [~] Crash handler: `process.on('uncaughtException'|'unhandledRejection')` регистрируется на старте main до `app.whenReady`; после ready показывает диалог ошибки с деталями.
- [x] Диалог ошибки: кратко + детали.
- [x] Копировать детали.
- [x] Открыть лог.
- [x] Support ZIP: `diagnostics.txt`, `main.log`, `main.log.1`, `session.log`, последние crash dumps, версия, ОС.

## §19. Система установки и дистрибуция

- [x] `electron-builder.yml` есть.
- [x] `npm run build:win` проходит.
- [x] `npm run build:unpack` проходит.
- [~] `Data/`, `Help/`, `FLUXALLOY_TZ.md` добавлены в `extraResources`.
- [~] `bin/` в `extraResources`: пустой каталог из репозитория; готовые бинарники подкладываются локально перед сборкой (в Git не хранятся).
- [ ] Настроить нормальную иконку приложения вместо placeholder/default.
- [ ] Windows NSIS: проверить installer вручную.
- [ ] Windows portable/zip target.
- [ ] macOS dmg/zip.
- [ ] Linux AppImage/deb/tar.
- [ ] Подпись Windows — отдельное решение.
- [ ] Подпись/notarization macOS — отдельное решение.
- [x] Временный `win.signAndEditExecutable: false` снят после перезагрузки; `build:unpack`/`winCodeSign` проходят с поведением electron-builder по умолчанию.

## §20. Пресеты

- [ ] Формат пользовательских пресетов.
- [ ] Папка `Presets`.
- [~] Системные пресеты: три встроенных libx264 режима в коде/UI; отдельный каталог/импорт/экспорт пресетов — позже.
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
- [~] Unit tests для чистых модулей: `tests/main/*` — перечисленные парсеры/сервисы; `tests/shared/ipc-channels` — уникальность строк каналов; `tests/shared/engine-contract` — порядок/уникальность `ENGINE_IDS`; `tests/shared/ffmpeg-export-argv` — pure builder и preview placeholders; `tests/shared/ffprobe-summary-export` — текст/HTML сводки §9; `tests/shared/ffprobe-chapters`, `ffprobe-timecode`, `ffprobe-disposition`, `ffprobe-video-fps`, `ffprobe-side-data`, `timeline-ruler`, `waveform-peaks`, `video-frame-snap`, `lucide-downloads-icons`. Дальше — расширять `src/shared/*` контрактами под остальные IPC и точечные тесты при появлении runtime-констант.
- [x] Выбрать Vitest/Jest: Vitest подключён (`npm run test`/`test:watch`, `tsconfig.tests.json`).
- [ ] Добавить e2e smoke позже.
- [~] Комментарии на русском для публичных API и сложной логики: базовые комментарии добавлены; дальше писать чуть развёрнутее, чтобы следующему проходу агента было понятно «зачем» и «где границы», не только «что делает строка».
- [ ] Не использовать shell string для внешних процессов; только args arrays.

## §22. Ожидаемый результат

- [x] `npm run check` проходит.
- [x] `npm run build` проходит.
- [x] `npm run build:win` проходит.
- [x] `npm run dev`: после перезагрузки PATH подхватывает Node/npm без ручной правки сессии (проверено вызовом `node`/`npm` из PowerShell).
- [ ] Рабочий Windows installer с реальными ресурсами.
- [ ] Рабочий portable/zip.
- [ ] macOS артефакты.
- [ ] Linux артефакты.
- [x] Версия в «О программе» (вместе с Electron/Chromium/Node).
- [~] Приёмочный сценарий: открыть файл -> preview -> экспорт/отмена -> открыть файл/показать в папке/вернуть в preview/скопировать путь; ручной e2e smoke в packaged-сборке ещё нужен.
- [~] Приёмочный сценарий: URL -> yt-dlp -> открыть/показать файл / авто-в обработчик (флаг) -> дальше экспорт ffmpeg; полный headless «скачал и перекодировал» — позже.
