import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_TOOLS_REL } from '../../../../shared/velorix-neon-theme-tokens'

import { useAppShellStore } from '../../stores/app-shell-store'
import type { UtilityToolId } from './utility-tool-id'

const TOOLS: Array<{ id: Exclude<UtilityToolId, 'hub'>; title: string; ref: string }> = [
  { id: 'maint', title: 'Обслуживание файлов', ref: '12' },
  { id: 'img', title: 'Конвертация изображений', ref: '13' },
  { id: 'noise', title: 'Генератор шума/тишины', ref: '14' },
  { id: 'slide', title: 'Слайдшоу', ref: '15' },
  { id: 'scenario', title: 'Конструктор сценариев', ref: '16' },
  { id: 'script', title: 'Внешний script-filter', ref: '17' },
  { id: 'bench', title: 'Бенчмарк кодеров', ref: '24' },
  { id: 'plugins', title: 'Плагины', ref: '25' }
]

export function ToolsHubScreen(): JSX.Element {
  const setToolsView = useAppShellStore((s) => s.setToolsView)
  const openModal = useAppShellStore((s) => s.openModal)
  function openTool(id: (typeof TOOLS)[number]['id']): void {
    if (id === 'bench') {
      openModal('encoder-benchmark')
      return
    }
    if (id === 'plugins') {
      openModal('plugins')
      return
    }
    setToolsView(id)
  }

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
            <button
              type="button"
              className="app-btn app-btn-secondary"
              onClick={() => openTool(tool.id)}
            >
              Открыть
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
