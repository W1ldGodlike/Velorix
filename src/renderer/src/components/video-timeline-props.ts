import type { RefObject } from 'react'

import type { MediaProbeSuccess } from '../../../shared/ffprobe-contract'

export interface TrimMarks {
  inSec: number
  /** `null` до известной длительности — трактуем как конец файла после загрузки метаданных. */
  outSec: number | null
}

export interface VideoTimelineProps {
  /** Совпадает с `key` у `<video>`, чтобы переподписаться при смене источника. */
  mediaKey: string
  /** `fluxmedia://…` для побочной декодирования waveform без Node API в renderer (§1.1 v0). */
  mediaUrl: string
  videoRef: RefObject<HTMLVideoElement | null>
  /** Сводка ffprobe для строки «Видео / Аудио / Позиция» (`docs/UX_REFERENCE_V0.md`). */
  probe?: MediaProbeSuccess | null
  /** Снимок актуальных маркеров для экспорта §7.1 (родитель держит только ref на последнее значение). */
  onTrimRangeChange?: (range: { inSec: number; outSec: number }) => void
  /** Секция «Вывод» + превью команды в правом rail (кнопка «Обрезать»). */
  onJumpToTrimExport?: () => void
  /** Запуск экспорта (та же логика, что кнопка «Начать экспорт» на таймлайне). */
  onStartExport?: () => void
  /** Сохранить кадр в позиции воспроизведения (отдельный файл). */
  onSaveFrame?: () => void
  saveFrameDisabled?: boolean
  saveFrameBusy?: boolean
  /** Экспорт/снимок/ffprobe превью — синхронизация `aria-busy` с родителем (`App.tsx`). */
  previewPipelineBusy?: boolean
}
