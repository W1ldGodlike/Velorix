import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_FFMPEG_ERROR_DIALOG_REL } from '../../../shared/velorix-neon-theme-tokens'

import { useAppShellStore } from '../stores/app-shell-store'

/** ref.22 — текст последней ошибки FFmpeg/превью. */
export function FfmpegErrorModalBody(): JSX.Element {
  const message = useAppShellStore((s) => s.ffmpegErrorMessage)

  return (
    <div className="app-modal__body app-modal__body--stack">
      <p className="app-modal__body--error">
        {message ?? 'Операция FFmpeg завершилась с ошибкой.'}
      </p>
      <p className="app-modal__hint">Эталон: {VELORIX_NEON_REFERENCE_FFMPEG_ERROR_DIALOG_REL}</p>
    </div>
  )
}
