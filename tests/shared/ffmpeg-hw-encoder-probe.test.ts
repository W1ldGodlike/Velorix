import { describe, expect, it } from 'vitest'

import {
  createEmptyFfmpegHwEncodersSnapshot,
  parseFfmpegEncodersListOutput,
  parseFfmpegHwaccelsOutput
} from '../../src/shared/ffmpeg-hw-encoder-probe'

const SAMPLE = `Encoders:
 V....D av1_vaapi           AV1 (VAAPI) (codec av1)
 V....D av1_nvenc            NVIDIA NVENC av1 encoder (codec av1)
 V....D h264_nvenc           NVIDIA NVENC H.264 encoder (codec h264)
 V....D hevc_amf             AMD AMF HEVC encoder (codec hevc)
 V....D h264_qsv             H.264 / AVC (Intel Quick Sync Video acceleration) (codec h264)
 V..... libx264              x264 (codec h264)
`

describe('parseFfmpegEncodersListOutput', () => {
  it('помечает только whitelist-кодеки из вывода -encoders', () => {
    const s = parseFfmpegEncodersListOutput(SAMPLE)
    expect(s.h264_nvenc).toBe(true)
    expect(s.av1_nvenc).toBe(true)
    expect(s.av1_vaapi).toBe(true)
    expect(s.hevc_amf).toBe(true)
    expect(s.h264_qsv).toBe(true)
    expect(s.hevc_nvenc).toBe(false)
    expect(s.h264_amf).toBe(false)
    expect(s.matchedEncoderLines).toBe(5)
  })

  it('пустой снимок без совпадений', () => {
    const s = parseFfmpegEncodersListOutput('no hardware here\n')
    expect(s.matchedEncoderLines).toBe(0)
    expect(s.h264_nvenc).toBe(false)
  })

  it('createEmptyFfmpegHwEncodersSnapshot даёт нули и счётчик 0', () => {
    const e = createEmptyFfmpegHwEncodersSnapshot()
    expect(e.matchedEncoderLines).toBe(0)
    expect(e.h264_nvenc).toBe(false)
    expect(e.hevc_vaapi).toBe(false)
  })
})

describe('parseFfmpegHwaccelsOutput', () => {
  it('собирает имена методов из типичного вывода', () => {
    const text = `Hardware acceleration methods:
cuda
dxva2
qsv
`
    expect(parseFfmpegHwaccelsOutput(text)).toEqual(['cuda', 'dxva2', 'qsv'])
  })

  it('игнорирует заголовки с двоеточием и пустые строки', () => {
    expect(parseFfmpegHwaccelsOutput('foo: bar\n')).toEqual([])
  })
})
