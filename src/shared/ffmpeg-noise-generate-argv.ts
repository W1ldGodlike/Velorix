/** argv lavfi для §17 генератора WAV (белый/розовый шум, тишина). */

import type { MediaUtilitiesNoiseKind } from './media-utilities-contract'

export function buildFfmpegNoiseLavfiSource(
  kind: MediaUtilitiesNoiseKind,
  durationSec: number
): string {
  const d = String(durationSec)
  switch (kind) {
    case 'white':
      return `anoisesrc=duration=${d}:color=white:sample_rate=44100`
    case 'pink':
      return `anoisesrc=duration=${d}:color=pink:sample_rate=44100`
    case 'silence':
      return `anullsrc=r=44100:cl=stereo:d=${d}`
  }
}

export function buildFfmpegGenerateNoiseArgv(
  kind: MediaUtilitiesNoiseKind,
  durationSec: number,
  outputPath: string
): string[] {
  return [
    '-hide_banner',
    '-loglevel',
    'error',
    '-f',
    'lavfi',
    '-i',
    buildFfmpegNoiseLavfiSource(kind, durationSec),
    '-y',
    outputPath
  ]
}
