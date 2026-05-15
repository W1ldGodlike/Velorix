import { mkdirSync, mkdtempSync, writeFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { describe, expect, it } from 'vitest'

import { expandFfmpegExportBatchDnDPaths } from '../../src/main/ffmpeg-export-batch-folder-scan'

describe('expandFfmpegExportBatchDnDPaths', () => {
  it('expands directory to sorted video paths and dedupes', () => {
    const root = mkdtempSync(join(tmpdir(), 'fa-batch-dnd-'))
    const sub = join(root, 'nested')
    mkdirSync(sub)
    writeFileSync(join(root, 'a.mp4'), '')
    writeFileSync(join(sub, 'b.mkv'), '')
    writeFileSync(join(root, 'readme.txt'), 'x')
    const out = expandFfmpegExportBatchDnDPaths([root])
    expect(out.map((p) => p.replace(/\\/g, '/'))).toEqual(
      [join(root, 'a.mp4'), join(sub, 'b.mkv')].map((p) => p.replace(/\\/g, '/'))
    )
  })

  it('keeps video files and merges with folder scan', () => {
    const root = mkdtempSync(join(tmpdir(), 'fa-batch-dnd-mix-'))
    const direct = join(root, 'direct.mp4')
    const inner = join(root, 'inner')
    mkdirSync(inner)
    writeFileSync(direct, '')
    writeFileSync(join(inner, 'inner.mov'), '')
    const out = expandFfmpegExportBatchDnDPaths([direct, inner])
    expect(out.length).toBe(2)
    expect(out.some((p) => p.endsWith('direct.mp4'))).toBe(true)
    expect(out.some((p) => p.includes('inner.mov'))).toBe(true)
  })
})
