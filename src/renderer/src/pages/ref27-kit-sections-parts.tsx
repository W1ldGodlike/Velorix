import type { JSX } from 'react'

import type { Kit27Section, Kit27SectionKind } from './ref27-kit-sections-data'
import { KIT27_SECTIONS } from './ref27-kit-sections-data'

const TABLE_ROWS = [
  { name: 'Project 001', status: 'ready' as const, size: '246 GB' },
  { name: 'Project 002', status: 'processing' as const, size: '18.8 GB' },
  { name: 'Project 003', status: 'error' as const, size: '8.7 GB' }
]

function Kit27SectionBody(props: { kind: Kit27SectionKind }): JSX.Element {
  const { kind } = props
  if (kind === 'buttons') {
    return (
      <div className="ks-demo-stack">
        <div className="ks-demo-row">
          <button type="button" className="vn-btn vn-btn--primary" disabled>
            Primary
          </button>
          <button type="button" className="vn-btn vn-btn--secondary" disabled>
            Secondary
          </button>
          <button type="button" className="vn-btn vn-btn--danger" disabled>
            Danger
          </button>
        </div>
        <div className="ks-demo-row">
          <button type="button" className="vn-btn vn-btn--primary ks-btn--compact" disabled>
            Экспорт
          </button>
          <button type="button" className="vn-btn vn-btn--secondary ks-btn--compact" disabled>
            Отмена
          </button>
          <span className="ks-icon-btn" aria-hidden title="Icon button" />
        </div>
      </div>
    )
  }
  if (kind === 'inputs') {
    return (
      <div className="ks-demo-stack">
        <input className="vn-input" type="text" defaultValue="Default" readOnly disabled />
        <input
          className="vn-input ks-input--focus"
          type="text"
          defaultValue="Focus"
          readOnly
          disabled
        />
        <input
          className="vn-input vn-input--error"
          type="text"
          defaultValue="Error"
          readOnly
          disabled
        />
        <input
          className="vn-input vn-input--success"
          type="text"
          defaultValue="Success"
          readOnly
          disabled
        />
        <input
          className="vn-input ks-input--muted"
          type="text"
          placeholder="Disabled"
          disabled
          readOnly
        />
      </div>
    )
  }
  if (kind === 'dropdown') {
    return <span className="vn-input ks-demo-select">Пресет экспорта ▾</span>
  }
  if (kind === 'checkboxes') {
    return (
      <label className="ks-check">
        <input type="checkbox" defaultChecked disabled readOnly />
        Сохранить настройки
      </label>
    )
  }
  if (kind === 'radio') {
    return (
      <div className="ks-demo-row">
        <label className="ks-check">
          <input type="radio" name="ks-radio" defaultChecked disabled readOnly />
          MP4
        </label>
        <label className="ks-check">
          <input type="radio" name="ks-radio" disabled readOnly />
          MKV
        </label>
      </div>
    )
  }
  if (kind === 'slider') {
    return (
      <div className="ks-slider ks-slider--62" aria-hidden>
        <span className="ks-slider__fill" />
        <span className="ks-slider__thumb" />
      </div>
    )
  }
  if (kind === 'badges') {
    return (
      <div className="ks-demo-stack">
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
        <div className="ks-demo-row">
          <span className="ks-pill ks-pill--warn">Предупреждение</span>
          <span className="ks-pill ks-pill--ok">4K ULTRA</span>
        </div>
      </div>
    )
  }
  if (kind === 'toasts') {
    return (
      <div className="ks-demo-stack">
        <div className="ks-toast ks-toast--ok">
          <span className="ks-toast__stripe" aria-hidden />
          Экспорт завершён успешно
        </div>
        <div className="ks-toast ks-toast--warn">
          <span className="ks-toast__stripe" aria-hidden />
          Проверьте настройки GPU
        </div>
        <div className="ks-toast ks-toast--err">
          <span className="ks-toast__stripe" aria-hidden />
          Ошибка FFmpeg
        </div>
      </div>
    )
  }
  if (kind === 'avatars') {
    return (
      <div className="ks-demo-row ks-demo-row--avatars">
        <span className="ks-avatar">V</span>
        <span className="ks-avatar ks-avatar--accent ks-avatar--ring">AD</span>
        <span className="ks-avatar ks-avatar--add">+</span>
        <span className="ks-presence">
          <span className="ks-dot ks-dot--on" aria-hidden />
          online
        </span>
        <span className="ks-presence">
          <span className="ks-dot ks-dot--away" aria-hidden />
          away
        </span>
        <span className="ks-presence">
          <span className="ks-dot ks-dot--busy" aria-hidden />
          busy
        </span>
      </div>
    )
  }
  if (kind === 'table') {
    return (
      <table className="ks-table">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Статус</th>
            <th>Размер</th>
          </tr>
        </thead>
        <tbody>
          {TABLE_ROWS.map((row) => (
            <tr
              key={row.name}
              className={row.name === 'Project 002' ? 'ks-table__row--sel' : undefined}
            >
              <td>{row.name}</td>
              <td>
                <span className={`vn-badge vn-badge--${row.status}`}>
                  {row.status === 'ready'
                    ? 'Готово'
                    : row.status === 'error'
                      ? 'Ошибка'
                      : 'Обработка'}
                </span>
              </td>
              <td>{row.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  if (kind === 'tree') {
    return (
      <ul className="ks-tree">
        <li className="ks-tree__folder">▾ Проекты</li>
        <li className="ks-tree__active ks-tree__indent">Подпапка 01</li>
        <li className="ks-tree__indent">Сезон 2026</li>
        <li className="ks-tree__indent ks-tree__muted">Архив</li>
      </ul>
    )
  }
  if (kind === 'context-menu') {
    return (
      <ul className="ks-menu">
        <li className="ks-menu__item">Открыть</li>
        <li className="ks-menu__item">Дублировать</li>
        <li className="ks-menu__sep" aria-hidden />
        <li className="ks-menu__item ks-menu__danger">Удалить</li>
      </ul>
    )
  }
  if (kind === 'tooltip') {
    return (
      <div className="ks-tooltip ks-tooltip--arrow">
        <strong>Температура GPU</strong>
        <span>71°C · лимит 83°C</span>
      </div>
    )
  }
  if (kind === 'modal') {
    return (
      <div className="ks-modal-mock ks-modal-mock--danger">
        <span className="ks-modal-mock__icon" aria-hidden />
        <strong>Удалить проект?</strong>
        <p>Действие необратимо. Файлы останутся в корзине 30 дней.</p>
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
  if (kind === 'modal-loading') {
    return (
      <div className="ks-modal-mock ks-modal-mock--center ks-modal-mock--loading">
        <div className="ks-ring-progress ks-ring-progress--spin" aria-hidden>
          76%
        </div>
        <p>Экспорт видео…</p>
        <span className="ks-modal-mock__hint">H.264 · 3840×2160 · NVENC</span>
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
  if (kind === 'dropzone') {
    return (
      <div className="ks-dropzone ks-dropzone--active">
        <span className="ks-dropzone__icon" aria-hidden />
        <p>Перетащите файлы сюда</p>
        <span className="ks-dropzone__file">video_final_v2.mp4</span>
      </div>
    )
  }
  if (kind === 'drag-states') {
    return (
      <div className="ks-demo-row">
        <span className="ks-pill ks-pill--ok">Можно отпустить</span>
        <span className="ks-pill ks-pill--err">Нельзя отпустить</span>
        <span className="ks-pill ks-pill--proc">Перемещение…</span>
      </div>
    )
  }
  if (kind === 'command-palette') {
    return (
      <div className="ks-palette ks-palette--panel">
        <span className="vn-input ks-input--focus">⌘ Введите команду…</span>
        <ul>
          <li className="ks-palette__item ks-palette__item--active">
            <span>Новый проект</span>
            <em>Ctrl+N</em>
          </li>
          <li className="ks-palette__item">
            <span>Открыть проект</span>
            <em>Ctrl+O</em>
          </li>
          <li className="ks-palette__item">
            <span>Начать экспорт</span>
            <em>Ctrl+E</em>
          </li>
        </ul>
      </div>
    )
  }
  if (kind === 'player') {
    return (
      <div className="ks-player">
        <div className="ks-player__transport">
          <button type="button" className="ks-player__play" disabled aria-label="Play" />
          <span className="ks-player__tc">01:24:15 / 02:35:48</span>
        </div>
        <div className="ks-player__seek ks-player__seek--42">
          <span className="ks-player__seek-fill" />
          <span className="ks-player__seek-thumb" aria-hidden />
        </div>
      </div>
    )
  }
  if (kind === 'timeline') {
    return (
      <div className="ks-timeline-demo">
        <div className="ks-timeline-demo__ruler" aria-hidden />
        <div className="ks-timeline">
          <span className="ks-timeline__clip">Клип A</span>
          <span className="ks-timeline__clip ks-timeline__clip--active">Клип B</span>
          <span className="ks-timeline__clip ks-timeline__clip--ghost">Dragging</span>
        </div>
        <span className="ks-timeline-demo__playhead" aria-hidden />
      </div>
    )
  }
  if (kind === 'dropdown-open') {
    return (
      <div className="ks-dropdown-open">
        <button type="button" className="vn-btn vn-btn--secondary ks-btn--compact" disabled>
          Действия ▾
        </button>
        <ul className="ks-menu ks-menu--open">
          <li className="ks-menu__item">Новая папка</li>
          <li className="ks-menu__item">Импорт медиа</li>
          <li className="ks-menu__item">Создать прокси</li>
        </ul>
      </div>
    )
  }
  if (kind === 'tabs') {
    return (
      <div className="ks-tabs" role="tablist">
        <span className="ks-tabs__item ks-tabs__item--active">Обзор</span>
        <span className="ks-tabs__item">Сравнение</span>
        <span className="ks-tabs__item">GPU</span>
        <span className="ks-tabs__item">Логи</span>
      </div>
    )
  }
  if (kind === 'breadcrumbs') {
    return (
      <nav className="ks-crumb" aria-label="Крошки">
        <a href="#ref27">Проект</a>
        <span className="ks-crumb__sep">/</span>
        <a href="#ref27">Медиа</a>
        <span className="ks-crumb__sep">/</span>
        <strong>Экспорт</strong>
      </nav>
    )
  }
  if (kind === 'typography') {
    return (
      <div className="ks-type">
        <strong className="ks-type__xl vn-text-gradient">VELORIX</strong>
        <span className="ks-type__lg">Заголовок экрана</span>
        <span className="ks-type__md">Подзаголовок секции</span>
        <span className="ks-type__sm">Вторичный текст и подписи</span>
        <code className="ks-type__mono">01:36:53:08 · FFmpeg</code>
      </div>
    )
  }
  if (kind === 'spacing') {
    return (
      <div className="ks-spacing">
        <span className="ks-spacing__chip ks-spacing__chip--1">8</span>
        <span className="ks-spacing__chip ks-spacing__chip--2">12</span>
        <span className="ks-spacing__chip ks-spacing__chip--3">16</span>
        <span className="ks-spacing__chip ks-spacing__chip--4">24</span>
      </div>
    )
  }
  if (kind === 'colors') {
    return (
      <div className="ks-swatches">
        <span className="ks-swatch-wrap">
          <span className="ks-swatch ks-swatch--purple" title="Magenta" />
          <em>Magenta</em>
        </span>
        <span className="ks-swatch-wrap">
          <span className="ks-swatch ks-swatch--cyan" title="Cyan" />
          <em>Cyan</em>
        </span>
        <span className="ks-swatch-wrap">
          <span className="ks-swatch ks-swatch--green" title="Matrix" />
          <em>Matrix</em>
        </span>
        <span className="ks-swatch-wrap">
          <span className="ks-swatch ks-swatch--red" title="Danger" />
          <em>Danger</em>
        </span>
        <span className="ks-swatch-wrap">
          <span className="ks-swatch ks-swatch--void" title="Void" />
          <em>Void</em>
        </span>
      </div>
    )
  }
  if (kind === 'icons-line') {
    return (
      <div className="ks-icon-row">
        <span
          className="ks-icon-cell processing-tool-glyph processing-tool-glyph--blade processing-glyph"
          aria-hidden
        />
        <span
          className="ks-icon-cell processing-tool-glyph processing-tool-glyph--link processing-glyph"
          aria-hidden
        />
        <span
          className="ks-icon-cell processing-chrome-glyph processing-chrome-glyph--search processing-glyph"
          aria-hidden
        />
        <span className="ks-icon-cell processing-volume-glyph processing-glyph" aria-hidden />
      </div>
    )
  }
  if (kind === 'statusbar') {
    return (
      <footer className="tools-statusbar ks-statusbar-demo">
        <span className="ks-statusbar-demo__ready">
          <span className="ks-badge-dot ks-badge-dot--ok" aria-hidden />
          Готово
        </span>
        <span className="ks-statusbar-demo__meta">
          НОВЫЙ СЕЗОН.vlxr · <em className="ks-statusbar-demo__tc">01:36:53:08</em> · 4K
        </span>
        <span className="ks-statusbar-demo__engines">FFmpeg 6.1.1 · RTX 4090</span>
      </footer>
    )
  }
  if (kind === 'brand') {
    return (
      <div className="ks-brand">
        <span className="ks-brand__mark processing-sidebar__mark">V</span>
        <div className="ks-brand__text">
          <span className="processing-sidebar__logo vn-text-gradient">VELORIX</span>
          <span className="ks-brand__tag">PRO</span>
        </div>
      </div>
    )
  }
  if (kind === 'search') {
    return (
      <div className="ks-demo-stack ks-search-demo">
        <span className="vn-input">Поиск…</span>
        <span className="vn-input ks-input--focus">Project 001</span>
        <span className="vn-input vn-input--error">Нет результатов</span>
      </div>
    )
  }
  return <p className="ks-empty">—</p>
}

export function Kit27SectionCard(props: { section: Kit27Section }): JSX.Element {
  const { section } = props
  const wideClass = section.wide ? ' ks-section--wide' : ''
  return (
    <section
      className={`ks-section vn-surface-glass${wideClass}`}
      aria-labelledby={`kit27-${section.num}`}
    >
      <h2 id={`kit27-${section.num}`}>
        <em>{section.num}</em> {section.title}
      </h2>
      <Kit27SectionBody kind={section.kind} />
    </section>
  )
}

export function Kit27SectionsGrid(): JSX.Element {
  return (
    <div className="ks-grid">
      {KIT27_SECTIONS.map((section) => (
        <Kit27SectionCard key={section.num} section={section} />
      ))}
    </div>
  )
}
