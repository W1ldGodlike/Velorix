import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('electron', () => {
  class MockBrowserWindow {
    isDestroyed(): boolean {
      return false
    }
    webContents = {}
    static getAllWindows(): MockBrowserWindow[] {
      return []
    }
  }
  return {
    BrowserWindow: MockBrowserWindow,
    ipcMain: { on: vi.fn(), handle: vi.fn() }
  }
})

vi.mock('@electron-toolkit/utils', () => ({
  is: { dev: true }
}))

const hoisted = vi.hoisted(() => ({
  userDataRoot: '',
  getYtdlpSnapshot: vi.fn(),
  emitDownloadsLog: vi.fn(),
  runBatch: vi.fn(),
  isBatchActive: vi.fn(() => false)
}))

vi.mock('../../src/main/services/ytdlp/ytdlp-run-options-sync', () => ({
  getYtdlpRunOptionsSnapshot: (): ReturnType<typeof hoisted.getYtdlpSnapshot> =>
    hoisted.getYtdlpSnapshot()
}))

vi.mock('../../src/main/ipc/downloads/downloads-log-ipc', () => ({
  emitDownloadsLog: (...args: unknown[]): ReturnType<typeof hoisted.emitDownloadsLog> =>
    hoisted.emitDownloadsLog(...args)
}))

vi.mock('../../src/main/core/media-protocol', () => ({
  grantMediaPath: vi.fn()
}))

vi.mock('../../src/main/services/ffmpeg/ffmpeg-export-batch-runner', () => ({
  isFfmpegExportBatchActive: (): boolean => hoisted.isBatchActive(),
  runFfmpegExportBatchQueue: (...args: unknown[]): ReturnType<typeof hoisted.runBatch> =>
    hoisted.runBatch(...args)
}))

vi.mock('../../src/main/core/app-paths', () => ({
  resolveAppPaths: () => ({
    userData: hoisted.userDataRoot,
    resources: hoisted.userDataRoot
  })
}))

vi.mock('../../src/main/services/engines/engine-service', () => ({
  resolveEngineExecutablePath: () => 'ffmpeg'
}))

vi.mock('../../src/main/core/export-progress-broadcast', () => ({
  sendExportProgress: vi.fn()
}))

import {
  addFfmpegExportBatchPaths,
  clearFfmpegExportBatchQueue,
  getFfmpegExportBatchSnapshot
} from '../../src/main/services/ffmpeg/ffmpeg-export-batch-queue'
import {
  configureMainFfmpegExportBatchHost,
  launchFfmpegExportBatchRunner,
  scheduleEnqueueBatchAfterDownload
} from '../../src/main/services/ffmpeg/main-ffmpeg-export-batch-host'

async function flushAsync(): Promise<void> {
  await new Promise<void>((resolve) => {
    setImmediate(resolve)
  })
}

describe('scheduleEnqueueBatchAfterDownload §7.4.2', () => {
  beforeEach(() => {
    hoisted.userDataRoot = mkdtempSync(join(tmpdir(), 'fa-batch-host-'))
    clearFfmpegExportBatchQueue()
    hoisted.getYtdlpSnapshot.mockReset()
    hoisted.emitDownloadsLog.mockReset()
    hoisted.runBatch.mockReset()
    hoisted.isBatchActive.mockReturnValue(false)
    hoisted.getYtdlpSnapshot.mockReturnValue({
      autoStartBatchAfterEnqueue: false
    })
    configureMainFfmpegExportBatchHost({
      isExportBusy: () => false,
      getSettings: () => ({ uiLocale: 'ru', theme: 'dark' }) as never,
      getEnginePathOverrides: () => ({}),
      mainDownloadsUiLocale: () => 'ru',
      rememberExportOutputPath: vi.fn(),
      rememberFfmpegExportDirectory: vi.fn(),
      broadcastBatchSnapshot: vi.fn()
    })
  })

  afterEach(() => {
    rmSync(hoisted.userDataRoot, { recursive: true, force: true })
  })

  it('adds video to batch queue after download', async () => {
    const video = join(hoisted.userDataRoot, 'clip.mp4')
    writeFileSync(video, 'stub')

    scheduleEnqueueBatchAfterDownload(video, 3)
    await flushAsync()

    const snap = getFfmpegExportBatchSnapshot()
    expect(snap.rows.some((r) => r.inputPath === video)).toBe(true)
    expect(hoisted.runBatch).not.toHaveBeenCalled()
  })

  it('auto-starts batch when autoStartBatchAfterEnqueue is on', async () => {
    const video = join(hoisted.userDataRoot, 'done.mp4')
    writeFileSync(video, 'stub')
    hoisted.getYtdlpSnapshot.mockReturnValue({ autoStartBatchAfterEnqueue: true })
    hoisted.runBatch.mockResolvedValue(undefined)

    scheduleEnqueueBatchAfterDownload(video, 4)
    await flushAsync()

    expect(hoisted.runBatch).toHaveBeenCalled()
  })

  it('skips enqueue for non-video extension', async () => {
    const image = join(hoisted.userDataRoot, 'cover.jpg')
    writeFileSync(image, 'stub')

    scheduleEnqueueBatchAfterDownload(image, 5)
    await flushAsync()

    expect(getFfmpegExportBatchSnapshot().rows).toHaveLength(0)
    expect(hoisted.emitDownloadsLog).toHaveBeenCalled()
  })
})

describe('launchFfmpegExportBatchRunner §7.3', () => {
  beforeEach(() => {
    hoisted.userDataRoot = mkdtempSync(join(tmpdir(), 'fa-batch-launch-'))
    clearFfmpegExportBatchQueue()
    hoisted.runBatch.mockReset()
    hoisted.isBatchActive.mockReturnValue(false)
    hoisted.runBatch.mockResolvedValue(undefined)
    configureMainFfmpegExportBatchHost({
      isExportBusy: () => false,
      getSettings: () => ({ uiLocale: 'ru', theme: 'dark' }) as never,
      getEnginePathOverrides: () => ({}),
      mainDownloadsUiLocale: () => 'ru',
      rememberExportOutputPath: vi.fn(),
      rememberFfmpegExportDirectory: vi.fn(),
      broadcastBatchSnapshot: vi.fn()
    })
  })

  afterEach(() => {
    rmSync(hoisted.userDataRoot, { recursive: true, force: true })
  })

  it('starts runner when waiting rows exist', () => {
    const video = join(hoisted.userDataRoot, 'batch.mp4')
    writeFileSync(video, 'stub')
    addFfmpegExportBatchPaths([video])

    expect(launchFfmpegExportBatchRunner()).toBe(true)
    expect(hoisted.runBatch).toHaveBeenCalled()
  })

  it('returns false when batch runner already active', () => {
    const video = join(hoisted.userDataRoot, 'busy.mp4')
    writeFileSync(video, 'stub')
    addFfmpegExportBatchPaths([video])
    hoisted.isBatchActive.mockReturnValue(true)

    expect(launchFfmpegExportBatchRunner()).toBe(false)
    expect(hoisted.runBatch).not.toHaveBeenCalled()
  })

  it('returns false when queue has no waiting rows', () => {
    expect(launchFfmpegExportBatchRunner()).toBe(false)
    expect(hoisted.runBatch).not.toHaveBeenCalled()
  })
})
