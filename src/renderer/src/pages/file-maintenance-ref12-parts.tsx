import type { JSX } from 'react'

import type {
  FileMaintenanceOperationMock,
  FileMaintenanceParamMock
} from './file-maintenance-ref12-data'
import {
  FM_ACTIVE_OPERATION,
  FM_BACKUP_NOTE,
  FM_MODAL_CHIP,
  FM_MODAL_SUMMARY,
  FM_FILE,
  FM_FILE_META,
  FM_INFO_ROWS,
  FM_OPERATIONS,
  FM_OUTPUT_PATH,
  FM_PARAMS
} from './file-maintenance-ref12-data'

function FileMaintenanceOperationCard(props: {
  operation: FileMaintenanceOperationMock
}): JSX.Element {
  const { operation } = props
  return (
    <button
      type="button"
      className={
        operation.active
          ? 'fm-op-card fm-op-card--active vn-surface-glass'
          : 'fm-op-card vn-surface-glass'
      }
      disabled
      aria-pressed={operation.active ?? false}
    >
      {operation.active ? (
        <span className="fm-glyph fm-glyph--check" aria-hidden />
      ) : (
        <span className={`fm-glyph fm-glyph--op fm-glyph--op-${operation.id}`} aria-hidden />
      )}
      <strong>{operation.title}</strong>
      <span>{operation.hint}</span>
    </button>
  )
}

function FileMaintenanceParamRow(props: { param: FileMaintenanceParamMock }): JSX.Element {
  const { param } = props
  return (
    <div className="fm-param-row">
      <span className={`fm-glyph fm-glyph--param fm-glyph--param-${param.id}`} aria-hidden />
      <span className="fm-param-row__label">{param.label}</span>
      <span className={`fm-toggle ${param.on ? 'fm-toggle--on' : ''}`} aria-hidden />
    </div>
  )
}

export function FileMaintenanceModalPanel(): JSX.Element {
  return (
    <div className="fm-modal" role="dialog" aria-labelledby="fm-modal-title" id="ref12">
      <header className="fm-modal__head">
        <div className="fm-modal__title-wrap">
          <span className="fm-glyph fm-glyph--header" aria-hidden />
          <div className="fm-modal__head-main">
            <p className="fm-modal__eyebrow">Файлы · maintenance</p>
            <h2 id="fm-modal-title">ОБСЛУЖИВАНИЕ ФАЙЛОВ</h2>
            <p>Диагностика и восстановление медиафайлов</p>
          </div>
        </div>
        <div className="fm-modal__head-tools">
          <span className="fm-modal__head-chip">{FM_MODAL_CHIP}</span>
          <button type="button" className="fm-modal__close" aria-label="Закрыть" disabled>
            ✕
          </button>
        </div>
      </header>
      <p className="fm-modal__summary">{FM_MODAL_SUMMARY}</p>

      <section className="fm-file-card vn-surface-glass" aria-label="Выбранный файл">
        <div className="fm-file-card__visual" aria-hidden />
        <div className="fm-file-card__meta">
          <strong>{FM_FILE.name}</strong>
          <span>{FM_FILE.path}</span>
        </div>
        <button type="button" className="vn-btn vn-btn--secondary fm-file-card__pick" disabled>
          Выбрать файл
        </button>
        <dl className="fm-file-card__stats">
          {FM_FILE_META.map((item) => (
            <div key={item.id} className="fm-file-card__stat">
              <span className={`fm-glyph fm-glyph--meta fm-glyph--meta-${item.id}`} aria-hidden />
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="fm-modal__scroll">
        <div className="fm-modal__body">
          <section className="fm-modal__ops" aria-label="Операции">
            {FM_OPERATIONS.map((operation) => (
              <FileMaintenanceOperationCard key={operation.id} operation={operation} />
            ))}
          </section>

          <section className="fm-modal__center vn-surface-glass" aria-label="Параметры">
            <header className="fm-modal__center-head">
              <h3>{FM_ACTIVE_OPERATION.title}</h3>
              <p>{FM_ACTIVE_OPERATION.hint}</p>
            </header>
            <h4>ПАРАМЕТРЫ ОПЕРАЦИИ</h4>
            <div className="fm-param-list">
              {FM_PARAMS.map((param) => (
                <FileMaintenanceParamRow key={param.id} param={param} />
              ))}
            </div>
          </section>

          <aside className="fm-modal__info vn-surface-glass" aria-label="Информация">
            {FM_INFO_ROWS.map((row) => (
              <div key={row.id} className="fm-info-row">
                <span className="fm-info-row__label">{row.label}</span>
                <span
                  className={
                    row.tone === 'low-risk'
                      ? 'fm-info-row__value fm-info-row__value--low-risk'
                      : 'fm-info-row__value'
                  }
                >
                  {row.value}
                </span>
              </div>
            ))}
            <p className="fm-modal__backup">
              <span className="fm-glyph fm-glyph--shield" aria-hidden />
              {FM_BACKUP_NOTE}
            </p>
          </aside>
        </div>
      </div>

      <footer className="fm-modal__foot-sticky">
        <label className="fm-output">
          <span>ВЫХОДНОЙ ФАЙЛ</span>
          <div className="fm-output__row">
            <input className="vn-input" type="text" value={FM_OUTPUT_PATH} readOnly disabled />
            <button type="button" className="vn-btn vn-btn--secondary" disabled>
              Обзор…
            </button>
          </div>
        </label>
        <div className="fm-modal__actions">
          <button type="button" className="vn-btn vn-btn--secondary" disabled>
            Показать лог
          </button>
          <button type="button" className="vn-btn vn-btn--primary fm-modal__run" disabled>
            <span className="fm-glyph fm-glyph--run" aria-hidden />
            ЗАПУСТИТЬ OPERATION
          </button>
        </div>
      </footer>
    </div>
  )
}
