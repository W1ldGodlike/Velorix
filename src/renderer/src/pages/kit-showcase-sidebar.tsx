import type { JSX } from 'react'

import { NeonSidebarBrand } from '../components/NeonBrandLogo'
import { PROCESSING_NAV } from './processing-ref1-data'

/** Shared sidebar for ref.26 / ref.27 kit showcase (mock; not sign-off). */
export function KitShowcaseSidebar(): JSX.Element {
  return (
    <aside className="tools-sidebar ks-sidebar" aria-label="Навигация">
      <NeonSidebarBrand className="tools-sidebar__brand processing-sidebar__brand" />
      <section className="tools-sidebar__nav-block" aria-label="Проект">
        <h2 className="processing-sidebar__section-title">ПРОЕКТ</h2>
        <nav className="processing-nav">
          {PROCESSING_NAV.map((item) => (
            <span
              key={item.slug}
              className={
                item.slug === 'tools'
                  ? 'processing-nav__item processing-nav__item--active'
                  : 'processing-nav__item'
              }
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
        <p className="tools-sidebar__gpu-stats">Load 87% · Temp 71°C · VRAM 18.7 / 24.0 GB</p>
        <div className="processing-sidebar__gpu-spark" aria-hidden />
      </div>
      <section className="tools-sidebar__system vn-surface-glass" aria-label="Система">
        <h2 className="processing-sidebar__section-title">Система</h2>
        <div className="processing-sidebar__rings">
          <div className="processing-ring processing-ring--cpu">
            <span>CPU</span>
            <em>68%</em>
          </div>
          <div className="processing-ring processing-ring--ram">
            <span>RAM</span>
            <em>76%</em>
          </div>
          <div className="processing-ring processing-ring--disk">
            <span>Disk</span>
            <em>42%</em>
          </div>
        </div>
      </section>
    </aside>
  )
}
