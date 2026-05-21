import type { FfprobeJson } from './ffprobe-json-types'

export type FfprobeStream = NonNullable<FfprobeJson['streams']>[number]
