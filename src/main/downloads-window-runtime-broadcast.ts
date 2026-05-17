import { BrowserWindow } from 'electron'

import { resolveAppPaths } from './app-paths'
import type { DownloadsOutputDirectorySnapshot } from '../shared/downloads-output-directory-snapshot'
import type { DownloadsWindowUiPanelState } from '../shared/settings-contract'
import { DOWNLOADS_LOG_CHANNEL, type DownloadsLogPayload } from './downloads-log-ipc'
import { schedulePersistDownloadsQueueDebounced } from './ytdlp-download-queue-persist'
import { mainWindowIpc as mw } from '../shared/ipc-channels'
import {
  isYtdlpDownloadDirectoryDefault,
  resolveYtdlpOutputDirectory
} from './ytdlp-download-output'
import {
  DOWNLOADS_QUEUE_SNAPSHOT_CHANNEL,
  getDownloadsPopoutWindow,
  resolveMainEditorWindow
} from './downloads-window-runtime-hooks'
import { getDownloadsQueueSnapshotForRenderer } from './downloads-window-runtime-actions'

let broadcastThrottleTimer: ReturnType<typeof setTimeout> | null = null

/** Отправить очередь во все UI-представления загрузок без полной перезагрузки документа. */
export function broadcastDownloadsSnapshot(): void {
  schedulePersistDownloadsQueueDebounced()
  if (broadcastThrottleTimer !== null) {
    return
  }
  broadcastThrottleTimer = setTimeout(() => {
    broadcastThrottleTimer = null
    try {
      const rows = getDownloadsQueueSnapshotForRenderer()
      const popout = getDownloadsPopoutWindow()
      if (popout && !popout.isDestroyed()) {
        popout.webContents.send(DOWNLOADS_QUEUE_SNAPSHOT_CHANNEL, rows)
      }
      const mainWindow = resolveMainEditorWindow()
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(DOWNLOADS_QUEUE_SNAPSHOT_CHANNEL, rows)
      }
    } catch {
      /* окно закрывается */
    }
  }, 120)
}

export function broadcastDownloadsLogPayload(payload: DownloadsLogPayload): void {
  const targets = [getDownloadsPopoutWindow(), resolveMainEditorWindow()]
  for (const win of targets) {
    if (!win || win.isDestroyed()) {
      continue
    }
    try {
      win.webContents.send(DOWNLOADS_LOG_CHANNEL, payload)
    } catch {
      /* окно закрывается */
    }
  }
}

/** §6.1 — раскрытие секций rail / история / лог: pop-out ↔ вкладка «Загрузки» в главном окне. */
export function broadcastDownloadsWindowUiPanelsSnapshot(
  snap: DownloadsWindowUiPanelState = {}
): void {
  const targets: BrowserWindow[] = []
  const popout = getDownloadsPopoutWindow()
  if (popout && !popout.isDestroyed()) {
    targets.push(popout)
  }
  const mainEditor = resolveMainEditorWindow()
  if (mainEditor && !mainEditor.isDestroyed()) {
    targets.push(mainEditor)
  }
  for (const w of targets) {
    try {
      w.webContents.send(mw.downloadsWindowUiPanelsChanged, snap)
    } catch {
      /* окно закрывается */
    }
  }
}

/** §6.2 — yt-dlp CLI/options: вкладка «Загрузки» ↔ pop-out после persist patch/cookies. */
export function broadcastDownloadsCliOptionsChanged(): void {
  const targets: BrowserWindow[] = []
  const popout = getDownloadsPopoutWindow()
  if (popout && !popout.isDestroyed()) {
    targets.push(popout)
  }
  const mainEditor = resolveMainEditorWindow()
  if (mainEditor && !mainEditor.isDestroyed()) {
    targets.push(mainEditor)
  }
  for (const w of targets) {
    try {
      w.webContents.send(mw.downloadsCliOptionsChanged)
    } catch {
      /* окно закрывается */
    }
  }
}

/** §6.2 — каталог вывода yt-dlp: вкладка «Загрузки» ↔ pop-out после pick/clear. */
export function broadcastDownloadsOutputDirectorySnapshot(
  snap?: DownloadsOutputDirectorySnapshot
): void {
  const paths = resolveAppPaths()
  const payload: DownloadsOutputDirectorySnapshot =
    snap ??
    ({
      path: resolveYtdlpOutputDirectory(paths.userData),
      isDefault: isYtdlpDownloadDirectoryDefault()
    } as const)
  const targets: BrowserWindow[] = []
  const popout = getDownloadsPopoutWindow()
  if (popout && !popout.isDestroyed()) {
    targets.push(popout)
  }
  const mainEditor = resolveMainEditorWindow()
  if (mainEditor && !mainEditor.isDestroyed()) {
    targets.push(mainEditor)
  }
  for (const w of targets) {
    try {
      w.webContents.send(mw.downloadsOutputDirectoryChanged, payload)
    } catch {
      /* окно закрывается */
    }
  }
}

export function sanitizeDownloadsUiPanelPatch(raw: unknown): Partial<DownloadsWindowUiPanelState> {
  if (!raw || typeof raw !== 'object') {
    return {}
  }
  const keys: (keyof DownloadsWindowUiPanelState)[] = [
    'history',
    'log',
    'format',
    'metadata',
    'saving',
    'network',
    'expert',
    'hints'
  ]
  const o = raw as Record<string, unknown>
  const out: Partial<DownloadsWindowUiPanelState> = {}
  for (const k of keys) {
    if (typeof o[k] === 'boolean') {
      out[k] = o[k]
    }
  }
  return out
}
