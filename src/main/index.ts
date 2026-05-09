import { existsSync } from 'fs'
import { BrowserWindow, Menu, app, ipcMain, shell } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import type { AppSettings, AppTheme } from './settings-store'
import { loadSettings, saveSettings } from './settings-store'

/** Путь настроек в userData — тема UI и последующие поля без пересборки. */
function settingsPath(): string {
  return join(app.getPath('userData'), 'settings.json')
}

/** ТЗ в dev — из корня проекта; в сборке — из `resources` (extraResources). */
function technicalSpecPath(): string {
  const packaged = join(process.resourcesPath, 'FLUXALLOY_TZ.md')
  if (!is.dev && existsSync(packaged)) {
    return packaged
  }
  return join(app.getAppPath(), 'FLUXALLOY_TZ.md')
}

let cachedSettings: AppSettings = { theme: 'dark' }

function applyTheme(theme: AppTheme): void {
  cachedSettings = { theme }
}

function persistAndBroadcast(theme: AppTheme): AppSettings {
  applyTheme(theme)
  saveSettings(settingsPath(), cachedSettings)
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
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    buildApplicationMenu()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
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

  ipcMain.handle('fluxalloy:settings-get', (): AppSettings => {
    return { ...cachedSettings }
  })

  ipcMain.handle('fluxalloy:settings-set-theme', (_, theme: unknown): AppSettings => {
    const next = theme === 'light' ? 'light' : 'dark'
    return persistAndBroadcast(next)
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
