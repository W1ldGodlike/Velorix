# FluxAlloy

Десктопное приложение (Electron + React + TypeScript): оболочка воколо **ffmpeg** и **yt‑dlp** по [`FLUXALLOY_TZ.md`](./FLUXALLOY_TZ.md).

## Требования

- **Node.js** **≥ 20.19** (см. `engines` в `package.json` и [electron-vite](https://electron-vite.org/guide/)); в репозитории зафиксирован ориентир **`.nvmrc`** (`nvm use` / `fnm use`).
- **npm** в `PATH` (ставится вместе с Node.js). Альтернативы: **pnpm** / **yarn** — команды ниже адаптируйте.

### Первичная настройка окружения

1. Установите [Node.js](https://nodejs.org/) LTS (подходит 20.x, 22.x или 24.x).
2. В корне репозитория: `npm install` (postinstall подтянет **electron-builder** native deps).
3. Проверка: `npm run check` — **ESLint** + **TypeScript** без emit.
4. Разработка: `npm run dev`.
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
npm run check        # lint + typecheck
npm run build
npm run build:win    # Windows installer + artifacts
npm run build:mac
npm run build:linux
```

## Полезное

- `Data/`, `Help/` — материалы для UI и конфигураций (**§3** ТЗ и подсказки).
- **Настоятельно используйте `contextIsolation`** и узкий IPC; тяжёлая работа только в **main process** (§2 ТЗ).
