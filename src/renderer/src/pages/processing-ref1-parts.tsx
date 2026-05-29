import type { JSX } from 'react'

import { CLIP_WAVEFORM_BAR_COUNT, type ProcessingClipMock } from './processing-ref1-data'

const WAVEFORM_BAR_INDICES = Array.from({ length: CLIP_WAVEFORM_BAR_COUNT }, (_, i) => i)

export function ProcessingClip(props: { clip: ProcessingClipMock; audio?: boolean }): JSX.Element {
  const { clip, audio = false } = props
  const classNames = [
    'processing-clip',
    audio ? 'processing-clip--audio' : '',
    clip.thumb ? 'processing-clip--thumb' : '',
    clip.waveform ? 'processing-clip--wave' : '',
    `processing-clip--grow-${clip.grow}`
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classNames}>
      {!audio && clip.thumb ? <span className="processing-clip__film" aria-hidden /> : null}
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
            <span key={badge} className="processing-clip__badge">
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
  trackHint?: string
}): JSX.Element {
  const { id, clips, audio = false, active = false, showEnvelope = false, trackHint } = props
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
            className="processing-track-icon processing-track-icon--visible processing-glyph"
            title="Visibility"
          />
          <span
            className="processing-track-icon processing-track-icon--solo processing-glyph"
            title="Solo"
          />
        </span>
      </div>
      <div
        className={`processing-timeline__lane${audio ? ' processing-timeline__lane--audio' : ''}${showEnvelope ? ' processing-timeline__lane--envelope' : ''}`}
      >
        {clips.map((clip) => (
          <ProcessingClip key={clip.name} clip={clip} audio={audio} />
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
