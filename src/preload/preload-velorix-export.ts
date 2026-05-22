import { ipcRenderer } from 'electron'

import type {
  FfmpegExportProgressPayload,
  FfmpegExportVideoLut3dId,
  MediaExportRequestPayload,
  MediaExportStartResult
} from '../shared/ffmpeg-export-contract'
import type {
  FfmpegExportBenchmarkProgressPayload,
  FfmpegExportBenchmarkRequestPayload,
  FfmpegExportBenchmarkResult
} from '../shared/ffmpeg-export-benchmark-contract'
import type {
  FfmpegFramesExtractProgressPayload,
  FfmpegFramesExtractRequestPayload,
  FfmpegFramesExtractResult
} from '../shared/ffmpeg-frames-extract-contract'
import type {
  FfmpegVideoSpriteRequestPayload,
  FfmpegVideoSpriteResult
} from '../shared/ffmpeg-video-sprite-contract'
import type {
  FfmpegExportBatchAddPathsResult,
  FfmpegExportBatchOpenInputResult,
  FfmpegExportBatchPickFilesResult,
  FfmpegExportBatchSnapshot,
  FfmpegExportBatchConcurrency,
  FfmpegExportBatchStartResult
} from '../shared/ffmpeg-export-batch-contract'
import type {
  ProcessingHistoryEntry,
  ProcessingHistoryFilter,
  ProcessingHistoryWeeklySummary
} from '../shared/processing-history-contract'
import { mainWindowIpc as mw } from '../shared/ipc-channels'

