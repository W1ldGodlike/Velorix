import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_TOOLS_REL } from '../../../../shared/velorix-neon-theme-tokens'

const TOOLS = [
  { id: 'maint', title: 'Обслуживание файлов', ref: '12' },
  { id: 'img', title: 'Конвертация изображений', ref: '13' },
  { id: 'noise', title: 'Генератор шума/тишины', ref: '14' },
  { id: 'slide', title: 'Слайдшоу', ref: '15' },
  { id: 'bench', title: 'Бенчмарк кодеров', ref: '24' },
  { id: 'plugins', title: 'Плагины', ref: '25' }
] as const

export function ToolsHubScreen(): JSX.Element {
  return (
    <div className="portal-screen tools-screen">
      <header className="portal-screen__head">
        <h1 className="portal-screen__title">Инструменты</h1>
        <p className="portal-screen__subtitle">Эталон: {VELORIX_NEON_REFERENCE_TOOLS_REL}</p>
      </header>
      <div className="tools-screen__grid">
        {TOOLS.map((tool, index) => (
          <article
            key={tool.id}
            className={`portal-card vn-surface-glass tools-card${index === 0 ? ' portal-card--active' : ''}`}
          >
            <span className="app-ui-showcase-badge">ref.{tool.ref}</span>
            <h2>{tool.title}</h2>
            <button type="button" className="app-btn app-btn-secondary">
              Открыть
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}

export function ToolsRail(): JSX.Element {
  return (
    <aside className="portal-rail vn-surface-glass">
      <h2 className="portal-rail__title">Недавние</h2>
      <ul className="tools-rail__recent">
        <li>Обслуживание файлов</li>
        <li>Бенчмарк кодеров</li>
      </ul>
      <div className="tools-rail__showcase">
        <a href="#ref27" className="app-btn app-btn-secondary">
          ref.27 kit
        </a>
        <a href="#ref26" className="app-btn">
          ref.26 states
        </a>
      </div>
    </aside>
  )
}
