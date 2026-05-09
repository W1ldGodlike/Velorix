import { existsSync } from 'fs'
import { basename, join, normalize, resolve } from 'path'
import { BrowserWindow, Menu, app, clipboard, dialog, ipcMain, shell } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { resolveAppPaths } from './app-paths'
import { downloadEnginesWindows, isAnyEngineMissing } from './engine-download'
import {
  focusOrCreateDownloadsWindow,
  registerDownloadsWindowIpcHandlers
} from './downloads-window'
import {
  runFfmpegExportJob,
  type MediaExportTrimPayload,
  type FfmpegExportProgressPayload
} from './ffmpeg-export-service'
import { probeMediaFile } from './ffprobe-service'
import type { EngineDownloadProgress } from './engine-download'
import { setEnginePathOverridesSnapshot } from './engine-path-sync'
import {
  getEnginesStatus,
  resolveEngineExecutablePath,
  type EngineId,
  type EnginePathOverrides,
  type EnginePathOverridesPatch,
  type EnginesStatusSnapshot
} from './engine-service'
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
import { resolvePreloadOutFile } from './preload-resolve'

/** Кастомная схема для локального видеопревью; привилегии обязаны зарегистрироваться до `app.whenReady`. */
registerFluxMediaPrivileges()

function parseDownloadsOpenPayload(raw: unknown): string | null {
  if (raw === null || raw === undefined) {
    return null
  }
  if (typeof raw === 'string') {
    const t = raw.trim()
    return t.length > 0 ? t : null
  }
  if (typeof raw === 'object' && raw !== null && 'text' in raw) {
    const v = (raw as { text?: unknown }).text
    if (typeof v === 'string') {
      const t = v.trim()
      return t.length > 0 ? t : null
    }
  }
  return null
}

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

let activeExportAbort: AbortController | null = null

function parseExportTrim(raw: unknown): MediaExportTrimPayload | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined
  }
  const o = raw as Record<string, unknown>
  if (typeof o.inSec !== 'number' || typeof o.outSec !== 'number') {
    return undefined
  }
  if (!Number.isFinite(o.inSec) || !Number.isFinite(o.outSec)) {
    return undefined
  }
  return { inSec: o.inSec, outSec: o.outSec }
}

function applyTheme(theme: AppTheme): void {
  cachedSettings = { ...cachedSettings, theme }
}

function refreshEnginePathOverridesSnapshot(): void {
  setEnginePathOverridesSnapshot(cachedSettings.engineExecutablePaths)
}

