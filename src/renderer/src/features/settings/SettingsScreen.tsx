import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_SETTINGS_REL } from '../../../../shared/velorix-neon-theme-tokens'

import { useAppShellStore } from '../../stores/app-shell-store'

const SECTIONS = [
  { title: 'Приложение', hint: 'Язык, автозапуск, уведомления' },
  { title: 'Обработка', hint: 'FFmpeg, пресеты, пути' },
  { title: 'Кэш и данные', hint: 'Очистка, резервные копии' }
] as const

export function SettingsScreen(): JSX.Element {
  const openModal = useAppShellStore((s) => s.openModal)
  const hydrateEnginePathDraft = useAppShellStore((s) => s.hydrateEnginePathDraft)
  return (
    <div className="portal-screen settings-screen">
      <header className="portal-screen__head">
        <h1 className="portal-screen__title">Настройки</h1>
        <p className="portal-screen__subtitle">Эталон: {VELORIX_NEON_REFERENCE_SETTINGS_REL}</p>
      </header>
      <div className="settings-screen__grid">
        {SECTIONS.map((section, index) => (
          <section
            key={section.title}
            className={`portal-card vn-surface-glass${index === 0 ? ' portal-card--active' : ''}`}
          >
            <h2>{section.title}</h2>
            <p>{section.hint}</p>
            <button
              type="button"
              className="app-btn app-btn-secondary"
              onClick={() => {
                if (section.title === 'Приложение') {
                  openModal('about')
                } else if (section.title === 'Обработка') {
                  void hydrateEnginePathDraft().then(() => openModal('engine-paths'))
                } else {
                  openModal('first-run-engines')
                }
              }}
            >
              Открыть
            </button>
          </section>
        ))}
      </div>
    </div>
  )
}

export function SettingsRail(): JSX.Element {
  const openModal = useAppShellStore((s) => s.openModal)
  const hydrateEnginePathDraft = useAppShellStore((s) => s.hydrateEnginePathDraft)
  return (
    <aside className="portal-rail vn-surface-glass">
      <h2 className="portal-rail__title">Раздел</h2>
      <nav className="settings-rail__nav">
        {SECTIONS.map((section, index) => (
          <button
            key={section.title}
            type="button"
            className={`settings-rail__link${index === 0 ? ' settings-rail__link--active' : ''}`}
          >
            {section.title}
          </button>
        ))}
      </nav>
      <div className="settings-rail__shortcuts">
        <button
          type="button"
          className="app-btn app-btn-secondary"
          onClick={() => {
            void hydrateEnginePathDraft().then(() => openModal('engine-paths'))
          }}
        >
          Пути движков
        </button>
        <button type="button" className="app-btn" onClick={() => openModal('first-run-engines')}>
          Первый запуск
        </button>
      </div>
    </aside>
  )
}
