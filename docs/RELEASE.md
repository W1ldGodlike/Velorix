# FluxAlloy Release Checklist

Практический чеклист перед сборкой и публикацией приватного/внутреннего релиза.

## 1. Чистота репозитория

```powershell
git status
npm run check
npm run build
npm run audit:moderate
```

**Важно:** **`npm run build`** делает только typecheck + `electron-vite build` — **не** наполняет проектный `bin/` и **не** запускает **`engines:doctor`**. Полный Windows-цикл с движками и smoke-упаковкой (`electron-builder --dir`) — **`npm run check:release`** (ниже) или шаги из §2.

Полный предрелизный прогон на Windows (подготовка `bin/`, **`engines:doctor`** — тот же набор, что после prepare в CI: verify + SHA + версии, `build`, smoke `electron-builder --dir`, затем `npm audit`):

```powershell
npm run check:release
```

После успешного завершения шага `pack:dir` в корне репозитория появится распакованное приложение **`dist/win-unpacked/`** для быстрого ручного smoke (см. §4). Сразу после этого **`npm run check:release`** вызывает **`npm run verify:win-unpacked`** — автоматическая проверка: `FluxAlloy.exe`, непустые `resources/bin/{yt-dlp,ffmpeg,ffprobe}.exe`, `resources/FLUXALLOY_TZ.md`, `resources/Data/trusted_hashes.json`, каталог `resources/Help/` (без запуска приложения). Пропуск: `FLUXALLOY_SKIP_PACK_VERIFY=1`.

`npm run check` включает:

- ESLint;
- TypeScript для main/web/tests;
- Vitest;
- `npm run check:trusted-hashes` — структура `Data/trusted_hashes.json` (локально: неизвестные ключи — предупреждение по умолчанию; **`FLUXALLOY_TRUSTED_HASHES_STRICT_UNKNOWN=1`** — ошибка; **`FLUXALLOY_TRUSTED_HASHES_REQUIRE_SHA256_HEX=1`** — непустые хеши только 64 hex). В GitHub Actions `ci` обе строгие переменные включены на job;
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

В `windows-x64` можно задавать хеши архивов FFmpeg (как раньше) и отдельно `ffmpeg.exe` / `ffprobe.exe` для проверки уже извлечённых бинарников (bootstrap, CI, загрузка в `app-data/bin` из main).

Заполнить три exe-хеша после свежего `engines:prepare:win`:

```powershell
npm run engines:report-hashes
npm run engines:report-hashes -- --json
npm run engines:report-hashes -- --versions
npm run engines:report-hashes -- --json --versions
```

Второй вариант выводит JSON с ключами `yt-dlp.exe`, `ffmpeg.exe`, `ffprobe.exe` — вручную перенесите значения в `Data/trusted_hashes.json` → `windows-x64`. Флаг `--versions` печатает первую строку версии каждого exe (как второй проход в `engines:doctor` и лог `engines:verify-bundled` в CI при `GITHUB_ACTIONS`).

Локально повторить вывод версий из verify: `FLUXALLOY_LOG_ENGINE_VERSIONS=1` и `npm run engines:verify-bundled`.

Справка по флагам: `npm run engines:verify-bundled -- --help`, `npm run engines:report-hashes -- --help`, `npm run engines:prepare:win -- --help`, `npm run engines:prepare:win:force -- --help`, `npm run check:trusted-hashes -- --help` (комплекс **`engines:doctor`** — это три npm-скрипта подряд, отдельного `--help` нет).

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

Один проход под полные Windows-артефакты (подготовка `bin/`, **`engines:doctor`**, vite build, затем `electron-builder --win` без лишнего второго `prepare` от lifecycle `prebuild:win`):

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

**Куда кладётся `--dir`:** и **`npm run pack:dir`**, и **`npm run build:unpack`** (оба через `electron-builder --dir`) формируют распакованное приложение в **`dist/win-unpacked/`** на Windows (`directories.output` в `electron-builder.yml`; каталог `dist/` в `.gitignore`). Перед этим **`bin/`** должен быть заполнен (`engines:prepare:win` / `release:win*`), иначе в пакет не попадут bundled-движки.

