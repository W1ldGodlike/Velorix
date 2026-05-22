import { existsSync, mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { describe, expect, it } from 'vitest'

import type { AppPaths } from '../../src/main/core/app-paths'
import {
  cleanDiagnosticsMaintenance,
  getDiagnosticsMaintenanceSnapshot
} from '../../src/main/services/diagnostics/diagnostics-maintenance'

function tmpPaths(): { paths: AppPaths; cleanup: () => void } {
  const root = mkdtempSync(join(tmpdir(), 'velorix-maint-'))
  const userData = join(root, 'userData')
  const paths: AppPaths = {
    appRoot: root,
    resources: root,
    userData,
    appTemp: join(userData, 'temp'),
    bundledBin: join(root, 'resources', 'bin'),
    userBin: join(userData, 'bin')
  }
  mkdirSync(paths.userData, { recursive: true })
  return {
    paths,
    cleanup: (): void => {
      rmSync(root, { recursive: true, force: true })
    }
  }
}

describe('diagnostics-maintenance', () => {
  it('считает preview-cache и частичные файлы yt-dlp, не включая готовые медиа', () => {
    const { paths, cleanup } = tmpPaths()
    try {
      mkdirSync(join(paths.userData, 'preview-cache', 'nested'), { recursive: true })
      writeFileSync(join(paths.userData, 'preview-cache', 'nested', 'thumb.bin'), '1234')
      mkdirSync(join(paths.userData, 'downloads', 'ytdlp'), { recursive: true })
      writeFileSync(join(paths.userData, 'downloads', 'ytdlp', 'video.mp4'), 'ready')
      writeFileSync(join(paths.userData, 'downloads', 'ytdlp', 'video.mp4.part'), 'partial')
      writeFileSync(join(paths.userData, 'downloads', 'ytdlp', 'other.mkv.crdownload'), 'chrome')

      const snapshot = getDiagnosticsMaintenanceSnapshot(paths)
      const preview = snapshot.targets.find((target) => target.id === 'previewCache')
      const partials = snapshot.targets.find((target) => target.id === 'ytdlpPartials')
      const ffmpegTemp = snapshot.targets.find((target) => target.id === 'ffmpegTemp')

      expect(preview?.files).toBe(1)
      expect(preview?.bytes).toBe(4)
      expect(partials?.files).toBe(2)
      expect(partials?.bytes).toBe(13)
      expect(ffmpegTemp).toBeDefined()
      expect(snapshot.cleanableBytes).toBe(17)
    } finally {
      cleanup()
    }
  })

  it('очищает preview-cache целиком и только временные yt-dlp файлы', () => {
    const { paths, cleanup } = tmpPaths()
    try {
      mkdirSync(join(paths.userData, 'preview-cache', 'nested'), { recursive: true })
      writeFileSync(join(paths.userData, 'preview-cache', 'nested', 'thumb.bin'), '1234')
      mkdirSync(join(paths.userData, 'downloads', 'ytdlp', 'sub'), { recursive: true })
      const ready = join(paths.userData, 'downloads', 'ytdlp', 'sub', 'video.mp4')
      const part = join(paths.userData, 'downloads', 'ytdlp', 'sub', 'video.mp4.part')
      writeFileSync(ready, 'ready')
      writeFileSync(part, 'partial')

      const result = cleanDiagnosticsMaintenance(paths)

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.removedFiles).toBeGreaterThanOrEqual(2)
        expect(result.removedBytes).toBeGreaterThanOrEqual(11)
      }
      expect(existsSync(ready)).toBe(true)
      expect(existsSync(part)).toBe(false)
      expect(getDiagnosticsMaintenanceSnapshot(paths).cleanableBytes).toBe(0)
    } finally {
      cleanup()
    }
  })

  it('выборочно чистит только запрошенную категорию', () => {
    const { paths, cleanup } = tmpPaths()
    try {
      mkdirSync(join(paths.userData, 'preview-cache'), { recursive: true })
      mkdirSync(join(paths.userData, 'downloads', 'ytdlp'), { recursive: true })
      const preview = join(paths.userData, 'preview-cache', 'thumb.bin')
      const partial = join(paths.userData, 'downloads', 'ytdlp', 'video.webm.part')
      const ready = join(paths.userData, 'downloads', 'ytdlp', 'video.webm')
      writeFileSync(preview, 'preview')
      writeFileSync(partial, 'partial')
      writeFileSync(ready, 'ready')

      const previewOnly = cleanDiagnosticsMaintenance(paths, { targets: ['previewCache'] })
      expect(previewOnly.ok).toBe(true)
      expect(existsSync(preview)).toBe(false)
      expect(existsSync(partial)).toBe(true)
      expect(existsSync(ready)).toBe(true)

      const partialsOnly = cleanDiagnosticsMaintenance(paths, { targets: ['ytdlpPartials'] })
      expect(partialsOnly.ok).toBe(true)
      expect(existsSync(partial)).toBe(false)
      expect(existsSync(ready)).toBe(true)
    } finally {
      cleanup()
    }
  })

  it('чистит только старые orphan temp-директории ffmpeg', () => {
    const { paths, cleanup } = tmpPaths()
    mkdirSync(paths.appTemp, { recursive: true })
    const oldDir = mkdtempSync(join(paths.appTemp, 'fa-x264tw-'))
    const freshDir = mkdtempSync(join(paths.appTemp, 'fa-x264tw-'))
    try {
      const oldFile = join(oldDir, 'pass-0.log')
      const freshFile = join(freshDir, 'pass-0.log')
      writeFileSync(oldFile, 'old-temp')
      writeFileSync(freshFile, 'fresh-temp')
      const oldDate = new Date(Date.now() - 7 * 60 * 60 * 1000)
      utimesSync(oldFile, oldDate, oldDate)
      utimesSync(oldDir, oldDate, oldDate)

      const snapshot = getDiagnosticsMaintenanceSnapshot(paths)
      const ffmpegTemp = snapshot.targets.find((target) => target.id === 'ffmpegTemp')
      expect(ffmpegTemp?.files).toBeGreaterThanOrEqual(1)

      const result = cleanDiagnosticsMaintenance(paths, { targets: ['ffmpegTemp'] })
      expect(result.ok).toBe(true)
      expect(existsSync(oldDir)).toBe(false)
      expect(existsSync(freshDir)).toBe(true)
    } finally {
      cleanup()
      rmSync(oldDir, { recursive: true, force: true })
      rmSync(freshDir, { recursive: true, force: true })
    }
  })

  it('считает .crdownload и .aria2 как частичные загрузки', () => {
    const { paths, cleanup } = tmpPaths()
    try {
      mkdirSync(join(paths.userData, 'downloads', 'ytdlp'), { recursive: true })
      writeFileSync(join(paths.userData, 'downloads', 'ytdlp', 'clip.mp4'), 'ready')
      writeFileSync(join(paths.userData, 'downloads', 'ytdlp', 'clip.mp4.crdownload'), 'x')
      writeFileSync(join(paths.userData, 'downloads', 'ytdlp', 'pack.zip.aria2'), 'y')

      const partials = getDiagnosticsMaintenanceSnapshot(paths).targets.find(
        (target) => target.id === 'ytdlpPartials'
      )
      expect(partials?.files).toBe(2)
      const result = cleanDiagnosticsMaintenance(paths, { targets: ['ytdlpPartials'] })
      expect(result.ok).toBe(true)
      expect(existsSync(join(paths.userData, 'downloads', 'ytdlp', 'clip.mp4'))).toBe(true)
      expect(existsSync(join(paths.userData, 'downloads', 'ytdlp', 'clip.mp4.crdownload'))).toBe(
        false
      )
    } finally {
      cleanup()
    }
  })

  it('отклоняет явно пустой набор целей', () => {
    const { paths, cleanup } = tmpPaths()
    try {
      const result = cleanDiagnosticsMaintenance(paths, { targets: [] })
      expect(result.ok).toBe(false)
    } finally {
      cleanup()
    }
  })
})
