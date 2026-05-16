import { describe, expect, it } from 'vitest'

import {
  FFPROBE_FORMAT_SCALAR_TAG_SPECS,
  type FfprobeFormatScalarTagProbeField,
  collectFfprobeFormatScalarTagExportLines,
  collectFfprobeFormatScalarTagInspectorBriefs,
  formatFfprobeFormatScalarTagExportLine,
  formatFfprobeFormatScalarTagInspectorBrief,
  parseFfprobeFormatScalarTagsFromFfprobe,
  parseFfprobeFormatTagScalar
} from '../../src/shared/ffprobe-format-tag-registry'
import { createMediaProbeSuccessBase } from '../fixtures/media-probe-success-base'

describe('ffprobe-format-tag-registry', () => {
  it('реестр покрывает все скалярные format.tags поля контракта', () => {
    const fields = new Set(FFPROBE_FORMAT_SCALAR_TAG_SPECS.map((s) => s.probeField))
    const expected: FfprobeFormatScalarTagProbeField[] = [
      'containerEncoder',
      'containerPublisherTag',
      'containerEncodedByTag',
      'containerSoftwareTag',
      'containerTitleTag',
      'containerSortTitleTag',
      'containerCommentTag',
      'containerSynopsisTag',
      'containerDescriptionTag',
      'containerKeywordsTag',
      'containerLyricsTag',
      'containerArtistTag',
      'containerPerformerTag',
      'containerSortArtistTag',
      'containerAlbumTag',
      'containerAlbumArtistTag',
      'containerSortAlbumTag',
      'containerGenreTag',
      'containerTrackTag',
      'containerDiscTag',
      'containerCopyrightTag',
      'containerIsrcTag',
      'containerDateTag',
      'containerLocationTag',
      'containerPurchaseDateTag'
    ]
    for (const key of expected) {
      expect(fields.has(key)).toBe(true)
    }
    expect(FFPROBE_FORMAT_SCALAR_TAG_SPECS.length).toBe(expected.length)
  })

  it('parseFfprobeFormatScalarTagsFromFfprobe — пакетом', () => {
    const tags = {
      artist: 'Flux Studio',
      album: 'Season One',
      track: '3/12',
      encoded_by: 'HandBrake 1.8'
    }
    const parsed = parseFfprobeFormatScalarTagsFromFfprobe(tags)
    expect(parsed.containerArtistTag).toBe('Flux Studio')
    expect(parsed.containerAlbumTag).toBe('Season One')
    expect(parsed.containerTrackTag).toBe('3/12')
    expect(parsed.containerEncodedByTag).toBe('HandBrake 1.8')
    expect(parsed.containerPublisherTag).toBeNull()
  })

  it.each([
    ['title', 'Demo clip', 'title', 'Demo clip', 'ru'],
    ['comment', 'Edited offline', 'comment', 'Edited offline', 'en'],
    ['artist', 'Flux Studio', 'artist', 'Flux Studio', 'en'],
    ['purchase_date', '2024-01-15', 'purchase_date', '2024-01-15', 'ru']
  ] as const)(
    'export line для format.tags.%s',
    (ffprobeKey, value, labelInLine, _unused, locale) => {
      const spec = FFPROBE_FORMAT_SCALAR_TAG_SPECS.find((s) => s.ffprobeKey === ffprobeKey)
      expect(spec).toBeDefined()
      const line = formatFfprobeFormatScalarTagExportLine(value, spec!, locale)
      expect(line).toContain(labelInLine)
      expect(line).toContain(value)
    }
  )

  it('inspector brief — title в кавычках, artist с префиксом', () => {
    const titleSpec = FFPROBE_FORMAT_SCALAR_TAG_SPECS.find((s) => s.ffprobeKey === 'title')!
    const artistSpec = FFPROBE_FORMAT_SCALAR_TAG_SPECS.find((s) => s.ffprobeKey === 'artist')!
    expect(formatFfprobeFormatScalarTagInspectorBrief('Clip', titleSpec)).toBe(' · «Clip»')
    expect(formatFfprobeFormatScalarTagInspectorBrief('Band', artistSpec)).toBe(' · art Band')
  })

  it('collect export/brief lines из probe', () => {
    const probe = createMediaProbeSuccessBase({
      containerArtistTag: 'A',
      containerGenreTag: 'Documentary'
    })
    expect(collectFfprobeFormatScalarTagExportLines(probe, 'en').join('\n')).toContain('artist')
    expect(collectFfprobeFormatScalarTagExportLines(probe, 'en').join('\n')).toContain('genre')
    expect(collectFfprobeFormatScalarTagInspectorBriefs(probe).join('')).toContain('art A')
    expect(collectFfprobeFormatScalarTagInspectorBriefs(probe).join('')).toContain('gen Documentary')
  })

  it('parseFfprobeFormatTagScalar — пустые значения', () => {
    expect(parseFfprobeFormatTagScalar({ artist: '  ' }, 'artist')).toBeNull()
    expect(parseFfprobeFormatTagScalar({ artist: 42 }, 'artist')).toBe('42')
  })
})
