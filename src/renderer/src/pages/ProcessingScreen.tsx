import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_PROCESSING_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import {
  PROCESSING_GPU,
  PROCESSING_MEDIA_LIBRARY,
  PROCESSING_NAV,
  PROCESSING_STATUS_CENTER,
  PROCESSING_STATUS_READY,
  PROCESSING_STATUS_RIGHT,
  PROCESSING_STORAGE
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
          <section className="processing-sidebar__project vn-surface-glass" aria-label="Проект">
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
            <div className="processing-sidebar__project-divider" aria-hidden />
            <div className="processing-sidebar__project-active">
              <p className="processing-sidebar__project-name processing-sidebar__project-name--active">
                <span className="processing-sidebar__project-badge">НОВЫЙ</span>
                <span className="processing-sidebar__project-title">СЕЗОН</span>
              </p>
              <p className="processing-sidebar__project-meta">16:9 · 4K · 60 fps</p>
              <div className="processing-sidebar__storage">
                <div className="processing-sidebar__storage-head">
                  <span className="processing-sidebar__storage-label">
                    {PROCESSING_STORAGE.label}
                  </span>
                  <span className="processing-sidebar__storage-values">
                    {PROCESSING_STORAGE.usedTb} / {PROCESSING_STORAGE.totalTb} TB
                  </span>
                </div>
                <div className="processing-sidebar__storage-bar">
                  <div
                    className="processing-sidebar__storage-fill"
                    style={{ width: `${PROCESSING_STORAGE.percent}%` }}
                  />
                </div>
                <span className="processing-sidebar__storage-pct">
                  {PROCESSING_STORAGE.percent}%
                </span>
              </div>
            </div>
          </section>
          <section className="processing-sidebar__media vn-surface-glass" aria-label="Медиатека">
            <h2 className="processing-sidebar__section-title">МЕДИАТЕКА</h2>
            <ul className="processing-media-cats">
              {PROCESSING_MEDIA_LIBRARY.map((cat) => (
                <li
                  key={cat.slug}
                  className={`processing-media-cat processing-media-cat--${cat.slug}${cat.active ? ' processing-media-cat--active' : ''}`}
                >
                  <span className="processing-media-cat__glyph processing-glyph" aria-hidden />
                  <span className="processing-media-cat__label">{cat.label}</span>
                  <span className="processing-media-cat__count">{cat.count}</span>
                </li>
              ))}
            </ul>
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
