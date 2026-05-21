import { mkdtempSync, rmSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { FFMPEG_EXPORT_CANCELLED_ERROR } from '../../src/shared/ffmpeg-export-contract'
import {
  FFMPEG_EXPORT_BATCH_STATUS_DONE,
  FFMPEG_EXPORT_BATCH_STATUS_ERROR
} from '../../src/shared/ffmpeg-export-batch-contract'
import {
  addFfmpegExportBatchPaths,
  clearFfmpegExportBatchQueue,
  getFfmpegExportBatchSnapshot
} from '../../src/main/services/ffmpeg/ffmpeg-export-batch-queue'
import {
  cancelFfmpegExportBatchRunner,
  runFfmpegExportBatchQueue
} from '../../src/main/services/ffmpeg/ffmpeg-export-batch-runner'
import { readProcessingHistoryNewestFirst } from '../../src/main/services/history/processing-history'

const runJob = vi.fn()

vi.mock('../../src/main/services/ffmpeg/ffmpeg-export-service', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../src/main/services/ffmpeg/ffmpeg-export-service')>()
  return {
    ...actual,
    runFfmpegExportJob: (...args: unknown[]) => runJob(...args)
  }
})

describe('ffmpeg-export-batch-runner', () => {
  let userDataRoot = ''

  beforeEach(() => {
    clearFfmpegExportBatchQueue()
    runJob.mockReset()
    userDataRoot = mkdtempSync(join(tmpdir(), 'fa-batch-run-'))
  })

  afterEach(() => {
    cancelFfmpegExportBatchRunner()
    rmSync(userDataRoot, { recursive: true, force: true })
  })

  it('успех: outputPath в строке и запись ffmpegBatchExport в истории', async () => {
    const input = join(userDataRoot, 'in.mp4')
    addFfmpegExportBatchPaths([input])
    const remembered: string[] = []
    runJob.mockResolvedValue({ ok: true, videoCodecUsed: 'libx264' })

    await runFfmpegExportBatchQueue({
      ffmpegPath: 'ffmpeg',
      settings: { uiLocale: 'ru', theme: 'dark', ffmpegExportEconomyMode: true },
      lutResourcesRoot: userDataRoot,
      userDataRoot,
      rememberExportOutputPath: (p) => {
        remembered.push(p)
      },
      rememberFfmpegExportDirectory: () => {},
      pushRowProgress: () => {},
      uiLocale: 'ru'
    })

    const row = getFfmpegExportBatchSnapshot().rows[0]
    expect(row?.status).toBe(FFMPEG_EXPORT_BATCH_STATUS_DONE)
    expect(row?.outputPath).toBeTruthy()
    expect(remembered).toHaveLength(1)
    expect(runJob.mock.calls[0]?.[0]?.economyMode).toBe(true)

    const hist = readProcessingHistoryNewestFirst(userDataRoot, { kind: 'ffmpegBatchExport' })
    expect(hist[0]?.outcome).toBe('success')
    expect(hist[0]?.inputPath).toBe(input)
  })

  it('ошибка ffmpeg: статус error и история error', async () => {
    addFfmpegExportBatchPaths([join(userDataRoot, 'bad.mp4')])
    runJob.mockResolvedValue({ ok: false, error: 'codec failed', videoCodecUsed: 'libx264' })

    await runFfmpegExportBatchQueue({
      ffmpegPath: 'ffmpeg',
      settings: { uiLocale: 'ru', theme: 'dark' },
      lutResourcesRoot: userDataRoot,
      userDataRoot,
      rememberExportOutputPath: () => {},
      rememberFfmpegExportDirectory: () => {},
      pushRowProgress: () => {},
      uiLocale: 'en'
    })

    expect(getFfmpegExportBatchSnapshot().rows[0]?.status).toBe(FFMPEG_EXPORT_BATCH_STATUS_ERROR)
    expect(readProcessingHistoryNewestFirst(userDataRoot)[0]?.outcome).toBe('error')
  })

  it('отмена: cancelled в истории', async () => {
    addFfmpegExportBatchPaths([join(userDataRoot, 'x.mp4')])
    runJob.mockResolvedValue({
      ok: false,
      error: FFMPEG_EXPORT_CANCELLED_ERROR,
      videoCodecUsed: 'libx264'
    })

    await runFfmpegExportBatchQueue({
      ffmpegPath: 'ffmpeg',
      settings: { uiLocale: 'ru', theme: 'dark' },
      lutResourcesRoot: userDataRoot,
      userDataRoot,
      rememberExportOutputPath: () => {},
      rememberFfmpegExportDirectory: () => {},
      pushRowProgress: () => {},
      uiLocale: 'ru'
    })

    expect(readProcessingHistoryNewestFirst(userDataRoot)[0]?.outcome).toBe('cancelled')
  })
})
