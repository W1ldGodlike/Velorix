import type { JSX } from 'react'

export function HelpScreen(): JSX.Element {
  return (
    <div className="portal-screen help-screen">
      <header className="portal-screen__head">
        <h1 className="portal-screen__title">Справка</h1>
        <p className="portal-screen__subtitle">
          Help/*.md — полный портал ref.5; здесь быстрый вход для dev bootstrap.
        </p>
      </header>
      <div className="portal-card vn-surface-glass help-screen__card">
        <p>Откройте «База знаний» для макета каталога статей по PNG ref.5.</p>
        <button type="button" className="app-btn app-btn-primary">
          Диагностика Support ZIP
        </button>
      </div>
    </div>
  )
}

export function HelpRail(): JSX.Element | null {
  return null
}
