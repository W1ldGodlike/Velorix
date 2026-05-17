import { describe, expect, it } from 'vitest'

import {
  formatFfprobeContainerTimingProbeCompactLine,
  formatFfprobeContainerTimingProbeExportLine
} from '../../src/shared/ffprobe-container-format'

describe('formatFfprobeContainerTimingProbeCompactLine', () => {
  it('joins duration_ts, time_base and probe_io', () => {
    expect(
      formatFfprobeContainerTimingProbeCompactLine({
        containerDurationTs: 90000,
        containerTimeBase: '1/90000',
        containerProbeSizeBytes: 4096
      })
    ).toBe('dur_ts 90000 · tb 1/90000 · probe_io 4.00 KiB')
  })

  it('returns null when all fields empty', () => {
    expect(
      formatFfprobeContainerTimingProbeCompactLine({
        containerDurationTs: null,
        containerTimeBase: null,
        containerProbeSizeBytes: null
      })
    ).toBeNull()
  })
})

describe('formatFfprobeContainerTimingProbeExportLine', () => {
  it('joins localized export fragments', () => {
    const line = formatFfprobeContainerTimingProbeExportLine(
      {
        containerDurationTs: 90000,
        containerTimeBase: '1/90000',
        containerProbeSizeBytes: 4096
      },
      'ru'
    )
    expect(line).toContain('duration_ts')
    expect(line).toContain('time_base')
    expect(line).toContain('probe_size')
    expect(line!.split(' · ').length).toBe(3)
  })
})
