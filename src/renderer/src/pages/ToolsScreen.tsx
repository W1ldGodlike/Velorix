import type { JSX } from 'react'
import { NeonSidebarBrand } from '../components/NeonBrandLogo'

import { VELORIX_NEON_REFERENCE_TOOLS_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import { PROCESSING_NAV } from './processing-ref1-data'
import {
  TOOLS_ACTIVE_NAV,
  TOOLS_CARDS,
  TOOLS_GRID_SUMMARY,
  TOOLS_STATUS_READY,
  TOOLS_STATUS_ROWS
} from './tools-ref10-data'
import { ToolsCardView, ToolsQuickActionsPanel, ToolsUtilityRail } from './tools-ref10-parts'

/** ref.10 — Инструменты / tools hub (mock; not sign-off). */
export function ToolsScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="tools-shell" id="ref10" data-ref={VELORIX_NEON_REFERENCE_TOOLS_REL}>
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_TOOLS_REL} />
        ) : null}
        <aside className="tools-sidebar" aria-label="Навигация">
          <NeonSidebarBrand className="tools-sidebar__brand processing-sidebar__brand" />

          <section className="tools-sidebar__nav-block" aria-label="Проект">
            <h2 className="processing-sidebar__section-title">ПРОЕКТ</h2>
            <nav className="processing-nav">
              {PROCESSING_NAV.map((item) => (
                <span
                  key={item.slug}
                  className={
                    item.slug === TOOLS_ACTIVE_NAV
                      ? 'processing-nav__item processing-nav__item--active'
                      : 'processing-nav__item'
                  }
                  aria-current={item.slug === TOOLS_ACTIVE_NAV ? 'page' : undefined}
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
          <div className="tools-sidebar__gpu vn-surface-glass">
            <div className="processing-sidebar__gpu-head">
              <span className="processing-sidebar__gpu-glyph processing-glyph" aria-hidden />
              <div>
                <strong>NVIDIA RTX 3090</strong>
                <span>24 GB GDDR6X</span>
              </div>
            </div>
            <p className="tools-sidebar__gpu-stats">
              Загрузка: 68% · Температура: 58°C · Память: 17.2/24 GB
            </p>
            <div className="processing-sidebar__gpu-spark" aria-hidden />
          </div>
          <section className="tools-sidebar__system vn-surface-glass" aria-label="Система">
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
            <div className="processing-sidebar__utilities tools-sidebar__utilities">
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

        <div className="tools-main">
          <section className="tools-center" aria-label="Инструменты">
            <header className="tools-center__head">
              <div className="tools-center__head-main">
                <p className="tools-center__eyebrow">Инструменты · hub</p>
                <h1>Инструменты</h1>
                <p>Набор профессиональных инструментов для обработки и автоматизации задач</p>
              </div>
              <div className="tools-center__head-tools">
                <span className="tools-center__head-chip">10 cards</span>
                <input
                  type="search"
                  className="vn-input tools-center__search"
                  placeholder="Поиск инструмента…"
                  disabled
                />
              </div>
            </header>
            <p className="tools-center__summary">{TOOLS_GRID_SUMMARY}</p>
            <div className="tools-center__body">
              <div className="tools-center__grid">
                {TOOLS_CARDS.map((card) => (
                  <ToolsCardView key={card.id} card={card} />
                ))}
              </div>
              <ToolsQuickActionsPanel />
            </div>
          </section>
          <footer className="tools-statusbar" aria-label="Статус">
            <span className="tools-statusbar__ready">
              <span className="tools-statusbar__dot" aria-hidden />
              {TOOLS_STATUS_READY}
            </span>
            <div className="tools-statusbar__center">
              {TOOLS_STATUS_ROWS.map((row) => (
                <span
                  key={row.label}
                  className={`tools-statusbar__item${row.accent ? ` tools-statusbar__item--${row.accent}` : ''}`}
                >
                  <strong>{row.label}:</strong>{' '}
                  {row.mono ? <em className="tools-statusbar__tc">{row.value}</em> : row.value}
                </span>
              ))}
            </div>
          </footer>
        </div>

        <ToolsUtilityRail />
      </div>
    </NeonWindowChrome>
  )
}
