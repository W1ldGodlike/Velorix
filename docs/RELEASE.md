# FluxAlloy Release Checklist

Практический чеклист перед сборкой и публикацией приватного/внутреннего релиза.

## 1. Чистота репозитория

```powershell
git status
npm run check
npm run build
npm run audit:moderate
```

Полный предрелизный прогон на Windows (подготовка `bin/`, `engines:verify-bundled`, `build`, smoke `electron-builder --dir`, затем `npm audit`):

```powershell
npm run check:release
```

`npm run check` включает:

- ESLint;
- TypeScript для main/web/tests;
- Vitest;
- `scripts/check-no-secrets.mjs` по tracked-файлам.

## 2. Runtime-движки

Windows-релиз должен получать проверенные бинарники в `bin/` до упаковки:

- `bin/ffmpeg.exe`
- `bin/ffprobe.exe`
- `bin/yt-dlp.exe`

Бинарники не коммитятся. Для локальной подготовки:

```powershell
npm run engines:prepare:win
```

Перед релизом записать источник, версию и SHA256 в `Data/trusted_hashes.json` и/или во внутренние release notes. Пустой hash допустим для dev, но не для релиза, который нужно воспроизводимо проверять.

После `npm run engines:prepare:win`:

```powershell
npm run engines:verify-bundled
```

Скрипт проверяет наличие непустых `bin/yt-dlp.exe`, `bin/ffmpeg.exe`, `bin/ffprobe.exe` и, если в `windows-x64` заданы непустые строки, сверяет SHA256. Жёсткий режим (все три **exe**-хеша в JSON обязательны и должны совпасть):

```powershell
$env:FLUXALLOY_ENGINES_STRICT = '1'
npm run engines:verify-bundled
```

В `windows-x64` можно задавать хеши архивов FFmpeg (как раньше) и отдельно `ffmpeg.exe` / `ffprobe.exe` для проверки уже извлечённых бинарников (bootstrap, CI, загрузка в `userData/bin` из main).

Заполнить три exe-хеша после свежего `engines:prepare:win`:

```powershell
npm run engines:report-hashes
npm run engines:report-hashes -- --json
npm run engines:report-hashes -- --versions
npm run engines:report-hashes -- --json --versions
```

Второй вариант выводит JSON с ключами `yt-dlp.exe`, `ffmpeg.exe`, `ffprobe.exe` — вручную перенесите значения в `Data/trusted_hashes.json` → `windows-x64`. Флаг `--versions` печатает первую строку версии каждого exe (как в CI для `engines:verify-bundled`).

Локально повторить вывод версий из verify: `FLUXALLOY_LOG_ENGINE_VERSIONS=1` и `npm run engines:verify-bundled`.

Справка по флагам: `npm run engines:verify-bundled -- --help`, `npm run engines:report-hashes -- --help`, `npm run engines:prepare:win -- --help`.

Быстрая проверка `bin/` после prepare: `npm run engines:doctor` (verify + SHA256-строки + вывод версий).

Таймаут HTTP при скачивании движков (`prepare-engines-win` и загрузка в main из UI): переменная **`FLUXALLOY_ENGINE_DOWNLOAD_TIMEOUT_MS`** (миллисекунды; по умолчанию 600000).

Принудительно обновить движки в `bin/` (игнорировать «уже есть»), например после смены upstream `latest` или подозрения на битый кэш:

```powershell
npm run engines:prepare:win:force
```

Эквивалент: `FLUXALLOY_ENGINES_FORCE=1` и `npm run engines:prepare:win`.

## 3. Лицензии движков

См. [`BUNDLED_ENGINES_LICENSES.md`](./BUNDLED_ENGINES_LICENSES.md).

Важно: код FluxAlloy помечен как `UNLICENSED`, но bundled `ffmpeg` / `ffprobe` / `yt-dlp` имеют собственные лицензии. При распространении установщика нужно соблюдать именно их условия.

## 4. Сборки

Один проход под полные Windows-артефакты (подготовка `bin/`, verify, vite build, затем `electron-builder --win` без лишнего второго `prepare` от lifecycle `prebuild:win`):

```powershell
npm run release:win
```

С перекачкой движков в `bin/` (игнорировать кэшированные exe):

```powershell
npm run release:win:force
```

Отдельные шаги:

```powershell
npm run build:unpack
npm run build:win
```

`npm run build:win` формирует NSIS, portable и zip (`electron-builder`: `nsis`, `portable`, `zip`).

Локально без авто-поиска сертификата подписи (часто быстрее, если CSC не настроен):

```powershell
$env:CSC_IDENTITY_AUTO_DISCOVERY = 'false'
npm run build:win
```

Перед публикацией вручную проверить:

- первый запуск на чистом профиле `userData`;
- статус движков внизу окна;
- открытие локального файла;
- короткий yt-dlp download;
- «В редактор» для скачанного файла;
- snapshot кадра;
- ffmpeg export MP4;
- `О программе -> Support ZIP`;
- отсутствие секретов в артефактах и логах.

## 5. GitHub

Репозиторий: `https://github.com/W1ldGodlike/FluxAlloy`.

Перед push:

```powershell
git log --oneline -5
git status
```

После push убедиться, что GitHub Actions `ci` зелёный.

Workflow `ci` на Windows: `actions/checkout` с `fetch-depth: 1`; `permissions: contents: read`; `concurrency` с `cancel-in-progress` для ветки; кэш **`%LOCALAPPDATA%\electron\Cache`** и **`%LOCALAPPDATA%\electron-builder\Cache`** (по `package-lock.json`); кэш `bin/`; `engines:prepare:win`; `engines:verify-bundled` (печать версий при `GITHUB_ACTIONS` или `FLUXALLOY_LOG_ENGINE_VERSIONS`); `npm run build`; `npm run pack:dir` (`electron-builder --dir`) — проверка конфигурации упаковки без полного NSIS/portable/zip.

