import { useEffect, useState, type RefObject } from 'react'

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) {
    return '0:00'
  }
  const s = Math.floor(sec % 60)
  const m = Math.floor((sec / 60) % 60)
  const h = Math.floor(sec / 3600)
  const pad = (n: number): string => n.toString().padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

interface VideoTimelineProps {
  /** Совпадает с `key` у `<video>`, чтобы переподписаться при смене источника. */
  mediaKey: string
  videoRef: RefObject<HTMLVideoElement | null>
}

export default function VideoTimeline({
  mediaKey,
  videoRef
}: VideoTimelineProps): React.JSX.Element {
  const [duration, setDuration] = useState(0)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const el = videoRef.current
    if (!el) {
      return
    }
    const videoEl: HTMLVideoElement = el
    function syncDuration(): void {
      const d = videoEl.duration
      setDuration(Number.isFinite(d) ? d : 0)
    }
    function syncTime(): void {
      setCurrent(videoEl.currentTime)
    }
    syncDuration()
    syncTime()
    videoEl.addEventListener('loadedmetadata', syncDuration)
    videoEl.addEventListener('durationchange', syncDuration)
    videoEl.addEventListener('timeupdate', syncTime)
    videoEl.addEventListener('seeked', syncTime)
    return (): void => {
      videoEl.removeEventListener('loadedmetadata', syncDuration)
      videoEl.removeEventListener('durationchange', syncDuration)
      videoEl.removeEventListener('timeupdate', syncTime)
      videoEl.removeEventListener('seeked', syncTime)
    }
  }, [mediaKey, videoRef])

  const ratio = duration > 0 ? Math.min(1, Math.max(0, current / duration)) : 0

  function seek(fraction: number): void {
    const v = videoRef.current
    if (!v || !Number.isFinite(duration) || duration <= 0) {
      return
    }
    const next = Math.min(duration * fraction, Math.max(0, duration - 0.02))
    v.currentTime = next
  }

  return (
    <div className="app-timeline" aria-label="Позиция воспроизведения">
      <span className="app-timeline-time">{formatTime(current)}</span>
      <input
        className="app-timeline-range"
        type="range"
        min={0}
        max={1}
        step={0.0001}
        value={ratio}
        aria-valuetext={`${formatTime(current)} из ${formatTime(duration)}`}
        onChange={(e) => {
          seek(Number(e.target.value))
        }}
      />
      <span className="app-timeline-time">{formatTime(duration)}</span>
    </div>
  )
}
