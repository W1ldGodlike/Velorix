import { useCallback, useState, type JSX } from 'react'

import {
  FFMPEG_IMAGE_SLIDESHOW_DEFAULT_TRANSITION,
  FFMPEG_IMAGE_SLIDESHOW_TRANSITION_IDS,
  type FfmpegImageSlideshowTransitionId
} from '../../../shared/ffmpeg-image-slideshow-contract'
import { getUiLocale, uiText, uiTextVars } from '../locales/ui-text'

function slideshowTransitionLabel(id: FfmpegImageSlideshowTransitionId): string {
  if (id === 'fadeblack') {
    return uiText('mediaUtilitiesSlideshowTransitionFadeblack')
  }
  if (id === 'wipeleft') {
    return uiText('mediaUtilitiesSlideshowTransitionWipeleft')
  }
  if (id === 'wiperight') {
    return uiText('mediaUtilitiesSlideshowTransitionWiperight')
  }
  if (id === 'none') {
    return uiText('mediaUtilitiesSlideshowTransitionNone')
  }
  return uiText('mediaUtilitiesSlideshowTransitionFade')
}

export function MediaFileUtilitiesSlideshowSection(props: {
  disabled?: boolean
  describedById?: string
  busy: boolean
  setBusy: (next: boolean) => void
  onStatus: (message: string) => void
}): JSX.Element {
  const { disabled = false, describedById, busy, setBusy, onStatus } = props
  const [slideshowPaths, setSlideshowPaths] = useState<string[]>([])
  const [slideshowDurationSec, setSlideshowDurationSec] = useState('3')
  const [slideshowTransition, setSlideshowTransition] = useState<FfmpegImageSlideshowTransitionId>(
    FFMPEG_IMAGE_SLIDESHOW_DEFAULT_TRANSITION
  )

  const pickSlideshowImages = useCallback(async (): Promise<void> => {
    if (busy) {
      return
    }
    const res = await window.velorix.utilities.pickSlideshowImages()
    if ('cancelled' in res && res.cancelled) {
      return
    }
    if (!res.ok) {
      if ('error' in res) {
        onStatus(res.error)
      }
      return
    }
    setSlideshowPaths(res.paths)
    onStatus(uiTextVars('mediaUtilitiesSlideshowPicked', { count: String(res.paths.length) }))
  }, [busy, onStatus])

  const runSlideshow = useCallback(async (): Promise<void> => {
    if (busy || slideshowPaths.length < 2) {
      return
    }
    const slideDurationSec = Number.parseFloat(slideshowDurationSec.trim())
    if (!Number.isFinite(slideDurationSec) || slideDurationSec <= 0) {
      onStatus(uiText('mediaUtilitiesSlideshowDurationLabel'))
      return
    }
    setBusy(true)
    onStatus(uiText('mediaUtilitiesSlideshowBusy'))
    try {
      const res = await window.velorix.utilities.createImageSlideshow({
        imagePaths: slideshowPaths,
        slideDurationSec,
        transition: slideshowTransition,
        uiLocale: getUiLocale()
      })
      if (res.ok) {
        onStatus(uiTextVars('mediaUtilitiesSlideshowDone', { path: res.outputPath }))
      } else if ('cancelled' in res && res.cancelled) {
        onStatus(uiText('mediaUtilitiesCancelled'))
      } else if ('error' in res) {
        onStatus(res.error)
      }
    } finally {
      setBusy(false)
    }
  }, [busy, onStatus, setBusy, slideshowDurationSec, slideshowPaths, slideshowTransition])

  return (
    <section
      className="about-diagnostics-folders media-slideshow-utilities"
      aria-label={uiText('mediaUtilitiesSlideshowTitle')}
      {...(describedById ? { 'aria-describedby': describedById } : {})}
      aria-busy={busy}
    >
      <h3 className="about-section-title">{uiText('mediaUtilitiesSlideshowTitle')}</h3>
      <p className="app-modal-hint">{uiText('mediaUtilitiesSlideshowHint')}</p>
      <p className="app-modal-hint">
        {slideshowPaths.length > 0
          ? uiTextVars('mediaUtilitiesSlideshowPicked', { count: String(slideshowPaths.length) })
          : uiText('mediaUtilitiesNoFile')}
      </p>
      <div className="app-settings-field-row">
        <label
          className="app-settings-label"
          htmlFor="media-slideshow-duration"
          title={uiText('mediaUtilitiesSlideshowDurationTitle')}
        >
          {uiText('mediaUtilitiesSlideshowDurationLabel')}
        </label>
        <input
          id="media-slideshow-duration"
          className="app-control"
          type="number"
          min={0.5}
          max={30}
          step={0.5}
          disabled={disabled || busy}
          value={slideshowDurationSec}
          title={uiText('mediaUtilitiesSlideshowDurationTitle')}
          onChange={(e) => {
            setSlideshowDurationSec(e.target.value)
          }}
        />
      </div>
      <div className="app-settings-field-row">
        <label
          className="app-settings-label"
          htmlFor="media-slideshow-transition"
          title={uiText('mediaUtilitiesSlideshowTransitionTitle')}
        >
          {uiText('mediaUtilitiesSlideshowTransitionLabel')}
        </label>
        <select
          id="media-slideshow-transition"
          className="app-control"
          disabled={disabled || busy}
          title={uiText('mediaUtilitiesSlideshowTransitionTitle')}
          value={slideshowTransition}
          onChange={(e) => {
            setSlideshowTransition(e.target.value as FfmpegImageSlideshowTransitionId)
          }}
        >
          {FFMPEG_IMAGE_SLIDESHOW_TRANSITION_IDS.map((id) => (
            <option key={id} value={id}>
              {slideshowTransitionLabel(id)}
            </option>
          ))}
        </select>
      </div>
      <div
        className="app-settings-benchmark-actions"
        role="toolbar"
        aria-label={uiText('mediaUtilitiesSlideshowToolbarAria')}
      >
        <button
          type="button"
          className="app-btn app-btn-compact"
          disabled={disabled || busy}
          title={uiText('mediaUtilitiesSlideshowPickTitle')}
          onClick={() => {
            void pickSlideshowImages()
          }}
        >
          {uiText('mediaUtilitiesSlideshowPick')}
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact"
          disabled={disabled || busy || slideshowPaths.length < 2}
          title={uiText('mediaUtilitiesSlideshowCreateTitle')}
          onClick={() => {
            void runSlideshow()
          }}
        >
          {uiText('mediaUtilitiesSlideshowCreate')}
        </button>
      </div>
    </section>
  )
}
