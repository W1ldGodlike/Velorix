import { Fragment, type JSX } from 'react'

import {
  CLIP_WAVEFORM_BAR_COUNT,
  PROCESSING_RAIL_AUDIO_FIELDS,
  PROCESSING_RAIL_FORMAT_FIELDS,
  PROCESSING_RAIL_PRESET_ACTIVE,
  PROCESSING_RAIL_PRESETS,
  PROCESSING_RAIL_VIDEO_EXTRA,
  type ProcessingClipMock
} from './processing-ref1-data'

const WAVEFORM_BAR_INDICES = Array.from({ length: CLIP_WAVEFORM_BAR_COUNT }, (_, i) => i)

export function ProcessingClip(props: { clip: ProcessingClipMock; audio?: boolean }): JSX.Element {
  const { clip, audio = false } = props
  const classNames = [
    'processing-clip',
    audio ? 'processing-clip--audio' : '',
    clip.thumb ? 'processing-clip--thumb' : '',
    clip.thumbTone ? `processing-clip--tone-${clip.thumbTone}` : '',
    clip.waveform ? 'processing-clip--wave' : '',
    clip.highlight ? 'processing-clip--highlight' : '',
    `processing-clip--grow-${clip.grow}`
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classNames}>
      {!audio && clip.thumb ? (
        <>
          <span className="processing-clip__film" aria-hidden />
          <span className="processing-clip__thumb-shine" aria-hidden />
        </>
      ) : null}
      {clip.linked ? (
        <span className="processing-clip__link-mark processing-glyph" aria-hidden title="Связано" />
      ) : null}
      {clip.highlight ? (
        <span className="processing-clip__duration" aria-hidden>
          00:42
        </span>
      ) : null}
      {clip.waveform ? (
        <span className="processing-clip__wave-bars" aria-hidden>
          {WAVEFORM_BAR_INDICES.map((i) => (
            <span key={i} className="processing-clip__wave-bar" />
          ))}
        </span>
      ) : null}
      <span className="processing-clip__label">{clip.name}</span>
      {clip.badges?.length ? (
        <span className="processing-clip__badges">
          {clip.badges.map((badge) => (
            <span
              key={badge}
              className={
                badge === 'fx'
                  ? 'processing-clip__badge processing-clip__badge--fx'
                  : 'processing-clip__badge'
              }
            >
              {badge}
            </span>
          ))}
        </span>
      ) : null}
    </span>
  )
}

export function TrackRow(props: {
  id: string
  clips: readonly ProcessingClipMock[]
  audio?: boolean
  active?: boolean
  showEnvelope?: boolean
  showLinkMarkers?: boolean
  trackHint?: string
}): JSX.Element {
  const {
    id,
    clips,
    audio = false,
    active = false,
    showEnvelope = false,
    showLinkMarkers = false,
    trackHint
  } = props
  return (
    <div
      className={`processing-timeline__track${active ? ' processing-timeline__track--active' : ''}`}
    >
      <div className="processing-timeline__head">
        <span className="processing-timeline__label">{id}</span>
        <span className="processing-timeline__track-tools" aria-hidden>
          <span
            className="processing-track-icon processing-track-icon--lock processing-glyph"
            title="Lock"
          />
          <span
            className="processing-track-icon processing-track-icon--mute processing-glyph"
            title="Mute"
          />
          <span
            className="processing-track-icon processing-track-icon--visible processing-glyph"
            title="Visibility"
          />
        </span>
      </div>
      <div
        className={`processing-timeline__lane${clips.length === 0 ? ' processing-timeline__lane--empty' : ''}${audio ? ' processing-timeline__lane--audio' : ''}${showEnvelope ? ' processing-timeline__lane--envelope' : ''}`}
        {...(clips.length === 0 ? { 'aria-label': `Дорожка ${id} пуста` } : {})}
      >
        {clips.map((clip, index) => (
          <Fragment key={clip.name}>
            {showLinkMarkers && index > 0 ? (
              <span className="processing-clip-link" aria-hidden title="Стык клипов" />
            ) : null}
            <ProcessingClip clip={clip} audio={audio} />
          </Fragment>
        ))}
        {trackHint ? <span className="processing-timeline__track-hint">{trackHint}</span> : null}
        {showEnvelope ? (
          <>
            <span
              className="processing-timeline__keyframe processing-timeline__keyframe--a"
              aria-hidden
            />
            <span
              className="processing-timeline__keyframe processing-timeline__keyframe--b"
              aria-hidden
            />
            <span
              className="processing-timeline__keyframe processing-timeline__keyframe--c"
              aria-hidden
            />
          </>
        ) : null}
      </div>
    </div>
  )
}

