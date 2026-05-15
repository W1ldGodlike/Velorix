import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { getMainApplicationStrings } from '../../src/shared/main-application-locale'
import {
  addFfmpegExportBatchPaths,
  clearFfmpegExportBatchQueue
} from '../../src/main/ffmpeg-export-batch-queue'
import { openFfmpegExportBatchInputPath } from '../../src/main/ffmpeg-export-batch-open-input'

describe('openFfmpegExportBatchInputPath', () => {
  const S = getMainApplicationStrings('ru')
  let dir = ''

  afterEach(() => {
    clearFfmpegExportBatchQueue()
  })

  it('отклоняет путь вне очереди', async () => {
    const res = await openFfmpegExportBatchInputPath('C:\\ghost.mp4', 'file', S, {
      openInMainHandler: async () => ({ ok: true })
    })
    expect(res).toEqual({ ok: false, error: S.batchExportInputNotInQueue })
  })

  it('preview вызывает openInMainHandler для строки очереди', async () => {
    dir = mkdtempSync(join(tmpdir(), 'flux-batch-open-'))
    const file = join(dir, 'clip.mp4')
    writeFileSync(file, 'x')
    addFfmpegExportBatchPaths([file])
    let called = ''
    const res = await openFfmpegExportBatchInputPath(file, 'preview', S, {
      openInMainHandler: async (p) => {
        called = p
        return { ok: true }
      }
    })
    expect(res.ok).toBe(true)
    expect(called).toBe(file)
  })
})
