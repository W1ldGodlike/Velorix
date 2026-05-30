import type { JSX } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import {
  NEON_REF_OVERLAY_VISIBLE_KEY,
  readRefOverlayFitFromLocation,
  readRefOverlayOpacity,
  readRefOverlayVisible,
  refOverlayCompareNoteForRel,
  refOverlayPortalHost,
  refOverlayUrlForRel,
  writeRefOverlayFit,
  writeRefOverlayOpacity,
  writeRefOverlayVisible,
  type RefOverlayFit
} from '../../../shared/neon-reference-overlay-dev'

import '../assets/neon-reference-overlay.css'

/** PNG overlay for dev sign-off; portal → `.neon-chrome-shell__body` (─✕ вне сравнения). */
export function NeonReferenceOverlay(props: { referenceRel: string }): JSX.Element | null {
  const { referenceRel } = props
  const [visible, setVisible] = useState(() => {
    const stored = readRefOverlayVisible()
    if (stored) {
      return true
    }
    try {
      if (import.meta.env.DEV && localStorage.getItem(NEON_REF_OVERLAY_VISIBLE_KEY) == null) {
        return true
      }
    } catch {
      /* ignore */
    }
    return stored
  })
  const [opacity, setOpacity] = useState(() => readRefOverlayOpacity())
  const [fit, setFit] = useState<RefOverlayFit>(() => readRefOverlayFitFromLocation())
  const [imgError, setImgError] = useState(false)

  const toggleVisible = useCallback(() => {
    setVisible((prev) => {
      const next = !prev
      writeRefOverlayVisible(next)
      return next
    })
  }, [])

  const onOpacity = useCallback((value: number) => {
    setOpacity(value)
    writeRefOverlayOpacity(value)
  }, [])

  const onFit = useCallback((mode: RefOverlayFit) => {
    setFit(mode)
    writeRefOverlayFit(mode)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key !== 'o' && event.key !== 'O') {
        return
      }
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }
      event.preventDefault()
      toggleVisible()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleVisible])

  const src = refOverlayUrlForRel(referenceRel)

  if (!src) {
    return null
  }

  const refTag = referenceRel.split('/').pop() ?? 'ref'
  const compareNote = refOverlayCompareNoteForRel(referenceRel)

  const layer = (
    <div
      className="neon-ref-overlay"
      data-neon-ref-overlay={refTag}
      data-neon-ref-overlay-zone="shell-body"
      style={{ ['--neon-ref-overlay-fit' as string]: fit }}
    >
      {visible ? (
        <img
          key={src}
          className="neon-ref-overlay__img"
          src={src}
          alt=""
          aria-hidden
          style={{ opacity }}
          onLoad={() => setImgError(false)}
          onError={() => setImgError(true)}
        />
      ) : null}
      <div className="neon-ref-overlay__hud vn-surface-glass">
        <span className="neon-ref-overlay__tag" title={compareNote}>
          ref overlay · {refTag}
          {imgError ? ' · PNG не загрузился' : ''}
        </span>
        <span className="neon-ref-overlay__note">{compareNote}</span>
        <button type="button" className="neon-ref-overlay__btn" onClick={toggleVisible}>
          {visible ? 'Скрыть' : 'Показать'}
        </button>
        <label className="neon-ref-overlay__opacity">
          <span>{Math.round(opacity * 100)}%</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(opacity * 100)}
            onChange={(e) => onOpacity(Number(e.target.value) / 100)}
          />
        </label>
        <div className="neon-ref-overlay__fits" role="group" aria-label="object-fit">
          {(['cover', 'contain', 'fill'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={
                fit === mode
                  ? 'neon-ref-overlay__fit neon-ref-overlay__fit--active'
                  : 'neon-ref-overlay__fit'
              }
              onClick={() => onFit(mode)}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const host = refOverlayPortalHost()
  return host != null ? createPortal(layer, host) : layer
}
