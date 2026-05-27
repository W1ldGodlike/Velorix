import { useEffect, useRef, useState } from 'react'

import { computeWaveformPeakEnvelopeMono } from '../../../shared/waveform-peaks'
import { uiText, uiTextVars } from '../locales/ui-text'

/** Декодируем waveform только для коротких клипов — полный буфер `decodeAudioData` тяжёлый для длинных роликов. */
export const WAVEFORM_MAX_DURATION_SEC = 180
const WAVEFORM_MAX_FETCH_BYTES = 96 * 1024 * 1024

const PEAK_BUCKETS = 400

interface TimelineWaveformProps {
  /** `velorixmedia://…` после grant; синхронизируется по `mediaKey`. */
  mediaUrl: string
  mediaKey: string
  durationSec: number
  /** Видимый отрезок таймлайна (глобальные секунды). */
  windowStartSec: number
  windowLenSec: number
  /**
   * Визуальный режим дорожек.
   * Для NEON ref.1 рисуем несколько «полос» внутри одного canvas (без новой модели timeline/IPC).
   */
  laneCount?: number
}

/** Микширование каналов до моно средним — стабильная огибающая без псевдослучайных высот. */
function mergeChannelsToMono(decoded: AudioBuffer): Float32Array {
  const len = decoded.length
  const chCount = decoded.numberOfChannels
  if (chCount <= 1) {
    return decoded.getChannelData(0)
  }
  const out = new Float32Array(len)
  for (let i = 0; i < len; i++) {
    let sum = 0
    for (let c = 0; c < chCount; c++) {
      sum += decoded.getChannelData(c)[i] ?? 0
    }
    out[i] = sum / chCount
  }
  return out
}

async function readArrayBufferWithLimit(
  res: Response,
  maxBytes: number
): Promise<ArrayBuffer | null> {
  if (!res.body) {
    const buf = await res.arrayBuffer()
    return buf.byteLength > maxBytes ? null : buf
  }

  const reader = res.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }
      if (!value) {
        continue
      }
      total += value.byteLength
      if (total > maxBytes) {
        await reader.cancel().catch(() => {})
        return null
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  const out = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.byteLength
  }
  return out.buffer
}

