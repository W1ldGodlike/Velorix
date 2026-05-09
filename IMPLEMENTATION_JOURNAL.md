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
- 2026-05-09 21:35:00: связка §7 + §4.1 — `applyTheme` больше не затирает `cachedSettings` целиком; `ffprobe-service` + IPC `fluxalloy:media-probe` (только `isGrantedMediaPath`); таймлайн под `<video>`; `lastOpenedSourcePath` и restore при старте; второе окно `downloads-window` (data HTML-заглушка); поле URL и буфер в UI; сохранение последнего файла после диалога/меню/`grantPath`.
