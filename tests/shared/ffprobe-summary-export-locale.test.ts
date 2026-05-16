import { describe, expect, it } from 'vitest'

import {
  FFPROBE_BITRATE_FROM_BPS_CASES,
  FFPROBE_BITRATE_FROM_KBPS_CASES
} from '../fixtures/ffprobe-summary-bitrate-label-cases'
import {
  formatFfprobeBitrateLabelFromBps,
  formatFfprobeBitrateLabelFromKbps,
  ffprobeSummaryFill,
  ffprobeSummaryStrings
} from '../../src/shared/ffprobe-summary-export-locale'

describe('ffprobe-summary-export-locale', () => {
  it('RU и EN имеют одинаковый набор ключей FfprobeSummaryStrings', () => {
    expect(Object.keys(ffprobeSummaryStrings('ru')).sort()).toEqual(
      Object.keys(ffprobeSummaryStrings('en')).sort()
    )
  })

  it('ffprobeSummaryFill подставляет плейсхолдеры', () => {
    expect(
      ffprobeSummaryFill(ffprobeSummaryStrings('ru').containerBrandTemplate, {
        brand: 'isom'
      })
    ).toBe('Бренд контейнера: isom')
  })

  it.each(FFPROBE_BITRATE_FROM_BPS_CASES)(
    'formatFfprobeBitrateLabelFromBps $bps $locale',
    ({ bps, locale, expected }) => {
      expect(formatFfprobeBitrateLabelFromBps(bps, locale)).toBe(expected)
    }
  )

  it.each(FFPROBE_BITRATE_FROM_KBPS_CASES)(
    'formatFfprobeBitrateLabelFromKbps $kbps $locale',
    ({ kbps, locale, expected }) => {
      expect(formatFfprobeBitrateLabelFromKbps(kbps, locale)).toBe(expected)
    }
  )
})
