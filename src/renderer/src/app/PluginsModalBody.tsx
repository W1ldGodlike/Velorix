import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_PLUGINS_REL } from '../../../shared/velorix-neon-theme-tokens'

import { useAppShellStore } from '../stores/app-shell-store'

const PLUGIN_ROWS = [
  { id: 'velorix-ytdlp-hooks', enabled: true, note: 'Хуки очереди yt-dlp' },
  { id: 'neon-export-presets', enabled: false, note: 'Доп. пресеты экспорта (bootstrap)' }
] as const

/** ref.25 — список плагинов (bootstrap; управление — отдельный срез). */
export function PluginsModalBody(): JSX.Element {
  const setToolsView = useAppShellStore((s) => s.setToolsView)
  const setWorkspaceTab = useAppShellStore((s) => s.setWorkspaceTab)
  const closeModal = useAppShellStore((s) => s.closeModal)

  return (
    <div className="app-modal__body app-modal__body--stack">
      <ul className="app-modal__plugins vn-surface-glass">
        {PLUGIN_ROWS.map((row) => (
          <li key={row.id} className="app-modal__plugin-row">
            <strong>{row.id}</strong>
            <span
              className={`app-ui-showcase-status-pill${row.enabled ? ' app-ui-showcase-status-pill--ready' : ''}`}
            >
              {row.enabled ? 'Включён' : 'Выкл'}
            </span>
            <span className="app-modal__hint">{row.note}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="app-btn app-btn-secondary"
        onClick={() => {
          setToolsView('plugins')
          setWorkspaceTab('tools')
          closeModal()
        }}
      >
        Полноэкранный hub…
      </button>
      <p className="app-modal__hint">Эталон: {VELORIX_NEON_REFERENCE_PLUGINS_REL}</p>
    </div>
  )
}
