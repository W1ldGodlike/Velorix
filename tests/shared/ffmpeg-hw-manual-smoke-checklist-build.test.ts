import { describe, expect, it, vi, afterEach } from 'vitest'

import enHw from '../../locales/en/hw-manual-smoke.json'
import {
  buildFfmpegHwManualSmokeChecklistFromLocaleShard,
  formatFfmpegHwManualSmokeChecklistPlainText,
  orderHwManualSmokeSectionsForDisplay,
  resolvePrimaryHwManualSmokeSectionId
} from '../../src/shared/ffmpeg-hw-manual-smoke-checklist-build'

describe('ffmpeg-hw-manual-smoke-checklist-build', () => {
  it('buildFfmpegHwManualSmokeChecklistFromLocaleShard — en shard', () => {
    const sections = buildFfmpegHwManualSmokeChecklistFromLocaleShard(
      enHw as Record<string, string>
    )
    expect(sections).toHaveLength(2)
    expect(sections[0]?.id).toBe('win-nvenc')
    expect(sections[0]?.steps).toHaveLength(5)
    expect(sections[1]?.id).toBe('linux-vaapi')
  })

  it('formatFfmpegHwManualSmokeChecklistPlainText', () => {
    const sections = buildFfmpegHwManualSmokeChecklistFromLocaleShard(
      enHw as Record<string, string>
    )
    const text = formatFfmpegHwManualSmokeChecklistPlainText(sections)
    expect(text).toContain('nvenc-probe')
    expect(text).toContain('Prerequisites:')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('resolvePrimaryHwManualSmokeSectionId — windows', () => {
    vi.stubGlobal('navigator', { platform: 'Win32', userAgent: 'Windows NT 10.0' })
    expect(resolvePrimaryHwManualSmokeSectionId()).toBe('win-nvenc')
  })

  it('orderHwManualSmokeSectionsForDisplay — primary first', () => {
    const sections = buildFfmpegHwManualSmokeChecklistFromLocaleShard(
      enHw as Record<string, string>
    )
    const ordered = orderHwManualSmokeSectionsForDisplay(sections, 'linux-vaapi')
    expect(ordered[0]?.id).toBe('linux-vaapi')
  })
})
