# FluxAlloy — рабочий чек‑лист реализации

Источник требований: **[`FLUXALLOY_TZ.md`](FLUXALLOY_TZ.md)**. ТЗ не редактировать без явного согласования. Состояние по §, спринту и TODO — **в этом файле**; хронологию решений, проверок окружения и длинные заметки — в **[`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md)**.

## Готовность полного итога

- **Оценка: ~41%**. Рабочее ядро Electron/React, preview/ffmpeg base, расширенный yt-dlp workspace, ffprobe-инспектор, диагностика, CI/release guardrails и тесты уже есть; крупно не закрыты терминал/CLI, сценарии/планировщик, локализация, hardware encode, batch/утилиты, ручной packaged smoke и кроссплатформенная упаковочная матрица.

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
- [ ] Нет локализации `locales/**`.
- [~] Основная вкладка `Загрузки` в React уже закрывает очередь, старт/stop/retry/pause, настройки yt-dlp, каталог/cookies/network, live log, историю и open file/folder; open file/folder/«В редактор» учитывают финальный файл после merge и Windows UTF-8 stdout; pop-out окно оставлено вторичным режимом для редких settings.
- [~] ffprobe-инспектор есть под превью и отдельным окном: дорожки/главы/raw JSON, TXT/HTML export, Dolby/HDR side_data summary, контекстные действия.
- [~] Тестовый раннер: подключён Vitest + `npm run test`/`test:watch`; по последней зелёной проверке `npm run check:quiet` выполняет **42 test files / 411 tests** + валидаторы `trusted_hashes`, нумерации журнала и secrets guard. Покрыты чистые парсеры и сервисы (`ytdlp-extra-args`, `ytdlp-progress-parser` + retry/fixup-постпроцессоры yt-dlp §6.4, `ytdlp-queue-retry`, `ytdlp-download-history`, `ytdlp-download-options` + превью каталога §6.3, `ytdlp-download-output`, `ytdlp-download-queue-persist`, `ytdlp-commands-hints`, `ytdlp-os-pause-support`, `downloads-queue`, `settings-store`, `ffmpeg-export-service`, `ffmpeg-export-resolve-from-settings`, `ffmpeg-frame-snapshot-service`, `external-process-log`, `support-bundle`, `ipc-channels`, `engine-contract`, `ffmpeg-export-argv` (+ §7.2 audio/video filters), `external-url`, `ffprobe-summary-export`, `ffprobe-chapters`, `ffprobe-timecode`, `ffprobe-disposition`, `ffprobe-video-fps`, `ffprobe-side-data`, `ffprobe-stream-duration-detail`, `ffprobe-service`, `timeline-ruler`, `waveform-peaks`, `video-frame-snap`, `lucide-downloads-icons`, `window-hidpi`, `terminal-contract-scenarios`, `terminal-inline-suggest`).

## Журнал решений и проверок

Не дублируем здесь длинную хронику — смотри **[`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md)**. Новые записи добавляй туда (время до секунд: `YYYY-MM-DD HH:mm:ss`).

## Ближайший TODO спринта

Правило для агента: этот блок — рабочий навигатор ближайшего спринта. После каждой крупной итерации обновлять его: отмечать сделанное, переводить частичное в `[~]`, убирать устаревшее только если оно отражено ниже по §, и добавлять 3–7 следующих конкретных пунктов. Не оставлять блок полностью закрытым. Работать крупными блоками; отчёт пользователю — максимально краткий. `docs/UX_REFERENCE_V0.md` использовать только как ориентир для нужных UI-правок, но не держать спринт вокруг v0.

- [~] §19/§3/§17: release/security — CI и локальные сценарии выровнены (strict `trusted_hashes` в Actions, shallow+caches, **`workflow_dispatch`**, prepare→`engines:doctor`→build→`pack:dir` → артефакт **`dist/win-unpacked/`**, `check:release`/`release:win*`, таймауты, NSIS+portable+zip, README/RELEASE/bin README (`predev` vs doctor, `win-unpacked`)/`electron-builder`/`--help`). **Дальше вручную:** непустые SHA в `trusted_hashes.json`, при необходимости `FLUXALLOY_ENGINES_STRICT` в CI, смоук NSIS/portable/zip, подпись Windows.
- [~] §6.1/§6.4: downloads core — очередь, история, лог, retry, pause, output resolving, preview proxy и React-вкладка есть; прогресс/классификация §6.4 расширены (HLS/API/webpage prep, диск/ffmpeg, HTTP 521/522, EOF/SSL); **download→encode:** авто-экспорт ffmpeg после успешного авто-открытия (`…-export` рядом с файлом, настройка §6.4→§7.2); §6.3 справочник argv — вкладка и pop-out: один порядок категорий (`ytdlp-hint-category-order`), поиск/aria и doc-ссылки выровнены; дальше — batch/HW, прочие мелкие расхождения UI.
- [~] §7.2/§7.3/§7.4: обработка — trim/crop/rotate/flip/scale/FPS/bitrate/presets/2-pass + audio gain/normalize, strip metadata/chapters, subtitle copy/mov_text, видеофильтры `yadif`/`hqdn3d`/`deband`/`histeq`/`lut3d` (bundled `.cube`)/`unsharp`/`eq`/`hue`/`noise`/`vignette`/`gblur` есть; дальше — прочие фильтры, HW encode, batch (связка download→encode уже есть).
- [~] §9/§18: ffprobe/диагностика — inspector, TXT/HTML/JSON export, logs, Support ZIP есть; в сводке дорожки — расширенные видео-поля ffprobe + SAR/DAR (кроме тривиального 1:1), `matrix …°`/`rot …°`, при расхождении `avg_frame_rate`/`r_frame_rate` — оба в `detail` (`… / … fps`); при наличии `nb_frames` — компактно в `detail`; субтитры — `codec_tag_string` и `tags.handler_name` (без дубля `title`) в `detail`; аудио — `profile`/`sample_fmt`/N-bit PCM/`codec_tag_string`; при нетривиальном `start_time` — смещение начала дорожки в `detail` (видео/аудио/субтитры); при ненулевом `start_pts` — `pts …@time_base` в `detail`; при отличии от контейнера — `stream.duration` в `detail` (`dur …s`); вложения/прочие — `codec_name` и теги `filename`/`mimetype` в `detail`; видео — нестандартный `pix_fmt` в `detail` (без дубля типичного `yuv420p`/`yuvj420p`); при наличии `tags.encoder` — компактно в `detail` (видео/аудио/субтитры, обрезка ~64 симв.); видео — при `tags.timecode` — `TC …` в `detail`; видео/аудио/субтитры — при `tags.creation_time` — `created YYYY-MM-DD` в `detail` (`formatFfprobeCreationTimeBrief`); видео HDR — компактно `PQ`/`HLG` или `PQ·bt2020`/`HLG·bt2020` в `detail` (`formatFfprobeVideoHdrColorBrief`); SDR — при `color_range` pc/jpeg — `full range` в `detail` (`formatFfprobeVideoFullRangeBrief`); SDR wide — в `detail` склейка не-bt709 `color_primaries`/`color_space` (`formatFfprobeVideoSdGamutBrief`); Support ZIP `diagnostics.txt` — локали, pid/cwd/packaged, primary display (DPI); дальше — crash/e2e smoke; видео/аудио — в `detail` метка `max …` при заметном `max_bit_rate` над номинальным `bit_rate`; прочие точечные поля ffprobe по необходимости.
- [~] §8: терминал/CLI — вкладка Electron, allowlist `ffmpeg`/`ffprobe`/`yt-dlp`, `execFile` без shell, PATH с папкой выбранного движка, подсказки из `Data/ffmpeg_commands.json` + `Data/ytdlp_commands.json`, история сессии и вывод готовы; **argv-токен `__CURRENT_FILE__`** (кнопка «Превью-файл» + подсказка) → подстановка пути с `isGrantedMediaPath`, **лог `main.log`/`session.log`** (`terminal`: blocked / run ok / non-zero); **`logs/terminal-cli.log`** (stderr каждого прогона + блокировки, ротация) → **Support ZIP** `logs/terminal-cli.log`; **подсказки по контексту** — превью видео/аудио поднимает **ffprobe**; **активная главная вкладка** — пока открыта «Загрузки», в боковом списке терминала **yt-dlp** выше ffmpeg/ffprobe (на «Редактор»/«Терминал» — прежняя логика); **сценарные подсказки** — `fullLine` в контракте, `readHints` из JSON, на «Загрузки» — **431** yt-dlp-шаблона (к -F / -g / cookies chrome|edge|firefox / **-J** / **--dump-single-json** / **-v --skip-download** / **--simulate** / **--list-subs** / **--list-extractors** / **--version** / **-4** / **-6** / **--no-cache-dir** / **--flat-playlist -J|-F** / **--no-playlist -F** / **--list-thumbnails** / **--geo-bypass -F** / **--ignore-errors --flat-playlist -J** / **--write-info-json --skip-download** / **--write-description|--write-url-link** / **--check-formats** / **--no-warnings -F** / **--playlist-items 1 -F** / **--extractor-args youtube:player_client=web -F** / **--print** title / duration_string / uploader / id / webpage_url / channel / channel_id / **thumbnail** / **view_count** / **upload_date** / **playlist_title** / **playlist_count** / **filename** / **description** / **categories** / **language** / **extractor** / **playlist_id** / **format_id** / **ext** / **resolution** / **vcodec** / **acodec** / **tags** / **filesize_approx** / **fps** / **is_live** / **live_status** / **availability** / **age_limit** / **like_count** / **comment_count** / **aspect_ratio** / **duration** / **width** / **height** / **tbr** / **abr** / **vbr** / **asr** / **has_drm** / **playable_in_embed** / **channel_url** / **uploader_id** / **was_live** / **media_type** / **release_year** / **filesize** / **format_note** / **subtitles** / **automatic_captions** / **chapters** / **flat-playlist --print title** / **--no-check-certificates -F** / **--write-thumbnail --skip-download** / **--write-auto-sub --skip-download** / **--flat-playlist --print url** / **--write-pages --skip-download** / **--print heatmap** / **--dateafter 20240101 -F** / **--max-downloads 5** / **--match-title trailer -F** / **--write-link --skip-download** / **--sponsorblock-mark all** / **--extract-audio --audio-format mp3** / **--audio-quality 192K --extract-audio** / **--print n_entries** / **--netrc -F** / **--force-generic-extractor -F** / **print channel_follower_count|average_rating|is_private** / **write-all-urls|dump-pages|no-progress**), на «Редактор»/«Терминал» при медиа в превью — **120** ffprobe (в т.ч. **v:0 color** / **v:0 bitrate+fps** / **v:0 sar+dar** / **v:0 field+range** / **v:0 stream tags** handler+encoder / **v:0 nb_frames+duration** / **v:0 profile+level** / **v:0 refs+has_b_frames** / **v:0 count_frames** / **a:0 disposition** / **v:0 pix_fmt+color_space+color_range** / **format start+dur** / **format nb_streams+nb_programs+format_name** / **streams disposition** / **s:1 compact** / **a:0 pcm** / **a:0 profile+bitrate** / **a:1 compact**, **format tags** title+encoder, **streams compact** / **streams+attach** (filename/mimetype), **a:0**/**s:0**/**s:0 tags**/**a:0 language**, **-of json**, **show_error** / **v:0 coded+display** / **format creation_time** / **s:0 disposition** / **v:0 time_base+start_pts** / **a:0 time_base+start_pts** / **v:0 bit_rate+max_bit_rate** / **format filename** / **v:0 stream_tags=rotate** / **a:0 channel_layout+bit_rate** / **format bit_rate** / **a:0 stream_tags title+handler** / **v:0 r_frame_rate** / **format_tags brands** / **s:2 compact** / **v:0 closed_captions+is_avc** / **format_long_name** / **v:0 chroma_location** / **format pretty** / **format flat** / **v:0 packets 5** / **v:0 frames 5** / **-show_program_version** / **a:0 packets 3** / **v:0 stream_tags creation_time** / **format_tags handler_name**) + **30** ffmpeg null/remux/audio/video smoke (**-t 10** / **-frames:v 1** / **-t 5 -c copy** / **-err_detect ignore_err -t 2** / **-vn -sn -t 3** / **-an -sn -t 2** / **-ss 10 -t 2** / **loudnorm summary -t 60** / **scale=320:-1 -t 1** / **-vn -sn -acodec copy -t 3**) с плейсхолдером; Vitest на инварианты сценариев; **inline IntelliSense v1** — argv-строка (до 14 подсказок из merge JSON+сценарии, Tab/↑↓/Home/End, Escape, clamp stale-индекса, `terminal-inline-suggest` + Vitest); **копирование строки из лога** — построчный вывод stdout/stderr + кнопка «Копир.» при hover/focus-visible; далее — полноценный выпадающий список по ТЗ; прочие точечные ffprobe/yt-dlp сценарии по мере необходимости.
- [ ] §10/§11/§15/§16: планировщик, сценарии, база знаний viewer, аппаратное ускорение — крупные продуктовые блоки полного итога.
- [ ] §1.1/§2.2/§5: локализация, выбранный подход к состоянию renderer, контрасты/focus/token audit и ручная DPI/multi-monitor матрица.

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
- [~] UI уже не каркас: есть рабочий editor/downloads workspace и инженерные rail/table/log/history паттерны (v0 используется только как ориентир для нужных UI-правок); до целевой глубины продукта не хватает локализации, базы знаний, терминала/сценариев, HW/batch и ручной DPI-полировки.
- [~] Держать основной UX как единый workspace с вкладками `Редактор` / `Загрузки`; логика очереди и обработки остаётся разделённой по сервисам, pop-out окна — вторичный режим.

