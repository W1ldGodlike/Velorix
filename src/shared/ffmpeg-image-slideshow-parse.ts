import {
  FFMPEG_IMAGE_SLIDESHOW_DEFAULT_TRANSITION,
  FFMPEG_IMAGE_SLIDESHOW_MAX_DURATION_SEC,
  FFMPEG_IMAGE_SLIDESHOW_MAX_IMAGES,
  FFMPEG_IMAGE_SLIDESHOW_MIN_DURATION_SEC,
  FFMPEG_IMAGE_SLIDESHOW_MIN_IMAGES,
  FFMPEG_IMAGE_SLIDESHOW_TRANSITION_IDS,
  type FfmpegImageSlideshowTransitionId,
  type MediaUtilitiesCreateImageSlideshowRequestPayload
} from './ffmpeg-image-slideshow-contract'
import { resolveSlideshowTransitionDurationSec } from './ffmpeg-image-slideshow-argv'

export type ParseImageSlideshowRequestResult =
  | { ok: true; payload: MediaUtilitiesCreateImageSlideshowRequestPayload }
  | {
      ok: false
      error:
        | 'invalid_request'
        | 'too_few_images'
        | 'too_many_images'
        | 'invalid_duration'
        | 'invalid_transition'
    }

function parseSlideshowTransitionId(raw: unknown): FfmpegImageSlideshowTransitionId | null {
  if (typeof raw !== 'string') {
    return null
  }
  const id = raw.trim() as FfmpegImageSlideshowTransitionId
  if ((FFMPEG_IMAGE_SLIDESHOW_TRANSITION_IDS as readonly string[]).includes(id)) {
    return id
  }
  return null
}

export function parseImageSlideshowRequest(raw: unknown): ParseImageSlideshowRequestResult {
  if (raw === null || typeof raw !== 'object') {
    return { ok: false, error: 'invalid_request' }
  }
  const o = raw as Record<string, unknown>
  const pathsRaw = o['imagePaths']
  if (!Array.isArray(pathsRaw)) {
    return { ok: false, error: 'invalid_request' }
  }
  const imagePaths = pathsRaw
    .filter((p): p is string => typeof p === 'string' && p.trim().length > 0)
    .map((p) => p.trim())
  if (imagePaths.length < FFMPEG_IMAGE_SLIDESHOW_MIN_IMAGES) {
    return { ok: false, error: 'too_few_images' }
  }
  if (imagePaths.length > FFMPEG_IMAGE_SLIDESHOW_MAX_IMAGES) {
    return { ok: false, error: 'too_many_images' }
  }
  const duration =
    typeof o['slideDurationSec'] === 'number'
      ? o['slideDurationSec']
      : Number.parseFloat(String(o['slideDurationSec'] ?? ''))
  if (
    !Number.isFinite(duration) ||
    duration < FFMPEG_IMAGE_SLIDESHOW_MIN_DURATION_SEC ||
    duration > FFMPEG_IMAGE_SLIDESHOW_MAX_DURATION_SEC
  ) {
    return { ok: false, error: 'invalid_duration' }
  }
  const transitionRaw = o['transition']
  const transition =
    transitionRaw === undefined || transitionRaw === null
      ? FFMPEG_IMAGE_SLIDESHOW_DEFAULT_TRANSITION
      : parseSlideshowTransitionId(transitionRaw)
  if (transition === null) {
    return { ok: false, error: 'invalid_transition' }
  }
  if (transition !== 'none') {
    const transitionDur = resolveSlideshowTransitionDurationSec(duration)
    if (duration <= transitionDur) {
      return { ok: false, error: 'invalid_duration' }
    }
  }
  const uiLocale = o['uiLocale'] === 'en' || o['uiLocale'] === 'ru' ? o['uiLocale'] : undefined
  return {
    ok: true,
    payload: {
      imagePaths,
      slideDurationSec: duration,
      transition,
      ...(uiLocale ? { uiLocale } : {})
    }
  }
}
