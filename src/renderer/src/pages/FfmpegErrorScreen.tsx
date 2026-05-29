import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_FFMPEG_ERROR_DIALOG_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import { FE_STATUS_READY, FE_STATUS_ROWS } from './ffmpeg-error-ref22-data'
import { FfmpegErrorModal, FfmpegErrorSceneBackdrop } from './ffmpeg-error-ref22-parts'

/** ref.22 — Ошибка FFmpeg dialog over processing backdrop (mock; not sign-off). */
export function FfmpegErrorScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div
        className="about-scene fe-scene"
        data-ref={VELORIX_NEON_REFERENCE_FFMPEG_ERROR_DIALOG_REL}
      >
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_FFMPEG_ERROR_DIALOG_REL} />
        ) : null}
        <FfmpegErrorSceneBackdrop />
        <div className="about-scene__scrim" aria-hidden />
        <FfmpegErrorModal />
        <footer className="tools-statusbar fe-scene__status" aria-label="Статус">
          <span className="tools-statusbar__ready">
            <span className="tools-statusbar__dot" aria-hidden />
            {FE_STATUS_READY}
          </span>
          <div className="tools-statusbar__center">
            {FE_STATUS_ROWS.map((row) => (
              <span
                key={row.label}
                className={`tools-statusbar__item${row.accent ? ` tools-statusbar__item--${row.accent}` : ''}`}
              >
                <strong>{row.label}:</strong>{' '}
                {row.mono ? <em className="tools-statusbar__tc">{row.value}</em> : row.value}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </NeonWindowChrome>
  )
}
