/**
 * Типизированный контракт preload -> renderer (фрагмент FluxAlloyApi).
 * IPC-каналы: `src/shared/ipc-channels.ts`; синхрон с `src/preload/index.ts`.
 */
import type {
  FfmpegExportBatchAddPathsResult,
  FfmpegExportBatchConcurrency,
  FfmpegExportBatchOpenInputResult,
  FfmpegExportBatchPickFilesResult,
  FfmpegExportBatchSnapshot,
  FfmpegExportBatchStartResult
} from '../shared/ffmpeg-export-batch-contract'
import type {
  FfmpegExportProgressPayload,
  FfmpegExportVideoLut3dId,
  MediaExportRequestPayload,
  MediaExportStartResult
} from '../shared/ffmpeg-export-contract'
export type FluxAlloyApiExportBlock = {
  export: {
    start: (payload: MediaExportRequestPayload) => Promise<MediaExportStartResult>
    runBenchmark: (
      payload: import('../shared/ffmpeg-export-benchmark-contract').FfmpegExportBenchmarkRequestPayload
    ) => Promise<import('../shared/ffmpeg-export-benchmark-contract').FfmpegExportBenchmarkResult>
    resolveBundledLutCubePath: (preset: FfmpegExportVideoLut3dId) => Promise<string | null>
    cancel: () => Promise<{ ok: true } | { ok: false; error: string }>
    openOutput: (
      path: string,
      mode: 'file' | 'folder' | 'preview'
    ) => Promise<{ ok: true; path: string } | { ok: false; error: string }>
    onProgress: (listener: (progress: FfmpegExportProgressPayload) => void) => () => void
    onBenchmarkProgress: (
      listener: (
        progress: import('../shared/ffmpeg-export-benchmark-contract').FfmpegExportBenchmarkProgressPayload
      ) => void
    ) => () => void
    extractFrames: (
      payload: import('../shared/ffmpeg-frames-extract-contract').FfmpegFramesExtractRequestPayload
    ) => Promise<import('../shared/ffmpeg-frames-extract-contract').FfmpegFramesExtractResult>
    onExtractFramesProgress: (
      listener: (
        progress: import('../shared/ffmpeg-frames-extract-contract').FfmpegFramesExtractProgressPayload
      ) => void
    ) => () => void
  }
  batchExport: {
    getSnapshot: () => Promise<FfmpegExportBatchSnapshot>
    listInputPaths: () => Promise<{ ok: true; paths: string[] }>
    listOutputPaths: () => Promise<{ ok: true; paths: string[] }>
    removeWaiting: () => Promise<{ ok: true; removed: number } | { ok: false; error: string }>
    pickFiles: () => Promise<FfmpegExportBatchPickFilesResult>
    pickFolder: () => Promise<FfmpegExportBatchPickFilesResult>
    pickOutputFolder: () => Promise<{ ok: true; path: string } | { ok: false; cancelled: true }>
    revealSharedOutputFolder: () => Promise<{ ok: true } | { ok: false; error: string }>
    addPaths: (paths: string[]) => Promise<FfmpegExportBatchAddPathsResult>
    openInput: (
      path: string,
      mode: 'file' | 'folder' | 'preview'
    ) => Promise<FfmpegExportBatchOpenInputResult>
    removeRows: (ids: number[]) => Promise<{ ok: true; removed: number }>
    clear: () => Promise<{ ok: true }>
    moveRow: (
      id: number,
      direction: 'up' | 'down'
    ) => Promise<{ ok: true; moved: boolean } | { ok: false; error: string }>
    reorderRow: (
      id: number,
      toIndex: number
    ) => Promise<{ ok: true; moved: boolean } | { ok: false; error: string }>
    setConcurrency: (value: FfmpegExportBatchConcurrency) => Promise<{ ok: true }>
    start: (rawExportOverrides?: unknown) => Promise<FfmpegExportBatchStartResult>
    cancel: () => Promise<{ ok: true }>
    retryFailed: () => Promise<{ ok: true; reset: number } | { ok: false; error: string }>
    retryRows: (
      ids: number[]
    ) => Promise<{ ok: true; reset: number } | { ok: false; error: string }>
    clearCompleted: () => Promise<{ ok: true; removed: number } | { ok: false; error: string }>
    addFromDownloadsDone: (ids?: number[]) => Promise<FfmpegExportBatchAddPathsResult>
    addFromHistoryInputs: (ids: string[]) => Promise<FfmpegExportBatchAddPathsResult>
    retryFailedAndStart: (rawExportOverrides?: unknown) => Promise<FfmpegExportBatchStartResult>
    onSnapshot: (listener: (snapshot: FfmpegExportBatchSnapshot) => void) => () => void
  }
}