export function RailField(props: { label: string; value: string }): JSX.Element {
  const { label, value } = props
  return (
    <div className="processing-rail__field">
      <span className="processing-rail__field-label">{label}</span>
      <span className="processing-rail__select" aria-disabled>
        {value}
        <span className="processing-rail__chevron" aria-hidden>
          ▾
        </span>
      </span>
    </div>
  )
}

/** FFmpeg export rail for ref.1 (mock). */
export function ProcessingFfmpegRail(): JSX.Element {
  return (
    <aside className="processing-rail" aria-label="FFmpeg">
      <div className="processing-rail__scroll">
        <header className="processing-rail__head processing-rail__head--png">
          <h2 className="processing-rail__title">НАСТРОЙКИ FFMPEG</h2>
          <button type="button" className="processing-rail__help" disabled title="Справка">
            ?
          </button>
        </header>
        <details className="processing-rail__section vn-surface-glass" open>
          <summary>ВИДЕО</summary>
          <div className="processing-rail__fields">
            <RailField label="Кодек" value="H.264 (libx264)" />
            <RailField label="Профиль" value="High" />
            <RailField label="Уровень" value="4.1" />
            <RailField label="Пресет" value="Slow" />
            <div className="processing-rail__field processing-rail__field--slider">
              <span className="processing-rail__field-label">CRF</span>
              <span className="processing-rail__slider-mock">
                <span className="processing-rail__slider-fill processing-rail__slider-fill--crf" />
                <em>18</em>
              </span>
            </div>
            <RailField label="Разрешение" value="3840×2160 (4K)" />
            <div className="processing-rail__field processing-rail__field--fps">
              <span className="processing-rail__field-label">Частота кадров</span>
              <span className="processing-rail__fps">
                <span className="processing-rail__select" aria-disabled>
                  60
                  <span className="processing-rail__chevron" aria-hidden>
                    ▾
                  </span>
                </span>
                <span className="processing-rail__fps-unit">fps</span>
              </span>
            </div>
            <label className="processing-rail__toggle">
              <span>Двухпроходное кодирование</span>
              <span className="processing-rail__toggle-value">
                <em>ON</em>
                <span className="processing-rail__switch processing-rail__switch--on" aria-hidden />
              </span>
            </label>
            <RailField label="Аппаратное ускорение" value="NVIDIA NVENC" />
            {PROCESSING_RAIL_VIDEO_EXTRA.map((field) => (
              <RailField key={field.label} label={field.label} value={field.value} />
            ))}
          </div>
        </details>
        <details className="processing-rail__section vn-surface-glass">
          <summary>АУДИО</summary>
          <div className="processing-rail__fields">
            {PROCESSING_RAIL_AUDIO_FIELDS.map((field) => (
              <RailField key={field.label} label={field.label} value={field.value} />
            ))}
          </div>
        </details>
        <details className="processing-rail__section vn-surface-glass">
          <summary>ФОРМАТ</summary>
          <div className="processing-rail__fields">
            {PROCESSING_RAIL_FORMAT_FIELDS.map((field) => (
              <RailField key={field.label} label={field.label} value={field.value} />
            ))}
          </div>
        </details>
        <details className="processing-rail__section vn-surface-glass">
          <summary>ПРЕСЕТЫ</summary>
          <ul className="processing-rail__preset-list">
            {PROCESSING_RAIL_PRESETS.map((preset) => (
              <li
                key={preset.name}
                className={
                  preset.active
                    ? 'processing-rail__preset-row processing-rail__preset-row--active'
                    : 'processing-rail__preset-row'
                }
              >
                {preset.name}
              </li>
            ))}
          </ul>
        </details>
        <details className="processing-rail__section vn-surface-glass">
          <summary>СЦЕНАРИИ</summary>
        </details>
        <details className="processing-rail__section vn-surface-glass">
          <summary>ФИЛЬТРЫ</summary>
        </details>
        <details className="processing-rail__section vn-surface-glass">
          <summary>МЕТАДАННЫЕ</summary>
        </details>
      </div>
      <div className="processing-rail__export">
        <button
          type="button"
          className="vn-btn vn-btn--primary processing-rail__export-btn"
          disabled
        >
          <span className="processing-rail__export-icon processing-glyph" aria-hidden />
          НАЧАТЬ ЭКСПОРТ
        </button>
        <div className="processing-rail__preset-card vn-surface-glass">
          <div className="processing-rail__preset-head">
            <strong>{PROCESSING_RAIL_PRESET_ACTIVE}</strong>
            <span className="processing-rail__preset-gear processing-glyph" aria-hidden />
          </div>
          <p className="processing-rail__preset-meta">H.264 / AAC / 3840×2160 / 60fps</p>
        </div>
      </div>
    </aside>
  )
}
