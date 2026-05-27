import type { JSX } from 'react'

import { useAppShellStore } from '../../stores/app-shell-store'

export function HelpScreen(): JSX.Element {
  const setWorkspaceTab = useAppShellStore((s) => s.setWorkspaceTab)
  return (
    <div className="portal-screen help-screen">
      <header className="portal-screen__head">
        <h1 className="portal-screen__title">Справка</h1>
        <p className="portal-screen__subtitle">
          Help/*.md — полный портал ref.5; здесь быстрый вход для dev bootstrap.
        </p>
      </header>
      <div className="portal-card vn-surface-glass help-screen__card">
        <p>Каталог статей Help — вкладка «База знаний» (ref.5).</p>
        <button
          type="button"
          className="app-btn app-btn-primary"
          onClick={() => setWorkspaceTab('knowledge')}
        >
          Открыть базу знаний
        </button>
      </div>
    </div>
  )
}

export function HelpRail(): JSX.Element | null {
  return null
}