/** Загружает огибающую из аудиотрека медиафайла; при ошибке показывает подсказку вместо графики. */
export default function TimelineWaveform({
  mediaUrl,
  mediaKey,
  durationSec,
  windowStartSec,
  windowLenSec,
  laneCount = 1
}: TimelineWaveformProps): React.JSX.Element {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [peaks, setPeaks] = useState<readonly number[] | null>(null)
  const [hint, setHint] = useState<string | null>(null)

  const laneCountSafe = Math.max(1, Math.min(8, Math.floor(laneCount)))

  useEffect(() => {
    let cancelled = false
    const ac = new AbortController()

    void (async (): Promise<void> => {
      /** Не синхронно в теле effect: сброс перед новым decode / ветками «слишком длинный». */
      await Promise.resolve()
      if (cancelled) {
        return
      }
      setPeaks(null)
      setHint(null)

      if (durationSec <= 0 || durationSec > WAVEFORM_MAX_DURATION_SEC) {
        return
      }

      const ACtx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!ACtx) {
        if (!cancelled) {
          setHint(uiText('timelineWaveformWebAudioUnavailable'))
        }
        return
      }
      try {
        const res = await fetch(mediaUrl, { signal: ac.signal })
        if (!res.ok) {
          throw new Error(
            uiTextVars('timelineWaveformMediaResponseErrorTemplate', { status: res.status })
          )
        }
        const contentLength = Number(res.headers.get('content-length') ?? '')
        if (Number.isFinite(contentLength) && contentLength > WAVEFORM_MAX_FETCH_BYTES) {
          if (!cancelled) {
            setHint(uiText('timelineWaveformDisabledLargeFile'))
          }
          return
        }
        const buf = await readArrayBufferWithLimit(res, WAVEFORM_MAX_FETCH_BYTES)
        if (buf === null) {
          if (!cancelled) {
            setHint(uiText('timelineWaveformDisabledLargeFile'))
          }
          return
        }
        if (cancelled) {
          return
        }

        const ctx = new ACtx()
        try {
          const copy = buf.slice(0)
          const decoded = await ctx.decodeAudioData(copy)
          if (cancelled) {
            return
          }

          const mono = mergeChannelsToMono(decoded)
          const envelope = computeWaveformPeakEnvelopeMono(mono, PEAK_BUCKETS)
          setPeaks(envelope)

          if (!cancelled && decoded.duration > durationSec + 1.25) {
            setHint(
              uiTextVars('timelineWaveformAudioLongerHintTemplate', {
                audioSec: decoded.duration.toFixed(1),
                videoSec: durationSec.toFixed(1)
              })
            )
          }
        } finally {
          void ctx.close().catch(() => {})
        }
      } catch {
        if (!cancelled && !ac.signal.aborted) {
          setHint(uiText('timelineWaveformDecodeFailedHint'))
        }
      }
    })()

    return (): void => {
      cancelled = true
      ac.abort()
    }
  }, [durationSec, mediaKey, mediaUrl])

  /** Отрисовка и resize под Retina/container. */
  useEffect(() => {
    if (peaks === null || peaks.length === 0) {
      return
    }

    function paint(): void {
      const wrap = wrapRef.current
      const cv = canvasRef.current
      const pks = peaks
      if (!wrap || !cv || pks === null || pks.length === 0) {
        return
      }
      const w = wrap.clientWidth
      const cssH = laneCountSafe <= 1 ? 36 : laneCountSafe * 18
      const laneH = cssH / laneCountSafe
      const lanePad = laneH * 0.06
      if (w <= 0 || !Number.isFinite(windowLenSec) || windowLenSec <= 0) {
        return
      }
      const dpr = window.devicePixelRatio > 1 ? window.devicePixelRatio : 1
      cv.style.width = '100%'
      cv.style.height = `${cssH}px`
      cv.width = Math.max(64, Math.floor(w * dpr))
      cv.height = Math.floor(cssH * dpr)

      const g = cv.getContext('2d')
      if (!g) {
        return
      }

      const styles = window.getComputedStyle(wrap)
      const accent = styles.getPropertyValue('--fa-accent').trim() || '#38bdf8'
      const muted = styles.getPropertyValue('--fa-border-subtle').trim() || '#374151'

      g.clearRect(0, 0, cv.width, cv.height)
      const lanes = laneCountSafe
      g.fillStyle = muted
      for (let lane = 0; lane < lanes; lane++) {
        const y0 = (cv.height / lanes) * lane
        const y1 = y0 + cv.height / lanes
        const innerY0 = y0 + lanePad * dpr
        const innerY1 = y1 - lanePad * dpr
        g.globalAlpha = 0.28 - lane * 0.03
        g.fillRect(0, innerY0, cv.width, Math.max(1, innerY1 - innerY0))

        // Тонкие разделители дорожек (визуально как V1/V2/V3/A1/A2).
        g.globalAlpha = 0.18 - lane * 0.01
        g.strokeStyle = muted
        g.lineWidth = Math.max(1, 1 * dpr)
        g.beginPath()
        g.moveTo(0, y1)
        g.lineTo(cv.width, y1)
        g.stroke()
      }
      g.globalAlpha = 1
      g.fillStyle = accent

      const buckets = pks.length
      const absStartSec = durationSec <= 0 ? 0 : (windowStartSec / durationSec) * buckets
      const absEndSec =
        durationSec <= 0
          ? buckets
          : Math.min(buckets, ((windowStartSec + windowLenSec) / durationSec) * buckets)
      const bi0 = Math.max(0, Math.floor(absStartSec))
      const bi1 = Math.min(buckets, Math.ceil(absEndSec))
      const span = Math.max(1, bi1 - bi0)

      const barPx = cv.width / Math.max(1, Math.floor(span))
      for (let x = 0; x < cv.width; x++) {
        const t = bi0 + (x / Math.max(cv.width - 1, 1)) * span
        const idx = Math.min(buckets - 1, Math.max(0, Math.floor(t)))
        const h = pks[idx] ?? 0

        for (let lane = 0; lane < lanes; lane++) {
          const y0 = (cv.height / lanes) * lane
          const y1 = y0 + cv.height / lanes
          const laneInnerH = Math.max(1, y1 - y0 - lanePad * 2 * dpr)
          const laneAmpScale = Math.max(0.26, 1 - lane * 0.12)
          const barH = h * laneAmpScale * laneInnerH
          const yCenter = y0 + (y1 - y0) / 2

          g.globalAlpha = 0.62 - lane * 0.07
          g.fillStyle = accent
          g.fillRect(x + 0.15, yCenter - barH / 2, Math.max(barPx, 1.1), Math.max(barH, 1.2))
        }
      }
    }

    const ro = new ResizeObserver(() => {
      paint()
    })

    paint()
    const wrap0 = wrapRef.current
    if (wrap0) {
      ro.observe(wrap0)
    }

    window.addEventListener('resize', paint)

    return (): void => {
      ro.disconnect()
      window.removeEventListener('resize', paint)
    }
  }, [peaks, durationSec, windowLenSec, windowStartSec, laneCountSafe])

  if (durationSec > WAVEFORM_MAX_DURATION_SEC) {
    return (
      <div className="app-timeline-waveform" aria-label={uiText('timelineWaveformAriaUnavailable')}>
        <p className="app-timeline-waveform-hint">
          {uiTextVars('timelineWaveformUnavailableLongTemplate', {
            max: WAVEFORM_MAX_DURATION_SEC
          })}
        </p>
      </div>
    )
  }

  if (durationSec <= 0) {
    return <div className="app-timeline-waveform app-timeline-waveform-empty" aria-hidden />
  }

  const waveformDecodeBusy = peaks === null && hint === null

  return (
    <div
      className={`app-timeline-waveform app-timeline-waveform--lanes-${laneCountSafe}`}
      ref={wrapRef}
      aria-label={uiText('timelineWaveformAriaEnvelope')}
      aria-busy={waveformDecodeBusy}
    >
      {peaks !== null && peaks.length > 0 ? (
        <canvas ref={canvasRef} className="app-timeline-waveform-canvas" />
      ) : null}
      {peaks === null ? (
        <div className="app-timeline-waveform-hint">
          {hint ?? uiText('timelineWaveformLoading')}
        </div>
      ) : null}
      {peaks !== null && peaks.length > 0 && hint ? (
        <div className="app-timeline-waveform-subhint">{hint}</div>
      ) : null}
    </div>
  )
}
