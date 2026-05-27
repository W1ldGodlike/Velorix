import { useEffect, useState } from 'react'

import type { FfmpegExportProgressPayload } from '../../../../shared/ffmpeg-export-contract'

/** Подписка на `export.onProgress` пока идёт одиночный экспорт. */
export function useExportProgressNote(active: boolean): string | null {
  const [note, setNote] = useState<string | null>(null)

  useEffect(() => {
    if (!active) {
      return
    }
    const subscribe = window.velorix?.export?.onProgress
    if (subscribe == null) {
      return
    }
    return subscribe((payload: FfmpegExportProgressPayload) => {
      const pct = payload.percent >= 0 ? `${String(payload.percent)}%` : ''
      const line = [pct, payload.message].filter((chunk) => chunk.length > 0).join(' · ')
      setNote(line.length > 0 ? line : 'Экспорт…')
    })
  }, [active])

  return note
}
