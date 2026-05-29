import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_SETTINGS_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import { PROCESSING_NAV } from './processing-ref1-data'
import {
  SETTINGS_ACTIVE_NAV,
  SETTINGS_GENERAL_CARDS,
  SETTINGS_STATUS_READY,
  SETTINGS_STATUS_ROWS,
  SETTINGS_TABS
} from './settings-ref6-data'
import { SettingsCard, SettingsSystemRail } from './settings-ref6-parts'

/** ref.6 — Настройки / control plane (mock; not sign-off). */
export function SettingsScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="settings-shell" id="ref6" data-ref={VELORIX_NEON_REFERENCE_SETTINGS_REL}>
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_SETTINGS_REL} />
        ) : null}
        <aside className="settings-sidebar" aria-label="Навигация">
          <div className="settings-sidebar__brand">
            <span className="processing-sidebar__mark" aria-hidden>
              V
            </span>
            <div className="processing-sidebar__brand-text">
              <div className="processing-sidebar__logo vn-text-gradient">VELORIX</div>
              <p className="processing-sidebar__version">v1.7.0</p>
            </div>
            <span className="processing-sidebar__brand-edition">PRO</span>
          </div>
          <section className="settings-sidebar__nav-block" aria-label="Проект">
            <h2 className="processing-sidebar__section-title">ПРОЕКТ</h2>
            <nav className="processing-nav">
              {PROCESSING_NAV.map((item) => (
                <span
                  key={item.slug}
                  className={
                    item.slug === SETTINGS_ACTIVE_NAV
                      ? 'processing-nav__item processing-nav__item--active'
                      : 'processing-nav__item'
                  }
                  aria-current={item.slug === SETTINGS_ACTIVE_NAV ? 'page' : undefined}
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
          <div className="settings-sidebar__gpu vn-surface-glass">
            <div className="processing-sidebar__gpu-head">
              <span className="processing-sidebar__gpu-glyph processing-glyph" aria-hidden />
              <div>
                <strong>NVIDIA RTX 3090</strong>
                <span>24 GB GDDR6X</span>
              </div>
            </div>
            <p className="settings-sidebar__gpu-stats">
              Загрузка: 68% · Температура: 58°C · Память: 16.8/24 GB
            </p>
            <div className="processing-sidebar__gpu-spark" aria-hidden />
          </div>
          <section className="settings-sidebar__system vn-surface-glass" aria-label="Система">
            <h2 className="processing-sidebar__section-title">СИСТЕМА</h2>
            <div className="processing-sidebar__rings">
              <div className="processing-ring processing-ring--cpu">
                <span>CPU</span>
                <em>18%</em>
              </div>
              <div className="processing-ring processing-ring--ram">
                <span>RAM</span>
                <em>36%</em>
              </div>
              <div className="processing-ring processing-ring--disk">
                <span>Диск</span>
                <em>42%</em>
              </div>
            </div>
          </section>
          <div className="settings-sidebar__footer processing-sidebar__footer">
            <button
              type="button"
              className="processing-util-btn processing-util-btn--settings processing-glyph"
              disabled
              title="Настройки"
            />
            <button
              type="button"
              className="processing-util-btn processing-util-btn--tools processing-glyph"
              disabled
              title="Инструменты"
            />
            <button
              type="button"
              className="processing-util-btn processing-util-btn--power processing-glyph"
              disabled
              title="Выход"
            />
          </div>
        </aside>

        <section className="settings-center" aria-label="Настройки">
          <header className="settings-center__head settings-center__head--png">
            <h1>Настройки</h1>
            <p>Настройте Velorix под свои задачи и рабочие процессы</p>
          </header>
          <div className="settings-center__actions">
            <button type="button" className="vn-btn vn-btn--secondary" disabled>
              Импорт настроек
            </button>
            <button type="button" className="vn-btn vn-btn--secondary" disabled>
              Экспорт настроек
            </button>
            <button type="button" className="vn-btn vn-btn--secondary settings-reset-btn" disabled>
              Сбросить
            </button>
          </div>
          <div className="settings-center__scroll">
            <div className="settings-center__tabs">
              {SETTINGS_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={
                    'active' in tab && tab.active
                      ? 'settings-tab settings-tab--active'
                      : 'settings-tab'
                  }
                  disabled
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="settings-center__grid">
              {SETTINGS_GENERAL_CARDS.map((card) => (
                <SettingsCard key={card.id} card={card} />
              ))}
            </div>
          </div>
          <footer className="settings-footer-sticky vn-surface-glass">
            <div>
              <strong>Импорт / Экспорт настроек</strong>
              <p>Экспортируйте или импортируйте полный профиль конфигурации Velorix</p>
            </div>
            <div className="settings-footer-sticky__actions">
              <button type="button" className="vn-btn vn-btn--primary" disabled>
                Экспорт настроек
              </button>
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                Импорт настроек
              </button>
            </div>
          </footer>
        </section>

        <SettingsSystemRail />

        <footer className="settings-statusbar" aria-label="Статус">
          <span className="settings-statusbar__ready">
            <span className="settings-statusbar__dot" aria-hidden />
            {SETTINGS_STATUS_READY}
          </span>
          <div className="settings-statusbar__center">
            {SETTINGS_STATUS_ROWS.map((row) => (
              <span
                key={row.label}
                className={`settings-statusbar__item${row.accent ? ` settings-statusbar__item--${row.accent}` : ''}`}
              >
                <strong>{row.label}:</strong>{' '}
                {row.mono ? <em className="settings-statusbar__tc">{row.value}</em> : row.value}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </NeonWindowChrome>
  )
}