### §1.1 UI и UX

- [~] Построить главное окно вокруг крупного предпросмотра: базовая зона preview есть, финальная компоновка панелей — дальше.
- [~] Таймлайн под превью (базовый range + синхрон с `<video>`); **масштаб окна scrub (×1…×8)**, **waveform** (≤~180 s и ≤96 MiB ответа) и **линейка времени** по видимому окну (`timeline-ruler`), клик/клавиатура → seek в окне zoom; **снап к кадру** по `probe.videoFpsApprox` (`resolveVideoFpsApprox`: avg/r-дробь, иначе `nb_frames`/duration) или по regex в `detail` дорожки; сводки §9 дополняются строкой FPS; transport strip и HiDPI в `main.css`; §7.1 controls сохранены; дальше — ручная матрица DPI и редкие контейнеры без fps/`nb_frames`.
- [~] Панели кодирования справа: **сворачиваемые секции** + **целиком rail FFmpeg** (`ffmpegSettingsRailOpen` в `mainWindowUiPanels`); persist в `settings.json`; полировка и инспектор — дальше.
- [~] Сформировать вкладку `Загрузки` в едином workspace: React слой уже показывает URL-band + живую queue table через общий snapshot broadcast + summary cards + filter chips + progress bars + управление строками/очисткой + pause/resume + встроенный rail основных yt-dlp настроек/network/каталога/cookies + pop-out; **«История» и «Живой лог» под строкой таблицы**; при **узкой ширине** rail **не скрывается**, а уходит **под** журнал (`@media (max-width: 1100px)`), якорь **`#downloads-ytdlp-settings-rail`** и кнопка **«К настройкам»**; ошибки действий показываются в статусе вместо тихого no-op; pop-out — редкие/длинные settings; дальше — ручная DPI-матрица.
- [~] Реализовать прогрессивное раскрытие сложных параметров: `details` для **быстрой yt-dlp-полосы** (**`app-url-summary`**, **`quickYtdlpUrlHint`**: поле URL + **кнопки «Во вкладку» / «Из буфера»** через **`aria-describedby`**) + **rail FFmpeg** (секционные hints + **`aria-describedby`** на компактные кнопки) + **превью команды ffmpeg** (`exportCommandPreview`); общая система панелей — дальше.
- [~] Базовые токены темы есть; тёмная палитра главного окна приведена к компактному инженерному стилю, v0-референс больше не является центром спринта.
- [~] Бинарные настройки переводить в **pill switch** с русской подсказкой, а не в select из двух вариантов: общий React `PillSwitch` применён к `Без аудио`, `Весь плейлист`, `Только аудио`, `Открыть после успеха`; **2-pass libx264** во вкладке редактора (rail «Формат», только с видеобитрейтом) + двойной spawn/main + превью двух команд; дальше — HW encode и прочие бинарные настройки по тому же паттерну.
- [~] Довести палитру, типографику, отступы, радиусы и focus-состояния на всех экранах: главный renderer и downloads (токены `--fa-*`/`focus-ring`) сближены; **редактор: focus-ring на полосе быстрого yt-dlp — `app-url-summary`, `app-url-input`, `app-btn` в теле полосы**; **`<video>` предпросмотра — `aria-label` с basename пути**; **окно загрузок: кольцо фокуса на сворачиваемых `summary` (история, журнал, hints) + rail** + **контекстные `aria-describedby` у нижних панелей**; второе окно загрузок — тема синхронна; инспектор: topbar-хром как редактор + `probe*` секции синхронны с главным через `mergeMainWindowUiPanels`.
- [ ] Убрать все литералы интерфейса в локализацию; быстрые editor/downloads labels и action labels вкладки `Загрузки` уже подчистить на русском, но `locales/**` ещё нет.
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
- [x] Drag-and-Drop локального файла (`getPathForFile` → IPC `grantPath`).
- [ ] Drag-and-Drop папки, если применимо.
- [~] Поле URL + «Из буфера» + глобальный Ctrl/Cmd+V (вне текстовых полей) отправляет текст в окно загрузок; дальше — сценарии без ручного окна.
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
- [~] Вставка из главного окна (быстрая URL-полоса, поле вкладки, clipboard action, Ctrl+V в pop-out) → merge в очередь.
- [~] Таблица: имя (хост+путь/ранний title/path basename), ссылка; колонки Формат/Размер/Прогресс/Скорость/**Осталось**; **Прогресс** — полоска + числовой %, зелёный 100% при «Готово»; `progress` суммарная строка; действия старт/retry/pause/delete/file/folder — **во встроенной React-вкладке icon-only** (`app-icon-btn` + те же пути SVG, что `RowIco` в data HTML); `queue.json` §4.1 с дедупликацией id при restore; format/size/title из `[info]`, progress и post-processing строк yt-dlp (`ExtractAudio`, remux, convert); дальше — редкие шаблоны логов.
- [~] Старт всей очереди (последовательно, только «Ожидание»).
- [x] Старт отдельной строки.
- [x] Отмена текущего yt-dlp (SIGKILL процессу spawn) из вкладки и pop-out.
- [~] Пауза/продолжение где возможно: SIGSTOP/SIGCONT на POSIX; Windows показывает недоступность; UI есть во вкладке и pop-out.
- [x] Удаление строки.
- [x] Reorder (вверх/вниз).

### §6.2 Настройки скачивания

- [~] Выбор формата (белый список пресетов `-f`: по умолчанию yt-dlp / merge `bv*+ba/b` / `best`).
- [~] Выбор качества (только через те же пресеты; без произвольной строки `-f`).
- [~] Аудио-only (`-x --audio-format best`; ffmpeg должен быть доступен yt-dlp; без выбора кодека).
- [x] Субтитры (пресет §6.2: выкл. / `--write-subs` / `--write-auto-subs`; опционально `--sub-langs` без пробелов; persist в settings).
- [~] Плейлист/одиночный ролик (`--yes-playlist` / по умолчанию `--no-playlist`).
- [~] Cookies / профиль браузера: файл Netscape (`--cookies`) + whitelist `--cookies-from-browser` (Chrome/Edge/Firefox) доступны во вкладке и pop-out; строка профиля/контейнера yt-dlp в UI — позже.
- [x] `--impersonate`: whitelist chrome / edge / firefox (`ytdlpImpersonate` в settings, без версионирования строкой из UI); дубль `--impersonate` в доп. argv запрещён.
- [x] Шаблон имени `-o` (относительно каталога загрузки, проверка выхода из каталога, `%(ext)s`; `ytdlpFilenameTemplate` в settings).
- [x] Каталог загрузки (выбор папки во вкладке/pop-out + `ytdlpDownloadDirectory` в `settings.json`; по умолчанию `userData/downloads/ytdlp`).
- [x] Открыть текущий каталог загрузки из вкладки/pop-out.
- [x] Ограничения скорости/ретраи (`--limit-rate`, `--retries`, `--fragment-retries`); профили **повтора строки очереди** при ненулевом exit (`off`/`light`/`normal`/`persistent`).
- [x] Дополнительные параметры в сворачиваемых секциях: экспертные argv/preview/справочник по категориям §6.3 (`optgroup`, карта токенов в main, опциональный `category` в JSON).

### §6.3 Экспертный режим

- [~] Live preview команды yt-dlp (`commandPreview`: реальный каталог `-o` из userData или override только для превью, первый URL очереди или `https://example.com/`; черновик формы до сохранения; во вкладке rail — поле argv + вставка токена + preview; pop-out — тот же функционал с длинным справочником; заглушки `<downloadDir>`/`<url>` только без контекста превью).
- [~] Поле дополнительных аргументов (`ytdlpExtraArgsLine` в settings).
- [x] Подсказки из `Data/ytdlp_commands.json` (группы в UI; при необходимости категория в JSON переопределяет встроенную карту в main).
- [~] Безопасная сборка аргументов без shell (`parseExtraYtdlpArgsLine`, spawn-массив §21).

### §6.4 Прогресс, лог, комбинированный режим

- [~] Парсинг прогресса yt-dlp: процент + скорость + оставшееся время (в UI «Осталось»; в сыром логе yt-dlp по-прежнему токен `ETA`) + размер `of …`/`of ~ …` + `fragment X of Y` + `(frag N/M)` без процентов в строке + `Total progress:` + `Downloading video|item X of Y` + вариант `N of M videos` + `Sleeping … seconds` / `Waiting for reconnect` / прочие `[download] Waiting for …` / `Resuming download at byte …` / `Retrying (N/M)` и `Retrying fragment X (N/M)` + подготовка `Downloading m3u8 information` / player API JSON / `Downloading webpage`; прочие редкие строки — по мере заметок.
- [~] Лог stdout/stderr: IPC `fluxalloy-downloads-log` fan-out в главное окно и pop-out; вкладка `Загрузки` показывает live log, очистку и сохранение видимого текста; pop-out сохраняет compact-layout со счётчиком размера и обрезкой DOM.
- [x] «Скачать и открыть»: готовый файл можно открыть/показать в папке или отправить в обработчик FluxAlloy из очереди и истории.
- [x] «Скачать и сразу обработать» (настройка §6.4: после успеха yt-dlp авто-открытие в главном preview, если известен безопасный путь в каталоге загрузок; неуспех авто-открытия пишется в лог строки).
- [x] Опционально после успешного авто-открытия — авто-экспорт §7.2 в соседний файл (`name-export.ext` с суффиксом при коллизии), прогресс в главном окне, итог/ошибка в логе очереди.
- [~] Обработка ошибок: приоритет текста `ERROR:`; иначе последняя строка stderr; явное завершение по сигналу ОС; `--retries`/`--fragment-retries` yt-dlp + повторы очереди §6.4 (в т.ч. профиль `persistent`) + ручной retry строки; пропуск повторов очереди по тексту (`private video`, HTTP 403/404, DRM, «нет форматов»/unsupported URL, завершённый live/premiere, **нет места на диске / errno 28**, **ffmpeg/ffprobe not found**, пустой файл и т.п.) с приоритетом транзиентных сетевых маркеров (408/502/503/504/500/429/**521/522/523/520**, таймаут/broken pipe/premature close/**EOF/SSL handshake**, signature extraction/rate limit exceeded и т.д.); `classifyYtdlpQueueFailureKind` (+ коды **2** параметры, **100** перезапуск, **101** лимит загрузок, см. апстрим yt-dlp) и суффиксы в статусе строки; код **1** по-прежнему без отдельного кода — через текстовые маркеры.
- [x] Пауза/продолжить активный yt-dlp: POSIX SIGSTOP/SIGCONT + IPC + кнопка во вкладке/pop-out; Windows — явный отказ (без Job suspend).
- [x] История загрузок (файл `downloads/history.json`, атомарная запись temp+rename после yt-dlp, IPC, UI во вкладке/pop-out, фильтр по исходу в pop-out, открытие файла/папки при наличии `outputPath`).

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
- [~] Аудио кодек: AAC или без аудио; **громкость аудио** через `-filter:a volume=NdB` (`ffmpegExportAudioGainDb`, шаг 3 дБ, диапазон −24…+24); выбор другого кодека — позже.
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
- [ ] Hardware acceleration.
- [ ] Advanced args.
- [~] Live preview команды ffmpeg: pure helpers в `src/shared/ffmpeg-export-argv.ts` (`buildFfmpegExportPreviewCommand` + `shouldApplyFfmpegExportTrim`), сворачиваемый блок в App.tsx с копированием; маркеры In/Out + probeDurationSec + выбранный контейнер/crop/rotate/flip/filters §7.2 подмешиваются и совпадают со spawn (в т.ч. без `-movflags` для MKV); пользовательские пресеты (persist в settings, переименование/обновление снимка/удаление в тулбаре, имя через app-modal без браузерного `prompt()`); дальше HW/advanced args и т.п.
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

- [x] Окно терминала/CLI внутри Electron.
- [x] PATH на bundled `bin`.
- [x] Разрешить только безопасные инструментальные команды/префиксы.
- [x] Подсказки из `Data/ffmpeg_commands.json`.
- [x] Подсказки из `Data/ytdlp_commands.json`.
- [x] Подстановка текущего файла/превью.
- [x] История команд.
- [x] Логирование команд и результата.
- [~] IntelliSense в строке argv (v1): до 14 подсказок из merge JSON+сценариев, Tab/↑↓/Home/End, Escape, навигация при сужении списка (clamp stale-индекса), `shared/terminal-inline-suggest` + Vitest.

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

- [~] Меню утилит: подменю «Инструменты → Открыть папку…» с whitelist каталогов (`diagnostics-paths`); `enabled` пересчитывается при фокусе окна и после изменения путей; внешние ссылки из renderer/data-окон проходят `openAllowedExternalUrl`/`installExternalNavigationGuard` (`http(s)` only, без `file:`/`javascript:`).
- [ ] Извлечь кадры.
- [ ] Конвертер/служебные операции по ТЗ.
- [~] Открыть папки ресурсов/логов: меню + IPC `fluxalloy:diagnostics-open-folder` (userData, logs, ytdlpDownloads, userBin, bundledBin, resources); в «О программе» — кнопки папки логов, main.log и Support ZIP (`fluxalloy:diagnostics-open-main-log`, `fluxalloy:diagnostics-create-support-zip`); отдельное окно настроек — позже.
- [ ] Диагностические команды/утилиты обслуживания (очистка cache/temp, отчёты по размерам).

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
- [x] `npm run build:win` проходит (последняя проверка до добавления portable/zip целей; для новых целей нужен ручной smoke).
- [x] `npm run build:unpack` проходит.
- [~] `Data/`, `Help/`, `FLUXALLOY_TZ.md` добавлены в `extraResources`.
- [~] `bin/` в `extraResources`: bundled-first каталог с `README.md`; готовые бинарники подкладываются локально/CI через `npm run engines:prepare:win` перед сборкой (в Git не хранятся), скачивание в `userData/bin` остаётся fallback/update; release checklist и лицензии bundled engines — `docs/RELEASE.md` / `docs/BUNDLED_ENGINES_LICENSES.md`; GitHub Actions после `check` гоняет prepare + **`engines:doctor`** со строгой проверкой структуры `trusted_hashes` и логом версий; локально **`check:release`** / **`release:win*`** после prepare тоже через `engines:doctor` (`FLUXALLOY_ENGINES_STRICT=1` — ручной релизный gate для непустых exe-хешей).
- [ ] Настроить нормальную иконку приложения вместо placeholder/default.
- [ ] Windows NSIS: проверить installer вручную.
- [~] Windows portable/zip: в `electron-builder.yml` цели `portable` и `zip` рядом с NSIS; ручной smoke — позже.
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
- [~] Приёмочный сценарий: открыть файл -> preview -> экспорт/отмена -> открыть файл/показать в папке/вернуть в preview/скопировать путь; ручной e2e smoke в packaged-сборке ещё нужен.
- [~] Приёмочный сценарий: URL -> yt-dlp -> открыть/показать файл / авто-в обработчик (флаг) -> дальше экспорт ffmpeg; полный headless «скачал и перекодировал» — позже.