`npm run build:win` формирует NSIS, portable и zip (`electron-builder`: `nsis`, `portable`, `zip`). Перед скриптом npm выполняет **`prebuild:win`** → `engines:prepare:win`. Команды **`release:win`** / **`release:win:force`** вызывают `npm run build` (не `build:win`), поэтому после уже сделанного prepare **`prebuild:win` не срабатывает повторно**.

Локально без авто-поиска сертификата подписи (часто быстрее, если CSC не настроен):

```powershell
$env:CSC_IDENTITY_AUTO_DISCOVERY = 'false'
npm run build:win
```

Перед публикацией пройдите **ручной smoke** (не заменяет `verify:win-unpacked` / `smoke:packaged-release`):

1. В приложении: **Настройки → Зависимости → Ручной smoke Windows (pack:dir)** — чеклист с копированием (тот же текст в Support ZIP как `winPackagedSmoke:`).
2. Запустите **`dist/win-unpacked/FluxAlloy.exe`** (не `npm run dev`).
3. Отметьте шаги: движки в статусбаре, редактор + загрузки + снимок + экспорт + база знаний + Support ZIP.
4. Убедитесь, что в логах и артефактах нет секретов (`.env`, токены).

Краткий список (дубль UI):

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

**Настройки репозитория (разово):** _Settings → Actions → General_ — разрешить **Actions** (например _Allow all actions and reusable workflows_ или политика организации); для PR из форков при необходимости включить одобрение первого запуска (_Fork pull request workflows_). Обновления npm и GitHub Actions для зависимостей CI приходят через **Dependabot** (`.github/dependabot.yml`); при отсутствии PR от бота проверьте _Settings → Code security and analysis → Dependabot version updates_.

**Письма «Run failed / No jobs were run»:** это не обязательно падение `npm run check`. Статус _No jobs were run_ значит, что workflow стартовал, но **ни один job не был поставлен в очередь** (например несовпадение триггера, политика форка или редкие граничные случаи GitHub). Смотреть в UI: есть ли job **`check`** и какое **Event** (_push_ / _pull_request_ / _workflow_dispatch_).

Перед push:

```powershell
git log --oneline -5
git status
```

После push убедиться, что GitHub Actions `ci` зелёный. Тот же workflow можно запустить вручную: **Actions → `ci` → Run workflow** (`workflow_dispatch`).

Workflow `ci` на Windows: `actions/checkout` с `fetch-depth: 1`; `permissions: contents: read`; `concurrency` с `cancel-in-progress` для ветки; на job заданы **`FLUXALLOY_TRUSTED_HASHES_STRICT_UNKNOWN=1`** и **`FLUXALLOY_TRUSTED_HASHES_REQUIRE_SHA256_HEX=1`** (строгая проверка `Data/trusted_hashes.json` внутри `npm run check`); кэш **`%LOCALAPPDATA%\electron\Cache`** и **`%LOCALAPPDATA%\electron-builder\Cache`** (по `package-lock.json`); кэш `bin/`; `engines:prepare:win`; **`npm run engines:doctor`** (verify + SHA256-строки в лог + `--versions`; в verify при `GITHUB_ACTIONS` или `FLUXALLOY_LOG_ENGINE_VERSIONS` — первая строка версии каждого exe); `npm run build`; `npm run pack:dir` (`electron-builder --dir`) — проверка конфигурации упаковки без полного NSIS/portable/zip.

На runner после `pack:dir` появляется **`dist/win-unpacked/`** (см. §4), затем отдельные шаги CI: **`verify:win-unpacked`**, **`smoke:packaged-app`**, **`smoke:packaged-ffprobe`** (lavfi-клип + JSON probe и registry smoke), **`smoke:packaged-ffmpeg`** (`-version` + `-encoders`), **`smoke:packaged-ytdlp`** — тот же набор, что в **`npm run smoke:packaged-release`** / `check:release`, но с отдельными логами при падении. Workflow **не** загружает `dist/win-unpacked/` в Artifacts — только проверка успешности шагов.
