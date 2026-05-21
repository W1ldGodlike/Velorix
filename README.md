# FluxAlloy

Десктопное приложение (Electron + React + TypeScript): оболочка вокруг **ffmpeg** и **yt‑dlp** по [`FLUXALLOY_TZ.md`](./FLUXALLOY_TZ.md).

## Быстрый старт (разработчик)

```bash
git clone <url> FluxAlloy && cd FluxAlloy
npm install
npm run check:quiet   # lint, typecheck, тесты, guards — краткий свод
npm run dev           # Electron + Vite (predev подтянет движки на Windows)
```

- **Vitest (Windows gate):** снимок в [`IMPLEMENTATION_CHECKLIST.md`](./IMPLEMENTATION_CHECKLIST.md) и [`AGENTS.md`](./AGENTS.md); majors — [`toolchain-baseline-package.test.ts`](./tests/shared/toolchain-baseline-package.test.ts).
- **Peer dependencies:** в корне [`.npmrc`](./.npmrc) уже `legacy-peer-deps=true` (Vite 8 / `electron-vite`); при ручном install без `.npmrc` — `npm install --legacy-peer-deps` (канон — `package.json`; lock — `tests/shared/toolchain-baseline-package.test.ts`).
- **Dependabot (wave 5):** [x] на **`main`** — журнал **J-1558**; см. [`docs/RELEASE.md`](./docs/RELEASE.md) §1.

- **Node.js** **≥ 20.19** (`engines` в `package.json`, ориентир [`.nvmrc`](./.nvmrc) — `24`).
- **Renderer:** Zustand (`src/renderer/src/stores/*`), один бандл UI; pop-out загрузок/инспектора — тот же renderer + hash `#downloads` / `#inspector` (см. [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)).
- **Агент Cursor:** [`AGENTS.md`](./AGENTS.md) → [`docs/SOURCES_OF_TRUTH.md`](./docs/SOURCES_OF_TRUTH.md); «продолжай» / `+` — skill [`fluxalloy-continue`](./.cursor/skills/fluxalloy-continue/SKILL.md); **следующий commit по J** **J-1580**, **push по J** **J-1580** — [`fluxalloy-agent.mdc`](./.cursor/rules/fluxalloy-agent.mdc).
- **Git по J-NNN:** см. [`fluxalloy-agent.mdc`](./.cursor/rules/fluxalloy-agent.mdc), [`agent-contract.txt`](./scripts/cursor-automation/prompts/agent-contract.txt).

### Первичная настройка окружения

1. Установите [Node.js](https://nodejs.org/) LTS (20.x, 22.x или 24.x).
2. В корне: `npm install` (postinstall — native deps **electron-builder**; читает [`.npmrc`](./.npmrc) — `legacy-peer-deps=true`, см. блок peer в «Быстрый старт»).
3. Полная проверка: `npm run check` — то же, что `npm run check:quiet` (единый gate: ESLint, TypeScript, Vitest, trusted hashes, journal, checklist, secrets, UI/locale guards и audit-скрипты; см. [`docs/RELEASE.md`](./docs/RELEASE.md) §1). **Не входит** в `check:quiet`: `npm run audit:moderate` (npm advisory, moderate+; см. [`docs/RELEASE.md`](./docs/RELEASE.md) §1 и job **check** в [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)).
4. Разработка: `npm run dev` (`predev` → `engines:prepare:win` для `bin/`; `engines:doctor` — вручную при необходимости).
5. Расширения VS Code / Cursor: [`.vscode/extensions.json`](./.vscode/extensions.json), настройки: [`.vscode/settings.json`](./.vscode/settings.json).

### Windows / PowerShell: «выполнение сценариев отключено» для `npm.ps1`

1. В корне:
   `powershell -ExecutionPolicy Bypass -File .\scripts\fix-powershell-npm.ps1`
   Скрипт снимает Mark-of-the-Web с `npm.ps1`/`npx.ps1`, выставляет RemoteSigned и дописывает алиасы `npm`/`npx` → `npm.cmd`/`npx.cmd` в профили PowerShell. Перезапустите терминал.

2. Если GPO запрещает менять политику — алиасы из п.1 всё равно делают `npm` рабочим.

3. Вручную: `npm.cmd run dev` или алиасы в `$PROFILE` (см. скрипт).

## Команды

```bash
npm install
npm run dev
npm run check              # полный gate перед релизом
npm run check:quiet        # тот же набор, краткий лог (CI-локально)
npm run test               # Vitest
npm run test:coverage      # Vitest + coverage/ (очистка post-script)
npm run engines:doctor     # Windows: bin + SHA + версии (docs/RELEASE.md)
npm run check:release      # Windows: check + prepare → doctor → build → smoke
npm run check:release:local
npm run agent:once         # один прогон Cursor SDK automation
npm run agent:loop         # цикл; -- --max-steps N или MAX_STEPS в .env
npm run build
npm run build:win
npm run build:mac
npm run build:linux
```

## Секреты и .env

- `scripts/cursor-automation/.env` — **CURSOR_API_KEY**, не в Git.
- Пример: `scripts/cursor-automation/.env.example`.
- Guard: `node scripts/gate/check-no-secrets.mjs` (tracked файлы).

## Зависимости приложения (движки)

FluxAlloy работает поверх внешних движков:

- **yt-dlp**
- **ffmpeg** / **ffprobe**

Политика: **bundled-first** — в релизе проверенные бинарники в `resources/bin`, `app-data/bin` — fallback/update ([`bin/README.md`](./bin/README.md)).

Windows (разработка):

```powershell
npm run engines:prepare:win
npm run engines:doctor
```

## Архитектура

Слои main / preload / renderer, IPC, pop-out hash routes, Zustand: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md). Обновляйте при смене IPC или сборки. Linux/CI: `electron-vite build` — плагин `fix:esm-shim` в [`electron.vite.config.ts`](./electron.vite.config.ts) (см. [`src/shared/electron-vite-build-meta.ts`](./src/shared/electron-vite-build-meta.ts)).

