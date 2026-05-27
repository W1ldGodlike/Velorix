import type { JSX } from 'react'

import { VELORIX_NEON_CANONICAL_REFERENCE_REL } from '../../../../shared/velorix-neon-theme-tokens'

const LANES = ['V1', 'V2', 'V3', 'A1', 'A2'] as const

export function ProcessingScreen(): JSX.Element {
  return (
    <div className="processing-screen">
      <header className="processing-screen__head">
        <div>
          <h1 className="processing-screen__title">Обработка</h1>
          <p className="processing-screen__subtitle">
            Эталон: {VELORIX_NEON_CANONICAL_REFERENCE_REL}
          </p>
        </div>
        <div className="processing-screen__head-actions">
          <button type="button" className="app-btn">
            Открыть медиа
          </button>
          <button type="button" className="app-btn app-btn-primary">
            Экспорт
          </button>
        </div>
      </header>
      <div className="processing-screen__preview vn-surface-glass">
        <span className="processing-screen__preview-hint">Превью · ref.1</span>
      </div>
      <div className="processing-screen__transport">
        <button
          type="button"
          className="app-ui-showcase-icon-btn app-ui-showcase-icon-btn--primary"
          aria-label="Пауза"
        >
          ❚❚
        </button>
        <span className="app-ui-showcase-status-pill app-ui-showcase-status-pill--info">
          00:00:00
        </span>
        <input
          type="range"
          className="app-ui-showcase-range vn-progress-neon processing-screen__seek"
          defaultValue={0}
          min={0}
          max={100}
          aria-label="Позиция"
        />
      </div>
      <div className="processing-screen__timeline vn-surface-glass" aria-label="Таймлайн">
        {LANES.map((lane) => (
          <div key={lane} className="processing-screen__lane">
            <span className="processing-screen__lane-label">{lane}</span>
            <div className="processing-screen__lane-track" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProcessingRail(): JSX.Element {
  return (
    <aside className="processing-rail vn-surface-glass">
      <h2 className="processing-rail__title">FFmpeg</h2>
      <label className="app-ui-showcase-field">
        <span className="app-ui-showcase-field-label">Формат</span>
        <select className="app-settings-select" defaultValue="mp4">
          <option value="mp4">MP4 · H.264</option>
          <option value="mkv">MKV · HEVC</option>
        </select>
      </label>
      <label className="app-ui-showcase-field">
        <span className="app-ui-showcase-field-label">CRF</span>
        <input type="number" className="app-input" defaultValue={23} min={0} max={51} />
      </label>
      <button type="button" className="app-btn app-btn-primary processing-rail__export">
        Начать экспорт
      </button>
    </aside>
  )
}
