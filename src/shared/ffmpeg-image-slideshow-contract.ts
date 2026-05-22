/** §7.5.4 — MP4 из серии изображений (равная длительность кадра). */

import type { AppUiLocale } from './app-ui-locale'

export const FFMPEG_IMAGE_SLIDESHOW_MIN_IMAGES = 2
export const FFMPEG_IMAGE_SLIDESHOW_MAX_IMAGES = 40
export const FFMPEG_IMAGE_SLIDESHOW_MIN_DURATION_SEC = 0.5
export const FFMPEG_IMAGE_SLIDESHOW_MAX_DURATION_SEC = 30
export const FFMPEG_IMAGE_SLIDESHOW_XFADE_DURATION_SEC = 0.5

/** xfade `transition=` (ffmpeg); `none` — concat без переходов. */
export const FFMPEG_IMAGE_SLIDESHOW_TRANSITION_IDS = [
  'fade',
  'fadeblack',
  'wipeleft',
  'wiperight',
  'none'
] as const

export type FfmpegImageSlideshowTransitionId =
  (typeof FFMPEG_IMAGE_SLIDESHOW_TRANSITION_IDS)[number]

export const FFMPEG_IMAGE_SLIDESHOW_DEFAULT_TRANSITION: FfmpegImageSlideshowTransitionId = 'fade'

export type MediaUtilitiesPickSlideshowImagesResult =
  | { ok: true; paths: string[] }
  | { ok: false; cancelled: true }
  | { ok: false; error: string }

export type MediaUtilitiesCreateImageSlideshowRequestPayload = {
  imagePaths: string[]
  slideDurationSec: number
  transition?: FfmpegImageSlideshowTransitionId
  uiLocale?: AppUiLocale
}

export type MediaUtilitiesCreateImageSlideshowResult =
  | { ok: true; outputPath: string }
  | { ok: false; cancelled: true }
  | { ok: false; error: string }
