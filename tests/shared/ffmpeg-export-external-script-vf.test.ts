import { describe, expect, it } from 'vitest'

import {
  buildFfmpegExternalScriptVideoFilter,
  escapeFfmpegFilterGraphPath
} from '../../src/shared/ffmpeg-export-external-script-vf'

describe('ffmpeg-export-external-script-vf', () => {
  it('escapes windows path', () => {
    expect(escapeFfmpegFilterGraphPath('C:\\scripts\\filter.vpy')).toBe('C\\:/scripts/filter.vpy')
  })

  it('vapoursynth filter', () => {
    expect(buildFfmpegExternalScriptVideoFilter('vapoursynth', 'C:/x/script.vpy')).toContain(
      'vapoursynth=filename='
    )
  })

  it('off returns null', () => {
    expect(buildFfmpegExternalScriptVideoFilter('off', 'C:/x/a.vpy')).toBeNull()
  })
})
