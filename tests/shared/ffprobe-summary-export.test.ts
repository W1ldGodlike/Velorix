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
  rawJson: '{}',
  containerMajorBrand: 'isom',
  containerCreationTime: '2024-06-01T10:00:00.000000Z',
  containerEncoder: 'Lavf62.0.100',
  containerPublisherTag: 'Flux Media',
  containerEncodedByTag: 'HandBrake 1.8',
  containerSoftwareTag: 'Adobe Premiere Pro',
  containerTitleTag: 'Sample',
  containerCommentTag: 'Offline edit',
  containerSynopsisTag: 'Short plot summary',
  containerDescriptionTag: 'Demo reel',
  containerKeywordsTag: 'demo, offline',
  containerLyricsTag: 'Verse one…',
  containerArtistTag: 'Flux Studio',
  containerPerformerTag: 'Guest Vocalist',
  containerSortArtistTag: 'Studio, Flux',
  containerAlbumTag: 'Season One',
  containerAlbumArtistTag: 'Various Artists',
  containerSortAlbumTag: 'Season One (2024)',
  containerSortTitleTag: '01 clip',
  containerGenreTag: 'Documentary',
  containerTrackTag: '3/12',
  containerDiscTag: '1/2',
  containerCopyrightTag: '2024 Flux',
  containerIsrcTag: 'USRC17607839',
  containerDateTag: '2024-03-20',
  containerLocationTag: '+55.7558+037.6173/',
  containerPurchaseDateTag: '2024-01-15',
  containerCompatibleBrands: 'mp41iso2',
  probeScore: 100,
  containerNbStreams: 2,
  containerNbPrograms: 1,
  containerNbChapters: null,
  containerFormatFlags: '0x0',
  containerSizeBytes: 12_345_678,
  containerStartTimeSec: 1.25,
  containerStartTimeRealSec: 1.5,
  containerDurationTs: 11_250_000,
  containerTimeBase: '1/90000',
  containerProbeSizeBytes: 5_242_880,
  containerFilename: 'D:\\clips\\Demo.mkv'
}

describe('ffprobe-summary-export', () => {
  it('defaultFfprobeJsonFileName без пути совпадает с прежним контрактом', () => {
    expect(defaultFfprobeJsonFileName(undefined)).toBe('VELORIX-ffprobe.json')
    expect(defaultFfprobeJsonFileName('')).toBe('VELORIX-ffprobe.json')
  })

  it('defaultFfprobeJsonFileName со путём использует stem', () => {
    expect(defaultFfprobeJsonFileName('D:\\clips\\Demo.mkv')).toBe('Demo-ffprobe.json')
  })

  it('defaultFfprobeSummaryTxtFileName / HtmlFileName', () => {
    expect(defaultFfprobeSummaryTxtFileName(undefined)).toBe('VELORIX-ffprobe-summary.txt')
    expect(defaultFfprobeSummaryHtmlFileName('D:\\clips\\Demo.mkv')).toBe(
      'Demo-ffprobe-summary.html'
    )
  })

  it('formatProbeSummaryPlainText содержит ключевые поля', () => {
    const t = formatProbeSummaryPlainText(sampleProbe)
    expect(t).toContain('Velorix — сводка ffprobe')
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
    expect(t).toContain('bit_rate): 4500 кбит/с')
    expect(t).not.toContain('Битрейт (оценка):')
    expect(t).toContain('по умолчанию')
    expect(t).toContain('Видео\t')
    expect(t).toContain('eng')
    expect(t).toContain('Commentary')
    expect(t).toContain('Бренд контейнера: isom')
    expect(t).toContain('creation_time): 2024-06-01')
    expect(t).toContain('encoder): Lavf62.0.100')
    expect(t).toContain('publisher): Flux Media')
    expect(t).toContain('encoded_by): HandBrake 1.8')
    expect(t).toContain('software): Adobe Premiere Pro')
    expect(t).toContain('title): Sample')
    expect(t).toContain('sort_title): 01 clip')
    expect(t).toContain('comment): Offline edit')
    expect(t).toContain('synopsis): Short plot summary')
    expect(t).toContain('description): Demo reel')
    expect(t).toContain('keywords): demo, offline')
    expect(t).toContain('lyrics): Verse one…')
    expect(t).toContain('artist): Flux Studio')
    expect(t).toContain('(performer) контейнера: Guest Vocalist')
    expect(t).toContain('sort_artist): Studio, Flux')
    expect(t).toContain('album): Season One')
    expect(t).toContain('album_artist): Various Artists')
    expect(t).toContain('sort_album): Season One (2024)')
    expect(t).toContain('genre): Documentary')
    expect(t).toContain('track): 3/12')
    expect(t).toContain('disc): 1/2')
    expect(t).toContain('copyright): 2024 Flux')
    expect(t).toContain('isrc): USRC17607839')
    expect(t).toContain('date): 2024-03-20')
    expect(t).toContain('location): +55.7558+037.6173/')
    expect(t).toContain('purchase_date): 2024-01-15')
    expect(t).toContain('probe_score): 100')
    expect(t).toContain('nb_streams): 2')
    expect(t).toContain('nb_programs): 1')
    expect(t).toContain('format.size)')
    expect(t).toContain('12345678 B')
    expect(t).toContain('start_time)')
    expect(t).toContain('start_time_real')
    expect(t).toContain('duration_ts): 11250000')
    expect(t).toContain('time_base): 1/90000')
    expect(t).toContain('probe_size)')
    expect(t).toContain('filename): D:\\clips\\Demo.mkv')
  })

  it('plain text: одна строка diagnostics (filename + layout + offset/timing)', () => {
    const t = formatProbeSummaryPlainText(sampleProbe, 'ru')
    const merged = t
      .split('\n')
      .filter(
        (line) =>
          line.includes('probe_score') &&
          line.includes('duration):') &&
          line.includes('duration_ts') &&
          line.includes('filename') &&
          line.includes('bit_rate')
      )
    expect(merged).toHaveLength(1)
    expect(merged[0]).toContain(' · ')
    const filenameOnly = t.split('\n').filter((line) => line.includes('filename):'))
    expect(filenameOnly).toHaveLength(1)
    expect(t.split('\n').some((line) => line.startsWith('Битрейт (оценка):'))).toBe(false)
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
    expect(t).toContain('Velorix — ffprobe summary')
    expect(t).toContain('Streams: 2')
    expect(t).toContain('FPS (approx., video): 24 fps')
    expect(t).toContain('\tVideo\t')
    expect(t).toContain('192 kb/s')
    expect(t).toContain('Container bitrate (bit_rate): 4500 kb/s')
    expect(t).not.toContain('Bitrate (estimate):')
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
