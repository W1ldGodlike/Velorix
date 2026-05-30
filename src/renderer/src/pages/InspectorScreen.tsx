import type { JSX } from 'react'
import { NeonSidebarBrand } from '../components/NeonBrandLogo'

import { VELORIX_NEON_REFERENCE_INSPECTOR_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import { InspectorOverviewPanels, InspectorTechRail } from './inspector-ref8-parts'
import {
  INSPECTOR_ACTIVE_NAV,
  INSPECTOR_CENTER_SUMMARY,
  INSPECTOR_FILE,
  INSPECTOR_STATUS_READY,
  INSPECTOR_STATUS_ROWS,
  INSPECTOR_TABS,
  INSPECTOR_TIMECODE
} from './inspector-ref8-data'
import { PROCESSING_NAV } from './processing-ref1-data'

/** ref.8 — Инспектор / media analysis (mock; not sign-off). */
export function InspectorScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="inspector-shell" id="ref8" data-ref={VELORIX_NEON_REFERENCE_INSPECTOR_REL}>
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_INSPECTOR_REL} />
        ) : null}
        <aside className="inspector-sidebar" aria-label="Навигация">
          <NeonSidebarBrand className="inspector-sidebar__brand processing-sidebar__brand" />

          <section className="inspector-sidebar__nav-block" aria-label="Проект">
            <h2 className="processing-sidebar__section-title">ПРОЕКТ</h2>
            <nav className="processing-nav">
              {PROCESSING_NAV.map((item) => (
                <span
                  key={item.slug}
                  className={
                    item.slug === INSPECTOR_ACTIVE_NAV
                      ? 'processing-nav__item processing-nav__item--active'
                      : 'processing-nav__item'
                  }
                  aria-current={item.slug === INSPECTOR_ACTIVE_NAV ? 'page' : undefined}
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
          <div className="inspector-sidebar__gpu vn-surface-glass">
            <div className="processing-sidebar__gpu-head">
              <span className="processing-sidebar__gpu-glyph processing-glyph" aria-hidden />
              <div>
                <strong>NVIDIA RTX 3090</strong>
                <span>24 GB GDDR6X</span>
              </div>
            </div>
            <p className="inspector-sidebar__gpu-stats">
              Загрузка: 68% · Температура: 58°C · Память: 17.2/24 GB
            </p>
            <div className="processing-sidebar__gpu-spark" aria-hidden />
          </div>
          <section className="inspector-sidebar__system vn-surface-glass" aria-label="Система">
            <h2 className="processing-sidebar__section-title">Система</h2>
            <div className="processing-sidebar__rings">
              <div className="processing-ring processing-ring--cpu">
                <span>CPU</span>
                <em>23%</em>
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
            <div className="processing-sidebar__utilities inspector-sidebar__utilities">
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

        <section className="inspector-center" aria-label="Инспектор">
          <header className="inspector-center__head">
            <div className="inspector-center__head-main">
              <p className="inspector-center__eyebrow">Инспектор · ffprobe</p>
              <h1>Инспектор</h1>
              <p>Детальный анализ и информация о медиафайлах</p>
            </div>
            <div className="inspector-center__head-tools">
              <span className="inspector-center__head-chip">4K HEVC</span>
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                Открыть файл
              </button>
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                Экспорт отчёта
              </button>
            </div>
          </header>
          <p className="inspector-center__summary">{INSPECTOR_CENTER_SUMMARY}</p>
          <div className="inspector-center__scroll">
            <div className="inspector-file-head vn-surface-glass">
              <strong>{INSPECTOR_FILE.name}</strong>
              <span>{INSPECTOR_FILE.specs}</span>
            </div>
            <div className="inspector-center__tabs">
              {INSPECTOR_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={
                    'active' in tab && tab.active
                      ? 'inspector-tab inspector-tab--active'
                      : 'inspector-tab'
                  }
                  disabled
                >
                  {tab.label} {tab.count}
                </button>
              ))}
            </div>
            <InspectorOverviewPanels />
          </div>
          <footer className="inspector-transport-sticky vn-surface-glass" aria-label="Таймкод">
            <span className="inspector-transport-sticky__tc">
              {INSPECTOR_TIMECODE.current} / {INSPECTOR_TIMECODE.total}
            </span>
            <div className="inspector-transport-sticky__nav">
              <button
                type="button"
                className="inspector-transport-sticky__btn"
                disabled
                title="−1 кадр"
              >
                ‹
              </button>
              <button
                type="button"
                className="inspector-transport-sticky__btn"
                disabled
                title="Play"
              >
                ▶
              </button>
              <button
                type="button"
                className="inspector-transport-sticky__btn"
                disabled
                title="+1 кадр"
              >
                ›
              </button>
              <button
                type="button"
                className="inspector-transport-sticky__btn"
                disabled
                title="Mark In"
              >
                [
              </button>
              <button
                type="button"
                className="inspector-transport-sticky__btn"
                disabled
                title="Mark Out"
              >
                ]
              </button>
            </div>
          </footer>
        </section>

        <InspectorTechRail />

        <footer className="inspector-statusbar" aria-label="Статус">
          <span className="inspector-statusbar__ready">
            <span className="inspector-statusbar__dot" aria-hidden />
            {INSPECTOR_STATUS_READY}
          </span>
          <div className="inspector-statusbar__center">
            {INSPECTOR_STATUS_ROWS.map((row) => (
              <span
                key={row.label}
                className={`inspector-statusbar__item${row.accent ? ` inspector-statusbar__item--${row.accent}` : ''}`}
              >
                <strong>{row.label}:</strong>{' '}
                {row.mono ? <em className="inspector-statusbar__tc">{row.value}</em> : row.value}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </NeonWindowChrome>
  )
}
