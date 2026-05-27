import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_SCENARIOS_REL } from '../../../../shared/velorix-neon-theme-tokens'

const WORKFLOWS = [
  { name: 'Ночной экспорт', runs: 12, status: 'ready' as const },
  { name: 'Загрузка плейлиста', runs: 3, status: 'processing' as const },
  { name: 'Пакетный remux', runs: 0, status: 'info' as const }
] as const

export function ScenariosScreen(): JSX.Element {
  return (
    <div className="portal-screen scenarios-screen">
      <header className="portal-screen__head">
        <div>
          <h1 className="portal-screen__title">Сценарии</h1>
          <p className="portal-screen__subtitle">Эталон: {VELORIX_NEON_REFERENCE_SCENARIOS_REL}</p>
        </div>
        <button type="button" className="app-btn app-btn-primary">
          Новый сценарий
        </button>
      </header>
      <div className="scenarios-screen__grid">
        {WORKFLOWS.map((flow) => (
          <article key={flow.name} className="portal-card vn-surface-glass">
            <h2>{flow.name}</h2>
            <span
              className={`app-ui-showcase-status-pill app-ui-showcase-status-pill--${flow.status}`}
            >
              {flow.runs} запусков
            </span>
            <button type="button" className="app-btn app-btn-secondary">
              Запустить
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}

export function ScenariosRail(): JSX.Element {
  return (
    <aside className="portal-rail vn-surface-glass">
      <h2 className="portal-rail__title">Последние запуски</h2>
      <ul className="scenarios-rail__runs">
        <li>
          <span>Ночной экспорт</span>
          <small>успех · 02:14</small>
        </li>
        <li>
          <span>Загрузка плейлиста</span>
          <small>идёт · 45%</small>
        </li>
      </ul>
    </aside>
  )
}
