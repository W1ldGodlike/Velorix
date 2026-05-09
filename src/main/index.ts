import { existsSync } from 'fs'
import { basename, join, normalize, resolve } from 'path'
import { BrowserWindow, Menu, app, clipboard, ipcMain, shell } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { resolveAppPaths } from './app-paths'
import { downloadEnginesWindows, isAnyEngineMissing } from './engine-download'
import { focusOrCreateDownloadsWindow } from './downloads-window'
import { probeMediaFile } from './ffprobe-service'
import type { EngineDownloadProgress } from './engine-download'
import { getEnginesStatus } from './engine-service'
import type { EnginesStatusSnapshot } from './engine-service'
import {
  grantMediaPath,
  isGrantedMediaPath,
  registerFluxMediaPrivileges,
  registerFluxMediaProtocol
} from './media-protocol'
import { openVideoWithDialog } from './preview-dialog'
import type { AppSettings, AppTheme } from './settings-store'
import { loadSettings, saveSettings } from './settings-store'
import { loadTrustedHashes, resolveTrustedHashesPath } from './trusted-hashes-store'

/** Кастомная схема для локального видеопревью; привилегии обязаны зарегистрироваться до `app.whenReady`. */
registerFluxMediaPrivileges()

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
  cachedSettings = { ...cachedSettings, theme }
}

function persistLastOpenedSource(absolutePath: string | null): void {
  if (absolutePath === null || absolutePath.trim().length === 0) {
    const rest = { ...cachedSettings }
    delete rest.lastOpenedSourcePath
    cachedSettings = rest
  } else {
    cachedSettings = { ...cachedSettings, lastOpenedSourcePath: absolutePath.trim() }
  }
  saveSettings(settingsPath(), cachedSettings)
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
          click: async (): Promise<void> => {
            const target = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0]
            if (!target || target.isDestroyed()) {
              return
            }
            const result = await openVideoWithDialog(target)
            if (!result.ok) {
              return
            }
            persistLastOpenedSource(result.path)
            target.webContents.send('fluxalloy:preview-opened', result)
          }
        },
        {
          label: 'Менеджер загрузок (yt-dlp)…',
          accelerator: 'CmdOrCtrl+Shift+Y',
          click: (): void => {
            focusOrCreateDownloadsWindow(null)
          }
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
  registerFluxMediaProtocol()

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
    return getEnginesStatus(resolveAppPaths())
  })

  ipcMain.handle('fluxalloy:engines-should-offer-download', (): boolean => {
    return isAnyEngineMissing(resolveAppPaths())
  })

  ipcMain.handle(
    'fluxalloy:engines-download',
    async (event): Promise<{ ok: true } | { ok: false; error: string }> => {
      const win = BrowserWindow.fromWebContents(event.sender)
      const paths = resolveAppPaths()
      const trusted = loadTrustedHashes(resolveTrustedHashesPath())
      try {
        await downloadEnginesWindows(paths, trusted, (p: EngineDownloadProgress) => {
          win?.webContents.send('fluxalloy:engines-progress', p)
        })
        return { ok: true }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error)
        return { ok: false, error: msg }
      }
    }
  )

  ipcMain.handle('fluxalloy:open-video-dialog', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) {
      return { ok: false, error: 'Нет активного окна' }
    }
    const result = await openVideoWithDialog(win)
    if (result.ok) {
      persistLastOpenedSource(result.path)
    }
    return result
  })

  ipcMain.handle('fluxalloy:preview-grant-path', (_, rawPath: unknown) => {
    if (typeof rawPath !== 'string' || rawPath.length === 0) {
      return { ok: false, error: 'Пустой путь' }
    }
    const mediaUrl = grantMediaPath(rawPath)
    if (!mediaUrl) {
      return { ok: false, error: 'Не удалось открыть файл' }
    }
    persistLastOpenedSource(rawPath)
    return {
      ok: true,
      path: rawPath,
      mediaUrl,
      name: basename(rawPath)
    }
  })

  ipcMain.handle('fluxalloy:persist-last-source', (_, raw: unknown) => {
    if (raw === null || raw === undefined || raw === '') {
      persistLastOpenedSource(null)
      return
    }
    if (typeof raw === 'string') {
      persistLastOpenedSource(raw)
    }
  })

  ipcMain.handle('fluxalloy:restore-last-source', () => {
    const saved = cachedSettings.lastOpenedSourcePath
    if (typeof saved !== 'string' || saved.trim().length === 0 || !existsSync(saved)) {
      return null
    }
    const mediaUrl = grantMediaPath(saved.trim())
    if (!mediaUrl) {
      persistLastOpenedSource(null)
      return null
    }
    return {
      path: saved.trim(),
      mediaUrl,
      name: basename(saved.trim())
    }
  })

  ipcMain.handle('fluxalloy:media-probe', async (_, rawPath: unknown) => {
    if (typeof rawPath !== 'string' || rawPath.trim().length === 0) {
      return { ok: false as const, error: 'Не указан путь к медиафайлу' }
    }
    const abs = resolve(normalize(rawPath.trim()))
    if (!isGrantedMediaPath(abs)) {
      return {
        ok: false as const,
        error: 'Нет доступа к этому пути для анализа (сначала откройте файл в превью).'
      }
    }
    return probeMediaFile(resolveAppPaths(), abs)
  })

  ipcMain.handle('fluxalloy:clipboard-read-text', () => clipboard.readText())

  ipcMain.handle('fluxalloy:open-downloads-window', (_, rawUrl: unknown) => {
    const url = typeof rawUrl === 'string' && rawUrl.trim().length > 0 ? rawUrl.trim() : null
    focusOrCreateDownloadsWindow(url)
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
