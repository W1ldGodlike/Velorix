import { describe, expect, it } from 'vitest'

import type { MediaProbeSuccess } from '../../src/shared/ffprobe-contract'
import {
  defaultFfprobeJsonFileName,
  defaultFfprobeSummaryHtmlFileName,
  defaultFfprobeSummaryTxtFileName,
  formatProbeSummaryHtmlDocument,
  formatProbeSummaryPlainText
} from '../../src/shared/ffprobe-summary-export'

const sampleProbe: MediaProbeSuccess = {
  ok: true,
  durationSec: 125.5,
  video: { width: 1920, height: 1080, codec: 'h264' },
  audioCodec: 'aac',
  formatName: 'mov,mp4,m4a,3gp,3g2,mj2',
  formatLongName: 'QuickTime / MOV',
  bitrateKbps: 4500,
  tracks: [
    { index: 0, kind: 'video', codec: 'h264', detail: '1920x1080, 24 fps' },
    { index: 1, kind: 'audio', codec: 'aac', detail: 'stereo, 48000 Hz' }
  ],
  rawJson: '{}'
}

describe('ffprobe-summary-export', () => {
  it('defaultFfprobeJsonFileName без пути совпадает с прежним контрактом', () => {
    expect(defaultFfprobeJsonFileName(undefined)).toBe('fluxalloy-ffprobe.json')
    expect(defaultFfprobeJsonFileName('')).toBe('fluxalloy-ffprobe.json')
  })

  it('defaultFfprobeJsonFileName со путём использует stem', () => {
    expect(defaultFfprobeJsonFileName('D:\\clips\\Demo.mkv')).toBe('Demo-ffprobe.json')
  })

  it('defaultFfprobeSummaryTxtFileName / HtmlFileName', () => {
    expect(defaultFfprobeSummaryTxtFileName(undefined)).toBe('fluxalloy-ffprobe-summary.txt')
    expect(defaultFfprobeSummaryHtmlFileName('D:\\clips\\Demo.mkv')).toBe(
      'Demo-ffprobe-summary.html'
    )
  })

  it('formatProbeSummaryPlainText содержит ключевые поля', () => {
    const t = formatProbeSummaryPlainText(sampleProbe)
    expect(t).toContain('FluxAlloy — сводка ffprobe')
    expect(t).toContain('1920×1080')
    expect(t).toContain('h264')
    expect(t).toContain('aac')
    expect(t).toContain('Дорожек: 2')
    expect(t).toContain('Видео\t')
  })

  it('formatProbeSummaryHtmlDocument экранирует detail и содержит таблицу', () => {
    const dirty: MediaProbeSuccess = {
      ...sampleProbe,
      tracks: [{ index: 0, kind: 'video', codec: 'x', detail: '<script>x</script>' }]
    }
    const h = formatProbeSummaryHtmlDocument(dirty)
    expect(h).toContain('&lt;script&gt;')
    expect(h).not.toContain('<script>x</script>')
    expect(h).toContain('<meta charset="utf-8" />')
  })
})
