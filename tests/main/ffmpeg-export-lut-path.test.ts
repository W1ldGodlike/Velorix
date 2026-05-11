import { describe, expect, it } from 'vitest'

import { resolveFfmpegExportLutCubeAbsPath } from '../../src/main/ffmpeg-export-lut-path'

describe('resolveFfmpegExportLutCubeAbsPath', () => {
  it('находит bundled .cube от корня репозитория (dev resolveAppPaths.resources)', () => {
    const p = resolveFfmpegExportLutCubeAbsPath(process.cwd(), 'film-warm')
    expect(p).not.toBeNull()
    expect(p).toMatch(/film-warm\.cube$/)
  })

  it('возвращает null для off', () => {
    expect(resolveFfmpegExportLutCubeAbsPath(process.cwd(), 'off')).toBeNull()
  })
})
