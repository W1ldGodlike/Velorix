# Velorix Release Checklist

Практический чеклист перед сборкой и публикацией приватного/внутреннего релиза.

## 1. Чистота репозитория

```powershell
git status
npm install
npm run check
npm run build
npm run audit:moderate
```

**Зависимости:** в корне [`.npmrc`](../.npmrc) — `legacy-peer-deps=true` (baseline Electron 42 / Vite 8; канон — `package.json`; lock — `tests/shared/toolchain-baseline-package.test.ts`). Без `.npmrc` при peer-conflict: `npm install --legacy-peer-deps`.

**Toolchain baseline:** на `main` @ `ff89765` (journal **J-1353..1564**); Electron 42 / Vite 8 / TS 6 / ESLint 9 — `package.json`; lock — `tests/shared/toolchain-baseline-package.test.ts`. План toolchain удалён (**J-1559**).

**Dependabot wave 5:** [x] на `main` — журнал **J-1558** (`gh pr close` #4,#6,#7,#11–#15); исторический пункт спринта — [`docs/archive/IMPLEMENTATION_CHECKLIST.OLD.md`](archive/IMPLEMENTATION_CHECKLIST.OLD.md).

**Важно:** **`npm run build`** делает только typecheck + `electron-vite build` — **не** наполняет проектный `bin/` и **не** запускает **`engines:doctor`**. На Linux/CI `electron-vite build` требует плагин **`fix:esm-shim`** в [`electron.vite.config.ts`](../electron.vite.config.ts) (канон — [`electron-vite-build-meta.ts`](../src/shared/electron-vite-build-meta.ts); false-positive `vite:esm-shim` на строке в `renderer-state-approach.ts`). После локального `npm run build` перед `npm run check` / commit — вернуть `src/shared/app-build-info.json` в **`dev`** (`{"buildId":"dev","builtAtUtc":null}`; **J-1386**). Полный Windows-цикл с движками и smoke-упаковкой (`electron-builder --dir`) — **`npm run check:release`** (ниже) или шаги из §2.

Полный предрелизный прогон на Windows (подготовка `bin/`, **`engines:doctor`** — тот же набор, что после prepare в CI: verify + SHA + версии, `build`, smoke `electron-builder --dir`, затем `npm audit`):

```powershell
npm run check:release
```

После успешного завершения шага `pack:dir` в корне репозитория появится распакованное приложение **`dist/win-unpacked/`** для быстрого ручного smoke (см. §4). Сразу после этого **`npm run check:release`** вызывает **`npm run verify:win-unpacked`** — автоматическая проверка: `Velorix.exe`, непустые `resources/bin/{yt-dlp,ffmpeg,ffprobe}.exe`, `resources/VELORIX_NEON_THEME.md`, `resources/Data/trusted_hashes.json`, каталог `resources/Help/` (без запуска приложения). Пропуск: `VELORIX_SKIP_PACK_VERIFY=1`.

`npm run check` (алиас на `npm run check:quiet`, см. `scripts/gate/run-quiet-check.mjs`) включает в том числе:

- ESLint;
- TypeScript для main/web/tests;
- Vitest;
- `npm run check:trusted-hashes` — структура `Data/trusted_hashes.json` (локально: неизвестные ключи — предупреждение по умолчанию; **`VELORIX_TRUSTED_HASHES_STRICT_UNKNOWN=1`** — ошибка; **`VELORIX_TRUSTED_HASHES_REQUIRE_SHA256_HEX=1`** — непустые хеши только 64 hex). В GitHub Actions `ci` обе строгие переменные включены на job;
- `scripts/gate/check-no-secrets.mjs` по tracked-файлам.

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
$env:VELORIX_ENGINES_STRICT = '1'
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

Локально повторить вывод версий из verify: `VELORIX_LOG_ENGINE_VERSIONS=1` и `npm run engines:verify-bundled`.

Справка по флагам: `npm run engines:verify-bundled -- --help`, `npm run engines:report-hashes -- --help`, `npm run engines:prepare:win -- --help`, `npm run engines:prepare:win:force -- --help`, `npm run check:trusted-hashes -- --help` (комплекс **`engines:doctor`** — это три npm-скрипта подряд, отдельного `--help` нет).

Быстрая проверка `bin/` после prepare: `npm run engines:doctor` (verify + SHA256-строки + вывод версий).

Таймаут HTTP при скачивании движков (`prepare-engines-win`, `prepare-engines-unix` и загрузка в main из UI): переменная **`VELORIX_ENGINE_DOWNLOAD_TIMEOUT_MS`** (миллисекунды; по умолчанию 600000). macOS/Linux: `npm run engines:prepare:mac|linux` на целевом хосте (yt-dlp + BtbN ffmpeg tar.xz → `bin/`).

Принудительно обновить движки в `bin/` (игнорировать «уже есть»), например после смены upstream `latest` или подозрения на битый кэш:

```powershell
npm run engines:prepare:win:force
```

Эквивалент: `VELORIX_ENGINES_FORCE=1` и `npm run engines:prepare:win`.

## 3. Лицензии движков

См. [`BUNDLED_ENGINES_LICENSES.md`](./BUNDLED_ENGINES_LICENSES.md).

Важно: код Velorix помечен как `UNLICENSED`, но bundled `ffmpeg` / `ffprobe` / `yt-dlp` имеют собственные лицензии. При распространении установщика нужно соблюдать именно их условия.

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

`npm run build:win` формирует NSIS и zip (`electron-builder`: `nsis`, `zip`; цель **`portable`** не используется — см. ТЗ §19). Перед скриптом npm выполняет **`prebuild:win`** → `engines:prepare:win`. Команды **`release:win`** / **`release:win:force`** вызывают `npm run build` (не `build:win`), поэтому после уже сделанного prepare **`prebuild:win` не срабатывает повторно**.

Локально без авто-поиска сертификата подписи (часто быстрее, если CSC не настроен):

```powershell
$env:CSC_IDENTITY_AUTO_DISCOVERY = 'false'
npm run build:win
```

**Подпись кода (roadmap для публикации за пределами dev-сборки; локальный `pack:dir` или `CSC_IDENTITY_AUTO_DISCOVERY=false` может быть без Authenticode):**

1. Сертификат **Authenticode** (OV/EV) или корпоративный код-подписывающий сертификат; PFX и пароль — вне репозитория.
2. Переменные **`CSC_LINK`** / **`WIN_CSC_LINK`** (путь к сертификату или secure file) и при необходимости **`CSC_KEY_PASSWORD`** на release runner / CI.
3. **electron-builder** по умолчанию подписывает `Velorix.exe` через bundled `winCodeSign` / `signtool.exe` при наличии сертификата; без CSC — см. блок `CSC_IDENTITY_AUTO_DISCOVERY=false` выше.
4. Проверка: `signtool verify /pa /v` по `dist/win-unpacked/Velorix.exe` и артефактам NSIS/zip.
5. Первые публичные сборки: учитывать **SmartScreen** (репутация файла/издателя); timestamp-сервер (RFC3161) в настройках подписи.

Канон — документация Microsoft Authenticode и раздел **Windows** в **electron-builder**; ключи обновлять с `electron-builder.yml` и целевой версией Electron.

Конфиг упаковки: [`electron-builder.yml`](../electron-builder.yml) — `win.target`: **nsis** + **zip** (без `portable`, см. ТЗ §19); `mac`: dmg + `entitlementsInherit` + `notarize: false`; `linux`: AppImage + deb; `publish: null`; **9** inline §19 yaml-комментариев (`getReleaseCodeSigningElectronBuilderYmlComments` в `release-code-signing-roadmap.ts`); signing-ключи — §4/§4.1/§4.2 ниже.

**Дорожные карты подписи (win/linux/mac, канон):** [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts) — clauses в §15 hub (getting-started, about/logging, ffmpeg); `npm run check:help-terminal-hints-docs`; dev `pack:*:dir` / `CSC_IDENTITY_AUTO_DISCOVERY=false` может обходиться без подписи до публикации.

**§19 signing indexed (SDK sprint + diagnostics):** Help §15 hub + `check:help-terminal-hints-docs`; `continue.txt` / `initial.txt` / `agent-contract.txt` — `formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedBlock` / `formatReleaseCodeSigningRoadmapSdkContractSigningIndexedClause`; Support ZIP — `formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine` (`check:release` / `check:platform-packaging-scripts`). **Packaging indexed:** `electron-builder.yml` (**9** §19 yaml comments); `formatReleaseCodeSigningRoadmap*ElectronBuilder*` + `formatReleaseCodeSigningRoadmapElectronBuilderYmlCommentsDiagnosticLine` (J-1520..1539).

Support ZIP (`diagnostics.txt` → `unpackedLayout:`, `terminalHints:`) на любой ОС перечисляет layout win/linux/macos unpacked (present/missing) и dev §8 terminal guards — см. [about-support-logs](../Help/ru/about-support-logs.md), [logging-and-diagnostics](../Help/ru/logging-and-diagnostics.md).

После `pack:dir` на Windows: **`npm run verify:win-unpacked`**. Ручная приёмка UI — после NEON rebuild (renderer stub).

### 4.1 Linux (pack:linux:dir)

После `npm run pack:linux:dir` появляется **`dist/linux-unpacked/`** (исполняемый `VELORIX` или `VELORIX`). Автоматическая проверка дерева:

```bash
npm run verify:linux-unpacked
```

После `pack:linux:dir`: **`npm run verify:linux-unpacked`** (на Linux). Ручная приёмка UI — после NEON rebuild.

**Подпись артефактов (roadmap для публикации за пределами dev-сборки; локальный `pack:linux:dir` может быть без GPG):**

1. Выбрать канал: **AppImage** (подпись upstream-стилем), **deb** (GPG + `debsigs`/`dpkg-sig` по политике репозитория) или tar без подписи для внутреннего распространения.
2. Хранить GPG-ключ и passphrase вне репозитория; на CI — secret store, не в логах `electron-builder`.
3. **electron-builder** linux-цели (`AppImage`, `deb`) — включить подпись в конфиге только на release runner с ключом.
4. Проверка: `gpg --verify` для подписанного `.deb`/`.AppImage` (или политика вашего mirror); для unpacked smoke — достаточно `verify:linux-unpacked` без GPG.
5. Flatpak/Snap — отдельное решение, если появится отдельная цель упаковки.

Канон — документация **electron-builder** (linux targets) и политика GPG вашего дистрибутивного канала.

Formatters: [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts) (`formatLinuxReleaseCodeSigningRoadmapHelpClause`); §15 hub — `check:help-terminal-hints-docs`.

В Support ZIP `unpackedLayout:` — layout `dist/linux-unpacked/` и `resources/*` (present/missing без запуска verify на другой ОС).

### 4.2 macOS (pack:mac:dir)

После `npm run pack:mac:dir` ищите **`Velorix.app`** в `dist/mac-arm64/`, `dist/mac/` или `dist/mac-x64/`. Автоматическая проверка дерева:

```bash
npm run verify:mac-unpacked
```

После `pack:mac:dir`: **`npm run verify:mac-unpacked`** (на macOS). Ручная приёмка UI — после NEON rebuild.

**Подпись кода и notarization (roadmap для публикации за пределами dev-сборки; локальный `pack:mac:dir` может быть без них):**

1. Учётная запись **Apple Developer Program**, сертификат **Developer ID Application** в Keychain доступа macOS-сборочной машины; **Team ID** для конфигурации сборки (см. `electron-builder`).
2. В **electron-builder** задать идентичность подписи, **hardened runtime**, при необходимости plist **entitlements** / `entitlementsInherit` только под реальные разрешения (файлы, сеть, утилиты в `Contents/Resources/bin`).
3. Проверка подписи: `codesign --verify --deep --strict --verbose=2` по `Velorix.app`; при диагностике — `codesign -dv --verbose=4` на бинарник в `Contents/MacOS`.
4. **Notarization** через Apple Notary Service: загрузка артефакта (`notarytool submit`, либо актуальный `xcrun notarytool` из Xcode CLT), ожидание `Accepted`, затем **`xcrun stapler staple`** по `.app`/дистрибутиву для офлайн-проверки Gatekeeper.
5. Контроль на чистой macOS: снять quarantine при ручном копировании (`xattr`), при сомнениях — `spctl --assess --verbose` для `.app`.

Канон реализации — официальные разделы Apple (Gatekeeper / notarization / hardened runtime) и раздел mac в документации **electron-builder**; ключи конфигурации обновлять вместе с целевыми платформами Electron.

Formatters: [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts) (`formatMacosReleaseCodeSigningRoadmapHelpClause`); §15 hub — `check:help-terminal-hints-docs`.

В Support ZIP `unpackedLayout:` — кандидаты `dist/mac*/Velorix.app` и layout `Contents/Resources/*` (present/missing без запуска verify на Windows).

**Dev guards (post UI PURGE, в `check:quiet`):**

- `npm run check:platform-packaging-scripts` — имена npm-скриптов §19 в `package.json`;
- `npm run pack:dir` + `npm run verify:win-unpacked` — CI packaged layout (Windows job);
- `npm run check:terminal-hints-guards-package-json` — registry §8 terminal guards ↔ `package.json` + порядок в `check:quiet`;
- `npm run check:help-terminal-hints-docs` — 16 Help (§8 ffmpeg/tools, about/logging, workflow hubs) ↔ `terminal-contract-hints-meta`;
- `npm run check:terminal-contract-hints-shards` — 22 shard-файла, snapshot 839+465 hints;
- `npm run check:support-bundle-terminal-hints` — Support ZIP `diagnostics.txt` блок `terminalHints:` ↔ `formatTerminalContractHintsSupportZipLines`.

Support ZIP `unpackedLayout:` — present/missing для `dist/win-unpacked/`, `dist/linux-unpacked/`, `Velorix.app` (без повторного `verify:*` на другой ОС). См. `Help/ru/about-support-logs.md`, `Help/ru/logging-and-diagnostics.md`.

### 4.3 Workflows: OS schedulers (watch-folder)

После `pack:dir` + `verify:*` при необходимости проверьте **фоновый tick** watch-folder (не в CI):

| ОС      | Backend в планировщике   | Проверка                                                                                                          |
| ------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Windows | Windows Task Scheduler   | `schtasks /Query /TN \\Velorix\\watch-<taskId>`; tick: `Velorix.exe --workflow-watch-folder-tick`               |
| macOS   | macOS LaunchAgent        | `~/Library/LaunchAgents/com.velorix.watch.<taskId>.plist`; лог `~/Library/Logs/Velorix/watch-<taskId>.log`    |
| Linux   | Linux systemd user timer | `systemctl --user status Velorix-watch-<taskId>.timer`; `journalctl --user -u Velorix-watch-<taskId>.service` |

Общий сценарий: **Сервис → Планировщик задач** — задача watch-folder, backend OS, интервал 15–86400 с, сценарий с блоком «Обработать»; положить тестовый файл в папку — событие в статусбаре и запись `workflowScenario` в истории.

URL-сценарий: шаблон «URL → скачать → ffmpeg», `sourceUrl` в JSON; **FFmpeg rail → Сценарий → Запустить URL-сценарий**.

Справка: `Help/ru/workflows-planner-scenarios.md` (RU), `Help/en/workflows-planner-scenarios.md` (EN).

В UI: **Сервис → Планировщик задач** — блок «Ручной smoke OS scheduler» (копирование чеклиста; тот же текст в Support ZIP как `workflowOsSchedulerSmoke:`).

## 5. GitHub

Репозиторий: `https://github.com/W1ldGodlike/Velorix`.

**Настройки репозитория (разово):** _Settings → Actions → General_ — разрешить **Actions** (например _Allow all actions and reusable workflows_ или политика организации); для PR из форков при необходимости включить одобрение первого запуска (_Fork pull request workflows_). Обновления npm и GitHub Actions для зависимостей CI приходят через **Dependabot** (`.github/dependabot.yml`); при отсутствии PR от бота проверьте _Settings → Code security and analysis → Dependabot version updates_.

**Письма «Run failed / No jobs were run»:** это не обязательно падение `npm run check`. Статус _No jobs were run_ значит, что workflow стартовал, но **ни один job не был поставлен в очередь** (например несовпадение триггера, политика форка или редкие граничные случаи GitHub). Смотреть в UI: есть ли job **`check`** и какое **Event** (_push_ / _pull_request_ / _workflow_dispatch_).

Перед push:

```powershell
git log --oneline -5
git status
```

После push убедиться, что GitHub Actions `ci` зелёный. Тот же workflow можно запустить вручную: **Actions → `ci` → Run workflow** (`workflow_dispatch`).

Workflow `ci` на Windows: `actions/checkout` с `fetch-depth: 1`; `permissions: contents: read`; `concurrency` с `cancel-in-progress` для ветки; на job заданы **`VELORIX_TRUSTED_HASHES_STRICT_UNKNOWN=1`** и **`VELORIX_TRUSTED_HASHES_REQUIRE_SHA256_HEX=1`** (строгая проверка `Data/trusted_hashes.json` внутри `npm run check`); кэш **`%LOCALAPPDATA%\electron\Cache`** и **`%LOCALAPPDATA%\electron-builder\Cache`** (по `package-lock.json`); кэш `bin/`; `engines:prepare:win`; **`npm run engines:doctor`** (verify + SHA256-строки в лог + `--versions`; в verify при `GITHUB_ACTIONS` или `VELORIX_LOG_ENGINE_VERSIONS` — первая строка версии каждого exe); `npm run build`; `npm run pack:dir` (`electron-builder --dir`) — проверка конфигурации упаковки без полного NSIS/zip.

На runner после `pack:dir` появляется **`dist/win-unpacked/`** (см. §4), затем **`verify:win-unpacked`**. Workflow **не** загружает `dist/win-unpacked/` в Artifacts — только проверка успешности шагов.
