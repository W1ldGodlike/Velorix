import { describe, expect, it } from 'vitest'

import {
  buildFfmpegIntegrityCheckArgv,
  buildFfmpegRepairRemuxArgv,
  summarizeFfmpegIntegrityStderr
} from '../../src/shared/ffmpeg-media-utilities-argv'

describe('ffmpeg-media-utilities-argv', () => {
  it('repair remux argv', () => {
    expect(buildFfmpegRepairRemuxArgv('in.mp4', 'out.mkv')).toEqual([
      '-hide_banner',
      '-loglevel',
      'error',
      '-i',
      'in.mp4',
      '-c',
      'copy',
      '-y',
      'out.mkv'
    ])
  })

  it('integrity argv', () => {
    expect(buildFfmpegIntegrityCheckArgv('clip.mp4')).toContain('clip.mp4')
  })

  it('summarize stderr', () => {
    expect(summarizeFfmpegIntegrityStderr('')).toEqual({ clean: true, detail: '' })
    const bad = summarizeFfmpegIntegrityStderr('error line one\nerror line two')
    expect(bad.clean).toBe(false)
    expect(bad.detail).toContain('error line one')
  })
})
