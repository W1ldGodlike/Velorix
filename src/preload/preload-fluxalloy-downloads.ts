import { ipcRenderer } from 'electron'

import { sanitizeDownloadsOutputDirectorySnapshot } from '../shared/downloads-output-directory-snapshot'
import type { DownloadsOutputDirectorySnapshot } from '../shared/downloads-output-directory-snapshot'
import type { DownloadsLogPayload } from '../shared/downloads-log-contract'
import type { DownloadsWindowUiPanelState } from '../shared/settings-contract'
import type {
  YtdlpDownloadOptionsPatch,
  YtdlpDownloadOptionsPayload,
  YtdlpGetCliOptionsParams
} from '../shared/ytdlp-download-contract'
import type {
  YtdlpDownloadHistoryEntry,
  YtdlpDownloadHistoryWeeklySummary
} from '../shared/ytdlp-history-contract'
import { downloadsIpc as d, mainWindowIpc as mw } from '../shared/ipc-channels'

import { isDownloadsLogPayload, sanitizeDownloadsWindowUiPanelState } from './preload-sanitize'

/** downloads.* — очередь yt-dlp, история, pop-out sync (main preload). */
export const fluxalloyDownloads = {
  openWindow: (
    initial?: string | { text?: string; uiLocale?: 'ru' | 'en' } | null
  ): Promise<void> => ipcRenderer.invoke(mw.openDownloadsWindow, initial ?? null),
  addLines: (text: string): Promise<{ ok: true; added: number } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.addLines, text),
  downloadFirstUrlOpenInMainEditor: (
    text: string
  ): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.downloadFirstUrlOpenInMainEditor, text),
  getSnapshot: (): Promise<unknown[]> => ipcRenderer.invoke(d.getSnapshot),
  clearQueue: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.clear),
  clearFinished: (): Promise<{ ok: true; removed: number } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.clearFinished),
  removeRow: (id: number): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.remove, id),
  moveRow: (id: number, direction: -1 | 1): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.move, id, direction),
  getOutputDirectory: (): Promise<{ path: string; isDefault: boolean }> =>
    ipcRenderer.invoke(d.getOutputDir),
  openOutputDirectory: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.openOutputDir),
  pickOutputDirectory: (): Promise<
    { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
  > => ipcRenderer.invoke(d.pickOutputDir),
  clearOutputDirectory: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.clearOutputDir),
  pickCookiesFile: (): Promise<
    { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
  > => ipcRenderer.invoke(d.pickCookiesFile),
  clearCookiesFile: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.clearCookiesFile),
  onSnapshot: (listener: (rows: unknown[]) => void): (() => void) => {
    const handler = (_event: unknown, rows: unknown): void => {
      listener(Array.isArray(rows) ? rows : [])
    }
    ipcRenderer.on(d.queueSnapshot, handler)
    return (): void => {
      ipcRenderer.removeListener(d.queueSnapshot, handler)
    }
  },
  startQueue: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.startQueue),
  startRow: (id: number): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.startRow, id),
  retryRow: (id: number): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.retryRow, id),
  cancelQueue: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.cancelRun),
  getYtdlpPauseState: (): Promise<{
    supported: boolean
    active: boolean
    paused: boolean
  }> => ipcRenderer.invoke(d.getYtdlpPauseState),
  pauseYtdlp: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.pauseYtdlp),
  resumeYtdlp: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.resumeYtdlp),
  openQueueOutput: (
    id: number,
    mode: 'file' | 'folder'
  ): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.openQueueOutput, id, mode),
  openQueueOutputInHandler: (id: number): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.openQueueOutputInHandler, id),
  extractQueueCover: (
    id: number
  ): Promise<import('../shared/ffmpeg-cover-extract-contract').FfmpegCoverExtractResult> =>
    ipcRenderer.invoke(d.extractQueueCover, id),
  getCliOptions: (
    params?: YtdlpGetCliOptionsParams
  ): Promise<{ ok: true; payload: YtdlpDownloadOptionsPayload } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.getCliOptions, params),
  setCliOptions: (
    patch: YtdlpDownloadOptionsPatch
  ): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.setCliOptions, patch),
  getHistory: (): Promise<YtdlpDownloadHistoryEntry[]> => ipcRenderer.invoke(d.getHistory),
  getHistoryWeeklySummary: (): Promise<YtdlpDownloadHistoryWeeklySummary> =>
    ipcRenderer.invoke(d.getHistoryWeeklySummary),
  clearHistory: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.clearHistory),
  openHistoryOutput: (
    id: string,
    mode: 'file' | 'folder'
  ): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.openHistoryOutput, id, mode),
  openHistoryOutputInHandler: (id: string): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.openHistoryOutputInHandler, id),
  saveVisibleLog: (
    text: string
  ): Promise<{ ok: true; path: string } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.saveVisibleLog, text),
  onLog: (listener: (payload: DownloadsLogPayload) => void): (() => void) => {
    const handler = (_event: unknown, raw: unknown): void => {
      if (isDownloadsLogPayload(raw)) {
        listener(raw)
      }
    }
    ipcRenderer.on(d.log, handler)
    return (): void => {
      ipcRenderer.removeListener(d.log, handler)
    }
  },
  /** Общее с pop-out §6: `downloadsWindowUiPanels` в settings (санитайз в main). */
  mergeUiPanels: (
    patch: Partial<DownloadsWindowUiPanelState>
  ): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.mergeUiPanels, patch),
  /** Main → renderer: полный снимок панелей после merge (вкладка «Загрузки» и pop-out). */
  onDownloadsWindowUiPanelsChanged: (
    listener: (panels: DownloadsWindowUiPanelState) => void
  ): (() => void) => {
    const channel = mw.downloadsWindowUiPanelsChanged
    const handler = (_: unknown, raw: unknown): void => {
      listener(sanitizeDownloadsWindowUiPanelState(raw))
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
  },
  /** Main → renderer: каталог вывода yt-dlp после pick/clear (вкладка «Загрузки» ↔ pop-out). */
  onDownloadsOutputDirectoryChanged: (
    listener: (snap: DownloadsOutputDirectorySnapshot) => void
  ): (() => void) => {
    const channel = mw.downloadsOutputDirectoryChanged
    const handler = (_: unknown, raw: unknown): void => {
      listener(sanitizeDownloadsOutputDirectorySnapshot(raw))
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
  },
  /** Main → renderer: yt-dlp CLI/options изменились (вызовите getCliOptions). */
  onDownloadsCliOptionsChanged: (listener: () => void): (() => void) => {
    const channel = mw.downloadsCliOptionsChanged
    const handler = (): void => {
      listener()
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
  },
  bridgeOpenInspector: (
    mediaPath?: string | null
  ): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.bridgeOpenInspector, mediaPath ?? null),
  bridgeFocusMainEditor: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.bridgeFocusMainEditor),
  bridgeOpenEnginePaths: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.bridgeOpenEnginePaths),
  bridgeOpenAbout: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(d.bridgeOpenAbout)
}
