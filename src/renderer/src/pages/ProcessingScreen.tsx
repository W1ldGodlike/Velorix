import { type CSSProperties, type JSX } from 'react'

import { VELORIX_NEON_REFERENCE_PROCESSING_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonSidebarBrand } from '../components/NeonBrandLogo'
import { NeonReferenceOverlay } from '../components/NeonReferenceOverlay'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import {
  PROCESSING_GPU,
  PROCESSING_NAV,
  PROCESSING_SYSTEM_RINGS,
  PROCESSING_STATUS_CENTER,
  PROCESSING_STATUS_PROJECT,
  PROCESSING_STATUS_READY,
  PROCESSING_STATUS_RIGHT,
  type ProcessingStatusRow
} from './processing-ref1-data'

import { ProcessingEditorCenterBody } from './processing-ref1-center-parts'
import { ProcessingFfmpegRail } from './processing-ref1-parts'

function ProcessingStatusbarValue(props: { row: ProcessingStatusRow }): JSX.Element {
  const { row } = props
  if (row.label === 'Проект') {
    return <span className="processing-statusbar__project">{row.value}</span>
  }
  if (row.mono && row.accent === 'magenta') {
    return (
      <em className="processing-statusbar__tc processing-statusbar__tc--magenta">{row.value}</em>
    )
  }
  if (row.mono) {
    return <em className="processing-statusbar__tc">{row.value}</em>
  }
  if (row.accent === 'cyan') {
    return (
      <span className="processing-statusbar__val processing-statusbar__val--cyan">{row.value}</span>
    )
  }
  return <span className="processing-statusbar__val">{row.value}</span>
}

/** ref.1 — Обработка / editor (mock NLE + FFmpeg rail; not sign-off). */
export function ProcessingScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="processing-shell" id="ref1" data-ref={VELORIX_NEON_REFERENCE_PROCESSING_REL}>
        {import.meta.env.DEV ? (
          <NeonReferenceOverlay referenceRel={VELORIX_NEON_REFERENCE_PROCESSING_REL} />
        ) : null}
        <aside className="processing-sidebar" aria-label="Навигация">
          <NeonSidebarBrand layout="ref1" showEdition={false} />
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
          <div className="processing-sidebar__gpu">
            <div className="processing-sidebar__gpu-head">
              <span className="processing-sidebar__gpu-glyph processing-glyph" aria-hidden />
              <div className="processing-sidebar__gpu-title">
                <strong>{PROCESSING_GPU.name}</strong>
                <span>{PROCESSING_GPU.vram}</span>
              </div>
            </div>
            <p className="processing-sidebar__gpu-stats">
              <span>
                Загрузка: <strong>{PROCESSING_GPU.loadPercent}%</strong>
              </span>
              <span>
                Темп.: <strong>{PROCESSING_GPU.tempCelsius}°C</strong>
              </span>
            </p>
            <div className="processing-sidebar__gpu-spark" aria-hidden>
              <span className="processing-sidebar__gpu-spark-bars" />
            </div>
          </div>
          <section className="processing-sidebar__system" aria-label="Система">
            <h2 className="processing-sidebar__section-title processing-sidebar__section-title--system">
              Система
            </h2>
            <div className="processing-sidebar__rings">
              <div
                className="processing-ring processing-ring--cpu"
                style={{ '--ring-pct': PROCESSING_SYSTEM_RINGS.cpu / 100 } as CSSProperties}
              >
                <span>CPU</span>
                <em>{PROCESSING_SYSTEM_RINGS.cpu}%</em>
              </div>
              <div
                className="processing-ring processing-ring--ram"
                style={{ '--ring-pct': PROCESSING_SYSTEM_RINGS.ram / 100 } as CSSProperties}
              >
                <span>RAM</span>
                <em>{PROCESSING_SYSTEM_RINGS.ram}%</em>
              </div>
              <div
                className="processing-ring processing-ring--disk"
                style={{ '--ring-pct': PROCESSING_SYSTEM_RINGS.disk / 100 } as CSSProperties}
              >
                <span>Диск</span>
                <em>{PROCESSING_SYSTEM_RINGS.disk}%</em>
              </div>
            </div>
          </section>
        </aside>

        <section className="processing-center" aria-label="Редактор">
          <header className="processing-center__head processing-center__head--png">
            <div className="processing-center__head-main">
              <h1>Обработка</h1>
              <p>Профессиональная обработка и монтаж медиафайлов</p>
            </div>
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
            <span className="processing-statusbar__item">
              <strong>Проект:</strong>{' '}
              <span className="processing-statusbar__project">{PROCESSING_STATUS_PROJECT}</span>
            </span>
          </div>
          <div className="processing-statusbar__center">
            {PROCESSING_STATUS_CENTER.map((row) => (
              <span key={row.label} className="processing-statusbar__item">
                <strong>{row.label}:</strong> <ProcessingStatusbarValue row={row} />
              </span>
            ))}
          </div>
          <div className="processing-statusbar__right">
            {PROCESSING_STATUS_RIGHT.map((row) => (
              <span key={row.label} className="processing-statusbar__item">
                <strong>{row.label}:</strong> <ProcessingStatusbarValue row={row} />
              </span>
            ))}
          </div>
        </footer>
      </div>
    </NeonWindowChrome>
  )
}
