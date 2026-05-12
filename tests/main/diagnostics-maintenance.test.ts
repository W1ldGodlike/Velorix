import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { describe, expect, it } from 'vitest'

import type { AppPaths } from '../../src/main/app-paths'
import {
  cleanDiagnosticsMaintenance,
  getDiagnosticsMaintenanceSnapshot
} from '../../src/main/diagnostics-maintenance'

function tmpPaths(): { paths: AppPaths; cleanup: () => void } {
  const root = mkdtempSync(join(tmpdir(), 'flux-maint-'))
  const paths: AppPaths = {
    appRoot: root,
    resources: root,
    userData: join(root, 'userData'),
    bundledBin: join(root, 'resources', 'bin'),
    userBin: join(root, 'userData', 'bin')
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

      const snapshot = getDiagnosticsMaintenanceSnapshot(paths)
      const preview = snapshot.targets.find((target) => target.id === 'previewCache')
      const partials = snapshot.targets.find((target) => target.id === 'ytdlpPartials')

      expect(preview?.files).toBe(1)
      expect(preview?.bytes).toBe(4)
      expect(partials?.files).toBe(1)
      expect(partials?.bytes).toBe(7)
      expect(snapshot.cleanableBytes).toBe(11)
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
        expect(result.removedFiles).toBe(2)
        expect(result.removedBytes).toBe(11)
      }
      expect(existsSync(ready)).toBe(true)
      expect(existsSync(part)).toBe(false)
      expect(getDiagnosticsMaintenanceSnapshot(paths).cleanableBytes).toBe(0)
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