## Релиз

- [`docs/RELEASE.md`](./docs/RELEASE.md) — checklist, workflow **`ci`** на GitHub Actions.
- [`docs/BUNDLED_ENGINES_LICENSES.md`](./docs/BUNDLED_ENGINES_LICENSES.md) — лицензии bundled движков.
- Windows: `npm run release:win` или `release:win:force`.

## Горячие клавиши (базовые)

- **CmdOrCtrl+O**: открыть файл в редактор.
- **CmdOrCtrl+Shift+Y**: pop-out менеджер загрузок yt-dlp (`#downloads`).
- **CmdOrCtrl+Shift+V**: вставить URL в менеджер загрузок.
- **CmdOrCtrl+V** (вне текстового поля): список URL в буфере → менеджер загрузок.

## Логи и диагностика

- **`main.log`**, **`session.log`**: `<папка программы>/app-data/logs/` (dev — `app-data/logs/` в корне репо).
- UI: **«О программе» → Папка логов / main.log / Support ZIP…**.
- **Support ZIP**: архив с `diagnostics.txt` и логами.

## Сброс настроек

Удалите `app-data/settings.json` рядом с программой (dev — в корне репо), перезапустите приложение.

## Полезное

- Агент: [`AGENTS.md`](./AGENTS.md), [`docs/SOURCES_OF_TRUTH.md`](./docs/SOURCES_OF_TRUTH.md).
- `Data/`, `Help/` — конфиги и подсказки UI.
- Русские `summary` терминала: **`npm run locales:terminal-summaries-ru`** (дважды до 0 замен) — [`Help/ru/ffmpeg-terminal-hints.md`](./Help/ru/ffmpeg-terminal-hints.md).
- Help §21: `npm run check:help-workflow-smoke-crosslinks` (44 workflow; user footer (owner-manual-smoke + packaged-windows-smoke); 44/44 workflow user crosslink footers).
- §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](./src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](./docs/RELEASE.md) §4/§4.1/§4.2; Help packaged win/linux/macos + §15 hub — `check:help-packaged-smoke-docs`, `check:help-owner-smoke-docs`, strict signing in `check:help-workflow-smoke-crosslinks`.
- §19 signing indexed: Help §15 hub + `check:help-packaged-smoke-docs` + `check:help-owner-smoke-docs` + strict signing crosslinks; SDK `continue.txt` / `initial.txt` / `agent-contract.txt` — `formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedBlock` / `formatReleaseCodeSigningRoadmapSdkContractSigningIndexedClause`; diagnostics — `check:release` / `check:platform-packaging-scripts` (`formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine`). Packaging indexed: `electron-builder.yml` (**9** §19 yaml comments; J-1520..1539).
- §19 packaging (`electron-builder.yml`): win **nsis** + **zip** (no `portable`); **9** §19 yaml comments — `getReleaseCodeSigningElectronBuilderYmlComments` in [`release-code-signing-roadmap.ts`](./src/shared/release-code-signing-roadmap.ts).
- §21 Playwright GUI e2e (deferred): `npm run check:packaged-gui-e2e-playwright-deferred` — reserved `test:e2e:gui` (8 planned-gui-e2e; not in package.json until wired). Help UiHintSuffix: AGENTS + 4 §15 anchors + 6 packaged (`formatPackagedGuiE2ePlaywright*HelpUiHintSuffix`; `check:help-owner-smoke-docs`, `check:help-packaged-smoke-docs`).
- §21 Playwright scaffold (deferred): `tests/e2e/gui/planned-gui-e2e-steps.ts` exports `PLANNED_GUI_E2E_STEP_IDS, PLANNED_GUI_E2E_SCENARIOS, PLANNED_GUI_E2E_STEP_BY_ID` (8 steps; `test:e2e:gui` not in package.json yet).
- §21 Playwright planned notes (deferred): `PLANNED_GUI_E2E_STEP_BY_ID` in `tests/e2e/gui/planned-gui-e2e-steps.ts`; Copy/releaseSmoke — `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`.
- §21 Playwright wiring (when ready): see `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet` (`@playwright/test`, `test:e2e:gui`; after owner-smoke on hardware).
- SDK automation: [`scripts/cursor-automation/README.md`](./scripts/cursor-automation/README.md).
- yt-dlp по умолчанию: `<папка программы>/app-data/downloads/ytdlp`.
- NSIS спрашивает про удаление `app-data/`; в ZIP — `Uninstall FluxAlloy.cmd`.
- **contextIsolation** + узкий IPC; тяжёлая работа только в **main process**.
