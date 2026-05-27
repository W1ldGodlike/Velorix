import { BrowserWindow } from 'electron'

import { resolveAppPaths } from '../core/app-paths'
import type { DownloadsOutputDirectorySnapshot } from '../../shared/downloads-output-directory-snapshot'
import type { DownloadsWindowUiPanelState } from '../../shared/settings-contract'
import { DOWNLOADS_LOG_CHANNEL, type DownloadsLogPayload } from '../ipc/downloads/downloads-log-ipc'
import { schedulePersistDownloadsQueueDebounced } from '../services/ytdlp/ytdlp-download-queue-persist'
import { mainWindowIpc as mw } from '../../shared/ipc-channels'
import {
  isYtdlpDownloadDirectoryDefault,
  resolveYtdlpOutputDirectory
} from '../services/ytdlp/ytdlp-download-output'
import {
  DOWNLOADS_QUEUE_SNAPSHOT_CHANNEL,
  resolveMainEditorWindow
} from './downloads-window-runtime-hooks'
import { getDownloadsQueueSnapshotForRenderer } from './downloads-window-runtime-actions'

let broadcastThrottleTimer: ReturnType<typeof setTimeout> | null = null

function collectDownloadsShellBroadcastTargets(): BrowserWindow[] {
  const main = resolveMainEditorWindow()
  if (!main || main.isDestroyed()) {
    return []
  }
  return [main]
}

/** Отправить очередь в shell-вкладку «Загрузки» без полной перезагрузки документа. */
export function broadcastDownloadsSnapshot(): void {
  schedulePersistDownloadsQueueDebounced()
  if (broadcastThrottleTimer !== null) {
    return
  }
  broadcastThrottleTimer = setTimeout(() => {
    broadcastThrottleTimer = null
    try {
      const rows = getDownloadsQueueSnapshotForRenderer()
      for (const win of collectDownloadsShellBroadcastTargets()) {
        win.webContents.send(DOWNLOADS_QUEUE_SNAPSHOT_CHANNEL, rows)
      }
    } catch {
      /* окно закрывается */
    }
  }, 120)
}

export function broadcastDownloadsLogPayload(payload: DownloadsLogPayload): void {
  for (const win of collectDownloadsShellBroadcastTargets()) {
    try {
      win.webContents.send(DOWNLOADS_LOG_CHANNEL, payload)
    } catch {
      /* окно закрывается */
    }
  }
}

/** §6.1 — раскрытие секций rail / история / лог в shell-вкладке «Загрузки». */
export function broadcastDownloadsWindowUiPanelsSnapshot(
  snap: DownloadsWindowUiPanelState = {}
): void {
  for (const w of collectDownloadsShellBroadcastTargets()) {
    try {
      w.webContents.send(mw.downloadsWindowUiPanelsChanged, snap)
    } catch {
      /* окно закрывается */
    }
  }
}

/** §6.2 — yt-dlp CLI/options: shell-вкладка «Загрузки» после persist patch/cookies. */
export function broadcastDownloadsCliOptionsChanged(): void {
  for (const w of collectDownloadsShellBroadcastTargets()) {
    try {
      w.webContents.send(mw.downloadsCliOptionsChanged)
    } catch {
      /* окно закрывается */
    }
  }
}

/** §6.2 — каталог вывода yt-dlp: shell-вкладка «Загрузки» после pick/clear. */
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
  for (const w of collectDownloadsShellBroadcastTargets()) {
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
  const keys = [
    'settings',
    'history',
    'log',
    'format',
    'metadata',
    'saving',
    'network',
    'expert',
    'hints'
  ] as const satisfies ReadonlyArray<Exclude<keyof DownloadsWindowUiPanelState, 'historyListMode'>>
  const o = raw as Record<string, unknown>
  const out: Partial<DownloadsWindowUiPanelState> = {}
  for (const k of keys) {
    if (typeof o[k] === 'boolean') {
      out[k] = o[k]
    }
  }
  if (o['historyListMode'] === 'compact' || o['historyListMode'] === 'full') {
    out.historyListMode = o['historyListMode']
  }
  return out
}
