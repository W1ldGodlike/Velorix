import { describe, expect, it } from 'vitest'

import {
  formatFfprobeContainerDiagnosticsCompactLine,
  formatFfprobeContainerOffsetTimingCompactLine,
  formatFfprobeContainerOffsetTimingExportLine,
  formatFfprobeContainerTimingProbeCompactLine,
  formatFfprobeContainerTimingProbeExportLine
} from '../../src/shared/ffprobe-container-format'
import { createMediaProbeSuccessBase } from '../fixtures/media-probe-success-base'

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

describe('formatFfprobeContainerDiagnosticsCompactLine', () => {
  it('joins probe layout and offset timing', () => {
    const line = formatFfprobeContainerDiagnosticsCompactLine(
      createMediaProbeSuccessBase({
        probeScore: 100,
        containerNbStreams: 2,
        containerSizeBytes: 4096,
        containerFormatFlags: '0x0',
        containerDurationTs: 90000,
        containerTimeBase: '1/90000'
      })
    )
    expect(line).toContain('probe 100')
    expect(line).toContain('dur_ts 90000')
  })
})

describe('formatFfprobeContainerOffsetTimingCompactLine', () => {
  it('joins timing probe and start offset', () => {
    expect(
      formatFfprobeContainerOffsetTimingCompactLine({
        containerDurationTs: 90000,
        containerTimeBase: '1/90000',
        containerProbeSizeBytes: 4096,
        containerStartTimeSec: 0.5,
        containerStartTimeRealSec: 0.75
      })
    ).toBe('dur_ts 90000 · tb 1/90000 · probe_io 4.00 KiB · start +500ms · real +750ms')
  })
})

describe('formatFfprobeContainerOffsetTimingExportLine', () => {
  it('joins timing and start export fragments', () => {
    const line = formatFfprobeContainerOffsetTimingExportLine(
      {
        containerDurationTs: 90000,
        containerTimeBase: '1/90000',
        containerProbeSizeBytes: 4096,
        containerStartTimeSec: 0.5,
        containerStartTimeRealSec: 0.75
      },
      'ru'
    )
    expect(line).toContain('duration_ts')
    expect(line).toContain('start_time_real')
    expect(line!.split(' · ').length).toBeGreaterThanOrEqual(3)
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
