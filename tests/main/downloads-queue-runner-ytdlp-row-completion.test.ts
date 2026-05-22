import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { AppPaths } from '../../src/main/core/app-paths'
import { applyYtdlpRowDownloadSuccessActions } from '../../src/main/services/downloads/downloads-queue-runner-ytdlp-row-completion'
import { downloadsQueueRunnerState } from '../../src/main/services/downloads/downloads-queue-runner-state'
import type { YtdlpRowProgressBridge } from '../../src/main/services/downloads/downloads-queue-runner-ytdlp-row-progress'

const getSnapshot = vi.fn()
const resolveAllowed = vi.fn()
const tryWorkflow = vi.fn()

vi.mock('../../src/main/services/ytdlp/ytdlp-run-options-sync', () => ({
  getYtdlpRunOptionsSnapshot: (): ReturnType<typeof getSnapshot> => getSnapshot()
}))

vi.mock('../../src/main/services/ytdlp/ytdlp-download-output', () => ({
  resolveAllowedYtdlpDownloadOutputFile: (
    raw: string,
    userData: string
  ): ReturnType<typeof resolveAllowed> => resolveAllowed(raw, userData)
}))

vi.mock('../../src/main/services/workflow/workflow-scenario-ytdlp-complete', () => ({
  tryRunWorkflowScenarioAfterYtdlpDownload: (): ReturnType<typeof tryWorkflow> => tryWorkflow()
}))

vi.mock('../../src/main/ipc/downloads/downloads-log-ipc', () => ({
  emitDownloadsLog: vi.fn()
}))

vi.mock('../../src/main/services/downloads/downloads-queue', () => ({
  getDownloadsQueueRowById: vi.fn(() => null),
  updateDownloadsRow: vi.fn()
}))

