import { describe, expect, it } from 'vitest'

import type { MediaProbeSuccess } from '../../src/shared/ffprobe-contract'
import {
  formatFfprobeContainerBrandExportLine,
  formatFfprobeContainerCreationTimeExportLine,
  formatFfprobeContainerCommentExportLine,
  formatFfprobeContainerAlbumExportLine,
  formatFfprobeContainerSortAlbumExportLine,
  formatFfprobeContainerCopyrightExportLine,
  formatFfprobeContainerDateExportLine,
  formatFfprobeContainerPurchaseDateExportLine,
  formatFfprobeContainerGenreExportLine,
  formatFfprobeContainerArtistExportLine,
  formatFfprobeContainerSortArtistExportLine,
  formatFfprobeContainerDescriptionExportLine,
  formatFfprobeContainerSortTitleExportLine,
  formatFfprobeContainerEncoderExportLine,
  formatFfprobeContainerTitleExportLine,
  formatFfprobeContainerSizeExportLine,
  formatFfprobeContainerSizeCompact,
  formatFfprobeContainerStartTimeExportLine,
  formatFfprobeContainerFilenameExportLine,
  formatFfprobeContainerStartTimeRealExportLine,
  formatFfprobeContainerStartTimeCompact,
  ffprobeContainerFilenameBasename,
  formatFfprobeEditorVideoFactLine,
  formatFfprobeFormatFlagsExportLine,
  formatFfprobeNbProgramsExportLine,
  formatFfprobeNbStreamsExportLine,
  formatFfprobeProbeScoreExportLine,
  parseFfprobeFormatCompatibleBrands,
  parseFfprobeFormatCreationTime,
  parseFfprobeFormatCommentTag,
  parseFfprobeFormatAlbumTag,
  parseFfprobeFormatSortAlbumTag,
  parseFfprobeFormatCopyrightTag,
  parseFfprobeFormatDateTag,
  parseFfprobeFormatPurchaseDateTag,
  parseFfprobeFormatGenreTag,
  parseFfprobeFormatArtistTag,
  parseFfprobeFormatSortArtistTag,
  parseFfprobeFormatDescriptionTag,
  parseFfprobeFormatSortTitleTag,
  parseFfprobeFormatEncoder,
  parseFfprobeFormatTitleTag,
  parseFfprobeFormatFlags,
  parseFfprobeFormatMajorBrand,
  parseFfprobeFormatNbPrograms,
  parseFfprobeFormatNbStreams,
  parseFfprobeFormatProbeScore,
  parseFfprobeFormatSize,
  parseFfprobeFormatFilename,
  parseFfprobeFormatStartTimeSec
} from '../../src/shared/ffprobe-container-format'

const probeBase: MediaProbeSuccess = {
  ok: true,
  durationSec: 1,
  video: { width: 1280, height: 720, codec: 'h264' },
  videoFpsApprox: 24,
  audioCodec: 'aac',
  formatName: 'mp4',
  formatLongName: null,
  bitrateKbps: null,
  containerMajorBrand: null,
  containerCreationTime: null,
  containerEncoder: null,
  containerTitleTag: null,
  containerCommentTag: null,
  containerDescriptionTag: null,
  containerArtistTag: null,
  containerSortArtistTag: null,
  containerAlbumTag: null,
  containerSortAlbumTag: null,
  containerSortTitleTag: null,
  containerGenreTag: null,
  containerCopyrightTag: null,
  containerDateTag: null,
  containerPurchaseDateTag: null,
  containerCompatibleBrands: null,
  probeScore: null,
  containerNbStreams: null,
  containerNbPrograms: null,
  containerFormatFlags: null,
  containerSizeBytes: null,
  containerStartTimeSec: null,
  containerStartTimeRealSec: null,
  containerFilename: null,
  tracks: [],
  chapters: [],
  rawJson: '{}'
}

