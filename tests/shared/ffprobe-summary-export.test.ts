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
  videoFpsApprox: 24,
  audioCodec: 'aac',
  formatName: 'mov,mp4,m4a,3gp,3g2,mj2',
  formatLongName: 'QuickTime / MOV',
  bitrateKbps: 4500,
  tracks: [
    {
      index: 0,
      kind: 'video',
      codec: 'h264',
      detail: '1920x1080, 24 fps',
      language: null,
      titleTag: null,
      streamBitrateKbps: null,
      dispositionSummary: 'по умолчанию',
      pixelFormat: 'yuv420p',
      sampleAspectRatio: '1:1',
      displayAspectRatio: '16:9',
      colorSpace: 'bt709',
      colorPrimaries: 'bt709',
      colorTransfer: 'bt709',
      colorRange: 'tv'
    },
    {
      index: 1,
      kind: 'audio',
      codec: 'aac',
      detail: 'stereo, 48000 Hz',
      language: 'eng',
      titleTag: 'Commentary',
      streamBitrateKbps: 192,
      dispositionSummary: '',
      pixelFormat: null,
      sampleAspectRatio: null,
      displayAspectRatio: null,
      colorSpace: null,
      colorPrimaries: null,
      colorTransfer: null,
      colorRange: null
    }
  ],
  chapters: [],
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
    expect(t).toContain('Частота кадров (оценка, видео): 24 к/с')
    expect(t).toContain('aac')
    expect(t).toContain('Дорожек: 2')
    expect(t).toContain(
      'Форм. пикс.\tSAR\tDAR\tЦв. пространство\tОсн. цвета\tПередача цвета\tДиапазон\tБитрейт\tСвойства дорожки\tЯзык\tЗаголовок\tСведения'
    )
    expect(t).toContain('yuv420p')
    expect(t).toContain('bt709')
    expect(t).toContain('\ttv\t')
    expect(t).toContain('192 кбит/с')
    expect(t).toContain('Битрейт (оценка): 4500 кбит/с')
    expect(t).toContain('по умолчанию')
    expect(t).toContain('Видео\t')
    expect(t).toContain('eng')
    expect(t).toContain('Commentary')
  })

  it('formatProbeSummaryPlainText и HTML включают главы', () => {
    const withChapters: MediaProbeSuccess = {
      ...sampleProbe,
      chapters: [{ index: 0, startSec: 0, endSec: 10, title: 'Раздел' }]
    }
    expect(formatProbeSummaryPlainText(withChapters)).toContain('Главы: 1')
    expect(formatProbeSummaryPlainText(withChapters)).toContain('Раздел')
    expect(formatProbeSummaryHtmlDocument(withChapters)).toContain('Главы (1)')
  })

  it('formatProbeSummaryPlainText и HTML не пишут отрицательную длительность главы', () => {
    const withBrokenChapter: MediaProbeSuccess = {
      ...sampleProbe,
      chapters: [{ index: 0, startSec: 10, endSec: 5, title: 'Broken' }]
    }
    expect(formatProbeSummaryPlainText(withBrokenChapter)).toContain('\t—\tBroken')
    expect(formatProbeSummaryHtmlDocument(withBrokenChapter)).toContain(
      '<td class="mono">—</td><td>Broken</td>'
    )
  })

  it('formatProbeSummaryPlainText (en) uses English headings', () => {
    const t = formatProbeSummaryPlainText(sampleProbe, 'en')
    expect(t).toContain('FluxAlloy — ffprobe summary')
    expect(t).toContain('Streams: 2')
    expect(t).toContain('FPS (approx., video): 24 fps')
    expect(t).toContain('\tVideo\t')
    expect(t).toContain('192 kb/s')
    expect(t).toContain('Bitrate (estimate): 4500 kb/s')
  })

  it('formatProbeSummaryHtmlDocument экранирует detail и содержит таблицу', () => {
    const dirty: MediaProbeSuccess = {
      ...sampleProbe,
      tracks: [
        {
          index: 0,
          kind: 'video',
          codec: 'x',
          detail: '<script>x</script>',
          language: null,
          titleTag: null,
          streamBitrateKbps: null,
          dispositionSummary: '',
          pixelFormat: null,
          sampleAspectRatio: null,
          displayAspectRatio: null,
          colorSpace: null,
          colorPrimaries: null,
          colorTransfer: null,
          colorRange: null
        }
      ]
    }
    const h = formatProbeSummaryHtmlDocument(dirty)
    expect(h).toContain('&lt;script&gt;')
    expect(h).not.toContain('<script>x</script>')
    expect(h).toContain('<meta charset="utf-8" />')
    expect(h).toContain('Частота кадров (оценка, видео): 24 к/с')
  })
})
