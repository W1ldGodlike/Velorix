/**
 * Типизированный контракт preload -> renderer (фрагмент VelorixApi).
 * IPC-каналы: `src/shared/ipc-channels.ts`; синхрон с `src/preload/index.ts`.
 */
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
export type VelorixApiDownloadsBlock = {
  downloads: {
    openWindow: (
      initial?: string | { text?: string; uiLocale?: 'ru' | 'en' } | null
    ) => Promise<void>
    addLines: (text: string) => Promise<{ ok: true; added: number } | { ok: false; error: string }>
    downloadFirstUrlOpenInMainEditor: (
      text: string
    ) => Promise<{ ok: true } | { ok: false; error: string }>
    getSnapshot: () => Promise<unknown[]>
    clearQueue: () => Promise<{ ok: true } | { ok: false; error: string }>
    clearFinished: () => Promise<{ ok: true; removed: number } | { ok: false; error: string }>
    removeRow: (id: number) => Promise<{ ok: true } | { ok: false; error: string }>
    moveRow: (id: number, direction: -1 | 1) => Promise<{ ok: true } | { ok: false; error: string }>
    getOutputDirectory: () => Promise<{ path: string; isDefault: boolean }>
    openOutputDirectory: () => Promise<{ ok: true } | { ok: false; error: string }>
    pickOutputDirectory: () => Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    >
    clearOutputDirectory: () => Promise<{ ok: true } | { ok: false; error: string }>
    pickCookiesFile: () => Promise<
      { ok: true; path: string } | { ok: false; cancelled: true } | { ok: false; error: string }
    >
    clearCookiesFile: () => Promise<{ ok: true } | { ok: false; error: string }>
    onSnapshot: (listener: (rows: unknown[]) => void) => () => void
    startQueue: () => Promise<{ ok: true } | { ok: false; error: string }>
    startRow: (id: number) => Promise<{ ok: true } | { ok: false; error: string }>
    retryRow: (id: number) => Promise<{ ok: true } | { ok: false; error: string }>
    cancelQueue: () => Promise<{ ok: true } | { ok: false; error: string }>
    getYtdlpPauseState: () => Promise<{
      supported: boolean
      active: boolean
      paused: boolean
    }>
    pauseYtdlp: () => Promise<{ ok: true } | { ok: false; error: string }>
    resumeYtdlp: () => Promise<{ ok: true } | { ok: false; error: string }>
    openQueueOutput: (
      id: number,
      mode: 'file' | 'folder'
    ) => Promise<{ ok: true } | { ok: false; error: string }>
    openQueueOutputInHandler: (id: number) => Promise<{ ok: true } | { ok: false; error: string }>
    extractQueueCover: (
      id: number
    ) => Promise<import('../shared/ffmpeg-cover-extract-contract').FfmpegCoverExtractResult>
    getCliOptions: (
      params?: YtdlpGetCliOptionsParams
    ) => Promise<{ ok: true; payload: YtdlpDownloadOptionsPayload } | { ok: false; error: string }>
    setCliOptions: (
      patch: YtdlpDownloadOptionsPatch
    ) => Promise<{ ok: true } | { ok: false; error: string }>
    getHistory: () => Promise<YtdlpDownloadHistoryEntry[]>
    getHistoryWeeklySummary: () => Promise<YtdlpDownloadHistoryWeeklySummary>
    clearHistory: () => Promise<{ ok: true } | { ok: false; error: string }>
    openHistoryOutput: (
      id: string,
      mode: 'file' | 'folder'
    ) => Promise<{ ok: true } | { ok: false; error: string }>
    openHistoryOutputInHandler: (id: string) => Promise<{ ok: true } | { ok: false; error: string }>
    saveVisibleLog: (
      text: string
    ) => Promise<{ ok: true; path: string } | { ok: false; error: string }>
    onLog: (listener: (payload: DownloadsLogPayload) => void) => () => void
    mergeUiPanels: (
      patch: Partial<DownloadsWindowUiPanelState>
    ) => Promise<{ ok: true } | { ok: false; error: string }>
    onDownloadsWindowUiPanelsChanged: (
      listener: (panels: DownloadsWindowUiPanelState) => void
    ) => () => void
    onDownloadsOutputDirectoryChanged: (
      listener: (
        snap: import('../shared/downloads-output-directory-snapshot').DownloadsOutputDirectorySnapshot
      ) => void
    ) => () => void
    onDownloadsCliOptionsChanged: (listener: () => void) => () => void
    onDownloadsHistoryChanged: (listener: () => void) => () => void
    bridgeOpenInspector: (
      mediaPath?: string | null
    ) => Promise<{ ok: true } | { ok: false; error: string }>
    bridgeFocusMainEditor: () => Promise<{ ok: true } | { ok: false; error: string }>
    bridgeOpenEnginePaths: () => Promise<{ ok: true } | { ok: false; error: string }>
    bridgeOpenAbout: () => Promise<{ ok: true } | { ok: false; error: string }>
  }
}
