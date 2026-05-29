import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_UI_COMPONENTS_REL } from '../../../shared/velorix-neon-theme-tokens'

import { NeonKitNav } from './neon-kit-nav'

const TABLE_ROWS = [
  { name: 'Project 001', status: 'ready' as const, size: '246 GB', date: '14.05.2026' },
  { name: 'Project 002', status: 'processing' as const, size: '18.8 GB', date: '13.05.2026' },
  { name: 'Project 003', status: 'error' as const, size: '8.7 GB', date: '12.05.2026' }
]

/** ref.27 — UI Components / States kit (rebuild; not sign-off). */
export function Ref27KitPage(): JSX.Element {
  return (
    <div className="neon-kit" id="ref27">
      <NeonKitNav route="ref27" />
      <header className="neon-kit__head">
        <h1 className="neon-kit__title vn-text-gradient">VELORIX UI COMPONENTS</h1>
        <p className="neon-kit__ref">ref.27 · {VELORIX_NEON_REFERENCE_UI_COMPONENTS_REL}</p>
      </header>
      <div className="neon-kit__grid">
        <section className="neon-kit__section vn-surface-glass" aria-labelledby="kit-buttons">
          <h2 id="kit-buttons">01 Кнопки</h2>
          <div className="neon-kit__row">
            <button type="button" className="vn-btn vn-btn--primary">
              Primary
            </button>
            <button type="button" className="vn-btn vn-btn--secondary">
              Secondary
            </button>
            <button type="button" className="vn-btn vn-btn--danger">
              Danger
            </button>
            <button type="button" className="vn-btn vn-btn--primary" disabled>
              Disabled
            </button>
          </div>
        </section>
        <section className="neon-kit__section vn-surface-glass" aria-labelledby="kit-inputs">
          <h2 id="kit-inputs">03 Поля ввода</h2>
          <div className="neon-kit__stack">
            <input className="vn-input" type="text" defaultValue="Default" aria-label="Default" />
            <input
              className="vn-input vn-input--error"
              type="text"
              defaultValue="Error"
              aria-label="Error"
            />
            <input
              className="vn-input vn-input--success"
              type="text"
              defaultValue="Success"
              aria-label="Success"
            />
          </div>
        </section>
        <section className="neon-kit__section vn-surface-glass" aria-labelledby="kit-badges">
          <h2 id="kit-badges">09 Бейджи</h2>
          <div className="neon-kit__row">
            <span className="vn-badge vn-badge--ready">Готово</span>
            <span className="vn-badge vn-badge--processing">Обработка</span>
            <span className="vn-badge vn-badge--error">Ошибка</span>
          </div>
        </section>
        <section className="neon-kit__section vn-surface-glass" aria-labelledby="kit-progress">
          <h2 id="kit-progress">07 Прогресс</h2>
          <div className="neon-kit__stack">
            <div
              className="vn-progress"
              role="progressbar"
              aria-valuenow={32}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="vn-progress__fill" style={{ width: '32%' }} />
            </div>
            <div
              className="vn-progress"
              role="progressbar"
              aria-valuenow={78}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="vn-progress__fill" style={{ width: '78%' }} />
            </div>
          </div>
        </section>
        <section className="neon-kit__section vn-surface-glass" aria-labelledby="kit-table">
          <h2 id="kit-table">11 Таблица</h2>
          <table className="neon-kit__table">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Статус</th>
                <th>Размер</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>
                    <span className={`vn-badge vn-badge--${row.status}`}>
                      {row.status === 'ready'
                        ? 'Готово'
                        : row.status === 'error'
                          ? 'Ошибка'
                          : 'Обработка'}
                    </span>
                  </td>
                  <td>{row.size}</td>
                  <td>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="neon-kit__section vn-surface-glass" aria-labelledby="kit-toasts">
          <h2 id="kit-toasts">15 Тосты</h2>
          <div className="neon-kit__stack">
            <div className="neon-kit__toast neon-kit__toast--success">Экспорт завершён</div>
            <div className="neon-kit__toast neon-kit__toast--error">Ошибка FFmpeg</div>
          </div>
        </section>
      </div>
    </div>
  )
}
