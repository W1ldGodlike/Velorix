import type { JSX } from 'react'

import type { FfmpegErrorActionMock } from './ffmpeg-error-ref22-data'
import {
  FE_ACTIONS,
  FE_DETAIL_ROWS,
  FE_ERROR_CODE,
  FE_LOG_LINES,
  FE_MODAL_CHIP,
  FE_MODAL_SUMMARY,
  FE_POSSIBLE_CAUSES,
  FE_STARTUP_MESSAGE
} from './ffmpeg-error-ref22-data'
import { QuitConfirmProcessingBackdrop } from './quit-confirm-ref21-parts'

function FfmpegErrorActionCard(props: { action: FfmpegErrorActionMock }): JSX.Element {
  const { action } = props
  return (
    <article
      className={
        action.selected
          ? `fe-action fe-action--${action.id} fe-action--selected vn-surface-glass`
          : `fe-action fe-action--${action.id} vn-surface-glass`
      }
    >
      <span className={`fe-action__icon fe-action__icon--${action.id}`} aria-hidden />
      <strong>{action.title}</strong>
      <p>{action.description}</p>
    </article>
  )
}

export function FfmpegErrorSceneBackdrop(): JSX.Element {
  return <QuitConfirmProcessingBackdrop />
}

export function FfmpegErrorModal(): JSX.Element {
  return (
    <div className="fe-modal" role="alertdialog" aria-labelledby="fe-modal-title" id="ref22">
      <header className="fe-modal__head">
        <div className="fe-modal__brand">
          <span className="fe-modal__alert" aria-hidden>
            !
          </span>
          <div className="fe-modal__head-main">
            <p className="fe-modal__eyebrow">FFmpeg · error</p>
            <h2 id="fe-modal-title">ОШИБКА FFmpeg</h2>
            <p>Произошла ошибка при запуске FFmpeg</p>
          </div>
        </div>
        <div className="fe-modal__head-tools">
          <span className="fe-modal__head-chip">{FE_MODAL_CHIP}</span>
          <button type="button" className="fe-modal__close" aria-label="Закрыть" disabled>
            ✕
          </button>
        </div>
      </header>
      <p className="fe-modal__summary">{FE_MODAL_SUMMARY}</p>

      <div className="fe-modal__scroll">
        <section className="fe-startup vn-surface-glass" aria-labelledby="fe-startup-title">
          <div className="fe-startup__bar">
            <h3 id="fe-startup-title">ОШИБКА ЗАПУСКА</h3>
            <span className="fe-startup__code">КОД: {FE_ERROR_CODE}</span>
          </div>
          <p className="fe-startup__msg">{FE_STARTUP_MESSAGE}</p>
        </section>

        <div className="fe-columns">
          <section className="fe-panel vn-surface-glass" aria-labelledby="fe-details-title">
            <h3 id="fe-details-title">ДЕТАЛИ</h3>
            <dl className="fe-details">
              {FE_DETAIL_ROWS.map((row) => (
                <div
                  key={row.id}
                  className={
                    'selected' in row && row.selected ? 'fe-details__row--selected' : undefined
                  }
                >
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="fe-panel vn-surface-glass" aria-labelledby="fe-causes-title">
            <h3 id="fe-causes-title">ВОЗМОЖНЫЕ ПРИЧИНЫ</h3>
            <ul className="fe-causes">
              {FE_POSSIBLE_CAUSES.map((cause) => (
                <li key={cause.id}>{cause.text}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="fe-logs" aria-labelledby="fe-logs-title">
          <div className="fe-logs__head">
            <h3 id="fe-logs-title">ЛОГИ (ПОСЛЕДНИЕ 20 СТРОК)</h3>
            <button type="button" className="vn-btn vn-btn--secondary fe-logs__copy" disabled>
              Копировать логи
            </button>
          </div>
          <ul className="fe-logs__list vn-surface-glass">
            {FE_LOG_LINES.map((line) => (
              <li
                key={line.id}
                className={
                  'selected' in line && line.selected ? 'fe-logs__row--selected' : undefined
                }
              >
                <code>{line.text}</code>
              </li>
            ))}
          </ul>
        </section>

        <section className="fe-actions-block" aria-labelledby="fe-actions-title">
          <h3 id="fe-actions-title">ЧТО МОЖНО СДЕЛАТЬ?</h3>
          <div className="fe-actions">
            {FE_ACTIONS.map((action) => (
              <FfmpegErrorActionCard key={action.id} action={action} />
            ))}
          </div>
        </section>
      </div>

      <footer className="fe-modal__foot-sticky">
        <div className="fe-modal__primary-row">
          <button type="button" className="vn-btn vn-btn--primary fe-modal__retry" disabled>
            <span className="fe-glyph fe-glyph--retry" aria-hidden />
            <span>
              <strong>Повторить</strong>
              <em>Запустить снова</em>
            </span>
          </button>
          <button type="button" className="vn-btn vn-btn--secondary fe-modal__engines" disabled>
            <span className="fe-glyph fe-glyph--gear" aria-hidden />
            <span>
              <strong>Настройки движков</strong>
              <em>Открыть пути к ffmpeg</em>
            </span>
          </button>
          <button type="button" className="vn-btn vn-btn--secondary fe-modal__google" disabled>
            <span className="fe-glyph fe-glyph--google" aria-hidden />
            <span>
              <strong>Поиск в Google</strong>
              <em>Искать решение</em>
            </span>
          </button>
          <button type="button" className="vn-btn vn-btn--secondary fe-modal__deepseek" disabled>
            <span className="fe-glyph fe-glyph--deepseek" aria-hidden />
            <span>
              <strong>Поиск в DeepSeek</strong>
              <em>Искать решение с ИИ</em>
            </span>
          </button>
        </div>
        <button type="button" className="fe-modal__dismiss" disabled>
          <span className="fe-glyph fe-glyph--close" aria-hidden />
          Закрыть
        </button>
      </footer>
    </div>
  )
}