function persistEnginePathOverridesPatch(patch: EnginePathOverridesPatch): AppSettings {
  const nextPaths: EnginePathOverrides = { ...(cachedSettings.engineExecutablePaths ?? {}) }
  const ids: EngineId[] = ['ffmpeg', 'ffprobe', 'yt-dlp']
  for (const id of ids) {
    if (!(id in patch)) {
      continue
    }
    const v = patch[id]
    if (v === null || v === '') {
      delete nextPaths[id]
    } else if (typeof v === 'string' && v.trim() !== '') {
      nextPaths[id] = v.trim()
    }
  }
  const merged: AppSettings = { ...cachedSettings }
  if (Object.keys(nextPaths).length === 0) {
    delete merged.engineExecutablePaths
  } else {
    merged.engineExecutablePaths = nextPaths
  }
  cachedSettings = merged
  saveSettings(settingsPath(), cachedSettings)
  refreshEnginePathOverridesSnapshot()
  BrowserWindow.getAllWindows().forEach((w) => {
    w.webContents.send('fluxalloy:engine-paths-changed')
  })
  return { ...cachedSettings }
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
            focusOrCreateDownloadsWindow(undefined)
          }
        },
        {
          label: 'Вставить URL из буфера в менеджер…',
          accelerator: 'CmdOrCtrl+Shift+V',
          click: (): void => {
            const t = clipboard.readText().trim()
            focusOrCreateDownloadsWindow(t.length > 0 ? t : undefined)
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    {
      label: 'Настройки',
      submenu: [
        {
          label: 'Пути к движкам…',
          click: (): void => {
            const target = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0]
            if (!target || target.isDestroyed()) {
              return
            }
            target.webContents.send('fluxalloy:open-engine-paths')
          }
        }
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
      preload: resolvePreloadOutFile('index', __dirname),
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
  refreshEnginePathOverridesSnapshot()
  registerFluxMediaProtocol()
  registerDownloadsWindowIpcHandlers()

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

  ipcMain.handle('fluxalloy:settings-set-engine-paths', (_, patch: unknown): AppSettings => {
    if (!patch || typeof patch !== 'object') {
      return { ...cachedSettings }
    }
    return persistEnginePathOverridesPatch(patch as EnginePathOverridesPatch)
  })

  ipcMain.handle(
    'fluxalloy:pick-engine-executable',
    async (event, engineId: unknown): Promise<string | null> => {
      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) {
        return null
      }
      const id =
        engineId === 'ffmpeg' || engineId === 'ffprobe' || engineId === 'yt-dlp' ? engineId : null
      if (!id) {
        return null
      }
      const result = await dialog.showOpenDialog(win, {
        title: `Выберите исполняемый файл: ${id}`,
        properties: ['openFile'],
        filters:
          process.platform === 'win32'
            ? [
                { name: 'Исполняемые файлы', extensions: ['exe'] },
                { name: 'Все файлы', extensions: ['*'] }
              ]
            : [{ name: 'Все файлы', extensions: ['*'] }]
      })
      if (result.canceled || result.filePaths.length === 0) {
        return null
      }
      return result.filePaths[0] ?? null
    }
  )

  ipcMain.handle('fluxalloy:engines-status', async (): Promise<EnginesStatusSnapshot> => {
    return getEnginesStatus(resolveAppPaths(), cachedSettings.engineExecutablePaths)
  })

  ipcMain.handle('fluxalloy:engines-should-offer-download', (): boolean => {
    return isAnyEngineMissing(resolveAppPaths(), cachedSettings.engineExecutablePaths)
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
    return probeMediaFile(resolveAppPaths(), abs, cachedSettings.engineExecutablePaths)
  })

  ipcMain.handle('fluxalloy:clipboard-read-text', () => clipboard.readText())

  ipcMain.handle('fluxalloy:open-downloads-window', (_, raw: unknown) => {
    const payload = parseDownloadsOpenPayload(raw)
    focusOrCreateDownloadsWindow(payload ?? undefined)
  })

  ipcMain.handle(
    'fluxalloy:export-start',
    async (
      event,
      raw: unknown
    ): Promise<{ ok: true } | { ok: false; cancelled: true } | { ok: false; error: string }> => {
      if (activeExportAbort !== null) {
        return { ok: false, error: 'Уже выполняется экспорт' }
      }
      if (!raw || typeof raw !== 'object') {
        return { ok: false, error: 'Некорректный запрос' }
      }
      const inputRaw = (raw as { inputPath?: unknown }).inputPath
      if (typeof inputRaw !== 'string' || inputRaw.trim().length === 0) {
        return { ok: false, error: 'Не указан входной файл' }
      }
      const abs = resolve(normalize(inputRaw.trim()))
      if (!existsSync(abs)) {
        return { ok: false, error: 'Файл не найден' }
      }
      if (!isGrantedMediaPath(abs)) {
        return {
          ok: false,
          error: 'Нет доступа к этому файлу — откройте его через превью.'
        }
      }

      const pd = (raw as { probeDurationSec?: unknown }).probeDurationSec
      const probeDurationSec = typeof pd === 'number' && Number.isFinite(pd) && pd > 0 ? pd : null

      const trim = parseExportTrim((raw as { trim?: unknown }).trim)

      const paths = resolveAppPaths()
      const ffmpeg = resolveEngineExecutablePath(
        paths,
        'ffmpeg',
        cachedSettings.engineExecutablePaths
      )
      if (!ffmpeg) {
        return { ok: false, error: 'ffmpeg не найден — установите движки.' }
      }

      const win = BrowserWindow.fromWebContents(event.sender)
      if (!win) {
        return { ok: false, error: 'Нет активного окна' }
      }

      const stem = basename(abs).replace(/\.[^.]+$/, '')
      const pick = await dialog.showSaveDialog(win, {
        title: 'Экспорт в MP4',
        defaultPath: `${stem}-export.mp4`,
        filters: [
          { name: 'MP4', extensions: ['mp4'] },
          { name: 'Все файлы', extensions: ['*'] }
        ]
      })

      if (pick.canceled || !pick.filePath || pick.filePath.trim().length === 0) {
        return { ok: false, cancelled: true }
      }

      const outPath = pick.filePath.trim()
      const ac = new AbortController()
      activeExportAbort = ac

      const pushProgress = (p: FfmpegExportProgressPayload): void => {
        win.webContents.send('fluxalloy:export-progress', p)
      }

      try {
        pushProgress({ percent: -1, message: 'Запуск ffmpeg…' })
        const result = await runFfmpegExportJob({
          ffmpegPath: ffmpeg,
          inputPath: abs,
          outputPath: outPath,
          trim,
          probeDurationSec,
          signal: ac.signal,
          onProgress: pushProgress
        })
        return result.ok ? { ok: true } : { ok: false, error: result.error }
      } finally {
        activeExportAbort = null
      }
    }
  )

  ipcMain.handle('fluxalloy:export-cancel', (): { ok: true } | { ok: false; error: string } => {
    if (activeExportAbort === null) {
      return { ok: false, error: 'Нет активного экспорта' }
    }
    activeExportAbort.abort()
    return { ok: true }
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
