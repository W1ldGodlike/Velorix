# FluxAlloy

Десктопное приложение (Electron + React + TypeScript): оболочка вокруг **ffmpeg** и **yt‑dlp** по [`FLUXALLOY_TZ.md`](./FLUXALLOY_TZ.md).

## Быстрый старт (разработчик)

```bash
git clone <url> FluxAlloy && cd FluxAlloy
npm install
npm run check:quiet   # lint, typecheck, тесты, guards — краткий свод
npm run dev           # Electron + Vite (predev подтянет движки на Windows)
```

- **Node.js** **≥ 20.19** (`engines` в `package.json`, ориентир [`.nvmrc`](./.nvmrc) — `24`).
- **Renderer:** Zustand (`src/renderer/src/stores/*`), один бандл UI; pop-out загрузок/инспектора — тот же renderer + hash `#downloads` / `#inspector` (см. [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)).
- **Агент Cursor:** [`AGENTS.md`](./AGENTS.md) → [`docs/SOURCES_OF_TRUTH.md`](./docs/SOURCES_OF_TRUTH.md) (marathon и skills — там, без дубля в README).
- **Cadence Git / override:** см. [`fluxalloy-agent.mdc`](./.cursor/rules/fluxalloy-agent.mdc), [`agent-contract.txt`](./scripts/cursor-automation/prompts/agent-contract.txt).

### Первичная настройка окружения

1. Установите [Node.js](https://nodejs.org/) LTS (20.x, 22.x или 24.x).
2. В корне: `npm install` (postinstall — native deps **electron-builder**).
3. Полная проверка: `npm run check` — то же, что `npm run check:quiet` (единый gate: ESLint, TypeScript, Vitest, trusted hashes, journal, checklist, secrets, UI/locale guards и audit-скрипты; см. [`docs/RELEASE.md`](./docs/RELEASE.md) §1).
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
- Guard: `node scripts/check-no-secrets.mjs` (tracked файлы).

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
- Русские `summary` терминала: **`npm run locales:terminal-summaries-ru`** (дважды до 0 замен) — [`Help/ffmpeg-terminal-hints.md`](./Help/ffmpeg-terminal-hints.md).
- Help §21: `npm run check:help-workflow-smoke-crosslinks` (44 workflow; tail 42 HelpCrosslinksCountTail + ffmpeg FfmpegTerminalWorkflowClause + knowledge KnowledgeHubDevClause (FAQ 2 in tail, outside 44)); registry `check:help-smoke-guards-package-json` requires `partition:` in all 44 workflow Help.
- §21 Playwright GUI e2e (deferred): `npm run check:packaged-gui-e2e-playwright-deferred` — reserved `test:e2e:gui` (8 planned-gui-e2e; not in package.json until wired). Help UiHintSuffix: AGENTS + 4 §15 anchors + 6 packaged (`formatPackagedGuiE2ePlaywright*HelpUiHintSuffix`; `check:help-owner-smoke-docs`, `check:help-packaged-smoke-docs`).
- SDK automation: [`scripts/cursor-automation/README.md`](./scripts/cursor-automation/README.md).
- yt-dlp по умолчанию: `<папка программы>/app-data/downloads/ytdlp`.
- NSIS спрашивает про удаление `app-data/`; в ZIP — `Uninstall FluxAlloy.cmd`.
- **contextIsolation** + узкий IPC; тяжёлая работа только в **main process**.