/** export / batchExport / processingHistory — ffmpeg IPC (main preload). */
export const velorixExport = {
  start: (payload: MediaExportRequestPayload): Promise<MediaExportStartResult> =>
    ipcRenderer.invoke(mw.exportStart, payload),
  runBenchmark: (
    payload: FfmpegExportBenchmarkRequestPayload
  ): Promise<FfmpegExportBenchmarkResult> =>
    ipcRenderer.invoke(mw.exportBenchmarkEncoders, payload),
  extractFrames: (payload: FfmpegFramesExtractRequestPayload): Promise<FfmpegFramesExtractResult> =>
    ipcRenderer.invoke(mw.extractFrames, payload),
  generateVideoSprite: (
    payload: FfmpegVideoSpriteRequestPayload
  ): Promise<FfmpegVideoSpriteResult> => ipcRenderer.invoke(mw.generateVideoSprite, payload),
  resolveBundledLutCubePath: (preset: FfmpegExportVideoLut3dId): Promise<string | null> =>
    ipcRenderer.invoke(mw.exportResolveBundledLutCubePath, preset),
  cancel: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(mw.exportCancel),
  openOutput: (
    path: string,
    mode: 'file' | 'folder' | 'preview'
  ): Promise<{ ok: true; path: string } | { ok: false; error: string }> =>
    ipcRenderer.invoke(mw.exportOpenOutput, { path, mode }),
  onProgress: (listener: (progress: FfmpegExportProgressPayload) => void): (() => void) => {
    const channel = mw.exportProgress
    const handler = (_event: unknown, raw: unknown): void => {
      if (!raw || typeof raw !== 'object') {
        return
      }
      listener(raw as FfmpegExportProgressPayload)
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
  },
  onBenchmarkProgress: (
    listener: (progress: FfmpegExportBenchmarkProgressPayload) => void
  ): (() => void) => {
    const channel = mw.exportBenchmarkProgress
    const handler = (_event: unknown, raw: unknown): void => {
      if (!raw || typeof raw !== 'object') {
        return
      }
      listener(raw as FfmpegExportBenchmarkProgressPayload)
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
  },
  onExtractFramesProgress: (
    listener: (progress: FfmpegFramesExtractProgressPayload) => void
  ): (() => void) => {
    const channel = mw.extractFramesProgress
    const handler = (_event: unknown, raw: unknown): void => {
      if (!raw || typeof raw !== 'object') {
        return
      }
      listener(raw as FfmpegFramesExtractProgressPayload)
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
  }
}

export const velorixBatchExport = {
  getSnapshot: (): Promise<FfmpegExportBatchSnapshot> =>
    ipcRenderer.invoke(mw.batchExportGetSnapshot),
  listInputPaths: (): Promise<{ ok: true; paths: string[] }> =>
    ipcRenderer.invoke(mw.batchExportListInputPaths),
  listOutputPaths: (): Promise<{ ok: true; paths: string[] }> =>
    ipcRenderer.invoke(mw.batchExportListOutputPaths),
  removeWaiting: (): Promise<{ ok: true; removed: number } | { ok: false; error: string }> =>
    ipcRenderer.invoke(mw.batchExportRemoveWaiting),
  pickFiles: (): Promise<FfmpegExportBatchPickFilesResult> =>
    ipcRenderer.invoke(mw.batchExportPickFiles),
  pickFolder: (): Promise<FfmpegExportBatchPickFilesResult> =>
    ipcRenderer.invoke(mw.batchExportPickFolder),
  pickOutputFolder: (): Promise<{ ok: true; path: string } | { ok: false; cancelled: true }> =>
    ipcRenderer.invoke(mw.batchExportPickOutputFolder),
  revealSharedOutputFolder: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(mw.batchExportRevealSharedOutputFolder),
  addPaths: (paths: string[]): Promise<FfmpegExportBatchAddPathsResult> =>
    ipcRenderer.invoke(mw.batchExportAddPaths, paths),
  openInput: (
    path: string,
    mode: 'file' | 'folder' | 'preview'
  ): Promise<FfmpegExportBatchOpenInputResult> =>
    ipcRenderer.invoke(mw.batchExportOpenInput, { path, mode }),
  removeRows: (ids: number[]): Promise<{ ok: true; removed: number }> =>
    ipcRenderer.invoke(mw.batchExportRemoveRows, ids),
  clear: (): Promise<{ ok: true }> => ipcRenderer.invoke(mw.batchExportClear),
  moveRow: (
    id: number,
    direction: 'up' | 'down'
  ): Promise<{ ok: true; moved: boolean } | { ok: false; error: string }> =>
    ipcRenderer.invoke(mw.batchExportMoveRow, { id, direction }),
  reorderRow: (
    id: number,
    toIndex: number
  ): Promise<{ ok: true; moved: boolean } | { ok: false; error: string }> =>
    ipcRenderer.invoke(mw.batchExportReorderRow, { id, toIndex }),
  setConcurrency: (value: FfmpegExportBatchConcurrency): Promise<{ ok: true }> =>
    ipcRenderer.invoke(mw.batchExportSetConcurrency, value),
  start: (rawExportOverrides?: unknown): Promise<FfmpegExportBatchStartResult> =>
    ipcRenderer.invoke(mw.batchExportStart, rawExportOverrides ?? null),
  cancel: (): Promise<{ ok: true }> => ipcRenderer.invoke(mw.batchExportCancel),
  retryFailed: (): Promise<{ ok: true; reset: number } | { ok: false; error: string }> =>
    ipcRenderer.invoke(mw.batchExportRetryFailed),
  retryRows: (ids: number[]): Promise<{ ok: true; reset: number } | { ok: false; error: string }> =>
    ipcRenderer.invoke(mw.batchExportRetryRows, ids),
  clearCompleted: (): Promise<{ ok: true; removed: number } | { ok: false; error: string }> =>
    ipcRenderer.invoke(mw.batchExportClearCompleted),
  addFromDownloadsDone: (
    ids?: number[]
  ): Promise<{ ok: true; added: number } | { ok: false; error: string }> =>
    ipcRenderer.invoke(mw.batchExportAddFromDownloadsDone, ids ?? []),
  addFromHistoryInputs: (
    ids: string[]
  ): Promise<{ ok: true; added: number } | { ok: false; error: string }> =>
    ipcRenderer.invoke(mw.batchExportAddFromHistoryInputs, ids),
  retryFailedAndStart: (rawExportOverrides?: unknown): Promise<FfmpegExportBatchStartResult> =>
    ipcRenderer.invoke(mw.batchExportRetryFailedAndStart, rawExportOverrides ?? null),
  onSnapshot: (listener: (snapshot: FfmpegExportBatchSnapshot) => void): (() => void) => {
    const channel = mw.batchExportSnapshot
    const handler = (_event: unknown, raw: unknown): void => {
      if (!raw || typeof raw !== 'object') {
        return
      }
      listener(raw as FfmpegExportBatchSnapshot)
    }
    ipcRenderer.on(channel, handler)
    return (): void => {
      ipcRenderer.removeListener(channel, handler)
    }
  }
}

export const velorixProcessingHistory = {
  get: (filter?: ProcessingHistoryFilter & { limit?: number }): Promise<ProcessingHistoryEntry[]> =>
    ipcRenderer.invoke(mw.processingHistoryGet, filter ?? {}),
  weeklySummary: (): Promise<ProcessingHistoryWeeklySummary> =>
    ipcRenderer.invoke(mw.processingHistoryWeeklySummary),
  clear: (): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(mw.processingHistoryClear),
  openOutput: (
    id: string,
    mode: 'file' | 'folder' | 'preview'
  ): Promise<{ ok: true; path: string } | { ok: false; error: string }> =>
    ipcRenderer.invoke(mw.processingHistoryOpenOutput, { id, mode }),
  openInputInHandler: (id: string): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke(mw.processingHistoryOpenInputInHandler, id),
  repeatWorkflowScenario: (
    id: string
  ): Promise<
    | { ok: true }
    | { ok: false; error: string }
    | {
        ok: false
        errorCode:
          | import('../shared/workflow-watch-folder-contract').WorkflowRunScenarioOnFileError
          | import('../shared/workflow-watch-folder-contract').WorkflowRunScenarioOnUrlError
      }
  > => ipcRenderer.invoke(mw.processingHistoryRepeatWorkflowScenario, id)
}
