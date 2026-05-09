# FluxAlloy — журнал решений и проверок

Хроника инфраструктурных решений, проверок окружения и заметок, которые не должны раздувать основной **[чек‑лист](IMPLEMENTATION_CHECKLIST.md)**.

**ТЗ [`FLUXALLOY_TZ.md`](FLUXALLOY_TZ.md)** по-прежнему не трогаем без явной договорённости.

## Правило записей

Формат метки времени: **`YYYY-MM-DD HH:mm:ss`** (до секунд).

---

## Записи

- 2026-05-09 17:02:00: повторно проверено окружение перед разработкой. Node/npm/Git доступны через установленный Node.js/Git; `npm install`, `npm run check`, `npm run build`, `npm audit --audit-level=moderate` проходят, уязвимостей `0`.
- 2026-05-09 17:02:00: `dist/`, `out/`, `.eslintcache` — только сгенерированные артефакты проверок/сборки; удалены из рабочей папки после аудита, остаются в `.gitignore`.
- 2026-05-09 17:02:00: `package-lock.json` создан `npm install`; его нужно хранить в Git для воспроизводимой установки, поэтому он больше не игнорируется.
- 2026-05-09 17:11:00: добавлены архитектурные комментарии в `main`, `preload`, `settings-store` и renderer bootstrap. Дальше комментировать чуть подробнее обычного: объяснять назначение модулей, границы IPC, причины проверок/ограничений и неочевидные решения; не пересказывать только совсем очевидный синтаксис.
- 2026-05-09 17:17:00: начат §3. Добавлены `app-paths` и `engine-service`: dev/prod пути ресурсов, bundled/user `bin`, безопасная проверка `ffmpeg`/`ffprobe`/`yt-dlp` через `execFile(..., ['--version'])`, IPC `fluxalloy:engines-status` и краткий статус внизу окна.
- 2026-05-09 17:21:00: выполнен полный проход по комментариям в исходниках и конфигурации. Подробные пояснения добавлены в main/preload/renderer/CSS/build/lint/gitignore/editorconfig; JSON/lockfile не комментируются, потому что формат не поддерживает комментарии.
- 2026-05-09 17:26:00: включён Windows Developer Mode и выдано право `SeCreateSymbolicLinkPrivilege` пользователю `truno`; для текущего процесса право появится после нового входа в Windows/перезапуска сессии.
- 2026-05-09 17:28:00: разрешено оставлять короткие `TODO(...)` прямо в файлах проекта, если уже понятно, что модуль надо доработать позже. Формат: кратко, с привязкой к разделу ТЗ, без длинных планов вместо чек-листа.
- 2026-05-09 17:28:30: правило на будущее — в этом журнале писать дату и время до секунд в формате `YYYY-MM-DD HH:mm:ss`.
- 2026-05-09 17:44:44: после перезагрузки ПК проверено окружение без ручного PATH: `node` v22.22.0, `npm` 11.12.1, `git` 2.54; `whoami /priv` показывает `SeCreateSymbolicLinkPrivilege` (в колонке состояния для этой оболочки — `Disabled`, это нормально для токена до явного enable в процессе).
- 2026-05-09 17:44:44: убран временный `win.signAndEditExecutable: false` из `electron-builder.yml`; `npm run build:unpack` проходит: winCodeSign распаковывается, выполняется `signing with signtool.exe` для `FluxAlloy.exe`.
- 2026-05-09 17:46:19: Git не делал коммит без автора (`Author identity unknown`). Для этого репозитория локально выставлено `git config user.name truno` и `git config user.email truno@local.fluxalloy` (без `--global`). Перед пушем на GitHub лучше заменить почту на свою: `git config user.email "ты@example.com"` (при необходимости поправить и `user.name`).
- 2026-05-09 17:54:43: крупный шаг §3 + §4.B + база §7. Добавлены `fluxmedia`-протокол с allowlist, IPC открытия файла (`dialog`/`grantPath`), DnD через `webUtils.getPathForFile`, `<video>` в превью, прогресс IPC загрузки движков, `extract-zip`, `trusted-hashes-store` и расширенный формат `Data/trusted_hashes.json` (`schema`, `windows-x64`). Отдельное окно первого запуска и macOS/Linux-загрузчики пока не делались — не запускать `prettier .` по репозиторию без исключений: случайно трогает `FLUXALLOY_TZ.md`.
- 2026-05-09 20:10:44: раздел «Журнал решений и проверок» вынесен из `IMPLEMENTATION_CHECKLIST.md` в этот файл (`IMPLEMENTATION_JOURNAL.md`): чек-лист остаётся про статусы по § и спринту, хроника — отдельным потоком.
- 2026-05-09 20:13:15: проверка репозитория на мусор: `dist/`, `out/`, `node_modules` в рабочей копии нет, в Git не трекаются (как и должно). Удалены неиспользуемые заготовки `src/renderer/src/assets/electron.svg` и `wavy-lines.svg` (не импортировались). В `.gitignore` добавлены `Thumbs.db`, `Desktop.ini`, `.idea`, `*.swp`.
- 2026-05-09 20:20:25: связка §7 + §4.1 — `applyTheme` больше не затирает `cachedSettings` целиком; `ffprobe-service` + IPC `fluxalloy:media-probe` (только `isGrantedMediaPath`); таймлайн под `<video>`; `lastOpenedSourcePath` и restore при старте; второе окно `downloads-window` (data HTML-заглушка); поле URL и буфер в UI; сохранение последнего файла после диалога/меню/`grantPath`.
- 2026-05-09 20:28:02: окно yt-dlp — очередь URL в main (`downloads-queue`), второй preload `downloadsWindow.mjs`, меню Ctrl+Shift+V, глобальная вставка ссылки в главном окне; статусбар — первая строка `--version` по каждому движку; `resolvePreloadOutFile` для `.mjs` после electron-vite 5.
- 2026-05-09 20:38:48: добавлен изолированный `scripts/cursor-automation` (`@cursor/sdk`, `npm run loop` / `once`, файлы `prompts/`, стоп-файл `STOP`); root eslint игнорирует эту папку (`node_modules` внутри не линтим).
- 2026-05-09 20:42:28: окно yt-dlp — реальный spawn yt-dlp (`ytdlp-download-service`, без shell), очередь последовательная, колонки прогресс/имя, IPC-снимок очереди без reload страницы; вывод в `userData/downloads/ytdlp`; отмена через kill дочернего процесса.
- 2026-05-09 21:05:36: §3 — `engineExecutablePaths` в `settings.json`, приоритет резолва override → bundled → user bin; IPC выбора exe и сохранения; минимальный UI (кнопка + модалка) и пункт меню «Настройки → Пути к движкам»; снапшот для `downloads-queue-runner`, ffprobe и статуса движков.
- 2026-05-09 21:06:43: §6.1 — `startDownloadSingleRow`, IPC `fluxalloy-downloads-start-row`, кнопка «▶» для строк «Ожидание»; общий флаг занятости с «Старт очереди».
- 2026-05-09 21:08:21: §7.1 — маркеры In/Out у превью: индикатор диапазона, кнопки «In/Out здесь» и «Весь клип», синхронизация границ при появлении duration; смена файла — remount `VideoTimeline` по `key`.
- 2026-05-09 21:12:26: §7.1 — базовый экспорт в MP4 (`ffmpeg-export-service`: spawn + массив аргументов, libx264/aac); диалог сохранения, маркеры через `-ss`/`-t`; IPC `export-start`/`export-cancel`/`export-progress` и строка прогресса в статусбаре.
- 2026-05-09 21:14:45: §4.1 — `windowBounds.main/downloads` в `settings.json`, debounced persist при resize/move и flush на `close`; восстановление через `rectifyBoundsForRestore` (fallback на центр основного монитора).
- 2026-05-09 21:19:17: §9 — расширен `ffprobe-service` (битрейт, `tracks`, tooltip формата) и UI под превью; §19 — `bin/.gitkeep` + `extraResources` для пустого `resources/bin` в сборке.
- 2026-05-09 21:20:42: §4.5 — меню «Справка → О программе», IPC `app-about-info`, модалка; §9 — `rawJson` в probe, блок JSON + «Копировать», IPC `clipboard-write-text` (лимит 24 MiB).
- 2026-05-09 21:22:11: §6.4 — `downloads-log-ipc.ts`, стрим строк yt-dlp в окно загрузок (`onLog`, авто-раскрытие `<details>`, лимит буфера в UI).
- 2026-05-09 21:23:40: §7.6 — `ffmpeg-frame-snapshot-service`, IPC `snapshot-frame`, кнопка «Кадр»; §4.2 — диалог закрытия главного окна при экспорте или активной загрузке yt-dlp.
- 2026-05-09 21:26:24: §6.2 — настраиваемый каталог yt-dlp (`ytdlp-download-output.ts`, поле `ytdlpDownloadDirectory` в settings, UI «Выбрать…»/«По умолчанию», IPC в окне загрузок).
- 2026-05-09 21:38:31: §6.1/§6.4 — парсинг stderr yt-dlp: колонка «Прогресс» — процент, скорость и ETA (`parseYtdlpDownloadProgressLine`, `formatYtdlpProgressCell`); разметка ячейки в окне загрузок под длинные строки.
- 2026-05-09 21:41:13: §6.2 — сохраняемый шаблон `-o` (`ytdlpFilenameTemplate`) и пресеты `-f` (`ytdlpFormatPreset`); IPC/preload `getCliOptions`/`setCliOptions`; `resolveSafeYtdlpOutputPattern`; снимок опций для runner (`ytdlp-run-options-sync`).
- 2026-05-09 21:42:07: §7.1 — прогресс экспорта ffmpeg: парсинг `speed=`, склейка stderr по `\r`/`\n`; статусбар показывает множитель после процента (`FfmpegExportProgressPayload.speed`).
- 2026-05-09 21:43:43: §7.2 — три системных пресета libx264 (`balance`/`smaller`/`quality`), `ffmpegExportEncodePreset` в settings, `<select>` в тулбаре, IPC `settings-set-ffmpeg-export-encode-preset`, передача в `runFfmpegExportJob`.
- 2026-05-09 21:45:14: §6.2 — плейлист (`ytdlpDownloadPlaylist` → `--yes-playlist`/`--no-playlist`) и только аудио (`ytdlpAudioOnly` → `-x --audio-format best`, без `-f` пресета); чекбоксы в окне загрузок, расширен снимок `YtdlpRunOptionsSnapshot` и `runYtdlpOnce`.
- 2026-05-09 21:48:01: §6.3 — `ytdlpExtraArgsLine` + `parseExtraYtdlpArgsLine`/`buildYtdlpSpawnArgvTokens`, превью `yt-dlp …` в окне загрузок; блок конфликта `-o`/batch/`@`; раннер берёт `extraArgs` из снимка.
- 2026-05-09 21:49:21: §6.3 — подсказки из `Data/ytdlp_commands.json`: `getYtdlpCommandHints` в main, `commandHints` в payload окна загрузок, сворачиваемый справочник и вставка токена в поле доп. argv с кратким описанием выбранного флага.
