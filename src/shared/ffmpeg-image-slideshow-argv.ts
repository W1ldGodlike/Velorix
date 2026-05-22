/** §7.5.4 — still images → H.264 MP4 (1920×1080 pad, 30 fps, optional xfade). */

import type { FfmpegImageSlideshowTransitionId } from './ffmpeg-image-slideshow-contract'
import { FFMPEG_IMAGE_SLIDESHOW_XFADE_DURATION_SEC } from './ffmpeg-image-slideshow-contract'

const SLIDESHOW_WIDTH = 1920
const SLIDESHOW_HEIGHT = 1080
const SLIDESHOW_FPS = 30

const SCALE_PAD = `scale=${SLIDESHOW_WIDTH}:${SLIDESHOW_HEIGHT}:force_original_aspect_ratio=decrease,pad=${SLIDESHOW_WIDTH}:${SLIDESHOW_HEIGHT}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=${SLIDESHOW_FPS}`

export function resolveSlideshowTransitionDurationSec(slideDurationSec: number): number {
  const cap = Math.min(FFMPEG_IMAGE_SLIDESHOW_XFADE_DURATION_SEC, slideDurationSec * 0.45)
  return Math.max(0.2, cap)
}

function buildScaledLabels(n: number): { scaled: string[]; labels: string[] } {
  const scaled: string[] = []
  const labels: string[] = []
  for (let i = 0; i < n; i++) {
    labels.push(`v${i}`)
    scaled.push(`[${i}:v]${SCALE_PAD}[v${i}]`)
  }
  return { scaled, labels }
}

function buildConcatFilterComplex(n: number): string {
  const { scaled, labels } = buildScaledLabels(n)
  const concatInputs = labels.map((l) => `[${l}]`).join('')
  return `${scaled.join(';')};${concatInputs}concat=n=${n}:v=1:a=0[out]`
}

function buildXfadeFilterComplex(
  n: number,
  slideDurationSec: number,
  transition: Exclude<FfmpegImageSlideshowTransitionId, 'none'>,
  transitionDurationSec: number
): string {
  const { scaled, labels } = buildScaledLabels(n)
  const step = slideDurationSec - transitionDurationSec
  let filter = scaled.join(';')
  let prev = labels[0]!
  for (let i = 1; i < n; i++) {
    const next = labels[i]!
    const out = i === n - 1 ? 'out' : `xf${i}`
    const offset = i * step
    filter += `;[${prev}][${next}]xfade=transition=${transition}:duration=${transitionDurationSec}:offset=${offset}[${out}]`
    prev = out
  }
  return filter
}

export function buildFfmpegImageSlideshowArgv(params: {
  imagePaths: readonly string[]
  outputPath: string
  slideDurationSec: number
  transition?: FfmpegImageSlideshowTransitionId
}): string[] {
  const n = params.imagePaths.length
  const t = String(params.slideDurationSec)
  const transition = params.transition ?? 'fade'
  const inputArgs: string[] = ['-hide_banner', '-loglevel', 'error']
  for (const imagePath of params.imagePaths) {
    inputArgs.push('-loop', '1', '-t', t, '-i', imagePath)
  }
  let filter: string
  if (transition === 'none' || n < 2) {
    filter = buildConcatFilterComplex(n)
  } else {
    const transitionDurationSec = resolveSlideshowTransitionDurationSec(params.slideDurationSec)
    filter = buildXfadeFilterComplex(n, params.slideDurationSec, transition, transitionDurationSec)
  }
  return [
    ...inputArgs,
    '-filter_complex',
    filter,
    '-map',
    '[out]',
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    '-y',
    params.outputPath
  ]
}
