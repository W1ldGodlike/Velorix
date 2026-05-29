import type { JSX } from 'react'

import type { QuitActiveTaskMock, QuitExitOptionMock } from './quit-confirm-ref21-data'
import {
  QC_ACTIVE_TASKS,
  QC_EXIT_OPTIONS,
  QC_MODAL_CHIP,
  QC_MODAL_SUMMARY,
  QC_WARNING
} from './quit-confirm-ref21-data'
import { PROCESSING_NAV } from './processing-ref1-data'

function QuitTaskRow(props: { task: QuitActiveTaskMock }): JSX.Element {
  const { task } = props
  const isRunning = task.status === 'running'
  return (
    <li
      className={
        task.selected ? 'qc-task qc-task--selected vn-surface-glass' : 'qc-task vn-surface-glass'
      }
    >
      <span className={`qc-task__icon qc-task__icon--${task.icon}`} aria-hidden />
      <div className="qc-task__body">
        <strong>{task.title}</strong>
        <span>{task.detail}</span>
      </div>
      <span
        className={
          isRunning
            ? 'qc-task__status qc-task__status--run'
            : 'qc-task__status qc-task__status--wait'
        }
      >
        <em aria-hidden />
        {isRunning ? 'Выполняется' : 'Ожидание'}
      </span>
    </li>
  )
}

function QuitExitOptionCard(props: { option: QuitExitOptionMock }): JSX.Element {
  const { option } = props
  return (
    <label
      className={
        option.checked
          ? `qc-option qc-option--${option.accent} qc-option--checked vn-surface-glass`
          : `qc-option qc-option--${option.accent} vn-surface-glass`
      }
    >
      <span className={`qc-option__icon qc-option__icon--${option.id}`} aria-hidden />
      <strong>{option.title}</strong>
      <p>{option.description}</p>
      <input type="checkbox" defaultChecked={option.checked} disabled readOnly />
    </label>
  )
}

export function QuitConfirmProcessingBackdrop(): JSX.Element {
  return (
    <div className="processing-shell qc-backdrop about-scene__tools" aria-hidden>
      <aside className="processing-sidebar">
        <div className="processing-sidebar__brand">
          <span className="processing-sidebar__mark" aria-hidden>
            V
          </span>
          <div>
            <div className="processing-sidebar__logo vn-text-gradient">VELORIX</div>
            <p className="processing-sidebar__version">v1.7.0</p>
          </div>
        </div>
        <nav className="processing-nav" aria-label="Навигация">
          {PROCESSING_NAV.slice(0, 8).map((item) => (
            <span
              key={item.slug}
              className={
                item.slug === 'processing'
                  ? 'processing-nav__item processing-nav__item--active'
                  : 'processing-nav__item'
              }
            >
              {item.label}
            </span>
          ))}
        </nav>
      </aside>
      <div className="processing-main qc-backdrop__main">
        <div className="qc-backdrop__preview vn-surface-glass" />
        <div className="qc-backdrop__timeline vn-surface-glass" />
        <aside className="qc-backdrop__rail vn-surface-glass" aria-hidden />
      </div>
    </div>
  )
}

export function QuitConfirmModal(): JSX.Element {
  return (
    <div className="qc-modal" role="dialog" aria-labelledby="qc-modal-title" id="ref21">
      <header className="qc-modal__head">
        <div className="qc-modal__brand">
          <span className="processing-sidebar__mark" aria-hidden>
            V
          </span>
          <div className="qc-modal__head-main">
            <p className="qc-modal__eyebrow">Выход · confirm</p>
            <h2 id="qc-modal-title">ЗАКРЫТЬ VELORIX?</h2>
            <p>Вы действительно хотите выйти из приложения?</p>
          </div>
        </div>
        <div className="qc-modal__head-tools">
          <span className="qc-modal__head-chip">{QC_MODAL_CHIP}</span>
          <button type="button" className="qc-modal__close" aria-label="Закрыть" disabled>
            ✕
          </button>
        </div>
      </header>
      <p className="qc-modal__summary">{QC_MODAL_SUMMARY}</p>

      <div className="qc-modal__scroll">
        <section className="qc-section" aria-labelledby="qc-tasks-title">
          <h3 id="qc-tasks-title">АКТИВНЫЕ ЗАДАЧИ</h3>
          <ul className="qc-tasks">
            {QC_ACTIVE_TASKS.map((task) => (
              <QuitTaskRow key={task.id} task={task} />
            ))}
          </ul>
        </section>

        <section className="qc-section" aria-labelledby="qc-options-title">
          <h3 id="qc-options-title">ПРИ ВЫХОДЕ ИЗ ПРИЛОЖЕНИЯ</h3>
          <div className="qc-options">
            {QC_EXIT_OPTIONS.map((option) => (
              <QuitExitOptionCard key={option.id} option={option} />
            ))}
          </div>
        </section>

        <p className="qc-warning vn-surface-glass" role="note">
          <span className="qc-warning__icon" aria-hidden>
            i
          </span>
          {QC_WARNING}
        </p>
      </div>

      <footer className="qc-modal__actions-sticky">
        <button type="button" className="vn-btn vn-btn--ghost qc-modal__cancel" disabled>
          Отмена
        </button>
        <div className="qc-modal__actions">
          <button type="button" className="vn-btn vn-btn--primary" disabled>
            Сохранить проект
          </button>
          <button type="button" className="vn-btn qc-modal__stop" disabled>
            Остановить задачи
          </button>
          <button type="button" className="vn-btn qc-modal__quit" disabled>
            Выйти из Velorix
          </button>
        </div>
      </footer>
    </div>
  )
}
