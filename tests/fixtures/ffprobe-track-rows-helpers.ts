import { buildTrackRows } from '../../src/main/services/ffprobe/ffprobe-service'

/** Минимальный stream-объект для `buildTrackRows` в unit-тестах. */
export type FfprobeStreamFixture = Record<string, unknown> & {
  codec_type: string
  index?: number
}

export function trackDetailAt(
  streams: FfprobeStreamFixture[],
  rowIndex: number,
  duration: number | null = null
): string {
  const normalized = streams.map((s, i) => ({
    index: typeof s.index === 'number' ? s.index : i,
    ...s
  }))
  return (
    buildTrackRows(normalized as Parameters<typeof buildTrackRows>[0], duration)[rowIndex]
      ?.detail ?? ''
  )
}
