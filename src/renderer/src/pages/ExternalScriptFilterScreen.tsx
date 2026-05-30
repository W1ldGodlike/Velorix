import type { JSX } from 'react'
import { NeonSidebarBrand } from '../components/NeonBrandLogo'

import { VELORIX_NEON_REFERENCE_EXTERNAL_SCRIPT_FILTER_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import { ESF_ACTIVE_NAV, ESF_STATUS_READY, ESF_STATUS_ROWS } from './external-script-ref17-data'
import { ExternalScriptCenter, ExternalScriptUtilityRail } from './external-script-ref17-parts'
import { PROCESSING_NAV } from './processing-ref1-data'

/** ref.17 — Внешний script-filter (mock; not sign-off). */
export function ExternalScriptFilterScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div
        className="esf-shell"
        id="ref17"
        data-ref={VELORIX_NEON_REFERENCE_EXTERNAL_SCRIPT_FILTER_REL}
      >
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_EXTERNAL_SCRIPT_FILTER_REL} />
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
                    item.slug === ESF_ACTIVE_NAV
                      ? 'processing-nav__item processing-nav__item--active'
                      : 'processing-nav__item'
                  }
                  aria-current={item.slug === ESF_ACTIVE_NAV ? 'page' : undefined}
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
                <strong>NVIDIA RTX 4090</strong>
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

        <div className="esf-main">
          <ExternalScriptCenter />
          <footer className="tools-statusbar" aria-label="Статус">
            <span className="tools-statusbar__ready">
              <span className="tools-statusbar__dot" aria-hidden />
              {ESF_STATUS_READY}
            </span>
            <div className="tools-statusbar__center">
              {ESF_STATUS_ROWS.map((row) => (
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

        <ExternalScriptUtilityRail />
      </div>
    </NeonWindowChrome>
  )
}
