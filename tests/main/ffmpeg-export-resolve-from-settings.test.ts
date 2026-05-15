import { closeSync, existsSync, mkdirSync, mkdtempSync, openSync, rmSync, unlinkSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { describe, expect, it } from 'vitest'

import { pickUniqueAutoExportOutputPath } from '../../src/main/ffmpeg-export-resolve-from-settings'

describe('pickUniqueAutoExportOutputPath', () => {
  it('возвращает …-export.ext если файла ещё нет', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fa-autoexp-'))
    try {
      const input = join(dir, 'clip.webm')
      closeSync(openSync(input, 'w'))
      const out = pickUniqueAutoExportOutputPath(input, 'mp4')
      expect(out).toBe(join(dir, 'clip-export.mp4'))
      expect(existsSync(out)).toBe(false)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('добавляет суффикс при коллизии', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fa-autoexp2-'))
    try {
      const input = join(dir, 'a.mkv')
      closeSync(openSync(input, 'w'))
      const first = join(dir, 'a-export.mkv')
      closeSync(openSync(first, 'w'))
      const out = pickUniqueAutoExportOutputPath(input, 'mkv')
      expect(out).toBe(join(dir, 'a-export-1.mkv'))
      unlinkSync(first)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('кастомный шаблон {stem}_out', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fa-autoexp3-'))
    try {
      const input = join(dir, 'x.mp4')
      closeSync(openSync(input, 'w'))
      const out = pickUniqueAutoExportOutputPath(input, 'mp4', '{stem}_out')
      expect(out).toBe(join(dir, 'x_out.mp4'))
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('общая папка выхода пакета', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fa-autoexp-outdir-'))
    try {
      const outDir = join(dir, 'out')
      mkdirSync(outDir)
      const input = join(dir, 'nested', 'clip.mp4')
      mkdirSync(join(dir, 'nested'), { recursive: true })
      closeSync(openSync(input, 'w'))
      const out = pickUniqueAutoExportOutputPath(input, 'mp4', null, outDir)
      expect(out).toBe(join(outDir, 'clip-export.mp4'))
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
