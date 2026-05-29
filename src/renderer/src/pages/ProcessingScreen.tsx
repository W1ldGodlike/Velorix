import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_PROCESSING_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import {
  PROCESSING_GPU,
  PROCESSING_NAV,
  PROCESSING_STATUS_CENTER,
  PROCESSING_STATUS_READY,
  PROCESSING_STATUS_RIGHT
} from './processing-ref1-data'
import { ProcessingEditorCenterBody } from './processing-ref1-center-parts'
import { ProcessingFfmpegRail } from './processing-ref1-parts'

/** ref.1 — Обработка / editor (mock NLE + FFmpeg rail; not sign-off). */
export function ProcessingScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="processing-shell" id="ref1" data-ref={VELORIX_NEON_REFERENCE_PROCESSING_REL}>
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_PROCESSING_REL} />
        ) : null}
        <aside className="processing-sidebar" aria-label="Навигация">
          <div className="processing-sidebar__brand">
            <span className="processing-sidebar__mark" aria-hidden>
              V
            </span>
            <div className="processing-sidebar__brand-text">
              <div className="processing-sidebar__logo vn-text-gradient">VELORIX</div>
              <p className="processing-sidebar__version">v1.7.0</p>
            </div>
            <span className="processing-sidebar__brand-edition">PRO</span>
          </div>
          <section className="processing-sidebar__nav-block" aria-label="Проект">
            <h2 className="processing-sidebar__section-title">ПРОЕКТ</h2>
            <nav className="processing-nav" aria-label="Навигация">
              {PROCESSING_NAV.map((item) => (
                <span
                  key={item.slug}
                  className={
                    item.slug === 'processing'
                      ? 'processing-nav__item processing-nav__item--active'
                      : 'processing-nav__item'
                  }
                  aria-current={item.slug === 'processing' ? 'page' : undefined}
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
          <div className="processing-sidebar__gpu vn-surface-glass">
            <div className="processing-sidebar__gpu-head">
              <span className="processing-sidebar__gpu-glyph processing-glyph" aria-hidden />
              <div className="processing-sidebar__gpu-title">
                <strong>{PROCESSING_GPU.name}</strong>
                <span>{PROCESSING_GPU.vram}</span>
              </div>
              <span className="processing-sidebar__gpu-tag">{PROCESSING_GPU.tag}</span>
            </div>
            <p className="processing-sidebar__gpu-stats">
              Загрузка: {PROCESSING_GPU.loadPercent}% · Температура: {PROCESSING_GPU.tempCelsius}°C
            </p>
            <div className="processing-sidebar__gpu-spark" aria-hidden>
              <span className="processing-sidebar__gpu-spark-bars" />
            </div>
          </div>
          <section className="processing-sidebar__system vn-surface-glass" aria-label="Система">
            <h2 className="processing-sidebar__section-title">СИСТЕМА</h2>
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
                <span>Диск</span>
                <em>38%</em>
              </div>
            </div>
          </section>
          <div className="processing-sidebar__footer">
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

        <section className="processing-center" aria-label="Редактор">
          <header className="processing-center__head processing-center__head--png">
            <h1>Обработка</h1>
            <p>Профессиональная обработка и монтаж медиафайлов</p>
          </header>
          <div className="processing-center__body">
            <ProcessingEditorCenterBody />
          </div>
        </section>

        <ProcessingFfmpegRail />

        <footer className="processing-statusbar processing-statusbar--dense">
          <div className="processing-statusbar__left">
            <span className="processing-statusbar__ready">
              <span className="processing-statusbar__dot" aria-hidden />
              {PROCESSING_STATUS_READY}
            </span>
          </div>
          <div className="processing-statusbar__center">
            {PROCESSING_STATUS_CENTER.map((row) => (
              <span
                key={row.label}
                className={`processing-statusbar__item${row.accent ? ` processing-statusbar__item--${row.accent}` : ''}`}
              >
                <strong>{row.label}:</strong>{' '}
                {row.mono ? <em className="processing-statusbar__tc">{row.value}</em> : row.value}
              </span>
            ))}
          </div>
          <div className="processing-statusbar__right">
            {PROCESSING_STATUS_RIGHT.map((row) => (
              <span
                key={row.label}
                className={`processing-statusbar__item${row.accent ? ` processing-statusbar__item--${row.accent}` : ''}`}
              >
                <strong>{row.label}:</strong> {row.value}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </NeonWindowChrome>
  )
}
