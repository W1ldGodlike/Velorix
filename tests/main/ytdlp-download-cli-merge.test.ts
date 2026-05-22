import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'

const proc = process as NodeJS.Process & { resourcesPath?: string }
if (proc.resourcesPath === undefined) {
  proc.resourcesPath = join(process.cwd(), 'resources')
}

vi.mock('electron', () => ({
  app: {
    getAppPath: () => process.cwd()
  }
}))

vi.mock('@electron-toolkit/utils', () => ({
  is: { dev: true }
}))

import type { AppSettings } from '../../src/main/services/settings/settings-store'
import { mergeYtdlpDownloadCliPatchOntoSettings } from '../../src/main/services/ytdlp/ytdlp-download-cli-merge'

const base = { theme: 'dark' } as AppSettings

describe('mergeYtdlpDownloadCliPatchOntoSettings §7.4 flag chains', () => {
  it('autoExport on forces openInHandler on', () => {
    const r = mergeYtdlpDownloadCliPatchOntoSettings(base, {
      autoExportAfterOpenInHandler: true
    })
    expect(r.ok).toBe(true)
    if (!r.ok) {
      return
    }
    expect(r.settings.ytdlpOpenInHandlerOnComplete).toBe(true)
    expect(r.settings.ytdlpAutoExportAfterOpenInHandler).toBe(true)
  })

  it('openInHandler off clears autoExport', () => {
    const r = mergeYtdlpDownloadCliPatchOntoSettings(
      {
        ...base,
        ytdlpOpenInHandlerOnComplete: true,
        ytdlpAutoExportAfterOpenInHandler: true
      },
      { openInHandlerOnComplete: false }
    )
    expect(r.ok).toBe(true)
    if (!r.ok) {
      return
    }
    expect(r.settings.ytdlpOpenInHandlerOnComplete).toBeUndefined()
    expect(r.settings.ytdlpAutoExportAfterOpenInHandler).toBeUndefined()
  })

  it('autoStartBatch on forces enqueueBatch on', () => {
    const r = mergeYtdlpDownloadCliPatchOntoSettings(base, {
      autoStartBatchAfterEnqueue: true
    })
    expect(r.ok).toBe(true)
    if (!r.ok) {
      return
    }
    expect(r.settings.ytdlpEnqueueBatchOnDownloadComplete).toBe(true)
    expect(r.settings.ytdlpAutoStartBatchAfterEnqueue).toBe(true)
  })

  it('enqueueBatch off clears autoStartBatch', () => {
    const r = mergeYtdlpDownloadCliPatchOntoSettings(
      {
        ...base,
        ytdlpEnqueueBatchOnDownloadComplete: true,
        ytdlpAutoStartBatchAfterEnqueue: true
      },
      { enqueueBatchOnDownloadComplete: false }
    )
    expect(r.ok).toBe(true)
    if (!r.ok) {
      return
    }
    expect(r.settings.ytdlpEnqueueBatchOnDownloadComplete).toBeUndefined()
    expect(r.settings.ytdlpAutoStartBatchAfterEnqueue).toBeUndefined()
  })
})
