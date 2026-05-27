import type { JSX } from 'react'

import { ShowcaseCard } from './ref27-showcase-shared'

type Swatch = {
  token: string
  label: string
}

const SWATCH_GROUPS: Array<{ title: string; swatches: Swatch[] }> = [
  {
    title: 'Фон',
    swatches: [
      { token: '--vn-color-void', label: 'void' },
      { token: '--vn-color-midnight', label: 'midnight' },
      { token: '--vn-color-abyss', label: 'abyss' },
      { token: '--vn-color-navy-deep', label: 'navy-deep' },
      { token: '--vn-color-navy-mid', label: 'navy-mid' }
    ]
  },
  {
    title: 'Violet / purple',
    swatches: [
      { token: '--vn-color-violet-rich', label: 'violet-rich' },
      { token: '--vn-color-violet-bright', label: 'violet-bright' },
      { token: '--vn-color-violet-deep', label: 'violet-deep' },
      { token: '--vn-color-purple-panel', label: 'purple-panel' },
      { token: '--vn-color-purple-mist', label: 'purple-mist' }
    ]
  },
  {
    title: 'Neon accents',
    swatches: [
      { token: '--vn-color-magenta-neon', label: 'magenta-neon' },
      { token: '--vn-color-magenta-hot', label: 'magenta-hot' },
      { token: '--vn-color-cyan-electric', label: 'cyan-electric' },
      { token: '--vn-color-blue-glow', label: 'blue-glow' }
    ]
  },
  {
    title: 'Текст',
    swatches: [
      { token: '--vn-color-text-bright', label: 'bright' },
      { token: '--vn-color-text-secondary', label: 'secondary' },
      { token: '--vn-color-text-muted', label: 'muted' }
    ]
  },
  {
    title: 'Статусы',
    swatches: [
      { token: '--vn-color-success-matrix', label: 'success' },
      { token: '--vn-color-danger-neon', label: 'danger' },
      { token: '--vn-color-warning-amber', label: 'warning' }
    ]
  }
]

/** ref.27 neon.1 — визуальная сетка примитивов `01-primitives.css`. */
export function Ref27PrimitivesPalette(): JSX.Element {
  return (
    <ShowcaseCard title="Примитивы (--vn-color-*)">
      <div className="ref27-primitives">
        {SWATCH_GROUPS.map((group) => (
          <section key={group.title} className="ref27-primitives__group">
            <h3 className="ref27-primitives__group-title">{group.title}</h3>
            <div className="ref27-primitives__grid" role="list">
              {group.swatches.map((swatch) => (
                <div key={swatch.token} className="ref27-primitives__swatch" role="listitem">
                  <span
                    className="ref27-primitives__chip"
                    style={{ background: `var(${swatch.token})` }}
                    aria-hidden
                  />
                  <code className="ref27-primitives__token">{swatch.token}</code>
                  <span className="ref27-primitives__label">{swatch.label}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
        <section className="ref27-primitives__group">
          <h3 className="ref27-primitives__group-title">Семантика (--fa-* bridge)</h3>
          <div className="ref27-primitives__semantic">
            <span className="ref27-primitives__semantic-chip" data-token="bg">
              bg
            </span>
            <span className="ref27-primitives__semantic-chip" data-token="surface">
              surface
            </span>
            <span className="ref27-primitives__semantic-chip" data-token="accent">
              accent
            </span>
            <span className="ref27-primitives__semantic-chip" data-token="success">
              success
            </span>
            <span className="ref27-primitives__semantic-chip" data-token="danger">
              danger
            </span>
          </div>
        </section>
      </div>
    </ShowcaseCard>
  )
}
