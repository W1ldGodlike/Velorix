import { describe, expect, it } from 'vitest'

import { FFPROBE_TRACK_DETAIL_CASES } from '../fixtures/ffprobe-track-detail-cases'
import { trackDetailAt } from '../fixtures/ffprobe-track-rows-helpers'

describe('ffprobe-service buildTrackRows (detail cases)', () => {
  it.each(FFPROBE_TRACK_DETAIL_CASES)(
    '$label',
    ({ streams, duration, row, contains, notContains, notMatch }) => {
      const detail = trackDetailAt(streams, row, duration)
      for (const token of contains) {
        expect(detail).toContain(token)
      }
      for (const token of notContains ?? []) {
        expect(detail).not.toContain(token)
      }
      if (notMatch) {
        expect(detail).not.toMatch(notMatch)
      }
    }
  )
})
