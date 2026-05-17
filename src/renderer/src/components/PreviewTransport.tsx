import { useEffect, useState, type RefObject } from 'react'

import { miniIconTitle, uiText, uiTextVars } from '../locales/ui-text'
import {
  IconChevronLeft,
  IconChevronRight,
  IconMaximize2,
  IconPauseUi,
  IconPlay,
  IconSkipBack,
  IconSkipForward,
  IconVolume2,
  IconVolumeX
} from './LucideMiniIcons'

/** Шаг «шеврона» v0-транспорта: не копируем пиксель-в-пиксель, но сохраняем ощущение NLE-компона. */
const STEP_SEC = 5

interface PreviewTransportProps {
  mediaKey: string
  videoRef: RefObject<HTMLVideoElement | null>
  /** Контейнер превью (stack) для toggle fullscreen — синхронно с референсом `maximize-2`. */
  fullscreenRootRef: RefObject<HTMLElement | null>
  disabled?: boolean
}

export default function PreviewTransport({
  mediaKey,
  videoRef,
  fullscreenRootRef,
  disabled = false
}: PreviewTransportProps): React.JSX.Element {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volumeUi, setVolumeUi] = useState(1)

  useEffect(() => {
    const v = videoRef.current
    if (!v) {
      return
    }
    function onPlay(): void {
      setPlaying(true)
    }
    function onPause(): void {
      setPlaying(false)
    }
    function onVolume(): void {
      const el = videoRef.current
      if (!el) {
        return
      }
      setMuted(el.muted)
      setVolumeUi(el.volume)
    }
    setPlaying(!v.paused)
    setMuted(v.muted)
    setVolumeUi(v.volume)
    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    v.addEventListener('volumechange', onVolume)
    return (): void => {
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
      v.removeEventListener('volumechange', onVolume)
    }
  }, [mediaKey, videoRef])

  function seek(deltaSec: number): void {
    const v = videoRef.current
    if (!v || disabled) {
      return
    }
    const d = v.duration
    if (!Number.isFinite(d) || d <= 0) {
      return
    }
    v.currentTime = Math.min(Math.max(0, v.currentTime + deltaSec), Math.max(0, d - 0.02))
  }

  function seekToFraction(fraction: number): void {
    const v = videoRef.current
    if (!v || disabled) {
      return
    }
    const d = v.duration
    if (!Number.isFinite(d) || d <= 0) {
      return
    }
    const r = Math.min(1, Math.max(0, fraction))
    v.currentTime = Math.min(Math.max(0, d * r), Math.max(0, d - 0.02))
  }

  async function toggleFullscreen(): Promise<void> {
    const root = fullscreenRootRef.current
    if (!root || disabled) {
      return
    }
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await root.requestFullscreen()
      }
    } catch {
      // Electron/WebView может запретить без жеста — не блокируем UI ошибкой.
    }
  }

  function togglePlayPause(): void {
    const v = videoRef.current
    if (!v || disabled) {
      return
    }
    if (v.paused) {
      void v.play().catch(() => {})
    } else {
      v.pause()
    }
  }

  function toggleMute(): void {
    const v = videoRef.current
    if (!v || disabled) {
      return
    }
    v.muted = !v.muted
    setMuted(v.muted)
  }

  return (
    <>
      <p id="editor-preview-transport-hint" className="app-visually-hidden">
        {uiText('previewTransportHint')}
      </p>
      <div
        className="app-preview-transport"
        role="toolbar"
        aria-orientation="horizontal"
        aria-label={uiText('previewTransportToolbarAria')}
        aria-describedby="editor-preview-transport-hint"
        aria-busy={disabled}
      >
      <div
        className="app-preview-transport-cluster"
        role="group"
        aria-label={uiText('previewTransportPlaybackClusterAria')}
        aria-describedby="editor-preview-transport-hint"
        aria-busy={disabled}
      >
        <button
          type="button"
          className="app-icon-btn"
          aria-describedby="editor-preview-transport-hint"
          disabled={disabled}
          onClick={() => {
            seekToFraction(0)
          }}
          title={miniIconTitle('miniIconSkipBack')}
        >
          <IconSkipBack />
          <span className="app-visually-hidden">{miniIconTitle('miniIconSkipBack')}</span>
        </button>
        <button
          type="button"
          className="app-icon-btn"
          aria-describedby="editor-preview-transport-hint"
          disabled={disabled}
          onClick={() => {
            seek(-STEP_SEC)
          }}
          title={uiTextVars('previewTransportMinusSecTitle', { sec: STEP_SEC })}
        >
          <IconChevronLeft />
          <span className="app-visually-hidden">{miniIconTitle('miniIconChevronLeft')}</span>
        </button>
        <button
          type="button"
          className="app-icon-btn app-icon-btn-primary"
          aria-describedby="editor-preview-transport-hint"
          disabled={disabled}
          onClick={togglePlayPause}
          title={playing ? miniIconTitle('miniIconPauseUi') : miniIconTitle('miniIconPlay')}
        >
          {playing ? <IconPauseUi title="" /> : <IconPlay title="" />}
          <span className="app-visually-hidden">
            {playing ? miniIconTitle('miniIconPauseUi') : miniIconTitle('miniIconPlay')}
          </span>
        </button>
        <button
          type="button"
          className="app-icon-btn"
          aria-describedby="editor-preview-transport-hint"
          disabled={disabled}
          onClick={() => {
            seek(STEP_SEC)
          }}
          title={uiTextVars('previewTransportPlusSecTitle', { sec: STEP_SEC })}
        >
          <IconChevronRight />
          <span className="app-visually-hidden">{miniIconTitle('miniIconChevronRight')}</span>
        </button>
        <button
          type="button"
          className="app-icon-btn"
          aria-describedby="editor-preview-transport-hint"
          disabled={disabled}
          onClick={() => {
            seekToFraction(1)
          }}
          title={miniIconTitle('miniIconSkipForward')}
        >
          <IconSkipForward />
          <span className="app-visually-hidden">{miniIconTitle('miniIconSkipForward')}</span>
        </button>
      </div>
      <div
        className="app-preview-transport-end"
        role="group"
        aria-label={uiText('previewTransportVolumeClusterAria')}
        aria-describedby="editor-preview-transport-hint"
        aria-busy={disabled}
      >
        <button
          type="button"
          className="app-icon-btn"
          aria-describedby="editor-preview-transport-hint"
          disabled={disabled}
          onClick={toggleMute}
          title={muted ? uiText('previewTransportUnmuteTitle') : miniIconTitle('miniIconVolumeX')}
        >
          {muted ? <IconVolumeX title="" /> : <IconVolume2 title="" />}
          <span className="app-visually-hidden">
            {muted ? uiText('previewTransportUnmuteTitle') : miniIconTitle('miniIconVolumeX')}
          </span>
        </button>
        <label className="app-preview-transport-volume">
          <span className="app-visually-hidden">{miniIconTitle('miniIconVolume2')}</span>
          <input
            className="app-preview-transport-volume-range"
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={volumeUi}
            disabled={disabled}
            aria-describedby="editor-preview-transport-hint"
            aria-valuetext={`${Math.round(volumeUi * 100)}%`}
            onChange={(e) => {
              const v = videoRef.current
              if (!v || disabled) {
                return
              }
              const vol = Number(e.target.value)
              setVolumeUi(vol)
              v.volume = vol
              if (vol > 0 && v.muted) {
                v.muted = false
                setMuted(false)
              }
            }}
          />
        </label>
        <button
          type="button"
          className="app-icon-btn"
          aria-describedby="editor-preview-transport-hint"
          disabled={disabled}
          onClick={() => {
            void toggleFullscreen()
          }}
          title={miniIconTitle('miniIconMaximize2')}
        >
          <IconMaximize2 />
          <span className="app-visually-hidden">{miniIconTitle('miniIconMaximize2')}</span>
        </button>
      </div>
    </div>
    </>
  )
}
