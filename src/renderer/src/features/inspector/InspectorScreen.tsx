import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_INSPECTOR_REL } from '../../../../shared/velorix-neon-theme-tokens'

const TRACKS = [
  { id: 0, kind: 'Video', codec: 'h264', res: '3840×2160', fps: '23.98' },
  { id: 1, kind: 'Audio', codec: 'aac', res: '—', fps: '48 kHz' },
  { id: 2, kind: 'Audio', codec: 'aac', res: '—', fps: '48 kHz' }
] as const

export function InspectorScreen(): JSX.Element {
  return (
    <div className="portal-screen inspector-screen">
      <header className="portal-screen__head">
        <h1 className="portal-screen__title">Инспектор медиа</h1>
        <p className="portal-screen__subtitle">Эталон: {VELORIX_NEON_REFERENCE_INSPECTOR_REL}</p>
        <button type="button" className="app-btn app-btn-primary">
          Открыть файл
        </button>
      </header>
      <div className="inspector-screen__layout">
        <section className="inspector-screen__overview vn-surface-glass">
          <h2>clip_001.mp4</h2>
          <dl className="inspector-screen__meta">
            <div>
              <dt>Длительность</dt>
              <dd>00:12:34.080</dd>
            </div>
            <div>
              <dt>Размер</dt>
              <dd>4.97 GB</dd>
            </div>
            <div>
              <dt>Контейнер</dt>
              <dd>MP4 · mov,mp4,m4a,3gp,3g2,mj2</dd>
            </div>
          </dl>
        </section>
        <section className="inspector-screen__tracks vn-surface-glass">
          <h2>Дорожки</h2>
          <table className="app-ui-showcase-table inspector-screen__table">
            <thead>
              <tr>
                <th scope="col">Тип</th>
                <th scope="col">Кодек</th>
                <th scope="col">Параметры</th>
              </tr>
            </thead>
            <tbody>
              {TRACKS.map((track) => (
                <tr key={track.id}>
                  <td>{track.kind}</td>
                  <td>{track.codec}</td>
                  <td>
                    {track.res} {track.fps}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}

export function InspectorRail(): JSX.Element {
  return (
    <aside className="portal-rail vn-surface-glass inspector-rail">
      <h2 className="portal-rail__title">Главы</h2>
      <ul className="inspector-rail__chapters">
        <li>
          <button type="button" className="inspector-rail__chapter inspector-rail__chapter--active">
            00:00 Intro
          </button>
        </li>
        <li>
          <button type="button" className="inspector-rail__chapter">
            02:14 Gameplay
          </button>
        </li>
      </ul>
      <h2 className="portal-rail__title">Экспорт summary</h2>
      <p className="portal-rail__hint">Пресет H.264 · CRF 23 · AAC 192k</p>
    </aside>
  )
}