describe('ffprobe-container-format', () => {
  it('parseFfprobeFormatProbeScore', () => {
    expect(parseFfprobeFormatProbeScore('100')).toBe(100)
    expect(parseFfprobeFormatProbeScore(42)).toBe(42)
    expect(parseFfprobeFormatProbeScore('101')).toBeNull()
    expect(parseFfprobeFormatProbeScore('')).toBeNull()
  })

  it('parseFfprobeFormatMajorBrand и compatible_brands', () => {
    const tags = { major_brand: 'isom', compatible_brands: 'mp41iso2' }
    expect(parseFfprobeFormatMajorBrand(tags)).toBe('isom')
    expect(parseFfprobeFormatCompatibleBrands(tags)).toBe('mp41iso2')
  })

  it('formatFfprobeEditorVideoFactLine добавляет major_brand', () => {
    expect(formatFfprobeEditorVideoFactLine(null, '—')).toBe('—')
    expect(formatFfprobeEditorVideoFactLine(probeBase, '—')).toBe('1280×720 h264')
    expect(
      formatFfprobeEditorVideoFactLine({ ...probeBase, containerMajorBrand: 'isom' }, '—')
    ).toBe('1280×720 h264 · isom')
  })

  it('parseFfprobeFormatFlags', () => {
    expect(parseFfprobeFormatFlags('32768')).toBe('0x8000')
    expect(formatFfprobeFormatFlagsExportLine('0x8000', 'en')).toContain('0x8000')
  })

  it('parseFfprobeFormatNbStreams и export line', () => {
    expect(parseFfprobeFormatNbStreams('3')).toBe(3)
    expect(formatFfprobeNbStreamsExportLine(2, 2, 'ru')).toContain('2')
    expect(formatFfprobeNbStreamsExportLine(3, 2, 'en')).toContain('parsed tracks: 2')
  })

  it('parseFfprobeFormatNbPrograms и export line', () => {
    expect(parseFfprobeFormatNbPrograms('2')).toBe(2)
    expect(formatFfprobeNbProgramsExportLine(2, 'ru')).toContain('nb_programs')
  })

  it('parseFfprobeFormatFilename и export line', () => {
    expect(parseFfprobeFormatFilename('C:\\clips\\demo.mp4')).toBe('C:\\clips\\demo.mp4')
    expect(ffprobeContainerFilenameBasename('C:\\clips\\demo.mp4')).toBe('demo.mp4')
    expect(formatFfprobeContainerFilenameExportLine('demo.mp4', 'ru')).toContain('filename')
  })

  it('parseFfprobeFormatStartTimeSec и export line', () => {
    expect(parseFfprobeFormatStartTimeSec('0')).toBeNull()
    expect(parseFfprobeFormatStartTimeSec('1.5')).toBe(1.5)
    expect(formatFfprobeContainerStartTimeCompact(1.5)).toContain('start')
    expect(formatFfprobeContainerStartTimeExportLine(1.5, 'ru')).toContain('start_time')
    expect(formatFfprobeContainerStartTimeRealExportLine(2, 1.5, 'en')).toContain('start_time_real')
  })

  it('parseFfprobeFormatSize и export line', () => {
    expect(parseFfprobeFormatSize('1048576')).toBe(1048576)
    expect(formatFfprobeContainerSizeCompact(1048576)).toBe('1.00 MiB')
    expect(formatFfprobeContainerSizeExportLine(1024, 'ru')).toContain('1024 B')
  })

  it('parseFfprobeFormatTitleTag и export line', () => {
    expect(parseFfprobeFormatTitleTag({ title: 'Demo clip' })).toBe('Demo clip')
    expect(formatFfprobeContainerTitleExportLine('Demo clip', 'ru')).toContain('title')
  })

  it('parseFfprobeFormatCommentTag и export line', () => {
    expect(parseFfprobeFormatCommentTag({ comment: 'Edited offline' })).toBe('Edited offline')
    expect(formatFfprobeContainerCommentExportLine('Edited offline', 'en')).toContain('comment')
  })

  it('parseFfprobeFormatDescriptionTag и export line', () => {
    expect(parseFfprobeFormatDescriptionTag({ description: 'Demo reel' })).toBe('Demo reel')
    expect(formatFfprobeContainerDescriptionExportLine('Demo reel', 'ru')).toContain('description')
  })

  it('parseFfprobeFormatArtistTag и export line', () => {
    expect(parseFfprobeFormatArtistTag({ artist: 'Flux Studio' })).toBe('Flux Studio')
    expect(formatFfprobeContainerArtistExportLine('Flux Studio', 'en')).toContain('artist')
  })

  it('parseFfprobeFormatSortArtistTag и export line', () => {
    expect(parseFfprobeFormatSortArtistTag({ sort_artist: 'Studio, Flux' })).toBe('Studio, Flux')
    expect(formatFfprobeContainerSortArtistExportLine('Studio, Flux', 'en')).toContain(
      'sort_artist'
    )
  })

  it('parseFfprobeFormatAlbumTag и export line', () => {
    expect(parseFfprobeFormatAlbumTag({ album: 'Season One' })).toBe('Season One')
    expect(formatFfprobeContainerAlbumExportLine('Season One', 'ru')).toContain('album')
  })

  it('parseFfprobeFormatSortAlbumTag и export line', () => {
    expect(parseFfprobeFormatSortAlbumTag({ sort_album: 'Season One (2024)' })).toBe(
      'Season One (2024)'
    )
    expect(formatFfprobeContainerSortAlbumExportLine('Season One (2024)', 'en')).toContain(
      'sort_album'
    )
  })

  it('parseFfprobeFormatSortTitleTag и export line', () => {
    expect(parseFfprobeFormatSortTitleTag({ sort_title: '01 clip' })).toBe('01 clip')
    expect(formatFfprobeContainerSortTitleExportLine('01 clip', 'ru')).toContain('sort_title')
  })

  it('parseFfprobeFormatGenreTag и export line', () => {
    expect(parseFfprobeFormatGenreTag({ genre: 'Documentary' })).toBe('Documentary')
    expect(formatFfprobeContainerGenreExportLine('Documentary', 'en')).toContain('genre')
  })

  it('parseFfprobeFormatCopyrightTag и export line', () => {
    expect(parseFfprobeFormatCopyrightTag({ copyright: '2024 Flux' })).toBe('2024 Flux')
    expect(formatFfprobeContainerCopyrightExportLine('2024 Flux', 'ru')).toContain('copyright')
  })

  it('parseFfprobeFormatDateTag и export line', () => {
    expect(parseFfprobeFormatDateTag({ date: '2024-03-20' })).toBe('2024-03-20')
    expect(formatFfprobeContainerDateExportLine('2024-03-20', 'en')).toContain('date')
  })

  it('parseFfprobeFormatPurchaseDateTag и export line', () => {
    expect(parseFfprobeFormatPurchaseDateTag({ purchase_date: '2024-01-15' })).toBe('2024-01-15')
    expect(formatFfprobeContainerPurchaseDateExportLine('2024-01-15', 'ru')).toContain(
      'purchase_date'
    )
  })

  it('parseFfprobeFormatEncoder и export line', () => {
    const tags = { encoder: 'Lavf62.3.100' }
    expect(parseFfprobeFormatEncoder(tags)).toBe('Lavf62.3.100')
    expect(formatFfprobeContainerEncoderExportLine('Lavf62.3.100', 'en')).toContain('Lavf')
  })

  it('parseFfprobeFormatCreationTime и export line', () => {
    const tags = { creation_time: '2024-01-15T12:00:00.000000Z' }
    expect(parseFfprobeFormatCreationTime(tags)).toContain('2024-01-15')
    expect(formatFfprobeContainerCreationTimeExportLine('2024-01-15', 'ru')).toContain(
      'creation_time'
    )
  })

  it('formatFfprobeContainerBrandExportLine RU/EN', () => {
    expect(
      formatFfprobeContainerBrandExportLine('isom', 'mp41', 'ru')
    ).toContain('isom')
    expect(
      formatFfprobeContainerBrandExportLine('isom', null, 'en')
    ).toContain('Container brand: isom')
    expect(formatFfprobeProbeScoreExportLine(99, 'ru')).toContain('99')
  })
})