describe('applyYtdlpRowDownloadSuccessActions §7.4.3', () => {
  const safePath = 'C:/app-data/downloads/ytdlp/sample.mp4'
  let paths: AppPaths
  const progress = {
    flushPendingProgressUI: vi.fn(),
    lastOutputPath: safePath,
    lastProgressCell: '100%'
  } as unknown as YtdlpRowProgressBridge

  beforeEach(() => {
    const userData = mkdtempSync(join(tmpdir(), 'flux-ytdlp-complete-'))
    paths = { userData } as AppPaths
    getSnapshot.mockReturnValue({
      openInHandlerOnComplete: false,
      autoExportAfterOpenInHandler: false,
      enqueueBatchOnDownloadComplete: false,
      autoStartBatchAfterEnqueue: false
    })
    resolveAllowed.mockReturnValue(safePath)
    tryWorkflow.mockReturnValue(false)
    downloadsQueueRunnerState.openDownloadedFileInMainHandlerHook = null
    downloadsQueueRunnerState.afterDownloadOpenedInMainHandlerHook = null
    downloadsQueueRunnerState.afterDownloadEnqueueBatchHook = null
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('runs auto-export hook after successful open when both flags are on', async () => {
    getSnapshot.mockReturnValue({
      openInHandlerOnComplete: true,
      autoExportAfterOpenInHandler: true,
      enqueueBatchOnDownloadComplete: false,
      autoStartBatchAfterEnqueue: false
    })
    const openHook = vi.fn(async () => ({ ok: true as const }))
    const exportHook = vi.fn()
    downloadsQueueRunnerState.openDownloadedFileInMainHandlerHook = openHook
    downloadsQueueRunnerState.afterDownloadOpenedInMainHandlerHook = exportHook

    await applyYtdlpRowDownloadSuccessActions(paths, 7, 'ru', progress)

    expect(openHook).toHaveBeenCalledWith(safePath)
    expect(exportHook).toHaveBeenCalledWith(safePath, 7)
  })

  it('skips auto-export when openInHandler is off', async () => {
    getSnapshot.mockReturnValue({
      openInHandlerOnComplete: false,
      autoExportAfterOpenInHandler: true,
      enqueueBatchOnDownloadComplete: false,
      autoStartBatchAfterEnqueue: false
    })
    const exportHook = vi.fn()
    downloadsQueueRunnerState.afterDownloadOpenedInMainHandlerHook = exportHook

    await applyYtdlpRowDownloadSuccessActions(paths, 1, 'ru', progress)

    expect(exportHook).not.toHaveBeenCalled()
  })

  it('skips auto-export when autoExportAfterOpenInHandler is off after successful open', async () => {
    getSnapshot.mockReturnValue({
      openInHandlerOnComplete: true,
      autoExportAfterOpenInHandler: false,
      enqueueBatchOnDownloadComplete: false,
      autoStartBatchAfterEnqueue: false
    })
    const exportHook = vi.fn()
    downloadsQueueRunnerState.openDownloadedFileInMainHandlerHook = vi.fn(async () => ({
      ok: true as const
    }))
    downloadsQueueRunnerState.afterDownloadOpenedInMainHandlerHook = exportHook

    await applyYtdlpRowDownloadSuccessActions(paths, 3, 'ru', progress)

    expect(exportHook).not.toHaveBeenCalled()
  })

  it('enqueues batch when enqueueBatchOnDownloadComplete is on', async () => {
    getSnapshot.mockReturnValue({
      openInHandlerOnComplete: false,
      autoExportAfterOpenInHandler: false,
      enqueueBatchOnDownloadComplete: true,
      autoStartBatchAfterEnqueue: false
    })
    const batchHook = vi.fn()
    downloadsQueueRunnerState.afterDownloadEnqueueBatchHook = batchHook

    await applyYtdlpRowDownloadSuccessActions(paths, 5, 'ru', progress)

    expect(batchHook).toHaveBeenCalledWith(safePath, 5)
  })

  it('skips batch enqueue when output path is not allowed', async () => {
    getSnapshot.mockReturnValue({
      openInHandlerOnComplete: false,
      autoExportAfterOpenInHandler: false,
      enqueueBatchOnDownloadComplete: true,
      autoStartBatchAfterEnqueue: false
    })
    resolveAllowed.mockReturnValue(null)
    const batchHook = vi.fn()
    downloadsQueueRunnerState.afterDownloadEnqueueBatchHook = batchHook

    await applyYtdlpRowDownloadSuccessActions(paths, 6, 'ru', progress)

    expect(batchHook).not.toHaveBeenCalled()
  })

  it('still enqueues batch before workflow short-circuit', async () => {
    tryWorkflow.mockReturnValue(true)
    getSnapshot.mockReturnValue({
      openInHandlerOnComplete: true,
      autoExportAfterOpenInHandler: true,
      enqueueBatchOnDownloadComplete: true,
      autoStartBatchAfterEnqueue: false
    })
    const batchHook = vi.fn()
    const openHook = vi.fn()
    downloadsQueueRunnerState.afterDownloadEnqueueBatchHook = batchHook
    downloadsQueueRunnerState.openDownloadedFileInMainHandlerHook = openHook

    await applyYtdlpRowDownloadSuccessActions(paths, 8, 'ru', progress)

    expect(batchHook).toHaveBeenCalledWith(safePath, 8)
    expect(openHook).not.toHaveBeenCalled()
  })

  it('skips open and auto-export when workflow scenario handles the download', async () => {
    tryWorkflow.mockReturnValue(true)
    getSnapshot.mockReturnValue({
      openInHandlerOnComplete: true,
      autoExportAfterOpenInHandler: true,
      enqueueBatchOnDownloadComplete: false,
      autoStartBatchAfterEnqueue: false
    })
    const openHook = vi.fn()
    const exportHook = vi.fn()
    downloadsQueueRunnerState.openDownloadedFileInMainHandlerHook = openHook
    downloadsQueueRunnerState.afterDownloadOpenedInMainHandlerHook = exportHook

    await applyYtdlpRowDownloadSuccessActions(paths, 4, 'ru', progress)

    expect(openHook).not.toHaveBeenCalled()
    expect(exportHook).not.toHaveBeenCalled()
  })

  it('skips auto-export when open in handler fails', async () => {
    getSnapshot.mockReturnValue({
      openInHandlerOnComplete: true,
      autoExportAfterOpenInHandler: true,
      enqueueBatchOnDownloadComplete: false,
      autoStartBatchAfterEnqueue: false
    })
    const exportHook = vi.fn()
    downloadsQueueRunnerState.openDownloadedFileInMainHandlerHook = vi.fn(async () => ({
      ok: false as const,
      error: 'no window'
    }))
    downloadsQueueRunnerState.afterDownloadOpenedInMainHandlerHook = exportHook

    await applyYtdlpRowDownloadSuccessActions(paths, 2, 'ru', progress)

    expect(exportHook).not.toHaveBeenCalled()
  })
})
