import { describe, expect, it } from 'vitest'

import { buildFfmpegCoverExtractArgv } from '../../src/shared/ffmpeg-cover-extract-argv'

describe('ffmpeg-cover-extract-argv', () => {
  it('maps cover stream', () => {
    expect(buildFfmpegCoverExtractArgv('in.mkv', 3, 'cover.jpg')).toEqual([
      '-hide_banner',
      '-loglevel',
      'error',
      '-i',
      'in.mkv',
      '-map',
      '0:3',
      '-frames:v',
      '1',
      '-y',
      'cover.jpg'
    ])
  })
})
