import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_TERMINAL_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import { PROCESSING_NAV } from './processing-ref1-data'
import {
  TERMINAL_ACTIVE_NAV,
  TERMINAL_CENTER_SUMMARY,
  TERMINAL_LOG_SUMMARY,
  TERMINAL_STATUS_READY,
  TERMINAL_STATUS_ROWS,
  TERMINAL_TABS
} from './terminal-ref9-data'
import { TerminalLogView, TerminalSettingsRail } from './terminal-ref9-parts'

/** ref.9 — Терминал / log console (mock; not sign-off). */
export function TerminalScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="terminal-shell" id="ref9" data-ref={VELORIX_NEON_REFERENCE_TERMINAL_REL}>
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_TERMINAL_REL} />
        ) : null}
        <aside className="terminal-sidebar" aria-label="Навигация">
          <div className="terminal-sidebar__brand">
            <span className="processing-sidebar__mark" aria-hidden>
              V
            </span>
            <div className="processing-sidebar__brand-text">
              <div className="processing-sidebar__logo vn-text-gradient">VELORIX</div>
              <p className="processing-sidebar__version">v1.7.0</p>
            </div>
            <span className="processing-sidebar__brand-edition">PRO</span>
          </div>
          <section className="terminal-sidebar__nav-block" aria-label="Проект">
            <h2 className="processing-sidebar__section-title">ПРОЕКТ</h2>
            <nav className="processing-nav">
              {PROCESSING_NAV.map((item) => (
                <span
                  key={item.slug}
                  className={
                    item.slug === TERMINAL_ACTIVE_NAV
                      ? 'processing-nav__item processing-nav__item--active'
                      : 'processing-nav__item'
                  }
                  aria-current={item.slug === TERMINAL_ACTIVE_NAV ? 'page' : undefined}
                >
                  <span
                    className={`processing-nav__icon processing-nav__icon--${item.slug} processing-glyph`}
                    aria-hidden
                  />
                  {item.label}
                </span>
              ))}
            </nav>
          </section>
          <div className="terminal-sidebar__gpu vn-surface-glass">
            <div className="processing-sidebar__gpu-head">
              <span className="processing-sidebar__gpu-glyph processing-glyph" aria-hidden />
              <div>
                <strong>NVIDIA RTX 3090</strong>
                <span>24 GB GDDR6X</span>
              </div>
            </div>
            <p className="terminal-sidebar__gpu-stats">
              Загрузка: 68% · Температура: 58°C · Память: 17.2/24 GB
            </p>
            <div className="processing-sidebar__gpu-spark" aria-hidden />
          </div>
          <section className="terminal-sidebar__system vn-surface-glass" aria-label="Система">
            <h2 className="processing-sidebar__section-title">Система</h2>
            <div className="processing-sidebar__rings">
              <div className="processing-ring processing-ring--cpu">
                <span>CPU</span>
                <em>18%</em>
              </div>
              <div className="processing-ring processing-ring--ram">
                <span>RAM</span>
                <em>42%</em>
              </div>
              <div className="processing-ring processing-ring--disk">
                <span>Disk</span>
                <em>38%</em>
              </div>
            </div>
            <div className="processing-sidebar__utilities terminal-sidebar__utilities">
              <button
                type="button"
                className="processing-util-btn processing-util-btn--search processing-glyph"
                disabled
                title="Поиск"
              />
              <button
                type="button"
                className="processing-util-btn processing-util-btn--settings processing-glyph"
                disabled
                title="Настройки"
              />
              <button
                type="button"
                className="processing-util-btn processing-util-btn--notify processing-glyph"
                disabled
                title="Уведомления"
              />
              <button
                type="button"
                className="processing-util-btn processing-util-btn--power processing-glyph"
                disabled
                title="Выход"
              />
            </div>
          </section>
        </aside>

        <section className="terminal-center" aria-label="Терминал">
          <header className="terminal-center__head">
            <div className="terminal-center__head-main">
              <p className="terminal-center__eyebrow">Терминал · FFmpeg logs</p>
              <h1>Терминал</h1>
              <p>Консоль для работы с системой и выполнения команд</p>
            </div>
            <div className="terminal-center__head-tools">
              <span className="terminal-center__head-chip">16 lines</span>
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                Очистить
              </button>
              <button type="button" className="terminal-toolbar-btn" disabled title="Пауза">
                <span
                  className="terminal-glyph terminal-glyph--pause processing-glyph"
                  aria-hidden
                />
              </button>
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                Сохранить
              </button>
            </div>
          </header>
          <p className="terminal-center__summary">{TERMINAL_CENTER_SUMMARY}</p>
          <div className="terminal-center__scroll">
            <div className="terminal-center__tabs">
              {TERMINAL_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={
                    'active' in tab && tab.active
                      ? 'terminal-tab terminal-tab--active'
                      : 'terminal-tab'
                  }
                  disabled
                >
                  {tab.label} {tab.count}
                </button>
              ))}
            </div>
            <p className="terminal-center__log-summary">{TERMINAL_LOG_SUMMARY}</p>
            <TerminalLogView />
          </div>
          <footer className="terminal-command-sticky vn-surface-glass" aria-label="Команда">
            <input
              type="text"
              className="vn-input terminal-command-sticky__input"
              placeholder="Введите команду…"
              disabled
            />
            <button type="button" className="vn-btn vn-btn--primary" disabled>
              Выполнить
            </button>
          </footer>
        </section>

        <TerminalSettingsRail />

        <footer className="terminal-statusbar" aria-label="Статус">
          <span className="terminal-statusbar__ready">
            <span className="terminal-statusbar__dot" aria-hidden />
            {TERMINAL_STATUS_READY}
          </span>
          <div className="terminal-statusbar__center">
            {TERMINAL_STATUS_ROWS.map((row) => (
              <span
                key={row.label}
                className={`terminal-statusbar__item${row.accent ? ` terminal-statusbar__item--${row.accent}` : ''}`}
              >
                <strong>{row.label}:</strong>{' '}
                {row.mono ? <em className="terminal-statusbar__tc">{row.value}</em> : row.value}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </NeonWindowChrome>
  )
}
