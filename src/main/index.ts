import { existsSync } from 'fs'
import { BrowserWindow, Menu, app, ipcMain, shell } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { resolveAppPaths } from './app-paths'
import { getEnginesStatus } from './engine-service'
import type { EnginesStatusSnapshot } from './engine-service'
import type { AppSettings, AppTheme } from './settings-store'
import { loadSettings, saveSettings } from './settings-store'

/**
 * Путь настроек в userData.
 *
 * userData выбирает сам Electron под каждую ОС, поэтому настройки не зависят от папки
 * установки и переживают обновления приложения. Сейчас здесь только тема, но файл
 * задуман как точка расширения для языка, путей движков, hotkeys и session-политик.
 */
function settingsPath(): string {
  return join(app.getPath('userData'), 'settings.json')
}

/**
 * Путь к ТЗ для пункта меню «Справка».
 *
 * В dev читаем файл из корня репозитория, чтобы агент/разработчик видел актуальный документ.
 * В production читаем копию из `extraResources`, потому что исходный корень уже не существует
 * как обычная папка рядом с exe.
 */
function technicalSpecPath(): string {
  const packaged = join(process.resourcesPath, 'FLUXALLOY_TZ.md')
  if (!is.dev && existsSync(packaged)) {
    return packaged
  }
  return join(app.getAppPath(), 'FLUXALLOY_TZ.md')
}

// Main process хранит актуальные настройки в памяти, чтобы меню и IPC отвечали одинаково.
let cachedSettings: AppSettings = { theme: 'dark' }

function applyTheme(theme: AppTheme): void {
  cachedSettings = { theme }
}

function persistAndBroadcast(theme: AppTheme): AppSettings {
  applyTheme(theme)
  saveSettings(settingsPath(), cachedSettings)
  // Renderer подписан на событие, поэтому смена темы из меню сразу отражается во всех окнах.
  BrowserWindow.getAllWindows().forEach((w) => {
    w.webContents.send('fluxalloy:theme-changed', theme)
  })
  buildApplicationMenu()
  return cachedSettings
}

function setTheme(theme: AppTheme): AppTheme {
  persistAndBroadcast(theme)
  return theme
}

function buildApplicationMenu(): void {
  const win = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0] ?? undefined
  const isMac = process.platform === 'darwin'
  const isDark = cachedSettings.theme === 'dark'

  // Меню пересобирается после смены темы, чтобы radio-состояния оставались честными.
  const template: Electron.MenuItemConstructorOptions[] = []

  if (isMac) {
    template.push({
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })
  }

  template.push(
    {
      label: 'Файл',
      submenu: [
        {
          label: 'Открыть…',
          accelerator: 'CmdOrCtrl+O',
          // Пункт уже стоит на своём будущем месте, но будет включён вместе с IPC выбора файла (§4/§7).
          // TODO(§4/§7): подключить dialog.showOpenDialog и отправку выбранного источника в renderer.
          enabled: false
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    {
      label: 'Вид',
      submenu: [
        {
          label: 'Тема',
          submenu: [
            {
              label: 'Тёмная',
              type: 'radio',
              checked: isDark,
              click: (): void => {
                void setTheme('dark')
              }
            },
            {
              label: 'Светлая',
              type: 'radio',
              checked: !isDark,
              click: (): void => {
                void setTheme('light')
              }
            }
          ]
        }
      ]
    },
    {
      label: 'Справка',
      submenu: [
        {
          label: 'Документация FluxAlloy (ТЗ)',
          click: (): void => {
            const tzPath = technicalSpecPath()
            if (existsSync(tzPath)) {
              void shell.openPath(tzPath)
            }
          }
        }
      ]
    }
  )

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  if (win && !win.isDestroyed()) {
    win.setMenuBarVisibility(true)
  }
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      // Renderer не получает Node API напрямую; вся работа с FS/процессами пойдёт через whitelist IPC.
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    buildApplicationMenu()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    // Внешние ссылки не открываем внутри Electron-окна: так renderer не получает незапланированную навигацию.
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.fluxalloy')
  cachedSettings = loadSettings(settingsPath())

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC-каналы держим узкими: renderer просит только конкретные операции, без произвольного доступа к Node.
  ipcMain.handle('fluxalloy:settings-get', (): AppSettings => {
    return { ...cachedSettings }
  })

  ipcMain.handle('fluxalloy:settings-set-theme', (_, theme: unknown): AppSettings => {
    const next = theme === 'light' ? 'light' : 'dark'
    return persistAndBroadcast(next)
  })

  ipcMain.handle('fluxalloy:engines-status', async (): Promise<EnginesStatusSnapshot> => {
    // Проверка движков живёт в main: renderer не должен знать реальные пути и запускать процессы.
    // TODO(§3): добавить отдельный IPC для загрузки/обновления движков с progress events.
    return getEnginesStatus(resolveAppPaths())
  })

  ipcMain.on('ping', () => console.log('pong'))

  buildApplicationMenu()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
