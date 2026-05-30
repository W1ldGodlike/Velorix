import type { JSX } from 'react'
import { NeonBrandStacked, NeonSidebarBrand } from '../components/NeonBrandLogo'

import type {
  AboutActionMock,
  AboutComponentMock,
  AboutFeatureMock,
  AboutVersionRowMock
} from './about-ref11-data'
import {
  ABOUT_ACTIONS,
  ABOUT_COMPONENTS,
  ABOUT_FEATURES,
  ABOUT_LEGAL_LINKS,
  ABOUT_MODAL_CHIP,
  ABOUT_MODAL_SUMMARY,
  ABOUT_VERSION_ROWS
} from './about-ref11-data'
import { PROCESSING_NAV } from './processing-ref1-data'
import {
  TOOLS_ACTIVE_NAV,
  TOOLS_CARDS,
  TOOLS_STATUS_READY,
  TOOLS_STATUS_ROWS
} from './tools-ref10-data'
import { ToolsCardView, ToolsQuickActionsPanel, ToolsUtilityRail } from './tools-ref10-parts'

export function AboutToolsBackdrop(): JSX.Element {
  return (
    <div className="tools-shell about-scene__tools" aria-hidden>
      <aside className="tools-sidebar">
        <NeonSidebarBrand className="tools-sidebar__brand processing-sidebar__brand" />
        <section className="tools-sidebar__nav-block">
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
              >
                <span
                  className={`processing-nav__icon processing-nav__icon--${item.slug} processing-glyph`}
                />
                {item.label}
              </span>
            ))}
          </nav>
        </section>
      </aside>
      <div className="tools-main">
        <section className="tools-center">
          <header className="tools-center__head">
            <div className="tools-center__head-main">
              <p className="tools-center__eyebrow">Инструменты · hub</p>
              <h1>Инструменты</h1>
              <p>Набор профессиональных инструментов для обработки и автоматизации задач</p>
            </div>
          </header>
          <div className="tools-center__body">
            <div className="tools-center__grid">
              {TOOLS_CARDS.slice(0, 4).map((card) => (
                <ToolsCardView key={card.id} card={card} />
              ))}
            </div>
            <ToolsQuickActionsPanel />
          </div>
        </section>
        <footer className="tools-statusbar">
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
  )
}

function AboutFeatureTile(props: { feature: AboutFeatureMock }): JSX.Element {
  const { feature } = props
  return (
    <article className="about-feature">
      <span className={`about-glyph about-glyph--${feature.kind}`} aria-hidden />
      <strong>{feature.title}</strong>
      <span>{feature.hint}</span>
    </article>
  )
}

function AboutVersionRow(props: { row: AboutVersionRowMock }): JSX.Element {
  const { row } = props
  return (
    <div className="about-version-row">
      <span className={`about-glyph about-glyph--row about-glyph--row-${row.id}`} aria-hidden />
      <span className="about-version-row__label">{row.label}</span>
      <span className="about-version-row__value">
        {row.value}
        {row.kind === 'license-active' ? (
          <span className="about-version-row__dot" aria-label="Активна" />
        ) : null}
      </span>
    </div>
  )
}

function AboutComponentRow(props: { component: AboutComponentMock }): JSX.Element {
  const { component } = props
  return (
    <div className="about-component-row">
      <span
        className={`about-glyph about-glyph--comp about-glyph--comp-${component.id}`}
        aria-hidden
      />
      <div className="about-component-row__meta">
        <strong>{component.name}</strong>
        <span>{component.version}</span>
      </div>
      <span
        className={`about-component-row__status about-component-row__status--${component.status}`}
      >
        OK
      </span>
    </div>
  )
}

function AboutActionCard(props: { action: AboutActionMock }): JSX.Element {
  const { action } = props
  return (
    <button type="button" className="about-action-card vn-surface-glass" disabled>
      <span
        className={`about-glyph about-glyph--action about-glyph--action-${action.kind}`}
        aria-hidden
      />
      <strong>{action.title}</strong>
      <span>{action.hint}</span>
    </button>
  )
}

export function AboutModalPanel(): JSX.Element {
  return (
    <div className="about-modal" role="dialog" aria-labelledby="about-modal-title" id="ref11">
      <header className="about-modal__head">
        <div className="about-modal__head-main">
          <p className="about-modal__eyebrow">О программе · modal</p>
          <h2 id="about-modal-title">О ПРОГРАММЕ</h2>
          <p>Информация о системе и приложении</p>
        </div>
        <div className="about-modal__head-tools">
          <span className="about-modal__head-chip">{ABOUT_MODAL_CHIP}</span>
          <button type="button" className="about-modal__close" aria-label="Закрыть" disabled>
            ✕
          </button>
        </div>
      </header>
      <p className="about-modal__summary">{ABOUT_MODAL_SUMMARY}</p>

      <div className="about-modal__scroll">
        <div className="about-modal__body">
          <section className="about-modal__brand" aria-label="Velorix">
            <NeonBrandStacked className="about-modal__stacked-logo" />
            <p className="about-modal__tagline">MEDIA PROCESSING ENGINE</p>
            <span className="about-modal__badge">ПРОФЕССИОНАЛЬНАЯ ВЕРСИЯ</span>
            <p className="about-modal__desc">
              Velorix — профессиональный набор инструментов для обработки медиа, автоматизации задач
              и управления мультимедийными проектами.
            </p>
            <div className="about-modal__features">
              {ABOUT_FEATURES.map((feature) => (
                <AboutFeatureTile key={feature.id} feature={feature} />
              ))}
            </div>
            <p className="about-modal__copyright">
              © 2024 Velorix Technologies. Все права защищены.
            </p>
            <div className="about-modal__legal">
              {ABOUT_LEGAL_LINKS.map((link) => (
                <button key={link.id} type="button" className="about-modal__legal-link" disabled>
                  <span className="about-glyph about-glyph--external" aria-hidden />
                  {link.label}
                </button>
              ))}
            </div>
          </section>

          <section className="about-modal__info" aria-label="Системная информация">
            <article className="about-info-block vn-surface-glass">
              <h3>ИНФОРМАЦИЯ О ВЕРСИИ</h3>
              {ABOUT_VERSION_ROWS.map((row) => (
                <AboutVersionRow key={row.id} row={row} />
              ))}
            </article>
            <article className="about-info-block vn-surface-glass">
              <h3>ВСТРОЕННЫЕ КОМПОНЕНТЫ</h3>
              {ABOUT_COMPONENTS.map((component) => (
                <AboutComponentRow key={component.id} component={component} />
              ))}
            </article>
          </section>
        </div>
      </div>

      <footer className="about-modal__actions-sticky">
        <h3>ДЕЙСТВИЯ</h3>
        <div className="about-modal__action-grid">
          {ABOUT_ACTIONS.map((action) => (
            <AboutActionCard key={action.id} action={action} />
          ))}
        </div>
        <p className="about-modal__restart-note">
          <span className="about-glyph about-glyph--info" aria-hidden />
          После изменения настроек требуется перезапуск приложения
        </p>
      </footer>
    </div>
  )
}
