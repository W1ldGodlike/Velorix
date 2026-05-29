import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_ENCODER_BENCHMARK_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import { EB_ACTIVE_NAV, EB_STATUS_READY, EB_STATUS_ROWS } from './encoder-benchmark-ref24-data'
import { EncoderBenchmarkCenter, EncoderBenchmarkRail } from './encoder-benchmark-ref24-parts'
import { PROCESSING_NAV } from './processing-ref1-data'

/** ref.24 — Бенчмарк кодеров 3-col (mock; not sign-off). */
export function EncoderBenchmarkScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="eb-shell" id="ref24" data-ref={VELORIX_NEON_REFERENCE_ENCODER_BENCHMARK_REL}>
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_ENCODER_BENCHMARK_REL} />
        ) : null}
        <aside className="tools-sidebar eb-sidebar" aria-label="Навигация">
          <div className="tools-sidebar__brand">
            <span className="processing-sidebar__mark" aria-hidden>
              V
            </span>
            <div className="processing-sidebar__brand-text">
              <div className="processing-sidebar__logo vn-text-gradient">VELORIX</div>
              <p className="processing-sidebar__version">v1.7.0</p>
            </div>
            <span className="processing-sidebar__brand-edition">PRO</span>
          </div>
          <section className="tools-sidebar__nav-block" aria-label="Проект">
            <h2 className="processing-sidebar__section-title">ПРОЕКТ</h2>
            <nav className="processing-nav">
              {PROCESSING_NAV.map((item) => (
                <span
                  key={item.slug}
                  className={
                    item.slug === EB_ACTIVE_NAV
                      ? 'processing-nav__item processing-nav__item--active'
                      : 'processing-nav__item'
                  }
                  aria-current={item.slug === EB_ACTIVE_NAV ? 'page' : undefined}
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
                <span>24GB GDDR6X</span>
              </div>
            </div>
            <p className="tools-sidebar__gpu-stats">Load 95% · Temp 72°C · VRAM 18.3 / 24.0 GB</p>
            <div className="processing-sidebar__gpu-spark" aria-hidden />
          </div>
          <section className="tools-sidebar__system vn-surface-glass" aria-label="Система">
            <h2 className="processing-sidebar__section-title">Система</h2>
            <div className="processing-sidebar__rings">
              <div className="processing-ring processing-ring--cpu">
                <span>CPU</span>
                <em>79%</em>
              </div>
              <div className="processing-ring processing-ring--ram">
                <span>RAM</span>
                <em>83%</em>
              </div>
              <div className="processing-ring processing-ring--disk">
                <span>Disk</span>
                <em>64%</em>
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

        <div className="eb-main">
          <EncoderBenchmarkCenter />
          <footer className="tools-statusbar" aria-label="Статус">
            <span className="tools-statusbar__ready">
              <span className="tools-statusbar__dot" aria-hidden />
              {EB_STATUS_READY}
            </span>
            <div className="tools-statusbar__center">
              {EB_STATUS_ROWS.map((row) => (
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

        <EncoderBenchmarkRail />
      </div>
    </NeonWindowChrome>
  )
}
