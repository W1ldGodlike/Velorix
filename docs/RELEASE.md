# FluxAlloy Release Checklist

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

**Dependabot wave 5:** [x] на `main` — журнал **J-1558** (`gh pr close` #4,#6,#7,#11–#15); пункт спринта в [`IMPLEMENTATION_CHECKLIST.md`](../IMPLEMENTATION_CHECKLIST.md).

**Важно:** **`npm run build`** делает только typecheck + `electron-vite build` — **не** наполняет проектный `bin/` и **не** запускает **`engines:doctor`**. На Linux/CI `electron-vite build` требует плагин **`fix:esm-shim`** в [`electron.vite.config.ts`](../electron.vite.config.ts) (канон — [`electron-vite-build-meta.ts`](../src/shared/electron-vite-build-meta.ts); false-positive `vite:esm-shim` на строке в `renderer-state-approach.ts`). После локального `npm run build` перед `npm run check` / commit — вернуть `src/shared/app-build-info.json` в **`dev`** (`{"buildId":"dev","builtAtUtc":null}`; **J-1386**). Полный Windows-цикл с движками и smoke-упаковкой (`electron-builder --dir`) — **`npm run check:release`** (ниже) или шаги из §2.

Полный предрелизный прогон на Windows (подготовка `bin/`, **`engines:doctor`** — тот же набор, что после prepare в CI: verify + SHA + версии, `build`, smoke `electron-builder --dir`, затем `npm audit`):

```powershell
npm run check:release
```

После успешного завершения шага `pack:dir` в корне репозитория появится распакованное приложение **`dist/win-unpacked/`** для быстрого ручного smoke (см. §4). Сразу после этого **`npm run check:release`** вызывает **`npm run verify:win-unpacked`** — автоматическая проверка: `FluxAlloy.exe`, непустые `resources/bin/{yt-dlp,ffmpeg,ffprobe}.exe`, `resources/FLUXALLOY_TZ.md`, `resources/Data/trusted_hashes.json`, каталог `resources/Help/` (без запуска приложения). Пропуск: `FLUXALLOY_SKIP_PACK_VERIFY=1`.

`npm run check` (алиас на `npm run check:quiet`, см. `scripts/run-quiet-check.mjs`) включает в том числе:

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

`npm run build:win` формирует NSIS и zip (`electron-builder`: `nsis`, `zip`; цель **`portable`** не используется — см. ТЗ §19). Перед скриптом npm выполняет **`prebuild:win`** → `engines:prepare:win`. Команды **`release:win`** / **`release:win:force`** вызывают `npm run build` (не `build:win`), поэтому после уже сделанного prepare **`prebuild:win` не срабатывает повторно**.

Локально без авто-поиска сертификата подписи (часто быстрее, если CSC не настроен):

```powershell
$env:CSC_IDENTITY_AUTO_DISCOVERY = 'false'
npm run build:win
```

**Подпись кода (roadmap для публикации за пределами dev-сборки; локальный `pack:dir` или `CSC_IDENTITY_AUTO_DISCOVERY=false` может быть без Authenticode):**

1. Сертификат **Authenticode** (OV/EV) или корпоративный код-подписывающий сертификат; PFX и пароль — вне репозитория.
2. Переменные **`CSC_LINK`** / **`WIN_CSC_LINK`** (путь к сертификату или secure file) и при необходимости **`CSC_KEY_PASSWORD`** на release runner / CI.
3. **electron-builder** по умолчанию подписывает `FluxAlloy.exe` через bundled `winCodeSign` / `signtool.exe` при наличии сертификата; без CSC — см. блок `CSC_IDENTITY_AUTO_DISCOVERY=false` выше.
4. Проверка: `signtool verify /pa /v` по `dist/win-unpacked/FluxAlloy.exe` и артефактам NSIS/zip.
5. Первые публичные сборки: учитывать **SmartScreen** (репутация файла/издателя); timestamp-сервер (RFC3161) в настройках подписи.

Канон — документация Microsoft Authenticode и раздел **Windows** в **electron-builder**; ключи обновлять с `electron-builder.yml` и целевой версией Electron.

Конфиг упаковки: [`electron-builder.yml`](../electron-builder.yml) — `win.target`: **nsis** + **zip** (без `portable`, см. ТЗ §19); `mac`: dmg + `entitlementsInherit` + `notarize: false`; `linux`: AppImage + deb; `publish: null`; **9** inline §19 yaml-комментариев (`getReleaseCodeSigningElectronBuilderYmlComments` в `release-code-signing-roadmap.ts`); signing-ключи — §4/§4.1/§4.2 ниже.

**Дорожные карты подписи (win/linux/mac, канон):** [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts) — Help clauses в `packaged-{windows,linux,macos}-smoke.md` (+ EN) и §15 hub (getting-started, owner/about, logging, knowledge, planner, ffmpeg); guards `npm run check:help-packaged-smoke-docs`, `check:help-owner-smoke-docs`, strict signing в `check:help-workflow-smoke-crosslinks`; dev `pack:*:dir` / `CSC_IDENTITY_AUTO_DISCOVERY=false` может обходиться без подписи до публикации.

**§19 signing indexed (SDK sprint + diagnostics):** Help §15 hub + `check:help-packaged-smoke-docs` + `check:help-owner-smoke-docs` + strict signing crosslinks; `continue.txt` / `initial.txt` / `agent-contract.txt` — `formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedBlock` / `formatReleaseCodeSigningRoadmapSdkContractSigningIndexedClause`; Support ZIP — `formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine` (`check:release` / `check:platform-packaging-scripts`). **Packaging indexed:** `electron-builder.yml` (**9** §19 yaml comments); `formatReleaseCodeSigningRoadmap*ElectronBuilder*` + `formatReleaseCodeSigningRoadmapElectronBuilderYmlCommentsDiagnosticLine` (J-1520..1539).

Support ZIP (`diagnostics.txt` → `releaseSmoke:`, `terminalHints:`) на любой ОС перечисляет layout win/linux/macos unpacked (present/missing), сводку §21 e2e и dev §8 terminal guards — см. [about-support-logs](../Help/about-support-logs.md), [logging-and-diagnostics](../Help/logging-and-diagnostics.md).

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

### 4.1 Linux (pack:linux:dir)

После `npm run pack:linux:dir` появляется **`dist/linux-unpacked/`** (исполняемый `fluxalloy` или `FluxAlloy`). Автоматическая проверка дерева:

```bash
npm run verify:linux-unpacked
```

Перед публикацией пройдите **ручной smoke** (не заменяет `verify:linux-unpacked`):

1. В приложении: **Настройки → Зависимости → Ручной smoke Linux (pack:linux:dir)** — чеклист с копированием (Support ZIP: `linuxPackagedSmoke:`).
2. Запустите бинарник из `dist/linux-unpacked/` (не `npm run dev`).
3. Те же сценарии, что в §4 для Windows: движки, редактор, загрузки, снимок, экспорт, спрайт §7.5, мини-плеер §4.3 (при busy-задачах), база знаний, Support ZIP.
4. Убедитесь, что в логах и артефактах нет секретов.

**Подпись артефактов (roadmap для публикации за пределами dev-сборки; локальный `pack:linux:dir` может быть без GPG):**

1. Выбрать канал: **AppImage** (подпись upstream-стилем), **deb** (GPG + `debsigs`/`dpkg-sig` по политике репозитория) или tar без подписи для внутреннего распространения.
2. Хранить GPG-ключ и passphrase вне репозитория; на CI — secret store, не в логах `electron-builder`.
3. **electron-builder** linux-цели (`AppImage`, `deb`) — включить подпись в конфиге только на release runner с ключом.
4. Проверка: `gpg --verify` для подписанного `.deb`/`.AppImage` (или политика вашего mirror); для unpacked smoke — достаточно `verify:linux-unpacked` без GPG.
5. Flatpak/Snap — отдельное решение, если появится отдельная цель упаковки.

Канон — документация **electron-builder** (linux targets) и политика GPG вашего дистрибутивного канала.

Formatters и Help: [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts) (`formatLinuxReleaseCodeSigningRoadmapHelpClause`); `Help/packaged-linux-smoke.md` (+ EN) — `check:help-packaged-smoke-docs`.

В Support ZIP `releaseSmoke:` — layout `dist/linux-unpacked/` и `resources/*` (present/missing без запуска verify на другой ОС).

### 4.2 macOS (pack:mac:dir)

После `npm run pack:mac:dir` ищите **`FluxAlloy.app`** в `dist/mac-arm64/`, `dist/mac/` или `dist/mac-x64/`. Автоматическая проверка дерева:

```bash
npm run verify:mac-unpacked
```

Перед публикацией пройдите **ручной smoke**:

1. **Настройки → Зависимости → Ручной smoke macOS (pack:mac:dir)** — чеклист (Support ZIP: `macosPackagedSmoke:`).
2. Откройте `FluxAlloy.app` (не `npm run dev`).
3. Сценарии как в §4 (включая спрайт §7.5 и мини-плеер §4.3); пути движков — `Contents/Resources/bin`.
4. Нет секретов в логах и артефактах.

**Подпись кода и notarization (roadmap для публикации за пределами dev-сборки; локальный `pack:mac:dir` может быть без них):**

1. Учётная запись **Apple Developer Program**, сертификат **Developer ID Application** в Keychain доступа macOS-сборочной машины; **Team ID** для конфигурации сборки (см. `electron-builder`).
2. В **electron-builder** задать идентичность подписи, **hardened runtime**, при необходимости plist **entitlements** / `entitlementsInherit` только под реальные разрешения (файлы, сеть, утилиты в `Contents/Resources/bin`).
3. Проверка подписи: `codesign --verify --deep --strict --verbose=2` по `FluxAlloy.app`; при диагностике — `codesign -dv --verbose=4` на бинарник в `Contents/MacOS`.
4. **Notarization** через Apple Notary Service: загрузка артефакта (`notarytool submit`, либо актуальный `xcrun notarytool` из Xcode CLT), ожидание `Accepted`, затем **`xcrun stapler staple`** по `.app`/дистрибутиву для офлайн-проверки Gatekeeper.
5. Контроль на чистой macOS: снять quarantine при ручном копировании (`xattr`), при сомнениях — `spctl --assess --verbose` для `.app`.

Канон реализации — официальные разделы Apple (Gatekeeper / notarization / hardened runtime) и раздел mac в документации **electron-builder**; ключи конфигурации обновлять вместе с целевыми платформами Electron.

Formatters и Help: [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts) (`formatMacosReleaseCodeSigningRoadmapHelpClause`); `Help/packaged-macos-smoke.md` (+ EN) — `check:help-packaged-smoke-docs`.

В Support ZIP `releaseSmoke:` — кандидаты `dist/mac*/FluxAlloy.app` и layout `Contents/Resources/*` (present/missing без запуска verify на Windows).

**Локали owner/packaged smoke (dev, в `check:quiet`):**

- `npm run check:owner-visual-smoke-locale` — theme/HiDPI + §21 Playwright UI hints (4 settings keys, `formatPackagedGuiE2ePlaywrightUiHintSuffix`) в `locales/{ru,en}/settings.json`;
- `npm run check:packaged-manual-smoke-parity` — одинаковые `Step_*` и meta (`OwnerLine`, `BundleHeading`, …) в `locales/*/win|linux|macos-packaged-manual-smoke.json`;
- `npm run check:platform-packaging-scripts` — имена npm-скриптов §19 в `package.json`;
- `npm run check:packaged-e2e-scenarios-registry` — §21 реестр: 12 шагов ↔ manual smoke (2 ci-headless, 8 planned-gui-e2e, 2 manual-owner); канон stepId — `PACKAGED_E2E_*_STEP_IDS` в `packaged-e2e-smoke-scenarios.ts`; `ci-headless` обязан иметь npm `ciSmokeScript`; `manual-owner` — без скрипта; несуществующие скрипты — fail; `PACKAGED_E2E_CI_SMOKE_SCRIPT_EXPANSIONS` (parent→leaf) сверяется с `package.json`. Уникальные leaf-скрипты — в `.github/workflows/ci.yml` (Vitest `ci-packaged-smoke-steps`). Support ZIP / owner bundle: per-step `e2e <id>: <automation> script=…`.
- `npm run check:packaged-gui-e2e-playwright-deferred` — §21 Playwright GUI e2e отложен: 8 `planned-gui-e2e`, зарезервирован `test:e2e:gui` (пока **нет** в `package.json`); канон — `packaged-gui-e2e-playwright-meta.ts`; UI — `formatPackagedGuiE2ePlaywrightUiHintSuffix` (`check:owner-visual-smoke-locale`, `check:support-bundle-terminal-hints`).
- Playwright scaffold (deferred): `tests/e2e/gui/planned-gui-e2e-steps.ts` — `PLANNED_GUI_E2E_STEP_IDS, PLANNED_GUI_E2E_SCENARIOS, PLANNED_GUI_E2E_STEP_BY_ID`; `test:e2e:gui` not in `package.json` until wired.
- Playwright planned notes (deferred): `PLANNED_GUI_E2E_STEP_BY_ID` in `tests/e2e/gui/planned-gui-e2e-steps.ts`; Copy/releaseSmoke — `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`.
- §21 Playwright wiring (when ready): add `@playwright/test` + `playwright.config.ts`; `test:e2e:gui` in `package.json` from `tests/e2e/gui/planned-gui-e2e-steps.ts` (`PLANNED_GUI_E2E_SCENARIOS`); update `check:packaged-gui-e2e-playwright-deferred.mjs` (remove absence check for reserved script); optional CI job after owner-smoke on hardware.
- `npm run check:help-smoke-guards-package-json` — `PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_HELP_GUARD_NPM_SCRIPTS` ↔ `package.json`; quiet order; `partition:` в `WORKFLOW_REQUIRED_SNIPPETS`;
- `npm run check:help-packaged-smoke-docs` / `check:help-owner-smoke-docs` — packaged §19/§21 snippets в Help; packaged win/linux/macos — `formatPackagedE2eHelpWorkflowCrosslinksPackagedCrosslinksQuietSuffix` (44 + partition note);
- `npm run check:help-workflow-smoke-crosslinks` — `packaged-e2e-help-workflow-crosslinks-meta` (44 workflow + 6 packaged + 8 anchors; tail 42 `HelpCrosslinksCountTail`, ffmpeg-terminal `FfmpegTerminalWorkflowClause`, knowledge `KnowledgeHubDevClause`; FAQ в tail, вне 44); `bin/README.md` — `BinReadmeWorkflowPartitionLine`, `BinReadmePartitionGuardLine`; `README.md`/`AGENTS.md` — `RootReadmePartitionLine` / `AgentsMdHelpLine` (partition registry); owner/packaged §21 + `terminalHints:` → logging hub; дублирует guard/count с `check:help-owner-smoke-docs`, `check:help-packaged-smoke-docs`, `check:owner-visual-smoke-locale` (`formatPackagedE2eHelpWorkflowCrosslinksSettingsHelpClause`).
- `npm run check:terminal-hints-guards-package-json` — registry §8 terminal guards ↔ `package.json` + порядок в `check:quiet`;
- `npm run check:help-terminal-hints-docs` — 24 Help (ffmpeg-terminal-hints, tools/about/logging, workflow hubs + downloads + faq/appearance/knowledge + anchors about/planner `HelpCrosslinksCountTail` 44, packaged win/linux/macos, owner-manual-smoke) ↔ `terminal-contract-hints-meta`;
- `npm run check:terminal-contract-hints-shards` — 35 shard-файлов, snapshot 1056+833 hints;
- `npm run check:terminal-hints-locale` — `appSettingsTerminalHintsGuardHint` в `locales/{ru,en}/settings.json` (`formatTerminalContractHintsSettingsHelpClause`).
- `npm run check:support-bundle-terminal-hints` — Support ZIP `diagnostics.txt` блок `terminalHints:` ↔ `formatTerminalContractHintsSupportZipLines` (`support-bundle.ts`, `main-diagnostics-service.ts`).
- Help sync formatters: `packaged-e2e-help-workflow-crosslinks-meta` — `HelpCrosslinksCountTail` (42 tail + partition), `FfmpegTerminalWorkflowClause` (partition + §8), `AboutSupportReleaseSmokeDevClause`, `OwnerManualSmokeWorkflowArticlesClause`, `KnowledgeHubDevClause`, `LoggingClause`, `PackagedCrosslinksQuietSuffix`, `BinReadmePartitionGuardLine`; guard требует `partition:` во всех 44 workflow; `terminal-contract-hints-meta.ts` — `formatTerminalContractHintsLoggingHelpDevGuardsLine`, `formatTerminalContractHintsAboutSupportZipTerminalHintsBullet`, `formatTerminalContractHintsFfmpegHelpSupportZipLine`, `formatTerminalContractHintsToolsHelpPackagedSmokeLine` — guard `check:help-terminal-hints-docs` сверяет snippet’ы в Help.

Копирование из UI packaged-панели и блока **Ручной smoke** совпадает с форматом Support ZIP (`owner:` / `automated:` / `step [id]:`); packaged **Скопировать** и **Скопировать весь пакет** дописывают один блок **§21 packaged e2e (CI vs owner)** (`appendPackagedManualSmokeE2ePlanLines` в `packaged-manual-smoke-plain-text.ts`). В архиве `releaseSmoke:` — CI pipeline (`smoke:packaged-release`), layout win/linux/macos и тот же §21 appendix. Playwright UI — `formatPackagedGuiE2ePlaywrightUiHintSuffix` (`PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS` + `aboutSupportZipDiagnosticsSectionsHint`). См. `Help/owner-manual-smoke.md`, `Help/about-support-logs.md`, `Help/logging-and-diagnostics.md`.

### 4.3 Workflows: OS schedulers (watch-folder)

После packaged smoke (§4–§4.2) при необходимости проверьте **фоновый tick** watch-folder (не в CI):

| ОС      | Backend в планировщике   | Проверка                                                                                                          |
| ------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Windows | Windows Task Scheduler   | `schtasks /Query /TN \FluxAlloy\watch-<taskId>`; tick: `FluxAlloy.exe --workflow-watch-folder-tick`               |
| macOS   | macOS LaunchAgent        | `~/Library/LaunchAgents/com.fluxalloy.watch.<taskId>.plist`; лог `~/Library/Logs/FluxAlloy/watch-<taskId>.log`    |
| Linux   | Linux systemd user timer | `systemctl --user status fluxalloy-watch-<taskId>.timer`; `journalctl --user -u fluxalloy-watch-<taskId>.service` |

Общий сценарий: **Сервис → Планировщик задач** — задача watch-folder, backend OS, интервал 15–86400 с, сценарий с блоком «Обработать»; положить тестовый файл в папку — событие в статусбаре и запись `workflowScenario` в истории.

URL-сценарий: шаблон «URL → скачать → ffmpeg», `sourceUrl` в JSON; **FFmpeg rail → Сценарий → Запустить URL-сценарий**.

Справка: `Help/workflows-planner-scenarios.md` (RU), `Help/en/workflows-planner-scenarios.md` (EN).

В UI: **Сервис → Планировщик задач** — блок «Ручной smoke OS scheduler» (копирование чеклиста; тот же текст в Support ZIP как `workflowOsSchedulerSmoke:`).

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

Workflow `ci` на Windows: `actions/checkout` с `fetch-depth: 1`; `permissions: contents: read`; `concurrency` с `cancel-in-progress` для ветки; на job заданы **`FLUXALLOY_TRUSTED_HASHES_STRICT_UNKNOWN=1`** и **`FLUXALLOY_TRUSTED_HASHES_REQUIRE_SHA256_HEX=1`** (строгая проверка `Data/trusted_hashes.json` внутри `npm run check`); кэш **`%LOCALAPPDATA%\electron\Cache`** и **`%LOCALAPPDATA%\electron-builder\Cache`** (по `package-lock.json`); кэш `bin/`; `engines:prepare:win`; **`npm run engines:doctor`** (verify + SHA256-строки в лог + `--versions`; в verify при `GITHUB_ACTIONS` или `FLUXALLOY_LOG_ENGINE_VERSIONS` — первая строка версии каждого exe); `npm run build`; `npm run pack:dir` (`electron-builder --dir`) — проверка конфигурации упаковки без полного NSIS/zip.

На runner после `pack:dir` появляется **`dist/win-unpacked/`** (см. §4), затем отдельные шаги CI: **`verify:win-unpacked`**, **`smoke:packaged-app`**, **`smoke:packaged-ffprobe`** (lavfi-клип + JSON probe и registry smoke), **`smoke:packaged-ffmpeg`** (`-version` + `-encoders`), **`smoke:packaged-ytdlp`** — тот же набор, что в **`npm run smoke:packaged-release`** / `check:release`, но с отдельными логами при падении. Workflow **не** загружает `dist/win-unpacked/` в Artifacts — только проверка успешности шагов.
