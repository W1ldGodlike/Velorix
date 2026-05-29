import type { JSX } from 'react'

import {
  A1_CLIPS,
  A2_CLIPS,
  PROCESSING_PREVIEW_BADGE,
  PROCESSING_PREVIEW_SAVED_LABEL,
  PROCESSING_PREVIEW_ZOOM_PERCENT,
  PROCESSING_PREVIEW_VOLUME_PERCENT,
  PROCESSING_TIMECODE,
  PROCESSING_TIMELINE_ZOOM_PERCENT,
  TIMELINE_RULER_MARKS,
  V1_CLIPS,
  V2_CLIPS,
  V3_CLIPS
} from './processing-ref1-data'
import { TrackRow } from './processing-ref1-parts'

/** ref.1 center — preview + timeline (mock; not sign-off). */
export function ProcessingEditorCenterBody(): JSX.Element {
  return (
    <>
      <div className="processing-preview" aria-label="Превью">
        <div className="processing-preview__scene" aria-hidden>
          <span className="processing-preview__horizon" />
          <span className="processing-preview__ground-mist" />
          <div className="processing-preview__skyline">
            <span className="processing-preview__tower processing-preview__tower--a" />
            <span className="processing-preview__tower processing-preview__tower--b" />
            <span className="processing-preview__tower processing-preview__tower--c" />
            <span className="processing-preview__tower processing-preview__tower--d" />
          </div>
          <span className="processing-preview__neon-sign processing-preview__neon-sign--left" />
          <span className="processing-preview__neon-sign processing-preview__neon-sign--right" />
          <span className="processing-preview__car" />
          <span className="processing-preview__watermark">VELORIX</span>
          <span className="processing-preview__vignette" />
          <span className="processing-preview__scanlines" />
        </div>
        <div className="processing-preview__chrome">
          <span className="processing-preview__saved">{PROCESSING_PREVIEW_SAVED_LABEL}</span>
          <span className="processing-preview__zoom">{PROCESSING_PREVIEW_ZOOM_PERCENT}%</span>
          <button type="button" className="processing-preview__fit" disabled>
            Вписать ▾
          </button>
          <span className="processing-preview__chrome-spacer" />
          <button type="button" className="processing-preview__chrome-btn" disabled aria-hidden>
            <span className="processing-chrome-glyph processing-chrome-glyph--search processing-glyph" />
          </button>
          <button type="button" className="processing-preview__chrome-btn" disabled aria-hidden>
            <span className="processing-chrome-glyph processing-chrome-glyph--fullscreen processing-glyph" />
          </button>
          <button type="button" className="processing-preview__chrome-btn" disabled aria-hidden>
            <span className="processing-chrome-glyph processing-chrome-glyph--close processing-glyph" />
          </button>
        </div>
        <span className="processing-preview__badge">{PROCESSING_PREVIEW_BADGE}</span>
        <div className="processing-preview__transport">
          <button type="button" className="processing-preview__tc-box" disabled>
            {PROCESSING_TIMECODE}
            <span className="processing-preview__tc-chevron" aria-hidden>
              ▾
            </span>
          </button>
          <span className="processing-preview__transport-sep" aria-hidden />
          <div className="processing-preview__transport-playback">
            <button
              type="button"
              className="vn-btn vn-btn--secondary vn-btn--icon"
              disabled
              aria-hidden
            >
              <span className="processing-media-glyph processing-media-glyph--skip-start processing-glyph" />
            </button>
            <button
              type="button"
              className="vn-btn vn-btn--secondary vn-btn--icon"
              disabled
              aria-hidden
            >
              <span className="processing-media-glyph processing-media-glyph--rewind processing-glyph" />
            </button>
            <button
              type="button"
              className="vn-btn vn-btn--primary vn-btn--icon vn-btn--play"
              aria-label="Пауза"
            >
              <span className="processing-media-glyph processing-media-glyph--pause processing-glyph" />
            </button>
            <button
              type="button"
              className="vn-btn vn-btn--secondary vn-btn--icon"
              disabled
              aria-hidden
            >
              <span className="processing-media-glyph processing-media-glyph--forward processing-glyph" />
            </button>
            <button
              type="button"
              className="vn-btn vn-btn--secondary vn-btn--icon"
              disabled
              aria-hidden
            >
              <span className="processing-media-glyph processing-media-glyph--skip-end processing-glyph" />
            </button>
          </div>
          <span className="processing-preview__transport-sep" aria-hidden />
          <span className="processing-preview__transport-tools">
            <button
              type="button"
              className="processing-preview__transport-tool"
              disabled
              title="Кадр"
            >
              <span className="processing-transport-glyph processing-transport-glyph--camera processing-glyph" />
            </button>
            <button
              type="button"
              className="processing-preview__transport-tool"
              disabled
              title="Повтор"
            >
              <span className="processing-transport-glyph processing-transport-glyph--loop processing-glyph" />
            </button>
            <button
              type="button"
              className="processing-preview__transport-tool"
              disabled
              title="PiP"
            >
              <span className="processing-transport-glyph processing-transport-glyph--pip processing-glyph" />
            </button>
          </span>
          <label className="processing-preview__volume">
            <span className="processing-volume-glyph processing-glyph" aria-hidden />
            <span className="sr-only">Громкость</span>
            <input
              type="range"
              min={0}
              max={100}
              defaultValue={PROCESSING_PREVIEW_VOLUME_PERCENT}
              disabled
            />
            <span className="processing-preview__volume-val" aria-hidden>
              {PROCESSING_PREVIEW_VOLUME_PERCENT}%
            </span>
          </label>
        </div>
      </div>
      <div className="processing-timeline" aria-label="Таймлайн">
        <div className="processing-timeline__top">
          <div className="processing-timeline__toolbar">
            <button
              type="button"
              className="vn-btn vn-btn--secondary vn-btn--icon"
              disabled
              title="Выделение"
            >
              <span className="processing-tool-glyph processing-tool-glyph--select processing-glyph" />
            </button>
            <button
              type="button"
              className="vn-btn vn-btn--secondary vn-btn--icon processing-timeline__tool--active"
              disabled
              title="Blade"
            >
              <span className="processing-tool-glyph processing-tool-glyph--blade processing-glyph" />
            </button>
            <button
              type="button"
              className="vn-btn vn-btn--secondary vn-btn--icon"
              disabled
              title="Удалить"
            >
              <span className="processing-tool-glyph processing-tool-glyph--delete processing-glyph" />
            </button>
            <button
              type="button"
              className="vn-btn vn-btn--secondary vn-btn--icon"
              disabled
              title="Связать"
            >
              <span className="processing-tool-glyph processing-tool-glyph--link processing-glyph" />
            </button>
            <button
              type="button"
              className="vn-btn vn-btn--secondary vn-btn--icon"
              disabled
              title="Группа"
            >
              <span className="processing-tool-glyph processing-tool-glyph--group processing-glyph" />
            </button>
            <button
              type="button"
              className="vn-btn vn-btn--secondary vn-btn--icon"
              disabled
              title="Привязка"
            >
              <span className="processing-tool-glyph processing-tool-glyph--snap processing-glyph" />
            </button>
            <button
              type="button"
              className="vn-btn vn-btn--secondary vn-btn--icon"
              disabled
              title="Перо"
            >
              <span className="processing-tool-glyph processing-tool-glyph--pen processing-glyph" />
            </button>
            <button
              type="button"
              className="vn-btn vn-btn--secondary vn-btn--icon"
              disabled
              title="Слои"
            >
              <span className="processing-tool-glyph processing-tool-glyph--layers processing-glyph" />
            </button>
            <span className="processing-timeline__snap-pill processing-timeline__snap-pill--on">
              SNAP
            </span>
          </div>
          <label className="processing-timeline__zoom">
            <span className="sr-only">Масштаб таймлайна</span>
            <span className="processing-timeline__zoom-btn" aria-hidden>
              −
            </span>
            <input
              type="range"
              min={0}
              max={100}
              defaultValue={PROCESSING_TIMELINE_ZOOM_PERCENT}
              disabled
            />
            <span className="processing-timeline__zoom-val" aria-hidden>
              {PROCESSING_TIMELINE_ZOOM_PERCENT}%
            </span>
            <span className="processing-timeline__zoom-btn" aria-hidden>
              +
            </span>
          </label>
        </div>
        <div className="processing-timeline__body">
          <div className="processing-timeline__tracks">
            <div className="processing-timeline__playhead" aria-hidden>
              <span className="processing-timeline__playhead-bubble">{PROCESSING_TIMECODE}</span>
            </div>
            <div className="processing-timeline__ruler" aria-hidden>
              <div className="processing-timeline__ruler-ticks">
                <span className="processing-timeline__ruler-ticks-major" aria-hidden />
              </div>
              <div className="processing-timeline__ruler-labels">
                {TIMELINE_RULER_MARKS.map((mark) => (
                  <span key={mark}>{mark}</span>
                ))}
              </div>
            </div>
            <TrackRow id="V3" clips={V3_CLIPS} />
            <TrackRow id="V2" clips={V2_CLIPS} />
            <TrackRow id="V1" clips={V1_CLIPS} active showLinkMarkers />
            <TrackRow id="A1" clips={A1_CLIPS} audio trackHint="Высокая громк." />
            <TrackRow id="A2" clips={A2_CLIPS} audio showEnvelope />
          </div>
        </div>
      </div>
    </>
  )
}
