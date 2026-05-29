import type { JSX } from 'react'

import {
  EPN_CATEGORY,
  EPN_FILES,
  EPN_INFO_ROWS,
  EPN_MODAL_CHIP,
  EPN_MODAL_SUMMARY,
  EPN_NAME_COUNT,
  EPN_PRESET_NAME,
  EPN_PRESET_TILES
} from './export-preset-ref18-data'
import { PROCESSING_NAV } from './processing-ref1-data'
import { TOOLS_ACTIVE_NAV } from './tools-ref10-data'

export function ExportPresetConversionBackdrop(): JSX.Element {
  return (
    <div className="epn-backdrop tools-shell" aria-hidden>
      <aside className="tools-sidebar">
        <div className="tools-sidebar__brand">
          <span className="processing-sidebar__mark">V</span>
          <div className="processing-sidebar__brand-text">
            <div className="processing-sidebar__logo vn-text-gradient">VELORIX</div>
          </div>
          <span className="processing-sidebar__brand-edition">PRO</span>
        </div>
        <nav className="processing-nav tools-sidebar__nav-block">
          {PROCESSING_NAV.slice(0, 6).map((item) => (
            <span
              key={item.slug}
              className={
                item.slug === TOOLS_ACTIVE_NAV
                  ? 'processing-nav__item processing-nav__item--active'
                  : 'processing-nav__item'
              }
            >
              {item.label}
            </span>
          ))}
        </nav>
      </aside>
      <div className="tools-main epn-backdrop__main">
        <section className="epn-backdrop__center">
          <h1 className="epn-backdrop__title">Конвертация видео</h1>
          <ul className="epn-backdrop__files">
            {EPN_FILES.map((file) => (
              <li
                key={file.id}
                className={
                  'selected' in file && file.selected
                    ? 'vn-surface-glass epn-backdrop__file--selected'
                    : 'vn-surface-glass'
                }
              >
                <strong>{file.name}</strong>
                <span>{file.meta}</span>
              </li>
            ))}
          </ul>
          <div className="epn-backdrop__presets">
            {EPN_PRESET_TILES.map((tile) => (
              <span
                key={tile.id}
                className={
                  'active' in tile && tile.active
                    ? 'epn-backdrop__tile epn-backdrop__tile--active vn-surface-glass'
                    : 'epn-backdrop__tile vn-surface-glass'
                }
              >
                {tile.label}
              </span>
            ))}
          </div>
          <button type="button" className="vn-btn vn-btn--primary epn-backdrop__convert" disabled>
            КОНВЕРТИРОВАТЬ (3)
          </button>
        </section>
        <aside className="epn-backdrop__settings vn-surface-glass">
          <span>Формат вывода: MP4 H.264 ▾</span>
          <span>Качество: High ▾</span>
        </aside>
      </div>
    </div>
  )
}

export function ExportPresetNameModal(): JSX.Element {
  return (
    <div className="epn-modal" role="dialog" aria-labelledby="epn-modal-title" id="ref18">
      <header className="epn-modal__head">
        <div className="epn-modal__head-main">
          <p className="epn-modal__eyebrow">Экспорт · preset</p>
          <h2 id="epn-modal-title">ИМЯ ПРЕСЕТА ЭКСПОРТА</h2>
          <p>Сохранение настроек экспорта как пользовательского пресета</p>
        </div>
        <div className="epn-modal__head-tools">
          <span className="epn-modal__head-chip">{EPN_MODAL_CHIP}</span>
          <button type="button" className="epn-modal__close" aria-label="Закрыть" disabled>
            ✕
          </button>
        </div>
      </header>
      <p className="epn-modal__summary">{EPN_MODAL_SUMMARY}</p>

      <div className="epn-modal__scroll">
        <label className="epn-field">
          <span>Имя пресета</span>
          <input className="vn-input" type="text" value={EPN_PRESET_NAME} readOnly disabled />
          <em>
            {EPN_NAME_COUNT.current}/{EPN_NAME_COUNT.max}
          </em>
        </label>

        <label className="epn-field">
          <span>КАТЕГОРИЯ</span>
          <span className="vn-input epn-field__select">{EPN_CATEGORY} ▾</span>
        </label>

        <label className="epn-check">
          <input type="checkbox" defaultChecked disabled readOnly />
          Перезаписать существующий пресет
        </label>

        <section className="epn-info vn-surface-glass" aria-label="Параметры пресета">
          <h3>Информация о пресете</h3>
          <dl className="epn-info__grid">
            {EPN_INFO_ROWS.map((row, index) => (
              <div
                key={row.id}
                className={index === 1 ? 'epn-info__row epn-info__row--selected' : 'epn-info__row'}
              >
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <footer className="epn-modal__actions-sticky">
        <button type="button" className="vn-btn vn-btn--secondary epn-modal__cancel" disabled>
          <span className="epn-glyph epn-glyph--cancel" aria-hidden />
          Отмена
        </button>
        <button type="button" className="vn-btn vn-btn--primary" disabled>
          <span className="epn-glyph epn-glyph--save" aria-hidden />
          Сохранить пресет
        </button>
      </footer>
    </div>
  )
}
