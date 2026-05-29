import type { JSX } from 'react'

import type { Kit26Section, Kit26SectionKind } from './ref26-states-sections-data'
import { KIT26_SECTIONS } from './ref26-states-sections-data'

const STATE_LABELS = ['default', 'hover', 'active', 'focus', 'disabled'] as const

function Kit26SectionBody(props: { kind: Kit26SectionKind }): JSX.Element {
  const { kind } = props
  if (kind === 'buttons-states') {
    return (
      <div className="ks-state-row">
        {STATE_LABELS.map((state) => (
          <div key={state} className={`ks-state-cell ks-state-cell--${state}`}>
            <div className="ks-demo-row">
              <button type="button" className="vn-btn vn-btn--primary ks-btn--compact" disabled>
                OK
              </button>
              <button type="button" className="vn-btn vn-btn--secondary ks-btn--compact" disabled>
                Alt
              </button>
            </div>
            <span className="ks-state-cell__label">{state}</span>
          </div>
        ))}
      </div>
    )
  }
  if (kind === 'inputs-states') {
    return (
      <div className="ks-state-row">
        <div className="ks-state-cell">
          <input className="vn-input" type="text" defaultValue="Default" readOnly disabled />
          <span className="ks-state-cell__label">default</span>
        </div>
        <div className="ks-state-cell ks-state-cell--focus">
          <input
            className="vn-input ks-input--focus"
            type="text"
            defaultValue="Focus"
            readOnly
            disabled
          />
          <span className="ks-state-cell__label">focus</span>
        </div>
        <div className="ks-state-cell">
          <input
            className="vn-input vn-input--error"
            type="text"
            defaultValue="Error"
            readOnly
            disabled
          />
          <span className="ks-state-cell__label">error</span>
        </div>
        <div className="ks-state-cell ks-state-cell--disabled">
          <input
            className="vn-input ks-input--muted"
            type="text"
            placeholder="Disabled"
            disabled
            readOnly
          />
          <span className="ks-state-cell__label">disabled</span>
        </div>
      </div>
    )
  }
  if (kind === 'dropdown-states') {
    return (
      <div className="ks-state-row">
        <div className="ks-state-cell">
          <span className="vn-input ks-demo-select">Default ▾</span>
          <span className="ks-state-cell__label">closed</span>
        </div>
        <div className="ks-state-cell ks-state-cell--focus">
          <span className="vn-input ks-demo-select ks-input--focus">Open ▾</span>
          <span className="ks-state-cell__label">open</span>
        </div>
      </div>
    )
  }
  if (kind === 'checkbox-states') {
    return (
      <div className="ks-state-row">
        <label className="ks-check">
          <input type="checkbox" disabled readOnly />
          Off
        </label>
        <label className="ks-check">
          <input type="checkbox" defaultChecked disabled readOnly />
          On
        </label>
      </div>
    )
  }
  if (kind === 'toggle-states') {
    return (
      <div className="ks-state-row">
        <div className="ks-state-cell">
          <span className="pl-toggle" aria-hidden />
          <span className="ks-state-cell__label">off</span>
        </div>
        <div className="ks-state-cell ks-state-cell--active">
          <span className="pl-toggle pl-toggle--on" aria-hidden />
          <span className="ks-state-cell__label">on</span>
        </div>
      </div>
    )
  }
  if (kind === 'cards-states') {
    return (
      <div className="ks-state-row">
        <article className="ks-media-card">
          <span className="ks-media-card__thumb" aria-hidden />
          Default
        </article>
        <article className="ks-media-card ks-media-card--hover">
          <span className="ks-media-card__thumb" aria-hidden />
          Hover
        </article>
        <article className="ks-media-card ks-media-card--selected">
          <span className="ks-media-card__thumb" aria-hidden />
          Selected
        </article>
        <article className="ks-media-card ks-media-card--disabled">
          <span className="ks-media-card__thumb" aria-hidden />
          Disabled
        </article>
      </div>
    )
  }
  if (kind === 'progress') {
    return (
      <div className="ks-demo-stack">
        <div
          className="vn-progress"
          role="progressbar"
          aria-valuenow={25}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="vn-progress__fill" style={{ width: '25%' }} />
        </div>
        <div
          className="vn-progress"
          role="progressbar"
          aria-valuenow={75}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="vn-progress__fill" style={{ width: '75%' }} />
        </div>
        <span className="ks-ring-progress ks-ring-progress--sm">45%</span>
      </div>
    )
  }
  if (kind === 'loaders') {
    return (
      <div className="ks-state-row">
        <div className="ks-state-cell">
          <span className="ks-spinner ks-spinner--spin" aria-hidden />
          <span className="ks-state-cell__label">spin</span>
        </div>
        <div className="ks-state-cell">
          <span className="ks-dots" aria-hidden />
          <span className="ks-state-cell__label">dots</span>
        </div>
        <div className="ks-state-cell">
          <span className="ks-bar-loader" aria-hidden />
          <span className="ks-state-cell__label">bar</span>
        </div>
      </div>
    )
  }
  if (kind === 'skeleton') {
    return (
      <div className="ks-skeleton ks-skeleton--shimmer">
        <span />
        <span />
        <span className="ks-skeleton__block" />
      </div>
    )
  }
  if (kind === 'context-menu') {
    return (
      <ul className="ks-menu">
        <li className="ks-menu__item">Открыть</li>
        <li className="ks-menu__item">Переименовать</li>
        <li className="ks-menu__item ks-menu__danger">Удалить</li>
      </ul>
    )
  }
  if (kind === 'dropzone') {
    return (
      <div className="ks-dropzone ks-dropzone--compact ks-dropzone--active">
        <span className="ks-dropzone__icon" aria-hidden />
        <p>Перетащите файлы сюда</p>
        <span className="ks-dropzone__file">clip_001.mp4 · + Копирование</span>
      </div>
    )
  }
  if (kind === 'result-icons') {
    return (
      <div className="ks-state-row">
        <div className="ks-result ks-result--ok">
          <span aria-hidden>✓</span>
          <p>Файлы добавлены</p>
        </div>
        <div className="ks-result ks-result--err">
          <span aria-hidden>✕</span>
          <p>Ошибка загрузки</p>
        </div>
      </div>
    )
  }
  if (kind === 'timeline-states') {
    return (
      <div className="ks-timeline-demo">
        <div className="ks-timeline-demo__ruler" aria-hidden />
        <div className="ks-timeline">
          <span className="ks-timeline__clip">Default</span>
          <span className="ks-timeline__clip ks-timeline__clip--hover">Hover</span>
          <span className="ks-timeline__clip ks-timeline__clip--active">Selected</span>
        </div>
        <span className="ks-timeline-demo__playhead" aria-hidden />
      </div>
    )
  }
  if (kind === 'tooltip') {
    return (
      <div className="ks-tooltip ks-tooltip--arrow">
        <strong>Подсказка</strong>
        <span>Краткое описание элемента интерфейса.</span>
      </div>
    )
  }
  if (kind === 'search-states') {
    return (
      <div className="ks-demo-stack ks-search-demo">
        <span className="vn-input">Поиск…</span>
        <span className="vn-input ks-input--focus">Поиск с фокусом</span>
        <span className="vn-input vn-input--error">Нет результатов</span>
      </div>
    )
  }
  if (kind === 'modal-states') {
    return (
      <div className="ks-modal-mock ks-modal-mock--danger">
        <span className="ks-modal-mock__icon" aria-hidden />
        <strong>Удалить проект?</strong>
        <p>Действие необратимо.</p>
        <div className="ks-demo-row ks-modal-mock__actions">
          <button type="button" className="vn-btn vn-btn--secondary ks-btn--compact" disabled>
            Отмена
          </button>
          <button type="button" className="vn-btn vn-btn--danger ks-btn--compact" disabled>
            Удалить
          </button>
        </div>
      </div>
    )
  }
  if (kind === 'command-palette') {
    return (
      <div className="ks-palette ks-palette--panel">
        <span className="vn-input ks-input--focus">⌘ Команда…</span>
        <ul>
          <li className="ks-palette__item ks-palette__item--active">
            <span>Новый проект</span>
            <em>Ctrl+N</em>
          </li>
          <li className="ks-palette__item">
            <span>Открыть проект</span>
            <em>Ctrl+O</em>
          </li>
        </ul>
      </div>
    )
  }
  if (kind === 'player-states') {
    return (
      <div className="ks-player">
        <div className="ks-player__transport">
          <button type="button" className="ks-player__play" disabled aria-label="Play" />
          <span className="ks-player__tc">00:12:04 / 02:35:48</span>
        </div>
        <div className="ks-player__seek ks-player__seek--42">
          <span className="ks-player__seek-fill" />
          <span className="ks-player__seek-thumb" aria-hidden />
        </div>
      </div>
    )
  }
  if (kind === 'export-stages') {
    return (
      <ul className="ks-stages">
        <li className="ks-stages__done">Рендеринг · 78%</li>
        <li className="ks-stages__run">Подготовка</li>
        <li className="ks-stages__err">Ошибка кодека</li>
      </ul>
    )
  }
  if (kind === 'sidebar-active') {
    return (
      <div className="ks-sidebar-demo-row">
        <span className="processing-nav__item ks-sidebar-demo">
          <span
            className="processing-nav__icon processing-nav__icon--downloads processing-glyph"
            aria-hidden
          />
          Загрузки
        </span>
        <span className="processing-nav__item processing-nav__item--active ks-sidebar-demo">
          <span
            className="processing-nav__icon processing-nav__icon--tools processing-glyph"
            aria-hidden
          />
          Инструменты
        </span>
      </div>
    )
  }
  if (kind === 'slider-states') {
    return (
      <div className="ks-demo-stack">
        <div className="ks-slider" aria-hidden>
          <span className="ks-slider__fill" style={{ width: '35%' }} />
        </div>
        <div className="ks-slider ks-slider--62" aria-hidden>
          <span className="ks-slider__fill" />
          <span className="ks-slider__thumb" />
        </div>
      </div>
    )
  }
  if (kind === 'badge-states') {
    return (
      <div className="ks-demo-row">
        <span className="vn-badge vn-badge--ready">
          <span className="ks-badge-dot ks-badge-dot--ok" aria-hidden />
          Готово
        </span>
        <span className="vn-badge vn-badge--processing">
          <span className="ks-badge-dot ks-badge-dot--proc" aria-hidden />
          Обработка
        </span>
        <span className="vn-badge vn-badge--error">
          <span className="ks-badge-dot ks-badge-dot--err" aria-hidden />
          Ошибка
        </span>
      </div>
    )
  }
  if (kind === 'toast-states') {
    return (
      <div className="ks-demo-stack">
        <div className="ks-toast ks-toast--ok">
          <span className="ks-toast__stripe" aria-hidden />
          Сохранено
        </div>
        <div className="ks-toast ks-toast--err">
          <span className="ks-toast__stripe" aria-hidden />
          Сбой экспорта
        </div>
      </div>
    )
  }
  if (kind === 'tabs-states') {
    return (
      <div className="ks-tabs" role="tablist">
        <span className="ks-tabs__item">Idle</span>
        <span className="ks-tabs__item ks-tabs__item--active">Active</span>
        <span className="ks-tabs__item ks-tabs__item--disabled">Disabled</span>
      </div>
    )
  }
  if (kind === 'focus-states') {
    return (
      <div className="ks-demo-stack">
        <input
          className="vn-input ks-input--focus"
          type="text"
          defaultValue="Focus ring"
          readOnly
          disabled
        />
        <button type="button" className="vn-btn vn-btn--primary ks-focus-demo" disabled>
          Focus ring
        </button>
      </div>
    )
  }
  if (kind === 'empty-state') {
    return (
      <div className="ks-empty-state">
        <span className="ks-empty-state__icon" aria-hidden />
        <p>Нет элементов для отображения</p>
        <button type="button" className="vn-btn vn-btn--secondary ks-btn--compact" disabled>
          Добавить
        </button>
      </div>
    )
  }
  if (kind === 'list-hover') {
    return <div className="ks-list-row ks-list-row--hover">Строка · hover</div>
  }
  if (kind === 'list-active') {
    return <div className="ks-list-row ks-list-row--active">Строка · active</div>
  }
  if (kind === 'list-disabled') {
    return <div className="ks-list-row ks-list-row--disabled">Строка · disabled</div>
  }
  if (kind === 'panel-collapse') {
    return (
      <div className="ks-demo-stack">
        <header className="ks-panel-head">
          <strong>Панель свойств</strong>
          <span className="ks-panel-head__chev" aria-hidden>
            ▾
          </span>
        </header>
        <header className="ks-panel-head ks-panel-head--collapsed">
          <strong>Эффекты</strong>
          <span className="ks-panel-head__chev" aria-hidden>
            ▾
          </span>
        </header>
      </div>
    )
  }
  if (kind === 'motion-hint') {
    return (
      <p className="ks-motion-hint">
        transition: var(--vn-transition-colors) · duration: var(--vn-duration-fast)
      </p>
    )
  }
  return <p className="ks-empty">—</p>
}

export function Kit26SectionCard(props: { section: Kit26Section }): JSX.Element {
  const { section } = props
  const wideClass = section.wide ? ' ks-section--wide' : ''
  return (
    <section
      className={`ks-section vn-surface-glass${wideClass}`}
      aria-labelledby={`kit26-${section.num}`}
    >
      <h2 id={`kit26-${section.num}`}>
        <em>{section.num}</em> {section.title}
      </h2>
      <Kit26SectionBody kind={section.kind} />
    </section>
  )
}

export function Kit26SectionsGrid(): JSX.Element {
  return (
    <div className="ks-grid">
      {KIT26_SECTIONS.map((section) => (
        <Kit26SectionCard key={section.num} section={section} />
      ))}
    </div>
  )
}
