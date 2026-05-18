import { describe, expect, it } from 'vitest'

import {
  FFMPEG_HW_MANUAL_SMOKE_CHECKLIST,
  formatFfmpegHwManualSmokeChecklistLines
} from '../../src/shared/ffmpeg-hw-manual-smoke-checklist'

describe('ffmpeg-hw-manual-smoke-checklist §16', () => {
  it('covers NVENC and VAAPI sections with steps', () => {
    const ids = FFMPEG_HW_MANUAL_SMOKE_CHECKLIST.map((s) => s.id)
    expect(ids).toEqual(['win-nvenc', 'linux-vaapi'])
    for (const section of FFMPEG_HW_MANUAL_SMOKE_CHECKLIST) {
      expect(section.prerequisites.length).toBeGreaterThanOrEqual(2)
      expect(section.steps.length).toBeGreaterThanOrEqual(4)
      expect(section.pass.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('formatFfmpegHwManualSmokeChecklistLines includes platform keywords', () => {
    const lines = formatFfmpegHwManualSmokeChecklistLines()
    const joined = lines.join('\n')
    expect(joined).toContain('win-nvenc')
    expect(joined).toContain('linux-vaapi')
    expect(joined).toContain('h264_nvenc')
    expect(joined).toContain('h264_vaapi')
    expect(joined).toContain('hw_auto')
    expect(lines.some((l) => l.startsWith('  step [nvenc-manual]:'))).toBe(true)
    expect(lines.some((l) => l.startsWith('  step [vaapi-manual]:'))).toBe(true)
  })
})
