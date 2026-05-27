import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_QUIT_CONFIRM_REL } from '../../../shared/velorix-neon-theme-tokens'

import { useAppShellStore } from '../stores/app-shell-store'

/** ref.21 — текст диалога выхода с учётом busy-флагов из main. */
export function QuitConfirmModalBody(): JSX.Element {
  const payload = useAppShellStore((s) => s.quitConfirmRequest)

  if (payload == null) {
    return <p className="app-modal__body">Завершить работу приложения?</p>
  }

  const hints: string[] = []
  if (payload.exportBusy) {
    hints.push('Идёт экспорт FFmpeg.')
  }
  if (payload.downloadsBusy) {
    hints.push('Активны загрузки yt-dlp.')
  }
  if (payload.waitingCount > 0) {
    hints.push(`В очереди загрузок: ${String(payload.waitingCount)}.`)
  }

  return (
    <div className="app-modal__body app-modal__body--stack">
      <p>Завершить работу Velorix?</p>
      {hints.length > 0 ? (
        <ul className="app-modal__hint-list">
          {hints.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : (
        <p className="app-modal__hint">Нет активных задач.</p>
      )}
      <p className="app-modal__hint">Эталон: {VELORIX_NEON_REFERENCE_QUIT_CONFIRM_REL}</p>
    </div>
  )
}
