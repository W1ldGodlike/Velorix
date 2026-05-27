import { describe, expect, it } from 'vitest'

import { formatMediaProbeSummary } from '../../src/renderer/src/lib/format-media-probe-summary'

describe('formatMediaProbeSummary', () => {
  it('joins resolution, codec, fps and duration', () => {
    const line = formatMediaProbeSummary({
      ok: true,
      durationSec: 125,
      video: { width: 3840, height: 2160, codec: 'hevc' },
      videoFpsApprox: 59.94,
      audioCodec: 'aac',
      formatName: 'matroska',
      formatLongName: null,
      bitrateKbps: null,
      containerMajorBrand: null,
      containerCreationTime: null,
      containerEncoder: null,
      containerPublisherTag: null,
      containerEncodedByTag: null,
      containerSoftwareTag: null,
      containerTitleTag: null,
      containerCommentTag: null,
      containerSynopsisTag: null,
      containerDescriptionTag: null,
      containerKeywordsTag: null,
      containerLyricsTag: null,
      containerArtistTag: null,
      containerPerformerTag: null,
      containerSortArtistTag: null,
      containerAlbumTag: null,
      containerAlbumArtistTag: null,
      containerSortAlbumTag: null,
      containerSortTitleTag: null,
      containerGenreTag: null,
      containerTrackTag: null,
      containerDiscTag: null,
      containerCopyrightTag: null,
      containerIsrcTag: null,
      containerDateTag: null,
      containerLocationTag: null,
      containerPurchaseDateTag: null,
      containerCompatibleBrands: null,
      probeScore: null,
      containerNbStreams: null,
      containerNbPrograms: null,
      containerNbChapters: null,
      containerFormatFlags: null,
      containerSizeBytes: null,
      containerStartTimeSec: null,
      containerStartTimeRealSec: null,
      containerDurationTs: null,
      containerTimeBase: null,
      containerProbeSizeBytes: null,
      containerFilename: null,
      tracks: [],
      chapters: [],
      rawJson: '{}'
    })
    expect(line).toContain('3840×2160')
    expect(line).toContain('hevc')
    expect(line).toContain('59.94 fps')
    expect(line).toContain('2:05')
    expect(line).toContain('matroska')
  })
})
