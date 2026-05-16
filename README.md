# FluxAlloy

Десктопное приложение (Electron + React + TypeScript): оболочка вокруг **ffmpeg** и **yt‑dlp** по [`FLUXALLOY_TZ.md`](./FLUXALLOY_TZ.md).

## Требования

- **Node.js** **≥ 20.19** (см. `engines` в `package.json` и [electron-vite](https://electron-vite.org/guide/)); в репозитории зафиксирован ориентир **`.nvmrc`** (`nvm use` / `fnm use`).
- **npm** в `PATH` (ставится вместе с Node.js). Альтернативы: **pnpm** / **yarn** — команды ниже адаптируйте.

### Первичная настройка окружения

1. Установите [Node.js](https://nodejs.org/) LTS (подходит 20.x, 22.x или 24.x).
2. В корне репозитория: `npm install` (postinstall подтянет **electron-builder** native deps).
3. Проверка: `npm run check` — **ESLint**, **TypeScript** (main/web/tests), **Vitest**, `trusted_hashes.json`, нумерация журнала, валидатор спринт-TODO чеклиста, guard секретов (см. `docs/RELEASE.md` §1). Краткий сводный вывод: `npm run check:quiet`.
4. Разработка: `npm run dev` (lifecycle **`predev`** → `engines:prepare:win` для `bin/`; отдельно **`engines:doctor`** не вызывается — при необходимости вручную).
5. Рекомендуемые расширения VS Code / Cursor перечислены в [`.vscode/extensions.json`](./.vscode/extensions.json); для форматирования и ESLint см. [`.vscode/settings.json`](./.vscode/settings.json).

### Windows / PowerShell: «выполнение сценариев отключено» для `npm.ps1`

1. В корне репозитория выполните:
   `powershell -ExecutionPolicy Bypass -File .\scripts\fix-powershell-npm.ps1`
   Скрипт сам: снимает **Mark-of-the-Web** с `npm.ps1`/`npx.ps1`, пытается выставить **RemoteSigned** для текущего пользователя и **дописывает алиасы** `npm`/`npx` → `npm.cmd`/`npx.cmd` в профили:
   `Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1` и `Documents\PowerShell\Microsoft.PowerShell_profile.ps1` (блок не дублируется). Перезапустите терминал.

2. Если **GPO** запрещает менять политику — алиасы из п.1 всё равно делают обычный вызов `npm` рабочим.

3. Вручную без скрипта: `npm.cmd run dev` или алиасы в `$PROFILE` (см. скрипт как образец).

## Команды

```bash
npm install
npm run dev
npm run check            # см. выше + trusted_hashes + journal + secrets
npm run engines:doctor   # Windows: verify bin + SHA + версии (см. docs/RELEASE.md)
npm run check:release    # Windows: prepare → doctor → build → pack:dir → audit; распакованный smoke — dist/win-unpacked/ (см. docs/RELEASE.md)
npm run agent:once   # один прогон Cursor SDK automation
npm run agent:loop   # цикл; число продолжений: -- --max-steps N или MAX_STEPS в .env
npm run build
npm run build:win    # Windows installer + artifacts
npm run build:mac
npm run build:linux
```

## Секреты и .env

- `scripts/cursor-automation/.env` содержит **CURSOR_API_KEY** и **не должен попадать в Git**.
- Для примера используйте `scripts/cursor-automation/.env.example`.
- В CI есть базовый guard: `node scripts/check-no-secrets.mjs` (проверяет только tracked файлы).

## Зависимости приложения (движки)

FluxAlloy работает поверх внешних движков:

- **yt-dlp**
- **ffmpeg** / **ffprobe**

Политика проекта: **bundled-first** — в релизе должны лежать проверенные бинарники в `resources/bin`,
а `userData/bin` используется как fallback/update (см. [`bin/README.md`](./bin/README.md)).

Для разработки на Windows движки можно подтянуть автоматически:

```powershell
npm run engines:prepare:win
npm run engines:doctor   # по желанию: наличие exe, SHA256 в лог, первая строка версии (см. docs/RELEASE.md)
```

## Архитектура и точки входа

Описание слоёв (main / preload / renderer), IPC, Cursor SDK automation и таблица **точек входа**: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md). Документ следует обновлять при смене контрактов IPC или способа сборки.

## Релиз

- Release checklist: [`docs/RELEASE.md`](./docs/RELEASE.md) (в т.ч. ручной запуск workflow **`ci`** на GitHub Actions).
- Лицензии и источники bundled движков: [`docs/BUNDLED_ENGINES_LICENSES.md`](./docs/BUNDLED_ENGINES_LICENSES.md).
- Полная цепочка Windows (prepare → **`engines:doctor`** → build → `electron-builder --win`): `npm run release:win` или `npm run release:win:force`.

## Горячие клавиши (базовые)

- **CmdOrCtrl+O**: открыть файл в редактор.
- **CmdOrCtrl+Shift+Y**: открыть pop-out менеджер загрузок yt-dlp.
- **CmdOrCtrl+Shift+V**: вставить URL из буфера в менеджер загрузок.
- **CmdOrCtrl+V** (когда фокус не в текстовом поле): если в буфере список URL — открыть менеджер загрузок.

## Логи и диагностика

- **`main.log`**, **`session.log`**: `userData/logs/` (в Windows это обычно `%AppData%\\FluxAlloy\\logs\\`).
- В UI: **«О программе» → Папка логов / main.log / Support ZIP…**.
- **Support ZIP**: архив с `diagnostics.txt` и логами для отладки.

## Сброс настроек

Удалите файл `userData/settings.json` (в Windows обычно `%AppData%\\FluxAlloy\\settings.json`), затем перезапустите приложение.

## Полезное

- Агент (Cursor / marathon): [`AGENTS.md`](./AGENTS.md), [`docs/AGENT_REANCHOR.md`](./docs/AGENT_REANCHOR.md), [`docs/SOURCES_OF_TRUTH.md`](./docs/SOURCES_OF_TRUTH.md).
- `Data/`, `Help/` — материалы для UI и конфигураций (**§3** ТЗ и подсказки).
- Правки русских `summary` встроенных сценариев терминала (`src/shared/terminal-contract.ts`): **`npm run locales:terminal-summaries-ru`** (дважды, пока второй прогон не покажет **0** замен и **0** gloss) — см. [`Help/ffmpeg-terminal-hints.md`](./Help/ffmpeg-terminal-hints.md).
- Автоцикл по чеклисту через Cursor SDK (не IDE-чат): см. [`scripts/cursor-automation/README.md`](./scripts/cursor-automation/README.md).
- Файлы yt-dlp из окна загрузок по умолчанию: `%AppData%\<FluxAlloy>\downloads\ytdlp` (Electron `userData/downloads/ytdlp`).
- **Настоятельно используйте `contextIsolation`** и узкий IPC; тяжёлая работа только в **main process** (§2 ТЗ).
